// ibe160/src/__mocks__/openai.ts
import { jest } from '@jest/globals';

const mockOpenAI = jest.fn(() => ({
  embeddings: {
    create: jest.fn(() => Promise.resolve({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    })),
  },
}));

export default mockOpenAI;