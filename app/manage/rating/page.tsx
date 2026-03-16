"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star, Package, CheckCircle2, Search, ChevronDown,
  LayoutDashboard, Bell, Building2, Calendar, FileText,
  Warehouse, AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

interface RatingEntry {
  id: string;
  assetId: string;
  assetName: string;
  event: string;
  company: string;
  ratedBy: string;
  ratedByRole: string;
  conditionBefore: "Excellent" | "Good" | "Serviceable" | "Fair";
  conditionAfter: "Excellent" | "Good" | "Serviceable" | "Fair" | "Defective";
  rating: number;
  comment: string;
  date: string;
  reviewed: boolean;
}

const RATINGS: RatingEntry[] = [
  { id: "RAT-001", assetId: "AST-001", assetName: "Folding Chairs — Steel Frame", event: "G20 Summit 2023", company: "Jai Hind Traders", ratedBy: "Suresh Kumar", ratedByRole: "Warehouse Manager", conditionBefore: "Excellent", conditionAfter: "Good", rating: 4, comment: "Some chairs have minor fabric stretching but structurally sound.", date: "2024-01-15", reviewed: true },
  { id: "RAT-002", assetId: "AST-002", assetName: "JBL Amplifiers 2000W", event: "Digital India Conclave", company: "Surya Electricals", ratedBy: "Priya Verma", ratedByRole: "Technical Lead", conditionBefore: "Excellent", conditionAfter: "Good", rating: 5, comment: "All units working perfectly. Professional handling by the company.", date: "2024-01-20", reviewed: true },
  { id: "RAT-003", assetId: "AST-008", assetName: "Industrial Air Coolers", event: "Pravasi Bharatiya Diwas", company: "CoolBreeze Corp.", ratedBy: "Anil Tripathi", ratedByRole: "Site Inspector", conditionBefore: "Good", conditionAfter: "Defective", rating: 2, comment: "8 units returned with broken fan blades. Company dispute pending.", date: "2024-02-05", reviewed: false },
  { id: "RAT-004", assetId: "AST-005", assetName: "LED Par Lights RGBW", event: "Republic Day 2024", company: "LightTech Pvt.", ratedBy: "Meena Shah", ratedByRole: "Event Manager", conditionBefore: "Excellent", conditionAfter: "Excellent", rating: 5, comment: "Exceptional condition. Pristine handling. Highly recommend this company.", date: "2024-01-28", reviewed: true },
  { id: "RAT-005", assetId: "AST-004", assetName: "Modular Stage Platforms", event: "National Sports Games", company: "EventSetup Co.", ratedBy: "Rajesh Nair", ratedByRole: "Logistics Officer", conditionBefore: "Good", conditionAfter: "Serviceable", rating: 3, comment: "Some surface scratches and one damaged joint. Expected for outdoor use.", date: "2024-02-01", reviewed: false },
  { id: "RAT-006", assetId: "AST-009", assetName: "1.5 Ton Window ACs", event: "Vibrant Gujarat Summit", company: "ClimaWorks", ratedBy: "Suresh Kumar", ratedByRole: "Warehouse Manager", conditionBefore: "Excellent", conditionAfter: "Good", rating: 4, comment: "AC units well maintained. Minor cosmetic damage on 3 units.", date: "2024-01-12", reviewed: true },
];

const CONDITION_CLS = { Excellent: "text-green-600", Good: "text-blue-600", Serviceable: "text-yellow-600", Fair: "text-orange-600", Defective: "text-red-600" };

const NAV_ITEMS = [
  { href: "/manage", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/manage/notifications", icon: Bell, label: "Notifications" },
  { href: "/manage/assets", icon: Package, label: "Asset Registry" },
  { href: "/manage/events", icon: Calendar, label: "Events" },
  { href: "/manage/rating", icon: Star, label: "Rate Assets" },
  { href: "/manage/defects", icon: AlertTriangle, label: "Defects" },
  { href: "/manage/approvals", icon: CheckCircle2, label: "Approvals" },
  { href: "/manage/analytics", icon: FileText, label: "Analytics" },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12} className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  );
}

