import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

type FileType = 'application/pdf' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' | 'text/plain' | 'application/vnd.openxmlformats-officedocument.presentationml.presentation' | string; // Allowing string for future expansion

export class DocumentParser {
  async parse(filePath: string, fileType: FileType): Promise<string> {
    const absolutePath = path.resolve(filePath);
    const buffer = await fs.readFile(absolutePath); // Read file to buffer

    return this.parseFromBuffer(buffer, fileType); // Delegate to new method
  }

  async parseFromBuffer(buffer: Buffer, fileType: FileType): Promise<string> {
    switch (fileType) {
      case 'application/pdf':
        return this._parsePdfFromBuffer(buffer);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this._parseDocxFromBuffer(buffer);
      case 'text/plain':
        return this._parseTxtFromBuffer(buffer);
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        // TODO: Implement PPTX parsing if needed. For now, treat as unsupported.
        throw new Error(`PPTX parsing not yet supported from buffer.`);
      case 'application/octet-stream': // Handle generic binary as plain text if possible
        try {
          return buffer.toString('utf8');
        } catch (e) {
          throw new Error(`Failed to parse generic binary as text: ${e}`);
        }
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  private async _parsePdfFromBuffer(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text;
  }

  private async _parseDocxFromBuffer(buffer: Buffer): Promise<string> {
    const { value } = await mammoth.extractRawText({ buffer: buffer });
    return value;
  }

  private async _parseTxtFromBuffer(buffer: Buffer): Promise<string> {
    return buffer.toString('utf-8');
  }
}
