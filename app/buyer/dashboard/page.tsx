"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  FileText,
  Settings,
  Bell,
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Package,
  Truck,
  IndianRupee,
  Plus,
  Search,
  Filter,
  LogOut,
  User,
  ChevronDown,
  ArrowRight,
  Eye,
  Star,
  MapPin,
  Calendar,
  RefreshCw,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type InstitutionStatus = "pending_review" | "approved" | "rejected" | "suspended";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};

// ─── Nav Config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",          href: "/buyer/dashboard",            icon: <LayoutDashboard size={18} /> },
  { label: "Browse Marketplace", href: "/buyer/dashboard/marketplace",icon: <ShoppingBag size={18} />, badge: 24 },
  { label: "My Orders",          href: "/buyer/dashboard/orders",     icon: <ClipboardList size={18} />, badge: 2 },
  { label: "Documents",          href: "/buyer/dashboard/documents",  icon: <FileText size={18} /> },
  { label: "Account Settings",   href: "/buyer/dashboard/settings",   icon: <Settings size={18} /> },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  open,
  onClose,
  institutionName,
  status,
}: {
  open: boolean;
  onClose: () => void;
  institutionName: string;
  status: InstitutionStatus;
}) {
  const statusConfig: Record<InstitutionStatus, { label: string; color: string; bg: string }> = {
    pending_review: { label: "Pending Review", color: "#B45309", bg: "#FEF9C3" },
    approved:       { label: "Approved",       color: "#15803D", bg: "#DCFCE7" },
    rejected:       { label: "Rejected",       color: "#DC2626", bg: "#FEE2E2" },
    suspended:      { label: "Suspended",      color: "#7C3AED", bg: "#EDE9FE" },
  };
  const sc = statusConfig[status];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-border z-40 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <AshokaChakra size={32} />
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Buyer Portal</p>
            <p className="text-sm font-bold text-gray-900 truncate">GAMS</p>
          </div>
          <button onClick={onClose} className="lg:hidden ml-auto p-1 rounded hover:bg-surface text-gray-400" aria-label="Close menu">
            <X size={16} />
          </button>
        </div>

        {/* Institution info */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <Building2 size={15} className="text-green-700" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{institutionName}</p>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                style={{ color: sc.color, background: sc.bg }}
              >
                {status === "approved" && <CheckCircle2 size={9} />}
                {status === "pending_review" && <Clock size={9} />}
                {status === "rejected" && <XCircle size={9} />}
                {sc.label}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/buyer/dashboard";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors
                  ${active
                    ? "bg-green-50 text-green-700 font-semibold"
                    : "text-gray-600 hover:bg-surface hover:text-gray-900"
                  }
                `}
              >
                <span className={active ? "text-green-600" : "text-gray-400"}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge != null && (
                  <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 py-3 border-t border-border">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
      <div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
          style={{ background: accent }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_LISTINGS = [
  {
    id: "MKT-2024-00412",
    name: "Folding Chairs — Steel Frame, Black Fabric",
    category: "Furniture",
    condition: "Good",
    qty: 1200,
    originalValue: "₹2,400/unit",
    listingPrice: "₹320/unit",
    discount: "87%",
    event: "India International Trade Fair 2023",
    location: "Pragati Maidan, New Delhi",
  },
  {
    id: "MKT-2024-00398",
    name: "Outdoor Canopy Tent — 10×10 ft, White",
    category: "Infrastructure",
    condition: "Good",
    qty: 180,
    originalValue: "₹38,000/unit",
    listingPrice: "₹4,200/unit",
    discount: "89%",
    event: "G20 Summit Overflow Events 2023",
    location: "Bharat Mandapam, New Delhi",
  },
  {
    id: "MKT-2024-00371",
    name: "Public Address System — 1000W",
    category: "Electronics",
    condition: "Serviceable",
    qty: 45,
    originalValue: "₹85,000/unit",
    listingPrice: "₹6,500/unit",
    discount: "92%",
    event: "Republic Day 2023",
    location: "Rajpath, New Delhi",
  },
];

const MOCK_ORDERS = [
  {
    id: "ORD-2024-00512",
    listing: "Folding Chairs — Steel Frame, Black Fabric",
    qty: 500,
    total: "₹1,60,000",
    status: "confirmed",
    created: "21 Jun 2024",
    delivery: "Pending",
  },
  {
    id: "ORD-2024-00489",
    listing: "Plastic Tables — 6ft, White Laminate",
    qty: 200,
    total: "₹78,000",
    status: "delivered",
    created: "10 Jun 2024",
    delivery: "08 Jul 2024",
  },
  {
    id: "ORD-2024-00534",
    listing: "Outdoor Canopy Tent — 10×10 ft",
    qty: 20,
    total: "₹84,000",
    status: "pending",
    created: "22 Jun 2024",
    delivery: "—",
  },
];

const ORDER_STATUS_CONFIG = {
  confirmed: { label: "Confirmed",  bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-200"   },
  delivered: { label: "Delivered",  bg: "bg-green-50",  text: "text-green-700", border: "border-green-200"  },
  pending:   { label: "Awaiting PO",bg: "bg-yellow-50", text: "text-yellow-700",border: "border-yellow-200" },
};

const CONDITION_CONFIG: Record<string, { bg: string; text: string }> = {
  "Good":        { bg: "bg-green-50",  text: "text-green-700"  },
  "Serviceable": { bg: "bg-yellow-50", text: "text-yellow-700" },
  "Fair":        { bg: "bg-orange-50", text: "text-orange-700" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyerDashboardPage({
  searchParams,
}: {
  searchParams: { registered?: string };
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState([
    { id: 1, read: false, icon: "📦", title: "Order Delivered",           sub: "Order #ORD-1042 delivered to your stores",        time: "5 min ago"  },
    { id: 2, read: false, icon: "🆕", title: "New Products Listed",       sub: "14 new verified assets in Electronics category",  time: "2 hrs ago"  },
    { id: 3, read: true,  icon: "✅", title: "Institution Verified",      sub: "Your institution profile has been approved",      time: "Yesterday"  },
    { id: 4, read: true,  icon: "💳", title: "Payment Processed",         sub: "₹1,20,000 payment for Order #ORD-1039 processed", time: "2 days ago" },
  ]);
  const unreadCount = notifItems.filter((n) => !n.read).length;

  const [institutionName, setInstitutionName] = useState("Your Institution");
  const [institutionStatus, setInstitutionStatus] = useState<InstitutionStatus>("pending_review");
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [myOrders, setMyOrders] = useState(MOCK_ORDERS);
  const [marketCount, setMarketCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const isJustRegistered = searchParams?.registered === "1";

  useEffect(() => {
    const db = createClient();
    db.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: instData } = await db
        .from("institution_users")
        .select("institutions (id, name, status, institution_type)")
        .eq("user_id", user.id)
        .single();
      if (instData?.institutions) {
        const inst = instData.institutions as unknown as { id: string; name: string; status: string; institution_type: string };
        setInstitutionName(inst.name);
        setInstitutionStatus(inst.status as InstitutionStatus);
      }
      const { data: mktItems } = await db.from("v_marketplace")
        .select("listing_code, product_name, category, condition_rating, quantity_available, listed_price_paise, original_price_paise, discount_pct")
        .order("listing_code", { ascending: false }).limit(3);
      if (mktItems && mktItems.length > 0) {
        setListings(mktItems.map((m) => {
          const condNum = m.condition_rating ?? 3;
          const condLabel = condNum >= 4 ? "Good" : condNum >= 3 ? "Serviceable" : "Fair";
          const originalPaise = m.original_price_paise;
          const listedPaise = m.listed_price_paise ?? originalPaise;
          const fmt = (p: number) => "\u20B9" + (p / 100).toLocaleString("en-IN");
          return {
            id: m.listing_code,
            name: m.product_name,
            category: m.category,
            condition: condLabel,
            qty: m.quantity_available,
            originalValue: fmt(originalPaise) + "/unit",
            listingPrice: fmt(listedPaise) + "/unit",
            discount: m.discount_pct ? Math.round(m.discount_pct) + "%" : "0%",
            event: "—",
            location: "—",
          };
        }));
      }
      const { count: mktCount } = await db
        .from("v_marketplace")
        .select("*", { count: "exact", head: true });
      setMarketCount(mktCount ?? 0);
      const { data: ords } = await db.from("orders")
        .select("order_number, status, total_paise, created_at, delivered_at, notes")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false }).limit(3);
      const { count: ordCount } = await db
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("buyer_id", user.id);
      setOrdersCount(ordCount ?? 0);
      if (ords && ords.length > 0) {
        setMyOrders(ords.map((o) => ({
          id: o.order_number,
          listing: o.notes ?? "—",
          qty: 1,
          total: "\u20B9" + (o.total_paise / 100).toLocaleString("en-IN"),
          status: (["payment_received", "processing"] as string[]).includes(o.status)
            ? "confirmed"
            : o.status === "delivered" ? "delivered" : "pending",
          created: new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          delivery: o.delivered_at
            ? new Date(o.delivered_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : "—",
        })));
      }
    });
  }, []);

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        institutionName={institutionName}
        status={institutionStatus}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tiranga bar */}
        <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

        {/* Top bar */}
        <header className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded border border-border hover:bg-surface"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">Institution Dashboard</h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Browse CTA */}
            <Link
              href="/buyer/dashboard/marketplace"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "#138808" }}
            >
              <ShoppingBag size={13} /> Browse Marketplace
            </Link>

            {/* Notifications */}
            <div className="relative">
              {notifOpen && <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />}
              <button
                className="relative p-2 rounded-lg border border-border hover:bg-surface transition-colors"
                aria-label="Notifications"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={18} className="text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center px-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-black text-gray-900">Notifications</span>
                    <button
                      className="text-xs font-bold hover:underline"
                      style={{ color: "#138808" }}
                      onClick={() => setNotifItems((n) => n.map((item) => ({ ...item, read: true })))}
                    >Mark all read</button>
                  </div>
                  <div className="divide-y divide-border max-h-72 overflow-y-auto">
                    {notifItems.map((notif) => (
                      <button
                        key={notif.id}
                        className={`w-full text-left px-4 py-3 hover:bg-surface transition-colors flex items-start gap-3 ${notif.read ? "opacity-60" : ""}`}
                        onClick={() => setNotifItems((n) => n.map((item) => item.id === notif.id ? { ...item, read: true } : item))}
                      >
                        <span className="text-base shrink-0 mt-0.5">{notif.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-500 truncate">{notif.sub}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{notif.time}</p>
                        </div>
                        {!notif.read && <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: "#138808" }} />}
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-border">
                    <button className="text-xs font-bold hover:underline w-full text-center" style={{ color: "#138808" }}>View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-surface transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                  <User size={14} className="text-green-700" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  Institution Admin
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-xl shadow-lg z-50 py-1">
                  <Link href="/buyer/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-surface">
                    <Settings size={14} /> Account Settings
                  </Link>
                  <hr className="my-1 border-border" />
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6">

          {/* ── Registration success banner ──────────────────────────────── */}
          {isJustRegistered && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-green-800 mb-1">Registration Submitted Successfully</h2>
                <p className="text-sm text-green-700">
                  Your institution profile has been submitted for government verification. You&apos;ll be notified by email
                  once your account is approved (typically 3–5 working days). After approval, you can browse
                  redistributed government assets and place orders.
                </p>
              </div>
            </div>
          )}

          {/* ── Pending approval banner ───────────────────────────────────── */}
          {institutionStatus === "pending_review" && !isJustRegistered && (
            <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-yellow-800 mb-1">Account Under Verification</h2>
                <p className="text-sm text-yellow-700 mb-3">
                  Your institution is pending government verification. Marketplace browsing and order placement will
                  be enabled after approval. You can still upload supporting documents to expedite the review.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/buyer/dashboard/documents"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-yellow-600 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <FileText size={12} /> View Documents
                  </Link>
                  <Link
                    href="/support"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold border border-yellow-400 text-yellow-700 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── Stats row ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Orders Placed"       value={ordersCount}  sub={ordersCount === 1 ? "1 order placed" : `${ordersCount} orders placed`}  icon={<ClipboardList size={18} />}  accent="#138808" />
            <StatCard label="Available Listings"  value={marketCount}  sub="In marketplace now"                                                      icon={<Package size={18} />}        accent="#E07B00" />
            <StatCard label="Pending Deliveries"  value="2"            sub="Expected within 30 days"                                                 icon={<Truck size={18} />}          accent="#1A3A6B" />
            <StatCard label="Total Savings"       value="₹12.4L"       sub="vs. original procurement"                                                icon={<IndianRupee size={18} />}    accent="#C9960C" />
          </div>

          {/* ── Bento row 1: Featured Listings + My Orders ────────────────── */}
          <div className="grid lg:grid-cols-5 gap-4 mb-4">

            {/* Featured Marketplace Listings — 3/5 */}
            <div className="lg:col-span-3 bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Available Listings</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Redistributed assets from recent events</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/buyer/dashboard/marketplace"
                    className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    Browse All <ChevronRight size={12} />
                  </Link>
                  <Link
                    href="/buyer/dashboard/marketplace"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                    style={{ background: "#138808" }}
                  >
                    <Search size={12} /> Search
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-border">
                {listings.map((listing) => {
                  const cc = CONDITION_CONFIG[listing.condition] ?? { bg: "bg-gray-50", text: "text-gray-600" };
                  return (
                    <div key={listing.id} className="px-5 py-4 hover:bg-surface/60 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Package size={15} className="text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{listing.name}</p>
                            <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${cc.bg} ${cc.text}`}>
                              {listing.condition}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-xs text-gray-400">{listing.category}</span>
                            <span className="text-xs text-gray-400">Qty: {listing.qty.toLocaleString("en-IN")}</span>
                            <span className="text-xs font-bold text-green-700">{listing.listingPrice}</span>
                            <span className="text-[10px] line-through text-gray-400">{listing.originalValue}</span>
                            <span className="text-[10px] font-bold text-saffron-600 bg-saffron-50 px-1.5 py-0.5 rounded">
                              -{listing.discount} off
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <MapPin size={9} /> {listing.location}
                          </p>
                        </div>
                        <Link
                          href={`/buyer/dashboard/marketplace/${listing.id}`}
                          className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-white px-2.5 py-1.5 rounded-lg mt-0.5"
                          style={{ background: "#138808" }}
                        >
                          Order
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-5 py-3 border-t border-border bg-surface/40">
                <Link
                  href="/buyer/dashboard/marketplace"
                  className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                  View all {marketCount > 0 ? `${marketCount}` : "all"} available listings <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* My Orders — 2/5 */}
            <div className="lg:col-span-2 bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h2 className="text-base font-bold text-gray-900">My Orders</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Your asset purchase requests</p>
                </div>
                <Link href="/buyer/dashboard/orders" className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">
                  View All <ChevronRight size={12} />
                </Link>
              </div>

              <div className="divide-y divide-border">
                {myOrders.map((o) => {
                  const sc = ORDER_STATUS_CONFIG[o.status as keyof typeof ORDER_STATUS_CONFIG];
                  return (
                    <div key={o.id} className="px-5 py-4 hover:bg-surface/60 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{o.listing}</p>
                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sc.bg} ${sc.text} ${sc.border}`}>
                          {sc.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                        <span>{o.id}</span>
                        <span>Qty: {o.qty}</span>
                        <span className="font-bold text-gray-700">{o.total}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Ordered: {o.created} · Delivery: {o.delivery}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Bento row 2: Quick Actions + Savings Summary + Asset Pipeline ─ */}
          <div className="grid md:grid-cols-3 gap-4">

            {/* Quick Actions */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Browse All Listings",        icon: <ShoppingBag size={15} />, href: "/buyer/dashboard/marketplace",           color: "#138808" },
                  { label: "Apply Category Filter",      icon: <Filter size={15} />,      href: "/buyer/dashboard/marketplace?filter=1",  color: "#E07B00" },
                  { label: "Track Order Delivery",       icon: <Truck size={15} />,       href: "/buyer/dashboard/orders",                color: "#C9960C" },
                  { label: "Download Order Receipts",    icon: <FileText size={15} />,    href: "/buyer/dashboard/orders?receipts=1",     color: "#1A3A6B" },
                  { label: "Update Institution Profile", icon: <Settings size={15} />,    href: "/buyer/dashboard/settings",              color: "#6D28D9" },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border hover:bg-surface hover:border-green-200 transition-colors group"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                      style={{ background: a.color }}
                    >
                      {a.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{a.label}</span>
                    <ChevronRight size={14} className="text-gray-300 ml-auto group-hover:text-gray-500" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Savings Summary */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-1">Procurement Savings</h2>
              <p className="text-xs text-gray-400 mb-5">Savings vs. buying new at tender price</p>

              <div className="space-y-4">
                {[
                  { name: "Folding Chairs (500 units)",   original: 12_00_000, paid: 1_60_000 },
                  { name: "Plastic Tables (200 units)",   original:  7_80_000, paid:   78_000 },
                  { name: "Canopy Tents (pending)",       original:  7_60_000, paid:   84_000 },
                ].map((item) => {
                  const savings = item.original - item.paid;
                  const pct = Math.round((savings / item.original) * 100);
                  const fmt = (n: number) =>
                    n >= 1_00_000
                      ? `₹${(n / 1_00_000).toFixed(1)}L`
                      : `₹${(n / 1000).toFixed(0)}K`;
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-gray-700 truncate pr-2">{item.name}</p>
                        <span className="text-xs font-bold text-green-700 shrink-0">-{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: "#138808" }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-gray-400 line-through">{fmt(item.original)}</p>
                        <p className="text-[10px] font-bold text-green-700">Saved {fmt(savings)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">Total Saved</p>
                  <p className="text-lg font-black text-green-700">₹12.4L</p>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">Compared to open-market tender rates</p>
              </div>
            </div>

            {/* Delivery Tracker */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-1">Order Delivery Tracker</h2>
              <p className="text-xs text-gray-400 mb-4">Real-time status of your active orders</p>

              <div className="space-y-5">
                {[
                  {
                    order: "ORD-2024-00512",
                    item: "Folding Chairs (500)",
                    stages: [
                      { label: "Order Placed",          done: true  },
                      { label: "PO Confirmed",          done: true  },
                      { label: "Dispatch Initiated",    done: true  },
                      { label: "In Transit",            done: false },
                      { label: "Delivered & Verified",  done: false },
                    ],
                  },
                  {
                    order: "ORD-2024-00534",
                    item: "Canopy Tents (20)",
                    stages: [
                      { label: "Order Placed",          done: true  },
                      { label: "PO Confirmed",          done: false },
                      { label: "Dispatch Initiated",    done: false },
                      { label: "In Transit",            done: false },
                      { label: "Delivered & Verified",  done: false },
                    ],
                  },
                ].map((order) => {
                  const doneCount = order.stages.filter((s) => s.done).length;
                  const currentIdx = order.stages.findIndex((s) => !s.done);
                  return (
                    <div key={order.order} className="border border-border rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-gray-800 truncate pr-2">{order.item}</p>
                        <span className="text-[10px] font-bold text-green-600 shrink-0">{doneCount}/{order.stages.length}</span>
                      </div>
                      <p className="text-[9px] text-gray-400 mb-2">{order.order}</p>
                      <div className="flex items-center gap-1">
                        {order.stages.map((stage, i) => (
                          <div key={stage.label} className="flex items-center gap-1 flex-1">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ${
                                stage.done ? "bg-green-500" : i === currentIdx ? "bg-yellow-400 animate-pulse" : "bg-gray-200"
                              }`}
                              title={stage.label}
                            >
                              {stage.done ? <CheckCircle2 size={10} /> : <span className="w-1.5 h-1.5 rounded-full bg-white/60" />}
                            </div>
                            {i < order.stages.length - 1 && (
                              <div className={`flex-1 h-0.5 ${stage.done ? "bg-green-400" : "bg-gray-200"}`} />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">
                        {currentIdx >= 0 ? `Next: ${order.stages[currentIdx].label}` : "✓ Delivery complete"}
                      </p>
                    </div>
                  );
                })}

                <div className="mt-1">
                  <Link
                    href="/buyer/dashboard/orders"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Truck size={12} /> View All Orders <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
