import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const uploadDir = join(process.cwd(), "public", "uploads");
    const files = await fs.readdir(uploadDir);

    // Filter out .txt files that are companions to .pdf files
    const documentFiles = files.filter(file => 
      !file.toLowerCase().endsWith('.pdf.txt') && !file.toLowerCase().endsWith('.txt')
    );

    // Filter out temporary directories created during zip extraction
    const finalDocumentList = documentFiles.filter(file => !file.startsWith('temp_'));

    return NextResponse.json({ files: finalDocumentList });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If the directory doesn't exist yet, return an empty array
      return NextResponse.json({ files: [] });
    }
    console.error("Error listing documents:", error);
    return NextResponse.json({ error: `Error listing documents: ${error.message}` }, { status: 500 });
  }
}
