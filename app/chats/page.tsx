import Button from "@/components/ui/Button";

const conversations = [
  {
    title: "Refund policy launch",
    description: "Latest PDF from Legal synced 2 hours ago · 12 messages",
    status: "Active",
  },
  {
    title: "Support macros revamp",
    description: "Macros handbook + Zendesk exports · 27 messages",
    status: "Updated yesterday",
  },
  {
    title: "Hardware onboarding checklist",
    description: "Notebook + SOP docs · 18 messages",
    status: "Follow-up needed",
  },
];

const suggestions = [
  "Summarize the changes between Warranty_v4 and Warranty_v5",
  "Draft a macro responding to battery replacements outside warranty",
  "Surface policies mentioning GDPR data retention",
];

const recentFiles = [
  { name: "Warranty & Returns.pdf", status: "Synced", color: "bg-emerald-400" },
  { name: "Support Playbook.md", status: "Updated", color: "bg-cyan-400" },
  {
    name: "Onboarding_Checklist.txt",
    status: "Processing",
    color: "bg-amber-400",
  },
];

export default function ChatsPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-0">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Chats</h1>
            <p className="mt-2 text-sm text-slate-400">
              Keep every retrieval session grounded and shareable across teams.
            </p>
          </div>
          <Button className="w-full rounded-full">New chat</Button>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
              Recent conversations
            </h2>
            <div className="mt-4 space-y-3">
              {conversations.map((conversation) => (
                <Button
                  key={conversation.title}
                  variant="subtle"
                  className="!flex w-full flex-col items-start gap-1 !rounded-2xl border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 hover:border-white/20 hover:bg-white/10"
                >
                  <p className="font-semibold text-white">
                    {conversation.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {conversation.description}
                  </p>
                  <span className="mt-1 inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-medium text-emerald-200">
                    {conversation.status}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="text-sm font-semibold text-white">
              Quick suggestions
            </h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-300">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="rounded-2xl border border-white/10 px-3 py-2"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  DocQuery workspace
                </h2>
                <p className="text-sm text-slate-300">
                  Ask questions across your synced manuals, knowledge bases, and
                  policies. Follow-ups stay contextualized.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full border-white/15 text-slate-200 hover:border-white/30 hover:text-white"
              >
                Manage sources
              </Button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Live conversation
              </p>
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/5 px-4 py-3 text-slate-100">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    You
                  </p>
                  <p className="mt-1">
                    Summarize the new refund process and highlight anything
                    different for EU customers.
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-emerald-100">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                    DocQuery
                  </p>
                  <p className="mt-1">
                    EU customers now receive refunds within 10 business days
                    (previously 14). Section 6.1 details shipping label
                    coverage, and Annex B covers cross-border exceptions.
                  </p>
                  <span className="mt-3 block text-xs font-medium text-emerald-200">
                    Sources: Refund_Updates.pdf §6.1 · Annex B
                  </span>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3 text-slate-100">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    You
                  </p>
                  <p className="mt-1">
                    Draft an internal announcement for the support team.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <textarea
                placeholder="Ask DocQuery anything about your knowledge base..."
                className="min-h-[120px] flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              />
              <Button className="rounded-2xl bg-emerald-400 text-slate-950 hover:bg-emerald-300 sm:self-start">
                Send
              </Button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
              Recently synced files
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {recentFiles.map((file) => (
                <div
                  key={file.name}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                >
                  <span
                    className={`inline-flex h-2 w-12 rounded-full ${file.color}`}
                  />
                  <p className="mt-3 text-sm font-semibold text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">{file.status}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
