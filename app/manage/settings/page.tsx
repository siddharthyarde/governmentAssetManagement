"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings, LayoutDashboard, Bell, Package, FileText,
  CheckCircle2, BarChart3, Clock, Save, User, Shield,
  Mail, Phone, Globe, Lock, ToggleLeft, ToggleRight,
  Key, AlertTriangle, Palette,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/manage",              icon: LayoutDashboard, label: "Dashboard" },
  { href: "/manage/notifications",icon: Bell,            label: "Notifications" },
  { href: "/manage/assets",       icon: Package,         label: "Asset Registry" },
  { href: "/manage/analytics",    icon: BarChart3,       label: "Analytics" },
  { href: "/manage/reports",      icon: FileText,        label: "Reports" },
  { href: "/manage/audit",        icon: Clock,           label: "Audit Log" },
  { href: "/manage/approvals",    icon: CheckCircle2,    label: "Approvals" },
  { href: "/manage/settings",     icon: Settings,        label: "Settings" },
];

const TABS = ["General", "Notifications", "Roles", "Security", "API"] as const;
type Tab = typeof TABS[number];

interface Toggle { label: string; desc: string; value: boolean; }

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const [saved, setSaved] = useState(false);

  // General
  const [portalName, setPortalName] = useState("GAMS Manage Portal");
  const [ministry, setMinistry] = useState("Ministry of Finance");
  const [contactEmail, setContactEmail] = useState("gams-alerts@ministry.gov.in");
  const [contactPhone, setContactPhone] = useState("+91 11 2345 6789");
  const [portalUrl, setPortalUrl] = useState("https://gams.gov.in");

  // Notifications
  const [notifs, setNotifs] = useState<Toggle[]>([
    { label: "Email Alerts", desc: "Send email on approvals, defects, and critical events", value: true },
    { label: "SMS Alerts", desc: "Send SMS for urgent redistribution and security events", value: false },
    { label: "In-App Notifications", desc: "Real-time notifications inside the portal", value: true },
    { label: "Weekly Digest", desc: "Weekly summary email every Monday at 9:00 AM", value: true },
    { label: "Defect Alerts", desc: "Immediate alert when a critical defect is reported", value: true },
    { label: "Redistribution Updates", desc: "Notify on approval, transit and delivery status changes", value: false },
  ]);

  // Security
  const [mfaRequired, setMfaRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [passwordExpiry, setPasswordExpiry] = useState("90");
  const [ipWhitelist, setIpWhitelist] = useState("10.0.0.0/24\n203.45.0.0/16");

  function toggleNotif(i: number) {
    setNotifs((prev) => prev.map((n, idx) => idx === i ? { ...n, value: !n.value } : n));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/manage/settings" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}>
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

        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-gray-900">Settings</h1>
            <p className="text-xs text-gray-400">System configuration, roles, notifications and security</p>
          </div>
          <button onClick={save} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${saved ? "bg-green-600 text-white" : "bg-saffron-500 text-white hover:bg-saffron-600"}`}>
            {saved ? <><CheckCircle2 size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
          </button>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-5">
          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-border rounded-2xl p-1 w-fit">
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${activeTab === t ? "bg-saffron-500 text-white" : "text-gray-600 hover:bg-surface"}`}>{t}</button>
            ))}
          </div>

          {activeTab === "General" && (
            <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-5 max-w-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={16} className="text-saffron-500" />
                <h2 className="text-sm font-black text-gray-900">Portal Settings</h2>
              </div>
              {[
                { label: "Portal Name", value: portalName, set: setPortalName, icon: Palette },
                { label: "Ministry / Department", value: ministry, set: setMinistry, icon: Shield },
                { label: "Contact Email", value: contactEmail, set: setContactEmail, icon: Mail },
                { label: "Contact Phone", value: contactPhone, set: setContactPhone, icon: Phone },
                { label: "Portal URL", value: portalUrl, set: setPortalUrl, icon: Globe },
              ].map(({ label, value, set, icon: Icon }) => (
                <div key={label}>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    <Icon size={11} /> {label}
                  </label>
                  <input value={value} onChange={(e) => set(e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-200 bg-surface" />
                </div>
              ))}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-2">
                <AlertTriangle size={13} className="text-yellow-600 mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-700">Changes to portal name and URL take effect after the next deployment cycle.</p>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4 max-w-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Bell size={16} className="text-saffron-500" />
                <h2 className="text-sm font-black text-gray-900">Notification Preferences</h2>
              </div>
              {notifs.map((n, i) => (
                <div key={n.label} className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{n.label}</p>
                    <p className="text-[11px] text-gray-400">{n.desc}</p>
                  </div>
                  <button onClick={() => toggleNotif(i)} className="shrink-0">
                    {n.value
                      ? <ToggleRight size={28} className="text-green-500" />
                      : <ToggleLeft size={28} className="text-gray-300" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Roles" && (
            <div className="bg-white border border-border rounded-2xl p-6 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <User size={16} className="text-saffron-500" />
                <h2 className="text-sm font-black text-gray-900">System Roles</h2>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { role: "Super Admin", desc: "Full system access — all modules, exports, user management", count: 2, cls: "bg-red-50 text-red-700" },
                  { role: "Asset Manager", desc: "Manage assets, warehouses, QR scans, defect reporting", count: 5, cls: "bg-saffron-50 text-saffron-700" },
                  { role: "Event Coordinator", desc: "Create events, assign assets, manage event-assets", count: 8, cls: "bg-purple-50 text-purple-700" },
                  { role: "Warehouse Manager", desc: "View and manage warehouse stock, inbound/outbound", count: 6, cls: "bg-blue-50 text-blue-700" },
                  { role: "Logistics Officer", desc: "Handle redistribution, transit updates, delivery confirmation", count: 4, cls: "bg-green-50 text-green-700" },
                  { role: "Viewer", desc: "Read-only access to dashboards and reports", count: 12, cls: "bg-gray-50 text-gray-700" },
                ].map(({ role, desc, count, cls }) => (
                  <div key={role} className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${cls}`}>{role}</span>
                        <span className="text-[10px] text-gray-400">{count} users</span>
                      </div>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <button className="text-xs font-bold text-saffron-600 px-3 py-1.5 rounded-xl hover:bg-saffron-50">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-5 max-w-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Lock size={16} className="text-saffron-500" />
                <h2 className="text-sm font-black text-gray-900">Security Settings</h2>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-bold text-gray-800">Require MFA for Admin Accounts</p>
                  <p className="text-[11px] text-gray-400">Mandatory TOTP/OTP for Super Admin and Asset Manager roles</p>
                </div>
                <button onClick={() => setMfaRequired(!mfaRequired)}>
                  {mfaRequired ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-300" />}
                </button>
              </div>
              {[
                { label: "Session Timeout (minutes)", value: sessionTimeout, set: setSessionTimeout },
                { label: "Password Expiry (days)", value: passwordExpiry, set: setPasswordExpiry },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">{label}</label>
                  <input type="number" value={value} onChange={(e) => set(e.target.value)} className="w-48 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-saffron-400 bg-surface" />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">IP Allowlist (CIDR, one per line)</label>
                <textarea value={ipWhitelist} onChange={(e) => setIpWhitelist(e.target.value)} rows={4} className="w-full border border-border rounded-xl px-3 py-2.5 text-xs font-mono outline-none focus:border-saffron-400 bg-surface resize-none" />
                <p className="text-[10px] text-gray-400 mt-1">Only IPs in this list can access the admin portal.</p>
              </div>
            </div>
          )}

          {activeTab === "API" && (
            <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-5 max-w-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Key size={16} className="text-saffron-500" />
                <h2 className="text-sm font-black text-gray-900">API Configuration</h2>
              </div>
              {[
                { label: "Production API Key", value: "gams_prod_•••••••••••••••••K7Xm", desc: "Used by company and buyer portals. Rotate every 90 days." },
                { label: "Webhook Secret", value: "whsec_•••••••••••••••••3Rqz", desc: "Validates incoming webhook payloads from integrated systems." },
                { label: "QR Verification Token", value: "qr_•••••••••••••••••9Wnb", desc: "Used by the mobile scanner app to authenticate scan events." },
              ].map(({ label, value, desc }) => (
                <div key={label} className="py-3 border-b border-border last:border-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-xs font-mono text-gray-700">{value}</code>
                    <button className="text-xs font-bold text-saffron-600 px-3 py-2 rounded-xl hover:bg-saffron-50 border border-saffron-200">Rotate</button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{desc}</p>
                </div>
              ))}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2">
                <AlertTriangle size={13} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">API keys are masked for security. Click Rotate to generate a new key — current key is invalidated immediately.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
