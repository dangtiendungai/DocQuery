"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string | null;
  }>({ type: "idle", message: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid session for password reset
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "idle", message: null });

    // Client-side validation
    if (password.length < 8) {
      setStatus({
        type: "error",
        message: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match. Please try again.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setStatus({
          type: "error",
          message:
            error.message || "Failed to reset password. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      setStatus({
        type: "success",
        message: "Password reset successfully! Redirecting to login...",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur">
            <p className="text-center text-slate-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isValidSession === false) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-white">
                Invalid reset link
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
            </div>
            <Link href="/forgot-password">
              <Button className="w-full rounded-full">
                Request new reset link
              </Button>
            </Link>
            <div className="mt-4 text-center text-sm text-slate-400">
              <Link
                href="/login"
                className="font-medium text-emerald-300 transition hover:text-emerald-200"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
              <Lock className="h-6 w-6 text-emerald-300" />
            </div>
            <h1 className="text-2xl font-semibold text-white">
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {status.type !== "idle" && status.message && (
              <div aria-live="polite" className="min-h-[1.5rem] text-sm">
                <div
                  className={`rounded-2xl border px-4 py-3 ${
                    status.type === "success"
                      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                      : "border-red-400/40 bg-red-500/10 text-red-100"
                  }`}
                >
                  {status.type === "success" && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{status.message}</span>
                    </div>
                  )}
                  {status.type === "error" && <span>{status.message}</span>}
                </div>
              </div>
            )}

            <TextField
              id="password"
              type="password"
              label="New password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting || status.type === "success"}
              autoComplete="new-password"
            />

            <TextField
              id="confirmPassword"
              type="password"
              label="Confirm new password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting || status.type === "success"}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={isSubmitting || status.type === "success"}
            >
              {isSubmitting
                ? "Resetting password..."
                : status.type === "success"
                ? "Password reset!"
                : "Reset password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
