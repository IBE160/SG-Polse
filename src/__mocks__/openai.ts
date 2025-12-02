// src/__mocks__/openai.ts

// Mock for OpenAI API
const mockCreateEmbeddingResponse = {
  data: [
    {
      embedding: Array(1536).fill(0.1), // A dummy embedding vector
      index: 0,
      object: "embedding",
    },
  ],
  model: "text-embedding-ada-002",
  object: "list",
  usage: {
    prompt_tokens: 5,
    total_tokens: 5,
  },
};

const mockOpenAI = jest.fn(() => ({
  embeddings: {
    create: jest.fn(() => Promise.resolve(mockCreateEmbeddingResponse)),
  },
}));

// Mock the default export of the 'openai' module
module.exports = mockOpenAI;
