// src/__mocks__/mammoth.ts

// Mock for mammoth library
const mockExtractRawTextResult = {
  value: "Mocked DOCX content",
  messages: [],
};

const mockMammoth = {
  extractRawText: jest.fn(() => Promise.resolve(mockExtractRawTextResult)),
  // Add other mammoth functions if they are used and need mocking
};

module.exports = mockMammoth;
