"use client";

import Link from "next/link";

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

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Blog
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Notes from the DocQuery team
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Shipping updates, architecture write-ups, and customer stories.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-slate-400">
                <span>{post.tag}</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span>{post.date}</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {post.title}
              </h2>
              <p className="mt-3 text-sm text-slate-300">{post.summary}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition"
              >
                Read post →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
