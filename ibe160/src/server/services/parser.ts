import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

type FileType = 'pdf' | 'docx' | 'txt' | string; // Allowing string for future expansion

export class DocumentParser {
  async parse(filePath: string, fileType: FileType): Promise<string> {
    const absolutePath = path.resolve(filePath);

    switch (fileType) {
      case 'pdf':
        return this._parsePdf(absolutePath);
      case 'docx':
        return this._parseDocx(absolutePath);
      case 'txt':
        return this._parseTxt(absolutePath);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  private async _parsePdf(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  private async _parseDocx(filePath: string): Promise<string> {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  }

  private async _parseTxt(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }
}
