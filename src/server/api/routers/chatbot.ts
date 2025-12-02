// src/server/api/routers/chatbot.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { EmbeddingModel } from "~/server/services/embedding";
import { PineconeService } from "~/server/services/pinecone";
import { env } from "~/env";
import { generateAnswerPrompt } from "~/server/prompts/answerGenerationPrompt";
import { LLMClient } from "~/server/services/llm"; // Import LLMClient
import { type ChatMessage, type ChatbotResponse } from "~/lib/types/chat"; // Import ChatMessage and ChatbotResponse types
import { TeacherContactService } from "~/server/services/teacherContactService"; // Import TeacherContactService

// Define a confidence threshold for Pinecone results
// TODO: Make this configurable via the database (e.g., TeacherContactInfo model)
const CONFIDENCE_THRESHOLD = 0.75; // Example threshold, can be tuned

const embeddingModel = new EmbeddingModel();
const pineconeService = new PineconeService(
  env.PINECONE_API_KEY,
  env.PINECONE_ENVIRONMENT,
  env.PINECONE_INDEX_NAME
);
const llmClient = new LLMClient(); // Instantiate LLMClient
const teacherContactService = new TeacherContactService(); // Instantiate TeacherContactService

// Initialize Pinecone index once
void pineconeService.initializeIndex().catch(e => console.error("Failed to initialize Pinecone index:", e));

export const chatbotRouter = createTRPCRouter({
  queryChatbot: publicProcedure
    .input(z.object({
      message: z.string(),
      conversationHistory: z.array(z.object({
        sender: z.enum(["user", "bot"]),
        text: z.string(),
      })).optional(),
      courseId: z.string(), // Add courseId to the input
    }))
    .query(async ({ ctx, input }) => {
      const userEmbedding = await embeddingModel.generateEmbedding(input.message);
      const relevantChunks = await pineconeService.queryVectors(userEmbedding);

      // Check if relevant chunks are found and if the top result meets the confidence threshold
      if (relevantChunks.length === 0 || relevantChunks[0].score < CONFIDENCE_THRESHOLD) {
        const teacherContactInfo = await teacherContactService.getTeacherContactInfo(input.courseId);

        let teacherContactMessage = "I can't answer that question based on the information I have. Please contact your teacher for further assistance.";
        let contactMethod = "N/A";
        let contactDetails = "N/A";

        if (teacherContactInfo) {
          teacherContactMessage += ` You can reach them via ${teacherContactInfo.contactMethod}: ${teacherContactInfo.contactDetails}.`;
          contactMethod = teacherContactInfo.contactMethod;
          contactDetails = teacherContactInfo.contactDetails;
        } else {
          teacherContactMessage += " No specific contact information is available at this moment.";
        }

        return {
          answer: teacherContactMessage,
          sources: [],
          teacherContactInfo: {
            method: contactMethod,
            details: contactDetails,
          },
          confidenceScore: relevantChunks.length > 0 ? relevantChunks[0].score : 0,
        } as ChatbotResponse;
      }

      const llmPrompt = generateAnswerPrompt(
        input.message,
        relevantChunks, // Pass relevantChunks directly
        input.conversationHistory || []
      );

      const llmResponse = await llmClient.generateResponse(llmPrompt); // Generate response with LLM

      // Parse LLM response to extract answer and sources
      const sourceRegex = /Source: (.*?)(, Page (\d+))?(\s+\((https?:\/\/[^\)]+)\))?$/gm;
      let match;
      const sources: ChatMessage['sources'] = [];
      let answer = llmResponse; // Assume full response is answer, then trim sources

      const lines = llmResponse.split('\n').reverse(); // Process from bottom up to find sources

      for (const line of lines) {
        match = sourceRegex.exec(line);
        if (match) {
          const documentName = match[1].trim();
          const pageNumber = match[3] ? parseInt(match[3]) : undefined;
          const url = match[5];
          sources.unshift({ documentName, pageNumber, url }); // Add to beginning to maintain order
          answer = answer.replace(line, '').trim(); // Remove source line from answer
        } else {
          // Stop if a non-source line is encountered (assuming sources are at the end)
          break;
        }
      }

      // 5. Return the answer and sources
      console.log("User embedding:", userEmbedding);
      console.log("Relevant chunks:", relevantChunks);
      console.log("LLM Prompt:", llmPrompt);
      console.log("LLM Response:", llmResponse);
      return {
        answer: answer.trim(),
        sources,
        confidenceScore: relevantChunks[0].score,
      } as ChatbotResponse;
    }),
});
