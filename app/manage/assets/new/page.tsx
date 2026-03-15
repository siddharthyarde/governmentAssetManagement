"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  ArrowLeft, Package, CheckCircle2, AlertCircle, ChevronRight, RefreshCw,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

type Company = { id: string; legal_name: string };
type Product = { id: string; product_code: string; name: string; company_id: string };

const CATEGORIES = ["Furniture", "Electronics", "Appliances", "Infrastructure", "Textiles", "Stationery", "Equipment", "Vehicles", "Other"];
const STATUSES = [
  { value: "in_stock",             label: "In Stock / Warehouse" },
  { value: "deployed",             label: "At Event" },
  { value: "in_transit",           label: "In Transit" },
  { value: "pending_rating",       label: "Pending Rating" },
  { value: "redistributed",        label: "Redistributed" },
];

export default function ManageAssetsNewPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    product_id: "",
    company_id: "",
    quantity: "1",
    condition_notes: "",
    asset_status: "in_stock",
    location: "",
    purchase_price_paise: "",
    category: "Furniture",
    serial_number: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    const db = createClient();
    Promise.all([
      db.from("companies").select("id, legal_name").eq("status", "approved").order("legal_name"),
      db.from("products").select("id, product_code, name, company_id").eq("status", "approved").order("name"),
    ]).then(([{ data: cos }, { data: prods }]) => {
      setCompanies(cos ?? []);
      setProducts(prods ?? []);
      setFilteredProducts(prods ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (form.company_id) {
      setFilteredProducts(products.filter((p) => p.company_id === form.company_id));
      setForm((prev) => ({ ...prev, product_id: "" }));
    } else {
      setFilteredProducts(products);
    }
  }, [form.company_id, products]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    if (!form.product_id) {
      setError("Please select a product.");
      setStatus("error");
      return;
    }

    const db = createClient();
    const qty = parseInt(form.quantity, 10);
    if (isNaN(qty) || qty < 1) {
      setError("Quantity must be at least 1.");
      setStatus("error");
      return;
    }

    // Get company_id from the selected product
    const selectedProduct = products.find((p) => p.id === form.product_id);
    if (!selectedProduct) {
      setError("Selected product not found. Please reselect.");
      setStatus("error");
      return;
    }

    const instance_code = `GOI-MANUAL-${form.category.toUpperCase().slice(0, 4)}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999999)).padStart(8, "0")}`;
    const { error: insertErr } = await db.from("product_instances").insert({
      product_id:            form.product_id,
      company_id:            selectedProduct.company_id,
      instance_code,
      status:                form.asset_status as never,
      warehouse_location:    form.location || null,
      serial_number:         form.serial_number || null,
      purchase_price_paise:  form.purchase_price_paise ? parseInt(form.purchase_price_paise) * 100 : null,
    });

    if (insertErr) {
      setError(insertErr.message);
      setStatus("error");
      return;
    }

    // Log to audit
    await db.from("audit_logs").insert({
      action:      "asset.manual_register",
      entity_type: "product_instances",
      new_data:    { instance_code, product_id: form.product_id, status: form.asset_status, company_id: selectedProduct.company_id },
    }).catch(() => {});

    setStatus("success");
  }

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
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
          <Link href="/manage/assets" className="hover:text-gray-700 font-medium">Assets</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-semibold">Add New Asset</span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/manage/assets" className="p-2 rounded-lg border border-border hover:bg-surface text-gray-500">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add New Asset</h1>
            <p className="text-xs text-gray-400 mt-0.5">Manually register a product instance in the GAMS asset registry</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw size={22} className="text-saffron-500 animate-spin" />
          </div>
        ) : status === "success" ? (
          <div className="bg-white border border-green-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={30} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Asset Registered Successfully</h2>
            <p className="text-sm text-gray-500 mb-2">
              The asset has been added to the GAMS registry with status <strong>{form.asset_status.replace(/_/g, " ")}</strong>.
            </p>
            <p className="text-xs text-gray-400 mb-6">A QR code will be auto-generated after admin review.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/manage/assets" className="inline-flex items-center gap-2 bg-saffron-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-saffron-600 text-sm">
                <Package size={14} /> View Asset Registry
              </Link>
              <button
                onClick={() => { setStatus("idle"); setForm({ product_id: "", company_id: "", quantity: "1", condition_notes: "", asset_status: "in_stock", location: "", purchase_price_paise: "", category: "Furniture", serial_number: "" }); }}
                className="inline-flex items-center gap-2 border border-border text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:bg-surface text-sm"
              >
                Add Another Asset
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-6">
            {status === "error" && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Product selection */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-border">Product</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Filter by Company (optional)</label>
                  <select value={form.company_id} onChange={(e) => update("company_id", e.target.value)} className="input-field w-full">
                    <option value="">All Approved Companies</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.legal_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product *</label>
                  <select required value={form.product_id} onChange={(e) => update("product_id", e.target.value)} className="input-field w-full">
                    <option value="">Select a product</option>
                    {filteredProducts.map((p) => <option key={p.id} value={p.id}>{p.product_code} — {p.name}</option>)}
                  </select>
                  {filteredProducts.length === 0 && form.company_id && (
                    <p className="text-xs text-gray-400 mt-1">No approved products for this company.</p>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category *</label>
                    <select value={form.category} onChange={(e) => update("category", e.target.value)} className="input-field w-full">
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Quantity *</label>
                    <input required type="number" min="1" max="100000" value={form.quantity} onChange={(e) => update("quantity", e.target.value)}
                      className="input-field w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Asset details */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-border">Asset Details</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Initial Status *</label>
                    <select value={form.asset_status} onChange={(e) => update("asset_status", e.target.value)} className="input-field w-full">
                      {STATUSES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Current Location</label>
                    <input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Central Warehouse B, Delhi"
                      className="input-field w-full" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Serial Number / Batch Code</label>
                    <input value={form.serial_number} onChange={(e) => update("serial_number", e.target.value)} placeholder="e.g. SN-2024-00182"
                      className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Original Purchase Price (₹/unit)</label>
                    <input type="number" min="0" value={form.purchase_price_paise} onChange={(e) => update("purchase_price_paise", e.target.value)} placeholder="e.g. 2400"
                      className="input-field w-full" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Condition Notes</label>
                  <textarea rows={3} value={form.condition_notes} onChange={(e) => update("condition_notes", e.target.value)} placeholder="Describe current condition, any defects, usage history..."
                    className="input-field w-full resize-none" />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
              <strong>Note:</strong> After registration, an inspector must conduct a physical rating before the asset can be listed for redistribution or public sale. QR codes are generated post-approval.
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={status === "loading"} className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-60">
                {status === "loading" ? "Registering Asset..." : "Register Asset"}
              </button>
              <Link href="/manage/assets" className="border border-border text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-surface text-sm text-center">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
