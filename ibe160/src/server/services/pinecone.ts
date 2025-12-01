import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';

export interface Vector {
  id: string;
  values: number[];
  metadata?: {
    [key: string]: string | number | boolean | Array<string | number | boolean>;
  };
}

export interface QueryResult {
  matches: Array<{
    id: string;
    score: number;
    values: number[];
    metadata: {
      [key: string]: string | number | boolean | Array<string | number | boolean>;
    };
  }>;
  namespace?: string;
}

export class PineconeService {
  private pinecone: Pinecone;
  private indexName: string;

  constructor(apiKey: string, environment: string, indexName: string) {
    if (!apiKey || !environment || !indexName) {
      throw new Error('Pinecone API key, environment, or index name not provided.');
    }

    this.pinecone = new Pinecone({
      apiKey,
      environment, // deprecated but still needed for constructor
    });
    this.indexName = indexName;
  }

  async upsertVectors(vectors: Vector[]): Promise<void> {
    const index = this.pinecone.index(this.indexName);
    const records: PineconeRecord[] = vectors.map(v => ({
      id: v.id,
      values: v.values,
      metadata: v.metadata,
    }));
    await index.upsert(records);
  }

  async queryVectors(vector: number[], topK: number): Promise<QueryResult> {
    const index = this.pinecone.index(this.indexName);
    const queryResponse = await index.query({
      vector,
      topK,
      includeMetadata: true,
      includeValues: false, // Typically you don't need values back for a query
    });

    // Map to the desired QueryResult interface
    const matches = queryResponse.matches?.map(match => ({
      id: match.id,
      score: match.score || 0, // PineconeRecord.score is optional
      values: match.values || [], // PineconeRecord.values is optional
      metadata: (match.metadata as { [key: string]: string | number | boolean | Array<string | number | boolean> }) || {},
    })) || [];

    return { matches, namespace: queryResponse.namespace };
  }
}
