"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Upload, FileText, CheckCircle2, AlertTriangle,
  X, Download, Table2, Package, LayoutDashboard, ShoppingCart,
  QrCode, Settings, Info, ChevronRight, Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedRow {
  row: number;
  name: string;
  category: string;
  hsn: string;
  qty: string;
  unitPrice: string;
  description: string;
  error?: string;
}

type UploadState = "idle" | "parsing" | "preview" | "submitting" | "success" | "error";

// ─── Constants ────────────────────────────────────────────────────────────────

const REQUIRED_COLUMNS = ["name", "category", "hsn_code", "quantity", "unit_price_inr", "description"];
const SAMPLE_CSV = `name,category,hsn_code,quantity,unit_price_inr,description
Folding Chair Steel Frame,Furniture,9401890,500,2400,Heavy-duty folding chair with powder-coated steel frame
LED Flood Light 100W,Electronics,8539290,200,4500,Waterproof IP65 LED flood light for outdoor events
Popup Canopy 10x10ft,Infrastructure,6306220,50,38000,UV-resistant canopy with steel frame easy assembly`;

const NAV = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Dashboard"      },
  { href: "/dashboard/products",     icon: Package,         label: "My Products"    },
  { href: "/dashboard/orders",       icon: ShoppingCart,    label: "Orders & POs"   },
  { href: "/dashboard/documents",    icon: FileText,        label: "Documents"      },
  { href: "/dashboard/settings",     icon: Settings,        label: "Account Settings"},
];

// ─── Parsers ──────────────────────────────────────────────────────────────────

