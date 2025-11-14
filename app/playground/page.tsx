"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const scenarios = [
  {
    title: "Support copilot",
    description:
      "Load knowledge base PDFs and benchmark latency, grounding, and tone.",
  },
  {
    title: "Policy QA",
    description:
      "Upload compliance manuals and test tricky, multi-hop questions.",
  },
  {
    title: "Sales intelligence",
    description:
      "Feed battlecards + contracts to prototype RFP reply flows in minutes.",
  },
];

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState(
    "What does the onboarding checklist require?"
  );
  const [answer, setAnswer] = useState(
    "Confirm employee identity, issue hardware, schedule security + benefit training, and invite them to relevant workspaces."
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Playground
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Test RAG flows before you wire anything up
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Upload sample docs, try prompts, inspect citations, and share links
            with teammates.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-[3fr,2fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="prompt"
                className="text-sm font-medium text-slate-200"
              >
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-28 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Enter your prompt..."
              />
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-200">
                Answer preview
              </label>
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-200">
                {answer}
              </div>
            </div>
            <Button onClick={() => setAnswer(answer)} className="mt-6 w-full">
              Run in playground
            </Button>
          </div>
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.title}
                className="rounded-3xl border border-white/10 bg-slate-900/40 p-5"
              >
                <p className="text-xs uppercase tracking-widest text-emerald-200">
                  Scenario
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {scenario.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  {scenario.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Shareable links for every run
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Capture prompts, retrieved chunks, and responses so product + legal
            can review together.
          </p>
        </div>
      </div>
    </div>
  );
}
