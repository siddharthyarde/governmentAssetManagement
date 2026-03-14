"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Building2, User, Mail, Phone, MapPin, Bell, Lock,
  Eye, EyeOff, CheckCircle2, Save, Camera, X, Edit2,
  Smartphone, Trash2, Info, Shield, FileText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "institution" | "contact" | "notifications" | "security";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
      style={{ background: checked ? "#138808" : "#E5E7EB" }}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

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

const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white";
const readCls  = "w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-surface text-gray-500 cursor-not-allowed";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyerSettingsPage() {
  const [tab,      setTab]      = useState<Tab>("institution");
  const [saved,    setSaved]    = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [notif, setNotif] = useState({
    orderPlaced:    true,
    orderDelivered: true,
    paymentStatus:  true,
    newListings:    false,
    priceDrops:     true,
    approvalResult: true,
    weeklyReport:   false,
    appPush:        true,
    smsAlerts:      false,
  });

  const avatarRef = useRef<HTMLInputElement>(null);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "institution",   label: "Institution",    icon: Building2 },
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
          <Link href="/buyer/dashboard" className="text-lg font-black text-gray-900">GAMS</Link>
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

        {/* Sidebar */}
        <div className="md:w-52 shrink-0 flex flex-col gap-2">
          <div className="bg-white border border-border rounded-2xl p-5 flex flex-col items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white" style={{ background: "#138808" }}>R</div>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { /* avatar upload: wire to storage when Supabase is available */ } }} />
              <button type="button" title="Change profile picture" onClick={() => avatarRef.current?.click()} className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-surface">
                <Camera size={11} className="text-gray-500" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-gray-900">Rajya Sabha</p>
              <p className="text-[10px] text-gray-400">Secretariat, New Delhi</p>
            </div>
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Verified Institution</span>
          </div>

          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${tab === id ? "text-white" : "text-gray-600 hover:bg-white hover:border hover:border-border"}`}
              style={tab === id ? { background: "#138808" } : {}}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-4">

          {/* ── Institution tab ── */}
          {tab === "institution" && (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <Section title="Institution Details" subtitle="This information is verified and shown to suppliers.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Institution Name" required>
                    <input className={readCls} defaultValue="Rajya Sabha Secretariat" readOnly />
                  </Field>
                  <Field label="Institution Type">
                    <input className={readCls} defaultValue="Constitutional Body" readOnly />
                  </Field>
                  <Field label="Ministry / Department" required>
                    <input className={inputCls} defaultValue="Parliament of India" />
                  </Field>
                  <Field label="PFMS Code">
                    <input className={readCls} defaultValue="PFMS-RS-2019-0041" readOnly />
                  </Field>
                  <Field label="State">
                    <input className={readCls} defaultValue="Delhi" readOnly />
                  </Field>
                  <Field label="Year Established">
                    <input className={readCls} defaultValue="1919" readOnly />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Institution Description">
                      <textarea className={`${inputCls} resize-none`} rows={3} defaultValue="The Rajya Sabha Secretariat provides administrative support to the Upper House of Parliament of India. Procurement is governed by GFR 2017 and Ministry of Finance guidelines." />
                    </Field>
                  </div>
                </div>
              </Section>

              <Section title="Office Address" subtitle="Used for delivery and correspondence.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Field label="Street Address" required>
                      <input className={inputCls} defaultValue="Parliament House Annexe, Sansad Marg" />
                    </Field>
                  </div>
                  <Field label="City" required>
                    <input className={inputCls} defaultValue="New Delhi" />
                  </Field>
                  <Field label="State">
                    <input className={readCls} defaultValue="Delhi" readOnly />
                  </Field>
                  <Field label="PIN Code" required>
                    <input className={inputCls} defaultValue="110001" />
                  </Field>
                  <Field label="Country">
                    <input className={readCls} defaultValue="India" readOnly />
                  </Field>
                </div>
              </Section>

              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#138808" }}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          )}

          {/* ── Contact tab ── */}
          {tab === "contact" && (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <Section title="Procurement Officer" subtitle="The authorised signatory for all GAMS orders.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name" required>
                    <input className={inputCls} defaultValue="Shri Mohit Agarwal" />
                  </Field>
                  <Field label="Designation">
                    <input className={inputCls} defaultValue="Joint Secretary (Administration)" />
                  </Field>
                  <Field label="Official Email" required>
                    <input type="email" className={inputCls} defaultValue="mohit.agarwal@rajyasabha.nic.in" />
                  </Field>
                  <Field label="Office Phone" required>
                    <input type="tel" className={inputCls} defaultValue="+91 11 2302 4840" />
                  </Field>
                  <Field label="Mobile">
                    <input type="tel" className={inputCls} defaultValue="+91 98118 45670" />
                  </Field>
                </div>
              </Section>

              <Section title="Stores / Receiving Officer" subtitle="Who physically receives deliveries at your location.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <input className={inputCls} defaultValue="Smt. Priya Nair" />
                  </Field>
                  <Field label="Designation">
                    <input className={inputCls} defaultValue="Store Keeper (Grade A)" />
                  </Field>
                  <Field label="Contact Number">
                    <input type="tel" className={inputCls} defaultValue="+91 11 2302 4851" />
                  </Field>
                  <Field label="Email">
                    <input type="email" className={inputCls} defaultValue="stores@rajyasabha.nic.in" />
                  </Field>
                </div>
              </Section>

              <Section title="Payment / Finance Contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <input className={inputCls} defaultValue="Sh. Ramesh Gupta" />
                  </Field>
                  <Field label="Designation">
                    <input className={inputCls} defaultValue="Finance Officer" />
                  </Field>
                  <Field label="Email">
                    <input type="email" className={inputCls} defaultValue="finance@rajyasabha.nic.in" />
                  </Field>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                  <Info size={12} className="shrink-0" />
                  All payment confirmations are sent to this email.
                </div>
              </Section>

              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#138808" }}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          )}

          {/* ── Notifications tab ── */}
          {tab === "notifications" && (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <Section title="Order & Procurement" subtitle="Sent to the procurement officer's email.">
                <div className="flex flex-col divide-y divide-border">
                  {[
                    { key: "orderPlaced",    label: "Order Confirmation",           sub: "When your order is successfully placed"          },
                    { key: "orderDelivered", label: "Delivery Notification",        sub: "When goods are delivered to your institution"     },
                    { key: "paymentStatus",  label: "Payment Status Updates",       sub: "When payment is processed or pending action"      },
                    { key: "approvalResult", label: "Approval Status",              sub: "When your institution's verification is updated"  },
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

              <Section title="Marketplace Alerts">
                <div className="flex flex-col divide-y divide-border">
                  {[
                    { key: "newListings",  label: "New Product Listings",         sub: "When new assets matching your saved searches appear" },
                    { key: "priceDrops",   label: "Price / Discount Updates",     sub: "When prices drop on bookmarked products"             },
                    { key: "weeklyReport", label: "Weekly Savings Report",        sub: "Summary of savings vs market rate from your orders"   },
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

              <Section title="Push & SMS">
                <div className="flex flex-col divide-y divide-border">
                  {[
                    { key: "appPush",   label: "In-app Notifications",    sub: "Alerts in the GAMS buyer portal"              },
                    { key: "smsAlerts", label: "SMS Alerts",              sub: "Critical updates to registered mobile number"  },
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
                <button type="submit" className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#138808" }}>
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

              <Section title="Two-Factor Authentication">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                      <Smartphone size={16} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Authenticator App (TOTP)</p>
                      <p className="text-xs text-gray-400">Not yet configured</p>
                    </div>
                  </div>
                  <button type="button" className="text-xs font-bold border border-border rounded-xl px-3 py-2 hover:bg-surface">Set Up</button>
                </div>
              </Section>

              <Section title="Active Sessions">
                <div className="flex flex-col gap-3">
                  {[
                    { device: "Chrome on Windows 10",  location: "New Delhi, Delhi",    time: "Current session", current: true  },
                    { device: "Chrome on Android",     location: "New Delhi, Delhi",    time: "1 day ago",       current: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-surface border border-border rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          {s.device}
                          {s.current && <span className="text-[9px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">THIS DEVICE</span>}
                        </p>
                        <p className="text-xs text-gray-400">{s.location} · {s.time}</p>
                      </div>
                      {!s.current && <button type="button" className="text-xs font-bold text-red-600 hover:underline">Revoke</button>}
                    </div>
                  ))}
                </div>
              </Section>

              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#138808" }}>
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
