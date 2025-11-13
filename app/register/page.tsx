import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

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
                <TextField
                  id="firstName"
                  type="text"
                  label="First name"
                  placeholder="Ada"
                />
                <TextField
                  id="lastName"
                  type="text"
                  label="Last name"
                  placeholder="Lovelace"
                />
              </div>
              <TextField
                id="company"
                type="text"
                label="Company or team"
                placeholder="Acme Robotics"
              />
              <TextField
                id="email"
                type="email"
                label="Work email"
                placeholder="you@company.com"
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Create a password"
                />
                <TextField
                  id="confirmPassword"
                  type="password"
                  label="Confirm password"
                  placeholder="Repeat password"
                />
              </div>
              <Button type="submit" className="w-full">
                Create account
              </Button>
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
