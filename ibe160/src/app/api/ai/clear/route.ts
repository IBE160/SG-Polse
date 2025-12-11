import { type NextRequest, NextResponse } from "next/server";
import { rm, mkdir } from "fs/promises";
import { join } from "path";
import { pineconeService } from "~/server/services/pinecone";

export async function POST(request: NextRequest) {
  try {
    // 1. Clear all vectors from Pinecone
    await pineconeService.deleteAll();
    console.log("Successfully cleared all vectors from Pinecone.");

    // 2. Clear all local files from the uploads directory
    const uploadDir = join(process.cwd(), "public", "uploads");
    await rm(uploadDir, { recursive: true, force: true });
    await mkdir(uploadDir, { recursive: true });
    console.log("Successfully cleared all local files from the uploads directory.");

    return NextResponse.json({ message: "Successfully cleared all data from Pinecone and local uploads." });
  } catch (error: any) {
    console.error("Error clearing data:", error);
    return NextResponse.json({ error: `Error clearing data: ${error.message}` }, { status: 500 });
  }
}
