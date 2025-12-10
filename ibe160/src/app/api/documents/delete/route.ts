import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import { z } from "zod";
import { pineconeService } from "~/server/services/pinecone";

const deleteRequestSchema = z.object({
  filename: z.string(), // e.g., "Accountability.pdf"
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = deleteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { filename } = parsed.data;
    const uploadDir = join(process.cwd(), "public", "uploads");

    const originalFilePath = join(uploadDir, filename);
    // If filename is "document.pdf", the text file is "document.pdf.txt"
    // If filename is "document.txt", the text file is "document.txt"
    const textFilePath = filename.toLowerCase().endsWith(".pdf")
      ? `${originalFilePath}.txt`
      : originalFilePath; // If it's not a PDF, assume it's already a text file

    const filesDeleted: string[] = [];

    // Delete original file (e.g., PDF or ZIP)
    try {
      await fs.unlink(originalFilePath);
      filesDeleted.push(filename);
      console.log(`Deleted original file: ${originalFilePath}`);
    } catch (error: any) {
      if (error.code !== 'ENOENT') { // Ignore if file simply doesn't exist
        console.error(`Error deleting original file ${originalFilePath}:`, error);
        // Don't rethrow, try to delete associated text file and Pinecone embeddings
      } else {
        console.log(`Original file ${originalFilePath} not found, skipping deletion.`);
      }
    }

    // Delete associated text file
    if (filename.toLowerCase().endsWith(".pdf") || filename.toLowerCase().endsWith(".txt")) {
        try {
            await fs.unlink(textFilePath);
            filesDeleted.push(`${filename}.txt`);
            console.log(`Deleted text file: ${textFilePath}`);
        } catch (error: any) {
            if (error.code !== 'ENOENT') { // Ignore if file simply doesn't exist
                console.error(`Error deleting text file ${textFilePath}:`, error);
                // Don't rethrow, try to delete Pinecone embeddings
            } else {
                console.log(`Text file ${textFilePath} not found, skipping deletion.`);
            }
        }
    }

    // Delete embeddings from Pinecone
    await pineconeService.deleteVectors(filename); // Pass the original filename as metadata filter
    console.log(`Attempted to delete Pinecone embeddings for: ${filename}`);

    const message = filesDeleted.length > 0
      ? `Successfully initiated deletion for ${filename}. Files deleted: ${filesDeleted.join(', ')}`
      : `Deletion process initiated for ${filename}. No files found to delete on disk.`;

    return NextResponse.json({ message: message });
  } catch (error: any) {
    console.error("Error during document deletion:", error);
    return NextResponse.json({ error: `Error during document deletion: ${error.message}` }, { status: 500 });
  }
}
