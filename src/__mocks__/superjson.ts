// src/__mocks__/superjson.ts

// Mock for superjson
// Provides a passthrough for serialize/deserialize in tests, or simple mocks for specific functions.
const SuperJSON = {
  serialize: jest.fn((obj) => obj),
  deserialize: jest.fn((obj) => obj),
  // Add other superjson methods if they are used and need specific mocking
  // For example, if you use a specific transform, you might want to mock that too.
};

module.exports = SuperJSON;