export default function RatingPage() {
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState<"all" | "pending" | "reviewed">("all");
  const [selected, setSelected] = useState<RatingEntry | null>(null);

  useEffect(() => {
    const db = createClient();
    db.from("condition_ratings")
      .select("id, instance_id, event_id, rated_by, rated_at, rating, rating_label, notes, recommended_action")
      .order("rated_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setRatings(
          (data ?? []).map((r, i) => {
            const condLabel = r.rating >= 4 ? "Excellent" : r.rating >= 3 ? "Good" : r.rating >= 2 ? "Serviceable" : "Fair";
            return {
              id: `RAT-${String(i + 1).padStart(3, "0")}`,
              assetId: r.instance_id.slice(0, 8),
              assetName: `Asset #${r.instance_id.slice(0, 8)}`,
              event: r.event_id ? `Event #${r.event_id.slice(0, 8)}` : "—",
              company: "—",
              ratedBy: r.rated_by ? r.rated_by.slice(0, 8) : "System",
              ratedByRole: "Inspector",
              conditionBefore: "Good" as RatingEntry["conditionBefore"],
              conditionAfter: condLabel as RatingEntry["conditionAfter"],
              rating: r.rating,
              comment: r.notes ?? r.rating_label,
              date: r.rated_at.slice(0, 10),
              reviewed: r.recommended_action !== null,
            };
          })
        );
        setLoading(false);
      });
  }, []);

  const filtered = ratings.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.assetName.toLowerCase().includes(q) || r.event.toLowerCase().includes(q) || r.company.toLowerCase().includes(q);
    const matchReview = reviewFilter === "all" || (reviewFilter === "pending" && !r.reviewed) || (reviewFilter === "reviewed" && r.reviewed);
    return matchSearch && matchReview;
  });

  const avgRating = (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1);
  const pendingCount = ratings.filter((r) => !r.reviewed).length;

  function markReviewed(id: string) {
    setRatings((prev) => prev.map((r) => r.id === id ? { ...r, reviewed: true } : r));
    setSelected((prev) => prev && prev.id === id ? { ...prev, reviewed: true } : prev);
  }

  return (
    <div className="min-h-dvh bg-surface flex">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">भारत सरकार · GOI</p>
          <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/rating" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}>
              <Icon size={15} /> {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-border">
          <p className="text-[10px] text-[#9A9A9A]">GAMS v1.0 · Ministry of Finance</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

        <header className="bg-white border-b border-border px-6 py-4">
          <h1 className="text-lg font-black text-gray-900">Rate Assets</h1>
          <p className="text-xs text-gray-400">Post-event condition ratings submitted by inspectors</p>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-5">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center"><Star size={18} className="text-yellow-500" /></div>
              <div><p className="text-xs text-gray-400 font-semibold">Avg. Rating</p><p className="text-xl font-black text-gray-900">{avgRating} / 5</p></div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-saffron-50 flex items-center justify-center"><AlertTriangle size={18} className="text-saffron-500" /></div>
              <div><p className="text-xs text-gray-400 font-semibold">Pending Review</p><p className="text-xl font-black text-gray-900">{pendingCount}</p></div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><CheckCircle2 size={18} className="text-green-600" /></div>
              <div><p className="text-xs text-gray-400 font-semibold">Total Ratings</p><p className="text-xl font-black text-gray-900">{ratings.length}</p></div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2 flex-1 min-w-48">
              <Search size={14} className="text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets, events, companies…" className="flex-1 text-sm outline-none bg-transparent" />
            </div>
            {(["all", "pending", "reviewed"] as const).map((f) => (
              <button key={f} onClick={() => setReviewFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-bold capitalize ${reviewFilter === f ? "bg-saffron-500 text-white" : "bg-white border border-border text-gray-600 hover:bg-surface"}`}>
                {f === "all" ? "All" : f === "pending" ? `Pending (${pendingCount})` : "Reviewed"}
              </button>
            ))}
          </div>

          <div className="flex gap-5 min-h-0">
            <div className={`bg-white border border-border rounded-2xl overflow-auto ${selected ? "flex-1" : "w-full"}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                    <th className="text-left px-4 py-3">Asset / Event</th>
                    <th className="text-left px-4 py-3">Company</th>
                    <th className="text-left px-4 py-3">Condition</th>
                    <th className="text-left px-4 py-3">Rating</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className={`border-b border-border hover:bg-surface cursor-pointer ${selected?.id === r.id ? "bg-saffron-50" : ""}`} onClick={() => setSelected(r)}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{r.assetName}</p>
                        <p className="text-[10px] text-gray-400">{r.event}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{r.company}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className={CONDITION_CLS[r.conditionAfter]}>{r.conditionBefore} → <strong>{r.conditionAfter}</strong></span>
                      </td>
                      <td className="px-4 py-3"><StarRow rating={r.rating} /></td>
                      <td className="px-4 py-3">
                        {r.reviewed
                          ? <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-green-100 text-green-700">Reviewed</span>
                          : <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700">Pending</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(r)}
                          className="p-1.5 rounded-lg hover:bg-surface text-gray-400"
                          title="View comment"
                        ><MessageSquare size={13} /></button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">No ratings found</td></tr>}
                </tbody>
              </table>
            </div>

            {selected && (
              <div className="w-80 bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 shrink-0 overflow-y-auto max-h-[72vh]">
                <h2 className="text-sm font-black text-gray-900">{selected.assetName}</h2>
                <StarRow rating={selected.rating} />
                {[
                  { label: "Rating ID", value: selected.id },
                  { label: "Event", value: selected.event },
                  { label: "Company", value: selected.company },
                  { label: "Rated By", value: `${selected.ratedBy} (${selected.ratedByRole})` },
                  { label: "Condition Before", value: selected.conditionBefore },
                  { label: "Condition After", value: selected.conditionAfter },
                  { label: "Date", value: selected.date },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Comment</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-surface rounded-xl px-3 py-2">{selected.comment}</p>
                </div>
                {!selected.reviewed && (
                  <button onClick={() => markReviewed(selected.id)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700">
                    <CheckCircle2 size={13} /> Mark as Reviewed
                  </button>
                )}
                <button onClick={() => setSelected(null)} className="py-2 rounded-xl border border-border text-xs font-bold text-gray-600 hover:bg-surface">Close</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
