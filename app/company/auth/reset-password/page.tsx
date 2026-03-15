"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@gams/lib/supabase/client";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function CompanyResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/company/auth/callback?next=/company/auth/update-password`,
    });
    if (err) {
      setError(err.message);
      setStatus("error");
    } else {
      setStatus("success");
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Check your inbox</h2>
            <p className="text-sm text-gray-500 mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>. The link expires in 1 hour.
            </p>
            <Link
              href="/company/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-foreground">Reset Password</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your registered business email and we&apos;ll send you a reset link.
              </p>
            </div>

            {status === "error" && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Business Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-border bg-surface pl-9 px-3.5 py-2.5 text-sm
                               placeholder:text-muted-foreground focus:outline-none focus:ring-2
                               focus:ring-primary/30 focus:border-primary"
                  />
                </div>
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
              <Link href="/company/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
