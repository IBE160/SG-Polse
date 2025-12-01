import OpenAI from 'openai';

export class EmbeddingModel {
  private openai: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is not provided.');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!text) {
      return [];
    }

    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002', // Or another suitable model
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding.');
    }
  }
}
