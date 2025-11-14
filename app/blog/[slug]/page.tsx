"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

const posts = [
  {
    slug: "chunking-documents-for-better-grounding",
    title: "How we chunk documents for better grounding",
    date: "Nov 4, 2025",
    summary:
      "A deep dive on semantic splitting, overlap strategies, and why token-aware chunking matters.",
    tag: "Engineering",
    content: `# How we chunk documents for better grounding

At DocQuery, document chunking isn't just about splitting text—it's about preserving semantic meaning and context. Here's how we approach it.

## The Challenge

When you split a document into chunks for vector search, you risk losing critical context. A sentence about "refunds" might be split from its crucial qualifier "within 14 days," leading to incomplete or misleading answers.

## Our Approach

We use semantic chunking with intelligent overlap. Instead of fixed-size chunks, we:

1. **Respect sentence boundaries**: Never split mid-sentence
2. **Maintain context windows**: Each chunk includes surrounding context
3. **Token-aware splitting**: Optimize for embedding model token limits
4. **Overlap strategy**: 10-20% overlap between chunks to preserve context

## Why It Matters

Better chunking means:
- More accurate retrieval
- Fewer hallucinated answers
- Better citation quality
- Higher user trust

The result? Answers that are grounded in complete context, not fragments.`,
  },
  {
    slug: "pgvector-at-scale-on-supabase",
    title: "Rolling out pgvector at scale on Supabase",
    date: "Oct 12, 2025",
    summary:
      "Lessons from indexing millions of embeddings, plus our favorite performance knobs.",
    tag: "Infra",
    content: `# Rolling out pgvector at scale on Supabase

We've indexed millions of embeddings on Supabase using pgvector. Here's what we learned.

## The Setup

Supabase's pgvector extension makes it easy to store and query vector embeddings directly in PostgreSQL. But scaling to millions of vectors requires careful tuning.

## Performance Optimizations

### Index Configuration

We use IVFFlat indexes with carefully chosen parameters:

\`\`\`sql
CREATE INDEX ON document_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
\`\`\`

The \`lists\` parameter is crucial: too few and queries are slow, too many and index quality suffers.

### Query Tuning

We limit result sets and use approximate search for better performance:

\`\`\`sql
SELECT * FROM document_chunks
ORDER BY embedding <=> $1
LIMIT 10;
\`\`\`

## Lessons Learned

1. **Start with smaller lists**: Increase gradually as data grows
2. **Monitor query performance**: Use EXPLAIN ANALYZE regularly
3. **Batch operations**: Insert embeddings in batches, not one-by-one
4. **Connection pooling**: Use Supabase's connection pooler for better throughput

## Results

We're now handling 10M+ embeddings with sub-100ms query times. The key was patience, monitoring, and iterative optimization.`,
  },
  {
    slug: "designing-trust-cues-into-docquery",
    title: "Designing trust cues into DocQuery",
    date: "Sep 29, 2025",
    summary:
      "How we surface citations, highlight context, and keep humans in the loop.",
    tag: "Product",
    content: `# Designing trust cues into DocQuery

Trust is the foundation of any AI tool. Here's how we built it into DocQuery from day one.

## The Problem

Users don't trust AI answers by default. They need to see:
- Where the answer came from
- The exact source text
- Context around the answer

## Our Solution

### 1. Inline Citations

Every answer includes clickable citations that link directly to the source document and chunk. Users can verify every claim.

### 2. Highlighted Context

When viewing a document, relevant chunks are highlighted. Users see exactly what the AI used to generate the answer.

### 3. Source Transparency

We show:
- Document name and type
- Chunk index and character range
- Confidence scores (when available)

### 4. Human-in-the-Loop

Users can:
- Review all retrieved chunks
- See the reasoning process
- Provide feedback on answer quality

## The Impact

Since launching these features:
- 40% increase in answer acceptance rate
- 60% reduction in "show me the source" requests
- Higher user confidence in AI-generated answers

Trust isn't built overnight—it's earned through transparency and verification.`,
  },
];

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Note: In Next.js 15+, params is a Promise
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolved) => setSlug(resolved.slug));
  }, [params]);

  if (!slug) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <article>
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-slate-400">
            <span>{post.tag}</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>{post.date}</span>
          </div>

          <h1 className="mb-6 text-4xl font-semibold text-white md:text-5xl">
            {post.title}
          </h1>

          <div className="blog-content space-y-6">
            {post.content.split(/\n\n+/).map((block, idx) => {
              const trimmed = block.trim();
              if (!trimmed) return null;

              // Handle code blocks first (before other processing)
              if (trimmed.startsWith("```")) {
                const codeMatch = trimmed.match(/```(\w+)?\n([\s\S]*?)```/);
                if (codeMatch) {
                  const language = codeMatch[1] || "";
                  const code = codeMatch[2].trim();
                  return (
                    <pre
                      key={idx}
                      className="rounded-lg bg-slate-900 border border-white/10 p-4 overflow-x-auto my-4"
                    >
                      <code className="text-sm text-slate-300 font-mono whitespace-pre">
                        {code}
                      </code>
                    </pre>
                  );
                }
              }

              // Handle headers
              if (trimmed.startsWith("# ")) {
                return (
                  <h1
                    key={idx}
                    className="text-3xl font-semibold text-white mt-8 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: trimmed
                        .replace(/^# /, "")
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-semibold text-white">$1</strong>'
                        )
                        .replace(
                          /`(.*?)`/g,
                          '<code class="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-emerald-300">$1</code>'
                        ),
                    }}
                  />
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    className="text-2xl font-semibold text-white mt-6 mb-3"
                    dangerouslySetInnerHTML={{
                      __html: trimmed
                        .replace(/^## /, "")
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-semibold text-white">$1</strong>'
                        )
                        .replace(
                          /`(.*?)`/g,
                          '<code class="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-emerald-300">$1</code>'
                        ),
                    }}
                  />
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="text-xl font-semibold text-white mt-4 mb-2"
                    dangerouslySetInnerHTML={{
                      __html: trimmed
                        .replace(/^### /, "")
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-semibold text-white">$1</strong>'
                        )
                        .replace(
                          /`(.*?)`/g,
                          '<code class="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-emerald-300">$1</code>'
                        ),
                    }}
                  />
                );
              }

              // Handle lists
              if (trimmed.startsWith("- ") || /^\d+\. /.test(trimmed)) {
                const items = trimmed
                  .split("\n")
                  .filter(
                    (line) =>
                      line.trim().startsWith("- ") ||
                      /^\d+\. /.test(line.trim())
                  );
                return (
                  <ul
                    key={idx}
                    className="list-disc list-inside space-y-2 ml-4"
                  >
                    {items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="text-slate-300 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: item
                            .replace(/^[-*] |^\d+\. /, "")
                            .replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="font-semibold text-white">$1</strong>'
                            )
                            .replace(
                              /`(.*?)`/g,
                              '<code class="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-emerald-300">$1</code>'
                            ),
                        }}
                      />
                    ))}
                  </ul>
                );
              }

              // Regular paragraphs
              return (
                <p
                  key={idx}
                  className="text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: trimmed
                      .replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="font-semibold text-white">$1</strong>'
                      )
                      .replace(
                        /`(.*?)`/g,
                        '<code class="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-emerald-300">$1</code>'
                      ),
                  }}
                />
              );
            })}
          </div>
        </article>
      </div>
    </div>
  );
}
