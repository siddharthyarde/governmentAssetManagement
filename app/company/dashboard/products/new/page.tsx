"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { submitProduct } from "../../../actions";
import {
  ArrowLeft,
  Package,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  X,
  Layers,
  IndianRupee,
  Info,
  HelpCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  qty: string;
  unitPrice: string;
  hsn: string;
  brand: string;
  model: string;
  specs: string;
  warrantyMonths: string;
  countryOfOrigin: string;
  makeInIndia: boolean;
  gemRegistered: boolean;
  gemId: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: Record<string, string[]> = {
  Furniture:      ["Seating", "Tables", "Storage", "Stage & Podium", "Other"],
  Electronics:    ["Audio Equipment", "Lighting & Stage", "Display & Projection", "Computers & Peripherals", "Other"],
  Infrastructure: ["Tents & Canopies", "Stage & Flooring", "Fencing & Barricades", "Signage & Displays", "Other"],
  Safety:         ["Crowd Management", "First Aid", "Fire Safety", "PPE", "Other"],
  Electrical:     ["Generators", "Cables & Distribution", "UPS & Inverters", "Switches & Panels", "Other"],
  Appliances:     ["Cooling", "Heating", "Kitchen Equipment", "Water Dispensers", "Other"],
  Miscellaneous:  ["Stationery", "Hospitality", "Sports & Recreation", "Other"],
};

const COUNTRIES = ["India", "China", "Germany", "Japan", "USA", "South Korea", "Other"];

// ─── Field helpers ────────────────────────────────────────────────────────────

function Label({ children, required, tooltip }: { children: React.ReactNode; required?: boolean; tooltip?: string }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-500">*</span>}
      {tooltip && (
        <span className="relative group">
          <HelpCircle size={13} className="text-gray-400 cursor-help" />
          <span className="hidden group-hover:block absolute bottom-full left-0 mb-1 w-52 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-10 shadow-lg">
            {tooltip}
          </span>
        </span>
      )}
    </label>
  );
}

