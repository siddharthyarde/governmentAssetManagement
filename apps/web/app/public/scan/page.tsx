"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode, Search, Camera, CheckCircle2, AlertCircle,
  MapPin, Calendar, Building2, Package, ArrowRight,
  Truck, ShoppingCart, ChevronRight, RefreshCw, Hash,
  Info, Shield, X, Clock, Tag,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";
import type { Html5Qrcode } from "html5-qrcode";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScanStatus = "in_stock" | "dispatched" | "delivered" | "transferred" | "inspected";

interface ScanEvent {
  timestamp:    string;
  status:       ScanStatus;
  location:     string;
  actor:        string;
  actorType:    "company" | "logistics" | "institution" | "inspector" | "volunteer";
  note?:        string;
}

interface AssetRecord {
  goiId:          string;
  productName:    string;
  category:       string;
  brand:          string;
  model:          string;
  unitPrice:      number;
  hsnCode:        string;
  isMII:          boolean;
  isGeM:          boolean;
  gemId?:         string;
  originEvent:    string;
  ministry:       string;
  currentHolder:  string;
  currentState:   string;
  currentStatus:  ScanStatus;
  condition:      string;
  manufactureDate: string;
  timeline:       ScanEvent[];
}

// ─── Mock Asset Database ──────────────────────────────────────────────────────

