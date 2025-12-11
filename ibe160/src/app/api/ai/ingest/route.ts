import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join, basename } from "path"; // Import basename
import { glob } from "glob"; // Using glob for file matching
import { embeddingService } from "~/server/services/embedding";
import { pineconeService } from "~/server/services/pinecone";
import { v4 as uuidv4 } from 'uuid';

// Utility function to remove invalid Unicode code points
const sanitizeText = (text: string): string => {
  // This regex specifically targets unpaired surrogate halves or other invalid code points
  // A common issue is \udc67 which is a low-surrogate without a high-surrogate
  return text.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
};

export async function POST(request: NextRequest) {
  try {
    const uploadDir = join(process.cwd(), "public", "uploads");
    console.log("Ingestion API: uploadDir =", uploadDir); // Debugging log
    const globPattern = join(uploadDir, "**/*.txt").replace(/\\/g, '/'); // Convert backslashes to forward slashes
    const textFiles = await glob(globPattern); // Find all .txt files
    console.log("Ingestion API: textFiles found =", textFiles); // Debugging log

    if (textFiles.length === 0) {
      return NextResponse.json({ message: "No text files found to ingest." });
    }

    const vectorsToUpsert = [];
    const chunkSize = 500; // Define a reasonable chunk size (e.g., characters)
    const chunkOverlap = 50; // Define a small overlap to maintain context

    for (const filePath of textFiles) {
      const fileName = basename(filePath); // Use basename to get just the filename

      // Check if the file has already been ingested
      const alreadyIngested = await pineconeService.queryByFileName(fileName);
      if (alreadyIngested) {
        console.log(`File already ingested, skipping: ${fileName}`);
        continue;
      }

      // console.log('Ingestion API: Processing filePath:', filePath); // Removed debug log
      // console.log('Ingestion API: Derived fileName for metadata:', fileName); // Removed debug log
      const fileContent = await fs.readFile(filePath, "utf-8");

      const textChunks: string[] = [];
      let i = 0;
      while (i < fileContent.length) {
        let chunk = fileContent.substring(i, i + chunkSize);
        textChunks.push(chunk);
        i += chunkSize - chunkOverlap;
      }

      for (const rawChunk of textChunks) {
        if (rawChunk.trim().length === 0) continue; // Skip empty chunks
        const chunk = sanitizeText(rawChunk); // Sanitize the chunk before processing
        if (chunk.trim().length === 0) continue; // Skip if chunk becomes empty after sanitization

        const embedding = await embeddingService.generateEmbedding(chunk);
        vectorsToUpsert.push({
          id: uuidv4(), // Unique ID for each vector
          values: embedding,
          metadata: {
            text: chunk,
            fileName: fileName,
            // You might add more metadata here, like courseId, page number, etc.
          },
        });
      }
    }

    if (vectorsToUpsert.length > 0) {
      await pineconeService.upsertVectors(vectorsToUpsert);
      return NextResponse.json({ message: `Successfully ingested ${vectorsToUpsert.length} text chunks into Pinecone.` });
    } else {
      return NextResponse.json({ message: "No content processed for ingestion." });
    }

  } catch (error: any) {
    console.error("Error during ingestion process:", error);
    return NextResponse.json({ error: `Error during ingestion process: ${error.message}` }, { status: 500 });
  }
}
