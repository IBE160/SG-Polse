import { DocumentParser } from './services/parser';
import { EmbeddingModel } from './services/embedding';
import { PineconeService, Vector } from './services/pinecone';
import { env } from '../env';

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
  private embeddingModel: EmbeddingModel;
  private pineconeService: PineconeService;

  constructor() {
    this.documentParser = new DocumentParser();
    this.embeddingModel = new EmbeddingModel(env.SERVER.OPENAI_API_KEY); // Using OPENAI for now
    this.pineconeService = new PineconeService(
      env.SERVER.PINECONE_API_KEY,
      env.SERVER.PINECONE_ENVIRONMENT,
      env.SERVER.PINECONE_INDEX_NAME
    );
  }

  // Placeholder for fetching documents from Canvas
  private async fetchDocumentsFromCanvas(courseId: string): Promise<Document[]> {
    console.log(`Fetching documents for course: ${courseId} from Canvas (placeholder)`);
    // In a real scenario, this would call the Canvas integration service (Story 2.1)
    // For now, return mock documents
    return [
      // {
      //   id: 'doc1_courseA',
      //   filePath: '/path/to/courseA_syllabus.pdf',
      //   fileType: 'pdf',
      //   metadata: { courseId: 'courseA', documentName: 'Syllabus' },
      // },
      // {
      //   id: 'doc2_courseA',
      //   filePath: '/path/to/courseA_assignment.docx',
      //   fileType: 'docx',
      //   metadata: { courseId: 'courseA', documentName: 'Assignment 1' },
      // },
    ];
  }

  async ingestCourseDocuments(courseId: string): Promise<void> {
    const documents = await this.fetchDocumentsFromCanvas(courseId);

    for (const doc of documents) {
      try {
        console.log(`Parsing document: ${doc.documentName}`);
        const textContent = await this.documentParser.parse(doc.filePath, doc.fileType);

        console.log(`Generating embedding for document: ${doc.documentName}`);
        const embedding = await this.embeddingModel.generateEmbedding(textContent);

        if (embedding.length > 0) {
          const vector: Vector = {
            id: doc.id,
            values: embedding,
            metadata: {
              ...doc.metadata,
              text: textContent.substring(0, 500), // Store first 500 chars of text for context
            },
          };

          console.log(`Upserting vector for document: ${doc.documentName}`);
          await this.pineconeService.upsertVectors([vector]);
          console.log(`Successfully ingested: ${doc.documentName}`);
        } else {
          console.warn(`No embedding generated for document: ${doc.documentName}. Skipping upsert.`);
        }
      } catch (error) {
        console.error(`Error processing document ${doc.documentName}:`, error);
        // Continue to next document even if one fails
      }
    }
    console.log(`Ingestion process for course ${courseId} completed.`);
  }
}
