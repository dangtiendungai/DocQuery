"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Button from "@/components/ui/Button";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { label: "Product", href: "/product" },
  { label: "Pricing", href: "/pricing" },
  { label: "Chats", href: "/chats" },
  { label: "Docs", href: "/docs" },
];

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

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
        {!loading && (
          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <>
                <Link href="/profile">
                  <Button
                    variant="icon"
                    className="rounded-full"
                    aria-label="Profile"
                    title="Profile"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="icon"
                  onClick={handleLogout}
                  className="rounded-full"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
        {!loading && !user && (
          <Link
            href="/register"
            className="inline-flex items-center rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 sm:hidden"
          >
            Start
          </Link>
        )}
        {!loading && user && (
          <div className="flex items-center gap-2 sm:hidden">
            <Link href="/profile">
              <Button
                variant="icon"
                className="rounded-full"
                aria-label="Profile"
              >
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="icon"
              onClick={handleLogout}
              className="rounded-full"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
