"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Menu, X, LayoutDashboard, Package, ClipboardList,
  MapPin, FileText, Settings, Bell, Search, SlidersHorizontal,
  Star, Armchair, Cpu, Layers, ShieldCheck, Wrench, Tv,
  Globe, ChevronDown, BadgeCheck, ShoppingCart, TrendingDown,
  CheckCircle2, AlertCircle, IndianRupee, Filter, ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Condition = "Excellent" | "Good" | "Serviceable" | "Fair";
type InstitutionStatus = "pending_review" | "approved" | "rejected" | "suspended";

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
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LISTINGS: Listing[] = [
  { id: "L1001", name: "Folding Chairs — Steel Frame, Black Fabric", category: "Furniture", subcategory: "Seating", condition: "Excellent", qty: 8000, availableQty: 5200, unitPriceOriginal: 2400, unitPriceListing: 320, event: "G20 Summit India 2023", city: "New Delhi", state: "Delhi", ministry: "MEA", listedDate: "2024-06-01", verified: true, rating: 4.8, reviewCount: 42 },
  { id: "L1002", name: "AV Amplifier 2000W — JBL Series", category: "Electronics", subcategory: "Audio Equipment", condition: "Good", qty: 120, availableQty: 80, unitPriceOriginal: 85000, unitPriceListing: 22000, event: "Digital India Conclave 2023", city: "Mumbai", state: "Maharashtra", ministry: "MeitY", listedDate: "2024-06-05", verified: true, rating: 4.6, reviewCount: 14 },
  { id: "L1003", name: "Industrial Generator — 125 kVA, Diesel", category: "Electrical", subcategory: "Generators", condition: "Good", qty: 30, availableQty: 18, unitPriceOriginal: 4200000, unitPriceListing: 980000, event: "India Energy Week 2024", city: "Bangalore", state: "Karnataka", ministry: "MoP", listedDate: "2024-05-20", verified: true, rating: 4.7, reviewCount: 8 },
  { id: "L1004", name: "Modular Stage Platform — Aluminium 2×1m", category: "Infrastructure", subcategory: "Stage & Flooring", condition: "Serviceable", qty: 600, availableQty: 350, unitPriceOriginal: 18000, unitPriceListing: 3800, event: "National Sports Games 2023", city: "Ahmedabad", state: "Gujarat", ministry: "MoYAS", listedDate: "2024-05-28", verified: false, rating: 4.2, reviewCount: 19 },
  { id: "L1005", name: "LED Par Light 100W RGBW — Stage Grade", category: "Electronics", subcategory: "Lighting & Stage", condition: "Excellent", qty: 500, availableQty: 480, unitPriceOriginal: 12000, unitPriceListing: 2800, event: "Republic Day Parade Setup 2024", city: "New Delhi", state: "Delhi", ministry: "MoD", listedDate: "2024-06-10", verified: true, rating: 4.9, reviewCount: 31 },
  { id: "L1006", name: "Conference Table — 10-seater, Teak Finish", category: "Furniture", subcategory: "Tables", condition: "Excellent", qty: 45, availableQty: 32, unitPriceOriginal: 38000, unitPriceListing: 9500, event: "PM's Economic Advisory Meet", city: "New Delhi", state: "Delhi", ministry: "PMO", listedDate: "2024-06-12", verified: true, rating: 4.7, reviewCount: 7 },
  { id: "L1007", name: "Crowd Control Barrier — Steel, 2.5m", category: "Safety", subcategory: "Crowd Management", condition: "Good", qty: 2000, availableQty: 1760, unitPriceOriginal: 3200, unitPriceListing: 750, event: "Kumbh Mela 2025 Setup", city: "Prayagraj", state: "Uttar Pradesh", ministry: "MoHA", listedDate: "2024-06-08", verified: true, rating: 4.4, reviewCount: 23 },
  { id: "L1008", name: "Wall-mount Split AC 1.5T — Inverter 5-Star", category: "Appliances", subcategory: "Cooling", condition: "Good", qty: 200, availableQty: 148, unitPriceOriginal: 55000, unitPriceListing: 14000, event: "Smart Cities Expo 2023", city: "Pune", state: "Maharashtra", ministry: "MoHUA", listedDate: "2024-05-25", verified: false, rating: 4.5, reviewCount: 12 },
  { id: "L1009", name: "Portable Fire Extinguisher 10kg CO2", category: "Safety", subcategory: "Fire Safety", condition: "Excellent", qty: 300, availableQty: 290, unitPriceOriginal: 6800, unitPriceListing: 1800, event: "Bharat Mandapam Events 2023", city: "New Delhi", state: "Delhi", ministry: "MoHUA", listedDate: "2024-06-03", verified: true, rating: 4.6, reviewCount: 16 },
  { id: "L1010", name: "Industrial UPS 10 kVA Rack Mount", category: "Electrical", subcategory: "UPS & Inverters", condition: "Good", qty: 60, availableQty: 44, unitPriceOriginal: 160000, unitPriceListing: 42000, event: "National Data Centre Setup 2023", city: "Hyderabad", state: "Telangana", ministry: "MeitY", listedDate: "2024-06-07", verified: true, rating: 4.5, reviewCount: 9 },
  { id: "L1011", name: "Projection Screen 180-inch Electric", category: "Electronics", subcategory: "Display & Projection", condition: "Excellent", qty: 80, availableQty: 75, unitPriceOriginal: 48000, unitPriceListing: 11500, event: "G20 Summit India 2023", city: "New Delhi", state: "Delhi", ministry: "MEA", listedDate: "2024-06-01", verified: true, rating: 4.7, reviewCount: 11 },
  { id: "L1012", name: "Executive Chair — Ergonomic, High-back", category: "Furniture", subcategory: "Seating", condition: "Good", qty: 1200, availableQty: 840, unitPriceOriginal: 12000, unitPriceListing: 2900, event: "Ministry HQ Renovation 2023", city: "New Delhi", state: "Delhi", ministry: "MoF", listedDate: "2024-06-14", verified: false, rating: 4.3, reviewCount: 28 },
];

