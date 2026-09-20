/**
 * UniAssist AI — Document Ingestion & Chunking Pipeline
 * Tokenization, heading hierarchy extraction, sliding window chunking with overlap, and metadata tagging.
 */

import { DocumentCategory, DocumentChunk } from '../../types/index.ts';
import { generateFeatureVector } from './vector-math.ts';

export interface ChunkingOptions {
  maxTokens?: number;
  overlapTokens?: number;
  category?: DocumentCategory;
}

/**
 * Approximate token count for text (average 4 chars per token in English)
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.trim().length / 4);
}

/**
 * Split text into semantic chunks respecting headings and paragraph boundaries
 */
export function chunkDocument(
  rawText: string,
  documentId: string,
  category: DocumentCategory = 'GENERAL',
  options: ChunkingOptions = {}
): DocumentChunk[] {
  const maxTokens = options.maxTokens || 220;
  const overlapTokens = options.overlapTokens || 30;

  const normalized = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  // Split by headings or double newlines
  const paragraphs = normalized.split(/\n{2,}/);
  const chunks: DocumentChunk[] = [];
  let currentChunkText = '';
  let currentHeading = 'General Section';
  let chunkIndex = 0;
  let pageNumber = 1;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Detect heading
    const headingMatch = trimmed.match(/^(#{1,4}\s+|[0-9]+\.\s+|Section\s+[0-9]+:?|CLAUSE\s+[0-9]+(\.[0-9]+)?:?)(.+)$/im);
    if (headingMatch) {
      currentHeading = headingMatch[0].replace(/^#+\s*/, '').trim();
    }

    // Detect page markers if any (e.g. "--- Page 3 ---")
    const pageMatch = trimmed.match(/---\s*Page\s*([0-9]+)\s*---/i);
    if (pageMatch) {
      pageNumber = parseInt(pageMatch[1], 10) || pageNumber;
      continue;
    }

    const paraTokens = estimateTokens(trimmed);
    const currentTokens = estimateTokens(currentChunkText);

    if (currentTokens + paraTokens <= maxTokens) {
      currentChunkText += (currentChunkText ? '\n\n' : '') + trimmed;
    } else {
      // Flush current chunk if non-empty
      if (currentChunkText) {
        const tokens = estimateTokens(currentChunkText);
        chunks.push({
          id: `chunk-${documentId}-${chunkIndex}`,
          documentId,
          chunkIndex,
          heading: currentHeading,
          pageNumber,
          category,
          content: currentChunkText,
          tokens,
          embedding: generateFeatureVector(currentChunkText),
        });
        chunkIndex++;

        // Calculate overlap: keep trailing sentences/tokens from previous chunk
        const sentences = currentChunkText.split(/(?<=[.?!])\s+/);
        let overlapText = '';
        for (let i = sentences.length - 1; i >= 0; i--) {
          const candidate = sentences.slice(i).join(' ');
          if (estimateTokens(candidate) <= overlapTokens) {
            overlapText = candidate;
          } else {
            break;
          }
        }
        currentChunkText = overlapText ? overlapText + '\n\n' + trimmed : trimmed;
      } else {
        // Single paragraph larger than maxTokens: split by sentences
        const sentences = trimmed.split(/(?<=[.?!])\s+/);
        let subChunk = '';
        for (const sentence of sentences) {
          if (estimateTokens(subChunk + ' ' + sentence) <= maxTokens) {
            subChunk += (subChunk ? ' ' : '') + sentence;
          } else {
            if (subChunk) {
              chunks.push({
                id: `chunk-${documentId}-${chunkIndex}`,
                documentId,
                chunkIndex,
                heading: currentHeading,
                pageNumber,
                category,
                content: subChunk,
                tokens: estimateTokens(subChunk),
                embedding: generateFeatureVector(subChunk),
              });
              chunkIndex++;
            }
            subChunk = sentence;
          }
        }
        currentChunkText = subChunk;
      }
    }
  }

  // Flush remaining text
  if (currentChunkText.trim()) {
    chunks.push({
      id: `chunk-${documentId}-${chunkIndex}`,
      documentId,
      chunkIndex,
      heading: currentHeading,
      pageNumber,
      category,
      content: currentChunkText.trim(),
      tokens: estimateTokens(currentChunkText),
      embedding: generateFeatureVector(currentChunkText),
    });
  }

  return chunks;
}
