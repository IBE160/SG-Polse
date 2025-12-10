import { z } from "zod";
import OpenAI from 'openai';
import { TRPCError } from "@trpc/server";

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
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        conversationHistory: z.array(z.object({ 
            sender: z.enum(['user', 'bot']), 
            text: z.string() 
        })).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log('Entered sendMessage mutation with input:', input);

      try {
        const { message } = input;

        // 1. Detect the language of the user's query
        const detectedLanguage = await languageService.detectLanguage(message);
        console.log('Detected Language:', detectedLanguage);

        // 2. Generate an embedding for the user's query using a multilingual model
        const embedding = await embeddingService.generateEmbedding(message);

        // 3. Find relevant context from the vector database
        const context = await pineconeService.findMostRelevantContext(embedding);
        console.log('Pinecone Context:', context);

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
        console.error('Error in sendMessage mutation:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get a response from the chatbot.',
          cause: error,
        });
      }
    }),
});
