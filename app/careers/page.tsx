"use client";

import Link from "next/link";

const roles = [
  {
    slug: "founding-product-engineer",
    title: "Founding Product Engineer",
    location: "Remote (North America)",
    stack: "Next.js, Supabase, TypeScript, OpenAI",
    description: `We're looking for a founding engineer who can ship fast, think deeply about product, and help shape DocQuery's technical direction.

## What you'll do

- Build core product features end-to-end (UI, API, database)
- Work directly with customers to understand needs and iterate
- Design and implement scalable architecture for document processing
- Contribute to product strategy and technical decisions
- Write clean, maintainable code with tests

## What we're looking for

- 5+ years of full-stack development experience
- Strong TypeScript/JavaScript skills
- Experience with Next.js, React, and modern web frameworks
- Familiarity with vector databases and RAG systems
- Ability to work independently and ship quickly
- Strong product sense and customer empathy

## Nice to have

- Experience with Supabase or similar BaaS platforms
- Background in AI/ML or document processing
- Previous startup experience
- Open source contributions`,
  },
  {
    slug: "developer-relations-lead",
    title: "Developer Relations Lead",
    location: "Remote (US/EU)",
    stack: "Content, sample apps, community programs",
    description: `Help developers discover, adopt, and succeed with DocQuery. You'll be the bridge between our product and the developer community.

## What you'll do

- Create technical content (blog posts, tutorials, docs)
- Build sample applications and integrations
- Engage with developers on Discord, Twitter, and forums
- Organize community events and workshops
- Gather feedback and advocate for developer needs
- Collaborate with engineering on developer experience

## What we're looking for

- 3+ years in developer relations or technical content creation
- Strong technical writing and communication skills
- Experience building developer tools or APIs
- Active in developer communities
- Ability to code in at least one language (TypeScript preferred)
- Passion for helping developers succeed

## Nice to have

- Experience with RAG/vector search technologies
- Previous DevRel experience at a startup
- Speaking experience at conferences
- Open source maintainer experience`,
  },
  {
    slug: "customer-engineer",
    title: "Customer Engineer",
    location: "Hybrid · NYC",
    stack: "Solution design, onboarding, security reviews",
    description: `Work directly with enterprise customers to ensure they succeed with DocQuery. You'll be part engineer, part consultant, part trusted advisor.

## What you'll do

- Design custom solutions for enterprise customers
- Lead technical onboarding and implementation
- Conduct security reviews and compliance assessments
- Troubleshoot complex technical issues
- Build relationships with key customer stakeholders
- Collaborate with product and engineering on feature requests

## What we're looking for

- 5+ years in customer-facing technical roles
- Strong problem-solving and debugging skills
- Experience with enterprise software implementations
- Understanding of security and compliance requirements
- Excellent communication and presentation skills
- Ability to translate customer needs into technical solutions

## Nice to have

- Experience with document processing or RAG systems
- Security/compliance certifications (SOC2, GDPR, etc.)
- Previous customer success or solutions engineering experience
- Technical background in software engineering`,
  },
];

const benefits = [
  "Competitive salary + early equity",
  "Remote stipend + coworking budget",
  "Health, dental, and mental health coverage",
  "Quarterly onsites + annual learning grant",
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Careers
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Help teams trust their knowledge base
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            We&apos;re assembling a small, senior crew that loves building
            useful AI workflows.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {roles.map((role) => (
            <div
              key={role.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
            >
              <div className="text-xs uppercase tracking-widest text-slate-400">
                {role.location}
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {role.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300">{role.stack}</p>
              <Link
                href={`/careers/${role.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition"
              >
                View role →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-slate-900/40 p-6">
          <h2 className="text-2xl font-semibold text-white">Benefits</h2>
          <ul className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-2">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3"
              >
                • {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
