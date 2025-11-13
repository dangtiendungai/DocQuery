"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import { Bot, Loader2 } from "lucide-react";

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

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

interface Document {
  id: string;
  name: string;
  status: string;
  chunk_count: number;
  created_at: string;
}

export default function ChatsPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm DocQuery. Ask me anything about your uploaded documents, and I'll search through them to find relevant answers.",
    },
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/documents", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userMessage = query.trim();
    setQuery("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ query: userMessage, limit: 5 }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            citations: data.citations,
          },
        ]);
      } else {
        const error = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${error.error || "Failed to get response"}`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error querying:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-0">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr] px-6 lg:px-12">
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

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300 max-h-[500px] overflow-y-auto">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Live conversation
              </p>
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isAssistant = message.role === "assistant";
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl px-4 py-3 ${
                        isAssistant
                          ? "bg-emerald-500/10 text-emerald-100"
                          : "bg-white/5 text-slate-100"
                      }`}
                    >
                      <div className="flex gap-3">
                        {isAssistant && (
                          <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                            <Bot className="h-3 w-3" aria-hidden="true" />
                          </span>
                        )}
                        <div className="flex-1">
                          <p
                            className={`text-xs uppercase tracking-[0.2em] ${
                              isAssistant
                                ? "text-emerald-200"
                                : "text-slate-400"
                            }`}
                          >
                            {isAssistant ? "DocQuery" : "You"}
                          </p>
                          <p className="mt-1 whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                          {message.citations &&
                            message.citations.length > 0 && (
                              <div className="mt-3 space-y-1">
                                <p className="text-xs font-medium text-emerald-200">
                                  Sources:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-xs text-emerald-200/80">
                                  {message.citations.map((citation, i) => (
                                    <li key={i}>{citation}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {loading && (
                  <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-emerald-100">
                    <div className="flex gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                        <Bot className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                          DocQuery is thinking...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask DocQuery anything about your knowledge base..."
                className="min-h-[120px] flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 resize-none"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={loading || !query.trim()}
                className="rounded-2xl bg-emerald-400 text-slate-950 hover:bg-emerald-300 sm:self-start disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
              Recently synced files
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {loadingDocs ? (
                <p className="text-sm text-slate-400">Loading documents...</p>
              ) : documents.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No documents yet. Upload files from the home page!
                </p>
              ) : (
                documents.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                  >
                    <span
                      className={`inline-flex h-2 w-12 rounded-full ${
                        doc.status === "processed"
                          ? "bg-emerald-400"
                          : doc.status === "processing"
                          ? "bg-amber-400"
                          : "bg-red-400"
                      }`}
                    />
                    <p className="mt-3 text-sm font-semibold text-white">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {doc.status === "processed"
                        ? `Processed • ${doc.chunk_count} chunks`
                        : doc.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
