export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-0">
      <div className="mx-auto flex max-w-5xl flex-col-reverse gap-16 lg:flex-row">
        <div className="flex-1">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur">
            <h1 className="text-3xl font-semibold text-white">
              Create your DocQuery workspace
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Already have an account?{" "}
              <a
                className="text-emerald-300 hover:text-emerald-200"
                href="/login"
              >
                Sign in
              </a>
            </p>
            <form className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="firstName"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Ada"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="lastName"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Lovelace"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  />
                </div>
              </div>
              <div>
                <label
                  className="text-sm font-medium text-slate-200"
                  htmlFor="company"
                >
                  Company or team
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="Acme Robotics"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                />
              </div>
              <div>
                <label
                  className="text-sm font-medium text-slate-200"
                  htmlFor="email"
                >
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="confirmPassword"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat password"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Create account
              </button>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <input
                  type="checkbox"
                  id="tos"
                  className="h-4 w-4 rounded border border-white/15 bg-slate-950/70 accent-emerald-400"
                />
                <label htmlFor="tos">
                  I agree to the{" "}
                  <a
                    className="text-emerald-300 hover:text-emerald-200"
                    href="#"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    className="text-emerald-300 hover:text-emerald-200"
                    href="#"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            </form>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-200 ring-1 ring-emerald-400/40">
            Spin up in minutes
          </span>
          <p className="text-lg text-slate-300">
            DocQuery lets teams stand up a production-ready RAG stack in less
            than a day. Connect cloud storage, choose your embedding provider,
            and invite teammates with granular access controls.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">
                Bring your stack
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Integrate Pinecone, Weaviate, or Supabase in a few clicks.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Security-first</p>
              <p className="mt-2 text-sm text-slate-300">
                SOC2-ready controls, audit trails, and regional data residency.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Collaborative</p>
              <p className="mt-2 text-sm text-slate-300">
                Shared chat transcripts with inline approvals and notes.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Compliant</p>
              <p className="mt-2 text-sm text-slate-300">
                Keep regulated documents isolated with workspace-level
                encryption keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
