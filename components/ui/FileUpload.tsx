"use client";

import { useCallback, useState } from "react";
import { UploadCloud, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface FileUploadProps {
  onUploadComplete?: (document: { id: string; name: string; chunkCount: number }) => void;
  onError?: (error: string) => void;
}

export default function FileUpload({ onUploadComplete, onError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/html"];
      const validExtensions = [".pdf", ".docx", ".txt", ".html"];
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();

      if (!validExtensions.includes(fileExt) && !validTypes.includes(file.type)) {
        const errorMsg = "Unsupported file type. Please upload PDF, DOCX, TXT, or HTML files.";
        setUploadStatus({ type: "error", message: errorMsg });
        onError?.(errorMsg);
        return;
      }

      // Validate file size (50 MB)
      if (file.size > 50 * 1024 * 1024) {
        const errorMsg = "File size exceeds 50 MB limit.";
        setUploadStatus({ type: "error", message: errorMsg });
        onError?.(errorMsg);
        return;
      }

      setUploading(true);
      setUploadStatus({ type: null, message: "" });

      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("Please log in to upload documents");
        }

        // Create form data
        const formData = new FormData();
        formData.append("file", file);

        // Upload file
        const response = await fetch("/api/documents/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setUploadStatus({
          type: "success",
          message: `Successfully uploaded ${file.name}! Processed ${data.document.chunkCount} chunks.`,
        });
        onUploadComplete?.(data.document);

        // Clear status after 5 seconds
        setTimeout(() => {
          setUploadStatus({ type: null, message: "" });
        }, 5000);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to upload file";
        setUploadStatus({ type: "error", message: errorMsg });
        onError?.(errorMsg);
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative rounded-2xl border-2 border-dashed bg-slate-950/50 p-10 text-center transition-colors",
          isDragging
            ? "border-emerald-400 bg-emerald-500/10"
            : "border-white/15",
          uploading && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.docx,.txt,.html"
          onChange={handleFileInput}
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-emerald-300" />
            ) : (
              <UploadCloud className="h-8 w-8 text-emerald-300" />
            )}
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-lg font-semibold text-white">
              {uploading
                ? "Processing document..."
                : "Drag & drop files or click to browse"}
            </p>
            <p className="text-sm text-slate-400">
              Supports PDF, DOCX, TXT, HTML (max 50 MB per upload)
            </p>
          </div>
        </label>
      </div>

      {uploadStatus.type && (
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
            uploadStatus.type === "success"
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
              : "border-red-400/40 bg-red-500/10 text-red-100"
          )}
        >
          {uploadStatus.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p>{uploadStatus.message}</p>
          <button
            onClick={() => setUploadStatus({ type: null, message: "" })}
            className="ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

