const tiers = [
  {
    name: "Starter",
    price: "$29",
    cadence: "/month",
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
    price: "Let’s talk",
    cadence: "",
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
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100 lg:px-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
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
              }`}
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">
                  {tier.name}
                </h2>
                <p className="text-sm text-slate-300">{tier.description}</p>
                <p className="text-4xl font-semibold text-white">
                  {tier.price}
                  <span className="text-base font-medium text-slate-300">
                    {tier.cadence}
                  </span>
                </p>
              </div>
              <button
                className={`mt-6 rounded-full px-6 py-3 text-sm font-semibold transition ${
                  tier.highlighted
                    ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                    : "border border-white/15 text-white hover:border-white/25 hover:bg-white/10"
                }`}
              >
                {tier.cta}
              </button>
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
            <button className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
              Talk to sales
            </button>
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