function Input({
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400 bg-white placeholder:text-gray-300 disabled:bg-surface disabled:text-gray-400"
      {...props}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400 bg-white placeholder:text-gray-300 resize-none"
      {...props}
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400 bg-white text-gray-900"
      {...props}
    >
      {children}
    </select>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewProductPage() {
  const [form, setForm] = useState<FormData>({
    name: "", category: "", subcategory: "", description: "",
    qty: "", unitPrice: "", hsn: "", brand: "", model: "", specs: "",
    warrantyMonths: "", countryOfOrigin: "India",
    makeInIndia: false, gemRegistered: false, gemId: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const set = (key: keyof FormData, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  const subcategories = form.category ? CATEGORIES[form.category] ?? [] : [];

  const isTrackedIndividually = form.unitPrice !== "" && Number(form.unitPrice) >= 5000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    const result = await submitProduct(form);
    setSubmitting(false);
    if ("error" in result) {
      setSubmitError(result.error);
      return;
    }
    setSubmitted(true);
    router.refresh();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/") || f.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...dropped].slice(0, 5));
  };

  if (submitted) {
    return (
      <div className="min-h-dvh bg-surface flex items-center justify-center p-6">
        <div className="bg-white border border-border rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Submitted!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your product listing has been submitted to the GAMS admin team for approval. You&apos;ll be notified within
            3–5 working days. QR codes will be generated automatically upon approval.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/company/dashboard/products" className="inline-flex items-center justify-center gap-2 text-sm font-bold text-white py-2.5 rounded-xl" style={{ background: "#E07B00" }}>
              <Package size={15} /> Back to My Products
            </Link>
            <button onClick={() => setSubmitted(false)} className="text-sm font-semibold text-saffron-600 hover:text-saffron-700">
              Submit Another Product
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface">
      {/* Tiranga bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
          <Link href="/company/dashboard/products" className="p-2 rounded-xl border border-border hover:bg-surface transition-colors text-gray-400 hover:text-gray-700">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Add New Product Listing</h1>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <Link href="/company/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight size={10} />
              <Link href="/company/dashboard/products" className="hover:text-gray-700">Products</Link>
              <ChevronRight size={10} />
              <span>New Listing</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
          <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700">
            All products must match an existing Government Purchase Order. Submissions without a valid PO will be rejected.
            Items priced at <strong>₹5,000 or above</strong> per unit are individually tracked with unique GOI-IDs and QR codes.
          </p>
        </div>

        {/* ── Section 1: Basic Info ────────────────────────────────────── */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-saffron-500 text-white text-xs font-bold flex items-center justify-center">1</div>
            Product Information
          </h2>

          <div>
            <Label required tooltip="Full descriptive name including material, dimensions, and key attribute">Product Name</Label>
            <Input
              placeholder="e.g. Folding Chair — Steel Frame, Black Fabric, 80cm Height"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label required>Category</Label>
              <Select value={form.category} onChange={(e) => { set("category", e.target.value); set("subcategory", ""); }} required>
                <option value="">Select category…</option>
                {Object.keys(CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label required>Sub-category</Label>
              <Select value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} required disabled={!form.category}>
                <option value="">Select sub-category…</option>
                {subcategories.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          </div>

          <div>
            <Label required>Product Description</Label>
            <Textarea
              rows={4}
              placeholder="Describe the product: material, usage, key features, certifications, finish, etc."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label required tooltip="HSN code as per GST tariff for this product">HSN Code</Label>
              <Input placeholder="e.g. 9401" value={form.hsn} onChange={(e) => set("hsn", e.target.value)} required />
            </div>
            <div>
              <Label>Brand / Make</Label>
              <Input placeholder="e.g. Godrej, unbranded" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Model / Part Number</Label>
            <Input placeholder="e.g. FC-2024-SB or leave blank if not applicable" value={form.model} onChange={(e) => set("model", e.target.value)} />
          </div>
        </div>

        {/* ── Section 2: Quantity & Pricing ───────────────────────────── */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-saffron-500 text-white text-xs font-bold flex items-center justify-center">2</div>
            Quantity & Pricing
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label required tooltip="Total number of units being submitted under this listing">Total Quantity</Label>
              <div className="relative">
                <Layers size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  className="pl-9"
                  value={form.qty}
                  onChange={(e) => set("qty", e.target.value)}
                  min="1"
                  required
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
            </div>
            <div>
              <Label required tooltip="Unit price as per the government purchase order (including GST)">Unit Price (₹ incl. GST)</Label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  placeholder="e.g. 2400"
                  value={form.unitPrice}
                  onChange={(e) => set("unitPrice", e.target.value)}
                  min="1"
                  required
                  style={{ paddingLeft: "2rem" }}
                />
              </div>
            </div>
          </div>

          {/* Tracking notice */}
          {form.unitPrice !== "" && (
            <div className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${isTrackedIndividually ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-surface border-border text-gray-500"}`}>
              {isTrackedIndividually
                ? <Info size={15} className="text-blue-600 mt-0.5 shrink-0" />
                : <AlertCircle size={15} className="text-gray-400 mt-0.5 shrink-0" />
              }
              <p className="text-sm">
                {isTrackedIndividually
                  ? <><strong>Individual tracking active:</strong> Each of the {form.qty || "N"} units will receive a unique GOI-ID and QR code label (items ≥ ₹5,000).</>
                  : <><strong>Batch tracking:</strong> Units below ₹5,000 are tracked as a batch, not individually. A single QR label covers the full batch.</>
                }
              </p>
            </div>
          )}

          {isTrackedIndividually && form.qty && (
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "QR Codes to Generate",   value: Number(form.qty).toLocaleString("en-IN") },
                { label: "Total Batch Value",       value: `₹${((Number(form.qty) * Number(form.unitPrice)) / 1_00_000).toFixed(1)}L` },
                { label: "Est. QR Gen. Time",       value: Number(form.qty) < 100 ? "< 1 min" : Number(form.qty) < 5000 ? "2–5 min" : "10–20 min" },
              ].map((s) => (
                <div key={s.label} className="bg-surface border border-border rounded-xl p-3">
                  <p className="text-base font-black text-gray-900">{s.value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Section 3: Origin & Compliance ──────────────────────────── */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-saffron-500 text-white text-xs font-bold flex items-center justify-center">3</div>
            Origin & Compliance
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label required>Country of Origin</Label>
              <Select value={form.countryOfOrigin} onChange={(e) => set("countryOfOrigin", e.target.value)} required>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label tooltip="Months of warranty on this product from delivery date">Warranty Period (months)</Label>
              <Input type="number" placeholder="e.g. 12" value={form.warrantyMonths} onChange={(e) => set("warrantyMonths", e.target.value)} min="0" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => set("makeInIndia", !form.makeInIndia)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${form.makeInIndia ? "bg-saffron-500" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.makeInIndia ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Make in India Product</p>
                <p className="text-xs text-gray-400">Manufactured primarily in India (eligible for preference in evaluation)</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => set("gemRegistered", !form.gemRegistered)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${form.gemRegistered ? "bg-green-500" : "bg-gray-200"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.gemRegistered ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">GeM-Registered Product</p>
                <p className="text-xs text-gray-400">This product is listed on Government e-Marketplace</p>
              </div>
            </label>
          </div>

          {form.gemRegistered && (
            <div>
              <Label tooltip="The GeM product or catalog ID for this item">GeM Product ID</Label>
              <Input placeholder="e.g. GEM/2024/B/12345678" value={form.gemId} onChange={(e) => set("gemId", e.target.value)} />
            </div>
          )}
        </div>

        {/* ── Section 4: Specifications ────────────────────────────────── */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-saffron-500 text-white text-xs font-bold flex items-center justify-center">4</div>
            Technical Specifications
          </h2>

          <div>
            <Label tooltip="List key technical specs, one per line. E.g. 'Dimensions: 80 × 45 × 45 cm'">Specifications (one per line)</Label>
            <Textarea
              rows={6}
              placeholder={`Dimensions: 80 × 45 × 45 cm\nWeight: 4.2 kg\nLoad Capacity: 120 kg\nFrame: Powder-coated steel\nSeat: Black padded fabric\nCertifications: BIS IS 1455`}
              value={form.specs}
              onChange={(e) => set("specs", e.target.value)}
            />
          </div>
        </div>

        {/* ── Section 5: Product Images / Documents ───────────────────── */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-saffron-500 text-white text-xs font-bold flex items-center justify-center">5</div>
            Images & Documents
          </h2>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-saffron-300 transition-colors cursor-pointer"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500 mb-1">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-400">Product photos, brochures, test reports (PNG, JPG, PDF · max 5 files · 5 MB each)</p>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const selected = Array.from(e.target.files ?? []).slice(0, 5 - files.length);
                setFiles((prev) => [...prev, ...selected].slice(0, 5));
              }}
            />
          </div>

          {files.length > 0 && (
            <div className="flex flex-col gap-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 border border-border rounded-xl px-4 py-2.5">
                  <FileText size={15} className="text-saffron-600 shrink-0" />
                  <p className="text-sm text-gray-700 flex-1 truncate">{f.name}</p>
                  <p className="text-xs text-gray-400 shrink-0">{(f.size / 1024).toFixed(0)} KB</p>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Submit ──────────────────────────────────────────────────── */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-3">
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
            <AlertCircle size={15} className="text-yellow-600 mt-0.5 shrink-0" />
            <p className="text-sm text-yellow-700">
              By submitting, you confirm that this product listing matches a valid government purchase order held by your company,
              and all information provided is accurate and verifiable.
            </p>
          </div>
          {submitError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={15} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}
          <div className="flex gap-3">
            <Link
              href="/company/dashboard/products"
              className="flex-1 text-center border border-border rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-surface transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 text-white text-sm font-bold py-3 rounded-xl transition-opacity hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "#E07B00" }}
            >
              <Package size={15} /> {submitting ? "Submitting…" : "Submit for Approval"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
