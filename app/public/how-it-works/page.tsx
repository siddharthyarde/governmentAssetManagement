import React from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  Search, ArrowRight, CheckCircle, QrCode, Package, Calendar,
  BarChart3, ChevronRight, IndianRupee,
} from "lucide-react";

export const metadata = { title: "How It Works — GAMS" };

const STEPS_CITIZEN = [
  {
    step: "01",
    title: "Browse & Search",
    icon: Search,
    body: "Explore thousands of verified government surplus assets — from furniture to electronics — at audited prices up to 90% below market.",
    color: "#E07B00",
  },
  {
    step: "02",
    title: "Scan QR Code",
    icon: QrCode,
    body: "Scan the HMAC-signed QR code on any GAMS asset to see its full inspection history, condition rating, and chain of custody.",
    color: "#1A3A6B",
  },
  {
    step: "03",
    title: "Add to Cart & Pay",
    icon: IndianRupee,
    body: "Securely pay via Razorpay (UPI, cards, net banking). Every purchase generates an official Government Disposal Certificate.",
    color: "#138808",
  },
  {
    step: "04",
    title: "Receive via Verified Logistics",
    icon: Package,
    body: "Your asset is dispatched with tracked logistics. Scan the QR at delivery to confirm receipt and unlock your Disposal Certificate.",
    color: "#C9960C",
  },
];

const STEPS_INSTITUTION = [
  {
    step: "01",
    title: "Event Concludes",
    icon: Calendar,
    body: "A government event, expo, or program concludes. The organising ministry uploads the asset manifest to GAMS.",
    color: "#E07B00",
  },
  {
    step: "02",
    title: "Inspector Rates Assets",
    icon: BarChart3,
    body: "Certified GAMS inspectors physically examine every asset and rate it 1–10 on the Government Asset Scale (GAS).",
    color: "#1A3A6B",
  },
  {
    step: "03",
    title: "QR Codes Assigned",
    icon: QrCode,
    body: "Each asset receives a tamper-proof QR label encoding its GOI-ID, event, and inspection certificate.",
    color: "#138808",
  },
  {
    step: "04",
    title: "Institutions Get First Access",
    icon: CheckCircle,
    body: "Verified government institutions, PSUs, and NGOs get a 72-hour priority window to claim assets at cost price.",
    color: "#C9960C",
  },
  {
    step: "05",
    title: "Public Marketplace Opens",
    icon: Search,
    body: "Unclaimed assets move to the public marketplace at discounted rates, available to all registered citizens.",
    color: "#E07B00",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/public" className="flex items-center gap-2.5">
              <AshokaChakra size={30} />
              <div>
                <span className="text-sm font-black text-[#1A1A1A]">GAMS</span>
                <span className="hidden sm:block text-[9px] text-[#5A5A5A] -mt-0.5">Government Asset Management System</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              {[["Marketplace", "/public/marketplace"], ["About", "/public/about"]].map(([label, href]) => (
                <Link key={href} href={href} className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">{label}</Link>
              ))}
              <Link href="/public/login" className="text-sm font-bold border border-border px-3 py-1.5 rounded-lg hover:bg-surface">Sign In</Link>
              <Link href="/public/register" className="text-sm font-bold text-white px-4 py-2 rounded-lg bg-saffron-500 hover:bg-saffron-600">Register</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/public" className="hover:text-gray-700">Home</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">How It Works</span>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FFF8EE] to-white py-14">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-saffron-50 border border-saffron-200 px-3 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-saffron-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-saffron-700 uppercase tracking-wider">Transparent · Traceable · Compliant</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How GAMS Works
          </h1>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            From a government event asset to your institution or doorstep — every step is digitally tracked,
            legally compliant, and publicly auditable.
          </p>
        </div>
      </section>

      {/* Section 1: For Citizens */}
      <section className="py-14 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">For Citizens</p>
            <h2 className="text-2xl font-bold text-gray-900">Buy Government Assets in 4 Simple Steps</h2>
            <p className="text-sm text-gray-500 mt-2">Available to all Indian residents. No minimum purchase required.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS_CITIZEN.map(({ step, title, icon: Icon, body, color }) => (
              <div key={step} className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-5xl font-black text-gray-100 leading-none select-none">{step}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>
                  <Icon size={18} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/public/marketplace" className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-600">
              Start Browsing <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Asset Lifecycle */}
      <section className="py-14 bg-[#FFFAF4]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">Asset Lifecycle</p>
            <h2 className="text-2xl font-bold text-gray-900">From Government Event to Your Hands</h2>
            <p className="text-sm text-gray-500 mt-2">The complete 5-step journey every GAMS asset goes through.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-0 relative">
            {STEPS_INSTITUTION.map(({ step, title, icon: Icon, body, color }, i, arr) => (
              <div key={step} className="flex-1 relative flex flex-col items-center text-center p-5">
                {i < arr.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-saffron-200" />
                )}
                <div className="relative z-10 w-14 h-14 rounded-full text-white font-black text-lg flex items-center justify-center mb-3 shadow-md" style={{ background: color }}>
                  {step}
                </div>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: `${color}20` }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Traceability spotlight */}
      <section className="py-14 bg-[#1A3A6B] text-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">QR Traceability</p>
            <h2 className="text-2xl font-bold mb-4">Scan Any GAMS Asset — See Its Entire History</h2>
            <p className="text-blue-200 text-sm leading-relaxed mb-6">
              Every asset carries a tamper-proof HMAC-SHA256 signed QR code. Scan it with any smartphone camera
              or GAMS scanner to see: who inspected it, when, what rating it received, which event it came from,
              and its full chain of custody.
            </p>
            <Link href="/public/scan" className="inline-flex items-center gap-2 bg-saffron-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-saffron-600">
              Open QR Scanner <ArrowRight size={15} />
            </Link>
          </div>
          <div className="flex-shrink-0 bg-white/10 border border-white/20 rounded-2xl p-6 text-center min-w-[240px]">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
              <QrCode size={32} className="text-white" />
            </div>
            <p className="font-black text-lg">GOI-DLH001-R-FURN-2024-00003842</p>
            <p className="text-blue-300 text-xs mt-1">Example GAMS Asset ID</p>
            <div className="mt-3 space-y-1 text-left">
              {["Ministry: Finance", "Event: Republic Day 2025", "Condition: 8.2/10 (Good)", "Status: Listed for Sale"].map((line) => (
                <p key={line} className="text-xs text-blue-200 flex items-center gap-1.5">
                  <CheckCircle size={10} className="text-green-400 shrink-0" /> {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Get Started?</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">
            Join thousands of citizens and institutions already using GAMS to access quality government assets responsibly.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/public/register" className="bg-saffron-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-saffron-600 text-sm">Register as Citizen →</Link>
            <Link href="/buyer/register" className="bg-green-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-800 text-sm">Register Institution →</Link>
            <Link href="/public/marketplace" className="border border-border text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-white text-sm">Browse Marketplace</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A3A6B] text-white py-8">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <AshokaChakra size={26} />
            <p className="text-sm font-black">GAMS</p>
          </div>
          <p className="text-xs text-blue-200">© {new Date().getFullYear()} Ministry of Finance, Government of India. GFR 2017 Compliant.</p>
          <div className="flex gap-4 text-xs text-blue-300">
            <Link href="/public/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/public/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
