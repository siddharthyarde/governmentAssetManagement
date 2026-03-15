"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  Package, Search, Filter, MapPin, ChevronRight, ArrowRight,
  ShoppingBag, IndianRupee, Star, RefreshCw,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

type Listing = {
  id: string;
  name: string;
  category: string;
  condition: string;
  conditionNum: number;
  qty: number;
  originalPaise: number;
  listedPaise: number;
  discountPct: number;
};

const CATEGORIES = ["All", "Furniture", "Electronics", "Appliances", "Infrastructure", "Textiles", "Stationery"];

function Nav() {
  return (
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
            <Link href="/buyer/eligibility" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Eligibility</Link>
            <Link href="/buyer/how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">How It Works</Link>
            <Link href="/buyer/login" className="text-sm font-semibold border border-border px-3 py-1.5 rounded-lg hover:bg-surface">Sign In</Link>
            <Link href="/buyer/register" className="text-sm font-bold text-white px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800">Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function AvailableStockPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"discount" | "price" | "condition">("discount");

  useEffect(() => {
    const db = createClient();
    db.from("v_marketplace")
      .select("listing_code, product_name, category, condition_rating, quantity_available, listed_price_paise, original_price_paise, discount_pct")
      .order("discount_pct", { ascending: false })
      .then(({ data }) => {
        setListings((data ?? []).map((m) => ({
          id: m.listing_code,
          name: m.product_name,
          category: m.category ?? "General",
          condition: (m.condition_rating ?? 3) >= 4 ? "Good" : (m.condition_rating ?? 3) >= 3 ? "Serviceable" : "Fair",
          conditionNum: m.condition_rating ?? 5,
          qty: m.quantity_available,
          originalPaise: m.original_price_paise,
          listedPaise: m.listed_price_paise ?? m.original_price_paise,
          discountPct: m.discount_pct ?? 0,
        })));
        setLoading(false);
      });
  }, []);

  const filtered = listings
    .filter((l) => {
      const matchCat = category === "All" || l.category === category;
      const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "discount") return b.discountPct - a.discountPct;
      if (sortBy === "price") return a.listedPaise - b.listedPaise;
      return b.conditionNum - a.conditionNum;
    });

  const fmt = (p: number) => "₹" + (p / 100).toLocaleString("en-IN");

  const CONDITION_COLOR: Record<string, string> = {
    Good: "text-green-700 bg-green-50",
    Serviceable: "text-yellow-700 bg-yellow-50",
    Fair: "text-orange-700 bg-orange-50",
  };

  return (
    <>
      <Nav />
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-gray-400 max-w-screen-xl mx-auto w-full">
        <Link href="/buyer" className="hover:text-gray-700">Buyer Portal</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Available Stock</span>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F0FFF4] to-white py-10 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full mb-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Institutional Priority Access</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Available Redistribution Stock</h1>
              <p className="text-sm text-gray-500 max-w-xl">
                Browse verified government surplus assets available for institutional procurement.
                All items are GFR 2017 compliant with attached inspection certificates.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/buyer/login" className="inline-flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-sm">
                <ShoppingBag size={15} /> Sign In to Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white border-b border-border px-4 md:px-6 py-3 sticky top-14 z-30">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  category === cat ? "bg-green-700 text-white" : "border border-border text-gray-600 hover:bg-surface"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Filter size={14} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "discount" | "price" | "condition")}
              className="text-xs border border-border rounded-lg px-2 py-1.5 bg-surface text-gray-700 focus:outline-none"
            >
              <option value="discount">Best Discount</option>
              <option value="price">Lowest Price</option>
              <option value="condition">Best Condition</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings */}
      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={24} className="text-green-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No assets match your search.</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }} className="mt-3 text-sm text-green-600 hover:underline">Clear filters</button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">{filtered.length} asset{filtered.length !== 1 ? "s" : ""} available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((listing) => (
                <div key={listing.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-2 w-full" style={{ background: "linear-gradient(90deg,#138808,#C9960C)" }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-green-600" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CONDITION_COLOR[listing.condition]}`}>
                        {listing.condition}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight mb-1">{listing.name}</p>
                    <p className="text-[11px] text-gray-400 mb-3 flex items-center gap-1">
                      <MapPin size={9} /> {listing.category} · Qty: {listing.qty.toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-base font-black text-green-700">{fmt(listing.listedPaise)}<span className="text-xs font-medium text-gray-400">/unit</span></p>
                        <p className="text-[10px] line-through text-gray-400">{fmt(listing.originalPaise)}</p>
                      </div>
                      {listing.discountPct > 0 && (
                        <span className="text-[10px] font-black text-saffron-600 bg-saffron-50 border border-saffron-200 px-2 py-0.5 rounded-full">
                          -{Math.round(listing.discountPct)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={10} className={i < Math.round(listing.conditionNum / 2) ? "text-saffron-400 fill-saffron-400" : "text-gray-200"} />
                      ))}
                      <span className="text-[10px] text-gray-400 ml-1">{listing.conditionNum}/10</span>
                    </div>
                    <Link
                      href={`/buyer/dashboard/marketplace/${listing.id}`}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white py-2 rounded-xl bg-green-700 hover:bg-green-800 transition-colors"
                    >
                      <IndianRupee size={11} /> Request to Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA Banner */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-green-900 mb-1">Ready to Order?</h3>
            <p className="text-sm text-green-700">Register your institution to get priority access, PO-based billing, and bulk discount.</p>
          </div>
          <Link href="/buyer/register" className="shrink-0 inline-flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-sm">
            Register Now <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <footer className="bg-[#1A3A6B] text-white py-8 mt-8">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5"><AshokaChakra size={26} /><p className="text-sm font-black">GAMS Buyer Portal</p></div>
          <p className="text-xs text-blue-200">© {new Date().getFullYear()} Ministry of Finance, Government of India</p>
        </div>
      </footer>
    </>
  );
}
