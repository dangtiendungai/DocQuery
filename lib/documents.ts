import { supabase } from "@/lib/supabaseClient";

export interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  chunk_count: number;
  status: "processing" | "processed" | "error";
  created_at: string;
}

/**
 * Get user's documents
 */
export async function getUserDocuments(userId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  }

  return data || [];
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

