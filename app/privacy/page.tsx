"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Privacy Policy
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-slate-400">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="mt-16 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white">
              1. Information We Collect
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              DocQuery collects information you provide directly to us,
              including:
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 text-slate-300">
              <li>Account information (name, email, company)</li>
              <li>Documents and files you upload</li>
              <li>Queries and conversations you create</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              2. How We Use Your Information
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 text-slate-300">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and store your documents for RAG queries</li>
              <li>Generate embeddings and perform vector searches</li>
              <li>Respond to your inquiries and provide support</li>
              <li>Send you technical notices and updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              3. Data Storage and Security
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Your documents and data are stored securely using Supabase. We
              implement industry-standard security measures including:
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 text-slate-300">
              <li>Encryption at rest and in transit</li>
              <li>Row-level security (RLS) policies</li>
              <li>Access controls and authentication</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              4. Data Retention
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              We retain your data for as long as your account is active or as
              needed to provide services. You can delete your documents and data
              at any time through the application interface.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              5. Your Rights
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              You have the right to:
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 text-slate-300">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Export your data</li>
              <li>Opt out of certain data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              6. Third-Party Services
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              We use third-party services including Supabase for data storage
              and OpenAI for AI features. These services have their own privacy
              policies governing the use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">7. Contact Us</h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us
              at{" "}
              <a
                href="mailto:dangtiendung.ai@outlook.com"
                className="text-emerald-300 hover:text-emerald-200"
              >
                dangtiendung.ai@outlook.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
