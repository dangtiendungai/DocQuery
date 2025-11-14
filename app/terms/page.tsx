"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Terms of Service
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              By accessing or using DocQuery, you agree to be bound by these
              Terms of Service. If you disagree with any part of these terms,
              you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              2. Use of Service
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              You may use DocQuery to:
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 text-slate-300">
              <li>Upload and process documents for RAG queries</li>
              <li>Query your documents using natural language</li>
              <li>Export and share conversations</li>
            </ul>
            <p className="mt-4 text-slate-300 leading-relaxed">
              You agree not to:
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 text-slate-300">
              <li>Upload illegal, harmful, or malicious content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to reverse engineer or compromise the service</li>
              <li>
                Use the service to infringe on intellectual property rights
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              3. Account Responsibility
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              You are responsible for maintaining the security of your account
              and password. DocQuery cannot and will not be liable for any loss
              or damage from your failure to comply with this security
              obligation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              4. Content Ownership
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              You retain all ownership rights to the documents and content you
              upload to DocQuery. By uploading content, you grant us a license
              to process, store, and display that content solely for the purpose
              of providing the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              5. Service Availability
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              We strive to maintain high availability but do not guarantee
              uninterrupted access. The service may be unavailable due to
              maintenance, updates, or unforeseen circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              6. Rate Limiting
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              To ensure fair usage and system stability, we implement rate
              limits on API requests. Current limits include:
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 text-slate-300">
              <li>10 document uploads per hour</li>
              <li>100 queries per hour</li>
              <li>5 contact form submissions per hour</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              7. Termination
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              We may terminate or suspend your account immediately, without
              prior notice, for conduct that we believe violates these Terms of
              Service or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              8. Limitation of Liability
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              DocQuery is provided "as is" without warranties of any kind. We
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">
              9. Changes to Terms
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes via email or through the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white">10. Contact</h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Questions about the Terms of Service should be sent to us at{" "}
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
