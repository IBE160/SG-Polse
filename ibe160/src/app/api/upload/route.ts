import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, rm, access } from "fs/promises"; // Import mkdir, rm, and access
import { join } from "path";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique temp directory names

import { PDFParse } from "pdf-parse";
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
          
          // Skip macOS resource fork files and other hidden files
          if (entryFileName.startsWith('__MACOSX/') || entryFileName.split('/').pop().startsWith('.')) {
            console.log(`Skipping macOS resource fork or hidden file: ${entryFileName}`);
            continue;
          }

          const entryFilePath = join(tempExtractionPath, entryFileName);
          const fileExtension = entryFileName.toLowerCase().split('.').pop();
          const fileNameWithoutExtension = entryFileName.split('.').slice(0, -1).join('.');

          let savedFileName: string | null = null;
          const expectedTxtFileName = fileExtension === "pdf" ? `${fileNameWithoutExtension}.pdf.txt` : `${fileNameWithoutExtension}.txt`;
          const expectedTxtFilePath = join(uploadDir, expectedTxtFileName);

          try {
            await access(expectedTxtFilePath);
            console.log(`File from ZIP already ingested, skipping: ${entryFileName}`);
            processedFiles.push(`${entryFileName} (skipped, already ingested)`);
            continue; // Skip to the next file in the ZIP
          } catch (error) {
            // File does not exist, proceed with ingestion
          }

          if (fileExtension === "pdf") {
            const pdfBuffer = zipEntry.getData();
            let parser;
            try {
              parser = new PDFParse({ data: pdfBuffer });
              const pdfData = await parser.getText();
              savedFileName = `${fileNameWithoutExtension}.pdf.txt`;
              await writeFile(join(uploadDir, savedFileName), pdfData.text);
              processedFiles.push(savedFileName);
            } catch (pdfError: any) {
              console.error(`Error parsing PDF from ZIP entry ${entryFileName}:`, pdfError);
              processedFiles.push(`${entryFileName} (PDF parsing failed: ${pdfError.message})`);
            } finally {
              if (parser) {
                await parser.destroy();
              }
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
      const textFilePath = file.name.toLowerCase().endsWith(".pdf")
        ? `${filePath}.txt`
        : filePath;

      try {
        await access(textFilePath); // Check if the .txt file already exists
        console.log(`File already ingested, skipping: ${file.name}`);
        return NextResponse.json({ message: `File already ingested, skipping: ${file.name}` });
      } catch (error) {
        // File does not exist, proceed with ingestion
      }

      await writeFile(filePath, buffer);

      if (file.name.toLowerCase().endsWith(".pdf")) {
        let parser;
        try {
          parser = new PDFParse({ data: buffer });
          const data = await parser.getText();
          await writeFile(textFilePath, data.text);
        } finally {
          if (parser) {
            await parser.destroy();
          }
        }
      }
      return NextResponse.json({ message: "File uploaded successfully." });
    }
  } catch (error: any) {
    console.error("Error saving/processing file:", error);
    return NextResponse.json({ error: `Error saving/processing file: ${error.message}` }, { status: 500 });
  }
}
