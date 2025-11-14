"use client";

import { useState } from "react";

const offices = [
  { city: "New York", info: "123 Varick St · Suite 5F" },
  { city: "Toronto", info: "325 Front St W · 7th floor" },
  { city: "London", info: "67-71 Shoreditch High St" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Contact us
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Let&apos;s talk about your documents
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Sales, partnerships, press—whatever you&apos;re working on, we&apos;d love to
            hear it.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <form className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
            {(["name", "email", "company"] as const).map((field) => (
              <div key={field}>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {field}
                </label>
                <input
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 h-32 w-full rounded-2xl border border-white/15 bg-slate-950/60 p-4 text-sm text-white outline-none focus:border-emerald-400"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Send message
            </button>
          </form>
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6">
              <h3 className="text-xl font-semibold text-white">Offices</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {offices.map((office) => (
                  <div key={office.city}>
                    <p className="font-semibold">{office.city}</p>
                    <p>{office.info}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6">
              <h3 className="text-xl font-semibold text-white">
                Direct contacts
              </h3>
              <p className="mt-3 text-sm text-slate-300">
                sales@docquery.app · partnerships@docquery.app · press@
                docquery.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


