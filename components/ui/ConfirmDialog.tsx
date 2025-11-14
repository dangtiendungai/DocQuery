"use client";

import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  // Handle Escape key
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose, loading]);

  if (!open) return null;

  const variantStyles = {
    danger: {
      icon: "text-red-400",
      iconBg: "bg-red-500/20",
      confirmButton: "bg-red-500 text-white hover:bg-red-600",
    },
    warning: {
      icon: "text-amber-400",
      iconBg: "bg-amber-500/20",
      confirmButton: "bg-amber-500 text-white hover:bg-amber-600",
    },
    info: {
      icon: "text-blue-400",
      iconBg: "bg-blue-500/20",
      confirmButton: "bg-blue-500 text-white hover:bg-blue-600",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-2xl",
                styles.iconBg
              )}
            >
              <AlertTriangle className={cn("h-5 w-5", styles.icon)} />
            </div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 p-6">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="rounded-full"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={cn("rounded-full", styles.confirmButton)}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

