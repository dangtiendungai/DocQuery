import Link from "next/link";
import { Book, FileText, MessageSquare, Upload, Search, Code, Key, Database } from "lucide-react";

const docSections = [
  {
    title: "Getting Started",
    icon: Book,
    items: [
      { title: "Introduction", href: "#introduction" },
      { title: "Quick Start Guide", href: "#quick-start" },
      { title: "Account Setup", href: "#account-setup" },
    ],
  },
  {
    title: "Core Features",
    icon: FileText,
    items: [
      { title: "Uploading Documents", href: "#uploading" },
      { title: "Document Processing", href: "#processing" },
      { title: "Chat & Queries", href: "#chat" },
      { title: "Conversations", href: "#conversations" },
    ],
  },
  {
    title: "Configuration",
    icon: Code,
    items: [
      { title: "Environment Variables", href: "#env-vars" },
      { title: "OpenAI Setup", href: "#openai" },
      { title: "Supabase Configuration", href: "#supabase" },
    ],
  },
  {
    title: "API Reference",
    icon: Database,
    items: [
      { title: "Authentication", href: "#auth" },
      { title: "Document API", href: "#doc-api" },
      { title: "Query API", href: "#query-api" },
    ],
  },
];

const quickStartSteps = [
  {
    step: 1,
    title: "Create an account",
    description: "Sign up for a free account to get started.",
    icon: Key,
  },
  {
    step: 2,
    title: "Upload documents",
    description: "Drag and drop your PDFs, DOCX, or text files.",
    icon: Upload,
  },
  {
    step: 3,
    title: "Ask questions",
    description: "Start chatting with your documents using natural language.",
    icon: MessageSquare,
  },
  {
    step: 4,
    title: "Get answers",
    description: "Receive intelligent answers with citations to source documents.",
    icon: Search,
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Documentation
                </h2>
                <nav className="mt-6 space-y-6">
                  {docSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <div key={section.title}>
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          <Icon className="h-4 w-4" />
                          {section.title}
                        </div>
                        <ul className="mt-3 space-y-2 border-l border-white/10 pl-4">
                          {section.items.map((item) => (
                            <li key={item.title}>
                              <a
                                href={item.href}
                                className="text-sm text-slate-400 transition hover:text-emerald-300"
                              >
                                {item.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0">
            {/* Introduction */}
            <section id="introduction" className="mb-16">
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                DocQuery Documentation
              </h1>
              <p className="mt-4 text-xl text-slate-300">
                Learn how to use DocQuery to build retrieval-augmented generation
                (RAG) applications with your documents.
              </p>
            </section>

            {/* Quick Start */}
            <section id="quick-start" className="mb-16">
              <h2 className="text-3xl font-bold text-white">Quick Start</h2>
              <p className="mt-4 text-slate-300">
                Get up and running with DocQuery in minutes.
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {quickStartSteps.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                          <span className="text-sm font-semibold">{item.step}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-emerald-300" />
                            <h3 className="text-lg font-semibold text-white">
                              {item.title}
                            </h3>
                          </div>
                          <p className="mt-2 text-sm text-slate-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Account Setup */}
            <section id="account-setup" className="mb-16">
              <h2 className="text-3xl font-bold text-white">Account Setup</h2>
              <div className="mt-6 space-y-4 text-slate-300">
                <p>
                  To get started with DocQuery, you&apos;ll need to create an account.
                  You can sign up using:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Email and password</li>
                  <li>Google OAuth (single sign-on)</li>
                </ul>
                <p>
                  Once registered, verify your email address to activate your account.
                </p>
              </div>
            </section>

            {/* Uploading Documents */}
            <section id="uploading" className="mb-16">
              <h2 className="text-3xl font-bold text-white">Uploading Documents</h2>
              <div className="mt-6 space-y-4 text-slate-300">
                <p>
                  DocQuery supports multiple file formats for document upload:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong>PDF</strong> - Portable Document Format files
                  </li>
                  <li>
                    <strong>DOCX</strong> - Microsoft Word documents
                  </li>
                  <li>
                    <strong>TXT</strong> - Plain text files
                  </li>
                  <li>
                    <strong>HTML</strong> - HTML documents
                  </li>
                </ul>
                <p className="mt-4">
                  <strong>File size limit:</strong> 50 MB per file
                </p>
                <p>
                  After uploading, documents are automatically processed:
                </p>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>Text extraction from the file</li>
                  <li>Semantic chunking into smaller pieces</li>
                  <li>Embedding generation (if OpenAI is configured)</li>
                  <li>Storage in the vector database</li>
                </ol>
              </div>
            </section>

            {/* Document Processing */}
            <section id="processing" className="mb-16">
              <h2 className="text-3xl font-bold text-white">Document Processing</h2>
              <div className="mt-6 space-y-4 text-slate-300">
                <p>
                  Documents go through several processing stages:
                </p>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-white">1. Text Extraction</h3>
                      <p className="mt-1 text-sm">
                        Text is extracted from the uploaded file using specialized
                        parsers for each file type.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">2. Chunking</h3>
                      <p className="mt-1 text-sm">
                        Text is split into semantic chunks that preserve context and
                        meaning.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">3. Embedding Generation</h3>
                      <p className="mt-1 text-sm">
                        If OpenAI API key is configured, embeddings are generated for
                        each chunk to enable semantic search.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">4. Storage</h3>
                      <p className="mt-1 text-sm">
                        Documents and chunks are stored in Supabase with vector
                        support for fast similarity search.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Chat & Queries */}
            <section id="chat" className="mb-16">
              <h2 className="text-3xl font-bold text-white">Chat & Queries</h2>
              <div className="mt-6 space-y-4 text-slate-300">
                <p>
                  Ask questions about your documents using natural language. DocQuery
                  will:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Search for relevant document chunks using vector similarity</li>
                  <li>Generate intelligent answers using OpenAI (if configured)</li>
                  <li>Provide citations to source documents</li>
                </ul>
                <p className="mt-4">
                  <strong>Tip:</strong> Be specific in your questions for better
                  results. For example, instead of &quot;What does it say?&quot;,
                  try &quot;What does the refund policy say about international
                  orders?&quot;
                </p>
              </div>
            </section>

            {/* Conversations */}
            <section id="conversations" className="mb-16">
              <h2 className="text-3xl font-bold text-white">Conversations</h2>
              <div className="mt-6 space-y-4 text-slate-300">
                <p>
                  DocQuery automatically saves your chat conversations. You can:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Create multiple conversations for different topics</li>
                  <li>Switch between conversations</li>
                  <li>Delete conversations you no longer need</li>
                </ul>
                <p className="mt-4">
                  All conversations are persisted and available across sessions.
                </p>
              </div>
            </section>

            {/* Environment Variables */}
            <section id="env-vars" className="mb-16">
              <h2 className="text-3xl font-bold text-white">Environment Variables</h2>
              <div className="mt-6 space-y-4 text-slate-300">
                <p>Required environment variables:</p>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                  <code className="block text-sm text-emerald-300">
                    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
                    <br />
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
                  </code>
                </div>
                <p>Optional (for AI features):</p>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                  <code className="block text-sm text-emerald-300">
                    OPENAI_API_KEY=your_openai_api_key
                  </code>
                </div>
              </div>
            </section>

            {/* OpenAI Setup */}
            <section id="openai" className="mb-16">
              <h2 className="text-3xl font-bold text-white">OpenAI Setup</h2>
              <div className="mt-6 space-y-4 text-slate-300">
                <p>
                  To enable AI-powered answers and embeddings, configure your OpenAI
                  API key:
                </p>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>Get an API key from{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-300 hover:text-emerald-200"
                    >
                      OpenAI Platform
                    </a>
                  </li>
                  <li>Add it to your environment variables as <code className="rounded bg-slate-800 px-1.5 py-0.5 text-emerald-300">OPENAI_API_KEY</code></li>
                  <li>Restart your application</li>
                </ol>
                <p className="mt-4">
                  <strong>Note:</strong> Without an OpenAI API key, DocQuery will still
                  work but will use simple text search instead of semantic search and
                  AI-generated answers.
                </p>
              </div>
            </section>

            {/* Supabase Configuration */}
            <section id="supabase" className="mb-16">
              <h2 className="text-3xl font-bold text-white">Supabase Configuration</h2>
              <div className="mt-6 space-y-4 text-slate-300">
                <p>To set up Supabase:</p>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>Create a new Supabase project</li>
                  <li>Run the database migrations from <code className="rounded bg-slate-800 px-1.5 py-0.5 text-emerald-300">supabase/migrations/</code></li>
                  <li>Create a storage bucket named &quot;documents&quot;</li>
                  <li>Configure Row Level Security (RLS) policies</li>
                  <li>Add your Supabase URL and anon key to environment variables</li>
                </ol>
              </div>
            </section>

            {/* API Reference */}
            <section id="auth" className="mb-16">
              <h2 className="text-3xl font-bold text-white">API Reference</h2>
              <div className="mt-6 space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white">Authentication</h3>
                  <p className="mt-2 text-slate-300">
                    All API requests require authentication via Bearer token in the
                    Authorization header:
                  </p>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <code className="text-sm text-emerald-300">
                      Authorization: Bearer YOUR_ACCESS_TOKEN
                    </code>
                  </div>
                </div>

                <div id="doc-api">
                  <h3 className="text-xl font-semibold text-white">Document API</h3>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <code className="text-sm font-semibold text-emerald-300">
                        GET /api/documents
                      </code>
                      <p className="mt-2 text-sm text-slate-300">
                        Fetch all documents for the authenticated user.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <code className="text-sm font-semibold text-emerald-300">
                        POST /api/documents/upload
                      </code>
                      <p className="mt-2 text-sm text-slate-300">
                        Upload and process a new document.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <code className="text-sm font-semibold text-emerald-300">
                        DELETE /api/documents/[id]
                      </code>
                      <p className="mt-2 text-sm text-slate-300">
                        Delete a document and all its chunks.
                      </p>
                    </div>
                  </div>
                </div>

                <div id="query-api">
                  <h3 className="text-xl font-semibold text-white">Query API</h3>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <code className="text-sm font-semibold text-emerald-300">
                      POST /api/query
                    </code>
                    <p className="mt-2 text-sm text-slate-300">
                      Query documents and get AI-powered answers with citations.
                    </p>
                    <div className="mt-4 rounded-lg bg-slate-800/50 p-3">
                      <p className="text-xs font-semibold text-slate-400">Request body:</p>
                      <code className="mt-1 block text-xs text-emerald-300">
                        {`{ "query": "your question", "limit": 5 }`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="mb-16 rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
              <p className="mt-2 text-slate-300">
                Create your account and start uploading documents today.
              </p>
              <div className="mt-6">
                <Link href="/register">
                  <button className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                    Get started free
                  </button>
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

