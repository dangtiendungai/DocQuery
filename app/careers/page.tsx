"use client";

const roles = [
  {
    title: "Founding Product Engineer",
    location: "Remote (North America)",
    stack: "Next.js, Supabase, TypeScript, OpenAI",
  },
  {
    title: "Developer Relations Lead",
    location: "Remote (US/EU)",
    stack: "Content, sample apps, community programs",
  },
  {
    title: "Customer Engineer",
    location: "Hybrid · NYC",
    stack: "Solution design, onboarding, security reviews",
  },
];

const benefits = [
  "Competitive salary + early equity",
  "Remote stipend + coworking budget",
  "Health, dental, and mental health coverage",
  "Quarterly onsites + annual learning grant",
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Careers
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Help teams trust their knowledge base
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            We&apos;re assembling a small, senior crew that loves building useful AI
            workflows.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {roles.map((role) => (
            <div
              key={role.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
            >
              <div className="text-xs uppercase tracking-widest text-slate-400">
                {role.location}
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {role.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300">{role.stack}</p>
              <button className="mt-4 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                View role →
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-slate-900/40 p-6">
          <h2 className="text-2xl font-semibold text-white">Benefits</h2>
          <ul className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-2">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3"
              >
                • {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


