"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <h1 className="text-2xl font-semibold text-white">
                Something went wrong
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                We encountered an unexpected error. Don't worry, your data is
                safe.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-xs font-mono text-red-400">
                    {this.state.error.toString()}
                  </p>
                  {this.state.error.stack && (
                    <pre className="mt-2 overflow-auto text-xs text-slate-400">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={this.handleReset}
                  className="rounded-full"
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
                <Link href="/">
                  <Button className="rounded-full" variant="outline">
                    <Home className="mr-2 h-4 w-4" />
                    Go home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
