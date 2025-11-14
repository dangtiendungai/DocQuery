"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

function PricingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const verifySubscription = async () => {
      if (!sessionId) {
        setError("No session ID provided");
        setLoading(false);
        return;
      }

      try {
        setVerifying(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setError("Please log in to verify your subscription");
          setLoading(false);
          setVerifying(false);
          return;
        }

        // Verify and sync subscription from Stripe
        const response = await fetch("/api/subscriptions/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Subscription verified and activated!");
        } else if (response.ok && !data.success) {
          // Session exists but no subscription yet - webhook will handle it
          toast.info(
            "Payment successful! Your subscription will be activated shortly."
          );
        } else {
          console.error("Verification error:", data.error);
          toast.warning(
            "Payment successful, but subscription verification is pending. Please refresh in a moment."
          );
        }
      } catch (error) {
        console.error("Error verifying subscription:", error);
        toast.warning(
          "Payment successful! If your subscription doesn't appear, please contact support."
        );
      } finally {
        setLoading(false);
        setVerifying(false);
      }
    };

    verifySubscription();
  }, [sessionId]);

  if (loading || verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-sm text-slate-300">
            {verifying ? "Verifying your subscription..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-semibold text-white">Error</h1>
          <p className="text-slate-300">{error}</p>
          <Button onClick={() => router.push("/pricing")}>
            Back to Pricing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-semibold text-white">
          Payment Successful!
        </h1>
        <p className="text-slate-300">
          Thank you for your subscription. Your account has been upgraded and
          you now have access to all premium features.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => router.push("/chats")}>Go to Dashboard</Button>
          <Button variant="subtle" onClick={() => router.push("/pricing")}>
            View Plans
          </Button>
        </div>
        <p className="text-xs text-slate-400">
          Session ID: {sessionId?.substring(0, 20)}...
        </p>
      </div>
    </div>
  );
}

export default function PricingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      }
    >
      <PricingSuccessContent />
    </Suspense>
  );
}
