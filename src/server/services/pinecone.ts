import { Pinecone, Index, RecordMetadata } from '@pinecone-database/pinecone';

// NOTE: You will need to install the Pinecone client library:
// npm install @pinecone-database/pinecone

export class PineconeService {
  private pinecone: Pinecone;
  private index: Index<RecordMetadata> | undefined;
  private indexName: string;

  constructor(apiKey: string, environment: string, indexName: string) {
    this.pinecone = new Pinecone({
      apiKey,
      environment,
    });
    this.indexName = indexName;
  }

  public async initializeIndex(): Promise<void> {
    try {
      const describeIndexShow = await this.pinecone.describeIndex(this.indexName);
      this.index = this.pinecone.Index(this.indexName);
      console.log(`Connected to existing Pinecone index: ${this.indexName}`);
    } catch (error: any) {
      if (error.status === 404) {
        // Index does not exist, create it.
        // NOTE: You might want to configure the dimension and metric based on your embedding model
        // For 'text-embedding-ada-002', the dimension is 1536.
        // A common metric is 'cosine'.
        await this.pinecone.createIndex({
          name: this.indexName,
          dimension: 1536, // Example dimension for OpenAI's text-embedding-ada-002
          metric: 'cosine',
          // You might also need to specify a pod_type and replicas for production
        });
        this.index = this.pinecone.Index(this.indexName);
        console.log(`Created and connected to new Pinecone index: ${this.indexName}`);
      } else {
        console.error("Error initializing Pinecone index:", error);
        throw new Error("Failed to initialize Pinecone index.");
      }
    }
  }

  public async upsertVectors(vectors: Array<{ id: string; values: number[]; metadata: RecordMetadata }>): Promise<void> {
    if (!this.index) {
      throw new Error("Pinecone index not initialized. Call initializeIndex() first.");
    }
    try {
      await this.index.upsert(vectors);
      console.log(`Successfully upserted ${vectors.length} vectors to Pinecone.`);
    } catch (error) {
      console.error("Error upserting vectors to Pinecone:", error);
      throw new Error("Failed to upsert vectors to Pinecone.");
    }
  }

  public async queryVectors(vector: number[], topK: number = 5): Promise<Array<{ id: string; score: number; metadata: RecordMetadata }>> {
    if (!this.index) {
      throw new Error("Pinecone index not initialized. Call initializeIndex() first.");
    }
    try {
      const queryResult = await this.index.query({
        vector,
        topK,
        includeMetadata: true,
      });
      return queryResult.matches || [];
    } catch (error) {
      console.error("Error querying vectors from Pinecone:", error);
      throw new Error("Failed to query vectors from Pinecone.");
    }
  }
}

