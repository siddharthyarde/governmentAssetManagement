"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  Search,
  Filter,
  Package,
  MapPin,
  Tag,
  ChevronRight,
  ChevronDown,
  Star,
  Truck,
  ShieldCheck,
  IndianRupee,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
  Globe,
  Layers,
  Menu,
  LogIn,
  User,
  ShoppingCart,
  Building2,
  Calendar,
  Eye,
  Armchair,
  Cpu,
  Wrench,
  Shirt,
  Car,
  Stethoscope,
  Trophy,
  Tv,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Condition = "Excellent" | "Good" | "Serviceable" | "Fair";

type Listing = {
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
  images: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
};

const CATEGORIES = [
  { label: "All",            icon: <Globe size={15} /> },
  { label: "Furniture",      icon: <Armchair size={15} /> },
  { label: "Electronics",    icon: <Cpu size={15} /> },
  { label: "Infrastructure", icon: <Layers size={15} /> },
  { label: "Safety",         icon: <ShieldCheck size={15} /> },
  { label: "Electrical",     icon: <Wrench size={15} /> },
  { label: "Appliances",     icon: <Tv size={15} /> },
];

const STATES = ["All States", "Delhi", "Maharashtra", "Uttar Pradesh", "Odisha", "Uttarakhand", "Madhya Pradesh", "Telangana", "Rajasthan"];

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
  product_name: string;
  product_name_hi: string | null;
  category: string;
  product_images: unknown;
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
    images: [],
    verified: true,
    rating: 4.5,
    reviewCount: 0,
  };
}

