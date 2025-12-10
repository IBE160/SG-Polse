import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, rm } from "fs/promises"; // Import mkdir and rm
import { join } from "path";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique temp directory names

// Use require for pdf-parse and adm-zip to avoid ESM/CJS interop issues
const pdf = require("pdf-parse");
const AdmZip = require("adm-zip");

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const relativeUploadDir = "uploads";
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await mkdir(uploadDir, { recursive: true });

    // Handle ZIP files
    if (file.name.toLowerCase().endsWith(".zip")) {
      const tempDirName = `temp_${uuidv4()}`;
      const tempExtractionPath = join(uploadDir, tempDirName);
      await mkdir(tempExtractionPath, { recursive: true });

      const zip = new AdmZip(buffer);
      zip.extractAllTo(tempExtractionPath, true); // true for overwrite

      const zipEntries = zip.getEntries();
      const processedFiles: string[] = [];

      for (const zipEntry of zipEntries) {
        if (!zipEntry.isDirectory) {
          const entryFileName = zipEntry.entryName;
          const entryFilePath = join(tempExtractionPath, entryFileName);
          const fileExtension = entryFileName.toLowerCase().split('.').pop();
          const fileNameWithoutExtension = entryFileName.split('.').slice(0, -1).join('.');

          let savedFileName: string | null = null;

          if (fileExtension === "pdf") {
            const pdfBuffer = zipEntry.getData();
            try {
              const parser = new pdf.PDFParse({ data: pdfBuffer });
              const pdfData = await parser.getText();
              savedFileName = `${fileNameWithoutExtension}.pdf.txt`;
              await writeFile(join(uploadDir, savedFileName), pdfData.text);
              processedFiles.push(savedFileName);
            } catch (pdfError: any) {
              console.error(`Error parsing PDF from ZIP entry ${entryFileName}:`, pdfError);
              processedFiles.push(`${entryFileName} (PDF parsing failed: ${pdfError.message})`);
            }
          } else if (fileExtension === "txt") {
            const textContent = zipEntry.getData().toString('utf8');
            savedFileName = `${fileNameWithoutExtension}.txt`;
            await writeFile(join(uploadDir, savedFileName), textContent);
            processedFiles.push(savedFileName);
          }
          // Add other file types as needed
        }
      }

      await rm(tempExtractionPath, { recursive: true, force: true });
      return NextResponse.json({ message: `ZIP file processed. Extracted files: ${processedFiles.join(', ')}` });

    } else {
      // Original handling for single files (PDF, TXT, etc.)
      const filePath = join(uploadDir, file.name);
      await writeFile(filePath, buffer);

      if (file.name.toLowerCase().endsWith(".pdf")) {
        const parser = new pdf.PDFParse({ data: buffer });
        const data = await parser.getText();
        const textFilePath = `${filePath}.txt`;
        await writeFile(textFilePath, data.text);
      }
      return NextResponse.json({ message: "File uploaded successfully." });
    }
  } catch (error: any) {
    console.error("Error saving/processing file:", error);
    return NextResponse.json({ error: `Error saving/processing file: ${error.message}` }, { status: 500 });
  }
}
