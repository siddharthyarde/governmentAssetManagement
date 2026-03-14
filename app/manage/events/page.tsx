"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Calendar, MapPin, Building2, Package, Users, Plus,
  Search, Filter, ChevronDown, Eye, Edit2, MoreVertical,
  X, Clock, CheckCircle2, AlertCircle, Truck, Globe,
  Tag, QrCode, Download, FileText, RefreshCw, Archive,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";
import type { EventRow } from "@gams/lib/supabase/database.types";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventStatus = "upcoming" | "ongoing" | "completed" | "archived";

interface GOIEvent {
  id:          string;
  name:        string;
  ministry:    string;
  city:        string;
  state:       string;
  venue:       string;
  startDate:   string;
  endDate:     string;
  status:      EventStatus;
  totalAssets: number;
  totalValue:  number;
  companies:   number;
  listings:    number;
  category:    string;
  description: string;
}

// ─── DB → UI Mapper ─────────────────────────────────────────────────────────

function mapEventRow(row: EventRow): GOIEvent {
  const statusMap: Record<string, EventStatus> = {
    draft: "upcoming",
    approved: "upcoming",
    assets_requested: "upcoming",
    assets_confirmed: "upcoming",
    ongoing: "ongoing",
    ended: "completed",
    post_event_review: "completed",
    closed: "archived",
  };
  return {
    id: row.event_code,
    name: row.name,
    ministry: row.organising_ministry ?? "—",
    city: row.district ?? "—",
    state: row.state_code ?? "—",
    venue: row.venue,
    startDate: row.start_date,
    endDate: row.end_date,
    status: (statusMap[row.status] as EventStatus) ?? "upcoming",
    totalAssets: 0,
    totalValue: 0,
    companies: 0,
    listings: 0,
    category: row.event_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: row.description ?? "",
  };
}

// ─── Mock Data (fallback while loading) ──────────────────────────────────────