function parseCSV(text: string): { rows: ParsedRow[]; errors: string[] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { rows: [], errors: ["CSV file appears to be empty or has no data rows."] };

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const missing = REQUIRED_COLUMNS.filter((c) => !headers.includes(c));
  if (missing.length > 0) return { rows: [], errors: [`Missing required columns: ${missing.join(", ")}`] };

  const nameI  = headers.indexOf("name");
  const catI   = headers.indexOf("category");
  const hsnI   = headers.indexOf("hsn_code");
  const qtyI   = headers.indexOf("quantity");
  const priceI = headers.indexOf("unit_price_inr");
  const descI  = headers.indexOf("description");

  const rows: ParsedRow[] = [];

  for (let i = 1; i < Math.min(lines.length, 201); i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const name  = cols[nameI]  ?? "";
    const cat   = cols[catI]   ?? "";
    const hsn   = cols[hsnI]   ?? "";
    const qty   = cols[qtyI]   ?? "";
    const price = cols[priceI] ?? "";
    const desc  = cols[descI]  ?? "";

    let rowError: string | undefined;
    if (!name)                rowError = "Name is required";
    else if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) rowError = "Quantity must be a positive number";
    else if (!price || isNaN(Number(price)) || Number(price) <= 0) rowError = "Unit price must be a positive number";
    else if (!hsn)            rowError = "HSN code is required";

    rows.push({ row: i, name, category: cat, hsn, qty, unitPrice: price, description: desc, error: rowError });
  }

  return { rows, errors: [] };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BulkUploadPage() {
  const [state, setState]     = useState<UploadState>("idle");
  const [file, setFile]       = useState<File | null>(null);
  const [rows, setRows]       = useState<ParsedRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging]   = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validRows   = rows.filter((r) => !r.error);
  const invalidRows = rows.filter((r) =>  r.error);

  function processFile(f: File) {
    setFile(f);
    setState("parsing");
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { rows: parsed, errors } = parseCSV(text);
      setRows(parsed);
      setParseErrors(errors);
      setState(errors.length > 0 ? "error" : "preview");
    };
    reader.readAsText(f);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".csv") || f.type === "text/csv")) processFile(f);
  }, []);

  function handleSubmit() {
    if (validRows.length === 0) return;
    setState("submitting");
    setTimeout(() => setState("success"), 1800);
  }

  function reset() {
    setState("idle");
    setFile(null);
    setRows([]);
    setParseErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "gams_bulk_upload_sample.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">GAMS · Company Portal</p>
          <p className="text-sm font-bold text-[#1A1A1A]">Arjuna Furniture Pvt Ltd</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                href === "/dashboard/products"
                  ? "bg-saffron-50 text-saffron-700 font-bold"
                  : "text-gray-500 hover:bg-surface"
              }`}
            >
              <Icon size={15} /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Tiranga */}
        <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4 shrink-0">
          <Link href="/dashboard/products" className="p-2 rounded-lg border border-border hover:bg-surface">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">Bulk Upload Products</h1>
            <p className="text-xs text-gray-400">Upload up to 200 products at once via CSV</p>
          </div>
          <button onClick={downloadSample} className="flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-xl border border-border hover:bg-surface">
            <Download size={13} /> Sample CSV
          </button>
        </header>

        <main className="flex-1 px-4 md:px-6 py-6 max-w-4xl">

          {/* Success state */}
          {state === "success" && (
            <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={36} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">{validRows.length} Products Submitted</h2>
                <p className="text-sm text-gray-500 max-w-sm">Your products have been submitted for GAMS admin review. You&apos;ll receive a notification once they are approved.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard/products" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-600">
                  <Package size={14} /> View All Products
                </Link>
                <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-bold text-gray-600 hover:bg-surface">
                  Upload Another File
                </button>
              </div>
            </div>
          )}

          {/* Idle / Error state: file drop zone */}
          {(state === "idle" || state === "error") && (
            <div className="flex flex-col gap-5">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
                <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-bold mb-1">CSV Format Requirements</p>
                  <p>Your CSV must include these columns (exact header names):</p>
                  <code className="inline-block mt-1 bg-blue-100 px-2 py-0.5 rounded text-xs">
                    name, category, hsn_code, quantity, unit_price_inr, description
                  </code>
                  <p className="mt-1.5">Maximum 200 rows per upload. Download the sample file to get started.</p>
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-colors ${
                  isDragging ? "border-saffron-400 bg-saffron-50" : "border-border hover:border-saffron-300 hover:bg-saffron-50/30"
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDragging ? "bg-saffron-100" : "bg-surface"}`}>
                  <Upload size={24} className={isDragging ? "text-saffron-600" : "text-gray-400"} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">Drag & drop your CSV file here</p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse · .csv files only · max 200 rows</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Parse errors */}
              {parseErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                  <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-700 mb-1">File Parse Error</p>
                    {parseErrors.map((e, i) => <p key={i} className="text-sm text-red-600">{e}</p>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Parsing state */}
          {state === "parsing" && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-gray-600">Parsing {file?.name}…</p>
            </div>
          )}

          {/* Submitting state */}
          {state === "submitting" && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-gray-600">Submitting {validRows.length} products…</p>
            </div>
          )}

          {/* Preview state */}
          {state === "preview" && (
            <div className="flex flex-col gap-5">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-border rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black text-gray-900">{rows.length}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Total Rows</p>
                </div>
                <div className="bg-white border border-border rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black text-green-600">{validRows.length}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Valid</p>
                </div>
                <div className="bg-white border border-border rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black text-red-600">{invalidRows.length}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Errors</p>
                </div>
              </div>

              {/* File info + reset */}
              <div className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-surface rounded-lg flex items-center justify-center">
                    <FileText size={15} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{file?.name}</p>
                    <p className="text-xs text-gray-400">{((file?.size ?? 0) / 1024).toFixed(1)} KB · {rows.length} rows</p>
                  </div>
                </div>
                <button onClick={reset} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-border hover:bg-surface">
                  <X size={12} /> Remove
                </button>
              </div>

              {/* Error rows */}
              {invalidRows.length > 0 && (
                <div className="bg-white border border-border rounded-2xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-red-50 flex items-center gap-2">
                    <AlertTriangle size={13} className="text-red-500" />
                    <p className="text-xs font-black text-red-700 uppercase tracking-wider">{invalidRows.length} Rows with Errors</p>
                  </div>
                  <div className="divide-y divide-border max-h-52 overflow-y-auto">
                    {invalidRows.map((r) => (
                      <div key={r.row} className="px-5 py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{r.name || "(empty name)"}</p>
                          <p className="text-xs text-red-600 mt-0.5">{r.error}</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 shrink-0">Row {r.row}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Valid rows preview */}
              {validRows.length > 0 && (
                <div className="bg-white border border-border rounded-2xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-surface">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-wider">{validRows.length} Valid Products — Preview</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-surface text-[10px] font-black text-gray-500 uppercase tracking-wider">
                          <th className="text-left px-4 py-2.5">Name</th>
                          <th className="text-left px-4 py-2.5">Category</th>
                          <th className="text-left px-4 py-2.5">HSN</th>
                          <th className="text-right px-4 py-2.5">Qty</th>
                          <th className="text-right px-4 py-2.5">Unit Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {validRows.slice(0, 20).map((r) => (
                          <tr key={r.row} className="hover:bg-surface/40">
                            <td className="px-4 py-2.5 font-medium text-gray-800 max-w-xs truncate">{r.name}</td>
                            <td className="px-4 py-2.5 text-gray-600">{r.category}</td>
                            <td className="px-4 py-2.5 font-mono text-gray-600">{r.hsn}</td>
                            <td className="px-4 py-2.5 text-right text-gray-800">{Number(r.qty).toLocaleString("en-IN")}</td>
                            <td className="px-4 py-2.5 text-right text-gray-800">₹{Number(r.unitPrice).toLocaleString("en-IN")}</td>
                          </tr>
                        ))}
                        {validRows.length > 20 && (
                          <tr>
                            <td colSpan={5} className="px-4 py-2.5 text-center text-gray-400">
                              … and {validRows.length - 20} more rows
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Submit / cancel */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={validRows.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={14} /> Submit {validRows.length} Products
                </button>
                <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-bold text-gray-600 hover:bg-surface">
                  <X size={14} /> Cancel
                </button>
              </div>

              {invalidRows.length > 0 && validRows.length > 0 && (
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Info size={11} /> Only the {validRows.length} valid rows will be submitted. Fix errors in your CSV and re-upload to include the remaining {invalidRows.length} rows.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
