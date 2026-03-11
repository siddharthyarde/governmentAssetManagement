"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Building2, User, Mail, Phone, MapPin, Globe, Shield,
  Bell, Lock, Eye, EyeOff, CheckCircle2, AlertCircle,
  Save, Camera, Tag, Edit2, X, ChevronRight, Smartphone,
  IndianRupee, Package, FileText, Trash2, Info,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "company" | "contact" | "notifications" | "security";

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? "bg-saffron-500" : "bg-gray-200"}`}
      style={checked ? { background: "#E07B00" } : {}}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500 normal-case font-normal">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400 bg-white";
const readCls  = "w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-surface text-gray-500 cursor-not-allowed";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompanySettingsPage() {
  const avatarRef = useRef<HTMLInputElement>(null);
  const [tab,  setTab]  = useState<Tab>("company");
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Notification toggles
  const [notif, setNotif] = useState({
    newOrder:       true,
    orderStatus:    true,
    paymentReceived:true,
    qrScan:         false,
    approvalResult: true,
    weeklyReport:   false,
    productExpiry:  true,
    appPush:        true,
    smsAlerts:      false,
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "company",       label: "Company Info",   icon: Building2 },
    { id: "contact",       label: "Contact",        icon: User      },
    { id: "notifications", label: "Notifications",  icon: Bell      },
    { id: "security",      label: "Security",       icon: Lock      },
  ];

  return (
    <div className="min-h-dvh bg-surface">
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="text-lg font-black text-gray-900">GAMS</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-sm font-bold text-gray-900">Settings</h1>
          {saved && (
            <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
              <CheckCircle2 size={12} /> Saved successfully
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-5">

        {/* Sidebar nav */}
        <div className="md:w-52 shrink-0 flex flex-col gap-2">
          {/* Avatar */}
          <div className="bg-white border border-border rounded-2xl p-5 flex flex-col items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white" style={{ background: "#E07B00" }}>G</div>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { /* avatar upload: wire to storage when Supabase is available */ } }} />
              <button type="button" title="Change profile picture" onClick={() => avatarRef.current?.click()} className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-surface">
                <Camera size={11} className="text-gray-500" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-gray-900">Godrej Interio</p>
              <p className="text-[10px] text-gray-400">GSTIN: 27AABCG1234F1ZX</p>
            </div>
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Verified Supplier</span>
          </div>

          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${tab === id ? "text-white" : "text-gray-600 hover:bg-white hover:border hover:border-border"}`}
              style={tab === id ? { background: "#E07B00" } : {}}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-4">

          {/* ── Company Info tab ── */}
          {tab === "company" && (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <Section title="Company Details" subtitle="This information appears on your public GAMS seller profile.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Company Legal Name" required>
                    <input className={inputCls} defaultValue="Godrej & Boyce Mfg Co — Interio Division" />
                  </Field>
                  <Field label="Trade Name / Brand">
                    <input className={inputCls} defaultValue="Godrej Interio" />
                  </Field>
                  <Field label="GSTIN" required>
                    <input className={readCls} defaultValue="27AABCG1234F1ZX" readOnly />
                  </Field>
                  <Field label="PAN">
                    <input className={readCls} defaultValue="AABCG1234F" readOnly />
                  </Field>
                  <Field label="Company Type">
                    <select className={inputCls}>
                      <option>Public Limited Company</option>
                      <option>Private Limited Company</option>
                      <option>LLP</option>
                      <option>Partnership</option>
                      <option>Proprietorship</option>
                    </select>
                  </Field>
                  <Field label="Year of Establishment">
                    <input type="number" className={inputCls} defaultValue="1923" min="1800" max="2026" />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Company Description (shown on marketplace)">
                      <textarea className={`${inputCls} resize-none`} rows={3} defaultValue="India's leading furniture manufacturer and interior solutions provider. Trusted by government institutions since 1923 for lasting, ergonomic, and Swachh Bharat compliant office furniture." />
                    </Field>
                  </div>
                  <Field label="Corporate Website">
                    <input type="url" className={inputCls} defaultValue="https://www.godrejinterio.com" />
                  </Field>
                  <Field label="GeM Seller ID">
                    <input className={inputCls} defaultValue="GEM-SEL-2019-48127" />
                  </Field>
                </div>
              </Section>

              <Section title="Registered Address" subtitle="Must match your GSTIN registered address.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Field label="Street Address" required>
                      <input className={inputCls} defaultValue="Pirojshanagar, Eastern Express Highway" />
                    </Field>
                  </div>
                  <Field label="City" required>
                    <input className={inputCls} defaultValue="Mumbai" />
                  </Field>
                  <Field label="State" required>
                    <select className={inputCls}>
                      {["Maharashtra","Delhi","Karnataka","Tamil Nadu","Gujarat","Uttar Pradesh"].map(s => <option key={s} selected={s==="Maharashtra"}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="PIN Code" required>
                    <input className={inputCls} defaultValue="400079" />
                  </Field>
                  <Field label="Country">
                    <input className={readCls} defaultValue="India" readOnly />
                  </Field>
                </div>
              </Section>

              <Section title="Product Categories" subtitle="Categories your company primarily sells. Used for marketplace search.">
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Furniture","Office Chairs","Workstations","Storage Solutions","Outdoor Seating"].map((c) => (
                    <span key={c} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700">
                      {c} <button type="button" className="text-saffron-400 hover:text-saffron-600"><X size={10} /></button>
                    </span>
                  ))}
                  <button type="button" className="flex items-center gap-1 text-xs font-semibold text-gray-400 border border-dashed border-border px-3 py-1.5 rounded-full hover:border-saffron-300">
                    <Tag size={11} /> Add category
                  </button>
                </div>
              </Section>

              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#E07B00" }}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          )}

          {/* ── Contact tab ── */}
          {tab === "contact" && (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <Section title="Primary Contact Person" subtitle="This person will receive all GAMS communications.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name" required>
                    <input className={inputCls} defaultValue="Rajesh Kumar Sharma" />
                  </Field>
                  <Field label="Designation">
                    <input className={inputCls} defaultValue="Head of Government Sales" />
                  </Field>
                  <Field label="Official Email" required>
                    <input type="email" className={inputCls} defaultValue="rajesh.sharma@godrejinterio.com" />
                  </Field>
                  <Field label="Mobile Number" required>
                    <input type="tel" className={inputCls} defaultValue="+91 98765 43210" />
                  </Field>
                  <Field label="Alternate Phone">
                    <input type="tel" className={inputCls} defaultValue="+91 22 6796 1000" />
                  </Field>
                  <Field label="WhatsApp Number">
                    <input type="tel" className={inputCls} defaultValue="+91 98765 43210" />
                  </Field>
                </div>
              </Section>

              <Section title="Operations Contact (Logistics & Dispatch)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <input className={inputCls} defaultValue="Anita Verma" />
                  </Field>
                  <Field label="Designation">
                    <input className={inputCls} defaultValue="Dispatch Manager" />
                  </Field>
                  <Field label="Email">
                    <input type="email" className={inputCls} defaultValue="dispatch@godrejinterio.com" />
                  </Field>
                  <Field label="Phone">
                    <input type="tel" className={inputCls} defaultValue="+91 98761 00234" />
                  </Field>
                </div>
              </Section>

              <Section title="Bank Account (for payment settlement)" subtitle="All GAMS payments will be credited to this account. Changes require verification.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Account Holder Name">
                    <input className={readCls} defaultValue="Godrej & Boyce Mfg Co Ltd" readOnly />
                  </Field>
                  <Field label="Bank Name">
                    <input className={readCls} defaultValue="State Bank of India" readOnly />
                  </Field>
                  <Field label="Account Number">
                    <input className={readCls} defaultValue="•••• •••• 4821" readOnly />
                  </Field>
                  <Field label="IFSC Code">
                    <input className={readCls} defaultValue="SBIN0004823" readOnly />
                  </Field>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                  <Info size={12} className="shrink-0" />
                  To update bank details, email <strong>support@gams.gov.in</strong> with your authorisation letter.
                </div>
              </Section>

              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#E07B00" }}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          )}

          {/* ── Notifications tab ── */}
          {tab === "notifications" && (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <Section title="Email Notifications" subtitle="Sent to your registered company email.">
                <div className="flex flex-col divide-y divide-border">
                  {[
                    { key: "newOrder",        label: "New Order Received",           sub: "When an institution places an order"               },
                    { key: "orderStatus",     label: "Order Status Updates",         sub: "Payment confirmed, dispatched, delivered"           },
                    { key: "paymentReceived", label: "Payment Received",             sub: "When GAMS releases payment to your account"         },
                    { key: "approvalResult",  label: "Approval Decisions",           sub: "When your company or product is approved/rejected"  },
                    { key: "productExpiry",   label: "Product Listing Expiry",       sub: "7 days before a listing expires"                   },
                    { key: "weeklyReport",    label: "Weekly Performance Report",    sub: "Orders summary, revenue, top-viewed products"       },
                  ].map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{label}</p>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                      <Toggle checked={notif[key as keyof typeof notif]} onChange={(v) => setNotif((n) => ({ ...n, [key]: v }))} />
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Push & SMS" subtitle="Real-time alerts to your device.">
                <div className="flex flex-col divide-y divide-border">
                  {[
                    { key: "appPush",   label: "In-app Push Notifications",  sub: "Order and approval alerts in the browser"    },
                    { key: "qrScan",    label: "QR Code Scan Alerts",         sub: "Notify when your product's QR is scanned"   },
                    { key: "smsAlerts", label: "SMS Alerts",                  sub: "Order confirmations via SMS (+91 98765...)"  },
                  ].map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{label}</p>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                      <Toggle checked={notif[key as keyof typeof notif]} onChange={(v) => setNotif((n) => ({ ...n, [key]: v }))} />
                    </div>
                  ))}
                </div>
              </Section>

              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#E07B00" }}>
                  <Save size={14} /> Save Preferences
                </button>
              </div>
            </form>
          )}

          {/* ── Security tab ── */}
          {tab === "security" && (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <Section title="Change Password">
                <div className="flex flex-col gap-4">
                  <Field label="Current Password" required>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} className={`${inputCls} pr-10`} placeholder="Enter current password" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </Field>
                  <Field label="New Password" required>
                    <input type="password" className={inputCls} placeholder="Min 8 characters" />
                  </Field>
                  <Field label="Confirm New Password" required>
                    <input type="password" className={inputCls} placeholder="Repeat new password" />
                  </Field>
                </div>
              </Section>

              <Section title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account.">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                      <Smartphone size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Authenticator App (TOTP)</p>
                      <p className="text-xs text-gray-400">Google Authenticator, Authy</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Enabled</span>
                </div>
              </Section>

              <Section title="Login Sessions" subtitle="Active sessions across all devices.">
                <div className="flex flex-col gap-3">
                  {[
                    { device: "Chrome on Windows 11",       location: "Mumbai, Maharashtra",  time: "Current session",      current: true  },
                    { device: "Safari on iPhone 16 Pro",    location: "New Delhi, Delhi",     time: "2 days ago",           current: false },
                    { device: "Chrome on MacBook Pro",      location: "Pune, Maharashtra",    time: "5 days ago",           current: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-surface border border-border rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          {s.device}
                          {s.current && <span className="text-[9px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">THIS DEVICE</span>}
                        </p>
                        <p className="text-xs text-gray-400">{s.location} · {s.time}</p>
                      </div>
                      {!s.current && (
                        <button type="button" className="text-xs font-bold text-red-600 hover:underline">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Danger Zone">
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-red-700">Delete Company Account</p>
                    <p className="text-xs text-red-500">This will permanently deactivate your account and all listings. Cannot be undone.</p>
                  </div>
                  <button type="button" className="flex items-center gap-1.5 text-xs font-bold text-red-600 border border-red-300 px-3 py-2 rounded-xl hover:bg-red-100">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </Section>

              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#E07B00" }}>
                  <Save size={14} /> Save Security Settings
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
