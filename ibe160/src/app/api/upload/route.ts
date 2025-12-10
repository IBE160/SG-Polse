import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises"; // Import mkdir
import { join } from "path";
import parsePdf from "pdf-parse"; // Corrected import statement

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // We want to save the file to the `public/uploads` directory
  const relativeUploadDir = "uploads";
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);
  const filePath = join(uploadDir, file.name);

  try {
    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Save the original file
    await writeFile(filePath, buffer);

    // If the file is a PDF, parse it and save the text
    if (file.name.toLowerCase().endsWith(".pdf")) {
      const data = await parsePdf(buffer); // Changed usage
      const textFilePath = `${filePath}.txt`;
      await writeFile(textFilePath, data.text);
    }

    return NextResponse.json({ message: "File uploaded successfully." });
  } catch (error: any) { // Type error as 'any' for now to allow access to message property
    console.error("Error saving file:", error);
    return NextResponse.json({ error: `Error saving file: ${error.message}` }, { status: 500 });
  }
}
