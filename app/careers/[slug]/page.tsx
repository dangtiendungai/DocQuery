"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Code } from "lucide-react";
import { notFound } from "next/navigation";

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

export default function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

  const role = roles.find((r) => r.slug === slug);

  if (!role) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link
          href="/careers"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to careers
        </Link>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{role.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>{role.stack}</span>
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-semibold text-white md:text-5xl">
            {role.title}
          </h1>

          <div className="job-description space-y-6">
            {role.description.split(/\n\n+/).map((block, idx) => {
              const trimmed = block.trim();
              if (!trimmed) return null;

              // Handle headers
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
                        ),
                    }}
                  />
                );
              }

              // Handle lists
              if (trimmed.startsWith("- ")) {
                const items = trimmed
                  .split("\n")
                  .filter((line) => line.trim().startsWith("- "));
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
                            .replace(/^[-*] /, "")
                            .replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="font-semibold text-white">$1</strong>'
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
                    __html: trimmed.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="font-semibold text-white">$1</strong>'
                    ),
                  }}
                />
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl border border-white/10 bg-slate-950/50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-white">Benefits</h3>
            <ul className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3"
                >
                  • {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href={`mailto:careers@docquery.com?subject=Application: ${role.title}`}
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer w-full sm:w-auto"
            >
              Apply for this role
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 w-full sm:w-auto"
            >
              Questions? Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
