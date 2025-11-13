"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { supabase } from "@/lib/supabaseClient";

type StatusState =
  | { variant: "idle"; message: null }
  | { variant: "success" | "error"; message: string };

const initialStatus: StatusState = { variant: "idle", message: null };

export default function RegisterPage() {
  const [status, setStatus] = useState<StatusState>(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const acceptedTos = formData.get("tos") === "on";

    if (!acceptedTos) {
      setStatus({
        variant: "error",
        message: "Please accept the Terms and Privacy Policy to continue.",
      });
      return;
    }

    if (password.length < 8) {
      setStatus({
        variant: "error",
        message: "Passwords must be at least 8 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        variant: "error",
        message: "Passwords do not match. Double-check and try again.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus(initialStatus);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company,
          },
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DOCQUERY_POST_SIGNUP_REDIRECT ??
            `${window.location.origin}/login`,
        },
      });

      if (error) {
        setStatus({
          variant: "error",
          message: error.message ?? "Unable to create account right now.",
        });
        return;
      }

      form.reset();
      setStatus({
        variant: "success",
        message:
          "Account created! Check your inbox to confirm your email before signing in.",
      });
    } catch (error) {
      setStatus({
        variant: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-0">
      <div className="mx-auto flex max-w-5xl flex-col-reverse gap-16 lg:flex-row">
        <div className="flex-1">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur">
            <h1 className="text-3xl font-semibold text-white">
              Create your DocQuery workspace
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Already have an account?{" "}
              <a
                className="text-emerald-300 hover:text-emerald-200"
                href="/login"
              >
                Sign in
              </a>
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
              <div aria-live="polite" className="min-h-[1.5rem] text-sm">
                {status.variant !== "idle" && status.message && (
                  <div
                    className={`rounded-2xl border px-4 py-3 ${
                      status.variant === "success"
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                        : "border-red-400/40 bg-red-500/10 text-red-100"
                    }`}
                  >
                    {status.message}
                  </div>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <TextField
                  id="firstName"
                  name="firstName"
                  type="text"
                  label="First name"
                  placeholder="Ada"
                  autoComplete="given-name"
                  required
                />
                <TextField
                  id="lastName"
                  name="lastName"
                  type="text"
                  label="Last name"
                  placeholder="Lovelace"
                  autoComplete="family-name"
                  required
                />
              </div>
              <TextField
                id="company"
                name="company"
                type="text"
                label="Company or team"
                placeholder="Acme Robotics"
              />
              <TextField
                id="email"
                name="email"
                type="email"
                label="Work email"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />
                <TextField
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm password"
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <input
                  type="checkbox"
                  id="tos"
                  name="tos"
                  className="h-4 w-4 rounded border border-white/15 bg-slate-950/70 accent-emerald-400"
                />
                <label htmlFor="tos">
                  I agree to the{" "}
                  <a
                    className="text-emerald-300 hover:text-emerald-200"
                    href="#"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    className="text-emerald-300 hover:text-emerald-200"
                    href="#"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating your account..." : "Create account"}
              </Button>
            </form>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-200 ring-1 ring-emerald-400/40">
            Spin up in minutes
          </span>
          <p className="text-lg text-slate-300">
            DocQuery lets teams stand up a production-ready RAG stack in less
            than a day. Connect cloud storage, choose your embedding provider,
            and invite teammates with granular access controls.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">
                Bring your stack
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Integrate Pinecone, Weaviate, or Supabase in a few clicks.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Security-first</p>
              <p className="mt-2 text-sm text-slate-300">
                SOC2-ready controls, audit trails, and regional data residency.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Collaborative</p>
              <p className="mt-2 text-sm text-slate-300">
                Shared chat transcripts with inline approvals and notes.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Compliant</p>
              <p className="mt-2 text-sm text-slate-300">
                Keep regulated documents isolated with workspace-level
                encryption keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
