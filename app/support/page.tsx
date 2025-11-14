"use client";

const channels = [
  {
    title: "In-app chat",
    eta: "‹ 2 min",
    description: "24/7 support from a DocQuery engineer for paying teams.",
  },
  {
    title: "Email",
    eta: "Same day",
    description: "support@docquery.app for roadmap, billing, and incidents.",
  },
  {
    title: "Slack Connect",
    eta: "Live",
    description: "Dedicated channel for enterprise plans with shared triage.",
  },
];

const faqs = [
  {
    question: "How fast do you update models?",
    answer:
      "We monitor OpenAI, Anthropic, and Voyage releases weekly and roll out upgrades within 48 hours once they meet regression criteria.",
  },
  {
    question: "Do you support on-prem deployments?",
    answer:
      "Yes. Enterprise plans get a hardened Helm chart that runs inside your VPC with docs, embeddings, and vector search fully isolated.",
  },
  {
    question: "Where can I see incident history?",
    answer:
      "Visit status.docquery.app for uptime, postmortems, and upcoming maintenance windows.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Support
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Real humans on call for your launches
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            From proof-of-concept to production rollout, we embed with your team
            to keep things smooth.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {channels.map((channel) => (
            <div
              key={channel.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center"
            >
              <p className="text-xs uppercase tracking-widest text-emerald-200">
                {channel.eta}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{channel.title}</h3>
              <p className="mt-2 text-sm text-slate-300">
                {channel.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="text-2xl font-semibold text-white">
            Customer success playbook
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            <li className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              • Kickoff call to map ingestion sources, RAG use cases, and
              success metrics.
            </li>
            <li className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              • Weekly office hours to unblock devs and review analytics.
            </li>
            <li className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              • Priority escalation path with an on-call senior engineer.
            </li>
          </ul>
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-semibold text-white">FAQ</h3>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-3xl border border-white/10 bg-slate-900/40 p-5"
              >
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                  {faq.question}
                </p>
                <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


