"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  Package,
  Upload,
  QrCode,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  FileText,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Truck,
  AlertCircle,
  Download,
  IndianRupee,
  Layers,
  ClipboardList,
  LogIn,
} from "lucide-react";

// ─── Company Nav ──────────────────────────────────────────────────────────────

function CompanyNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-border">
      <div className="h-1" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <AshokaChakra size={38} />
            <div>
              <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest leading-none">
                भारत सरकार / Government of India
              </p>
              <p className="text-base font-bold text-gray-900 leading-tight">
                GAMS{" "}
                <span className="text-xs font-semibold text-saffron-600 bg-saffron-50 border border-saffron-200 px-2 py-0.5 rounded ml-1">
                  {lang === "en" ? "Supplier Portal" : "आपूर्तिकर्ता पोर्टल"}
                </span>
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/how-it-works" className="hover:text-saffron-600 transition-colors">
              {lang === "en" ? "How It Works" : "यह कैसे काम करता है"}
            </Link>
            <Link href="/guidelines" className="hover:text-saffron-600 transition-colors">
              {lang === "en" ? "Guidelines" : "दिशा-निर्देश"}
            </Link>
            <Link href="/support" className="hover:text-saffron-600 transition-colors">
              {lang === "en" ? "Support" : "सहायता"}
            </Link>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold border border-border rounded px-2 py-1 hover:bg-surface transition-colors"
            >
              <span>{lang === "en" ? "हिं" : "EN"}</span>
            </button>

            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-saffron-700 border border-saffron-300 rounded px-3 py-1.5 hover:bg-saffron-50 transition-colors"
            >
              <LogIn size={15} />
              {lang === "en" ? "Login" : "लॉगिन"}
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 text-sm font-bold text-white rounded px-4 py-1.5 transition-colors"
              style={{ background: "#E07B00" }}
            >
              {lang === "en" ? "Register Company" : "कंपनी पंजीकरण"}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded border border-border hover:bg-surface"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-border py-3 flex flex-col gap-3 text-sm font-medium text-gray-700">
            <Link href="/how-it-works" className="hover:text-saffron-600">How It Works</Link>
            <Link href="/guidelines" className="hover:text-saffron-600">Guidelines</Link>
            <Link href="/support" className="hover:text-saffron-600">Support</Link>
            <Link href="/login" className="hover:text-saffron-600">Login</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Register Your Company",
    titleHi: "कंपनी पंजीकरण करें",
    desc: "Fill in your company details — GSTIN, CIN, authorized signatory, bank account, and upload documents via DigiLocker or manual upload.",
    icon: <Building2 size={24} />,
    color: "#E07B00",
  },
  {
    num: "02",
    title: "Receive Government Approval",
    titleHi: "सरकारी अनुमोदन प्राप्त करें",
    desc: "Your registration is reviewed by the assigned ministry/department admin. Approved companies receive a unique Company Code and system access.",
    icon: <ShieldCheck size={24} />,
    color: "#138808",
  },
  {
    num: "03",
    title: "List Products & Upload in Bulk",
    titleHi: "उत्पाद सूचीबद्ध करें और बल्क में अपलोड करें",
    desc: "Add individual products or upload a CSV for thousands of items. Each product gets a unique GOI-ID. Items above ₹5,000 are tracked individually.",
    icon: <Upload size={24} />,
    color: "#C9960C",
  },
  {
    num: "04",
    title: "Download & Attach QR Codes",
    titleHi: "QR कोड डाउनलोड करें और संलग्न करें",
    desc: "Download print-ready QR label sheets (A4 or Dymo format). Attach to every product unit before delivery to the government warehouse.",
    icon: <QrCode size={24} />,
    color: "#E07B00",
  },
  {
    num: "05",
    title: "Confirm Delivery",
    titleHi: "डिलीवरी की पुष्टि करें",
    desc: "Scan products at the warehouse gate to confirm quantities delivered. Flag any manufacturing defects before handover.",
    icon: <Truck size={24} />,
    color: "#138808",
  },
  {
    num: "06",
    title: "Track Order History",
    titleHi: "ऑर्डर इतिहास ट्रैक करें",
    desc: "Monitor which events your products were assigned to, view repair cost tallies, and download lifecycle reports for any product or batch.",
    icon: <BarChart3 size={24} />,
    color: "#C9960C",
  },
];

