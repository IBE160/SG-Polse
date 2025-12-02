// src/__mocks__/pdf-parse.ts

// Mock for pdf-parse library
const mockPdfParseData = {
  numpages: 1,
  numrender: 1,
  info: {},
  metadata: {},
  version: '1.10.100',
  text: 'Mocked PDF content',
  // Add other properties if needed
};

const mockPdfParse = jest.fn(() => Promise.resolve(mockPdfParseData));

module.exports = mockPdfParse;
