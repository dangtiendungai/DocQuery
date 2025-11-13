import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

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
              <TextField
                id="email"
                type="email"
                label="Work email"
                placeholder="you@company.com"
              />
              <div className="space-y-2">
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
                    Forgot your password?
                  </a>
                </div>
                <TextField
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  label="Password"
                  hideLabel
                />
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
            <div className="mt-6 space-y-4">
              <Button
                variant="subtle"
                className="flex w-full items-center justify-center gap-3"
              >
                <span>Continue with Google</span>
              </Button>
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
