import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — GAMS Institutional Buyer Portal",
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

      <header className="bg-white border-b border-border px-6 py-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
          <span className="text-secondary text-lg font-black leading-none">G</span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">GAMS</p>
          <p className="text-sm font-semibold text-foreground">
            Institutional Buyer Portal
          </p>
        </div>
        <nav className="ml-auto flex gap-4 text-sm">
          <a href="/buyer/login" className="text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </a>
          <a href="/buyer/register" className="text-secondary font-medium hover:underline">
            Register Institution
          </a>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border">
        © 2026 Government of India · GAMS Buyer Portal · GFR 2017 Compliant
      </footer>
    </div>
  );
}
