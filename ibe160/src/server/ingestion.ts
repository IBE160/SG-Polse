import { DocumentParser } from './services/parser';
import { embeddingService } from './services/embedding';
import { PineconeService /*, Vector*/ } from './services/pinecone'; // Commented out Vector import
import { env } from '../env';
import { access, writeFile } from 'fs/promises';
import { join } from 'path';


// Temporary local definition for Vector to bypass Jest module resolution issue
interface Vector {
  id: string;
  values: number[];
  metadata: Record<string, any>;
}

interface Document {
  id: string;
  filePath: string;
  fileType: string; // e.g., 'pdf', 'docx', 'txt'
  metadata: {
    courseId: string;
    documentName: string;
    // Add other relevant metadata
  };
}

export class IngestionService {
  private documentParser: DocumentParser;
  private embeddingService: typeof embeddingService;
  private pineconeService: PineconeService;

  constructor() {
    this.documentParser = new DocumentParser();
    this.embeddingService = embeddingService;
          this.pineconeService = new PineconeService(
          env.PINECONE_API_KEY,
          env.PINECONE_INDEX_NAME
        );  }

  // Placeholder for fetching documents from Canvas
  private async fetchDocumentsFromCanvas(courseId: string): Promise<Document[]> {
    console.log(`Fetching documents for course: ${courseId} from Canvas (placeholder)`);
    // In a real scenario, this would call the Canvas integration service (Story 2.1)
    // For now, return mock documents
    return [];
  }

  async ingestCourseDocuments(courseId: string): Promise<void> {
    const documents = await this.fetchDocumentsFromCanvas(courseId);
    const uploadDir = join(process.cwd(), "public", "uploads");

    for (const doc of documents) {
      let textFilePath: string; // Declare textFilePath once
      try {
        const docName = doc.metadata.documentName;
        const expectedTxtFileName = doc.fileType === 'pdf' ? `${docName}.txt` : docName;
        textFilePath = join(uploadDir, expectedTxtFileName);

        try {
          await access(textFilePath);
          console.log(`Document already ingested, skipping: ${docName}`);
          continue;
        } catch (error) {
          // File does not exist, proceed with ingestion
        }

        console.log(`Parsing document: ${docName}`);
        const textContent = await this.documentParser.parse(doc.filePath, doc.fileType);

        // Save the extracted text content to a local .txt file
        await writeFile(textFilePath, textContent);
        
        console.log(`Generating embedding for document: ${docName}`);
        const embedding = await this.embeddingService.generateEmbedding(textContent);

        if (embedding.length > 0) {
          const vector: Vector = {
            id: doc.id,
            values: embedding,
            metadata: {
              ...doc.metadata,
              text: textContent.substring(0, 500), // Store first 500 chars of text for context
            },
          };

          console.log(`Upserting vector for document: ${docName}`);
          await this.pineconeService.upsertVectors([vector]);
          console.log(`Successfully ingested: ${docName}`);
        } else {
          console.warn(`No embedding generated for document: ${docName}. Skipping upsert.`);
        }
      } catch (error) {
        console.error(`Error processing document ${doc.metadata.documentName}:`, error);
        // Continue to next document even if one fails
      }
    }
    console.log(`Ingestion process for course ${courseId} completed.`);
  }

  // New method to process a single document from buffer
  public async processDocument(
    buffer: Buffer,
    fileType: string,
    filePath: string,
    courseId: string
  ): Promise<void> {
    try {
      console.log(`Processing document: ${filePath} (${fileType})`);
      // 1. Parse document
      const textContent = await this.documentParser.parseFromBuffer(buffer, fileType); // Assuming parseFromBuffer exists or modify parse

      // 2. Generate embeddings
      const embedding = await this.embeddingService.generateEmbedding(textContent);

      // 3. Prepare metadata
      // TODO: Generate a unique ID for the document - perhaps using the filePath and a hash?
      const documentId = 'doc_' + Math.random().toString(36).substring(7); // Placeholder for unique ID

      const metadata = {
        source: "Teacher Upload", // Or derive from filePath/bucket
        courseId: courseId,
        documentName: filePath.split('/').pop(), // Extract filename
        fileName: filePath.split('/').pop(), // Add fileName to metadata for Pinecone deletion
        fileType: fileType,
        textContent: textContent.substring(0, 500), // Store first 500 chars of text for context
      };

      // 4. Upsert to Pinecone
      await this.pineconeService.upsertVectors([
        {
          id: documentId,
          values: embedding,
          metadata: metadata,
        },
      ]);
      console.log(`Successfully processed and ingested: ${filePath}`);
    } catch (error) {
      console.error(`Failed to process document ${filePath}:`, error);
      throw error; // Re-throw to be handled by webhook handler
    }
  }
}
