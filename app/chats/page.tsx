"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import { Bot, Loader2, Plus, FileText, Trash2, MessageSquare } from "lucide-react";

const suggestions = [
  "Summarize the changes between Warranty_v4 and Warranty_v5",
  "Draft a macro responding to battery replacements outside warranty",
  "Surface policies mentioning GDPR data retention",
];

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
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
  const [loadingConversations, setLoadingConversations] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDocuments();
    fetchConversations();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    }
  };

  const fetchConversations = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      setLoadingConversations(true);
      const response = await fetch("/api/conversations", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const response = await fetch(`/api/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const loadedMessages: Message[] = data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          citations: msg.citations || [],
        }));

        // If no messages, show welcome message
        if (loadedMessages.length === 0) {
          setMessages([
            {
              role: "assistant",
              content:
                "Hello! I'm DocQuery. Ask me anything about your uploaded documents, and I'll search through them to find relevant answers.",
            },
          ]);
        } else {
          setMessages(loadedMessages);
        }
        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const createNewConversation = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ title: "New Chat" }),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchConversations();
        setCurrentConversationId(data.conversation.id);
        setMessages([
          {
            role: "assistant",
            content:
              "Hello! I'm DocQuery. Ask me anything about your uploaded documents, and I'll search through them to find relevant answers.",
          },
        ]);
        setQuery("");
        textareaRef.current?.focus();
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        await fetchConversations();
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
          setMessages([
            {
              role: "assistant",
              content:
                "Hello! I'm DocQuery. Ask me anything about your uploaded documents, and I'll search through them to find relevant answers.",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const saveMessage = async (message: Message, conversationId: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          role: message.role,
          content: message.content,
          citations: message.citations || [],
        }),
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userMessage = query.trim();
    setQuery("");

    // Ensure we have a conversation
    let conversationId = currentConversationId;
    if (!conversationId) {
      // Create a new conversation
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ title: userMessage.substring(0, 50) }),
        });

        if (response.ok) {
          const data = await response.json();
          conversationId = data.conversation.id;
          setCurrentConversationId(conversationId);
          await fetchConversations();
        } else {
          throw new Error("Failed to create conversation");
        }
      } catch (error) {
        console.error("Error creating conversation:", error);
        return;
      }
    }

    // Ensure conversationId is set
    if (!conversationId) {
      return;
    }

    const userMsg: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    await saveMessage(userMsg, conversationId);

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
        const assistantMsg: Message = {
          role: "assistant",
          content: data.answer,
          citations: data.citations,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        await saveMessage(assistantMsg, conversationId);
      } else {
        const error = await response.json();
        const errorMsg: Message = {
          role: "assistant",
          content: `Error: ${error.error || "Failed to get response"}`,
        };
        setMessages((prev) => [...prev, errorMsg]);
        await saveMessage(errorMsg, conversationId);
      }
    } catch (error) {
      console.error("Error querying:", error);
      const errorMsg: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
      await saveMessage(errorMsg, conversationId);
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

  const handleNewChat = () => {
    createNewConversation();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    textareaRef.current?.focus();
  };

  const handleManageSources = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr] px-6 py-16 lg:px-12">
        <aside className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Chats</h1>
            <p className="mt-2 text-sm text-slate-400">
              Keep every retrieval session grounded and shareable across teams.
            </p>
          </div>
          <Button className="w-full rounded-full" onClick={handleNewChat}>
            <Plus className="mr-2 h-4 w-4" />
            New chat
          </Button>

          {/* Conversations List */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300 mb-4">
              Conversations
            </h2>
            {loadingConversations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No conversations yet. Start a new chat!
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`group flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition ${
                      currentConversationId === conv.id
                        ? "border-emerald-400/50 bg-emerald-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {conv.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-500/20 rounded"
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {documents.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                Your documents
              </h2>
              <div className="mt-4 space-y-2">
                {documents.slice(0, 5).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <FileText className="h-4 w-4 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {doc.status === "processed"
                          ? `${doc.chunk_count} chunks`
                          : doc.status}
                      </p>
                    </div>
                  </div>
                ))}
                {documents.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleManageSources}
                    className="w-full text-xs text-slate-400 hover:text-white"
                  >
                    View all ({documents.length})
                  </Button>
                )}
              </div>
            </div>
          )}

          {documents.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h2 className="text-sm font-semibold text-white">
                Quick suggestions
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <main className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  DocQuery workspace
                </h2>
                <p className="text-sm text-slate-300">
                  {documents.length > 0
                    ? "Ask questions across your synced manuals, knowledge bases, and policies. Follow-ups stay contextualized."
                    : "Upload documents to start asking questions. Go to the home page to upload your first files."}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleManageSources}
                className="rounded-full border-white/15 text-slate-200 hover:border-white/30 hover:text-white"
              >
                Manage sources
              </Button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300 max-h-[500px] overflow-y-auto">
              {messages.length > 1 && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Live conversation
                </p>
              )}
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isAssistant = message.role === "assistant";
                  return (
                    <div
                      key={message.id || index}
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

          {documents.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Recently synced files
                </h2>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleManageSources}
                  className="text-xs text-emerald-200 hover:text-emerald-100"
                >
                  Upload more
                </Button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {documents.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-white/20"
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
                    <p className="mt-3 text-sm font-semibold text-white truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {doc.status === "processed"
                        ? `Processed • ${doc.chunk_count} chunks`
                        : doc.status}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