const ASSET_DB: Record<string, AssetRecord> = {
  "GAMS-P001-0047": {
    goiId: "GAMS-P001-0047", productName: "Executive Conference Chair",
    category: "Furniture", brand: "Godrej Interio", model: "Executive Pro 500",
    unitPrice: 18500, hsnCode: "9401.61", isMII: true, isGeM: true, gemId: "GEM/2023/B/4812734",
    originEvent: "G20 Summit India 2023", ministry: "Ministry of External Affairs",
    currentHolder: "Rajya Sabha Secretariat, New Delhi", currentState: "Delhi", currentStatus: "delivered",
    condition: "Good — minor upholstery wear on armrests", manufactureDate: "2023-06",
    timeline: [
      { timestamp: "2023-07-12 09:20", status: "in_stock",   location: "Godrej Interio Warehouse, Faridabad, Haryana", actor: "Godrej Interio Pvt Ltd",            actorType: "company",     note: "QR label printed and affixed" },
      { timestamp: "2023-09-01 14:45", status: "dispatched", location: "Loading Bay, Faridabad",                       actor: "BlueDart Express Ltd",                actorType: "logistics",   note: "LR No: BD2309010047" },
      { timestamp: "2023-09-04 08:10", status: "delivered",  location: "Bharat Mandapam, Pragati Maidan, New Delhi",  actor: "G20 Summit Event Team",               actorType: "institution", note: "Deployed at Hall 3, Row B" },
      { timestamp: "2023-09-12 17:30", status: "transferred",location: "Bharat Mandapam, New Delhi",                  actor: "Ministry of External Affairs",         actorType: "institution", note: "Event concluded; asset transferred to Rajya Sabha" },
      { timestamp: "2024-01-15 10:00", status: "inspected",  location: "Rajya Sabha Annexe, New Delhi",               actor: "GAMS Inspector — Arjun Mehta",         actorType: "inspector",   note: "Condition verified: Good. Minor wear noted." },
      { timestamp: "2024-01-15 10:05", status: "delivered",  location: "Rajya Sabha Secretariat, New Delhi",          actor: "Rajya Sabha Secretariat",              actorType: "institution", note: "Asset registered in institutional inventory" },
    ],
  },
  "GAMS-P002-0112": {
    goiId: "GAMS-P002-0112", productName: "4K LED Conference Display — 75\"",
    category: "Electronics", brand: "Samsung", model: "QB75B-N Professional",
    unitPrice: 285000, hsnCode: "8528.72", isMII: false, isGeM: true, gemId: "GEM/2023/B/3897234",
    originEvent: "Digital India Conclave 2023", ministry: "Ministry of Electronics and IT",
    currentHolder: "National Informatics Centre, Mumbai", currentState: "Maharashtra", currentStatus: "delivered",
    condition: "Excellent — fully functional, no visible damage",  manufactureDate: "2023-04",
    timeline: [
      { timestamp: "2023-10-01 11:00", status: "in_stock",   location: "Samsung India Warehouse, Noida, UP",          actor: "Samsung India Electronics Pvt Ltd",   actorType: "company" },
      { timestamp: "2023-11-10 09:00", status: "dispatched", location: "Noida Warehouse Bay 4",                       actor: "TCI Express",                          actorType: "logistics",   note: "LR No: TC23-558812" },
      { timestamp: "2023-11-13 15:30", status: "delivered",  location: "NESCO Centre, Goregaon, Mumbai",              actor: "Digital India Event Team",             actorType: "institution", note: "Installed on Stage 2, AV rig" },
      { timestamp: "2023-11-18 09:00", status: "transferred",location: "NESCO Centre, Mumbai",                        actor: "MeitY Assets Team",                    actorType: "institution", note: "Event ended; transferred to NIC Mumbai" },
      { timestamp: "2023-12-02 14:00", status: "delivered",  location: "NIC, MTNL Building, Mumbai",                  actor: "National Informatics Centre",          actorType: "institution", note: "Installed in Analytics Lab, Room 301" },
    ],
  },
  "GAMS-P003-0008": {
    goiId: "GAMS-P003-0008", productName: "Heavy-Duty Generator — 125 kVA",
    category: "Electrical", brand: "Kirloskar", model: "KG2-125WS",
    unitPrice: 475000, hsnCode: "8502.11", isMII: true, isGeM: false,
    originEvent: "India Energy Week 2024", ministry: "Ministry of Petroleum & Natural Gas",
    currentHolder: "IIT Bangalore Campus Power Dept", currentState: "Karnataka", currentStatus: "delivered",
    condition: "Good — serviced post-event, 380 hours usage logged", manufactureDate: "2022-11",
    timeline: [
      { timestamp: "2024-01-15 10:00", status: "in_stock",   location: "Kirloskar Factory, Pune, Maharashtra",        actor: "Kirloskar Electric Co Ltd",            actorType: "company" },
      { timestamp: "2024-02-03 07:30", status: "dispatched", location: "Kirloskar Dispatch Yard, Pune",               actor: "VRL Logistics",                        actorType: "logistics", note: "Trailer No: KA01AB1234" },
      { timestamp: "2024-02-05 16:00", status: "delivered",  location: "BIEC, Tumkur Road, Bangalore",                actor: "India Energy Week Event Team",         actorType: "institution", note: "Generator bay area, Sector D" },
      { timestamp: "2024-02-11 08:00", status: "transferred",location: "BIEC, Bangalore",                             actor: "MoPNG Assets Registry",                actorType: "institution", note: "Post-event transfer initiated" },
      { timestamp: "2024-03-01 11:00", status: "inspected",  location: "IIT Bangalore, Malleswaram",                  actor: "GAMS Inspector — Priya R",             actorType: "inspector", note: "380 hrs on meter. Service due at 500 hrs." },
      { timestamp: "2024-03-01 11:30", status: "delivered",  location: "IIT Bangalore Power Dept",                    actor: "IIT Bangalore",                        actorType: "institution" },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SCAN_META: Record<ScanStatus, { label: string; cls: string; icon: React.ElementType }> = {
  in_stock:    { label: "In Stock",    cls: "bg-blue-100 text-blue-700",    icon: Package    },
  dispatched:  { label: "Dispatched",  cls: "bg-purple-100 text-purple-700",icon: Truck      },
  delivered:   { label: "Delivered",   cls: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  transferred: { label: "Transferred", cls: "bg-yellow-100 text-yellow-700",icon: ArrowRight  },
  inspected:   { label: "Inspected",   cls: "bg-teal-100 text-teal-700",    icon: Shield     },
};

const ACTOR_COLORS: Record<string, string> = {
  company:     "bg-saffron-50 border-saffron-200 text-saffron-700",
  logistics:   "bg-purple-50 border-purple-200 text-purple-700",
  institution: "bg-green-50 border-green-200 text-green-700",
  inspector:   "bg-teal-50 border-teal-200 text-teal-700",
  volunteer:   "bg-blue-50 border-blue-200 text-blue-700",
};

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

// ─── Sample IDs hint ──────────────────────────────────────────────────────────

const SAMPLE_IDS = ["GAMS-P001-0047", "GAMS-P002-0112", "GAMS-P003-0008"];

// ─── Asset Result View ────────────────────────────────────────────────────────

function AssetResult({ asset, onReset }: { asset: AssetRecord; onReset: () => void }) {
  const current = SCAN_META[asset.currentStatus];
  const CurrentIcon = current.icon;

  return (
    <div className="flex flex-col gap-5">
      {/* Found header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-green-600">Asset Found</p>
            <p className="text-[10px] text-gray-400">{asset.goiId}</p>
          </div>
        </div>
        <button onClick={onReset} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 font-semibold">
          <RefreshCw size={11} /> Scan Again
        </button>
      </div>

      {/* Product info */}
      <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#E07B0012" }}>
            <Package size={20} className="text-saffron-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900">{asset.productName}</p>
            <p className="text-xs text-gray-500">{asset.brand} — {asset.model}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {asset.isMII && (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700">
                  Make in India
                </span>
              )}
              {asset.isGeM && (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                  GeM Verified
                </span>
              )}
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                HSN {asset.hsnCode}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          {[
            { label: "Category",    val: asset.category                   },
            { label: "Unit Value",  val: formatINR(asset.unitPrice)       },
            { label: "Origin Event",val: asset.originEvent                },
            { label: "Ministry",    val: asset.ministry                   },
            { label: "Manufactured",val: asset.manufactureDate            },
            { label: "Condition",   val: asset.condition                  },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-[9px] text-gray-400 uppercase font-bold">{label}</p>
              <p className="text-gray-900 font-semibold leading-snug">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current holder */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-3">Current Location</p>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{asset.currentHolder}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin size={10} /> {asset.currentState}
            </div>
          </div>
          <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${current.cls}`}>
            <CurrentIcon size={9} /> {current.label}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <p className="text-xs font-black text-gray-700 uppercase tracking-wider mb-4">Full Asset Lifecycle</p>
        <div className="relative">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
          <div className="flex flex-col gap-4">
            {asset.timeline.map((ev, i) => {
              const evMeta = SCAN_META[ev.status];
              const EvIcon = evMeta.icon;
              const isLast = i === asset.timeline.length - 1;
              return (
                <div key={i} className="relative flex items-start gap-4 pl-2">
                  <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center z-10 shrink-0 ${isLast ? "bg-saffron-500" : "bg-gray-200"}`}>
                    <EvIcon size={10} className={isLast ? "text-white" : "text-gray-400"} />
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${evMeta.cls}`}>{evMeta.label}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${ACTOR_COLORS[ev.actorType]}`}>{ev.actorType}</span>
                    </div>
                    <p className="text-xs text-gray-700 font-semibold mt-1 leading-snug">{ev.actor}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                      <MapPin size={9} /> {ev.location}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock size={9} /> {ev.timestamp}
                    </div>
                    {ev.note && (
                      <p className="text-[10px] text-gray-500 bg-surface border border-border rounded-lg px-2 py-1 mt-1">{ev.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* GeM ID */}
      {asset.isGeM && asset.gemId && (
        <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
          <Shield size={12} className="shrink-0" />
          <span><strong>GeM Order ID:</strong> {asset.gemId}</span>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScanPage() {
  const [goiInput, setGoiInput]     = useState("");
  const [result, setResult]         = useState<AssetRecord | null>(null);
  const [notFound, setNotFound]     = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [scanError, setScanError] = useState("");

  async function lookupAsset(key: string) {
    // 1 — check static mock DB first
    if (ASSET_DB[key]) return ASSET_DB[key];
    // 2 — query Supabase product_instances by qr_payload
    const db = createClient();
    const { data: inst } = await db
      .from("product_instances")
      .select("id, qr_payload, status, warehouse_location, products(name, category)")
      .eq("qr_payload", key)
      .maybeSingle();
    if (!inst) return null;
    // 3 — fetch scan history for timeline
    const { data: scans } = await db
      .from("scans")
      .select("id, scanned_at, is_valid, notes, latitude, longitude")
      .eq("instance_id", inst.id)
      .order("scanned_at", { ascending: true })
      .limit(20);
    const productInfo = Array.isArray(inst.products) ? inst.products[0] : inst.products;
    const timeline: ScanEvent[] = (scans ?? []).map((s) => {
      const geo = s.latitude != null && s.longitude != null ? `${s.latitude.toFixed(4)}, ${s.longitude.toFixed(4)}` : null;
      return {
        timestamp: (s.scanned_at ?? "").slice(0, 16).replace("T", " "),
        status: (s.is_valid ? "inspected" : "in_stock") as ScanStatus,
        location: geo ?? inst.warehouse_location ?? "—",
        actor: "GAMS Scanner",
        actorType: "inspector" as const,
        note: s.notes ?? undefined,
      };
    });
    const asset: AssetRecord = {
      goiId: inst.qr_payload ?? key,
      productName: productInfo?.name ?? "Unknown Product",
      category: productInfo?.category ?? "General",
      brand: "—",
      model: "—",
      unitPrice: 0,
      hsnCode: "—",
      isMII: false,
      isGeM: false,
      originEvent: "—",
      ministry: "—",
      currentHolder: inst.warehouse_location ?? "—",
      currentState: "—",
      currentStatus: (inst.status ?? "in_stock") as ScanStatus,
      condition: "—",
      manufactureDate: "—",
      timeline: timeline.length > 0 ? timeline : [{
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        status: "in_stock",
        location: inst.warehouse_location ?? "—",
        actor: "GAMS System",
        actorType: "institution",
        note: "Asset registered in GAMS",
      }],
    };
    return asset;
  }

  useEffect(() => {
    if (!cameraMode) return;
    let scanner: Html5Qrcode | undefined;
    let active = true;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!active) return;
        scanner = new Html5Qrcode("qr-reader-public");
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText: string) => {
            const key = decodedText.trim().toUpperCase();
            setGoiInput(key);
            setNotFound(false);
            setResult(null);
            lookupAsset(key).then((found) => {
              if (found) setResult(found);
              else setNotFound(true);
            });
            setCameraMode(false);
          },
          () => {}
        );
      } catch {
        if (active) {
          setCameraMode(false);
          setScanError("Camera unavailable or permission denied.");
        }
      }
    })();
    return () => {
      active = false;
      if (scanner) { scanner.stop().catch(() => {}); }
    };
  }, [cameraMode]);

  function handleSearch() {
    const key = goiInput.trim().toUpperCase();
    if (!key) return;
    setNotFound(false);
    setResult(null);
    lookupAsset(key).then((found) => {
      if (found) setResult(found);
      else setNotFound(true);
    });
  }

  function reset() {
    setGoiInput("");
    setResult(null);
    setNotFound(false);
    setCameraMode(false);
  }

  return (
    <div className="min-h-dvh" style={{ background: "#FAFAF7" }}>
      {/* Tiranga top bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Nav */}
      <nav className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-black text-gray-900 text-lg">GAMS</Link>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#E07B0015", color: "#E07B00" }}>
            Public Portal
          </span>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Hero */}
        {!result && !notFound && (
          <div className="text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm" style={{ background: "#E07B0015" }}>
              <QrCode size={30} className="text-saffron-600" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Scan a GOI Asset</h1>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Scan any GAMS QR code or enter a GOI-ID to view the complete lifecycle of a government asset — from purchase to current holder.
            </p>
          </div>
        )}

        {/* Scanner UI */}
        {!result && (
          <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
            {/* Camera */}
            {cameraMode ? (
              <div className="relative aspect-square rounded-2xl bg-gray-900 overflow-hidden">
                <div id="qr-reader-public" className="w-full h-full" />
                <button
                  onClick={() => setCameraMode(false)}
                  className="absolute top-3 right-3 z-20 w-7 h-7 bg-black/60 rounded-xl flex items-center justify-center text-white hover:bg-black/80"
                >
                  <X size={14} />
                </button>
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                  <div className="border-2 border-saffron-400 rounded-xl w-48 h-48 opacity-80" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setScanError(""); setCameraMode(true); }}
                  className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl py-10 text-gray-400 hover:border-saffron-300 hover:text-saffron-600 transition-colors"
                >
                  <Camera size={22} />
                  <span className="text-sm font-semibold">Tap to open camera scanner</span>
                </button>
                {scanError && <p className="text-red-500 text-xs text-center">{scanError}</p>}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <p className="text-xs text-gray-400 font-bold">OR ENTER MANUALLY</p>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Manual input */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full border border-border rounded-xl pl-9 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-saffron-400 uppercase"
                  placeholder="GAMS-PXXX-XXXX"
                  value={goiInput}
                  onChange={(e) => { setGoiInput(e.target.value.toUpperCase()); setNotFound(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!goiInput.trim()}
                className="w-full text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "#E07B00" }}
              >
                <Search size={14} /> Look Up Asset
              </button>
            </div>

            {/* Sample IDs */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Try a sample GOI-ID</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_IDS.map((id) => (
                  <button key={id} onClick={() => { setGoiInput(id); setNotFound(false); setResult(null); }} className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-border bg-surface hover:border-saffron-300 hover:text-saffron-700 transition-colors">
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Not found state */}
        {notFound && (
          <div className="bg-white border border-red-200 rounded-2xl p-8 flex flex-col items-center gap-3 text-center">
            <AlertCircle size={32} className="text-red-400" />
            <div>
              <p className="font-bold text-gray-900">Asset Not Found</p>
              <p className="text-xs text-gray-500 mt-1">No record found for <span className="font-mono font-bold text-gray-700">{goiInput}</span>.</p>
              <p className="text-xs text-gray-400 mt-1">Ensure the GOI-ID is correct and the product has been registered in GAMS.</p>
            </div>
            <button onClick={reset} className="mt-1 flex items-center gap-1.5 text-sm font-bold text-white px-5 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#E07B00" }}>
              <RefreshCw size={13} /> Try Again
            </button>
          </div>
        )}

        {/* Result */}
        {result && <AssetResult asset={result} onReset={reset} />}

        {/* Info footer */}
        {!result && !notFound && (
          <div className="flex items-start gap-3 text-xs text-gray-500 bg-white border border-border rounded-xl p-4">
            <Info size={14} className="shrink-0 mt-0.5 text-gray-400" />
            <p>
              GAMS QR codes enable complete transparency for government assets — track provenance, transfers, and current holders. All data is verified by GAMS administrators and licensed inspectors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
