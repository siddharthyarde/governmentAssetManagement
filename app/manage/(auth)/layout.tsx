import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — GAMS Management",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Tiranga top bar */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-neutral-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Header strip */}
      <header className="bg-white border-b border-border px-6 py-3 flex items-center gap-3">
        {/* Ashoka Chakra */}
        <svg viewBox="0 0 48 48" className="h-8 w-8 shrink-0" aria-hidden>
          <circle cx="24" cy="24" r="22" fill="none" stroke="#2B4BB6" strokeWidth="2" />
          <circle cx="24" cy="24" r="5" fill="none" stroke="#2B4BB6" strokeWidth="1.5" />
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x1 = 24 + 5 * Math.sin(rad);
            const y1 = 24 - 5 * Math.cos(rad);
            const x2 = 24 + 19 * Math.sin(rad);
            const y2 = 24 - 19 * Math.cos(rad);
            return `M${x1} ${y1} L${x2} ${y2}`;
          }).join(" ")}
        </svg>
        <div>
          <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Government of India
          </p>
          <p className="text-sm font-semibold text-foreground">
            Government Asset Management System
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-semibold tracking-wide">
            RESTRICTED
          </span>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border">
        © 2026 Government of India · National Informatics Centre · For authorised
        personnel only
      </footer>
    </div>
  );
}