const EVENTS: GOIEvent[] = [
  {
    id: "EVT-2024-001", name: "G20 Summit India 2023", ministry: "Ministry of External Affairs",
    city: "New Delhi", state: "Delhi", venue: "Bharat Mandapam, Pragati Maidan",
    startDate: "2023-09-07", endDate: "2023-09-10", status: "completed",
    totalAssets: 42000, totalValue: 1280000000, companies: 38, listings: 124, category: "International Summit",
    description: "India's G20 Presidency summit. Massive logistics including furniture, AV, infrastructure and security equipment across multiple venues in New Delhi.",
  },
  {
    id: "EVT-2024-002", name: "Digital India Conclave 2023", ministry: "Ministry of Electronics and IT",
    city: "Mumbai", state: "Maharashtra", venue: "NESCO Exhibition Centre, Goregaon",
    startDate: "2023-11-14", endDate: "2023-11-16", status: "completed",
    totalAssets: 8500, totalValue: 240000000, companies: 14, listings: 56, category: "Tech Expo",
    description: "Annual flagship event showcasing digital public infrastructure. AV, IT equipment, displays, and seating for 5,000+ delegates.",
  },
  {
    id: "EVT-2024-003", name: "India Energy Week 2024", ministry: "Ministry of Petroleum & NG",
    city: "Bangalore", state: "Karnataka", venue: "BIEC, Tumkur Road",
    startDate: "2024-02-06", endDate: "2024-02-09", status: "completed",
    totalAssets: 5200, totalValue: 890000000, companies: 21, listings: 48, category: "Industry Expo",
    description: "India's largest energy event covering oil, gas, and renewables. Heavy electrical and generator equipment redistribution.",
  },
  {
    id: "EVT-2024-004", name: "National Sports Games 2023", ministry: "Ministry of Youth & Sports",
    city: "Ahmedabad", state: "Gujarat", venue: "Narendra Modi Stadium & GMDC Ground",
    startDate: "2023-10-25", endDate: "2023-11-05", status: "completed",
    totalAssets: 28000, totalValue: 460000000, companies: 29, listings: 87, category: "National Sports",
    description: "Multi-sport national competition. Infrastructure, seating, sound, and safety equipment across 6 venues in Ahmedabad.",
  },
  {
    id: "EVT-2024-005", name: "Republic Day Parade Setup 2024", ministry: "Ministry of Defence",
    city: "New Delhi", state: "Delhi", venue: "Kartavya Path, Vijay Chowk",
    startDate: "2024-01-15", endDate: "2024-01-28", status: "completed",
    totalAssets: 15000, totalValue: 320000000, companies: 18, listings: 62, category: "National Ceremony",
    description: "Republic Day parade and related events. Lighting, stage, crowd management, and ceremonial equipment.",
  },
  {
    id: "EVT-2024-006", name: "Kumbh Mela 2025 Setup", ministry: "Ministry of Tourism",
    city: "Prayagraj", state: "Uttar Pradesh", venue: "Sangam, Prayagraj",
    startDate: "2025-01-13", endDate: "2025-02-26", status: "ongoing",
    totalAssets: 180000, totalValue: 5200000000, companies: 87, listings: 312, category: "Religious Event",
    description: "World's largest religious gathering. Extensive infrastructure covering crowd management, sanitation, tents, lighting, and safety across 50+ sq km.",
  },
  {
    id: "EVT-2024-007", name: "Budget Conclave 2025", ministry: "Ministry of Finance",
    city: "New Delhi", state: "Delhi", venue: "Vigyan Bhawan, New Delhi",
    startDate: "2025-01-28", endDate: "2025-01-30", status: "completed",
    totalAssets: 1200, totalValue: 42000000, companies: 8, listings: 22, category: "Government Meet",
    description: "Pre-budget economic conclave with industry leaders. Furniture, AV, and conferencing equipment.",
  },
  {
    id: "EVT-2025-001", name: "AIIMS New Campus Inauguration", ministry: "Ministry of Health",
    city: "Raipur", state: "Chhattisgarh", venue: "AIIMS Raipur Campus",
    startDate: "2025-03-15", endDate: "2025-03-15", status: "upcoming",
    totalAssets: 0, totalValue: 0, companies: 0, listings: 0, category: "Inauguration",
    description: "New AIIMS campus inauguration. Furniture and AV equipment expected to be listed post-event.",
  },
  {
    id: "EVT-2025-002", name: "India Smart Cities Summit 2025", ministry: "Ministry of Housing & Urban Affairs",
    city: "Pune", state: "Maharashtra", venue: "Auto Cluster Exhibition Centre",
    startDate: "2025-04-10", endDate: "2025-04-12", status: "upcoming",
    totalAssets: 0, totalValue: 0, companies: 0, listings: 0, category: "Tech Expo",
    description: "Annual smart cities conference. Displays, furniture, lighting, and AV equipment for 3,000+ delegates.",
  },
];

