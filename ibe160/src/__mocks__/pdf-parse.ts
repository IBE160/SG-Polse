import { jest } from '@jest/globals';

// ibe160/src/__mocks__/pdf-parse.ts
const pdfParse = jest.fn((buffer: Buffer) =>
  Promise.resolve({ text: `Mocked PDF Content for buffer: ${buffer.toString().substring(0, 20)}...` })
);

export default pdfParse;