const STATS = [
  { label: "Registered Suppliers", value: "4,821", icon: <Building2 size={20} /> },
  { label: "Products in Registry", value: "2.4 Cr+", icon: <Package size={20} /> },
  { label: "QR Codes Generated", value: "1.8 Cr+", icon: <QrCode size={20} /> },
  { label: "Govt Orders Fulfilled", value: "38,294", icon: <ClipboardList size={20} /> },
];

const CAPABILITIES = [
  {
    icon: <Layers size={22} className="text-saffron-600" />,
    title: "Bulk CSV Upload",
    desc: "Upload up to 5,00,000 product entries in one CSV. System validates, generates IDs, and creates QR codes asynchronously.",
  },
  {
    icon: <QrCode size={22} className="text-saffron-600" />,
    title: "Govt-Signed QR Codes",
    desc: "Every QR code payload is HMAC-signed by the server. Tamper attempts are detected and logged instantly.",
  },
  {
    icon: <IndianRupee size={22} className="text-saffron-600" />,
    title: "Price Threshold Tracking",
    desc: "Items above ₹5,000 are individually tracked with unique IDs. Below threshold items are batched — no manual configuration needed.",
  },
  {
    icon: <Download size={22} className="text-saffron-600" />,
    title: "Label-Ready QR Sheets",
    desc: "Download QR labels in A4 or Dymo format, ready to print and stick on products before warehouse delivery.",
  },
  {
    icon: <BarChart3 size={22} className="text-saffron-600" />,
    title: "Full Lifecycle Visibility",
    desc: "See exactly which events used your products, how many defects were logged, repair costs incurred, and post-event condition ratings.",
  },
  {
    icon: <ShieldCheck size={22} className="text-saffron-600" />,
    title: "GFR & GeM Compatible",
    desc: "GAMS company registration is compatible with GFR 2017 procurement rules. GeM-registered companies can map existing catalog IDs.",
  },
];

