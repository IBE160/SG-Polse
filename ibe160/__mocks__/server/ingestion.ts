// ibe160/__mocks__/server/ingestion.ts

export const IngestionService = jest.fn().mockImplementation(() => ({
  processDocument: jest.fn(async (buffer: Buffer, fileType: string, filePath: string, courseId: string) => {
    if (filePath.includes('ingestion-fail')) {
      throw new Error('Mock IngestionService failure');
    }
    // Simulate successful processing
    return Promise.resolve();
  }),
}));
