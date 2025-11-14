"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        // Check if error is due to unverified email
        if (signInError.message?.includes("email") && signInError.message?.includes("confirm")) {
          setError(
            "Please verify your email address before signing in. Check your inbox for the verification link."
          );
        } else {
          setError(
            signInError.message ||
              "Failed to sign in. Please check your credentials."
          );
        }
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        // Check if email is verified
        if (!data.user.email_confirmed_at) {
          setError(
            "Please verify your email address before signing in. Check your inbox for the verification link."
          );
          setIsSubmitting(false);
          return;
        }

        // Redirect to chats page or home after successful login
        const redirectTo =
          process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT || "/chats";
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message || "Failed to sign in with Google.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-0">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 lg:flex-row">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-200 ring-1 ring-emerald-400/40">
            Welcome back
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Sign in to DocQuery
          </h1>
          <p className="text-lg text-slate-300">
            Access your document knowledge base, continue conversations, and
            manage the vector store powering your teams.
          </p>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Why DocQuery
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                • Instant answers with citations for manuals, policies, and
                handbooks.
              </li>
              <li>• Team workspaces with secure access controls.</li>
              <li>• Bring your own OpenAI or Azure credentials.</li>
            </ul>
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">Log in</h2>
            <p className="mt-2 text-sm text-slate-400">
              New here?{" "}
              <a
                className="text-emerald-300 hover:text-emerald-200"
                href="/register"
              >
                Create an account
              </a>
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}
              <TextField
                id="email"
                type="email"
                label="Work email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <TextField
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  label="Password"
                  hideLabel
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-6 space-y-4">
              <Button
                type="button"
                variant="subtle"
                className="flex w-full items-center justify-center gap-3"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
              >
                <span>Continue with Google</span>
              </Button>
              <p className="text-xs text-slate-400">
                By signing in you agree to our{" "}
                <a className="text-emerald-300 hover:text-emerald-200" href="#">
                  Terms
                </a>{" "}
                and{" "}
                <a className="text-emerald-300 hover:text-emerald-200" href="#">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
