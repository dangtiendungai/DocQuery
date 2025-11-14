import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  extractTextFromFile,
  chunkText,
  getFileType,
  type SupportedFileType,
} from "@/lib/documentProcessor";
import { generateEmbeddingsBatch, isOpenAIConfigured } from "@/lib/llm";
import { rateLimiters, getUserIdentifier } from "@/lib/rateLimit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getUserIdentifier(request);
    const rateLimitResult = await rateLimiters.upload(request, identifier);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: rateLimitResult.message || "Rate limit exceeded",
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.retryAfter?.toString() || "3600",
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(
              Date.now() + (rateLimitResult.retryAfter || 3600) * 1000
            ).toISOString(),
          },
        }
      );
    }
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const fileType = getFileType(file.name);
    if (!fileType) {
      return NextResponse.json(
        { error: "Unsupported file type. Supported: PDF, DOCX, TXT, HTML" },
        { status: 400 }
      );
    }

    // Validate file size (50 MB max)
    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 50 MB limit" },
        { status: 400 }
      );
    }

    // Extract text from file
    const text = await extractTextFromFile(file, fileType);

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from file" },
        { status: 400 }
      );
    }

    // Chunk the text
    const chunks = chunkText(text);

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        {
          error: uploadError.message || "Failed to upload file",
          details: uploadError,
        },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(fileName);

    // Save document metadata to database
    const { data: documentData, error: docError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        name: file.name,
        file_type: fileType,
        file_size: file.size,
        file_url: publicUrl,
        storage_path: fileName,
        text_content: text,
        chunk_count: chunks.length,
        status: "processed",
      })
      .select()
      .single();

    if (docError) {
      console.error("Database error:", docError);
      // Clean up uploaded file
      await supabase.storage.from("documents").remove([fileName]);
      return NextResponse.json(
        { error: "Failed to save document" },
        { status: 500 }
      );
    }

    // Generate embeddings for chunks if OpenAI is configured
    let embeddings: number[][] = [];
    if (isOpenAIConfigured()) {
      try {
        const chunkTexts = chunks.map((chunk) => chunk.content);
        // Generate embeddings in batches (OpenAI supports up to 2048 inputs per batch)
        const batchSize = 100;
        for (let i = 0; i < chunkTexts.length; i += batchSize) {
          const batch = chunkTexts.slice(i, i + batchSize);
          const batchEmbeddings = await generateEmbeddingsBatch(batch);
          embeddings.push(...batchEmbeddings);
        }
      } catch (embeddingError) {
        console.error("Error generating embeddings:", embeddingError);
        // Continue without embeddings - document will still be saved
      }
    }

    // Save chunks to database with embeddings
    const chunksToInsert = chunks.map((chunk, index) => ({
      document_id: documentData.id,
      user_id: user.id,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      start_char: chunk.startChar,
      end_char: chunk.endChar,
      token_count: Math.ceil(chunk.content.length / 4), // Estimate
      embedding: embeddings[index] || null, // Include embedding if available
    }));

    const { error: chunksError } = await supabase
      .from("document_chunks")
      .insert(chunksToInsert);

    if (chunksError) {
      console.error("Chunks insert error:", chunksError);
      // Document is saved but chunks failed - mark as error
      await supabase
        .from("documents")
        .update({ status: "error" })
        .eq("id", documentData.id);
      return NextResponse.json(
        { error: "Failed to save document chunks" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        document: {
          id: documentData.id,
          name: documentData.name,
          chunkCount: chunks.length,
          status: documentData.status,
        },
      },
      {
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": rateLimitResult.remaining?.toString() || "0",
        },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
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
