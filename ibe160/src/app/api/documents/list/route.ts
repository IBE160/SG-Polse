import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const uploadDir = join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true }); // Ensure the directory exists
    const files = await fs.readdir(uploadDir);
    const fileSet = new Set(files);

    const documentFiles = files.filter(file => {
      if (file.startsWith('temp_')) {
        return false;
      }
      if (file.toLowerCase().endsWith('.pdf.txt')) {
        const pdfCompanion = file.substring(0, file.length - 4);
        if (fileSet.has(pdfCompanion)) {
          return false; // Hide the .pdf.txt file if its .pdf companion exists
        }
      }
      return true; // Show all other files
    });

    return NextResponse.json({ files: documentFiles });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // This should no longer be hit, but kept as a safeguard
      return NextResponse.json({ files: [] });
    }
    console.error("Error listing documents:", error);
    return NextResponse.json({ error: `Error listing documents: ${error.message}` }, { status: 500 });
  }
}
