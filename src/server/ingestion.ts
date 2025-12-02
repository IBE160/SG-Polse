import { DocumentParser } from './services/parser';
import { EmbeddingService } from './services/embedding';
import { PineconeService } from './services/pinecone';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// NOTE: You will need to install uuid: npm install uuid @types/uuid

interface Document {
  id: string;
  content: string;
  metadata: {
    source: string;
    courseId: string;
    documentName: string;
    fileType: string;
    // Add other relevant metadata
  };
}

export class IngestionService {
  private parser: DocumentParser;
  private embeddingService: EmbeddingService;
  private pineconeService: PineconeService;

  constructor(
    pineconeApiKey: string,
    pineconeEnvironment: string,
    pineconeIndexName: string,
    openAIApiKey: string
  ) {
    this.parser = new DocumentParser();
    this.embeddingService = new EmbeddingService(openAIApiKey);
    this.pineconeService = new PineconeService(pineconeApiKey, pineconeEnvironment, pineconeIndexName);
  }

  public async initialize(): Promise<void> {
    await this.pineconeService.initializeIndex();
  }

  // Placeholder for fetching documents from Canvas
  // In a real scenario, this would interact with the Canvas service from Story 2.1
  private async fetchDocumentsFromCanvas(): Promise<Array<{ buffer: Buffer; fileType: string; fileName: string; courseId: string }>> {
    console.log("Simulating fetching documents from Canvas...");
    // Return dummy data for demonstration
    return [
      {
        buffer: Buffer.from("This is a sample text document about course materials."),
        fileType: "text/plain",
        fileName: "CourseOverview.txt",
        courseId: "CS101",
      },
      {
        buffer: Buffer.from("%PDF-1.4...\nExample PDF content."), // Simplified buffer for example
        fileType: "application/pdf",
        fileName: "LectureNotes.pdf",
        courseId: "CS101",
      },
      // Add more dummy documents as needed
    ];
  }

  public async ingestDocuments(): Promise<void> {
    console.log("Starting document ingestion process...");

    await this.initialize(); // Ensure Pinecone index is ready

    const canvasDocuments = await this.fetchDocumentsFromCanvas();

    for (const doc of canvasDocuments) {
      await this.processDocument(doc.buffer, doc.fileType, doc.fileName, doc.courseId);
    }

    console.log("Document ingestion process completed.");
  }

  public async processDocument(
    buffer: Buffer,
    fileType: string,
    fileName: string,
    courseId: string
  ): Promise<void> {
    try {
      console.log(`Processing document: ${fileName} (${fileType})`);
      // 1. Parse document
      const textContent = await this.parser.parse(buffer, fileType);

      // 2. Generate embeddings
      const embeddings = await this.embeddingService.generateEmbeddings(textContent);

      // 3. Prepare metadata
      const documentId = uuidv4(); // Generate a unique ID for the document
      const metadata = {
        source: "Canvas",
        courseId: courseId,
        documentName: fileName,
        fileType: fileType,
        textContent: textContent, // Store original text content for retrieval
      };

      // 4. Upsert to Pinecone
      await this.pineconeService.upsertVectors([
        {
          id: documentId,
          values: embeddings,
          metadata: metadata,
        },
      ]);
      console.log(`Successfully processed and ingested: ${fileName}`);
    } catch (error) {
      console.error(`Failed to process document ${fileName}:`, error);
    }
  }
}
