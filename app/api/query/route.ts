import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateAnswer } from "@/lib/llm";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Create an authenticated Supabase client for this user
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { query, limit = 5 } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Search document chunks using text search (vector search would require embeddings)
    // For now, we'll use PostgreSQL ILIKE for case-insensitive search
    const searchQuery = query.trim().toLowerCase();

    // First, get processed documents
    const { data: processedDocs, error: docsError } = await supabase
      .from("documents")
      .select("id, name, file_type")
      .eq("status", "processed");

    if (docsError) {
      console.error("Database error:", docsError);
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      );
    }

    if (!processedDocs || processedDocs.length === 0) {
      return NextResponse.json({
        answer:
          "No processed documents found. Please upload and process some documents first.",
        citations: [],
        sources: [],
      });
    }

    const docIds = processedDocs.map((doc) => doc.id);
    const docMap = new Map(processedDocs.map((doc) => [doc.id, doc]));

    // Search chunks
    const { data: chunks, error } = await supabase
      .from("document_chunks")
      .select("id, content, chunk_index, document_id")
      .in("document_id", docIds)
      .ilike("content", `%${searchQuery}%`)
      .order("chunk_index", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to search documents" },
        { status: 500 }
      );
    }

    // Format response
    const results =
      chunks?.map((chunk) => {
        const doc = docMap.get(chunk.document_id);
        return {
          chunkId: chunk.id,
          content: chunk.content,
          chunkIndex: chunk.chunk_index,
          document: {
            id: doc?.id || chunk.document_id,
            name: doc?.name || "Unknown",
            fileType: doc?.file_type || "unknown",
          },
          citation: `${doc?.name || "Unknown"} · Chunk ${
            chunk.chunk_index + 1
          }`,
        };
      }) || [];

    // Generate an intelligent answer using LLM if chunks found
    let answer: string;
    if (results.length > 0) {
      // Use LLM to synthesize answer from chunks
      answer = await generateAnswer({
        query,
        chunks: results.slice(0, 5).map((r) => ({
          content: r.content,
          documentName: r.document.name,
          chunkIndex: r.chunkIndex,
        })),
      });
    } else {
      answer =
        "I couldn't find any relevant information in your documents. Try rephrasing your question or upload more documents.";
    }

    const citations = results.map((r) => r.citation);

    return NextResponse.json({
      answer,
      citations,
      sources: results.map((r) => ({
        documentId: r.document.id,
        documentName: r.document.name,
        chunkIndex: r.chunkIndex,
        content: r.content.substring(0, 200) + "...", // Preview
      })),
    });
  } catch (error) {
    console.error("Query error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