const CATEGORIES = [
  { label: "All",            icon: Globe       },
  { label: "Furniture",      icon: Armchair    },
  { label: "Electronics",    icon: Cpu         },
  { label: "Infrastructure", icon: Layers      },
  { label: "Safety",         icon: ShieldCheck },
  { label: "Electrical",     icon: Wrench      },
  { label: "Appliances",     icon: Tv          },
];

const CONDITIONS: Condition[] = ["Excellent", "Good", "Serviceable", "Fair"];
const SORT_OPTIONS = [
  { value: "discount",   label: "Highest Discount" },
  { value: "rating",     label: "Top Rated"        },
  { value: "price_asc",  label: "Price: Low → High"},
  { value: "price_desc", label: "Price: High → Low"},
  { value: "newest",     label: "Newest First"     },
];

// ─── Supabase marketplace view type + mapper ─────────────────────────────────────────

import { createClient } from "@gams/lib/supabase/client";

type MarketplaceViewRow = {
  id: string;
  listing_code: string;
  redistribution_type: string;
  condition_rating: number | null;
  listed_price_paise: number | null;
  original_price_paise: number;
  discount_pct: number | null;
  quantity_available: number;
  delivery_photos: unknown;
  product_name: string;
  product_name_hi: string | null;
  category: string;
  product_images: unknown;
  specifications: unknown;
  brand: string | null;
};

function ratingToCondition(r: number | null): Condition {
  if (!r) return "Good";
  if (r >= 8.5) return "Excellent";
  if (r >= 6.5) return "Good";
  if (r >= 4.5) return "Serviceable";
  return "Fair";
}

