import Link from "next/link";

const navItems = [
  { label: "Product", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Chats", href: "/chats" },
  { label: "Docs", href: "#" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-12">
        <Link
          href="/"
          className="flex items-center text-xl font-semibold text-white"
        >
          <span>Doc</span>
          <span className="text-emerald-300">Query</span>
        </Link>
        <nav
          className="hidden items-center gap-6 text-sm text-slate-300 sm:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/login"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Get started
          </Link>
        </div>
        <Link
          href="/register"
          className="inline-flex items-center rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 sm:hidden"
        >
          Start
        </Link>
      </div>
    </header>
  );
}
