import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In — GAMS Citizen Portal",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-neutral-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <header className="bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary text-base font-black leading-none">G</span>
          </div>
          <span className="text-sm font-semibold text-foreground">GAMS Marketplace</span>
        </Link>
        <nav className="ml-auto flex gap-4 text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="text-primary font-medium hover:underline">
            Register
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border">
        © 2026 Government of India · GAMS Public Marketplace
      </footer>
    </div>
  );
}
