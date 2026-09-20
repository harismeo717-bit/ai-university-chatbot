/**
 * UniAssist AI — Central RAG Orchestration Engine
 * Coordinates context resolution, semantic vector retrieval, BM25 scoring,
 * strict anti-hallucination thresholding, and grounded citation generation.
 */

import { dbStore } from '../db/store.ts';
import { getAIProvider } from '../ai/factory.ts';
import {
  computeHybridScore,
  generateFeatureVector,
  tokenize,
} from './vector-math.ts';
import {
  sanitizeAndInspectInput,
  buildCitations,
  UNAVAILABLE_KNOWLEDGE_FALLBACK,
} from './anti-hallucination.ts';
import { ChatMessage, Citation, DocumentChunk, RoleType, UniversityDocument } from '../../types/index.ts';

export interface RAGQueryOptions {
  conversationHistory?: ChatMessage[];
  userRole?: RoleType;
  departmentFilter?: string;
  streamingCallback?: (token: string) => void;
}

export interface RAGResponse {
  answer: string;
  isGrounded: boolean;
  confidence: number;
  citations: Citation[];
}

export class RAGEngine {
  /**
   * Resolve multi-turn context (e.g. "What about the fee?" following "BS Computer Science")
   */
  private resolveQueryContext(query: string, history: ChatMessage[] = []): string {
    const trimmed = query.trim();
    if (history.length === 0) return trimmed;

    // Check if query is an elliptical follow-up
    const isShortFollowUp = trimmed.length < 35 && /^(what about|and the|how about|tell me about the|fee|eligibility|requirements|deadline|hod|head)/i.test(trimmed);

    if (isShortFollowUp) {
      // Find latest user topic from last 2 user messages
      const previousUserMsgs = history.filter((m) => m.role === 'user').slice(-2);
      const combinedPrev = previousUserMsgs.map((m) => m.content).join(' ');

      let contextSubject = '';
      if (/bscs|computer science/i.test(combinedPrev)) {
        contextSubject = 'BS Computer Science BSCS';
      } else if (/hostel|room/i.test(combinedPrev)) {
        contextSubject = 'Hostel accommodation and residential rules';
      } else if (/scholarship|financial aid/i.test(combinedPrev)) {
        contextSubject = 'Merit and need-based scholarships';
      } else if (/exam|attendance/i.test(combinedPrev)) {
        contextSubject = 'Examinations 75% attendance rule';
      }

      if (contextSubject) {
        return `${trimmed} regarding ${contextSubject}`;
      }
    }

    return trimmed;
  }

