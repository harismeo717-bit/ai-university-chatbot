/**
 * UniAssist AI — AI Provider Factory
 * Dynamically instantiates the configured LLM provider (Gemini or Fallback).
 */

import { GeminiProvider } from './gemini-provider.ts';
import { FallbackProvider } from './fallback-provider.ts';
import { AIProvider } from './provider.ts';

let activeProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (activeProvider) {
    return activeProvider;
  }

  const requested = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY;

  if (requested === 'gemini' && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    activeProvider = new GeminiProvider();
  } else {
    // Fallback if key not set or requested
    activeProvider = new FallbackProvider();
  }

  return activeProvider;
}

export function setAIProvider(provider: AIProvider): void {
  activeProvider = provider;
}
