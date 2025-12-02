// src/server/api/routers/chatbot.test.ts
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { jest } from "@jest/globals";

// Mock external services
jest.mock("~/server/services/embedding", () => ({ 
  EmbeddingModel: jest.fn().mockImplementation(() => ({
    generateEmbedding: jest.fn(async (text: string) => {
      // Return a dummy embedding for testing
      return [0.1, 0.2, 0.3];
    }),
  })),
}));

// Define a default mock implementation for PineconeService
const mockQueryVectors = jest.fn(async (vector: number[], topK: number) => {
  // Default: Return dummy relevant chunks for testing with metadata
  return [
    { id: "chunk1", score: 0.9, metadata: { text: "Relevant chunk 1 about the deadline.", documentName: "Syllabus", pageNumber: 3, url: "http://example.com/syllabus.pdf" } },
    { id: "chunk2", score: 0.8, metadata: { text: "Another relevant chunk discussing assignments.", documentName: "Assignments", pageNumber: 1, url: "http://example.com/assignments.pdf" } },
  ];
});

jest.mock("~/server/services/pinecone", () => ({ 
  PineconeService: jest.fn().mockImplementation(() => ({
    initializeIndex: jest.fn(async () => { }),
    queryVectors: mockQueryVectors,
  })),
}));

jest.mock("~/server/services/llm", () => ({ 
  LLMClient: jest.fn().mockImplementation(() => ({
    generateResponse: jest.fn(async (prompt: string) => {
      // Return a dummy LLM response with citations
      return "The deadline for Assignment 3 is November 15th. Source: Syllabus, Page 3 (http://example.com/syllabus.pdf)\nSource: Assignments, Page 1 (http://example.com/assignments.pdf)";
    }),
  })),
}));

// Mock the Prisma client for database interactions
const mockPrismaFindUnique = jest.fn();
jest.mock("~/server/db", () => ({
  db: {
    teacherContactInfo: {
      findUnique: mockPrismaFindUnique,
    },
    // Mock other Prisma models if needed by other tests
  },
}));

describe("chatbotRouter", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(async () => {
    // Create a tRPC caller for testing
    caller = appRouter.createCaller(await createTRPCContext({ headers: new Headers() }));
  });

  it("should successfully query the chatbot and return a response", async () => {
    const message = "What is the deadline for Assignment 3?";
    const response = await caller.chatbot.queryChatbot({ message });

    expect(response).toEqual({ response: "This is a generated answer based on your question and context." });

    // Verify that the mocked services were called
    const { EmbeddingModel } = await import("~/server/services/embedding");
    const { PineconeService } = await import("~/server/services/pinecone");
    const { LLMClient } = await import("~/server/services/llm");

    expect(EmbeddingModel).toHaveBeenCalledTimes(1);
    expect(EmbeddingModel.mock.results[0].value.generateEmbedding).toHaveBeenCalledWith(message);

    expect(PineconeService).toHaveBeenCalledTimes(1);
    expect(PineconeService.mock.results[0].value.initializeIndex).toHaveBeenCalledTimes(1);
    expect(PineconeService.mock.results[0].value.queryVectors).toHaveBeenCalledWith([0.1, 0.2, 0.3]);

    expect(LLMClient).toHaveBeenCalledTimes(1);
    const expectedPrompt = expect.stringContaining("What is the deadline for Assignment 3?");
    expect(LLMClient.mock.results[0].value.generateResponse).toHaveBeenCalledWith(expectedPrompt);
  });

  it("should handle conversation history correctly", async () => {
    const message = "What about Assignment 2?";
    const conversationHistory = [
      { sender: "user", text: "What is the deadline for Assignment 3?" },
      { sender: "bot", text: "The deadline for Assignment 3 is Nov 20." },
    ];
    const response = await caller.chatbot.queryChatbot({ message, conversationHistory });

    expect(response).toEqual({ response: "This is a generated answer based on your question and context." });

    const { EmbeddingModel } = await import("~/server/services/embedding");
    const { LLMClient } = await import("~/server/services/llm");

    expect(EmbeddingModel.mock.results[0].value.generateEmbedding).toHaveBeenCalledWith(message);
    const expectedPrompt = expect.stringContaining("Conversation History:\nuser: What is the deadline for Assignment 3?\nbot: The deadline for Assignment 3 is Nov 20.\n");
    expect(LLMClient.mock.results[0].value.generateResponse).toHaveBeenCalledWith(expectedPrompt);
  });

  it("should return teacher contact info when confidence is low", async () => {
    // Mock Pinecone to return a low confidence score
    mockQueryVectors.mockReturnValueOnce([
      { id: "chunk_low_conf", score: 0.5, metadata: { text: "Some irrelevant text." } },
    ]);

    // Mock Prisma to return teacher contact information
    mockPrismaFindUnique.mockResolvedValueOnce({
      courseId: "course123",
      contactMethod: "Email",
      contactDetails: "teacher@school.edu",
    });

    const message = "When is the exam?";
    const courseId = "course123";
    const response = await caller.chatbot.queryChatbot({ message, courseId });

    expect(response.answer).toContain("I can't answer that question based on the information I have. Please contact your teacher for further assistance. You can reach them via Email: teacher@school.edu.");
    expect(response.sources).toEqual([]);
    expect(response.teacherContactInfo).toEqual({
      method: "Email",
      details: "teacher@school.edu",
    });
    expect(response.confidenceScore).toBe(0.5);
  });
});
