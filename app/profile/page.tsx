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
  Save,
  Loader2,
  CheckCircle2,
  Lock,
  X,
  Crown,
  Calendar,
  CreditCard,
  Settings,
  Shield,
  RefreshCw,
} from "lucide-react";
import Tabs from "@/components/ui/Tabs";
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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string | null;
  }>({ type: "idle", message: null });

  // Profile fields from user metadata
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

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

        // Fetch subscription
        await fetchSubscription();
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const fetchSubscription = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoadingSubscription(false);
        return;
      }

      const response = await fetch("/api/subscriptions", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleRefreshSubscription = async () => {
    setLoadingSubscription(true);
    await fetchSubscription();
  };

  // Handle Escape key to close password modal
  useEffect(() => {
    if (!showChangePassword) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !changingPassword) {
        setShowChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordStatus({ type: "idle", message: null });
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showChangePassword, changingPassword]);

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

  const handleChangePassword = async () => {
    setPasswordStatus({ type: "idle", message: null });

    // Validation
    if (!currentPassword) {
      setPasswordStatus({
        type: "error",
        message: "Please enter your current password",
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "New password must be at least 8 characters long",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New passwords do not match",
      });
      return;
    }

    setChangingPassword(true);

    try {
      // First, verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword,
      });

      if (signInError) {
        setPasswordStatus({
          type: "error",
          message: "Current password is incorrect",
        });
        setChangingPassword(false);
        return;
      }

      // If current password is correct, update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPasswordStatus({
          type: "error",
          message: updateError.message || "Failed to update password",
        });
        setChangingPassword(false);
        return;
      }

      setPasswordStatus({
        type: "success",
        message: "Password changed successfully!",
      });

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordStatus({ type: "idle", message: null });
      }, 2000);
    } catch (error) {
      setPasswordStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setChangingPassword(false);
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

          <Tabs
            tabs={[
              {
                id: "profile",
                label: "Profile",
                icon: <Settings className="h-4 w-4" />,
              },
              {
                id: "security",
                label: "Security",
                icon: <Shield className="h-4 w-4" />,
              },
              {
                id: "membership",
                label: "Membership",
                icon: <Crown className="h-4 w-4" />,
              },
            ]}
            defaultTab="profile"
          >
            {(activeTab) => (
              <>
                {/* Status Messages */}
                {status.type !== "idle" && status.message && (
                  <div
                    className={`mb-6 rounded-2xl border px-4 py-3 ${
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

                {activeTab === "membership" && (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white">
                        Membership
                      </h2>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="icon"
                          size="sm"
                          onClick={handleRefreshSubscription}
                          disabled={loadingSubscription}
                          className="rounded-full"
                          aria-label="Refresh subscription"
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${
                              loadingSubscription ? "animate-spin" : ""
                            }`}
                          />
                        </Button>
                        {subscription && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              subscription.status === "active"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : subscription.status === "trialing"
                                ? "bg-blue-500/20 text-blue-300"
                                : subscription.status === "past_due"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {subscription.status === "active"
                              ? "Active"
                              : subscription.status === "trialing"
                              ? "Trial"
                              : subscription.status === "past_due"
                              ? "Past Due"
                              : "Inactive"}
                          </span>
                        )}
                      </div>
                    </div>
                    {loadingSubscription ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                      </div>
                    ) : subscription ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                          <Crown className="h-5 w-5 text-emerald-400" />
                          <div className="flex-1">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                              Current Plan
                            </p>
                            <p className="mt-1 text-sm font-semibold capitalize text-white">
                              {subscription.plan}
                            </p>
                          </div>
                        </div>

                        {subscription.current_period_end && (
                          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                            <Calendar className="h-5 w-5 text-slate-400" />
                            <div className="flex-1">
                              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                {subscription.cancel_at_period_end
                                  ? "Cancels On"
                                  : "Renews On"}
                              </p>
                              <p className="mt-1 text-sm text-white">
                                {new Date(
                                  subscription.current_period_end
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        )}

                        {subscription.cancel_at_period_end && (
                          <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3">
                            <p className="text-sm text-amber-200">
                              Your subscription will cancel at the end of the
                              current billing period.
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            variant="outline"
                            onClick={() => router.push("/pricing")}
                            className="w-full rounded-full sm:w-auto"
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            {subscription.cancel_at_period_end
                              ? "Reactivate Subscription"
                              : "Manage Subscription"}
                          </Button>
                          {!subscription.cancel_at_period_end &&
                            subscription.plan !== "enterprise" && (
                              <Button
                                variant="subtle"
                                onClick={() => router.push("/pricing")}
                                className="w-full rounded-full sm:w-auto"
                              >
                                Upgrade Plan
                              </Button>
                            )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                          <p className="text-sm text-slate-300">
                            You're currently on the free plan. Upgrade to unlock
                            premium features.
                          </p>
                        </div>
                        <Button
                          onClick={() => router.push("/pricing")}
                          className="w-full rounded-full sm:w-auto"
                        >
                          <Crown className="mr-2 h-4 w-4" />
                          View Plans
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "profile" && (
                  <div className="space-y-6">
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
                            {user.email_confirmed_at
                              ? "Verified"
                              : "Unverified"}
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
                                {new Date(user.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
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
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6">
                    <h2 className="mb-4 text-lg font-semibold text-white">
                      Security Settings
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                        <Mail className="h-5 w-5 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Email Verification
                          </p>
                          <p className="mt-1 text-sm text-white">
                            {user.email_confirmed_at
                              ? "Your email is verified"
                              : "Your email is not verified"}
                          </p>
                        </div>
                        {!user.email_confirmed_at && (
                          <Link href="/verify-email">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                            >
                              Verify Email
                            </Button>
                          </Link>
                        )}
                      </div>

                      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                        <Lock className="h-5 w-5 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Password
                          </p>
                          <p className="mt-1 text-sm text-white">
                            Last updated:{" "}
                            {user.updated_at
                              ? new Date(user.updated_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "Never"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setShowChangePassword(true)}
                          size="sm"
                          className="rounded-full"
                        >
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </Tabs>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowChangePassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordStatus({ type: "idle", message: null });
              }}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20">
                    <Lock className="h-5 w-5 text-emerald-300" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Change Password
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordStatus({ type: "idle", message: null });
                  }}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                {passwordStatus.type !== "idle" && passwordStatus.message && (
                  <div
                    className={`mb-4 rounded-2xl border px-4 py-3 ${
                      passwordStatus.type === "success"
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                        : "border-red-400/40 bg-red-500/10 text-red-100"
                    }`}
                  >
                    {passwordStatus.type === "success" && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{passwordStatus.message}</span>
                      </div>
                    )}
                    {passwordStatus.type === "error" && (
                      <span>{passwordStatus.message}</span>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <TextField
                    id="currentPassword"
                    type="password"
                    label="Current password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={changingPassword}
                    autoComplete="current-password"
                  />

                  <TextField
                    id="newPassword"
                    type="password"
                    label="New password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={changingPassword}
                    autoComplete="new-password"
                  />

                  <TextField
                    id="confirmPassword"
                    type="password"
                    label="Confirm new password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={changingPassword}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-white/10 p-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordStatus({ type: "idle", message: null });
                  }}
                  disabled={changingPassword}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="rounded-full"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Change password
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
