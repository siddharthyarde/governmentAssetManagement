/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── GAMS Brand Palette ─────────────────────────────────────
        saffron: {
          50:  "#FFF8ED",
          100: "#FFEFD0",
          200: "#FFD99D",
          300: "#FFBC62",
          400: "#FF9D27",
          500: "#E07B00",   // Primary — Saffron Orange
          600: "#C66900",
          700: "#A45400",
          800: "#7D3F00",
          900: "#5E2F00",
        },
        green: {
          50:  "#EDFDF4",
          100: "#D2FAE4",
          200: "#A6F3C8",
          300: "#6DE6A6",
          400: "#32CF7E",
          500: "#138808",   // Secondary — India Green
          600: "#0F7007",
          700: "#0B5805",
          800: "#084004",
          900: "#052E02",
        },
        gold: {
          50:  "#FFFBEA",
          100: "#FFF5C3",
          200: "#FFE87A",
          300: "#FFD633",
          400: "#FFCA0A",
          500: "#C9960C",   // Gold Accent
          600: "#A07508",
          700: "#7D5606",
          800: "#5E3E04",
          900: "#3F2A02",
        },
        // ── Neutrals ────────────────────────────────────────────────
        surface: {
          DEFAULT: "#F8F8F6",
          muted:   "#F2F2EE",
          dark:    "#E8E8E3",
        },
        // ── Semantic ────────────────────────────────────────────────
        danger:  "#C0392B",
        warning: "#E67E22",
        info:    "#E07B00",
        // ── Borders ─────────────────────────────────────────────────
        border: {
          DEFAULT: "#E2E2DC",
          strong:  "#C8C8C0",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans Devanagari",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(0,0,0,0.06), 0 2px 12px 0 rgba(0,0,0,0.04)",
        "card-hover": "0 4px 16px 0 rgba(0,0,0,0.10), 0 2px 6px 0 rgba(0,0,0,0.06)",
        bento: "0 2px 8px 0 rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
      },
      backgroundImage: {
        "saffron-gradient": "linear-gradient(135deg, #E07B00 0%, #FFB347 100%)",
        "green-gradient": "linear-gradient(135deg, #138808 0%, #27AE60 100%)",
        "gold-gradient": "linear-gradient(135deg, #C9960C 0%, #F5C842 100%)",
        "tiranga-gradient": "linear-gradient(180deg, #E07B00 0%, #FFFFFF 50%, #138808 100%)",
        "surface-gradient": "linear-gradient(135deg, #FAFAF8 0%, #F2F2EE 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
