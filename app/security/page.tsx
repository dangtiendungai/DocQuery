"use client";

import { Shield, Lock, KeyRound, ServerCog } from "lucide-react";

const controls = [
  {
    title: "Data encryption",
    description:
      "AES-256 encryption at rest and TLS 1.3 in transit keep every document and message private.",
    icon: Lock,
  },
  {
    title: "Granular access",
    description:
      "Workspace roles, document-level permissions, and audit trails ensure the right people see the right context.",
    icon: KeyRound,
  },
  {
    title: "Hardened infrastructure",
    description:
      "Supabase Postgres with pgvector, regional object storage, and automated backups every 12 hours.",
    icon: ServerCog,
  },
];

const certifications = [
  "SOC 2 Type II (in progress)",
  "GDPR-ready data processing",
  "Continuous vulnerability scanning",
  "Independent penetration testing",
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-200">
            Secure by design
          </div>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Built for the security reviews you run
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            DocQuery ships with encryption, RBAC, audit logging, and isolation
            controls so your compliance team can sleep at night.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {controls.map((control) => (
            <div
              key={control.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur"
            >
              <control.icon className="h-10 w-10 text-emerald-300" />
              <h3 className="mt-5 text-xl font-semibold">{control.title}</h3>
              <p className="mt-3 text-sm text-slate-300">
                {control.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur">
          <div className="flex items-start gap-4">
            <Shield className="h-12 w-12 text-emerald-300" />
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Independent assurance
              </h2>
              <p className="mt-2 text-slate-300">
                We partner with third-party assessors and continuously monitor
                the platform.
              </p>
              <ul className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-2">
                {certifications.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">Data residency</h3>
            <p className="mt-2 text-sm text-slate-300">
              Choose US or EU regions. Documents never leave your preferred
              jurisdiction, and per-tenant encryption keys isolate workloads.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">
              Incident response
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              24/7 on-call rotations, runbooks for every subsystem, and customer
              notifications within 24 hours of any material event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


