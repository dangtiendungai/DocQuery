"use client";

const phases = [
  {
    label: "Q4 · 2025",
    items: [
      "Realtime collaborative chat",
      "Bring-your-own-LLM connector",
      "Granular workspace permissions",
    ],
  },
  {
    label: "Q1 · 2026",
    items: [
      "Multi-tenant analytics dashboard",
      "Human-in-the-loop review tooling",
      "Managed VPC deployments",
    ],
  },
  {
    label: "Q2 · 2026",
    items: [
      "On-prem vector store adapters",
      "Document automation APIs",
      "Native mobile experience",
    ],
  },
];

const feedbackPillars = [
  {
    title: "Customer council",
    description:
      "Monthly sync with power users to prioritize features that unblock real deployments.",
  },
  {
    title: "Public roadmap",
    description:
      "Everything is tracked openly so you can plan around upcoming releases.",
  },
  {
    title: "Fast iteration",
    description:
      "Weekly releases with changelog posts covering improvements, fixes, and experiments.",
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300">
            Shipping weekly
          </div>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            See what&apos;s shipping next
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            DocQuery evolves with the teams building on it. Here&apos;s what&apos;s
            locked in for the next few quarters.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {phases.map((phase) => (
            <div
              key={phase.label}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur"
            >
              <div className="text-sm font-semibold uppercase tracking-widest text-emerald-200">
                {phase.label}
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {feedbackPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
            >
              <h3 className="text-xl font-semibold text-white">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300">{pillar.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center">
          <p className="text-sm uppercase tracking-widest text-emerald-200">
            Have a request?
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Join the roadmap discussion
          </h2>
          <p className="mt-2 text-sm text-emerald-100/90">
            Email roadmap@docquery.app or hop into the in-product feedback panel
            to influence priorities.
          </p>
        </div>
      </div>
    </div>
  );
}


