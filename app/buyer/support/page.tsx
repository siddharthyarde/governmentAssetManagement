"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  Phone, Mail, MessageCircle, FileText, ChevronRight,
  ChevronDown, Clock, CheckCircle2, AlertCircle,
} from "lucide-react";

const FAQS = [
  {
    q: "How long does institution verification take?",
    a: "Typically 3–5 working days. Ensure all required documents are uploaded correctly to avoid delays. You can check your verification status in your dashboard.",
  },
  {
    q: "Can I place a Purchase Order (PO) instead of paying online?",
    a: "Yes. Approved institutions can request PO-based billing after account activation. Raise a PO request through your dashboard and share it with gams-po@gams.gov.in.",
  },
  {
    q: "My institution was rejected. What do I do?",
    a: "You'll receive a rejection reason via email. Fix the issue (usually a missing or invalid document), resubmit via your dashboard under Documents, and request re-review.",
  },
  {
    q: "How do I get a Disposal Certificate?",
    a: "Disposal Certificates are auto-generated after delivery confirmation. Scan the asset QR at delivery to confirm receipt — the certificate is then available in My Orders > Download.",
  },
  {
    q: "Can multiple users from my institution access GAMS?",
    a: "Currently, one account per institution is supported (the nodal officer). Multi-user institutional accounts are planned for the next release.",
  },
  {
    q: "What if the asset condition differs from the listing?",
    a: "Raise a dispute within 48 hours of delivery via your dashboard (My Orders > Raise Dispute). GAMS admin will initiate a physical re-inspection within 5 working days.",
  },
];

export default function BuyerSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", instituion: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("sending");
    setTimeout(() => setFormStatus("sent"), 1500);
  }

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
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
            <div className="flex items-center gap-3">
              <Link href="/buyer/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Dashboard</Link>
              <Link href="/buyer/login" className="text-sm font-semibold border border-border px-3 py-1.5 rounded-lg hover:bg-surface">Sign In</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

      <div className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/buyer" className="hover:text-gray-700">Buyer Portal</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Support</span>
      </div>

      <section className="bg-gradient-to-br from-[#F0FFF4] to-white py-10 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Buyer Support</h1>
          <p className="text-sm text-gray-500">We&apos;re here to help. Reach us via any channel below or check the FAQ.</p>
        </div>
      </section>

      <main className="flex-1 max-w-screen-xl mx-auto px-4 md:px-6 py-8 w-full">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Contact channels */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Contact Channels</h2>

            {[
              {
                icon: Phone,
                label: "Helpline",
                value: "1800-111-GAMS",
                sub: "Toll-free · Mon–Fri 9AM–6PM IST",
                href: "tel:18001114267",
                color: "#138808",
              },
              {
                icon: Mail,
                label: "Buyer Support Email",
                value: "buyer.support@gams.gov.in",
                sub: "Response within 2 working days",
                href: "mailto:buyer.support@gams.gov.in",
                color: "#E07B00",
              },
              {
                icon: MessageCircle,
                label: "Grievance Cell",
                value: "grievance@gams.gov.in",
                sub: "Disputes & escalations · 5 working days",
                href: "mailto:grievance@gams.gov.in",
                color: "#1A3A6B",
              },
              {
                icon: FileText,
                label: "PO Billing Requests",
                value: "gams-po@gams.gov.in",
                sub: "For Purchase Order billing setup",
                href: "mailto:gams-po@gams.gov.in",
                color: "#C9960C",
              },
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

            {/* Office hours note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
              <strong>Note:</strong> GAMS operates under Ministry of Finance. Response times may be longer during
              public holidays and Parliament sessions.
            </div>
          </div>

          {/* Contact form + FAQ */}
          <div className="lg:col-span-2 space-y-8">

            {/* Contact form */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Send Us a Message</h2>
              {formStatus === "sent" ? (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                  <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-800">Message received!</p>
                    <p className="text-xs text-green-700 mt-0.5">Our team will respond to <strong>{form.email}</strong> within 2 working days.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nodal Officer Name"
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-green-300" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Institution *</label>
                      <input required value={form.instituion} onChange={(e) => setForm({ ...form, instituion: e.target.value })} placeholder="Institution Name"
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-green-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Official Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nodal.officer@institution.gov.in"
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-green-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subject *</label>
                    <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-green-300">
                      <option value="">Select a subject</option>
                      <option>Account Verification Issue</option>
                      <option>Order/Delivery Dispute</option>
                      <option>PO Billing Request</option>
                      <option>Disposal Certificate Query</option>
                      <option>Technical / Login Issue</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                    <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe your issue in detail..."
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" />
                  </div>
                  <button type="submit" disabled={formStatus === "sending"}
                    className="w-full bg-green-700 text-white font-bold py-2.5 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-60 text-sm">
                    {formStatus === "sending" ? "Sending..." : "Submit Support Request"}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-white border border-border rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left gap-3"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                      {openFaq === i
                        ? <ChevronDown size={15} className="text-green-600 shrink-0" />
                        : <ChevronRight size={15} className="text-gray-400 shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-border">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-2.5">
                <AlertCircle size={15} className="text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  For urgent issues involving active deliveries, call our helpline directly at <strong>1800-111-GAMS</strong> for immediate assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#1A3A6B] text-white py-8 mt-8">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5"><AshokaChakra size={26} /><p className="text-sm font-black">GAMS Buyer Portal</p></div>
          <p className="text-xs text-blue-200">© {new Date().getFullYear()} Ministry of Finance, Government of India</p>
        </div>
      </footer>
    </div>
  );
}
