// Import polyfills first to ensure browser APIs are available
import "./polyfills";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export type SupportedFileType = "pdf" | "docx" | "txt" | "html";

export interface DocumentChunk {
  content: string;
  chunkIndex: number;
  startChar: number;
  endChar: number;
}

/**
 * Extract text from various file types
 */
export async function extractTextFromFile(
  file: File,
  fileType: SupportedFileType
): Promise<string> {
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

  switch (fileType) {
    case "pdf":
      return await extractTextFromPDF(uint8Array);
    case "docx":
      return await extractTextFromDOCX(uint8Array);
    case "txt":
      return new TextDecoder().decode(uint8Array);
    case "html":
      return extractTextFromHTML(new TextDecoder().decode(uint8Array));
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

async function extractTextFromPDF(buffer: Uint8Array): Promise<string> {
  const parser = new PDFParse({ data: Buffer.from(buffer) });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function extractTextFromDOCX(buffer: Uint8Array): Promise<string> {
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
  return result.value;
}

function extractTextFromHTML(html: string): string {
  // Simple HTML text extraction (remove tags)
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split text into semantic chunks
 * Uses a simple approach: split by paragraphs, then combine into ~500 token chunks
 */
export function chunkText(
  text: string,
  chunkSize: number = 500
): DocumentChunk[] {
  // Split by paragraphs (double newlines)
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const chunks: DocumentChunk[] = [];
  let currentChunk = "";
  let chunkIndex = 0;
  let startChar = 0;
  let currentChar = 0;

  for (const paragraph of paragraphs) {
    const paragraphWithNewline = paragraph + "\n\n";
    const paragraphTokens = estimateTokens(paragraph);

    // If adding this paragraph would exceed chunk size, finalize current chunk
    if (
      currentChunk.length > 0 &&
      estimateTokens(currentChunk) + paragraphTokens > chunkSize
    ) {
      chunks.push({
        content: currentChunk.trim(),
        chunkIndex,
        startChar,
        endChar: currentChar,
      });
      startChar = currentChar;
      chunkIndex++;
      currentChunk = paragraphWithNewline;
    } else {
      currentChunk += paragraphWithNewline;
    }

    currentChar += paragraphWithNewline.length;
  }

  // Add the last chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      chunkIndex,
      startChar,
      endChar: currentChar,
    });
  }

  return chunks;
}

/**
 * Simple token estimation: ~4 characters per token
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Get file type from filename
 */
export function getFileType(filename: string): SupportedFileType | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "docx" || ext === "doc") return "docx";
  if (ext === "txt") return "txt";
  if (ext === "html" || ext === "htm") return "html";
  return null;
}
