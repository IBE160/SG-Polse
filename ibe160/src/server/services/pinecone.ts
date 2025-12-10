import { Pinecone, type PineconeRecord } from '@pinecone-database/pinecone'; // Import real Pinecone client
import { env } from '~/env'; // Import environment variables

export interface Vector {
  id: string;
  values: number[];
  metadata: Record<string, any>;
}

/**
 * A service class for interacting with a Pinecone vector database.
 * This class now integrates with the real Pinecone client.
 */
export class PineconeService {
  private pinecone: Pinecone;
  private indexName: string;

  constructor(apiKey: string, indexName: string) { // Removed environment from constructor
    if (!apiKey || !indexName) {
      console.warn("Pinecone API Key or Index Name not fully provided. Proceeding with mock behavior or will throw errors on real calls.");
    }

    this.pinecone = new Pinecone({
      apiKey: apiKey,
      // Removed environment property
    });
    this.indexName = indexName;
  }

  private get index() {
    return this.pinecone.Index(this.indexName);
  }

  /**
   * Upserts vectors to the Pinecone index.
   * @param vectors An array of vectors to upsert.
   */
  async upsertVectors(vectors: Vector[]): Promise<void> {
    if (!env.PINECONE_API_KEY || !env.PINECONE_INDEX_NAME) { // Updated env check
      console.log(`Mock: Upserting ${vectors.length} vectors to Pinecone.`);
      vectors.forEach(vector => {
        console.log(`Mock: Upserted vector with ID: ${vector.id}, metadata:`, vector.metadata);
      });
      return Promise.resolve();
    }
    
    try {
      const pineconeRecords: PineconeRecord[] = vectors.map(v => ({
        id: v.id,
        values: v.values,
        metadata: v.metadata,
      }));
      await this.index.upsert(pineconeRecords);
      console.log(`Successfully upserted ${vectors.length} vectors to Pinecone index: ${this.indexName}`);
    } catch (error) {
      console.error('Error upserting vectors to Pinecone:', error);
      throw new Error('Failed to upsert vectors to Pinecone.');
    }
  }

  /**
   * Finds the most relevant context for a given embedding by querying the Pinecone index.
   * @param embedding The embedding vector of the user's query.
   * @param topK The number of top results to retrieve.
   * @returns A promise that resolves to a string containing relevant context.
   */
  async findMostRelevantContext(embedding: number[], topK: number = 3): Promise<string> {
    if (!env.PINECONE_API_KEY || !env.PINECONE_INDEX_NAME) { // Updated env check
      console.log("Mock: Finding most relevant context from Pinecone.");
      const mockContext = `
        ---
        Retrieved Document: "Course Syllabus Fall 2025"
        Content: "Bilingual Interpretation: The course will cover topics related to bilingualism. This includes the use of multilingual models and dependency injection techniques in software development. For a full list of topics, refer to the course schedule."
        ---
        Retrieved Document: "Lecture Notes Week 4"
        Content: "Dependency Injection (DI) is a design pattern used to implement inversion of control. It allows the creation of dependent objects outside of a class and providing those objects to a class through different ways."
        ---
      `;
      return Promise.resolve(mockContext.trim());
    }

    try {
      const queryResult = await this.index.query({
        vector: embedding,
        topK: topK,
        includeMetadata: true,
      });

      if (!queryResult.matches || queryResult.matches.length === 0) {
        return "No relevant context found in Pinecone.";
      }

      // Concatenate the content from the top K matches
      const context = queryResult.matches.map(match => {
        const title = match.metadata?.title || "Unknown Document";
        const content = match.metadata?.text || match.metadata?.content || "No content available.";
        return `Retrieved Document: "${title}"\nContent: "${content}"`;
      }).join('\n---\n');

      return context;
    } catch (error) {
      console.error('Error querying Pinecone for relevant context:', error);
      throw new Error('Failed to query Pinecone for relevant context.');
    }
  }
}

export const pineconeService = new PineconeService(
  env.PINECONE_API_KEY,
  env.PINECONE_INDEX_NAME // Removed environment from instantiation
);