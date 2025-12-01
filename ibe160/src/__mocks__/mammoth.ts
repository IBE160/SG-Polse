import { jest } from '@jest/globals';

// ibe160/src/__mocks__/mammoth.ts
const mammoth = {
  extractRawText: jest.fn(({ path: filePath }: { path: string }) =>
    Promise.resolve({ value: `Mocked DOCX Content for file: ${filePath.split('/').pop()}` })
  ),
  // Add other methods if needed by DocumentParser
};

export default mammoth;