"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  ArrowLeft, Users, CheckCircle2, AlertCircle, Eye, EyeOff, ChevronRight,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

const ROLES = [
  { value: "super_admin", label: "Super Admin", desc: "Full access to all portals and settings" },
  { value: "gov_admin", label: "Ministry Admin", desc: "Manage ministry-level assets and events" },
  { value: "event_manager", label: "Event Manager", desc: "Event creation and asset assignment only" },
  { value: "inspector", label: "Inspector", desc: "Asset condition rating and defect reporting" },
  { value: "volunteer", label: "Volunteer", desc: "QR scanning at events" },
  { value: "warehouse_officer", label: "Warehouse Officer", desc: "Inventory and stock management" },
  { value: "auditor", label: "Auditor / Viewer", desc: "Read-only access, no data modification" },
];

const MINISTRIES = [
  "Ministry of Finance",
  "Ministry of Home Affairs",
  "Ministry of Defence",
  "Ministry of External Affairs",
  "Ministry of Commerce and Industry",
  "Ministry of Education",
  "Ministry of Health and Family Welfare",
  "Ministry of Environment, Forest and Climate Change",
  "Ministry of Railways",
  "Ministry of Road Transport and Highways",
  "Ministry of Agriculture and Farmers' Welfare",
  "Ministry of Labour and Employment",
  "Ministry of Women and Child Development",
  "Ministry of Culture",
  "Other",
];

export default function ManageUsersNewPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "auditor",
    ministry: "Ministry of Finance",
    department: "",
    employee_id: "",
    phone: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const db = createClient();

    // Create auth user via admin-style sign-up then insert profile
    // Note: In production this should be a server action using supabase admin SDK
    // For now we create via regular signup and mark the profile
    const { data, error: signUpErr } = await db.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          role: form.role,
        },
      },
    });

    if (signUpErr) {
      setError(signUpErr.message);
      setStatus("error");
      return;
    }

    if (data.user) {
      const { error: profileErr } = await db.from("user_profiles").upsert({
        id: data.user.id,
        full_name: form.full_name,
        email: form.email,
        role: form.role as "super_admin" | "gov_admin" | "event_manager" | "inspector" | "volunteer" | "warehouse_officer" | "auditor",
        gov_level: "central" as const,
        ministry: form.ministry,
        department: form.department || null,
        employee_id: form.employee_id || null,
        is_active: true,
      });
      if (profileErr) {
        setError(profileErr.message);
        setStatus("error");
        return;
      }
    }

    setStatus("success");
  }

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Header */}
      <div className="tiranga-accent" />
      <header className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4">
        <Link href="/manage" className="flex items-center gap-2.5">
          <AshokaChakra size={28} />
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">GOI · GAMS</p>
            <p className="text-sm font-bold text-gray-900">Management Portal</p>
          </div>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-2">
          <Link href="/manage" className="hover:text-gray-700 font-medium">Dashboard</Link>
          <ChevronRight size={12} />
          <Link href="/manage/users" className="hover:text-gray-700 font-medium">Users</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-semibold">Add New User</span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/manage/users" className="p-2 rounded-lg border border-border hover:bg-surface text-gray-500">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add New User</h1>
            <p className="text-xs text-gray-400 mt-0.5">Create a government staff account for GAMS management portal</p>
          </div>
        </div>

        {status === "success" ? (
          <div className="bg-white border border-green-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={30} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">User Created Successfully</h2>
            <p className="text-sm text-gray-500 mb-1">
              <strong>{form.full_name}</strong> ({form.email}) has been registered.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              They will receive a confirmation email. They can sign in at <code>/manage/login</code>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/manage/users" className="inline-flex items-center gap-2 bg-saffron-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-saffron-600 text-sm">
                <Users size={14} /> View All Users
              </Link>
              <button
                onClick={() => { setStatus("idle"); setForm({ full_name: "", email: "", password: "", role: "viewer", ministry: "Ministry of Finance", department: "", employee_id: "", phone: "" }); }}
                className="inline-flex items-center gap-2 border border-border text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:bg-surface text-sm"
              >
                Add Another User
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-5">
            {status === "error" && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Personal Info */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-border">
                Personal Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="e.g. Priya Sharma"
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Employee ID</label>
                  <input value={form.employee_id} onChange={(e) => update("employee_id", e.target.value)} placeholder="e.g. MoF-2024-00123"
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210"
                    className="input-field w-full" />
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-border">
                Account Credentials
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Official Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="officer@ministry.gov.in"
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Temporary Password *</label>
                  <div className="relative">
                    <input required type={showPassword ? "text" : "password"} minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min. 8 characters"
                      className="input-field w-full pr-9" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Role & Ministry */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-border">
                Jurisdiction & Role
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ministry / Organisation *</label>
                  <select value={form.ministry} onChange={(e) => update("ministry", e.target.value)} className="input-field w-full">
                    {MINISTRIES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Department / Division</label>
                  <input value={form.department} onChange={(e) => update("department", e.target.value)} placeholder="e.g. Asset Management Cell, DEA"
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Role *</label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {ROLES.map(({ value, label, desc }) => (
                      <label key={value} className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${form.role === value ? "border-saffron-400 bg-saffron-50" : "border-border hover:bg-surface"}`}>
                        <input type="radio" name="role" value={value} checked={form.role === value} onChange={() => update("role", value)} className="mt-0.5 accent-saffron-600" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">{label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={status === "loading"}
                className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-60">
                {status === "loading" ? "Creating Account..." : "Create User Account"}
              </button>
              <Link href="/manage/users" className="border border-border text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-surface text-sm text-center">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
