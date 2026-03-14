"use client";

import React from "react";
import Link from "next/link";

interface GovHeaderProps {
  portalName: string;
  portalNameHi: string;
  portalType: "manage" | "company" | "public" | "buyer";
  showLanguageToggle?: boolean;
  lang?: "en" | "hi";
  onLangToggle?: () => void;
  userInitials?: string;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

// Ashoka Chakra SVG — 24 spokes, navy border wheel
function AshokaChakra({ size = 40 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.88;
  const rimWidth = size * 0.07;
  const hubR = size * 0.1;
  const spokes = 24;

  const spokeLines = Array.from({ length: spokes }).map((_, i) => {
    const angle = (i * 360) / spokes;
    const rad = (angle * Math.PI) / 180;
    const x1 = cx + hubR * Math.cos(rad);
    const y1 = cy + hubR * Math.sin(rad);
    const x2 = cx + (r - rimWidth / 2) * Math.cos(rad);
    const y2 = cy + (r - rimWidth / 2) * Math.sin(rad);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1A3A6B" strokeWidth={size * 0.025} />;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="Ashoka Chakra"
      role="img"
    >
      {/* Outer rim */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1A3A6B" strokeWidth={rimWidth} />
      {/* Inner fill */}
      <circle cx={cx} cy={cy} r={r - rimWidth} fill="white" />
      {/* Spokes */}
      {spokeLines}
      {/* Hub */}
      <circle cx={cx} cy={cy} r={hubR} fill="#1A3A6B" />
    </svg>
  );
}

const PORTAL_LABELS: Record<GovHeaderProps["portalType"], { en: string; hi: string; color: string }> = {
  manage: { en: "Management Portal", hi: "प्रबंधन पोर्टल", color: "bg-[#1A3A6B] text-white" },
  company: { en: "Supplier Portal", hi: "आपूर्तिकर्ता पोर्टल", color: "bg-saffron-600 text-white" },
  public: { en: "Citizen Marketplace", hi: "नागरिक बाज़ार", color: "bg-green-700 text-white" },
  buyer: { en: "Institutional Buyer Portal", hi: "संस्थागत क्रेता पोर्टल", color: "bg-gold-600 text-white" },
};

export function GovHeader({
  portalName,
  portalNameHi,
  portalType,
  showLanguageToggle = true,
  lang = "en",
  onLangToggle,
  userInitials,
  userName,
  userRole,
  onLogout,
}: GovHeaderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const label = PORTAL_LABELS[portalType];

  return (
    <header className="w-full bg-white border-b border-border">
      {/* Top strip — Tiranga colours */}
      <div className="tiranga-accent w-full" />

      {/* Main header row */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left — Emblem + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <AshokaChakra size={44} />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-[#5A5A5A] uppercase tracking-widest leading-none">
              {lang === "hi" ? "भारत सरकार" : "Government of India"}
            </p>
            <h1 className="text-base font-bold text-[#1A1A1A] leading-tight truncate">
              {lang === "hi"
                ? "सरकारी संपत्ति प्रबंधन प्रणाली"
                : "Govt. Asset Management System"}
            </h1>
            <p className="text-[10px] text-[#7A7A7A] leading-none mt-0.5 font-medium">
              {lang === "hi" ? "सत्यमेव जयते" : "Satyamev Jayate"}
            </p>
          </div>
        </div>

        {/* Centre — Portal badge */}
        <div className="hidden md:flex">
          <span className={`${label.color} text-xs font-semibold px-3 py-1 rounded-full`}>
            {lang === "hi" ? label.hi : label.en}
          </span>
        </div>

        {/* Right — Lang toggle + User */}
        <div className="flex items-center gap-3">
          {showLanguageToggle && (
            <button
              onClick={onLangToggle}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border text-[#3D3D3D] hover:bg-surface transition-colors"
              aria-label="Toggle language"
            >
              {lang === "en" ? "हिं" : "EN"}
            </button>
          )}

          {userInitials ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border hover:bg-surface transition-colors"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span className="w-7 h-7 rounded-full bg-saffron-100 text-saffron-700 font-bold text-xs flex items-center justify-center">
                  {userInitials}
                </span>
                <span className="hidden sm:block text-sm font-medium text-[#1A1A1A] max-w-[120px] truncate">
                  {userName}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-2xl shadow-card-hover z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">{userName}</p>
                    <p className="text-xs text-[#7A7A7A] mt-0.5">{userRole}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3D3D3D] hover:bg-surface transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); onLogout?.(); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors text-left border-t border-border"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-primary text-sm"
            >
              {lang === "hi" ? "लॉग इन करें" : "Login"}
            </Link>
          )}
        </div>
      </div>

      {/* Portal name strip on mobile */}
      <div className={`md:hidden px-4 py-1.5 text-xs font-semibold ${label.color}`}>
        {lang === "hi" ? label.hi : label.en}
      </div>
    </header>
  );
}
