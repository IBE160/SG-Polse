// ibe160/__mocks__/openai.ts
import { jest } from '@jest/globals';

// Create the mock functions that will be used in tests
export const mockChatCreate = jest.fn();
export const mockEmbeddingsCreate = jest.fn();

const mockOpenAI = {
  chat: {
    completions: {
      create: mockChatCreate,
    },
  },
  embeddings: {
    create: mockEmbeddingsCreate,
  },
};

// The default export is the constructor mock
export default jest.fn().mockImplementation(() => mockOpenAI);