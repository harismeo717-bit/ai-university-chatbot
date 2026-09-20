/**
 * UniAssist AI — Google GenAI Gemini Provider
 * Modern @google/genai SDK implementation with streaming, embeddings, and error resilience.
 */

import { GoogleGenAI } from '@google/genai';
import { AICompletionOptions, AIProvider } from './provider.ts';

export class GeminiProvider implements AIProvider {
  name = 'gemini';
  private client: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI | null {
    if (!this.client) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        this.client = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }
    }
    return this.client;
  }

  async generateText(prompt: string, options: AICompletionOptions = {}): Promise<string> {
    const client = this.getClient();
    if (!client) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const modelName = options.model || 'gemini-3.8-flash';
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: options.systemInstruction,
        temperature: options.temperature ?? 0.2,
      },
    });

    return response.text || '';
  }

  async generateStream(
    prompt: string,
    options: AICompletionOptions = {},
    onChunk: (text: string) => void
  ): Promise<string> {
    const client = this.getClient();
    if (!client) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const modelName = options.model || 'gemini-3.8-flash';
    const responseStream = await client.models.generateContentStream({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: options.systemInstruction,
        temperature: options.temperature ?? 0.2,
      },
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      const text = chunk.text || '';
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }

    return fullText;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const client = this.getClient();
    if (!client) {
      return [];
    }

    try {
      const result = await client.models.embedContent({
        model: 'gemini-embedding-2-preview',
        contents: [text],
      });
      // Handle both singular embedding and embeddings array in EmbedContentResponse
      const resAny = result as any;
      const values = resAny.embedding?.values || resAny.embeddings?.[0]?.values || [];
      return values;
    } catch (err) {
      console.warn('Gemini embedding failed, falling back to internal feature vector:', err);
      return [];
    }
  }
}
