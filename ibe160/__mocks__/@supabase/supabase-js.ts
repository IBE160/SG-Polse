// ibe160/__mocks__/@supabase/supabase-js.ts

export const createClient = jest.fn(() => ({
  storage: {
    from: jest.fn(() => ({
      download: jest.fn((filePath: string) => {
        if (filePath.includes('error')) {
          return Promise.resolve({ data: null, error: new Error('Mock download error') });
        }
        // Simulate different file types
        let buffer;
        if (filePath.endsWith('.pdf')) {
          buffer = Buffer.from('%PDF-1.4...mock pdf content');
        } else if (filePath.endsWith('.docx')) {
          buffer = Buffer.from('mock docx content');
        } else {
          buffer = Buffer.from('mock text content');
        }
        return Promise.resolve({ data: new Blob([buffer]), error: null });
      }),
    })),
  },
}));
