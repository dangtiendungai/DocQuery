export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-0">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 lg:flex-row">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-200 ring-1 ring-emerald-400/40">
            Welcome back
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Sign in to DocQuery
          </h1>
          <p className="text-lg text-slate-300">
            Access your document knowledge base, continue conversations, and
            manage the vector store powering your teams.
          </p>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Why DocQuery
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                • Instant answers with citations for manuals, policies, and
                handbooks.
              </li>
              <li>• Team workspaces with secure access controls.</li>
              <li>• Bring your own OpenAI or Azure credentials.</li>
            </ul>
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">Log in</h2>
            <p className="mt-2 text-sm text-slate-400">
              New here?{" "}
              <a
                className="text-emerald-300 hover:text-emerald-200"
                href="/register"
              >
                Create an account
              </a>
            </p>
            <form className="mt-8 space-y-6">
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
              <div>
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium text-slate-200"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
                  >
                    Forgot?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Sign in
              </button>
            </form>
            <div className="mt-6 space-y-4">
              <button className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/15">
                <span>Continue with Google</span>
              </button>
              <p className="text-xs text-slate-400">
                By signing in you agree to our{" "}
                <a className="text-emerald-300 hover:text-emerald-200" href="#">
                  Terms
                </a>{" "}
                and{" "}
                <a className="text-emerald-300 hover:text-emerald-200" href="#">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
