"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  Building2,
  ShieldCheck,
  ClipboardList,
  Package,
  ArrowRight,
  CheckCircle2,
  Globe,
  Users,
  Layers,
  FileText,
  Calendar,
  LogIn,
  Menu,
  X,
  IndianRupee,
  BarChart3,
  Gift,
  Landmark,
  HeartHandshake,
  BadgeCheck,
  Clock,
  ChevronRight,
} from "lucide-react";

// ─── Buyer Nav ───────────────────────────────────────────────────────────────

function BuyerNav() {
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
                <span className="text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded ml-1">
                  {lang === "en" ? "Institutional Buyer Portal" : "संस्थागत क्रेता पोर्टल"}
                </span>
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/available-stock" className="hover:text-amber-700 transition-colors">Available Stock</Link>
            <Link href="/how-it-works" className="hover:text-amber-700 transition-colors">How It Works</Link>
            <Link href="/eligibility" className="hover:text-amber-700 transition-colors">Eligibility</Link>
            <Link href="/support" className="hover:text-amber-700 transition-colors">Support</Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold border border-border rounded px-2 py-1 hover:bg-surface transition-colors"
            >
              {lang === "en" ? "हिं" : "EN"}
            </button>
            <Link
              href="/buyer/login"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-amber-700 border border-amber-300 rounded px-3 py-1.5 hover:bg-amber-50 transition-colors"
            >
              <LogIn size={15} /> Login
            </Link>
            <Link
              href="/buyer/register"
              className="flex items-center gap-2 text-sm font-bold text-white rounded px-4 py-1.5 transition-colors"
              style={{ background: "#C9960C" }}
            >
              Register Organisation
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
        {mobileOpen && (
          <nav className="md:hidden border-t border-border py-3 flex flex-col gap-3 text-sm font-medium text-gray-700">
            <Link href="/available-stock" className="hover:text-amber-700">Available Stock</Link>
            <Link href="/how-it-works" className="hover:text-amber-700">How It Works</Link>
            <Link href="/eligibility" className="hover:text-amber-700">Eligibility</Link>
            <Link href="/support" className="hover:text-amber-700">Support</Link>
            <Link href="/buyer/login" className="hover:text-amber-700">Login</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ORG_TYPES = [
  { icon: <Landmark size={22} className="text-amber-700" />, label: "Government Institutions", desc: "State/municipal bodies, PSUs, and govt-funded autonomous organizations seeking inter-departmental asset allocation." },
  { icon: <HeartHandshake size={22} className="text-amber-700" />, label: "NGOs & Trusts", desc: "Registered NGOs, trusts, and Section 8 companies working in social welfare, education, or disaster relief." },
  { icon: <Building2 size={22} className="text-amber-700" />, label: "Private Companies", desc: "MSME and corporate organizations looking to procure quality surplus assets at discounted prices for operational use." },
  { icon: <Users size={22} className="text-amber-700" />, label: "Educational Institutions", desc: "Schools, colleges, and universities registered with recognition boards seeking furniture, electronics, or equipment." },
];

const STEPS = [
  {
    num: "01",
    title: "Register Your Organisation",
    desc: "Submit your GSTIN, CIN/registration number, authorized signatory details, and upload verification documents via DigiLocker or manual upload.",
    icon: <Building2 size={22} />,
  },
  {
    num: "02",
    title: "Government Verification",
    desc: "Ministry officials review your registration. Verified organisations receive a Buyer ID with a credibility score based on documents and history.",
    icon: <ShieldCheck size={22} />,
  },
  {
    num: "03",
    title: "Browse Available Stock",
    desc: "Filter by category, quantity range, condition rating, and region. Each product listing shows delivery photos, inspector ratings, and exact pricing.",
    icon: <Package size={22} />,
  },
  {
    num: "04",
    title: "Submit Requirement Request",
    desc: "Fill in required quantity, purpose of use, justification, and preferred delivery timeline. Requests are reviewed for priority and eligibility.",
    icon: <ClipboardList size={22} />,
  },
  {
    num: "05",
    title: "Allocation & Delivery",
    desc: "Approved allocations are dispatched from the government warehouse. Track delivery status in real time from your dashboard.",
    icon: <BarChart3 size={22} />,
  },
  {
    num: "06",
    title: "Receive & Acknowledge",
    desc: "Acknowledge receipt, review delivered items, and raise grievances if quantities or conditions don't match allocation details.",
    icon: <BadgeCheck size={22} />,
  },
];

const STATS = [
  { label: "Registered Institutions", value: "12,483", icon: <Building2 size={20} /> },
  { label: "Products Available", value: "8.2 Lakh+", icon: <Package size={20} /> },
  { label: "Allocations Made", value: "2,94,821", icon: <ClipboardList size={20} /> },
  { label: "Est. Value Redistributed", value: "₹4,200 Cr", icon: <IndianRupee size={20} /> },
];

const CHANNELS = [
  {
    icon: <IndianRupee size={22} className="text-green-700" />,
    title: "Discounted Purchase",
    desc: "Private institutions can purchase surplus assets at ratings-based prices — 10% to 50% of original government purchase price.",
    eligible: "Private companies, MSMEs, Educational Institutions",
    tag: "Paid",
    tagColor: "bg-green-50 text-green-700 border-green-200",
  },
  {
    icon: <Landmark size={22} className="text-amber-700" />,
    title: "Inter-Government Allocation",
    desc: "Government institutions can have assets re-allocated from one department to another at no cost, subject to ministry approval.",
    eligible: "State Govts, PSUs, Autonomous Govt Bodies",
    tag: "Free",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    icon: <Gift size={22} className="text-red-700" />,
    title: "Freebie / Charity Allocation",
    desc: "Qualifying NGOs and charitable organisations can receive certain categories of assets as freebies for beneficiary welfare programmes.",
    eligible: "Registered NGOs, Disaster Relief Orgs, Social Trusts",
    tag: "Free",
    tagColor: "bg-red-50 text-red-700 border-red-200",
  },
];

const DOCS = [
  "Certificate of Incorporation / Society / Trust Registration",
  "GST Registration Certificate (active GSTIN)",
  "PAN Card of Organisation",
  "Authorized Signatory Aadhaar — OTP verified",
  "Cancelled Cheque (for paid purchase settlements)",
  "MOA / AOA / Trust Deed",
  "80G / 12A Certificate (for NGOs — enables freebie eligibility)",
  "Previous Government Allocation / Purchase References (if any)",
];

const ACTIVE_CATEGORIES = [
  { label: "Electronics & IT Equipment", qty: "18,240 units" },
  { label: "Office Furniture", qty: "42,800 units" },
  { label: "Vehicles & Transport", qty: "1,204 units" },
  { label: "Audio-Visual Equipment", qty: "8,930 units" },
  { label: "Kitchen & Catering Equipment", qty: "21,600 units" },
  { label: "Textiles & Linens", qty: "1.2 Lakh units" },
  { label: "Medical & Safety Equipment", qty: "6,480 units" },
  { label: "Sports & Recreation", qty: "9,340 units" },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function BuyerHomePage() {
  return (
    <div className="min-h-dvh bg-white text-gray-900">
      <BuyerNav />

      {/* ── Announcement Banner ───────────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200 py-2 px-4">
        <p className="text-center text-xs font-semibold text-amber-800 max-w-screen-xl mx-auto">
          📢 New Stock Available: Post-G20 Summit assets (Electronics, Furniture, AV Equipment) now open for institutional requests.{" "}
          <Link href="/available-stock" className="underline font-bold">View Stock →</Link>
        </p>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #C9960C, transparent)", transform: "translate(30%, -30%)" }}
          />
        </div>
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-14 md:py-22">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-6">
              <ShieldCheck size={14} />
              Government of India — Institutional Asset Distribution
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Government Surplus Assets.
              <br />
              <span style={{ color: "#C9960C" }}>For Organisations That Need Them.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              The GAMS Institutional Buyer Portal enables verified NGOs, government bodies, and private organisations to
              request or purchase quality surplus government assets — rated, photographed, and GFR-compliant.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/buyer/register"
                className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-3 rounded shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: "#C9960C" }}
              >
                Register Organisation <ArrowRight size={16} />
              </Link>
              <Link
                href="/available-stock"
                className="inline-flex items-center gap-2 text-amber-800 text-sm font-semibold border border-amber-300 bg-amber-50 px-6 py-3 rounded hover:bg-amber-100 transition-colors"
              >
                <Package size={16} /> Browse Available Stock
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white border border-border rounded-xl p-4 flex flex-col gap-1">
                <div className="text-amber-600">{s.icon}</div>
                <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who Can Register ─────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Eligibility</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Who can register?</h2>
          <p className="text-gray-500 mt-2 max-w-xl text-sm">
            This portal is for organisations, not individuals. Individual citizens should use the{" "}
            <Link href="https://public.gams.gov.in" className="text-green-700 font-semibold hover:underline">
              Public Marketplace →
            </Link>
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {ORG_TYPES.map((o) => (
            <div key={o.label} className="border border-border rounded-2xl p-6 bg-white flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
                {o.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900">{o.label}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Redistribution Channels ──────────────────────────────────────── */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">How You Can Get Assets</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Three redistribution channels</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CHANNELS.map((c) => (
              <div key={c.title} className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
                    {c.icon}
                  </div>
                  <span className={`text-xs font-bold border px-2 py-1 rounded ${c.tagColor}`}>{c.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-border">
                  <p className="text-xs text-gray-400 font-medium">Eligible for:</p>
                  <p className="text-xs text-gray-600 font-semibold mt-0.5">{c.eligible}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Process</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">How to get assets for your organisation</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: "#C9960C" }}>
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

      {/* ── Available Categories ──────────────────────────────────────────── */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-14">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Live Stock</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Currently available for institutional request</h2>
            </div>
            <Link
              href="/available-stock"
              className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded hover:opacity-90 transition-opacity"
              style={{ background: "#C9960C" }}
            >
              View All Stock <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTIVE_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={`/available-stock?category=${encodeURIComponent(cat.label)}`}
                className="bg-white border border-border rounded-xl p-5 flex flex-col gap-2 hover:border-amber-300 hover:shadow-sm transition-all group"
              >
                <Package size={20} className="text-amber-600 group-hover:text-amber-700" />
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{cat.label}</h3>
                <p className="text-xs text-gray-500 font-medium">{cat.qty} available</p>
                <div className="flex items-center gap-1 text-xs text-amber-700 font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Request now <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Documents + CTA ──────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Documents Required</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">What your organisation needs to submit</h2>
            <p className="text-sm text-gray-500 mb-8">
              Documents are verified via DigiLocker (preferred) or manual upload. Aadhaar OTP verification of
              the authorized signatory is mandatory. Registration status remains &ldquo;Pending&rdquo; until fully verified.
            </p>
            <ul className="flex flex-col gap-3">
              {DOCS.map((doc, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle2 size={17} className="text-amber-600 mt-0.5 shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-border rounded-2xl p-8 flex flex-col gap-6 shadow-sm">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Register Your Organisation</h3>
              <p className="text-sm text-gray-500">
                Get verified in 5–7 working days and gain access to browse, request, and receive government surplus
                assets for your organisation&apos;s needs.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-surface border border-border rounded-lg px-4 py-3">
                <Clock size={16} className="text-amber-600 shrink-0" />
                Average verification time: <strong className="ml-1 text-gray-900">5–7 working days</strong>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-surface border border-border rounded-lg px-4 py-3">
                <ShieldCheck size={16} className="text-green-600 shrink-0" />
                DigiLocker-verified documents fast-tracked
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-surface border border-border rounded-lg px-4 py-3">
                <BadgeCheck size={16} className="text-amber-600 shrink-0" />
                80G-certified NGOs eligible for freebie allocation
              </div>
            </div>

            <Link
              href="/buyer/register"
              className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold px-6 py-3 rounded-lg shadow-sm hover:opacity-90 transition-opacity w-full"
              style={{ background: "#C9960C" }}
            >
              Start Registration <ArrowRight size={16} />
            </Link>
            <Link
              href="/buyer/login"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border border-border rounded-lg px-6 py-3 hover:bg-surface transition-colors"
            >
              <LogIn size={16} /> Already registered? Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <AshokaChakra size={22} />
            <div>
              <p className="font-bold text-gray-600">GAMS — Institutional Buyer Portal</p>
              <p>© {new Date().getFullYear()} Government of India. All rights reserved.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Use</Link>
            <Link href="/eligibility" className="hover:text-gray-600 transition-colors">Eligibility Criteria</Link>
            <Link href="https://public.gams.gov.in" className="hover:text-gray-600 transition-colors">Citizens Marketplace ↗</Link>
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
