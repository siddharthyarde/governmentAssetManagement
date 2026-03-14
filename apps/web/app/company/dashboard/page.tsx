"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  LayoutDashboard,
  Package,
  QrCode,
  FileText,
  Settings,
  ShoppingCart,
  Bell,
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Building2,
  BarChart3,
  Download,
  Plus,
  Layers,
  TrendingUp,
  IndianRupee,
  Truck,
  RefreshCw,
  LogOut,
  User,
  ChevronDown,
  Eye,
  Upload,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type CompanyStatus = "pending_review" | "approved" | "rejected" | "suspended";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};

// ─── Nav Config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "My Products", href: "/dashboard/products", icon: <Package size={18} />, badge: 3 },
  { label: "Orders & POs", href: "/dashboard/orders", icon: <ShoppingCart size={18} /> },
  { label: "QR Codes", href: "/dashboard/qr-codes", icon: <QrCode size={18} /> },
  { label: "Documents", href: "/dashboard/documents", icon: <FileText size={18} /> },
  { label: "Account Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  open,
  onClose,
  companyName,
  status,
}: {
  open: boolean;
  onClose: () => void;
  companyName: string;
  status: CompanyStatus;
}) {
  const statusConfig: Record<CompanyStatus, { label: string; color: string; bg: string }> = {
    pending_review: { label: "Pending Review", color: "#B45309", bg: "#FEF9C3" },
    approved:       { label: "Approved",       color: "#15803D", bg: "#DCFCE7" },
    rejected:       { label: "Rejected",       color: "#DC2626", bg: "#FEE2E2" },
    suspended:      { label: "Suspended",      color: "#7C3AED", bg: "#EDE9FE" },
  };
  const sc = statusConfig[status];

  return (
    <>
      {/* Overlay on mobile */}
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
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Supplier Portal</p>
            <p className="text-sm font-bold text-gray-900 truncate">GAMS</p>
          </div>
          <button onClick={onClose} className="lg:hidden ml-auto p-1 rounded hover:bg-surface text-gray-400" aria-label="Close menu">
            <X size={16} />
          </button>
        </div>

        {/* Company Info */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-lg bg-saffron-100 flex items-center justify-center shrink-0">
              <Building2 size={15} className="text-saffron-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{companyName}</p>
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
            const active = item.href === "/dashboard";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium
                  transition-colors relative
                  ${active
                    ? "bg-saffron-50 text-saffron-700 font-semibold"
                    : "text-gray-600 hover:bg-surface hover:text-gray-900"
                  }
                `}
              >
                <span className={active ? "text-saffron-600" : "text-gray-400"}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge != null && (
                  <span className="bg-saffron-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
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
    <div className="bento-card bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
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

// ─── Status Configs ──────────────────────────────────────────────────────────

const PRODUCT_STATUS_CONFIG = {
  approved: { label: "Approved",       bg: "bg-green-50",    text: "text-green-700",   border: "border-green-200", icon: <CheckCircle2 size={12} /> },
  pending:  { label: "Under Review",   bg: "bg-yellow-50",   text: "text-yellow-700",  border: "border-yellow-200",icon: <Clock size={12} /> },
  rejected: { label: "Rejected",       bg: "bg-red-50",      text: "text-red-700",     border: "border-red-200",   icon: <XCircle size={12} /> },
};

const ORDER_STATUS_CONFIG = {
  confirmed: { label: "Confirmed",  bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-200"  },
  delivered: { label: "Delivered",  bg: "bg-green-50",  text: "text-green-700", border: "border-green-200" },
  pending:   { label: "Pending PO", bg: "bg-yellow-50", text: "text-yellow-700",border: "border-yellow-200"},
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompanyDashboardPage({
  searchParams,
}: {
  searchParams: { registered?: string };
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState([
    { id: 1, read: false, icon: "🛒", title: "New Order Received",       sub: "Order #ORD-2891 placed for 12 items",              time: "2 min ago"  },
    { id: 2, read: false, icon: "✅", title: "Account Approved",         sub: "Your company profile has been verified by GAMS",  time: "1 hr ago"   },
    { id: 3, read: true,  icon: "⚠️", title: "Product Expiry Warning",   sub: "3 products are set to expire in 7 days",          time: "3 hrs ago"  },
    { id: 4, read: true,  icon: "💰", title: "Payment Received",         sub: "₹48,000 credited for Order #ORD-2854",            time: "Yesterday"  },
  ]);
  const unreadCount = notifItems.filter((n) => !n.read).length;

  const [companyName, setCompanyName] = useState("Your Company");
  const [companyStatus, setCompanyStatus] = useState<CompanyStatus>("pending_review");
  const [products, setProducts] = useState<{ id: string; name: string; qty: number; status: string; qr: boolean; created: string }[]>([]);
  const [orders, setOrders] = useState<{ id: string; event: string; items: number; po: string; status: string; date: string }[]>([]);
  const [statProducts, setStatProducts] = useState(0);
  const [statPending, setStatPending] = useState(0);
  const [statQr, setStatQr] = useState(0);
  const [statRevenue, setStatRevenue] = useState(0);
  const isJustRegistered = searchParams?.registered === "1";

  useEffect(() => {
    const db = createClient();
    db.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: cu } = await db.from("company_users")
        .select("company_id").eq("user_id", user.id).single();
      if (!cu) return;
      const { data: company } = await db.from("companies")
        .select("legal_name, status").eq("id", cu.company_id).single();
      if (company) {
        setCompanyName(company.legal_name);
        setCompanyStatus(company.status as CompanyStatus);
      }
      const { data: prods } = await db.from("products")
        .select("product_code, name, status, created_at")
        .eq("company_id", cu.company_id)
        .order("created_at", { ascending: false }).limit(5);
      setProducts((prods ?? []).map((p) => ({
        id: p.product_code,
        name: p.name,
        qty: 0,
        status: p.status === "pending_approval" ? "pending" :
                p.status === "approved" ? "approved" : "rejected",
        qr: false,
        created: new Date(p.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      })));

      // Real stat counts
      const [{ count: total }, { count: pending }, { count: approved }] = await Promise.all([
        db.from("products").select("*", { count: "exact", head: true }).eq("company_id", cu.company_id),
        db.from("products").select("*", { count: "exact", head: true }).eq("company_id", cu.company_id).eq("status", "pending_approval"),
        db.from("products").select("*", { count: "exact", head: true }).eq("company_id", cu.company_id).eq("status", "approved"),
      ]);
      setStatProducts(total ?? 0);
      setStatPending(pending ?? 0);
      setStatQr(approved ?? 0);

      const { data: ords } = await db.from("orders")
        .select("order_number, status, total_paise, created_at, tracking_number, notes")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(3);
      setOrders((ords ?? []).map((o) => ({
        id: o.order_number,
        event: o.notes ?? "—",
        items: Math.round(o.total_paise / 100),
        po: o.tracking_number ?? "—",
        status: (["payment_received", "processing"] as string[]).includes(o.status)
          ? "confirmed"
          : o.status === "delivered" ? "delivered" : "pending",
        date: new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      })));
      const totalRevPaise = (ords ?? []).filter((o) => o.status === "delivered").reduce((s, o) => s + o.total_paise, 0);
      setStatRevenue(Math.round(totalRevPaise / 100));
    });
  }, []);

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        companyName={companyName}
        status={companyStatus}
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
            <h1 className="text-lg font-bold text-gray-900 truncate">Supplier Dashboard</h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
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
                      className="text-xs font-bold text-saffron-600 hover:underline"
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
                          <p className={`text-xs font-bold text-gray-900 ${!notif.read ? "" : "font-semibold"}`}>{notif.title}</p>
                          <p className="text-xs text-gray-500 truncate">{notif.sub}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{notif.time}</p>
                        </div>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-saffron-500 shrink-0 mt-1" />}
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-border">
                    <button className="text-xs font-bold text-saffron-600 hover:underline w-full text-center">View all notifications</button>
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
                <div className="w-7 h-7 rounded-full bg-saffron-100 flex items-center justify-center">
                  <User size={14} className="text-saffron-700" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  Supplier Admin
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-xl shadow-lg z-50 py-1">
                  <Link href="/company/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-surface">
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

          {/* ── Registration success banner ─────────────────────────────── */}
          {isJustRegistered && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-green-800 mb-1">Registration Submitted Successfully</h2>
                <p className="text-sm text-green-700">
                  Your company profile has been submitted for verification. The GAMS admin team will review your
                  documents within 3–5 working days. You&apos;ll receive an email once your account is approved.
                </p>
              </div>
            </div>
          )}

          {/* ── Pending approval banner ─────────────────────────────────── */}
          {companyStatus === "pending_review" && !isJustRegistered && (
            <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-yellow-800 mb-1">Account Under Review</h2>
                <p className="text-sm text-yellow-700 mb-3">
                  Your company registration is being reviewed by the GAMS admin team. Product listing and order
                  management will be enabled once your account is approved.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/company/dashboard/documents" className="inline-flex items-center gap-1.5 text-xs font-bold bg-yellow-600 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-700 transition-colors">
                    <FileText size={12} /> View Submitted Documents
                  </Link>
                  <Link href="/support" className="inline-flex items-center gap-1.5 text-xs font-semibold border border-yellow-400 text-yellow-700 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── Rejected banner ─────────────────────────────────────────── */}
          {companyStatus === "rejected" && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <XCircle size={20} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-red-800 mb-1">Registration Rejected</h2>
                <p className="text-sm text-red-700 mb-3">
                  Your company registration was rejected. Please review the rejection reason, correct the
                  issues, and resubmit your documents.
                </p>
                <Link href="/company/dashboard/documents" className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
                  <Upload size={12} /> Resubmit Documents
                </Link>
              </div>
            </div>
          )}

          {/* ── Stats row ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Products Listed"    value={statProducts} sub={statPending > 0 ? `${statPending} pending approval` : "No pending products"}      icon={<Package size={18} />}       accent="#E07B00" />
            <StatCard label="Orders Received"    value={orders.length}      sub={orders.length === 1 ? "1 order" : `${orders.length} orders`} icon={<ShoppingCart size={18} />}  accent="#138808" />
            <StatCard label="Approved Products"  value={statQr}  sub={statQr > 0 ? `${statQr} QR-ready` : "None approved yet"}       icon={<QrCode size={18} />}        accent="#C9960C" />
            <StatCard label="Total PO Value"     value={statRevenue > 0 ? (statRevenue >= 100000 ? `₹${(statRevenue/100000).toFixed(1)}L` : `₹${statRevenue.toLocaleString("en-IN")}`) : "₹0"} sub="Delivered orders"              icon={<IndianRupee size={18} />}   accent="#1A3A6B" />
          </div>

          {/* ── Bento row 1: Products + Orders ───────────────────────────── */}
          <div className="grid lg:grid-cols-5 gap-4 mb-4">

            {/* Products table — 3/5 */}
            <div className="lg:col-span-3 bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h2 className="text-base font-bold text-gray-900">My Products</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Latest submitted product listings</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/company/dashboard/products"
                    className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
                  >
                    View All <ChevronRight size={12} />
                  </Link>
                  <Link
                    href="/company/dashboard/products/new"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                    style={{ background: "#E07B00" }}
                  >
                    <Plus size={12} /> Add Product
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-border">
                {products.map((p) => {
                  const sc = PRODUCT_STATUS_CONFIG[p.status as keyof typeof PRODUCT_STATUS_CONFIG];
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface/60 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-saffron-50 border border-saffron-100 flex items-center justify-center shrink-0">
                        <Package size={14} className="text-saffron-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.id} · Qty: {p.qty.toLocaleString("en-IN")} · {p.created}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {p.qr && (
                          <button className="p-1.5 rounded-lg border border-border hover:bg-surface text-gray-400 hover:text-gray-700 transition-colors" title="Download QR Labels">
                            <Download size={13} />
                          </button>
                        )}
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Orders — 2/5 */}
            <div className="lg:col-span-2 bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Orders & POs</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Government purchase orders</p>
                </div>
                <Link href="/company/dashboard/orders" className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1">
                  View All <ChevronRight size={12} />
                </Link>
              </div>

              <div className="divide-y divide-border">
                {orders.map((o) => {
                  const sc = ORDER_STATUS_CONFIG[o.status as keyof typeof ORDER_STATUS_CONFIG];
                  return (
                    <div key={o.id} className="px-5 py-4 hover:bg-surface/60 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{o.event}</p>
                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sc.bg} ${sc.text} ${sc.border}`}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{o.id} · {o.items.toLocaleString("en-IN")} items</p>
                      <p className="text-[10px] font-mono text-gray-400">{o.po}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Bento row 2: Quick Actions + QR Overview + Delivery Pipeline ─ */}
          <div className="grid md:grid-cols-3 gap-4">

            {/* Quick Actions */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Add New Product",          icon: <Plus size={15} />,       href: "/dashboard/products/new",   color: "#E07B00" },
                  { label: "Upload Bulk CSV",           icon: <Upload size={15} />,     href: "/dashboard/products/bulk",  color: "#138808" },
                  { label: "Download QR Label Sheet",   icon: <Download size={15} />,   href: "/dashboard/qr-codes",       color: "#C9960C" },
                  { label: "View Order History",        icon: <BarChart3 size={15} />,  href: "/dashboard/orders",         color: "#1A3A6B" },
                  { label: "Update Company Documents",  icon: <FileText size={15} />,   href: "/dashboard/documents",      color: "#6D28D9" },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border hover:bg-surface hover:border-saffron-200 transition-colors group"
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

            {/* QR Code Overview */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-1">QR Code Status</h2>
              <p className="text-xs text-gray-400 mb-4">Labels generated for approved products</p>

              <div className="space-y-4">
                {[
                  { name: "Folding Chairs — Steel Frame",  total: 5000, ready: 5000 },
                  { name: "Plastic Tables — 6ft, White",   total: 2000, ready: 2000 },
                  { name: "Outdoor Tent — 10×10 ft",       total: 500,  ready: 0    },
                  { name: "LED Stage Light — 200W RGB",    total: 300,  ready: 0    },
                ].map((item) => {
                  const pct = item.total > 0 ? Math.round((item.ready / item.total) * 100) : 0;
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-gray-700 truncate pr-2">{item.name}</p>
                        <span className="text-xs font-bold text-gray-500 shrink-0">{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: pct === 100 ? "#138808" : pct > 0 ? "#E07B00" : "#E5E7EB",
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-gray-400">{item.ready.toLocaleString("en-IN")} / {item.total.toLocaleString("en-IN")} labels</p>
                        {item.ready > 0 && (
                          <button className="text-[10px] font-semibold text-saffron-600 flex items-center gap-1 hover:text-saffron-700">
                            <Download size={10} /> Download
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Pipeline */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-1">Delivery Pipeline</h2>
              <p className="text-xs text-gray-400 mb-4">Asset delivery tracking per order</p>

              <div className="space-y-4">
                {[
                  {
                    event: "Republic Day 2025",
                    stages: [
                      { label: "PO Issued",        done: true  },
                      { label: "Items Confirmed",   done: true  },
                      { label: "QR Labels Ready",   done: true  },
                      { label: "Delivery Confirmed",done: false },
                      { label: "Handover Verified", done: false },
                    ],
                  },
                  {
                    event: "National Sports Meet",
                    stages: [
                      { label: "PO Issued",        done: true  },
                      { label: "Items Confirmed",   done: false },
                      { label: "QR Labels Ready",   done: false },
                      { label: "Delivery Confirmed",done: false },
                      { label: "Handover Verified", done: false },
                    ],
                  },
                ].map((order) => {
                  const doneCount = order.stages.filter((s) => s.done).length;
                  const currentIdx = order.stages.findIndex((s) => !s.done);
                  return (
                    <div key={order.event} className="border border-border rounded-xl p-3">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-800 truncate pr-2">{order.event}</p>
                        <span className="text-[10px] font-bold text-saffron-600 shrink-0">{doneCount}/{order.stages.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {order.stages.map((stage, i) => (
                          <div key={stage.label} className="flex items-center gap-1 flex-1">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ${
                                stage.done ? "bg-green-500" : i === currentIdx ? "bg-saffron-400 animate-pulse" : "bg-gray-200"
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
                        {currentIdx >= 0 ? `Next: ${order.stages[currentIdx].label}` : "All stages complete"}
                      </p>
                    </div>
                  );
                })}

                <div className="mt-2">
                  <Link
                    href="/company/dashboard/orders"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-600 hover:text-saffron-700 transition-colors"
                  >
                    <Truck size={12} /> View All Deliveries <ChevronRight size={12} />
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
