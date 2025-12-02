import { z } from "zod";
import OpenAI from 'openai';

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { languageService } from "~/server/services/language";
import { embeddingService } from "~/server/services/embedding";
import { pineconeService } from "~/server/services/pinecone";
import { env } from "~/env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const chatbotRouter = createTRPCRouter({
  queryChatbot: publicProcedure
    .input(
      z.object({
        message: z.string(),
        conversationHistory: z.array(z.object({ 
            sender: z.enum(['user', 'bot']), 
            text: z.string() 
        })).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { message } = input;

      // 1. Detect the language of the user's query
      const detectedLanguage = await languageService.detectLanguage(message);

      // 2. Generate an embedding for the user's query using a multilingual model
      const embedding = await embeddingService.generateEmbedding(message);

      // 3. Find relevant context from the vector database
      const context = await pineconeService.findMostRelevantContext(embedding);

      // 4. Construct the prompt for the LLM, including the retrieved context
      const systemPrompt = `You are a helpful assistant for the IBE160 course.
Answer the user's question based on the following context.
Please respond to the user in the same language they used, which has been detected as: ${detectedLanguage}.

Context:
---
${context}
---
`;

      // 5. Call the LLM
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Or another suitable model
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        });

        const answer = response.choices[0]?.message?.content ?? "Sorry, I could not generate a response.";

        return {
          answer,
          sources: [], // Placeholder for actual sources from RAG
        };
      } catch (error) {
        console.error('Error calling OpenAI:', error);
        throw new Error('Failed to get a response from the chatbot.');
      }
    }),
});
