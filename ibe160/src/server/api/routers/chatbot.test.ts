import { jest } from '@jest/globals';
import { appRouter } from '~/server/api/root';
import { createCallerFactory } from '~/server/api/trpc';
import { languageService } from '~/server/services/language';
import { embeddingService } from '~/server/services/embedding';
import { pineconeService } from '~/server/services/pinecone';
import { mockChatCreate } from 'openai';

// Mock the new dependencies
jest.mock('~/server/services/language');
jest.mock('~/server/services/embedding');
jest.mock('~/server/services/pinecone');
jest.mock('openai');

const createCaller = createCallerFactory(appRouter);

describe('chatbotRouter.queryChatbot', () => {
  let caller: ReturnType<typeof createCaller>;
  let mockDetectLanguage: jest.Mock;
  let mockGenerateEmbedding: jest.Mock;
  let mockFindMostRelevantContext: jest.Mock;

  beforeEach(() => {
    caller = createCaller({ session: null, db: {} as any });

    // Mock service implementations
    mockDetectLanguage = jest.fn();
    (languageService as any).detectLanguage = mockDetectLanguage;

    mockGenerateEmbedding = jest.fn();
    (embeddingService as any).generateEmbedding = mockGenerateEmbedding;

    mockFindMostRelevantContext = jest.fn();
    (pineconeService as any).findMostRelevantContext = mockFindMostRelevantContext;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle a mixed-language query by executing the full RAG flow', async () => {
    // Arrange
    const testMessage = 'Hva er dependency injection?';
    const detectedLanguage = 'nno'; // Nynorsk Norwegian (example)
    const mockEmbedding = [0.1, 0.2, 0.3];
    const mockContext = `Retrieved Document: "Lecture Notes Week 4"
Content: "Dependency Injection (DI) is a design pattern used to implement inversion of control."`;
    const expectedResponse = 'Dependency injection er et designmønster...';

    mockDetectLanguage.mockResolvedValue(detectedLanguage);
    mockGenerateEmbedding.mockResolvedValue(mockEmbedding);
    mockFindMostRelevantContext.mockResolvedValue(mockContext);
    mockChatCreate.mockResolvedValue({
      choices: [{ message: { content: expectedResponse } }],
    });

    const expectedSystemPrompt = `You are a helpful assistant for the IBE160 course.
Answer the user's question based on the following context.
Please respond to the user in the same language they used, which has been detected as: ${detectedLanguage}.

Context:
---
${mockContext}
---
`;

    // Act
    const result = await caller.chatbot.queryChatbot({ message: testMessage });

    // Assert
    // Verify the full RAG flow was executed
    expect(mockDetectLanguage).toHaveBeenCalledWith(testMessage);
    expect(mockGenerateEmbedding).toHaveBeenCalledWith(testMessage);
    expect(mockFindMostRelevantContext).toHaveBeenCalledWith(mockEmbedding);
    
    // Verify the LLM was called with the context-rich prompt
    expect(mockChatCreate).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: expectedSystemPrompt },
        { role: 'user', content: testMessage },
      ],
    });

    // Verify the final answer
    expect(result.answer).toBe(expectedResponse);
  });

  it('should handle undetermined language gracefully', async () => {
    // Arrange
    const testMessage = '12345';
    const detectedLanguage = 'und';
    mockDetectLanguage.mockResolvedValue(detectedLanguage);
    mockGenerateEmbedding.mockResolvedValue([0.4, 0.5, 0.6]);
    mockFindMostRelevantContext.mockResolvedValue("No relevant context found.");
    mockChatCreate.mockResolvedValue({
      choices: [{ message: { content: 'I am sorry, I cannot understand the question.' } }],
    });
    
    // Act
    await caller.chatbot.queryChatbot({ message: testMessage });

    // Assert
    // Check that the system prompt includes the 'und' language code
    expect(mockChatCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining(`detected as: ${detectedLanguage}`),
          }),
        ]),
      })
    );
  });
});
