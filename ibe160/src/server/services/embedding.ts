import OpenAI from 'openai';
import { env } from '~/env';

/**
 * A service class for generating text embeddings using OpenAI.
 */
export class EmbeddingService {
  private openai: OpenAI | null = null;
  private readonly model = 'text-embedding-ada-002';

  private getClient(): OpenAI {
    if (!this.openai) {
      if (!env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set in environment variables.');
      }
      this.openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });
    }
    return this.openai;
  }

  /**
   * Generates an embedding for a given text.
   * The text-embedding-ada-002 model is multilingual and can handle mixed-language queries.
   * @param text The text to generate an embedding for.
   * @returns A promise that resolves to the embedding vector.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const client = this.getClient();
      const response = await client.embeddings.create({
        model: this.model,
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding.');
    }
  }
}

export const embeddingService = new EmbeddingService();