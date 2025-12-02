import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export class DocumentParser {
  public async parse(buffer: Buffer, fileType: string): Promise<string> {
    switch (fileType) {
      case 'application/pdf':
        return this.parsePdf(buffer);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': // .docx
        return this.parseDocx(buffer);
      case 'text/plain':
        return this.parseTxt(buffer);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  private async parsePdf(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }

  private async parseDocx(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer.buffer });
    return result.value;
  }

  private parseTxt(buffer: Buffer): Promise<string> {
    return Promise.resolve(buffer.toString('utf-8'));
  }
}
