"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error" | "verified";
    message: string | null;
  }>({ type: "idle", message: null });
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if email is in URL params
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }

    // Check current session and verification status
    const checkVerification = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          if (session.user.email_confirmed_at) {
            setStatus({
              type: "verified",
              message: "Your email has been verified! Redirecting to login...",
            });
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          } else {
            setEmail(session.user.email || emailParam || "");
            setStatus({
              type: "idle",
              message: null,
            });
          }
        }
      } catch (error) {
        console.error("Error checking verification:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkVerification();

    // Listen for auth state changes (e.g., when user clicks verification link)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        setStatus({
          type: "verified",
          message: "Your email has been verified! Redirecting to login...",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams, router]);

  const handleResend = async () => {
    if (!email.trim()) {
      setStatus({
        type: "error",
        message: "Please enter your email address.",
      });
      return;
    }

    setIsResending(true);
    setStatus({ type: "idle", message: null });

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setStatus({
          type: "error",
          message: error.message || "Failed to resend verification email.",
        });
        setIsResending(false);
        return;
      }

      setStatus({
        type: "success",
        message:
          "Verification email sent! Check your inbox (and spam folder) for the confirmation link.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
      setIsResending(false);
    } finally {
      setIsResending(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur">
            <p className="text-center text-slate-400">Checking verification status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status.type === "verified") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
              <CheckCircle2 className="h-6 w-6 text-emerald-300" />
            </div>
            <h1 className="text-2xl font-semibold text-white">
              Email verified!
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              {status.message}
            </p>
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
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20">
              <Mail className="h-6 w-6 text-amber-300" />
            </div>
            <h1 className="text-2xl font-semibold text-white">
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              We've sent a verification link to your email address. Please check
              your inbox and click the link to verify your account.
            </p>
          </div>

          <div className="space-y-6">
            <div aria-live="polite" className="min-h-[1.5rem] text-sm">
              {status.type !== "idle" && status.message && (
                <div
                  className={`rounded-2xl border px-4 py-3 ${
                    status.type === "success"
                      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                      : "border-red-400/40 bg-red-500/10 text-red-100"
                  }`}
                >
                  {status.message}
                </div>
              )}
            </div>

            {email && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Email address
                </p>
                <p className="mt-1 text-sm text-white">{email}</p>
              </div>
            )}

            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-300" />
                <div className="text-sm text-amber-100">
                  <p className="font-medium">Didn't receive the email?</p>
                  <p className="mt-1 text-amber-200/80">
                    Check your spam folder, or click the button below to resend
                    the verification email.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleResend}
              disabled={isResending || !email.trim()}
              className="w-full rounded-full"
            >
              {isResending ? "Sending..." : "Resend verification email"}
            </Button>

            <div className="text-center text-sm text-slate-400">
              Already verified?{" "}
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
    </div>
  );
}

