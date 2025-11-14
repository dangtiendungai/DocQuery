"use client";

const posts = [
  {
    title: "How we chunk documents for better grounding",
    date: "Nov 4, 2025",
    summary:
      "A deep dive on semantic splitting, overlap strategies, and why token-aware chunking matters.",
    tag: "Engineering",
  },
  {
    title: "Rolling out pgvector at scale on Supabase",
    date: "Oct 12, 2025",
    summary:
      "Lessons from indexing millions of embeddings, plus our favorite performance knobs.",
    tag: "Infra",
  },
  {
    title: "Designing trust cues into DocQuery",
    date: "Sep 29, 2025",
    summary:
      "How we surface citations, highlight context, and keep humans in the loop.",
    tag: "Product",
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
              <button className="mt-4 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                Read post →
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}