const CATEGORIES = ["All", "International Summit", "Tech Expo", "Industry Expo", "National Sports", "National Ceremony", "Religious Event", "Government Meet", "Inauguration", "Other"];
const STATES     = ["All States", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Uttar Pradesh", "Rajasthan", "Kerala", "West Bengal"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatValue(n: number) {
  if (n >= 1_00_00_00_000) return `₹${(n / 1_00_00_00_000).toFixed(1)}K Cr`;
  if (n >= 1_00_00_000)    return `₹${(n / 1_00_00_000).toFixed(0)} Cr`;
  if (n >= 1_00_000)        return `₹${(n / 1_00_000).toFixed(0)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const STATUS_META: Record<EventStatus, { label: string; cls: string; icon: React.ElementType }> = {
  upcoming:  { label: "Upcoming",  cls: "bg-blue-100 text-blue-700",    icon: Clock        },
  ongoing:   { label: "Ongoing",   cls: "bg-green-100 text-green-700",  icon: RefreshCw    },
  completed: { label: "Completed", cls: "bg-gray-100 text-gray-600",    icon: CheckCircle2 },
  archived:  { label: "Archived",  cls: "bg-orange-50 text-orange-600", icon: Archive      },
};

// ─── Export Helpers ─────────────────────────────────────────────────────────────────

function csvDownload(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportEvent(event: GOIEvent) {
  const rows: string[][] = [
    ["Field", "Value"],
    ["Event ID", event.id],
    ["Event Name", event.name],
    ["Ministry", event.ministry],
    ["Category", event.category],
    ["State", event.state],
    ["Venue", event.venue + ", " + event.city],
    ["Start Date", event.startDate],
    ["End Date", event.endDate],
    ["Status", event.status],
    ["Total Assets", String(event.totalAssets)],
    ["Total Value (INR)", String(event.totalValue)],
    ["Companies Involved", String(event.companies)],
    ["Product Listings", String(event.listings)],
    ["Description", event.description],
    [""],
    ["Exported", new Date().toLocaleString("en-IN")],
  ];
  csvDownload(rows, `Event-${event.id}.csv`);
}

function exportQRReport(event: GOIEvent) {
  const scans = event.totalAssets > 0
    ? Array.from({ length: Math.min(event.totalAssets, 20) }, (_, i) => [
        `QR-${event.id}-${String(i + 1).padStart(5, "0")}`,
        event.id,
        event.name,
        `Warehouse-${(i % 3) + 1}`,
        `Officer ${["Ramesh K", "Priya S", "Ajay M"][i % 3]}`,
        event.startDate,
        "Valid",
      ])
    : [["No QR scans recorded for this event.", "", "", "", "", "", ""]];
  const rows: string[][] = [
    ["QR Report — " + event.name],
    ["Event ID", event.id, "Status", event.status],
    [""],
    ["QR Ref", "Event ID", "Event Name", "Location", "Scanned By", "Date", "Status"],
    ...scans,
    [""],
    ["Generated", new Date().toLocaleString("en-IN")],
  ];
  csvDownload(rows, `QR-Report-${event.id}.csv`);
}

// ─── Event Detail Modal ───────────────────────────────────────────────────────────────

function EventModal({ event, onClose, onArchive }: { event: GOIEvent; onClose: () => void; onArchive: (id: string) => void }) {
  const meta = STATUS_META[event.status];
  const StatusIcon = meta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between" style={{ background: "#E07B0008" }}>
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-bold text-gray-900 truncate">{event.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{event.id}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${meta.cls}`}>
              <StatusIcon size={9} /> {meta.label}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-gray-400"><X size={16} /></button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4 max-h-[75dvh] overflow-y-auto">
          {/* Overview grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { icon: Building2, label: "Ministry",    val: event.ministry                         },
              { icon: Tag,       label: "Category",    val: event.category                         },
              { icon: MapPin,    label: "Venue",       val: `${event.venue}, ${event.city}`        },
              { icon: Globe,     label: "State",       val: event.state                            },
              { icon: Calendar,  label: "Start Date",  val: event.startDate                        },
              { icon: Calendar,  label: "End Date",    val: event.endDate                          },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon size={13} className="text-saffron-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">{label}</p>
                  <p className="font-semibold text-gray-900 text-xs leading-tight">{val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-surface border border-border rounded-xl p-4 text-sm text-gray-700">
            {event.description}
          </div>

          {/* Asset stats */}
          {event.totalAssets > 0 && (
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: "Total Assets",   val: event.totalAssets.toLocaleString("en-IN") },
                { label: "Asset Value",    val: formatValue(event.totalValue)              },
                { label: "Companies",      val: event.companies.toString()                 },
                { label: "Listings",       val: event.listings.toString()                  },
              ].map(({ label, val }) => (
                <div key={label} className="bg-surface border border-border rounded-xl p-3">
                  <p className="text-sm font-black text-gray-900">{val}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { onClose(); window.location.href = "/assets?event=" + event.id; }}
              className="flex items-center gap-1.5 text-xs font-semibold border border-border text-gray-700 px-4 py-2 rounded-xl hover:bg-surface"
            >
              <Package size={12} /> View Listings
            </button>
            <button
              onClick={() => exportQRReport(event)}
              className="flex items-center gap-1.5 text-xs font-semibold border border-border text-gray-700 px-4 py-2 rounded-xl hover:bg-surface"
            >
              <QrCode size={12} /> QR Report
            </button>
            <button
              onClick={() => exportEvent(event)}
              className="flex items-center gap-1.5 text-xs font-semibold border border-border text-gray-700 px-4 py-2 rounded-xl hover:bg-surface"
            >
              <Download size={12} /> Export Data
            </button>
            {event.status === "completed" && (
              <button
                onClick={() => { onArchive(event.id); onClose(); }}
                className="flex items-center gap-1.5 text-xs font-semibold border border-orange-300 text-orange-600 px-4 py-2 rounded-xl hover:bg-orange-50 ml-auto"
              >
                <Archive size={12} /> Archive
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Event Modal ──────────────────────────────────────────────────────────

function AddEventModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={26} className="text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Event Created!</h3>
          <p className="text-sm text-gray-500 mb-5">The new GOI event has been added to the system. Companies can now link their product submissions to this event.</p>
          <button onClick={onClose} className="w-full text-white font-bold py-2.5 rounded-xl" style={{ background: "#E07B00" }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Add GOI Event</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-gray-400"><X size={16} /></button>
        </div>

        <form
          className="p-6 flex flex-col gap-4"
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        >
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Event Name <span className="text-red-500">*</span></label>
            <input required className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400" placeholder="e.g. India Tech Summit 2025" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Ministry / Department <span className="text-red-500">*</span></label>
            <input required className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400" placeholder="e.g. Ministry of Electronics and IT" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">City</label>
              <input className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none" placeholder="New Delhi" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">State</label>
              <select className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white">
                <option value="">Select…</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Venue</label>
            <input className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none" placeholder="e.g. Bharat Mandapam, Pragati Maidan" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Start Date <span className="text-red-500">*</span></label>
              <input type="date" required className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">End Date <span className="text-red-500">*</span></label>
              <input type="date" required className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Category</label>
            <select className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white">
              {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
            <textarea className="w-full border border-border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none" rows={3} placeholder="Brief description of the event and expected asset types…" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-border rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-surface">Cancel</button>
            <button type="submit" className="flex-1 text-white text-sm font-bold py-2.5 rounded-xl hover:opacity-90" style={{ background: "#E07B00" }}>
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [events, setEvents]           = useState<GOIEvent[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatus]     = useState<EventStatus | "all">("all");
  const [categoryFilter, setCategory] = useState("All");
  const [stateFilter, setState]       = useState("");
  const [selectedEvent, setSelected]  = useState<GOIEvent | null>(null);
  const [showAdd, setShowAdd]         = useState(false);
  const [openMenu, setOpenMenu]       = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .from("events")
      .select("*")
      .order("start_date", { ascending: false })
      .then(({ data, error }) => {
        setEvents(!error && data ? (data as EventRow[]).map(mapEventRow) : []);
        setLoading(false);
      });
  }, []);

  function archiveEvent(id: string) {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, status: "archived" as EventStatus } : e));
  }

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (categoryFilter !== "All" && e.category !== categoryFilter) return false;
      if (stateFilter && e.state !== stateFilter) return false;
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.ministry.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.startDate.localeCompare(a.startDate));
  }, [events, search, statusFilter, categoryFilter, stateFilter]);

  const stats = {
    total:     events.length,
    ongoing:   events.filter((e) => e.status === "ongoing").length,
    upcoming:  events.filter((e) => e.status === "upcoming").length,
    assets:    events.reduce((s, e) => s + e.totalAssets, 0),
    totalVal:  events.reduce((s, e) => s + e.totalValue, 0),
  };

  return (
    <div className="min-h-dvh bg-surface">
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-lg font-black text-gray-900">GAMS</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-sm font-bold text-gray-900">GOI Events</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90"
              style={{ background: "#E07B00" }}
            >
              <Plus size={13} /> Add Event
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Events",   val: stats.total.toString(),                     color: "text-saffron-600", bg: "bg-saffron-50"  },
            { label: "Ongoing",        val: stats.ongoing.toString(),                   color: "text-green-600",  bg: "bg-green-50"    },
            { label: "Upcoming",       val: stats.upcoming.toString(),                  color: "text-blue-600",   bg: "bg-blue-50"     },
            { label: "Total Assets",   val: stats.assets.toLocaleString("en-IN"),       color: "text-gray-600",   bg: "bg-surface"     },
            { label: "Total Value",    val: formatValue(stats.totalVal),                color: "text-green-600",  bg: "bg-green-50"    },
          ].map(({ label, val, color, bg }) => (
            <div key={label} className="bg-white border border-border rounded-2xl p-4">
              <p className={`text-xl font-black ${color}`}>{val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-saffron-400"
              placeholder="Search events, ministries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value as EventStatus | "all")}
            className="border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none appearance-none"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none appearance-none"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={stateFilter}
            onChange={(e) => setState(e.target.value)}
            className="border border-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none appearance-none"
          >
            <option value="">All States</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Event cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e) => {
            const meta       = STATUS_META[e.status];
            const StatusIcon = meta.icon;
            return (
              <div key={e.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#E07B0015" }}>
                    <Calendar size={18} className="text-saffron-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{e.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{e.ministry}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${meta.cls}`}>
                      <StatusIcon size={9} /> {meta.label}
                    </span>
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === e.id ? null : e.id)} className="p-1 rounded-lg hover:bg-surface text-gray-400">
                        <MoreVertical size={14} />
                      </button>
                      {openMenu === e.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-10 py-1 min-w-36">
                          {[
                            { icon: Eye,      label: "View Details" },
                            { icon: Edit2,    label: "Edit Event"   },
                            { icon: Package,  label: "View Assets"  },
                            { icon: FileText, label: "Export PDF"   },
                          ].map(({ icon: Icon, label }) => (
                            <button key={label} onClick={() => { setOpenMenu(null); if (label === "View Details") setSelected(e); }} className="flex items-center gap-2 w-full px-4 py-2 text-xs text-gray-700 hover:bg-surface font-semibold">
                              <Icon size={12} /> {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="shrink-0" />
                    <span className="truncate">{e.venue}, {e.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} className="shrink-0" />
                    <span>{e.startDate} → {e.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag size={11} className="shrink-0" />
                    <span>{e.category}</span>
                  </div>
                </div>

                {/* Stats (show only if assets exist) */}
                {e.totalAssets > 0 ? (
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: "Assets",    val: e.totalAssets.toLocaleString("en-IN") },
                      { label: "Value",     val: formatValue(e.totalValue)              },
                      { label: "Companies", val: e.companies.toString()                 },
                      { label: "Listings",  val: e.listings.toString()                  },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-surface rounded-xl py-2">
                        <p className="text-xs font-black text-gray-900">{val}</p>
                        <p className="text-[9px] text-gray-400">{label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                    <AlertCircle size={12} className="shrink-0" /> No assets listed yet
                  </div>
                )}

                <button
                  onClick={() => setSelected(e)}
                  className="text-sm font-bold text-white py-2 rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: "#E07B00" }}
                >
                  <Eye size={13} /> View Details
                </button>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-border rounded-2xl text-center">
            <Calendar size={36} className="text-gray-200 mb-3" />
            <p className="font-bold text-gray-900 mb-1">No events found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelected(null)} onArchive={archiveEvent} />}
      {showAdd       && <AddEventModal onClose={() => setShowAdd(false)} />}
      {openMenu      && <div className="fixed inset-0 z-0" onClick={() => setOpenMenu(null)} />}
    </div>
  );
}
