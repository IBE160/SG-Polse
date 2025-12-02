import { DocumentParser } from '../parser';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';

// Explicitly tell Jest to use the mock implementations
jest.mock('mammoth');
jest.mock('pdf-parse');

describe('DocumentParser', () => {
  let parser: DocumentParser;

  beforeEach(() => {
    parser = new DocumentParser();
    // Clear mock calls before each test
    (mammoth.extractRawText as jest.Mock).mockClear();
    (pdf as jest.Mock).mockClear();
  });

  it('should parse PDF content correctly', async () => {
    const mockPdfBuffer = Buffer.from('PDF_BUFFER_CONTENT');
    const mockPdfText = 'Mocked PDF content';
    (pdf as jest.Mock).mockResolvedValueOnce({ text: mockPdfText });

    const result = await parser.parse(mockPdfBuffer, 'application/pdf');
    expect(result).toBe(mockPdfText);
    expect(pdf).toHaveBeenCalledWith(mockPdfBuffer);
  });

  it('should parse DOCX content correctly', async () => {
    const mockDocxBuffer = Buffer.from('DOCX_BUFFER_CONTENT');
    const mockDocxText = 'Mocked DOCX content';
    (mammoth.extractRawText as jest.Mock).mockResolvedValueOnce({ value: mockDocxText });

    const result = await parser.parse(mockDocxBuffer, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(result).toBe(mockDocxText);
    expect(mammoth.extractRawText).toHaveBeenCalledWith({ arrayBuffer: mockDocxBuffer.buffer });
  });

  it('should parse TXT content correctly', async () => {
    const mockTxtBuffer = Buffer.from('TXT_CONTENT');
    const mockTxtText = 'TXT_CONTENT';

    const result = await parser.parse(mockTxtBuffer, 'text/plain');
    expect(result).toBe(mockTxtText);
  });

  it('should throw an error for unsupported file types', async () => {
    const mockBuffer = Buffer.from('UNSUPPORTED');
    await expect(parser.parse(mockBuffer, 'image/jpeg')).rejects.toThrow('Unsupported file type: image/jpeg');
  });
});