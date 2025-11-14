"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$29",
    cadence: "/month",
    plan: "starter",
    description: "Launch RAG pilots with up to 5 teammates.",
    features: [
      "10k document chunks",
      "2 active chat workspaces",
      "Bring your own OpenAI key",
      "Email support",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$89",
    cadence: "/month",
    plan: "growth",
    description: "Scale teams shipping AI support and internal assistants.",
    features: [
      "100k document chunks",
      "Unlimited chat workspaces",
      "Managed embeddings & vector hosting",
      "SSO & SCIM provisioning",
      "Priority support",
    ],
    cta: "Upgrade to Growth",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Let's talk",
    cadence: "",
    plan: "enterprise",
    description: "Controls, compliance, and performance for global teams.",
    features: [
      "Unlimited ingestion volume",
      "Dedicated vector clusters",
      "Custom models & on-prem deployment",
      "Audit logs and DLP",
      "Dedicated success manager",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "What counts as a document chunk?",
    answer:
      "We automatically split your content into semantic chunks of ~500 tokens. You can view chunk counts per file and reclaim quota by archiving old uploads.",
  },
  {
    question: "Can we host DocQuery on our infrastructure?",
    answer:
      "Yes. Enterprise plans support private VPC deployments with managed updates, or a fully self-hosted option with support agreements.",
  },
  {
    question: "Which embedding providers do you support?",
    answer:
      "OpenAI, Azure OpenAI, Voyage AI, and Cohere out of the box. Enterprise customers can integrate custom endpoints.",
  },
  {
    question: "Do you offer discounts for startups or education?",
    answer:
      "We offer tailored pricing for early-stage startups, educational institutions, and nonprofits. Reach out to the sales team for details.",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    checkUser();
    checkSubscription();
    
    // Check for canceled parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("canceled") === "true") {
      // Could show a toast notification here
      window.history.replaceState({}, "", "/pricing");
    }
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const checkSubscription = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    try {
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
    }
  };

  const handleCheckout = async (tier: typeof tiers[0]) => {
    if (tier.plan === "enterprise") {
      router.push("/contact");
      return;
    }

    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setLoading(tier.plan);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login?redirect=/pricing");
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plan: tier.plan,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.error) {
        toast.error(`Error: ${data.error}`);
        setLoading(null);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to start checkout. Please try again.");
      setLoading(null);
    }
  };

  const getButtonText = (tier: typeof tiers[0]) => {
    if (loading === tier.plan) {
      return "Processing...";
    }
    if (subscription?.plan === tier.plan) {
      return "Current Plan";
    }
    return tier.cta;
  };

  const isCurrentPlan = (tier: typeof tiers[0]) => {
    return subscription?.plan === tier.plan;
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100 lg:px-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 lg:px-12">
        <header className="space-y-6 text-center">
          <span className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-200 ring-1 ring-emerald-400/40">
            Flexible pricing
          </span>
          <h1 className="text-4xl font-semibold text-white">
            Pick the plan that fits your rollout
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Whether you&apos;re starting with a pilot or rolling out RAG across
            departments, DocQuery keeps costs predictable while giving teams the
            tools they need.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur ${
                tier.highlighted
                  ? "border-emerald-400/60 bg-emerald-500/10 shadow-emerald-500/20"
                  : ""
              } ${isCurrentPlan(tier) ? "ring-2 ring-emerald-400/50" : ""}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">
                    {tier.name}
                  </h2>
                  {isCurrentPlan(tier) && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-300">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300">{tier.description}</p>
                <p className="text-4xl font-semibold text-white">
                  {tier.price}
                  <span className="text-base font-medium text-slate-300">
                    {tier.cadence}
                  </span>
                </p>
              </div>
              <Button
                className={
                  tier.highlighted
                    ? "mt-6"
                    : "mt-6 border-white/15 hover:border-white/25 hover:bg-white/10"
                }
                variant={tier.highlighted ? "primary" : "subtle"}
                onClick={() => handleCheckout(tier)}
                disabled={loading !== null || isCurrentPlan(tier)}
              >
                {loading === tier.plan ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  getButtonText(tier)
                )}
              </Button>
              <ul className="mt-8 space-y-3 text-sm text-slate-200">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 min-w-[0.5rem] rounded-full bg-emerald-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">
              Need a tailored deployment?
            </h2>
            <p className="text-sm text-slate-300">
              Our team has helped ship AI copilots for support, ops, legal, and
              product teams. We can advise on retrieval strategies, guardrails,
              and compliance requirements.
            </p>
            <Button
              className="inline-flex items-center justify-center"
              onClick={() => router.push("/contact")}
            >
              Talk to sales
            </Button>
          </div>
          <div className="space-y-4 text-sm text-slate-300">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
              >
                <p className="text-sm font-semibold text-white">
                  {faq.question}
                </p>
                <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
