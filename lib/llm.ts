import OpenAI from "openai";

// Initialize OpenAI client (will be undefined if API key is not set)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export interface AnswerGenerationOptions {
  query: string;
  chunks: Array<{
    content: string;
    documentName: string;
    chunkIndex: number;
  }>;
  model?: string;
}

/**
 * Generate an intelligent answer from document chunks using OpenAI
 */
export async function generateAnswer(
  options: AnswerGenerationOptions
): Promise<string> {
  const { query, chunks, model = "gpt-4o-mini" } = options;

  // If OpenAI is not configured, fall back to simple concatenation
  if (!openai || chunks.length === 0) {
    return chunks.length > 0
      ? chunks
          .slice(0, 3)
          .map((chunk) => chunk.content)
          .join("\n\n...\n\n")
      : "I couldn't find any relevant information in your documents. Try rephrasing your question or upload more documents.";
  }

  try {
    // Prepare context from chunks
    const context = chunks
      .map(
        (chunk, index) =>
          `[Source ${index + 1}: ${chunk.documentName}, Chunk ${
            chunk.chunkIndex + 1
          }]\n${chunk.content}`
      )
      .join("\n\n---\n\n");

    const systemPrompt = `You are DocQuery, an AI assistant that answers questions based on provided document excerpts. 
Your answers should be:
- Accurate and based only on the provided context
- Clear and well-structured
- Include references to the source documents when relevant
- If the context doesn't contain enough information, say so clearly

Format your response naturally, and mention source documents when citing specific information.`;

    const userPrompt = `Based on the following document excerpts, please answer this question: "${query}"

Document excerpts:
${context}

Please provide a comprehensive answer based on the above context. If the context doesn't fully answer the question, mention what information is available and what might be missing.`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer = response.choices[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("No answer generated from OpenAI");
    }

    return answer;
  } catch (error) {
    console.error("Error generating answer with OpenAI:", error);
    // Fallback to simple concatenation if LLM fails
    return chunks
      .slice(0, 3)
      .map((chunk) => chunk.content)
      .join("\n\n...\n\n");
  }
}

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return openai !== null;
}
