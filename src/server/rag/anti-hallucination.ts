/**
 * UniAssist AI — Anti-Hallucination & Prompt Injection Defense Guardrails
 * Strict sanitization, adversarial jailbreak rejection, knowledge boundary enforcement,
 * and citation mapping.
 */

import { Citation, DocumentChunk, UniversityDocument } from '../../types/index.ts';

// Known prompt injection patterns and jailbreak attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(system|safety|university)\s+(rules|guidelines)/i,
  /you\s+are\s+now\s+(DAN|unrestricted|jailbroken|godmode|developer\s+mode)/i,
  /reveal\s+(your\s+)?(system\s+prompt|instructions|secret\s+key|api\s+key)/i,
  /what\s+is\s+your\s+(hidden\s+)?(system\s+prompt|prompt|instructions)/i,
  /print\s+(the\s+)?(initial|system)\s+prompt/i,
  /override\s+system\s+directive/i,
  /pretend\s+you\s+have\s+no\s+rules/i,
  /repeat\s+(everything|the\s+text)\s+above/i,
];

export interface SanitizationResult {
  isSuspicious: boolean;
  sanitizedQuery: string;
  rejectionReason?: string;
}

/**
 * Scan user input for prompt injection, jailbreak attempts, or system prompt extraction
 */
export function sanitizeAndInspectInput(input: string): SanitizationResult {
  if (!input || typeof input !== 'string') {
    return { isSuspicious: false, sanitizedQuery: '' };
  }

  const trimmed = input.trim();

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSuspicious: true,
        sanitizedQuery: trimmed,
        rejectionReason:
          'UniAssist AI Security Notice: Your prompt contains unauthorized directive-override or system-inspection commands. I can only assist with verified university policies, academics, admissions, and campus services.',
      };
    }
  }

  // Remove potential markdown script/injection escapes
  const sanitized = trimmed
    .replace(/```(javascript|bash|sh|cmd|powershell)?[\s\S]*?```/gi, (match) => {
      // Allow benign code queries but strip executable pseudo-commands if targeted at system
      if (/rm\s+-rf|process\.env|api_key|system_prompt/i.test(match)) {
        return '[Code block removed for security compliance]';
      }
      return match;
    });

  return {
    isSuspicious: false,
    sanitizedQuery: sanitized,
  };
}

/**
 * Build clean, authoritative citation records from retrieved chunks
 */
export function buildCitations(
  chunks: (DocumentChunk & { relevanceScore: number })[],
  documents: Map<string, UniversityDocument>
): Citation[] {
  return chunks.map((chunk) => {
    const doc = documents.get(chunk.documentId);
    return {
      id: `cite-${chunk.id}`,
      documentId: chunk.documentId,
      documentTitle: doc ? doc.title : 'University Academic Regulations',
      category: chunk.category,
      pageNumber: chunk.pageNumber,
      section: chunk.heading,
      relevanceScore: Math.round(chunk.relevanceScore * 100) / 100,
      version: doc ? doc.version : '1.0',
      academicYear: doc ? doc.academicYear : '2026-2027',
      excerpt: chunk.content.length > 280 ? chunk.content.slice(0, 277) + '...' : chunk.content,
    };
  });
}

/**
 * Standard university fallback when no verified documents match the user query
 */
export const UNAVAILABLE_KNOWLEDGE_FALLBACK = `I couldn't find verified information about this in the university knowledge base.

To ensure accuracy and prevent incorrect information regarding official academic rules, fee payments, or departmental decisions, please reach out directly to the relevant campus authority:

- **Admissions Inquiries:** admissions@university.edu | Turing Hall, Ground Floor
- **Fees & Accounts:** accounts@university.edu | Administration Wing, Counter 3
- **Examination Office:** exams@university.edu | Block C, Room 102
- **Student Affairs & Hostels:** provost@university.edu | Student Center`;
