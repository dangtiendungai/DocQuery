import { FileUp, ShieldCheck, Lock, Zap, Search, Bot, Code, Database } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const features = [
  {
    icon: FileUp,
    title: "Upload anything",
    description:
      "Drag & drop PDFs, DOCX files, text documents, and HTML. We extract, chunk, and process everything automatically.",
  },
  {
    icon: Search,
    title: "Semantic search",
    description:
      "Find relevant information using vector embeddings. Ask questions in natural language and get precise answers.",
  },
  {
    icon: Bot,
    title: "AI-powered answers",
    description:
      "Get intelligent responses grounded in your documents. Every answer includes citations to source material.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted citations",
    description:
      "Every response cites the original document and chunk, so you can verify every answer with confidence.",
  },
  {
    icon: Lock,
    title: "Secure & private",
    description:
      "Your documents are encrypted and stored securely. Row-level security ensures data isolation between users.",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    description:
      "Optimized vector search with pgvector delivers sub-second query responses, even with thousands of documents.",
  },
];

const useCases = [
  {
    title: "Customer Support",
    description:
      "Build AI assistants that answer questions from your knowledge base, product docs, and support articles.",
    icon: Code,
  },
  {
    title: "Internal Knowledge Base",
    description:
      "Help your team find answers in company policies, procedures, and documentation instantly.",
    icon: Database,
  },
  {
    title: "Research & Analysis",
    description:
      "Query large collections of research papers, reports, and documents to extract insights quickly.",
    icon: Search,
  },
];

const benefits = [
  {
    title: "No vendor lock-in",
    description:
      "Use your own OpenAI API key or bring your own embeddings. Your data stays in your control.",
  },
  {
    title: "Open source ready",
    description:
      "Built on open standards. Easy to extend, customize, and integrate with your existing stack.",
  },
  {
    title: "Production ready",
    description:
      "Scalable architecture with Supabase, optimized for performance and reliability from day one.",
  },
];

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
              Retrieval-Augmented
              <br />
              <span className="text-emerald-300">Generation</span> Made Simple
            </h1>
            <p className="mt-6 text-xl text-slate-300">
              Upload documents, ask questions, get answers with citations. DocQuery
              makes RAG accessible for every team.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="rounded-full">
                  Get started free
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="rounded-full">
                  Read the docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need for RAG
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            From document ingestion to intelligent answers, we handle the entire
            pipeline.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
                  <Icon className="h-6 w-6 text-emerald-300" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-slate-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="border-y border-white/10 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Built for real-world use cases
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Whether you're building support bots or internal tools, DocQuery scales
              with you.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={useCase.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
                    <Icon className="h-6 w-6 text-emerald-300" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 text-slate-300">{useCase.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-auto max-w-6xl px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Why choose DocQuery?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Built with flexibility and control in mind.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur"
            >
              <h3 className="text-xl font-semibold text-white">{benefit.title}</h3>
              <p className="mt-2 text-slate-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Upload your first document and start asking questions in minutes.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="rounded-full">
                  Create free account
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="rounded-full">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

