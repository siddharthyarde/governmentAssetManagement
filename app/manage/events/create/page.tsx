"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar, ArrowLeft, CheckCircle2, AlertTriangle,
  LayoutDashboard, Package, Building2, Users, FileText,
  ShieldAlert, Star, ClipboardList, Warehouse, MapPin,
  QrCode, Scan,
} from "lucide-react";
import { createEvent } from "../../actions";

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  { value: "national_celebration", label: "National Celebration" },
  { value: "state_celebration",    label: "State Celebration" },
  { value: "cultural",             label: "Cultural" },
  { value: "sports",               label: "Sports" },
  { value: "exhibition",           label: "Exhibition" },
  { value: "relief_distribution",  label: "Relief Distribution" },
  { value: "public_service",       label: "Public Service" },
  { value: "other",                label: "Other" },
];

const GOV_LEVELS = [
  { value: "central",   label: "Central" },
  { value: "state",     label: "State" },
  { value: "district",  label: "District" },
  { value: "local",     label: "Local" },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const NAV = [
  { href: "/manage",              icon: LayoutDashboard, label: "Dashboard" },
  { href: "/manage/assets",        icon: Package,         label: "Assets" },
  { href: "/manage/companies",     icon: Building2,       label: "Companies" },
  { href: "/manage/institutions",  icon: Building2,       label: "Institutions" },
  { href: "/manage/users",         icon: Users,           label: "Users" },
  { href: "/manage/events",        icon: Calendar,        label: "Events" },
  { href: "/manage/approvals",     icon: CheckCircle2,    label: "Approvals" },
  { href: "/manage/analytics",     icon: FileText,        label: "Analytics" },
  { href: "/manage/defects",       icon: AlertTriangle,   label: "Defects" },
  { href: "/manage/rating",        icon: Star,            label: "Ratings" },
  { href: "/manage/audit",         icon: ClipboardList,   label: "Audit" },
  { href: "/manage/warehouse",     icon: Warehouse,       label: "Warehouse" },
  { href: "/manage/redistribution",icon: MapPin,          label: "Redistribution" },
  { href: "/manage/scan",          icon: Scan,            label: "Scan" },
  { href: "/manage/reports",       icon: FileText,        label: "Reports" },
  { href: "/manage/settings",      icon: ShieldAlert,     label: "Settings" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateEventPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    event_type: "national_celebration",
    gov_level: "central",
    state_code: "",
    district: "",
    venue: "",
    start_date: "",
    end_date: "",
    expected_footfall: "",
    organising_ministry: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!form.name.trim())       { setError("Event name is required.");          return; }
    if (!form.venue.trim())      { setError("Venue is required.");               return; }
    if (!form.start_date)        { setError("Start date is required.");          return; }
    if (!form.end_date)          { setError("End date is required.");            return; }
    if (form.end_date < form.start_date) { setError("End date must be on or after start date."); return; }

    setSubmitting(true);
    try {
      const eventCode = await createEvent({
        name: form.name.trim(),
        event_type: form.event_type,
        gov_level: form.gov_level,
        state_code: form.state_code,
        district: form.district.trim(),
        venue: form.venue.trim(),
        start_date: form.start_date,
        end_date: form.end_date,
        expected_footfall: form.expected_footfall ? parseInt(form.expected_footfall, 10) : null,
        organising_ministry: form.organising_ministry.trim(),
        description: form.description.trim(),
      });
      setSuccess(eventCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = "w-full border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron-400 bg-white";
  const labelCls = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";

  // ─── Success screen ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-dvh bg-surface flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm w-full text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">Event Created!</h2>
            <p className="text-sm text-gray-500 mt-1">
              Your event has been saved as a draft.
            </p>
            <p className="text-xs font-mono bg-gray-100 rounded-lg px-3 py-1.5 mt-3 text-gray-700">{success}</p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => router.push("/manage/events")}
              className="flex-1 text-white text-sm font-bold py-2.5 rounded-xl"
              style={{ background: "#E07B00" }}
            >
              View All Events
            </button>
            <button
              onClick={() => { setSuccess(null); setForm({ name: "", event_type: "national_celebration", gov_level: "central", state_code: "", district: "", venue: "", start_date: "", end_date: "", expected_footfall: "", organising_ministry: "", description: "" }); }}
              className="flex-1 border border-border text-sm font-bold py-2.5 rounded-xl text-gray-700 hover:bg-surface"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">भारत सरकार · GOI</p>
          <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/events" ? "bg-saffron-50 text-saffron-700" : "text-gray-600 hover:bg-surface"}`}
            >
              <Icon size={14} /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 py-8 px-4 sm:px-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/manage/events" className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-border text-gray-500">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900">Create New Event</h1>
            <p className="text-xs text-gray-400">Fills in the event details; saved as a draft. Approve from the Events list.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Basic Info */}
          <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-sm font-black text-gray-900">Basic Information</h2>

            <div>
              <label className={labelCls}>Event Name <span className="text-red-500">*</span></label>
              <input className={inputCls} placeholder="e.g. Republic Day 2026 — New Delhi" value={form.name} onChange={set("name")} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Event Type <span className="text-red-500">*</span></label>
                <select className={inputCls} value={form.event_type} onChange={set("event_type")}>
                  {EVENT_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Government Level <span className="text-red-500">*</span></label>
                <select className={inputCls} value={form.gov_level} onChange={set("gov_level")}>
                  {GOV_LEVELS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Organising Ministry</label>
              <input className={inputCls} placeholder="e.g. Ministry of Home Affairs" value={form.organising_ministry} onChange={set("organising_ministry")} />
            </div>
          </section>

          {/* Location */}
          <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-sm font-black text-gray-900">Location</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>State</label>
                <select className={inputCls} value={form.state_code} onChange={set("state_code")}>
                  <option value="">— Select State —</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>District</label>
                <input className={inputCls} placeholder="e.g. Central Delhi" value={form.district} onChange={set("district")} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Venue <span className="text-red-500">*</span></label>
              <input className={inputCls} placeholder="e.g. Kartavya Path, New Delhi" value={form.venue} onChange={set("venue")} />
            </div>
          </section>

          {/* Schedule */}
          <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-sm font-black text-gray-900">Schedule</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Start Date <span className="text-red-500">*</span></label>
                <input type="date" className={inputCls} value={form.start_date} onChange={set("start_date")} />
              </div>
              <div>
                <label className={labelCls}>End Date <span className="text-red-500">*</span></label>
                <input type="date" className={inputCls} value={form.end_date} min={form.start_date} onChange={set("end_date")} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Expected Footfall</label>
              <input
                type="number"
                min={0}
                className={inputCls}
                placeholder="e.g. 50000"
                value={form.expected_footfall}
                onChange={set("expected_footfall")}
              />
            </div>
          </section>

          {/* Description */}
          <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-sm font-black text-gray-900">Additional Details</h2>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                rows={4}
                className={`${inputCls} resize-none`}
                placeholder="Brief description of the event scope, purpose, and requirements…"
                value={form.description}
                onChange={set("description")}
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3 pb-8">
            <Link
              href="/manage/events"
              className="flex-1 text-center border border-border rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 text-white text-sm font-bold py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{ background: "#E07B00" }}
            >
              {submitting ? "Creating Event…" : "Create Event (Save as Draft)"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
