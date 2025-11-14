"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  User,
  Mail,
  Building,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string | null;
  }>({ type: "idle", message: null });

  // Profile fields from user metadata
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push("/login");
          return;
        }

        setUser(currentUser);
        setEmail(currentUser.email || "");

        // Load user metadata
        const metadata = currentUser.user_metadata || {};
        setFirstName(metadata.first_name || "");
        setLastName(metadata.last_name || "");
        setCompany(metadata.company || "");
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setStatus({ type: "idle", message: null });

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          company: company.trim(),
        },
      });

      if (error) {
        setStatus({
          type: "error",
          message: error.message || "Failed to update profile",
        });
        setSaving(false);
        return;
      }

      setStatus({
        type: "success",
        message: "Profile updated successfully!",
      });

      // Refresh user data
      const {
        data: { user: updatedUser },
      } = await supabase.auth.getUser();
      if (updatedUser) {
        setUser(updatedUser);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus({ type: "idle", message: null });
      }, 3000);
    } catch (error) {
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur">
          <div className="mb-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
              <User className="h-8 w-8 text-emerald-300" />
            </div>
            <h1 className="text-3xl font-semibold text-white">
              Profile Settings
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Manage your account information and preferences.
            </p>
          </div>

          <div className="space-y-6">
            {/* Status Messages */}
            {status.type !== "idle" && status.message && (
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
            )}

            {/* Account Information */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Account Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-white">{email}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-300">
                    {user.email_confirmed_at ? "Verified" : "Unverified"}
                  </span>
                </div>

                {user.created_at && (
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                    <User className="h-5 w-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Member Since
                      </p>
                      <p className="mt-1 text-sm text-white">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Profile Details
              </h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    id="firstName"
                    label="First name"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={saving}
                  />
                  <TextField
                    id="lastName"
                    label="Last name"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={saving}
                  />
                </div>
                <TextField
                  id="company"
                  label="Company or team"
                  placeholder="Enter your company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save changes
                  </>
                )}
              </Button>
            </div>

            {/* Security Section */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/80 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Security
              </h2>
              <div className="space-y-3">
                <Link href="/forgot-password">
                  <Button
                    variant="outline"
                    className="w-full rounded-full sm:w-auto"
                  >
                    Change password
                  </Button>
                </Link>
                {!user.email_confirmed_at && (
                  <Link href="/verify-email">
                    <Button
                      variant="outline"
                      className="w-full rounded-full sm:w-auto"
                    >
                      Verify email address
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
