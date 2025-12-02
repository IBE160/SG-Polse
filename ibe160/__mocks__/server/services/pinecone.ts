// ibe160/__mocks__/server/services/pinecone.ts

export interface Vector {
  id: string;
  values: number[];
  metadata: Record<string, any>;
}

export class PineconeService {
  constructor(apiKey: string, environment: string, indexName: string) {}
  async upsertVectors(vectors: Vector[]): Promise<void> {
    // console.log('Mock PineconeService.upsertVectors called', vectors);
    return Promise.resolve();
  }
  async findMostRelevantContext(embedding: number[]): Promise<string> {
    return Promise.resolve('mock context');
  }
}

// Export a default instance if needed by other modules
export const pineconeService = new PineconeService('mock', 'mock', 'mock');
