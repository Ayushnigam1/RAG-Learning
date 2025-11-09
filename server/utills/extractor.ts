import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts text content from  file.
 * @param filePath - The path to the file.
 * @returns The extracted text content.
 */
export const extractTextFromFile = async (filePath: string): Promise<string> => {
    switch(path.extname(filePath).toLowerCase()) {
        case '.pdf':
            const parser = new PDFParse({url:filePath});
            const pdfData = await parser.getText()
            return pdfData.text
        case '.docx':
            const result = await mammoth.extractRawText({path: filePath});
            return result.value;
        case '.txt':
            return fs.readFileSync(filePath, 'utf-8'); 
        default:
            throw new Error(`Unsupported file type: ${path.extname(filePath)}`);
    }
}

  