import { FileUp, Lock, ShieldCheck, UploadCloud } from "lucide-react";

const features = [
  {
    title: "Upload anything",
    description:
      "Drag & drop PDFs, manuals, contracts, or paste raw text in seconds.",
    icon: FileUp,
  },
  {
    title: "Context you can trust",
    description:
      "DocQuery cites the original passages so teams can verify every answer.",
    icon: ShieldCheck,
  },
  {
    title: "Fast, private, secure",
    description:
      "Process documents on your own infrastructure or keep everything in the cloud.",
    icon: Lock,
  },
];

const steps = [
  {
    number: 1,
    label: "Add your docs",
    description: "Upload files or sync a folder of knowledge.",
  },
  {
    number: 2,
    label: "Generate embeddings",
    description: "We chunk intelligently and store them in your vector DB.",
  },
  {
    number: 3,
    label: "Chat & export",
    description:
      "Ask natural language questions and download answers with citations.",
  },
];

const messages = [
  {
    role: "user",
    content: "What does this policy say about international refunds?",
  },
  {
    role: "assistant",
    content:
      "Refunds for international orders must be issued within 14 days. See Section 4.2 of the Warranty & Returns PDF for details.",
    citation: "Warranty & Returns.pdf · Section 4.2",
  },
  {
    role: "user",
    content: "Summarize the onboarding checklist in 3 bullets.",
  },
  {
    role: "assistant",
    content:
      "• Confirm employee identity and issue hardware.\n• Schedule security and benefits training.\n• Invite to project spaces in WorkOS.\nSource: Onboarding_Checklist.txt · lines 12-35",
  },
];

const uploads = [
  {
    name: "Warranty & Returns.pdf",
    size: "2.3 MB",
    status: "Processed • 142 chunks",
  },
  {
    name: "Support Playbook.md",
    size: "326 KB",
    status: "Processed • 64 chunks",
  },
  {
    name: "Onboarding_Checklist.txt",
    size: "89 KB",
    status: "Processing… 38%",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-[-10%] z-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 lg:px-12 lg:pb-32 lg:pt-24">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-200 ring-1 ring-emerald-400/40">
              DocQuery · Retrieval-Augmented Answers for your documents
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Ask your documents anything. Get answers with receipts.
            </h1>
            <p className="text-lg text-slate-300">
              DocQuery ingests PDFs, manuals, articles, or entire knowledge
              bases, then delivers grounded answers that cite the exact passages
              inside your files.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Upload your first docs
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white">
                Watch 2-min overview
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 text-sm text-slate-300 sm:grid-cols-3 sm:text-left lg:max-w-md">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-200">
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-medium text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-12 xl:grid-cols-[1.1fr_1fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Document inbox
                  </h2>
                  <p className="text-sm text-slate-300">
                    Drop files here and we&apos;ll handle parsing, chunking, and
                    embeddings.
                  </p>
                </div>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-200">
                  Vector-ready
                </span>
              </div>

              <div className="mt-6 rounded-2xl border-2 border-dashed border-white/15 bg-slate-950/50 p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <UploadCloud
                    className="h-8 w-8 text-emerald-300"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-6 space-y-2">
                  <p className="text-lg font-semibold text-white">
                    Drag & drop files or click to browse
                  </p>
                  <p className="text-sm text-slate-400">
                    Supports PDF, DOCX, TXT, HTML (max 50 MB per upload)
                  </p>
                </div>
                <div className="mt-6 flex flex-col items-center justify-center gap-2 text-xs text-slate-400 sm:flex-row">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Auto-chunking enabled
                  </span>
                  <span>Embeddings: OpenAI, Voyage, Cohere</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Recent uploads
                </h3>
                <button className="text-xs font-medium text-emerald-200 hover:text-emerald-100">
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {uploads.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/60 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">{item.size}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-300">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="grow rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Chat preview
                  </h2>
                  <p className="text-sm text-slate-300">
                    Ask follow-up questions and DocQuery keeps track of the
                    conversation.
                  </p>
                </div>
                <button className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:text-white">
                  Launch playground
                </button>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "assistant"
                        ? "bg-emerald-500/10 text-emerald-100"
                        : "bg-white/5 text-slate-100"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">
                      {message.content}
                    </p>
                    {"citation" in message && (
                      <span className="mt-3 block text-xs font-medium text-emerald-200">
                        {message.citation}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-full border border-white/10 bg-slate-950/80 px-5 py-3 text-sm text-slate-300">
                “DocQuery grounds every answer, so your customers and teammates
                always know why.”
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                Get started in minutes
              </h3>
              <div className="mt-6 flex flex-col gap-4">
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-base font-semibold text-emerald-200">
                      {step.number}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {step.label}
                      </p>
                      <p className="text-sm text-slate-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} DocQuery. Built for teams shipping RAG
            in production.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a className="transition hover:text-white" href="#">
              Product updates
            </a>
            <a className="transition hover:text-white" href="#">
              Security
            </a>
            <a className="transition hover:text-white" href="#">
              Documentation
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
