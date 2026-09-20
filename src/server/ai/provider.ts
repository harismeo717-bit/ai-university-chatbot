/**
 * UniAssist AI — AI Provider Abstraction Interface
 * Decouples the application from specific LLM vendors (Google GenAI Gemini, Anthropic, OpenAI, or local Fallback).
 */

export interface AICompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
}

export interface AIProvider {
  name: string;
  generateText(prompt: string, options?: AICompletionOptions): Promise<string>;
  generateStream(
    prompt: string,
    options: AICompletionOptions,
    onChunk: (text: string) => void
  ): Promise<string>;
  generateEmbedding?(text: string): Promise<number[]>;
}
