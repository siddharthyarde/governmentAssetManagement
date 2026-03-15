import React from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  ClipboardList, QrCode, ShoppingBag, CheckCircle, ChevronRight,
  ArrowRight, Building2, IndianRupee, Truck, Clock,
} from "lucide-react";

export const metadata = { title: "How It Works — GAMS Buyer Portal" };

const STEPS = [
  {
    step: "01",
    icon: Building2,
    title: "Register Your Institution",
    body: "Sign up with your official email and upload the required documents (registration certificate, PAN, 80G/FCRA if applicable). GAMS verifies your institution within 3–5 working days.",
    color: "#138808",
  },
  {
    step: "02",
    icon: ShoppingBag,
    title: "Browse Available Stock",
    body: "Once verified, browse the institutional marketplace with priority access. Use category, condition, and location filters to find exactly what your institution needs.",
    color: "#E07B00",
  },
  {
    step: "03",
    icon: QrCode,
    title: "Inspect via QR Scanner",
    body: "Scan any asset's QR code to see its full inspection certificate, condition rating (1–10 GAS Scale), event history, and chain-of-custody record before placing an order.",
    color: "#1A3A6B",
  },
  {
    step: "04",
    icon: ClipboardList,
    title: "Place Order with PO or Online Payment",
    body: "Institutions can use Purchase Order (PO) billing or pay online via Razorpay (UPI, NEFT, cards). Orders are confirmed after PO verification by GAMS admin.",
    color: "#C9960C",
  },
  {
    step: "05",
    icon: Truck,
    title: "Receive & Verify Delivery",
    body: "Assets are dispatched via tracked logistics. Scan the asset QR at delivery to confirm receipt. This generates your official Government Disposal Certificate.",
    color: "#138808",
  },
  {
    step: "06",
    icon: CheckCircle,
    title: "Download Disposal Certificate",
    body: "Your GFR 2017-compliant Disposal Certificate is auto-generated after delivery confirmation. Download it for PAO records, CAG audit, and internal accounts.",
    color: "#E07B00",
  },
];

const BENEFITS = [
  { label: "Zero procurement cost", detail: "Asset listings are free to browse. No platform fee for institutional buyers." },
  { label: "Up to 92% discount", detail: "Verified assets priced well below market and tender rates." },
  { label: "GFR 2017 compliant", detail: "Every transaction generates a legally valid Disposal Certificate." },
  { label: "PO-based billing", detail: "Avoid upfront payment — use your institution's purchase order process." },
  { label: "Priority window", detail: "Institutions get 72-hour exclusive access before items go to public sale." },
  { label: "Full audit trail", detail: "Every transaction is logged, QR-verified, and available under RTI." },
];

export default function BuyerHowItWorksPage() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/buyer" className="flex items-center gap-2.5">
              <AshokaChakra size={30} />
              <div>
                <span className="text-sm font-black text-[#1A1A1A]">GAMS</span>
                <span className="hidden sm:block text-[9px] text-[#5A5A5A] -mt-0.5">Institutional Buyer Portal</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/buyer/eligibility" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Eligibility</Link>
              <Link href="/buyer/available-stock" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Available Stock</Link>
              <Link href="/buyer/login" className="text-sm font-semibold border border-border px-3 py-1.5 rounded-lg hover:bg-surface">Sign In</Link>
              <Link href="/buyer/register" className="text-sm font-bold text-white px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800">Register</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

      <div className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/buyer" className="hover:text-gray-700">Buyer Portal</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">How It Works</span>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F0FFF4] to-white py-14 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">For Verified Institutions Only</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">How Institutional Buying Works</h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            From registration to Disposal Certificate — everything your institution needs to procure
            verified government surplus assets compliantly and affordably.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-14 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">6 Steps to Your First Order</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STEPS.map(({ step, icon: Icon, title, body, color }) => (
              <div key={step} className="border border-border rounded-2xl p-5 relative overflow-hidden hover:shadow-sm transition-shadow">
                <div className="absolute top-4 right-4 text-5xl font-black text-gray-100 select-none">{step}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 relative z-10" style={{ background: color }}>
                  <Icon size={18} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 bg-[#FFFAF4]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Why Institutions Choose GAMS</h2>
            <p className="text-sm text-gray-500 mt-2">Trusted by 340+ government bodies and NGOs across India</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map(({ label, detail }, i) => (
              <div key={label} className="bg-white border border-border rounded-2xl p-5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-xs font-black text-green-700">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">{label}</p>
                  <p className="text-xs text-gray-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="py-10 bg-green-700 text-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "₹4.2Cr", label: "Saved by institutions" },
              { value: "340+", label: "Verified institutions" },
              { value: "92%", label: "Max discount on offer" },
              { value: "3–5 days", label: "Avg. verification time" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-black">{value}</p>
                <p className="text-green-200 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Your Institution&apos;s Registration</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">Free, paperless, and takes under 10 minutes. Get verified in 3–5 working days.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/buyer/register" className="bg-green-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-800 text-sm flex items-center gap-2">
              Register Institution <ArrowRight size={14} />
            </Link>
            <Link href="/buyer/eligibility" className="border border-border text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-white text-sm flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" /> Check Eligibility
            </Link>
            <Link href="/buyer/available-stock" className="border border-green-200 text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 text-sm flex items-center gap-2">
              <IndianRupee size={14} /> Browse Available Stock
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#1A3A6B] text-white py-8">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5"><AshokaChakra size={26} /><p className="text-sm font-black">GAMS Buyer Portal</p></div>
          <p className="text-xs text-blue-200">© {new Date().getFullYear()} Ministry of Finance, Government of India</p>
        </div>
      </footer>
    </div>
  );
}
