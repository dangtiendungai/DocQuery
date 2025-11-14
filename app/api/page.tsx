"use client";

const endpoints = [
  {
    name: "POST /v1/documents",
    description: "Upload a document, auto-extract text, and return a document id.",
    sample: `curl -X POST https://api.docquery.app/v1/documents \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -F file=@handbook.pdf`,
  },
  {
    name: "POST /v1/query",
    description:
      "Send a natural language query and receive an answer with citations.",
    sample: `curl -X POST https://api.docquery.app/v1/query \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"query":"What is our refund policy?"}'`,
  },
  {
    name: "GET /v1/conversations/:id",
    description:
      "Fetch the full conversation history, including messages and sources.",
  },
];

const sdks = [
  {
    title: "TypeScript SDK",
    description: "Typed client for Node and browser apps.",
    status: "Available",
  },
  {
    title: "Python SDK",
    description: "Async client ideal for back-office automations.",
    status: "Beta",
  },
  {
    title: "Go SDK",
    description: "Lightweight client for infra teams.",
    status: "Planned",
  },
];

export default function ApiPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Public API
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Build DocQuery into your own tools
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            REST + Webhooks + SDKs so you can orchestrate ingestion, search, and
            chat anywhere.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.name}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-emerald-200">
                Endpoint
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {endpoint.name}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {endpoint.description}
              </p>
              {endpoint.sample && (
                <pre className="mt-4 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs text-emerald-200">
                  <code>{endpoint.sample}</code>
                </pre>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {sdks.map((sdk) => (
            <div
              key={sdk.title}
              className="rounded-3xl border border-white/10 bg-slate-900/50 p-6"
            >
              <div className="text-xs uppercase tracking-widest text-slate-400">
                {sdk.status}
              </div>
              <h4 className="mt-2 text-xl font-semibold">{sdk.title}</h4>
              <p className="mt-2 text-sm text-slate-300">{sdk.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Need a webhook event?
          </h2>
          <p className="mt-2 text-sm text-emerald-100">
            Email api@docquery.app with your use case. We love building
            integrations.
          </p>
        </div>
      </div>
    </div>
  );
}


