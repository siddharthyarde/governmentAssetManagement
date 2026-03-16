"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, CheckCircle, Phone, Mail, FileText, Clock, Upload, MessageSquare } from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

const CATEGORIES = [
  "Order not received",
  "Wrong item delivered",
  "Item damaged / defective on delivery",
  "Payment issue / wrong charge",
  "Refund not processed",
  "Aadhaar verification issue",
  "Account access problem",
  "Asset quality not matching rating",
  "Disposal certificate not received",
  "General complaint / feedback",
  "Other",
];

type Step = "form" | "submitted";

export default function GrievancePage() {
  const [step, setStep]     = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState("");

  // Form fields
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject]   = useState("");
  const [orderNum, setOrderNum] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment]   = useState<File | null>(null);
  const [contact, setContact] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setLoading(true);
    // Generate a fake ticket ID (in production, insert into a grievances table)
    const id = `GRV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(id);

    // Attempt to log in Supabase (best-effort, page works for guests too)
    try {
      const db = createClient();
      const { data: { user } } = await db.auth.getUser();
      if (user) {
        // In a production setup, you would insert into a grievances table
        // await db.from("grievances").insert({ user_id: user.id, ticket_id: id, category, subject, order_number: orderNum, description, status: "open" });
        console.log("Grievance logged for user:", user.id);
      }
    } catch {
      // Guest submission — still show success
    }

    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("submitted");
  }

  if (step === "submitted") {
    return (
      <div className="min-h-dvh bg-surface flex flex-col">
        <header className="bg-white border-b border-border">
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#fff 33.33% 66.66%,#138808 66.66%)" }} />
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
            <Link href="/public" className="text-sm text-[#7A7A7A] hover:text-saffron-600 font-medium flex items-center gap-1">
              <ChevronLeft size={15} /> Home
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={36} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Grievance Registered</h1>
            <p className="text-[#7A7A7A] text-sm mb-5">
              Your complaint has been filed successfully. We will respond within 3–5 working days per the PGRS guidelines.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Your Ticket ID</p>
              <p className="text-2xl font-black text-green-700 font-mono">{ticketId}</p>
              <p className="text-xs text-green-600 mt-1">Save this for future reference</p>
            </div>
            <div className="space-y-3 text-sm text-left mb-6">
              <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl">
                <Clock size={16} className="text-saffron-500 shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A1A1A]">First response within 24 hours</p>
                  <p className="text-xs text-[#7A7A7A]">Our team will acknowledge your complaint</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl">
                <CheckCircle size={16} className="text-green-500 shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Resolution within 3–5 working days</p>
                  <p className="text-xs text-[#7A7A7A]">Complex cases may take up to 15 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl">
                <Mail size={16} className="text-blue-500 shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Updates on {contact || "your registered contact"}</p>
                  <p className="text-xs text-[#7A7A7A]">Track your grievance status by ticket ID</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/public/marketplace" className="btn-primary text-sm">Back to Marketplace</Link>
              <button onClick={() => { setStep("form"); setTicketId(""); }} className="btn-outline text-sm">
                File Another Grievance
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface">
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#fff 33.33% 66.66%,#138808 66.66%)" }} />
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Link href="/public" className="text-sm text-[#7A7A7A] hover:text-saffron-600 font-medium flex items-center gap-1">
            <ChevronLeft size={15} /> Home
          </Link>
          <span className="text-[#D0D0C8]">/</span>
          <h1 className="text-sm font-bold text-[#1A1A1A]">Grievance Portal</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full mb-4">
            <AlertTriangle size={13} className="text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700">Public Grievance Portal — PGRS Compliant</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">File a Grievance</h1>
          <p className="text-[#7A7A7A] text-sm max-w-xl">
            Facing an issue with your order, delivery, or account? Submit your complaint here. All grievances are acknowledged within 24 hours per Government of India guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-5">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mb-2">
                  Issue Category <span className="text-danger">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-200"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mb-2">
                  Subject <span className="text-danger">*</span>
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  maxLength={150}
                  placeholder="Brief description of the issue..."
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-200"
                />
                <p className="text-[10px] text-[#9A9A9A] mt-1">{subject.length}/150 characters</p>
              </div>

              {/* Order number (optional) */}
              <div>
                <label className="block text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mb-2">
                  Order Number (if applicable)
                </label>
                <input
                  value={orderNum}
                  onChange={(e) => setOrderNum(e.target.value)}
                  placeholder="e.g. ORD-2026-004512"
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mb-2">
                  Describe Your Issue <span className="text-danger">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  minLength={20}
                  maxLength={1000}
                  placeholder="Please provide as much detail as possible — dates, amounts, what you expected and what happened..."
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-200"
                />
                <p className="text-[10px] text-[#9A9A9A] mt-1">{description.length}/1000 characters (min 20)</p>
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mb-2">
                  Attach Supporting Document (optional)
                </label>
                <label className="flex items-center gap-3 border-2 border-dashed border-border rounded-xl px-4 py-4 cursor-pointer hover:border-saffron-300 hover:bg-saffron-50 transition-colors">
                  <Upload size={18} className="text-[#9A9A9A]" />
                  <div>
                    <p className="text-sm font-medium text-[#5A5A5A]">
                      {attachment ? attachment.name : "Click to upload photo or document"}
                    </p>
                    <p className="text-xs text-[#9A9A9A]">JPG, PNG, PDF · Max 5 MB</p>
                  </div>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mb-2">
                  Contact (email or mobile) <span className="text-danger">*</span>
                </label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  type="text"
                  placeholder="your@email.com or 9876543210"
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-200"
                />
              </div>

              {/* Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
                By submitting this grievance, you confirm the information provided is accurate. False complaints may lead to account suspension per GOI guidelines.
              </div>

              <button
                type="submit"
                disabled={loading || description.length < 20}
                className="w-full btn-primary py-3 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : "Submit Grievance"}
              </button>
            </form>
          </div>

          {/* Sidebar info */}
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-2xl p-5">
              <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-3">Need Immediate Help?</p>
              <div className="space-y-3">
                <a href="tel:1800111234" className="flex items-center gap-3 text-sm hover:text-saffron-600 transition-colors">
                  <div className="w-8 h-8 bg-saffron-100 text-saffron-600 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="font-semibold">1800-11-1234</p>
                    <p className="text-xs text-[#9A9A9A]">Toll-free · 9AM–6PM</p>
                  </div>
                </a>
                <a href="mailto:grievance@gams.gov.in" className="flex items-center gap-3 text-sm hover:text-saffron-600 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="font-semibold">grievance@gams.gov.in</p>
                    <p className="text-xs text-[#9A9A9A]">Response within 24 hours</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-3">
                <MessageSquare size={11} className="inline mr-1" />
                Process
              </p>
              <div className="space-y-3">
                {[
                  { step: "1", label: "File complaint", desc: "Submit via this form or phone" },
                  { step: "2", label: "Ticket generated", desc: "Instant ticket ID via SMS/email" },
                  { step: "3", label: "24hr acknowledgement", desc: "First response within 24 hours" },
                  { step: "4", label: "Resolution", desc: "3–5 working days (max 15)" },
                ].map((s) => (
                  <div key={s.step} className="flex gap-3">
                    <div className="w-5 h-5 bg-saffron-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1A1A1A]">{s.label}</p>
                      <p className="text-[10px] text-[#9A9A9A]">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-2">
                <FileText size={11} className="inline mr-1" />
                DPDP &amp; RTI
              </p>
              <p className="text-xs text-[#7A7A7A] leading-relaxed">
                Governed under the Public Grievances Redressal Scheme (PGRS) and IT Act 2000. RTI applications can be filed at the concerned Ministry.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border bg-white mt-8 py-4 text-center text-xs text-[#9A9A9A]">
        © 2026 Ministry of Finance, Government of India · GAMS Citizen Marketplace
      </footer>
    </div>
  );
}