const DOCS_REQUIRED = [
  "Certificate of Incorporation / MSME / Society Registration",
  "GST Registration Certificate (GSTIN — 15-digit, active)",
  "PAN Card of Organization",
  "Authorized Signatory Aadhaar (OTP verified)",
  "Cancelled Cheque / Bank Passbook (for payment settlements)",
  "Quality Certifications (BIS / ISI / ISO 9001) — if applicable",
  "GeM Registration ID — if registered on Government e-Marketplace",
  "Company Brochure or Product Catalog (PDF)",
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function CompanyHomePage() {
  const [lang] = useState<"en" | "hi">("en");

  return (
    <div className="min-h-dvh bg-white text-gray-900">
      <CompanyNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #E07B00, transparent)", transform: "translate(30%, -30%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #138808, transparent)", transform: "translate(-30%, 30%)" }}
          />
        </div>

        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-6">
              <ShieldCheck size={14} />
              Government of India — Authorized Supplier Platform
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Supply to the Government.
              <br />
              <span style={{ color: "#E07B00" }}>Track Every Unit.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              GAMS Supplier Portal is the official platform for companies with government purchase orders to list products, generate
              tamper-proof QR codes, confirm deliveries, and maintain complete asset lifecycle records — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-3 rounded shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: "#E07B00" }}
              >
                Register Your Company <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-saffron-700 text-sm font-semibold border border-saffron-300 bg-saffron-50 px-6 py-3 rounded hover:bg-saffron-100 transition-colors"
              >
                <LogIn size={16} /> Login to Dashboard
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Already on GeM?{" "}
              <Link href="/register?gem=1" className="text-saffron-600 font-semibold underline-offset-2 hover:underline">
                Import your GeM catalog →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white border border-border rounded-xl p-4 flex flex-col gap-1">
                <div className="text-saffron-600">{s.icon}</div>
                <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-saffron-600 mb-2">Process</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {lang === "en" ? "How Supplier Registration Works" : "आपूर्तिकर्ता पंजीकरण कैसे काम करता है"}
          </h2>
          <p className="text-gray-500 mt-2 max-w-xl">
            From company registration to QR code delivery — a transparent, step-by-step process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: step.color }}
                >
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-gray-100 leading-none select-none">{step.num}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-saffron-600 mb-2">Platform Capabilities</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Built for high-volume government procurement
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-3">
                <div className="w-10 h-10 bg-saffron-50 border border-saffron-100 rounded-xl flex items-center justify-center">
                  {c.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Documents Required ────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-saffron-600 mb-2">Documents</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
              What you'll need to register
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Documents can be submitted via DigiLocker (preferred) or manual PDF/JPG upload. Your registration remains
              in &ldquo;Pending Review&rdquo; status until the government admin verifies all documents.
            </p>
            <ul className="flex flex-col gap-3">
              {DOCS_REQUIRED.map((doc, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle2 size={17} className="text-green-600 mt-0.5 shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Registration CTA card */}
          <div className="bg-white border border-border rounded-2xl p-8 flex flex-col gap-6 shadow-sm">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Ready to register?</h3>
              <p className="text-sm text-gray-500">
                Complete your company profile, upload documents, and get approved by the Government of India to start
                listing products on GAMS.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-surface border border-border rounded-lg px-4 py-3">
                <Clock size={16} className="text-saffron-600 shrink-0" />
                Average approval time: <strong className="ml-1 text-gray-900">3–5 working days</strong>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-surface border border-border rounded-lg px-4 py-3">
                <AlertCircle size={16} className="text-saffron-600 shrink-0" />
                Active government purchase order required to register
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-surface border border-border rounded-lg px-4 py-3">
                <ShieldCheck size={16} className="text-green-600 shrink-0" />
                DigiLocker-verified documents fast-tracked
              </div>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold px-6 py-3 rounded-lg shadow-sm hover:opacity-90 transition-opacity w-full"
              style={{ background: "#E07B00" }}
            >
              Start Company Registration <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border border-border rounded-lg px-6 py-3 hover:bg-surface transition-colors"
            >
              <LogIn size={16} /> Already registered? Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── Status Indicators ─────────────────────────────────────────────── */}
      <section className="bg-surface border-t border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">
            Product Listing Status Guide
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Clock size={18} />, label: "Pending Approval", desc: "Submitted, awaiting govt admin review.", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
              { icon: <CheckCircle2 size={18} />, label: "Approved", desc: "Listed and QR codes being generated.", color: "text-green-700 bg-green-50 border-green-200" },
              { icon: <QrCode size={18} />, label: "QR Generated", desc: "Labels ready for download and printing.", color: "text-saffron-600 bg-saffron-50 border-saffron-200" },
              { icon: <XCircle size={18} />, label: "Rejected", desc: "See rejection reason and resubmit.", color: "text-red-600 bg-red-50 border-red-200" },
            ].map((s) => (
              <div key={s.label} className={`flex flex-col gap-2 border rounded-xl p-4 ${s.color}`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {s.icon} {s.label}
                </div>
                <p className="text-xs leading-relaxed opacity-80">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <AshokaChakra size={22} />
            <div>
              <p className="font-bold text-gray-600">GAMS — Supplier Portal</p>
              <p>© {new Date().getFullYear()} Government of India. All rights reserved.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Use</Link>
            <Link href="/guidelines" className="hover:text-gray-600 transition-colors">Supplier Guidelines</Link>
            <Link href="/support" className="hover:text-gray-600 transition-colors">Support</Link>
          </div>
        </div>
        <div className="border-t border-border bg-surface py-3">
          <p className="text-center text-[10px] text-gray-400 font-medium tracking-wide">
            GIGW Compliant · NIC Hosted · WCAG 2.1 AA · Content owned by Ministry of Finance, Government of India
          </p>
        </div>
      </footer>
    </div>
  );
}