  /**
   * Main query execution method with full RAG pipeline
   */
  async answerQuery(query: string, options: RAGQueryOptions = {}): Promise<RAGResponse> {
    const aiConfig = dbStore.getAIConfig();

    // 1. Prompt injection & security defense check
    const sanitization = sanitizeAndInspectInput(query);
    if (sanitization.isSuspicious) {
      const rejection = sanitization.rejectionReason || 'Unauthorized prompt override attempt detected.';
      if (options.streamingCallback) {
        options.streamingCallback(rejection);
      }
      return {
        answer: rejection,
        isGrounded: false,
        confidence: 0,
        citations: [],
      };
    }

    // 2. Context resolution with conversation memory
    const contextualQuery = this.resolveQueryContext(sanitization.sanitizedQuery, options.conversationHistory);

    // 3. Vector embedding for query
    const queryVector = generateFeatureVector(contextualQuery);

    // 4. Retrieve candidate chunks from knowledge store
    const allChunks = dbStore.getAllChunks();
    const documentsList = dbStore.getDocuments();
    const docMap = new Map<string, UniversityDocument>();
    documentsList.forEach((d) => docMap.set(d.id, d));

    const scoredChunks: (DocumentChunk & { relevanceScore: number })[] = [];

    for (const chunk of allChunks) {
      // Check document access level against user role
      const parentDoc = docMap.get(chunk.documentId);
      if (parentDoc && parentDoc.accessLevel === 'ADMIN' && options.userRole !== 'ADMIN' && options.userRole !== 'SUPER_ADMIN') {
        continue;
      }

      const chunkVector = chunk.embedding || generateFeatureVector(chunk.content);
      const score = computeHybridScore(contextualQuery, chunk.content, queryVector, chunkVector, 0.6);

      // Add category relevance boost
      let finalScore = score;
      const qTokens = tokenize(contextualQuery);
      if (qTokens.some((t) => chunk.category.toLowerCase().includes(t))) {
        finalScore = Math.min(1.0, finalScore + 0.1);
      }

      scoredChunks.push({
        ...chunk,
        relevanceScore: finalScore,
      });
    }

    // Sort by relevance descending
    scoredChunks.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Top K candidates
    const topCandidates = scoredChunks.slice(0, aiConfig.topKRetrieval);
    const bestScore = topCandidates.length > 0 ? topCandidates[0].relevanceScore : 0;

    // 5. Anti-Hallucination Threshold Verification
    if (bestScore < aiConfig.similarityThreshold || topCandidates.length === 0) {
      dbStore.recordUnanswered(query, 'GENERAL');

      if (options.streamingCallback) {
        const words = UNAVAILABLE_KNOWLEDGE_FALLBACK.split(' ');
        for (let i = 0; i < words.length; i++) {
          options.streamingCallback((i === 0 ? '' : ' ') + words[i]);
          await new Promise((r) => setTimeout(r, 12));
        }
      }

      return {
        answer: UNAVAILABLE_KNOWLEDGE_FALLBACK,
        isGrounded: false,
        confidence: bestScore,
        citations: [],
      };
    }

    // 6. Filter only high-relevance chunks
    const relevantChunks = topCandidates.filter((c) => c.relevanceScore >= aiConfig.similarityThreshold - 0.08);
    const citations = buildCitations(relevantChunks, docMap);

    // 7. Assemble Grounded Prompt with strictly partitioned context
    const contextBody = relevantChunks
      .map((c, idx) => {
        const doc = docMap.get(c.documentId);
        const title = doc ? doc.title : 'University Knowledge Source';
        return `[SOURCE ${idx + 1}: "${title}", Section: ${c.heading || 'General'}, Page: ${c.pageNumber || 1}, Version: ${doc?.version || '1.0'}]\n${c.content}`;
      })
      .join('\n\n---\n\n');

    const groundedPrompt = `=== UNIVERSITY KNOWLEDGE CONTEXT ===
${contextBody}
=== END CONTEXT ===

=== USER INQUIRY ===
${sanitization.sanitizedQuery}

Provide a comprehensive, accurate, and cleanly structured response. Format key points, numbers, and deadlines clearly using Markdown tables, bullet points, and bold text where helpful. Directly cite the document name and section for the provided facts. If any specific detail asked by the user is not found in the context above, state that clearly instead of speculating.`;

    // 8. Generate answer using AI Provider
    const provider = getAIProvider();
    let answerText = '';

    if (options.streamingCallback) {
      try {
        answerText = await provider.generateStream(
          groundedPrompt,
          {
            model: aiConfig.model,
            temperature: aiConfig.temperature,
            maxTokens: aiConfig.maxTokens,
            systemInstruction: aiConfig.systemPrompt,
          },
          options.streamingCallback
        );
      } catch (err) {
        console.warn('Streaming failed via provider, falling back to local synthesis:', err);
        const words = contextBody.split(' ');
        for (let i = 0; i < Math.min(words.length, 120); i++) {
          const w = (i === 0 ? '' : ' ') + words[i];
          answerText += w;
          options.streamingCallback(w);
          await new Promise((r) => setTimeout(r, 15));
        }
      }
    } else {
      answerText = await provider.generateText(groundedPrompt, {
        model: aiConfig.model,
        temperature: aiConfig.temperature,
        maxTokens: aiConfig.maxTokens,
        systemInstruction: aiConfig.systemPrompt,
      });
    }

    return {
      answer: answerText,
      isGrounded: true,
      confidence: Math.round(bestScore * 100) / 100,
      citations,
    };
  }
}

export const ragEngine = new RAGEngine();
