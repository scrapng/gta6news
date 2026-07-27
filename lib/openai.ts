import OpenAI from 'openai';

// Fall back to a placeholder at build time so module evaluation doesn't throw
// when OPENAI_API_KEY isn't present (e.g. during `next build`). Actual API
// calls will fail clearly at runtime if the real key is missing.
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-build-placeholder',
});

export const MODEL = 'gpt-5';
