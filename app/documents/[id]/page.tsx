"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Download, FileText, Loader2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface Document {
  id: string;
  name: string;
  file_type: string;
  file_size: number;
  chunk_count: number;
  status: string;
  text_content: string;
  created_at: string;
}

interface Chunk {
  id: string;
  chunk_index: number;
  content: string;
  start_char: number;
  end_char: number;
}

export default function DocumentViewerPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [highlightedChunkIndex, setHighlightedChunkIndex] = useState<number | null>(null);

  useEffect(() => {
    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  // Check for chunk highlight from query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chunkIndex = urlParams.get("chunk");
    if (chunkIndex) {
      setHighlightedChunkIndex(parseInt(chunkIndex, 10));
      // Scroll to highlighted chunk after a brief delay
      setTimeout(() => {
        const element = window.document.getElementById(`chunk-${chunkIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    }
  }, [chunks]);

  const fetchDocument = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch(`/api/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("Document not found");
        } else {
          setError("Failed to load document");
        }
        return;
      }

      const data = await response.json();
      setDocument(data.document);
      setChunks(data.chunks || []);
    } catch (error) {
      console.error("Error fetching document:", error);
      setError("An error occurred while loading the document");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setDownloading(true);

      const response = await fetch(`/api/documents/${documentId}/download`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate download URL");
      }

      const data = await response.json();

      // Create a temporary link and trigger download
      const link = window.document.createElement("a");
      link.href = data.url;
      link.download = data.filename;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      toast.success("Document download started");
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to documents
          </Link>
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {error || "Document not found"}
                </h1>
                <p className="mt-2 text-sm text-slate-300">
                  The document you're looking for doesn't exist or you don't have
                  permission to view it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to documents
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-emerald-400" />
                <h1 className="text-2xl font-semibold text-white">{document.name}</h1>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span>{formatFileSize(document.file_size)}</span>
                <span>•</span>
                <span className="uppercase">{document.file_type}</span>
                <span>•</span>
                <span>
                  {document.chunk_count} {document.chunk_count === 1 ? "chunk" : "chunks"}
                </span>
                <span>•</span>
                <span>
                  {new Date(document.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button
              onClick={handleDownload}
              disabled={downloading}
              variant="outline"
              className="rounded-full"
            >
              {downloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Document Content</h2>
            <span className="text-xs text-slate-400">
              {chunks.length} {chunks.length === 1 ? "chunk" : "chunks"}
            </span>
          </div>

          {chunks.length === 0 ? (
            <p className="text-slate-400">No chunks available for this document.</p>
          ) : (
            <div className="space-y-6">
              {chunks.map((chunk) => (
                <div
                  key={chunk.id}
                  id={`chunk-${chunk.chunk_index}`}
                  className={`rounded-2xl border p-6 transition ${
                    highlightedChunkIndex === chunk.chunk_index
                      ? "border-emerald-400/50 bg-emerald-500/10"
                      : "border-white/10 bg-slate-950/80"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                      Chunk {chunk.chunk_index + 1}
                    </span>
                    <span className="text-xs text-slate-400">
                      Characters {chunk.start_char}-{chunk.end_char}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
                    {chunk.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Raw Text View (Collapsible) */}
        {document.text_content && (
          <details className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60">
            <summary className="cursor-pointer p-6 text-sm font-semibold text-white">
              View Raw Text
            </summary>
            <div className="border-t border-white/10 p-6">
              <pre className="whitespace-pre-wrap text-sm text-slate-300">
                {document.text_content}
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

