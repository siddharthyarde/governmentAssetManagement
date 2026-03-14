"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import { createClient } from "@gams/lib/supabase/client";
import {
  Search,
  ShoppingCart,
  User,
  ChevronRight,
  Star,
  Package,
  IndianRupee,
  BarChart3,
  Shield,
  RefreshCw,
  CheckCircle,
  Globe,
  Truck,
  FileText,
  Menu,
  X,
  Tv,
  Armchair,
  Shirt,
  Wrench,
  Cpu,
  Car,
  Stethoscope,
  Trophy,
  Phone,
  ArrowRight,
} from "lucide-react";

// ─── Public Navbar ────────────────────────────────────────────────────────────

function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-border">
      <div className="tiranga-accent" />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        {/* Main nav row */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <Link href="/public" className="flex items-center gap-3 shrink-0">
            <AshokaChakra size={40} />
            <div>
              <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest leading-none">
                {lang === "hi" ? "भारत सरकार" : "Government of India"}
              </p>
              <p className="text-sm font-bold text-[#1A1A1A] leading-tight">
                {lang === "hi" ? "GAMS नागरिक बाज़ार" : "GAMS Citizen Marketplace"}
              </p>
            </div>
          </Link>

          {/* Centre search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
              <input
                type="search"
                placeholder={lang === "hi" ? "उत्पाद खोजें... (कुर्सी, AC, टेबल)" : "Search products... (Chair, AC, Table)"}
                className="input-field pl-10 pr-4 text-sm"
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="hidden sm:flex text-xs font-bold px-3 py-1.5 rounded-lg border border-border text-[#3D3D3D] hover:bg-surface transition-colors"
            >
              {lang === "en" ? "हिं" : "EN"}
            </button>
            <Link href="/cart" className="relative p-2.5 rounded-xl border border-border hover:bg-surface transition-colors" aria-label="Cart">
              <ShoppingCart size={18} className="text-[#5A5A5A]" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-saffron-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
            </Link>
            <Link href="/public/login" className="hidden sm:flex btn-outline text-sm">
              {lang === "hi" ? "लॉग इन" : "Login"}
            </Link>
            <Link href="/public/register" className="btn-primary text-sm">
              {lang === "hi" ? "पंजीकरण" : "Register"}
            </Link>
            <button
              className="md:hidden p-2 rounded-xl border border-border"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden md:flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-none">
          {[
            "All Products", "Electronics", "Furniture", "Appliances", "Vehicles",
            "Textiles", "Medical", "Machinery", "Sports", "Stationery", "Other",
          ].map((cat, i) => (
            <Link
              key={cat}
              href={`/marketplace?cat=${cat.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                i === 0
                  ? "bg-saffron-500 text-white"
                  : "text-[#5A5A5A] hover:bg-surface hover:text-[#1A1A1A]"
              }`}
            >
              {cat}
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-border space-y-1">
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
              <input type="search" placeholder="Search products..." className="input-field pl-10 text-sm" />
            </div>
            {["Marketplace", "My Orders", "Track Order", "About GAMS", "Grievance"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase().replace(" ", "-")}`} className="block px-3 py-2 rounded-xl text-sm font-medium text-[#3D3D3D] hover:bg-surface">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Live Stat Ticker ─────────────────────────────────────────────────────────

function StatTicker() {
  const [counts, setCounts] = useState({
    assets: "—",
    redistributed: "—",
    events: "—",
    companies: "—",
    buyers: "—",
  });

  useEffect(() => {
    const db = createClient();
    Promise.all([
      db.from("product_instances").select("*", { count: "exact", head: true }),
      db.from("redistribution_listings").select("*", { count: "exact", head: true }).in("status", ["dispatched", "completed"]),
      db.from("events").select("*", { count: "exact", head: true }),
      db.from("companies").select("*", { count: "exact", head: true }).eq("status", "approved"),
      db.from("orders").select("user_id", { count: "exact", head: true }).in("status", ["payment_received", "dispatched", "delivered"]),
    ]).then(([assets, redist, events, companies, orders]) => {
      setCounts({
        assets: (assets.count ?? 0).toLocaleString("en-IN"),
        redistributed: (redist.count ?? 0).toLocaleString("en-IN"),
        events: (events.count ?? 0).toLocaleString("en-IN"),
        companies: (companies.count ?? 0).toLocaleString("en-IN"),
        buyers: (orders.count ?? 0).toLocaleString("en-IN"),
      });
    });
  }, []);

  const stats = [
    { label: "Assets Tracked", value: counts.assets, icon: <Package size={18} />, color: "text-saffron-600" },
    { label: "Items Redistributed", value: counts.redistributed, icon: <RefreshCw size={18} />, color: "text-green-600" },
    { label: "Revenue Recovered", value: "₹284 Cr", icon: <IndianRupee size={18} />, color: "text-gold-600" },
    { label: "Events Covered", value: counts.events, icon: <BarChart3 size={18} />, color: "text-saffron-600" },
    { label: "Companies Listed", value: counts.companies, icon: <Globe size={18} />, color: "text-green-600" },
    { label: "Citizens Benefited", value: counts.buyers, icon: <User size={18} />, color: "text-gold-600" },
  ];

  return (
    <section className="bg-surface border-b border-border py-5">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <p className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-widest text-center mb-4">
          REAL-TIME GOVERNMENT ASSET STATISTICS · सरकारी संपत्ति आँकड़े
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{s.value}</p>
              <p className="text-xs text-[#7A7A7A] font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "repeating-linear-gradient(45deg, #E07B00 0, #E07B00 1px, transparent 0, transparent 50%)",
        backgroundSize: "20px 20px",
      }} />

      <div className="relative max-w-screen-xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-saffron-50 border border-saffron-200 px-3 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-saffron-500 rounded-full animate-pulse-soft" />
            <span className="text-xs font-semibold text-saffron-700 uppercase tracking-wider">
              India&apos;s First Government Asset Transparency Platform
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight text-balance mb-6">
            Government Assets.{" "}
            <span className="text-saffron-500">Rated Honestly.</span>{" "}
            Priced Fairly.
          </h1>

          <p className="text-lg text-[#5A5A5A] mb-3 leading-relaxed max-w-2xl">
            After every government event, reusable assets are inspected, rated on a 10-point scale,
            and made available to citizens at transparent, discounted prices — fully compliant with GFR 2017.
          </p>
          <p className="text-base text-[#7A7A7A] mb-8 font-medium" lang="hi">
            सरकारी कार्यक्रमों के बाद संपत्तियाँ निरीक्षण, रेटिंग और उचित कीमत पर नागरिकों के लिए उपलब्ध।
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/public/marketplace" className="btn-primary text-base px-7 py-3">
              Browse Marketplace <ArrowRight size={18} />
            </Link>
            <Link href="/public/register" className="btn-outline text-base px-7 py-3">
              Create Free Account
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-4 mt-8 text-xs text-[#9A9A9A] font-medium">
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-green-500" /> GFR 2017 Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Aadhaar Verified</span>
            <span className="flex items-center gap-1.5"><FileText size={14} className="text-green-500" /> Disposal Certificate Included</span>
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-green-500" /> Delivery Tracked</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────

const CONDITION_LABEL: Record<number, string> = {
  10: "Mint — Never Used",
  9: "Unused — Minor Defect",
  8: "Used — Excellent",
  7: "Used — Good",
  6: "Used — Fair",
  5: "Used — Acceptable",
};

const CATEGORY_GRADIENT: Record<string, string> = {
  Electronics: "bg-gradient-to-br from-[#EDE7F6] to-[#C5CAE9]",
  Furniture: "bg-gradient-to-br from-[#F5F0E8] to-[#E8D5B0]",
  Appliances: "bg-gradient-to-br from-[#F0F4F8] to-[#D9E2EC]",
  Textiles: "bg-gradient-to-br from-[#FFF3E0] to-[#FFCC80]",
  Medical: "bg-gradient-to-br from-[#EDF7ED] to-[#C8E6C9]",
  Sports: "bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB]",
  Machinery: "bg-gradient-to-br from-[#F3F3F3] to-[#DCDCDC]",
};

function ProductCard({
  name,
  category,
  originalPrice,
  listingPrice,
  rating,
  stock,
  condition,
  company,
  id,
  imageUrl,
}: {
  name: string;
  category: string;
  originalPrice: number;
  listingPrice: number;
  rating: number;
  stock: number;
  condition: string;
  company: string;
  id: string;
  imageUrl?: string;
}) {
  const discount = Math.round(((originalPrice - listingPrice) / originalPrice) * 100);
  const imageGradient = CATEGORY_GRADIENT[category] || "bg-gradient-to-br from-[#F3F3F3] to-[#DCDCDC]";

  const ratingColor =
    rating >= 9 ? "#27AE60" :
    rating >= 7 ? "#F39C12" :
    rating >= 5 ? "#E67E22" : "#C0392B";

  return (
    <div className="bento-card group overflow-hidden p-0 flex flex-col">
      {/* Image / placeholder area */}
      <div className={`h-44 ${imageGradient} flex items-end p-4 relative shrink-0 overflow-hidden`}>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}
        {/* Discount badge */}
        <span className="absolute top-3 right-3 bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
          -{discount}%
        </span>
        {/* Rating badge */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-card">
          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: ratingColor }}>
            <Star size={9} fill="white" stroke="none" />
          </div>
          <span className="text-xs font-bold text-[#1A1A1A]">{rating}/10</span>
          <span className="text-xs text-[#5A5A5A]">· {condition}</span>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-[10px] font-semibold text-[#9A9A9A] uppercase tracking-wider">{category}</p>
          <h3 className="text-sm font-bold text-[#1A1A1A] leading-tight mt-0.5 line-clamp-2 group-hover:text-saffron-600 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-[#7A7A7A] mt-1">by {company}</p>
        </div>

        {/* Pricing */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#1A1A1A]">
              ₹{listingPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-[#9A9A9A] line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-xs text-green-600 font-semibold mt-0.5">
            Save ₹{(originalPrice - listingPrice).toLocaleString("en-IN")} off Govt. purchase price
          </p>
        </div>

        {/* Stock */}
        <p className="text-xs text-[#7A7A7A]">
          <span className={`font-semibold ${stock < 10 ? "text-danger" : "text-[#1A1A1A]"}`}>
            {stock} in stock
          </span>
          {" "}at this condition rating
        </p>

        {/* Product ID */}
        <p className="text-[10px] font-mono text-[#B0B0A8] truncate">{id}</p>

        {/* CTA */}
        <Link href={`/marketplace/${id}`} className="btn-primary w-full justify-center text-sm mt-auto">
          View Details
        </Link>
      </div>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <Package size={24} />,
      title: "Company Supplies",
      desc: "Government orders goods from verified companies. Each item gets a unique ID and QR code before delivery.",
      color: "bg-saffron-50 border-saffron-200 text-saffron-600",
    },
    {
      num: "02",
      icon: <BarChart3 size={24} />,
      title: "Government Uses at Events",
      desc: "Items are deployed at events and tracked by volunteers in real time via QR scanning. Defects and repair costs are logged.",
      color: "bg-gold-50 border-gold-200 text-gold-600",
    },
    {
      num: "03",
      icon: <Star size={24} />,
      title: "Inspector Rates Each Item",
      desc: "After the event, certified inspectors rate every item 1–10 on a standard condition scale. Photos are taken and uploaded.",
      color: "bg-green-50 border-green-200 text-green-600",
    },
    {
      num: "04",
      icon: <ShoppingCart size={24} />,
      title: "You Buy at Fair Price",
      desc: "Verified citizens buy at prices based on condition rating — 10%-50% of original government purchase price. GFR-compliant disposal certificate included.",
      color: "bg-saffron-50 border-saffron-200 text-saffron-600",
    },
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">PROCESS</p>
          <h2 className="text-3xl font-bold text-[#1A1A1A]">How It Works</h2>
          <p className="text-[#7A7A7A] mt-2 text-sm" lang="hi">यह कैसे काम करता है</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border -translate-y-1/2 z-0" style={{ width: "calc(100% - 2rem)" }} />
              )}
              <div className="bg-white border border-border rounded-2xl p-6 relative z-10 h-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${step.color}`}>
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-border">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#5A5A5A] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Category Browser ─────────────────────────────────────────────────────────

function CategoryBrowser() {
  const categories = [
    { icon: <Tv size={28} />, label: "Electronics", count: "12,480", href: "electronics" },
    { icon: <Armchair size={28} />, label: "Furniture", count: "28,340", href: "furniture" },
    { icon: <Shirt size={28} />, label: "Textiles", count: "5,620", href: "textiles" },
    { icon: <Cpu size={28} />, label: "Appliances", count: "9,810", href: "appliances" },
    { icon: <Car size={28} />, label: "Vehicles", count: "340", href: "vehicles" },
    { icon: <Stethoscope size={28} />, label: "Medical", count: "2,180", href: "medical" },
    { icon: <Wrench size={28} />, label: "Machinery", count: "4,290", href: "machinery" },
    { icon: <Trophy size={28} />, label: "Sports", count: "3,150", href: "sports" },
    { icon: <Phone size={28} />, label: "Communication", count: "1,840", href: "communication" },
    { icon: <Package size={28} />, label: "Other", count: "11,920", href: "other" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-1">BROWSE</p>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Shop by Category</h2>
          </div>
          <Link href="/public/marketplace" className="text-sm text-saffron-600 hover:underline flex items-center gap-1 font-semibold">
            All Products <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={`/marketplace?cat=${cat.href}`}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-border hover:border-saffron-300 hover:bg-saffron-50 transition-all group text-center"
            >
              <span className="text-[#7A7A7A] group-hover:text-saffron-600 transition-colors">
                {cat.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A] group-hover:text-saffron-700 transition-colors">
                  {cat.label}
                </p>
                <p className="text-xs text-[#9A9A9A] mt-0.5">{cat.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Rating Guide ──────────────────────────────────────────────────────────────

function RatingGuide() {
  const ratings = [
    { r: 10, label: "Mint — Never Used", color: "#27AE60", pct: 50, eligibility: "Public + Institution + Freebie" },
    { r: 9,  label: "Unused — Minor Defect", color: "#2ECC71", pct: 42, eligibility: "Public + Institution + Freebie" },
    { r: 8,  label: "Used — Excellent", color: "#F39C12", pct: 35, eligibility: "Public + Institution + Freebie" },
    { r: 7,  label: "Used — Good", color: "#E67E22", pct: 28, eligibility: "Public + Institution + Freebie" },
    { r: 6,  label: "Used — Fair", color: "#D35400", pct: 20, eligibility: "Institution + Freebie only" },
    { r: 5,  label: "Used — Acceptable", color: "#C0392B", pct: 10, eligibility: "Freebie only" },
    { r: "1–4", label: "Condemned", color: "#922B21", pct: 0, eligibility: "GFR Write-off" },
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">TRANSPARENCY</p>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Condition Rating Guide</h2>
          <p className="text-sm text-[#7A7A7A] mt-1">Every item inspector-rated before listing. What each rating means for price.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {ratings.map((r) => (
            <div key={String(r.r)} className="bg-white border border-border rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg"
                  style={{ backgroundColor: r.color }}
                >
                  {r.r}
                </div>
                {r.pct > 0 && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    {r.pct}% off
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-[#1A1A1A] leading-tight">{r.label}</p>
              <p className="text-[10px] text-[#9A9A9A] leading-tight">{r.eligibility}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#9A9A9A] text-center mt-4">
          * Prices shown are % of original government purchase price. GFR minimum reserve price enforced as floor.
        </p>
      </div>
    </section>
  );
}

// ─── Transparency Section ─────────────────────────────────────────────────────

function Transparency() {
  return (
    <section className="py-16 bg-white border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">COMMITMENT</p>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
              Full Transparency. Every Step.
            </h2>
            <div className="space-y-4">
              {[
                { icon: <Shield size={20} className="text-saffron-600" />, title: "GFR 2017 Compliant", desc: "All disposals follow General Financial Rules. Minimum reserve price enforced. Disposal certificate issued on every transaction." },
                { icon: <FileText size={20} className="text-green-600" />, title: "Open Data Access", desc: "Government procurement and asset data available for public download. Every rupee accounted for." },
                { icon: <CheckCircle size={20} className="text-gold-600" />, title: "Aadhaar-Verified Buyers", desc: "Every buyer is Aadhaar OTP verified. No fake accounts. Purchases tied to verified identity." },
                { icon: <RefreshCw size={20} className="text-saffron-600" />, title: "Complete Asset Lifecycle", desc: "From company delivery to event use to inspector rating to your doorstep — every action is logged and auditable." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A] text-sm">{item.title}</p>
                    <p className="text-xs text-[#7A7A7A] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Govt. Purchases Tracked", value: "₹12,430 Cr", color: "bento-card-saffron" },
              { label: "Revenue Recovered via Resale", value: "₹284 Cr", color: "bento-card-green" },
              { label: "Items Prevented from Waste", value: "98,210", color: "bento-card-gold" },
              { label: "Disposal Certificates Issued", value: "76,480", color: "bento-card" },
            ].map((item) => (
              <div key={item.label} className={item.color}>
                <p className="text-2xl font-bold text-[#1A1A1A]">{item.value}</p>
                <p className="text-xs text-[#5A5A5A] mt-1 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Featured Listings (live from DB) ────────────────────────────────────────

type ListingRow = {
  id: string;
  listing_code: string;
  condition_rating: number;
  listed_price_paise: number;
  original_price_paise: number;
  quantity_available: number;
  product_instances: {
    products: {
      name: string;
      category: string;
      images: { url: string; alt: string; is_primary: boolean }[];
      companies: { trade_name: string | null; legal_name: string };
    };
  } | null;
};

function FeaturedListings() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = createClient();
    db
      .from("redistribution_listings")
      .select(`
        id, listing_code, condition_rating, listed_price_paise,
        original_price_paise, quantity_available,
        product_instances (
          products (
            name, category, images,
            companies ( trade_name, legal_name )
          )
        )
      `)
      .eq("status", "listed")
      .eq("redistribution_type", "public_sale")
      .order("listed_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setListings((data as unknown as ListingRow[]) || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bento-card h-80 animate-pulse bg-surface" />
        ))}
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="text-center py-12 text-[#9A9A9A] text-sm">
        No listings available right now. Check back soon.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {listings.map((l) => {
        const prod = l.product_instances?.products;
        if (!prod) return null;
        const primaryImg = prod.images?.find((img) => img.is_primary) || prod.images?.[0];
        return (
          <ProductCard
            key={l.id}
            id={l.listing_code}
            name={prod.name}
            category={prod.category}
            originalPrice={Math.round(l.original_price_paise / 100)}
            listingPrice={Math.round(l.listed_price_paise / 100)}
            rating={l.condition_rating}
            stock={l.quantity_available}
            condition={CONDITION_LABEL[l.condition_rating] || "Used"}
            company={prod.companies?.trade_name || prod.companies?.legal_name || "Govt. Supplier"}
            imageUrl={primaryImg?.url}
          />
        );
      })}
    </div>
  );
}

// ─── Public Footer ─────────────────────────────────────────────────────────────

function PublicFooter() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="tiranga-accent opacity-60" />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AshokaChakra size={32} />
              <div>
                <p className="text-xs text-[#9A9A9A] leading-none">Government of India</p>
                <p className="text-sm font-bold text-white leading-tight">GAMS</p>
              </div>
            </div>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Government Asset Management System. Transparent. Accountable. Citizen-first.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-3">Marketplace</p>
            {["Browse All Products", "Electronics", "Furniture", "Vehicles", "Medical Equipment"].map((l) => (
              <Link key={l} href="/public/marketplace" className="block text-xs text-[#C0C0B8] hover:text-white py-1 transition-colors">{l}</Link>
            ))}
          </div>

          <div>
            <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-3">My Account</p>
            {["Register / Login", "My Orders", "Track Order", "Grievance", "Profile"].map((l) => (
              <Link key={l} href="#" className="block text-xs text-[#C0C0B8] hover:text-white py-1 transition-colors">{l}</Link>
            ))}
          </div>

          <div>
            <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-3">Information</p>
            {["About GAMS", "How It Works", "Rating System", "GFR Compliance", "Open Data Download", "Contact"].map((l) => (
              <Link key={l} href="#" className="block text-xs text-[#C0C0B8] hover:text-white py-1 transition-colors">{l}</Link>
            ))}
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] pt-6 flex flex-wrap gap-4 justify-between text-[10px] text-[#6A6A6A]">
          <span>© 2026 Ministry of Finance, Government of India</span>
          <div className="flex flex-wrap gap-4">
            <span>Hosted by NIC</span>
            <span>GIGW Compliant</span>
            <span>WCAG 2.1 AA</span>
            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PublicHome() {
  return (
    <>
      <PublicNav />
      <StatTicker />
      <Hero />

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-1">FEATURED</p>
              <h2 className="text-2xl font-bold text-[#1A1A1A]">Recently Listed Items</h2>
              <p className="text-sm text-[#7A7A7A] mt-0.5">Inspector-rated. Government verified. Ready to buy.</p>
            </div>
            <Link href="/public/marketplace" className="text-sm text-saffron-600 hover:underline flex items-center gap-1 font-semibold shrink-0">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeaturedListings />
          </div>
        </div>
      </section>

      <CategoryBrowser />
      <HowItWorks />
      <RatingGuide />
      <Transparency />

      {/* CTA Banner */}
      <section className="py-14 bg-saffron-500">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Buy Government-Grade Assets?
          </h2>
          <p className="text-saffron-100 text-sm mb-6 max-w-xl mx-auto">
            Create a free account with Aadhaar verification and start browsing thousands of rated, discounted government assets available right now.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/public/register" className="bg-white text-saffron-700 font-bold px-7 py-3 rounded-xl hover:bg-saffron-50 transition-colors text-sm">
              Create Free Account
            </Link>
            <Link href="/public/marketplace" className="border-2 border-white text-white font-bold px-7 py-3 rounded-xl hover:bg-saffron-600 transition-colors text-sm">
              Browse Without Login
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
