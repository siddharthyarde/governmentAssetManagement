"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@gams/lib/supabase/client";

export default function PublicResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/public/auth/callback?next=/public/account`,
    });
    if (error) {
      setMessage(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-neutral-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <header className="bg-white border-b border-border px-6 py-3 flex items-center gap-3">
        <Link href="/public" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary text-lg font-black leading-none">G</span>
          </div>
          <span className="text-sm font-semibold text-foreground">GAMS · Citizen Portal</span>
        </Link>
        <nav className="ml-auto flex gap-4 text-sm">
          <Link href="/public/login" className="text-muted-foreground hover:text-foreground">Sign In</Link>
          <Link href="/public/register" className="text-primary font-medium hover:underline">Register</Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
            {status === "sent" ? (
              <div className="text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-3xl">📬</span>
                </div>
                <h1 className="text-xl font-bold text-foreground mb-2">Check your inbox</h1>
                <p className="text-sm text-muted-foreground mb-1">
                  A password reset link has been sent to:
                </p>
                <p className="text-sm font-bold text-foreground mb-4">{email}</p>
                <p className="text-xs text-muted-foreground mb-6">
                  The link is valid for 1 hour. Check your spam folder if you don&apos;t see it.
                </p>
                <Link href="/public/login" className="text-sm text-primary font-semibold hover:underline">
                  ← Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-xl font-bold text-foreground">Reset Password</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your registered email address and we&apos;ll send you a reset link.
                  </p>
                </div>

                {status === "error" && (
                  <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-sm text-red-700">{message}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm
                                 placeholder:text-muted-foreground focus:outline-none focus:ring-2
                                 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white
                               hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {status === "loading" ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                <div className="mt-5 pt-5 border-t border-border text-center">
                  <Link href="/public/login" className="text-sm text-muted-foreground hover:text-foreground font-medium">
                    ← Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border">
        © 2026 Government of India · GAMS Citizen Portal
      </footer>
    </div>
  );
}