function mapMarketplaceRow(row: MarketplaceViewRow): Listing {
  return {
    id: row.listing_code,
    name: row.product_name,
    category: row.category,
    subcategory: "Asset",
    condition: ratingToCondition(row.condition_rating),
    qty: row.quantity_available,
    availableQty: row.quantity_available,
    unitPriceOriginal: Math.round(row.original_price_paise / 100),
    unitPriceListing: Math.round((row.listed_price_paise ?? row.original_price_paise) / 100),
    event: "—",
    city: "—",
    state: "—",
    ministry: "—",
    listedDate: new Date().toISOString().split("T")[0],
    verified: true,
    rating: 4.5,
    reviewCount: 0,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(n % 1_00_000 === 0 ? 0 : 1)}L`;
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `₹${n}`;
}

function discount(original: number, listing: number) {
  return Math.round((1 - listing / original) * 100);
}

function conditionColor(c: Condition) {
  return {
    Excellent:   "bg-green-100 text-green-700",
    Good:        "bg-blue-100 text-blue-700",
    Serviceable: "bg-yellow-100 text-yellow-700",
    Fair:        "bg-red-100 text-red-700",
  }[c];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </span>
  );
}

function ListingCard({ l, onOrder }: { l: Listing; onOrder: (l: Listing) => void }) {
  const disc = discount(l.unitPriceOriginal, l.unitPriceListing);
  const pct  = Math.round((l.availableQty / l.qty) * 100);

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Image placeholder */}
      <div className="h-36 bg-surface border-b border-border relative flex items-center justify-center">
        <Package size={36} className="text-gray-200" />
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${conditionColor(l.condition)}`}>
          {l.condition}
        </span>
        {l.verified && (
          <span className="absolute top-3 right-3 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <BadgeCheck size={9} /> GV
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-gray-900 text-white text-xs font-black px-2 py-0.5 rounded-full">
          -{disc}%
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs text-gray-400">{l.category} · {l.subcategory}</p>
        <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{l.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={l.rating} />
          <span className="text-xs text-gray-500">{l.rating} ({l.reviewCount})</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-base font-black text-gray-900">{formatPrice(l.unitPriceListing)}</span>
          <span className="text-xs line-through text-gray-400">{formatPrice(l.unitPriceOriginal)}</span>
          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
            Save {disc}%
          </span>
        </div>

        {/* Availability */}
        <div className="space-y-1">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] text-gray-400">{l.availableQty.toLocaleString("en-IN")} / {l.qty.toLocaleString("en-IN")} units available</p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{l.city}, {l.state}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 mt-auto">
          <Link
            href={`/dashboard/marketplace/${l.id}`}
            className="flex-1 text-center text-xs font-semibold py-2 rounded-xl border border-border text-gray-700 hover:bg-surface transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={() => onOrder(l)}
            className="flex-1 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-opacity hover:opacity-90"
            style={{ background: "#138808" }}
          >
            <ShoppingCart size={11} /> Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Modal ──────────────────────────────────────────────────────────────

function OrderModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const [qty, setQty]         = useState(1);
  const [gamsId, setGamsId]   = useState("");
  const [purpose, setPurpose] = useState("");
  const [done, setDone]       = useState(false);

  const savings = (listing.unitPriceOriginal - listing.unitPriceListing) * qty;

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={26} className="text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Order Request Submitted!</h3>
          <p className="text-sm text-gray-500 mb-5">
            Your order request for <strong>{listing.name}</strong> has been sent. You&apos;ll be notified within 2 working days with approval and invoice details.
          </p>
          <button onClick={onClose} className="w-full text-white font-bold py-2.5 rounded-xl" style={{ background: "#138808" }}>
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-bold text-gray-900">Request to Order</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-gray-400"><X size={16} /></button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Item summary */}
          <div className="flex gap-3 bg-surface border border-border rounded-xl p-3">
            <div className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center shrink-0">
              <Package size={16} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{listing.name}</p>
              <p className="text-xs text-gray-400">{listing.city}, {listing.state}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-black text-gray-900">{formatPrice(listing.unitPriceListing)}</p>
              <p className="text-xs text-gray-400 line-through">{formatPrice(listing.unitPriceOriginal)}</p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity</label>
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 font-bold text-gray-700 hover:bg-surface text-lg">−</button>
              <p className="flex-1 text-center font-bold">{qty}</p>
              <button type="button" onClick={() => setQty((q) => Math.min(listing.availableQty, q + 1))} className="px-4 py-2.5 font-bold text-gray-700 hover:bg-surface text-lg">+</button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Max {listing.availableQty.toLocaleString("en-IN")} units available</p>
          </div>

          {/* Institution ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Institution GAMS ID <span className="text-red-500">*</span></label>
            <input
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
              placeholder="e.g. GAMS-INST-20240001"
              value={gamsId}
              onChange={(e) => setGamsId(e.target.value)}
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Purpose / Justification <span className="text-red-500">*</span></label>
            <textarea
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-green-400"
              rows={3}
              placeholder="e.g. For district government office conference hall upgrade…"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          {/* Savings summary */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Total payable</span><span className="font-bold text-gray-900">{formatPrice(listing.unitPriceListing * qty)}</span></div>
            <div className="flex justify-between text-green-700"><span>Your savings</span><span className="font-bold">{formatPrice(savings)}</span></div>
            <div className="flex justify-between text-green-700 text-xs font-bold"><span>Saving %</span><span>{discount(listing.unitPriceOriginal, listing.unitPriceListing)}%</span></div>
          </div>

          <button
            onClick={() => { if (gamsId && purpose) setDone(true); }}
            disabled={!gamsId || !purpose}
            className="w-full text-white font-bold py-3 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ background: "#138808" }}
          >
            <ShoppingCart size={15} /> Submit Order Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyerMarketplacePage() {
  const institutionStatus = "approved" as InstitutionStatus;
  const [listings, setListings]         = useState<Listing[]>(LISTINGS);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [filterOpen, setFilterOpen]     = useState(false);
  const [search, setSearch]             = useState("");
  const [activeCategory, setCategory]   = useState("All");
  const [sort, setSort]                 = useState("discount");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeConditions, setConditions] = useState<Condition[]>([]);
  const [activeState, setActiveState]   = useState("");
  const [orderListing, setOrderListing] = useState<Listing | null>(null);

  useEffect(() => {
    createClient()
      .from("v_marketplace")
      .select("*")
      .order("quantity_available", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setListings((data as MarketplaceViewRow[]).map(mapMarketplaceRow));
        }
      });
  }, []);

  const STATES = useMemo(() => [...new Set(listings.map((l) => l.state))].sort(), [listings]);

  const toggleCondition = (c: Condition) =>
    setConditions((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const results = useMemo(() => {
    let data = [...listings];
    if (activeCategory !== "All") data = data.filter((l) => l.category === activeCategory);
    if (verifiedOnly)             data = data.filter((l) => l.verified);
    if (activeConditions.length)  data = data.filter((l) => activeConditions.includes(l.condition));
    if (activeState)              data = data.filter((l) => l.state === activeState);
    if (search.trim())            data = data.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.event.toLowerCase().includes(search.toLowerCase()));

    return data.sort((a, b) => {
      if (sort === "discount")   return discount(b.unitPriceOriginal, b.unitPriceListing) - discount(a.unitPriceOriginal, a.unitPriceListing);
      if (sort === "rating")     return b.rating - a.rating;
      if (sort === "price_asc")  return a.unitPriceListing - b.unitPriceListing;
      if (sort === "price_desc") return b.unitPriceListing - a.unitPriceListing;
      if (sort === "newest")     return b.listedDate.localeCompare(a.listedDate);
      return 0;
    });
  }, [listings, activeCategory, verifiedOnly, activeConditions, activeState, search, sort]);

  const totalSavings = results.reduce((s, l) => s + (l.unitPriceOriginal - l.unitPriceListing) * l.availableQty, 0);

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard",             active: false },
    { icon: Package,          label: "Marketplace", href: "/dashboard/marketplace", active: true  },
    { icon: ClipboardList,    label: "My Orders",   href: "/dashboard/orders",      active: false },
    { icon: MapPin,           label: "Deliveries",  href: "/dashboard/deliveries",  active: false },
    { icon: FileText,         label: "Documents",   href: "/dashboard/documents",   active: false },
    { icon: Settings,         label: "Settings",    href: "/dashboard/settings",    active: false },
  ];

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-border z-40 flex flex-col transition-transform lg:static lg:translate-x-0 lg:flex lg:h-auto lg:min-h-dvh ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Tiranga accent */}
        <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-lg font-black tracking-tight text-gray-900">GAMS</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Buyer Institution Portal</p>
        </div>

        {/* Institution info */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm" style={{ background: "#138808" }}>DS</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">Delhi State Library</p>
              <p className="text-[10px] text-gray-400 truncate">GAMS-INST-20240001</p>
            </div>
          </div>
          {institutionStatus === "approved" && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-green-700 font-semibold">
              <CheckCircle2 size={12} className="text-green-600" /> Verified Institution
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {sidebarItems.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-semibold transition-colors ${active ? "text-white" : "text-gray-600 hover:bg-surface"}`}
              style={active ? { background: "#138808" } : {}}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>

        {/* Savings highlight */}
        <div className="px-4 py-4 border-t border-border">
          <div className="rounded-xl px-4 py-3" style={{ background: "#138808" + "15", border: "1px solid #13880840" }}>
            <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider mb-0.5">Your Total Savings</p>
            <p className="text-xl font-black text-green-700">₹12.4L</p>
            <p className="text-[10px] text-green-600 mt-0.5">Across 3 approved orders</p>
          </div>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-border sticky top-0 z-20">
          <div className="px-4 md:px-6 py-4 flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl border border-border text-gray-400 hover:text-gray-700 lg:hidden">
              <Menu size={16} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-gray-900">Available Marketplace</h1>
              <p className="text-xs text-gray-400">Browse and order verified government assets</p>
            </div>
            <Bell size={16} className="text-gray-400 cursor-pointer hover:text-gray-700" />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-x-hidden">
          {/* Stats bar */}
          <div className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-6 overflow-x-auto">
            {[
              { icon: Package,      label: "Total Listings",     val: LISTINGS.length.toString() },
              { icon: BadgeCheck,   label: "GAMS Verified",      val: LISTINGS.filter((l) => l.verified).length.toString() },
              { icon: TrendingDown, label: "Avg. Discount",      val: `${Math.round(LISTINGS.reduce((a, l) => a + discount(l.unitPriceOriginal, l.unitPriceListing), 0) / LISTINGS.length)}%` },
              { icon: IndianRupee,  label: "Ave. Potential Savings", val: `₹${(totalSavings / 1_00_000).toFixed(0)}L` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-center gap-2 shrink-0">
                <Icon size={13} className="text-green-600" />
                <span className="text-sm font-black text-gray-900">{val}</span>
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>

          <div className="p-4 md:p-6 flex gap-6">
            {/* ── Sidebar Filters (desktop) ─────────────────────── */}
            <div className="hidden lg:flex flex-col gap-5 w-52 shrink-0">
              {/* Verified toggle */}
              <div className="bg-white border border-border rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Verification</p>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => setVerifiedOnly((v) => !v)}
                    className={`w-9 h-4.5 rounded-full relative cursor-pointer shrink-0 transition-colors ${verifiedOnly ? "bg-green-500" : "bg-gray-200"}`}
                    style={{ height: "18px", width: "36px" }}
                  >
                    <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${verifiedOnly ? "translate-x-4" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">Verified Only</span>
                </label>
              </div>

              {/* Condition */}
              <div className="bg-white border border-border rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Condition</p>
                <div className="flex flex-col gap-2">
                  {CONDITIONS.map((c) => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeConditions.includes(c)}
                        onChange={() => toggleCondition(c)}
                        className="w-3.5 h-3.5 rounded"
                        style={{ accentColor: "#138808" }}
                      />
                      <span className="text-xs text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* State */}
              <div className="bg-white border border-border rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">State</p>
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="state" checked={activeState === ""} onChange={() => setActiveState("")} style={{ accentColor: "#138808" }} /> <span className="text-xs text-gray-700">All States</span>
                  </label>
                  {STATES.map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="state" checked={activeState === s} onChange={() => setActiveState(s)} style={{ accentColor: "#138808" }} />
                      <span className="text-xs text-gray-700">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Listing area ──────────────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              {/* Search + sort row */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white"
                    placeholder="Search listings, events…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-border rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:bg-white transition-colors"
                >
                  <SlidersHorizontal size={14} /> Filter
                </button>
                <div className="relative hidden sm:block">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border border-border rounded-xl pl-3 pr-8 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white text-gray-700 appearance-none"
                  >
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => setCategory(label)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors shrink-0 ${
                      activeCategory === label
                        ? "text-white border-transparent"
                        : "bg-white border-border text-gray-600 hover:bg-surface"
                    }`}
                    style={activeCategory === label ? { background: "#138808" } : {}}
                  >
                    <Icon size={12} /> {label}
                  </button>
                ))}
              </div>

              {/* Active filters */}
              {(verifiedOnly || activeConditions.length > 0 || activeState) && (
                <div className="flex flex-wrap gap-2">
                  {verifiedOnly && (
                    <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Verified Only <button onClick={() => setVerifiedOnly(false)}><X size={10} /></button>
                    </span>
                  )}
                  {activeConditions.map((c) => (
                    <span key={c} className="flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {c} <button onClick={() => toggleCondition(c)}><X size={10} /></button>
                    </span>
                  ))}
                  {activeState && (
                    <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {activeState} <button onClick={() => setActiveState("")}><X size={10} /></button>
                    </span>
                  )}
                </div>
              )}

              {/* Status notice */}
              {institutionStatus !== "approved" && (
                <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
                  <AlertCircle size={15} className="text-yellow-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-yellow-700">Your institution is pending verification. You can browse listings but cannot place orders until approval.</p>
                </div>
              )}

              {/* Count */}
              <p className="text-sm text-gray-500"><strong className="text-gray-900">{results.length}</strong> listings found</p>

              {/* Grid */}
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Package size={40} className="text-gray-200 mb-3" />
                  <p className="font-bold text-gray-900 mb-1">No listings found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters or search term</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {results.map((l) => (
                    <ListingCard key={l.id} l={l} onOrder={setOrderListing} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ────────────────────────────────────────── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="relative bg-white w-full rounded-t-3xl p-5 flex flex-col gap-4 max-h-[80dvh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-900">Filters</p>
              <button onClick={() => setFilterOpen(false)}><X size={18} className="text-gray-400" /></button>
            </div>

            {/* Verified */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setVerifiedOnly((v) => !v)}
                className={`w-10 h-5 rounded-full relative cursor-pointer shrink-0 transition-colors ${verifiedOnly ? "bg-green-500" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Verified Only</span>
            </label>

            {/* Condition */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">Condition</p>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCondition(c)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeConditions.includes(c) ? "text-white border-transparent" : "bg-white border-border text-gray-600"}`}
                    style={activeConditions.includes(c) ? { background: "#138808" } : {}}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">State</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => setActiveState("")} className={`text-xs py-1.5 rounded-xl border font-semibold transition-colors ${activeState === "" ? "text-white border-transparent" : "bg-white border-border text-gray-600"}`} style={activeState === "" ? { background: "#138808" } : {}}>All States</button>
                {STATES.map((s) => (
                  <button key={s} onClick={() => setActiveState(s)} className={`text-xs py-1.5 rounded-xl border font-semibold transition-colors ${activeState === s ? "text-white border-transparent" : "bg-white border-border text-gray-600"}`} style={activeState === s ? { background: "#138808" } : {}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setFilterOpen(false)} className="w-full text-white font-bold py-3 rounded-xl mt-1" style={{ background: "#138808" }}>
              Show {results.length} Results
            </button>
          </div>
        </div>
      )}

      {/* ── Order Modal ─────────────────────────────────────────────────── */}
      {orderListing && <OrderModal listing={orderListing} onClose={() => setOrderListing(null)} />}
    </div>
  );
}
