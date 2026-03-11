"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  Shield, Globe, FileText, CheckCircle, Users, Building2,
  Package, BarChart3, ChevronDown, ChevronRight, Phone, Mail, MapPin,
  Menu, X, ArrowRight,
} from "lucide-react";

// ─── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <AshokaChakra size={32} />
            <div>
              <span className="text-sm font-black text-[#1A1A1A] tracking-tight">GAMS</span>
              <span className="hidden sm:block text-[9px] text-[#5A5A5A] font-medium -mt-0.5">Government Asset Management System</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {[["Marketplace", "/marketplace"], ["Scanner", "/scan"], ["About", "/about"]].map(([label, href]) => (
              <Link key={href} href={href} className={`text-sm font-semibold ${href === "/about" ? "text-saffron-600" : "text-gray-600 hover:text-gray-900"}`}>{label}</Link>
            ))}
            <Link href="/auth/login" className="text-sm font-bold px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Sign In</Link>
            <Link href="/auth/register" className="text-sm font-bold text-white px-4 py-2 rounded-lg bg-saffron-500 hover:bg-saffron-600">Register</Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-2">
            {[["Marketplace", "/marketplace"], ["Scanner", "/scan"], ["About", "/about"]].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-semibold text-gray-700 py-1.5 px-1" onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
            <Link href="/auth/register" className="text-sm font-bold text-white px-4 py-2 rounded-lg bg-saffron-500 text-center mt-1" onClick={() => setMenuOpen(false)}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What is GAMS?",
    a: "GAMS (Government Asset Management System) is India's first digital platform for the transparent redistribution and resale of government-owned assets. After government events, exhibitions, or routine asset disposal, items are inspected, rated, listed, and made available to institutions and citizens.",
  },
  {
    q: "Who can buy on GAMS?",
    a: "Any government institution (central or state) can purchase assets at institutional rates. Citizens and private entities may purchase surplus items available in the public marketplace after the institutional window closes.",
  },
  {
    q: "How are assets rated?",
    a: "Every asset is physically inspected by a certified GAMS inspector and rated on a 10-point scale across dimensions: structural integrity, functional condition, cosmetic state, and remaining useful life. The rating report is attached to every listing.",
  },
  {
    q: "Is this compliant with GFR 2017?",
    a: "Yes. GAMS follows the General Financial Rules 2017 (GFR Rule 195–202) for disposable asset management. Every transaction generates a Disposal Certificate which serves as the official accounting record.",
  },
  {
    q: "Can companies list assets on GAMS?",
    a: "Yes. Registered and verified event management companies and government-empanelled suppliers can list assets on GAMS after events they've managed. All listings require supporting documentation and pass a GAMS verification step.",
  },
  {
    q: "How does QR code tracking work?",
    a: "Every asset receives a tamper-proof HMAC-signed QR code at the point of listing. The QR encodes the asset ID, event ID, and a unique token. Scanning the QR on the public scanner portal reveals the full asset chain of custody.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">FAQ</p>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Frequently Asked Questions</h2>
        </div>
        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-bold text-gray-900">{faq.q}</span>
                {open === i ? <ChevronDown size={16} className="text-saffron-500 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#1A3A6B] text-white py-10">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <AshokaChakra size={32} />
          <div>
            <p className="text-sm font-black">GAMS</p>
            <p className="text-[10px] text-blue-200">Government Asset Management System</p>
          </div>
        </div>
        <p className="text-xs text-blue-200">
          © {new Date().getFullYear()} Ministry of Finance, Government of India. All rights reserved. | GFR 2017 Compliant
        </p>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <Nav />

      {/* Tiranga accent */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FFF8EE] to-white py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-saffron-50 border border-saffron-200 px-3 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 bg-saffron-500 rounded-full" />
              <span className="text-[11px] font-bold text-saffron-700 uppercase tracking-wider">Digital India · Make in India</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight mb-4">
              Transparent Government Asset Management — Built for <span className="text-saffron-500">Bharat</span>
            </h1>
            <p className="text-base text-[#5A5A5A] leading-relaxed mb-6">
              GAMS is a flagship Digital India initiative that digitises the entire lifecycle of government surplus assets — from post-event inspection to institution-to-institution redistribution, public resale, and full audit compliance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/marketplace" className="inline-flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-sm">
                Browse Marketplace <ArrowRight size={15} />
              </Link>
              <Link href="/auth/register" className="inline-flex items-center gap-2 text-saffron-700 font-bold px-5 py-2.5 rounded-xl border border-saffron-300 bg-saffron-50 hover:bg-saffron-100 text-sm">
                Register Institution
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full md:w-auto">
            {[
              { label: "Assets Listed", value: "12,400+", icon: Package, color: "#E07B00" },
              { label: "Institutions Served", value: "340+",    icon: Building2, color: "#1A3A6B" },
              { label: "Transactions Completed", value: "8,900+", icon: BarChart3, color: "#138808" },
              { label: "QR Scans", value: "2.1 L+",  icon: Shield, color: "#C9960C" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1.5 min-w-[130px]">
                <Icon size={18} style={{ color }} />
                <p className="text-xl font-black text-[#1A1A1A]">{value}</p>
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">Our Mission</p>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Why GAMS Exists</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto mt-2">Every year, thousands of crores of government assets are underutilised or improperly disposed. GAMS closes this loop.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Globe,
                title: "Transparency First",
                body: "Every asset's condition, price, and disposal history is publicly auditable. No opaque tenders. No backroom deals. Every transaction is traceable end-to-end.",
                color: "#E07B00",
              },
              {
                icon: Shield,
                title: "GFR 2017 Compliant",
                body: "We operate strictly within General Financial Rules 2017, Rule 195–202. Every disposal generates the required Disposal Certificate and is reflected in PAO/treasury records.",
                color: "#1A3A6B",
              },
              {
                icon: Users,
                title: "Institutional Priority",
                body: "Government institutions get first access to redistributed assets at cost price. Public marketplace opens only after the institutional window closes.",
                color: "#138808",
              },
            ].map(({ icon: Icon, title, body, color }) => (
              <div key={title} className="bg-surface border border-gray-200 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 bg-[#FFFAF4]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">Process</p>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">From Event to Institution in 5 Steps</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-0 relative">
            {[
              { step: "01", title: "Event Concludes",       body: "A government event ends. Company submits asset handover request to GAMS admin." },
              { step: "02", title: "Inspector Visit",        body: "A certified GAMS inspector physically examines and rates every asset on the 10-point GAS Scale." },
              { step: "03", title: "QR Code Assigned",      body: "Each asset receives a tamper-proof, HMAC-signed QR code linking to its full inspection report." },
              { step: "04", title: "Institution Marketplace", body: "Verified government institutions browse and claim assets at cost price during the priority window." },
              { step: "05", title: "Public Sale",            body: "Unclaimed assets open to the public at audited market-discounted prices." },
            ].map(({ step, title, body }, i, arr) => (
              <div key={step} className="flex-1 relative flex flex-col items-center text-center p-5">
                {i < arr.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-saffron-200" style={{ zIndex: 0 }} />
                )}
                <div className="relative z-10 w-14 h-14 rounded-full bg-saffron-500 text-white font-black text-lg flex items-center justify-center mb-3 shadow-md">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal backing */}
      <section className="py-14 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">Legal Framework</p>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Backed by Law</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              { title: "GFR 2017 — Rules 195–202", body: "General Financial Rules govern the disposal, write-off, and auction of government assets. GAMS automates these workflows digitally." },
              { title: "Digital India Act", body: "GAMS is built on Digital India infrastructure — Aadhaar-verified accounts, DigiLocker document submission, and GeM integration." },
              { title: "RTI Transparency", body: "All GAMS transaction data is available under RTI. Disposal summaries are published quarterly on the GAMS public dashboard." },
              { title: "CVC Guidelines", body: "Procurement and disposal processes follow Central Vigilance Commission guidelines to prevent misappropriation of public assets." },
            ].map(({ title, body }) => (
              <div key={title} className="border border-gray-200 rounded-2xl p-5 flex gap-3">
                <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Contact */}
      <section className="py-14 bg-[#FFFAF4]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">Get in Touch</p>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Contact GAMS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { icon: Mail,   label: "General Enquiry",  value: "support@gams.gov.in",  href: "mailto:support@gams.gov.in"  },
              { icon: Phone,  label: "Helpline",         value: "1800-111-GAMS",         href: "tel:18001114267"             },
              { icon: MapPin, label: "Office",           value: "Ministry of Finance, North Block, New Delhi — 110001", href: "#" },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2 hover:shadow-sm transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-saffron-50 border border-saffron-200 flex items-center justify-center">
                  <Icon size={16} className="text-saffron-600" />
                </div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-gray-900">{value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-saffron-500">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Start Using GAMS Today</h2>
          <p className="text-saffron-100 text-sm mb-6 max-w-xl mx-auto">Government institutions get free access. Join 340+ institutions already saving on quality assets.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/auth/register" className="bg-white text-saffron-600 font-bold px-6 py-2.5 rounded-xl hover:bg-saffron-50 text-sm">Register Institution →</Link>
            <Link href="/marketplace" className="bg-saffron-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-saffron-800 text-sm">Browse Marketplace</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