const CONDITION_CONFIG: Record<Condition, { bg: string; text: string; border: string }> = {
  Excellent:   { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200"   },
  Good:        { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"    },
  Serviceable: { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200"  },
  Fair:        { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200"  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(n % 1_00_000 === 0 ? 0 : 1)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `₹${n}`;
}

function discount(orig: number, list: number) {
  return Math.round(((orig - list) / orig) * 100);
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={11}
            className={i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
          />
        ))}
      </div>
      <span className="text-[10px] text-gray-400">{rating.toFixed(1)} ({count})</span>
    </div>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

function ListingCard({ listing }: { listing: Listing }) {
  const cc = CONDITION_CONFIG[listing.condition];
  const disc = discount(listing.unitPriceOriginal, listing.unitPriceListing);
  const soldPct = Math.round(((listing.qty - listing.availableQty) / listing.qty) * 100);

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      {/* Placeholder image area */}
      <div className="h-36 bg-surface border-b border-border flex items-center justify-center relative">
        <Package size={40} className="text-gray-200" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${cc.bg} ${cc.text} ${cc.border}`}>
            {listing.condition}
          </span>
          {listing.verified && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700">
              <ShieldCheck size={9} /> Verified
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-saffron-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
          -{disc}%
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{listing.category} · {listing.subcategory}</p>
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-saffron-700 transition-colors">
            {listing.name}
          </h3>
        </div>

        <StarRating rating={listing.rating} count={listing.reviewCount} />

        {/* Pricing */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-black text-gray-900">{formatPrice(listing.unitPriceListing)}</span>
          <span className="text-xs text-gray-400 line-through">{formatPrice(listing.unitPriceOriginal)}</span>
          <span className="text-[10px] text-gray-400">/ unit</span>
        </div>

        {/* Availability */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">
              <strong className="text-gray-900">{listing.availableQty.toLocaleString("en-IN")}</strong> available
              <span className="text-gray-400"> / {listing.qty.toLocaleString("en-IN")} total</span>
            </p>
            <span className="text-[10px] text-gray-400">{soldPct}% claimed</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-saffron-400 rounded-full" style={{ width: `${soldPct}%` }} />
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-1 text-[10px] text-gray-400">
          <div className="flex items-center gap-1 truncate">
            <Calendar size={9} className="shrink-0" />
            {listing.event}
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={9} className="shrink-0" />
            {listing.city}, {listing.state} · {listing.ministry}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto flex items-center gap-2 pt-1">
          <Link
            href={`/marketplace/${listing.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white py-2 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: "#E07B00" }}
          >
            View & Request <ChevronRight size={12} />
          </Link>
          <Link
            href={`/marketplace/${listing.id}`}
            className="p-2 rounded-xl border border-border text-gray-400 hover:bg-surface hover:text-gray-700 transition-colors"
            aria-label="View details"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-border">
      <div className="h-1" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-3 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <AshokaChakra size={36} />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Government of India</p>
              <p className="text-base font-bold text-gray-900 leading-tight">
                GAMS{" "}
                <span className="text-xs font-semibold text-saffron-600 bg-saffron-50 border border-saffron-200 px-2 py-0.5 rounded ml-1">
                  Marketplace
                </span>
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/marketplace" className="text-saffron-600 font-semibold">Marketplace</Link>
            <Link href="/how-it-works" className="hover:text-saffron-600 transition-colors">How It Works</Link>
            <Link href="/about" className="hover:text-saffron-600 transition-colors">About GAMS</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-saffron-700 border border-saffron-300 rounded px-3 py-1.5 hover:bg-saffron-50 transition-colors">
              <LogIn size={14} /> Login
            </Link>
            <Link href="/register" className="flex items-center gap-2 text-sm font-bold text-white rounded px-4 py-1.5" style={{ background: "#E07B00" }}>
              Register Institution
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded border border-border hover:bg-surface" aria-label="Toggle menu">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="md:hidden border-t border-border py-3 flex flex-col gap-3 text-sm font-medium">
            <Link href="/marketplace" className="text-saffron-600 font-semibold">Marketplace</Link>
            <Link href="/how-it-works" className="text-gray-700">How It Works</Link>
            <Link href="/about" className="text-gray-700">About GAMS</Link>
            <Link href="/login" className="text-gray-700">Login</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [listings, setListings]         = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stateFilter, setStateFilter] = useState("All States");
  const [conditionFilter, setConditionFilter] = useState<Condition | "All">("All");
  const [sortBy, setSortBy] = useState<"discount" | "price_asc" | "price_desc" | "newest" | "rating">("discount");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    createClient()
      .from("v_marketplace")
      .select("*")
      .order("quantity_available", { ascending: false })
      .then(({ data, error }) => {
        if (!error) {
          setListings((data as MarketplaceViewRow[] ?? []).map(mapMarketplaceRow));
        }
      });
  }, []);

  const filtered = useMemo(() => {
    let items = listings.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !q || l.name.toLowerCase().includes(q) || l.event.toLowerCase().includes(q) || l.city.toLowerCase().includes(q);
      const matchCat = category === "All" || l.category === category;
      const matchState = stateFilter === "All States" || l.state === stateFilter;
      const matchCond = conditionFilter === "All" || l.condition === conditionFilter;
      const matchVerified = !verifiedOnly || l.verified;
      return matchSearch && matchCat && matchState && matchCond && matchVerified;
    });

    items = [...items].sort((a, b) => {
      if (sortBy === "discount")    return discount(b.unitPriceOriginal, b.unitPriceListing) - discount(a.unitPriceOriginal, a.unitPriceListing);
      if (sortBy === "price_asc")   return a.unitPriceListing - b.unitPriceListing;
      if (sortBy === "price_desc")  return b.unitPriceListing - a.unitPriceListing;
      if (sortBy === "rating")      return b.rating - a.rating;
      // newest
      return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
    });

    return items;
  }, [listings, search, category, stateFilter, conditionFilter, sortBy, verifiedOnly]);

  const totalSavings = listings.reduce((sum, l) => sum + (l.unitPriceOriginal - l.unitPriceListing) * l.availableQty, 0);

  return (
    <div className="min-h-dvh bg-surface text-gray-900">
      <Nav />

      {/* ── Hero / Search ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-saffron-600 mb-3 flex items-center gap-2">
              <ShieldCheck size={13} /> Government of India — Certified Asset Redistribution
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
              GAMS Redistribution Marketplace
            </h1>
            <p className="text-gray-500 text-sm mb-6 max-w-xl">
              Browse verified post-event government assets — furniture, electronics, infrastructure — listed for redistribution to
              eligible institutions at a fraction of original procurement cost.
            </p>

            {/* Search bar */}
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <div className="relative flex-1 min-w-0">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items, events, cities…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-saffron-400 bg-surface"
                />
              </div>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="inline-flex items-center gap-2 px-4 py-3 border border-border rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-surface transition-colors shrink-0"
              >
                <SlidersHorizontal size={15} />
                Filters
                {(conditionFilter !== "All" || stateFilter !== "All States" || verifiedOnly) && (
                  <span className="w-2 h-2 rounded-full bg-saffron-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats bar ─────────────────────────────────────────────────── */}
        <div className="border-t border-border bg-surface/60">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-4 flex flex-wrap gap-6 items-center">
            {[
              { label: "Active Listings",   value: listings.length.toString() },
              { label: "Verified Items",    value: listings.filter((l) => l.verified).length.toString() },
              { label: "Potential Savings", value: `₹${(totalSavings / 1_00_00_000).toFixed(1)} Cr` },
              { label: "States Covered",    value: [...new Set(listings.map((l) => l.state))].length.toString() },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <p className="text-base font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-6">

          {/* ── Sidebar Filters (desktop) ──────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-4 w-52 shrink-0">

            {/* Verified only */}
            <div className="bg-white border border-border rounded-2xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${verifiedOnly ? "bg-green-500" : "bg-gray-200"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">Verified Only</span>
              </label>
            </div>

            {/* Condition */}
            <div className="bg-white border border-border rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Condition</p>
              <div className="flex flex-col gap-1.5">
                {(["All", "Excellent", "Good", "Serviceable", "Fair"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setConditionFilter(c)}
                    className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      conditionFilter === c
                        ? "bg-saffron-50 text-saffron-700 font-semibold"
                        : "text-gray-600 hover:bg-surface"
                    }`}
                  >
                    {c === "All" ? "All Conditions" : c}
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div className="bg-white border border-border rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">State</p>
              <div className="flex flex-col gap-1.5">
                {STATES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStateFilter(s)}
                    className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${
                      stateFilter === s
                        ? "bg-saffron-50 text-saffron-700 font-semibold"
                        : "text-gray-600 hover:bg-surface"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main content ───────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Mobile filters drawer */}
            {filtersOpen && (
              <>
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setFiltersOpen(false)} aria-hidden="true" />
                <div className="fixed inset-y-0 right-0 w-72 bg-white z-50 lg:hidden shadow-xl flex flex-col">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h2 className="text-base font-bold">Filters</h2>
                    <button onClick={() => setFiltersOpen(false)} className="p-1 rounded hover:bg-surface text-gray-400"><X size={18} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Verified Only</p>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div onClick={() => setVerifiedOnly(!verifiedOnly)} className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${verifiedOnly ? "bg-green-500" : "bg-gray-200"}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Show Verified Only</span>
                      </label>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Condition</p>
                      {(["All", "Excellent", "Good", "Serviceable", "Fair"] as const).map((c) => (
                        <button key={c} onClick={() => { setConditionFilter(c); setFiltersOpen(false); }} className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 font-medium ${conditionFilter === c ? "bg-saffron-50 text-saffron-700 font-semibold" : "text-gray-600 hover:bg-surface"}`}>
                          {c === "All" ? "All Conditions" : c}
                        </button>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">State</p>
                      {STATES.map((s) => (
                        <button key={s} onClick={() => { setStateFilter(s); setFiltersOpen(false); }} className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 font-medium ${stateFilter === s ? "bg-saffron-50 text-saffron-700 font-semibold" : "text-gray-600 hover:bg-surface"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-4 border-t border-border">
                    <button onClick={() => { setConditionFilter("All"); setStateFilter("All States"); setVerifiedOnly(false); setFiltersOpen(false); }} className="w-full border border-border rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-surface transition-colors">
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
              {CATEGORIES.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setCategory(c.label)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border whitespace-nowrap transition-colors shrink-0 ${
                    category === c.label
                      ? "bg-saffron-500 text-white border-saffron-500"
                      : "bg-white text-gray-600 border-border hover:bg-surface"
                  }`}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>

            {/* Sort + result count */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <p className="text-sm text-gray-500">
                <strong className="text-gray-900">{filtered.length}</strong> listing{filtered.length !== 1 ? "s" : ""} found
                {search && <span> for &ldquo;<em>{search}</em>&rdquo;</span>}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs font-semibold border border-border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-saffron-300"
                >
                  <option value="discount">Highest Discount</option>
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {(conditionFilter !== "All" || stateFilter !== "All States" || verifiedOnly) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {conditionFilter !== "All" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-saffron-50 border border-saffron-200 text-saffron-700 px-2.5 py-1 rounded-full">
                    {conditionFilter} <button onClick={() => setConditionFilter("All")}><X size={11} /></button>
                  </span>
                )}
                {stateFilter !== "All States" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-saffron-50 border border-saffron-200 text-saffron-700 px-2.5 py-1 rounded-full">
                    {stateFilter} <button onClick={() => setStateFilter("All States")}><X size={11} /></button>
                  </span>
                )}
                {verifiedOnly && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full">
                    Verified Only <button onClick={() => setVerifiedOnly(false)}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="bg-white border border-border rounded-2xl py-20 text-center">
                <Package size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="text-sm font-semibold text-gray-400 mb-2">No listings match your filters</p>
                <button
                  onClick={() => { setSearch(""); setCategory("All"); setStateFilter("All States"); setConditionFilter("All"); setVerifiedOnly(false); }}
                  className="text-xs font-bold text-saffron-600 hover:text-saffron-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Eligibility Notice */}
            <div className="mt-8 flex items-start gap-4 border border-blue-200 bg-blue-50 rounded-2xl px-6 py-5">
              <ShieldCheck size={20} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-blue-800 mb-1">Eligibility Notice</h3>
                <p className="text-sm text-blue-700">
                  Only approved government institutions (municipal corporations, PSUs, state departments, autonomous bodies)
                  may place orders on this marketplace. Individuals and private entities are not eligible.{" "}
                  <Link href="/register" className="font-semibold underline underline-offset-2 hover:text-blue-900">
                    Register your institution →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-10">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <AshokaChakra size={22} />
            <div>
              <p className="font-bold text-gray-600">GAMS — Public Marketplace</p>
              <p>© {new Date().getFullYear()} Government of India. All rights reserved.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms of Use</Link>
            <Link href="/support" className="hover:text-gray-600">Support</Link>
          </div>
        </div>
        <div className="border-t border-border bg-surface py-2.5">
          <p className="text-center text-[10px] text-gray-400 tracking-wide">
            GIGW Compliant · NIC Hosted · WCAG 2.1 AA · Content owned by Ministry of Finance, Government of India
          </p>
        </div>
      </footer>
    </div>
  );
}
