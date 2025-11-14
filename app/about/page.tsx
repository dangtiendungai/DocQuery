"use client";

const milestones = [
  {
    year: "2023",
    text: "Started DocQuery after building internal RAG tools at a SaaS unicorn.",
  },
  {
    year: "2024",
    text: "Launched private beta, processed 10M+ chunks for design partners.",
  },
  {
    year: "2025",
    text: "Public release with Supabase vector search + conversation persistence.",
  },
];

const values = [
  {
    title: "Earn trust",
    description:
      "Ground every answer, own incidents, and keep customer data safe by default.",
  },
  {
    title: "Ship together",
    description:
      "Docs, design, and engineering swarm on outcomes—no handoffs, no silos.",
  },
  {
    title: "Stay curious",
    description:
      "Prototype wildly, measure ruthlessly, and keep learning from customers.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            About DocQuery
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            We help teams trust AI answers
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            DocQuery was founded by infra and support engineers who were tired
            of “the AI says so.” We build tools that cite sources, respect
            privacy, and stand up in production.
          </p>
        </div>

        <div className="mt-16 space-y-4 border-l border-white/10 pl-6">
          {milestones.map((milestone) => (
            <div key={milestone.year}>
              <div className="text-xs font-semibold uppercase tracking-widest text-emerald-200">
                {milestone.year}
              </div>
              <p className="mt-1 text-sm text-slate-200">{milestone.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
            >
              <h3 className="text-xl font-semibold text-white">
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-slate-900/40 p-6">
          <h2 className="text-2xl font-semibold text-white">
            Remote-first, async-native
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            We operate across NYC, Toronto, and London with quarterly onsites.
            Every decision starts in a doc, and every team has a maker schedule.
          </p>
        </div>
      </div>
    </div>
  );
}
