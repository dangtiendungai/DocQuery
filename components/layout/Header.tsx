"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, ChevronDown } from "lucide-react";
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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      // Use a small delay to allow menu item clicks to execute first
      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showDropdown]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showDropdown) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserDisplayName = (): string => {
    if (!user) return "";
    const metadata = user.user_metadata || {};
    const firstName = metadata.first_name || "";
    const lastName = metadata.last_name || "";

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    // Fallback to email if no name
    return user.email?.split("@")[0] || "User";
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
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-full border border-white/15 !px-4 !py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:text-white"
                  aria-label="User menu"
                  aria-expanded={showDropdown}
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {showDropdown && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur">
                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowDropdown(false);
                          router.push("/profile");
                        }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-red-500/20 hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
          <div className="relative sm:hidden" ref={dropdownRef}>
            <Button
              variant="icon"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="rounded-full"
              aria-label="User menu"
              aria-expanded={showDropdown}
            >
              <User className="h-4 w-4" />
            </Button>

            {showDropdown && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur">
                <div className="p-2">
                  <div className="mb-2 border-b border-white/10 px-3 py-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      {getUserDisplayName()}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-300">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDropdown(false);
                      router.push("/profile");
                    }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Logout button clicked"); // Debug log
                      setShowDropdown(false);
                      handleLogout().catch((error) => {
                        console.error("Logout failed:", error);
                      });
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-red-500/20 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
