"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Star, MapPin, BadgeCheck, CheckCircle2, Package,
  ShoppingBag, ClipboardList, FileText, Settings, LayoutDashboard,
  TrendingDown, Calendar, Shield, Download, ChevronRight,
  IndianRupee, Layers, Wrench, Cpu, ShieldCheck, Armchair,
  AlertCircle, X, Truck,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Condition = "Excellent" | "Good" | "Serviceable" | "Fair";

interface Listing {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  condition: Condition;
  qty: number;
  availableQty: number;
  unitPriceOriginal: number;
  unitPriceListing: number;
  event: string;
  city: string;
  state: string;
  ministry: string;
  listedDate: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  specs: string;
  ageYears: number;
  certifications: string[];
  deliveryLeadDays: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const LISTINGS: Record<string, Listing> = {
  L1001: { id: "L1001", name: "Folding Chairs — Steel Frame, Black Fabric",      category: "Furniture",      subcategory: "Seating",            condition: "Excellent", qty: 8000, availableQty: 5200, unitPriceOriginal: 2400,    unitPriceListing: 320,    event: "G20 Summit India 2023",              city: "New Delhi",  state: "Delhi",         ministry: "MEA",    listedDate: "2024-06-01", verified: true, rating: 4.8, reviewCount: 42, description: "Government-surplus folding chairs used once during the G20 Summit at Bharat Mandapam. Steel powder-coated frame, high-density foam seat with black stretch fabric. ISI marked. Stackable up to 8 units. Excellent condition with minimal wear.", specs: "Width: 48 cm | Depth: 52 cm | Height: 82 cm | Weight: 6.2 kg | Load: 150 kg", ageYears: 1, certifications: ["ISI", "BIS"], deliveryLeadDays: 5 },
  L1002: { id: "L1002", name: "AV Amplifier 2000W — JBL Series",                 category: "Electronics",    subcategory: "Audio Equipment",    condition: "Good",      qty: 120,  availableQty: 80,   unitPriceOriginal: 85000,   unitPriceListing: 22000,  event: "Digital India Conclave 2023",        city: "Mumbai",     state: "Maharashtra",   ministry: "MeitY",  listedDate: "2024-06-05", verified: true, rating: 4.6, reviewCount: 14, description: "Professional JBL Series 2000W 4-channel amplifiers used during the Digital India Conclave. All units in good working condition, serviced and tested before listing.", specs: "Output: 2000W RMS | Channels: 4 | Frequency: 20Hz–20kHz | SNR: ≥98dB | Rack mount: 2U", ageYears: 1, certifications: ["CE", "FCC"], deliveryLeadDays: 7 },
  L1003: { id: "L1003", name: "Industrial Generator — 125 kVA, Diesel",          category: "Electrical",     subcategory: "Generators",         condition: "Good",      qty: 30,   availableQty: 18,   unitPriceOriginal: 4200000, unitPriceListing: 980000, event: "India Energy Week 2024",             city: "Bangalore",  state: "Karnataka",     ministry: "MoP",    listedDate: "2024-05-20", verified: true, rating: 4.7, reviewCount: 8,  description: "125 kVA diesel generators used as backup power for the India Energy Week conference. All units have been serviced and have service logs available.", specs: "Capacity: 125 kVA | Engine: Cummins | Fuel: Diesel | Phase: 3-Phase | Hours: <450", ageYears: 2, certifications: ["ISO 8528", "BIS"], deliveryLeadDays: 14 },
  L1004: { id: "L1004", name: "Modular Stage Platform — Aluminium 2×1m",         category: "Infrastructure", subcategory: "Stage & Flooring",   condition: "Serviceable",qty: 600, availableQty: 350,  unitPriceOriginal: 18000,   unitPriceListing: 3800,   event: "National Sports Games 2023",         city: "Ahmedabad",  state: "Gujarat",       ministry: "MoYAS", listedDate: "2024-05-28", verified: false, rating: 4.2, reviewCount: 19, description: "Aluminium modular stage panels (2×1m each) used for the National Sports Games. Easy interlocking assembly. Surface shows normal wear from use.", specs: "Size: 2m × 1m | Height adjustable: 20–80 cm | Load: 750 kg/m² | Material: 6061-T6 Aluminium", ageYears: 3, certifications: ["BIS"], deliveryLeadDays: 10 },
  L1005: { id: "L1005", name: "LED Par Light 100W RGBW — Stage Grade",           category: "Electronics",    subcategory: "Lighting & Stage",   condition: "Excellent", qty: 500,  availableQty: 480,  unitPriceOriginal: 12000,   unitPriceListing: 2800,   event: "Republic Day Parade Setup 2024",     city: "New Delhi",  state: "Delhi",         ministry: "MoD",    listedDate: "2024-06-10", verified: true, rating: 4.9, reviewCount: 31, description: "Professional RGBW LED par lights used for the Republic Day parade stage setup. Excellent condition, used only once. All units tested.", specs: "Power: 100W | LEDs: 19×5W RGBW | Beam: 25° | IP: IP65 | DMX: 512 compatible", ageYears: 1, certifications: ["CE", "RoHS"], deliveryLeadDays: 4 },
  L1006: { id: "L1006", name: "Conference Table — 10-seater, Teak Finish",       category: "Furniture",      subcategory: "Tables",             condition: "Excellent", qty: 45,   availableQty: 32,   unitPriceOriginal: 38000,   unitPriceListing: 9500,   event: "PM's Economic Advisory Meet",        city: "New Delhi",  state: "Delhi",         ministry: "PMO",    listedDate: "2024-06-12", verified: true, rating: 4.7, reviewCount: 7,  description: "Premium 10-seater conference tables with teak veneer finish. Used in PMO conference rooms. Excellent condition with minor surface marks.", specs: "Length: 390 cm | Width: 130 cm | Height: 76 cm | Finish: Teak Veneer | Seats: 10", ageYears: 2, certifications: ["ISO 7170"], deliveryLeadDays: 6 },
  L1007: { id: "L1007", name: "Crowd Control Barrier — Steel, 2.5m",             category: "Safety",         subcategory: "Crowd Management",   condition: "Good",      qty: 2000, availableQty: 1760, unitPriceOriginal: 3200,    unitPriceListing: 750,    event: "Kumbh Mela 2025 Setup",              city: "Prayagraj",  state: "Uttar Pradesh", ministry: "MoHA",   listedDate: "2024-06-08", verified: true, rating: 4.4, reviewCount: 23, description: "Galvanised steel crowd control barriers from the Kumbh Mela setup. Interlocking design for easy linking. Some rust spots on few units noted.", specs: "Length: 2.5m | Height: 1.1m | Weight: 17 kg | Material: Hot-dip Galvanised Steel", ageYears: 2, certifications: ["BIS"], deliveryLeadDays: 8 },
};

const FALLBACK: Listing = {
  id: "L0000", name: "Listing Not Found", category: "—", subcategory: "—", condition: "Good", qty: 0, availableQty: 0,
  unitPriceOriginal: 0, unitPriceListing: 0, event: "—", city: "—", state: "—", ministry: "—",
  listedDate: "—", verified: false, rating: 0, reviewCount: 0, description: "This listing could not be found.",
  specs: "—", ageYears: 0, certifications: [], deliveryLeadDays: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function discount(orig: number, listing: number) { return Math.round((1 - listing / orig) * 100); }
function conditionMeta(c: Condition) {
  return {
    Excellent:   { cls: "bg-green-100 text-green-700",   label: "Excellent" },
    Good:        { cls: "bg-blue-100 text-blue-700",     label: "Good"      },
    Serviceable: { cls: "bg-yellow-100 text-yellow-700", label: "Serviceable"},
    Fair:        { cls: "bg-red-100 text-red-700",       label: "Fair"      },
  }[c];
}

const NAV = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Dashboard"       },
  { href: "/dashboard/marketplace",  icon: ShoppingBag,     label: "Browse Marketplace" },
  { href: "/dashboard/orders",       icon: ClipboardList,   label: "My Orders"       },
  { href: "/dashboard/documents",    icon: FileText,        label: "Documents"       },
  { href: "/dashboard/settings",     icon: Settings,        label: "Account Settings"},
];

// ─── Order Modal ──────────────────────────────────────────────────────────────

function OrderModal({ listing, onClose, onConfirm }: {
  listing: Listing;
  onClose: () => void;
  onConfirm: (qty: number, note: string) => void;
}) {
  const [qty, setQty]   = useState(1);
  const [note, setNote] = useState("");
  const max = listing.availableQty;
  const total = qty * listing.unitPriceListing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-black text-gray-900">Request Quotation</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface"><X size={16} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <p className="text-sm text-gray-700 font-medium line-clamp-2">{listing.name}</p>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Quantity Required <span className="text-gray-400 normal-case font-normal">(max {max.toLocaleString("en-IN")})</span>
            </label>
            <input
              type="number" min={1} max={max}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
              value={qty}
              onChange={(e) => setQty(Math.min(Math.max(1, Number(e.target.value)), max))}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Additional Notes (optional)</label>
            <textarea
              rows={3}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 resize-none"
              placeholder="Delivery location, inspection requirements, etc."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-bold text-green-700">Estimated Total</span>
            <span className="text-lg font-black text-green-700">₹{total.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-[11px] text-gray-400">A formal Purchase Order will be generated after admin approval. Delivery within {listing.deliveryLeadDays} working days from PO issuance.</p>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold text-gray-600 hover:bg-surface">Cancel</button>
          <button
            onClick={() => { onConfirm(qty, note); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700"
          >
            <CheckCircle2 size={14} /> Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketplaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const listing = LISTINGS[id] ?? { ...FALLBACK, id };

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const disc  = discount(listing.unitPriceOriginal, listing.unitPriceListing);
  const cm    = conditionMeta(listing.condition);
  const avail = Math.round((listing.availableQty / listing.qty) * 100);

  function handleOrder(qty: number, note: string) {
    setOrdered(true);
  }

  function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">GAMS · Buyer Portal</p>
          <p className="text-sm font-bold text-[#1A1A1A]">AIIMS Lucknow</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                href === "/dashboard/marketplace"
                  ? "bg-green-50 text-green-700 font-bold"
                  : "text-gray-500 hover:bg-surface"
              }`}
            >
              <Icon size={15} /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Tiranga */}
        <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4 shrink-0">
          <Link href="/dashboard/marketplace" className="p-2 rounded-lg border border-border hover:bg-surface">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
              <Link href="/dashboard/marketplace" className="hover:underline">Marketplace</Link>
              <ChevronRight size={12} />
              <span className="text-gray-500 font-medium truncate max-w-sm">{listing.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 py-6 max-w-5xl">
          {/* Order Success banner */}
          {ordered && (
            <div className="mb-5 bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">
              <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-700 mb-0.5">Quotation Request Submitted!</p>
                <p className="text-sm text-green-600">Your request has been sent to the GAMS admin team for approval. You will receive a Purchase Order once approved.</p>
                <Link href="/dashboard/orders" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-green-700 hover:underline">
                  View my orders →
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: details */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Header card */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${cm.cls}`}>{cm.label}</span>
                      {listing.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                          <BadgeCheck size={10} /> GAMS Verified
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-gray-400">{listing.id}</span>
                    </div>
                    <h1 className="text-lg font-black text-gray-900 leading-snug">{listing.name}</h1>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={13} className={i <= Math.round(listing.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-800">{listing.rating}</span>
                  <span className="text-xs text-gray-400">({listing.reviewCount} reviews)</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
              </div>

              {/* Specs */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">Technical Specifications</h2>
                <p className="text-sm font-mono text-gray-700 bg-surface rounded-xl px-4 py-3 leading-relaxed">{listing.specs}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <Field label="Category"   value={listing.category} />
                  <Field label="Subcategory" value={listing.subcategory} />
                  <Field label="Asset Age"  value={`${listing.ageYears} yr${listing.ageYears !== 1 ? "s" : ""}`} />
                  <Field label="Lead Time"  value={`${listing.deliveryLeadDays} working days`} />
                </div>

                {listing.certifications.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Certifications</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {listing.certifications.map((c) => (
                        <span key={c} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200">
                          <Shield size={11} /> {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Event provenance */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Asset Provenance</h2>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <Calendar size={14} className="text-saffron-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Source Event</p>
                      <p className="text-sm font-semibold text-gray-800">{listing.event}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                      <p className="text-sm font-semibold text-gray-800">{listing.city}, {listing.state}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ministry</p>
                      <p className="text-sm font-semibold text-gray-800">{listing.ministry}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: pricing + order */}
            <div className="flex flex-col gap-5">

              {/* Pricing card */}
              <div className="bg-white border border-border rounded-2xl p-5 sticky top-20">
                {/* Discount badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-sm font-black text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-xl">
                    <TrendingDown size={13} /> {disc}% OFF
                  </span>
                </div>

                {/* Prices */}
                <div className="mb-4">
                  <p className="text-3xl font-black text-gray-900">₹{listing.unitPriceListing.toLocaleString("en-IN")}</p>
                  <p className="text-sm text-gray-400 line-through mt-0.5">₹{listing.unitPriceOriginal.toLocaleString("en-IN")} original</p>
                  <p className="text-xs text-gray-400 mt-0.5">per unit · exclusive of GST</p>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-gray-600">{listing.availableQty.toLocaleString("en-IN")} units available</span>
                    <span className="text-gray-400">{avail}% of {listing.qty.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden border border-border">
                    <div
                      className={`h-full rounded-full ${avail > 50 ? "bg-green-500" : avail > 20 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${avail}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                {!ordered ? (
                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white text-sm font-black hover:bg-green-700 transition-colors"
                  >
                    <ShoppingBag size={15} /> Request Quotation
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 text-green-700 border border-green-200 text-sm font-bold">
                    <CheckCircle2 size={14} /> Request Submitted
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Truck size={12} className="text-gray-400" /> Delivery in {listing.deliveryLeadDays} working days
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FileText size={12} className="text-gray-400" /> Purchase Order generated after approval
                  </div>
                  {listing.verified && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <BadgeCheck size={12} /> GAMS quality verified
                    </div>
                  )}
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard/marketplace" className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-700 hover:bg-surface">
                    <ShoppingBag size={13} className="text-gray-400" /> Browse All Listings
                  </Link>
                  <Link href="/dashboard/orders" className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-700 hover:bg-surface">
                    <ClipboardList size={13} className="text-gray-400" /> My Orders
                  </Link>
                  <Link href="/dashboard/documents" className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-700 hover:bg-surface">
                    <FileText size={13} className="text-gray-400" /> Download Documents
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showOrderModal && (
        <OrderModal listing={listing} onClose={() => setShowOrderModal(false)} onConfirm={handleOrder} />
      )}
    </div>
  );
}
