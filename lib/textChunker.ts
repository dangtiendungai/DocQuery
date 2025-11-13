/**
 * Split text into chunks with overlap for better context retention
 */
export interface TextChunk {
  text: string;
  startIndex: number;
  endIndex: number;
  chunkIndex: number;
}

export interface ChunkingOptions {
  maxChunkSize?: number;
  overlapSize?: number;
  separator?: string;
}

const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
  maxChunkSize: 1000, // ~500 tokens (roughly 2 chars per token)
  overlapSize: 200, // 20% overlap
  separator: "\n\n", // Prefer splitting on paragraph breaks
};

/**
 * Split text into semantic chunks
 */
export function chunkText(text: string, options: ChunkingOptions = {}): TextChunk[] {
  const { maxChunkSize, overlapSize, separator } = { ...DEFAULT_OPTIONS, ...options };

  if (text.length <= maxChunkSize) {
    return [
      {
        text,
        startIndex: 0,
        endIndex: text.length,
        chunkIndex: 0,
      },
    ];
  }

  const chunks: TextChunk[] = [];
  let currentIndex = 0;
  let chunkIndex = 0;

  while (currentIndex < text.length) {
    let endIndex = Math.min(currentIndex + maxChunkSize, text.length);
    let chunkText = text.slice(currentIndex, endIndex);

    // Try to find a good break point (prefer paragraph breaks)
    if (endIndex < text.length) {
      const lastSeparator = chunkText.lastIndexOf(separator);
      const lastNewline = chunkText.lastIndexOf("\n");
      const lastPeriod = chunkText.lastIndexOf(". ");
      const lastSpace = chunkText.lastIndexOf(" ");

      // Prefer paragraph break, then newline, then sentence, then word
      const breakPoint = Math.max(lastSeparator, lastNewline, lastPeriod, lastSpace);

      if (breakPoint > maxChunkSize * 0.5) {
        // Only use break point if it's not too early (at least 50% through)
        endIndex = currentIndex + breakPoint + separator.length;
        chunkText = text.slice(currentIndex, endIndex);
      }
    }

    chunks.push({
      text: chunkText.trim(),
      startIndex: currentIndex,
      endIndex,
      chunkIndex: chunkIndex++,
    });

    // Move to next chunk with overlap
    currentIndex = endIndex - overlapSize;
    if (currentIndex < 0) currentIndex = endIndex;
  }

  return chunks;
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

