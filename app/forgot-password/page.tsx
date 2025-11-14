"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string | null;
  }>({ type: "idle", message: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "idle", message: null });
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        setStatus({
          type: "error",
          message:
            error.message || "Failed to send reset email. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      setStatus({
        type: "success",
        message:
          "Check your email for a password reset link. If you don't see it, check your spam folder.",
      });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Mail className="h-6 w-6 text-emerald-300" />
            </div>
            <h1 className="text-2xl font-semibold text-white">
              Forgot your password?
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Enter your email address and we'll send you a link to reset your
              password.
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
                  {status.message}
                </div>
              </div>
            )}

            <TextField
              id="email"
              type="email"
              label="Email address"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting || status.type === "success"}
              autoComplete="email"
            />

            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={isSubmitting || status.type === "success"}
            >
              {isSubmitting
                ? "Sending..."
                : status.type === "success"
                ? "Email sent!"
                : "Send reset link"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-300 transition hover:text-emerald-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
