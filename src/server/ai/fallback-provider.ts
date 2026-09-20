/**
 * UniAssist AI — Fallback Grounded AI Provider
 * Provides robust synthesis and streaming from grounded RAG context when external LLM is offline.
 */

import { AICompletionOptions, AIProvider } from './provider.ts';

export class FallbackProvider implements AIProvider {
  name = 'fallback';

  async generateText(prompt: string, options: AICompletionOptions = {}): Promise<string> {
    return this.synthesizeGroundedResponse(prompt);
  }

  async generateStream(
    prompt: string,
    options: AICompletionOptions = {},
    onChunk: (text: string) => void
  ): Promise<string> {
    const fullText = this.synthesizeGroundedResponse(prompt);
    // Stream in words with natural delay
    const words = fullText.split(' ');
    for (let i = 0; i < words.length; i++) {
      const piece = (i === 0 ? '' : ' ') + words[i];
      onChunk(piece);
      await new Promise((res) => setTimeout(res, 20));
    }
    return fullText;
  }

  private synthesizeGroundedResponse(prompt: string): string {
    // Extract knowledge context from prompt
    const contextMatch = prompt.match(/=== UNIVERSITY KNOWLEDGE CONTEXT ===([\s\S]*?)=== END CONTEXT ===/);
    if (!contextMatch || !contextMatch[1] || contextMatch[1].trim().length === 0) {
      return `I couldn't find verified information about this in the university knowledge base.

To ensure accuracy regarding official policies, requirements, or deadlines, please contact the relevant department:
- **Admissions Office:** admissions@university.edu (Turing Hall, Ground Floor)
- **Student Accounts:** accounts@university.edu
- **Examinations Controller:** exams@university.edu`;
    }

    const contextText = contextMatch[1].trim();
    return `Based on the official University Knowledge Base:\n\n${contextText}\n\n*If you require further departmental verification, please visit the designated student services center.*`;
  }
}
