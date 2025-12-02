// src/server/services/embedding.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "~/env";

export class EmbeddingModel {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Access your API key as an environment variable (see https://nextjs.org/docs/basic-features/environment-variables)
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }
}