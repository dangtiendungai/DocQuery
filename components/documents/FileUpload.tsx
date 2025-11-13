"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { UploadCloud, X, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Button from "@/components/ui/Button";
import { formatFileSize } from "@/lib/documents";

interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    setError(null);

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in to upload documents");
      return;
    }

    // Validate files
    const validFiles = files.filter((file) => {
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/html"];
      const validExtensions = [".pdf", ".docx", ".txt", ".html", ".htm"];
      const extension = "." + file.name.split(".").pop()?.toLowerCase();

      if (!validTypes.includes(file.type) && !validExtensions.includes(extension)) {
        setError(`Unsupported file type: ${file.name}`);
        return false;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError(`File too large: ${file.name} (max 50MB)`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Add files to uploading state
    const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading",
    }));

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

    // Upload each file
    for (const uploadFile of newUploadingFiles) {
      await uploadFile(uploadFile.file, user.id);
    }
  };

  const uploadFile = async (file: File, userId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Update status to success
      setUploadingFiles((prev) =>
        prev.map((uf) =>
          uf.file === file
            ? { ...uf, status: "success" as const, progress: 100 }
            : uf
        )
      );

      // Remove from list after 3 seconds
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((uf) => uf.file !== file));
      }, 3000);
    } catch (error) {
      setUploadingFiles((prev) =>
        prev.map((uf) =>
          uf.file === file
            ? {
                ...uf,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : uf
        )
      );
    }
  };

  const removeUploadingFile = (file: File) => {
    setUploadingFiles((prev) => prev.filter((uf) => uf.file !== file));
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-10 text-center transition ${
          isDragging
            ? "border-emerald-400 bg-emerald-500/10"
            : "border-white/15 bg-slate-950/50"
        }`}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <UploadCloud
            className={`h-8 w-8 transition ${
              isDragging ? "text-emerald-300" : "text-emerald-300"
            }`}
            aria-hidden="true"
          />
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-lg font-semibold text-white">
            Drag & drop files or click to browse
          </p>
          <p className="text-sm text-slate-400">
            Supports PDF, DOCX, TXT, HTML (max 50 MB per upload)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.html,.htm"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="mt-6"
        >
          Select files
        </Button>
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uploadFile) => (
            <div
              key={uploadFile.file.name}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {uploadFile.status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : uploadFile.status === "error" ? (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                ) : (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                )}
                <div>
                  <p className="text-sm font-medium text-white">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatFileSize(uploadFile.file.size)}
                    {uploadFile.status === "uploading" && ` • Uploading...`}
                    {uploadFile.status === "success" && ` • Processed`}
                    {uploadFile.status === "error" && ` • ${uploadFile.error}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeUploadingFile(uploadFile.file)}
                className="text-slate-400 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

