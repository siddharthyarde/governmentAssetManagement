"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  Phone, Mail, MessageCircle, ChevronRight, ChevronDown,
  Clock, CheckCircle2, AlertCircle, FileText,
} from "lucide-react";

const FAQS = [
  {
    q: "How long does company verification take?",
    a: "Typically 3–5 working days after all documents are uploaded. You can check your status in the dashboard under Settings.",
  },
  {
    q: "I uploaded all documents but my account is still pending. What do I do?",
    a: "Check that all files are clearly readable (not blurred or cropped). If it's been more than 5 working days, email supplier.support@gams.gov.in with your company CIN and registration date.",
  },
  {
    q: "My product listing was rejected. How do I fix it?",
    a: "The rejection email will include the specific reason. Common causes: blurry images, missing Hindi name, price exceeding GeM catalogue, or prohibited product category. Edit and resubmit via My Products.",
  },
  {
    q: "When will I receive payment for a delivered order?",
    a: "Payment is released within 10 working days after the buyer institution confirms delivery by scanning the QR. Ensure you've submitted a GST invoice within 3 days of delivery.",
  },
  {
    q: "How do I generate QR labels for my products?",
    a: "Once your product is approved, go to QR Codes in your dashboard. Select the product and quantity, and download the printable A4 label sheet. Labels must be affixed before dispatch.",
  },
  {
    q: "Can I list pre-owned products from previous events?",
    a: "Only if the event was registered on GAMS and you submitted the post-event asset handover report. Contact gams-admin@gams.gov.in to register legacy events.",
  },
];

export default function CompanySupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", company: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("sending");
    setTimeout(() => setFormStatus("sent"), 1500);
  }

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-neutral-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      <header className="bg-white border-b border-border px-6 py-3 flex items-center gap-3">
        <Link href="/company" className="flex items-center gap-2.5">
          <AshokaChakra size={30} />
          <div>
            <p className="text-xs text-gray-400 font-medium">GAMS</p>
            <p className="text-sm font-semibold text-gray-900">Supplier Portal</p>
          </div>
        </Link>
        <nav className="ml-auto flex gap-4 text-sm">
          <Link href="/company/dashboard" className="text-gray-500 hover:text-gray-900">Dashboard</Link>
          <Link href="/company/login" className="text-gray-500 hover:text-gray-900">Sign In</Link>
        </nav>
      </header>

      <div className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/company" className="hover:text-gray-700">Supplier Portal</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Support</span>
      </div>

      <section className="bg-gradient-to-br from-[#FFF8EE] to-white py-10 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Supplier Support</h1>
          <p className="text-sm text-gray-500">Get help with account verification, product listings, QR codes, payments, and more.</p>
        </div>
      </section>

      <main className="flex-1 max-w-screen-xl mx-auto px-4 md:px-6 py-8 w-full">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Channels */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Contact Channels</h2>
            {[
              { icon: Phone, label: "Supplier Helpline", value: "1800-111-GAMS", sub: "Mon–Fri · 9AM–6PM IST", href: "tel:18001114267", color: "#E07B00" },
              { icon: Mail, label: "Supplier Support", value: "supplier.support@gams.gov.in", sub: "Response within 2 working days", href: "mailto:supplier.support@gams.gov.in", color: "#138808" },
              { icon: FileText, label: "Billing / PO Queries", value: "gams-billing@gams.gov.in", sub: "Payment & GST invoice queries", href: "mailto:gams-billing@gams.gov.in", color: "#1A3A6B" },
              { icon: MessageCircle, label: "Grievance Cell", value: "grievance@gams.gov.in", sub: "Disputes & escalations", href: "mailto:grievance@gams.gov.in", color: "#C9960C" },
            ].map(({ icon: Icon, label, value, sub, href, color }) => (
              <a key={label} href={href} className="flex items-start gap-3 bg-white border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock size={10} />{sub}</p>
                </div>
              </a>
            ))}

            <div className="bg-saffron-50 border border-saffron-200 rounded-xl p-4 text-xs text-saffron-800">
              <strong>Tip:</strong> Reference your company CIN when contacting support for faster resolution.
            </div>
          </div>

          {/* Form + FAQ */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Send Us a Message</h2>
              {formStatus === "sent" ? (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                  <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-800">Message received!</p>
                    <p className="text-xs text-green-700 mt-0.5">We&apos;ll respond to <strong>{form.email}</strong> within 2 working days.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name"
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name *</label>
                      <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Registered Company Name"
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Business Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com"
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subject *</label>
                    <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">Select a subject</option>
                      <option>Account / Verification Issue</option>
                      <option>Product Listing Rejected</option>
                      <option>QR Label Issue</option>
                      <option>Payment / Invoice Query</option>
                      <option>Order / Delivery Issue</option>
                      <option>Technical / Login Issue</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                    <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe your issue in detail..."
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                  <button type="submit" disabled={formStatus === "sending"}
                    className="w-full bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 text-sm">
                    {formStatus === "sending" ? "Sending..." : "Submit Support Request"}
                  </button>
                </form>
              )}
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-white border border-border rounded-xl overflow-hidden">
                    <button className="w-full flex items-center justify-between px-4 py-3 text-left gap-3" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                      {openFaq === i ? <ChevronDown size={15} className="text-primary shrink-0" /> : <ChevronRight size={15} className="text-gray-400 shrink-0" />}
                    </button>
                    {openFaq === i && <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-border">{faq.a}</div>}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-2.5">
                <AlertCircle size={15} className="text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  For payment escalations above ₹5L, email <strong>gams-billing@gams.gov.in</strong> with your GST invoice attached.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-400 py-4 border-t border-border mt-8">
        © 2026 Government of India · GAMS Supplier Portal · GFR 2017 Compliant
      </footer>
    </div>
  );
}
