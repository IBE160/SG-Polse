// src/server/services/llm.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "~/env";

export class LLMClient {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  async generateResponse(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" }); // Using gemini-pro for text generation
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  }
}
