"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode, ScanLine, CheckCircle2, AlertTriangle, X, Camera,
  Package, LayoutDashboard, Bell, Building2, Calendar, FileText,
  Warehouse, Clock, ArrowUpRight, RefreshCw, AlertOctagon, Loader2,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";
import {
  verifyScanToken,
  submitConditionRating,
  submitDefectReport,
  submitWarehouseAction,
} from "../actions";
import type { UserRole, ScanAction, DefectSeverity } from "@gams/lib/supabase/database.types";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ScannedProduct {
  instanceId: string;
  instanceCode: string;
  instanceStatus: string;
  warehouseLocation: string | null;
  conditionRating: number | null;
  eventId: string | null;
  productName: string;
  category: string;
  productType: string;
}

interface ScanHistoryItem {
  id: string;
  instanceCode: string;
  productName: string;
  action: ScanAction;
  result: "ok" | "invalid";
  timestamp: string;
}

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/assets", icon: Package, label: "Asset Registry" },
  { href: "/warehouse", icon: Warehouse, label: "Warehouse" },
  { href: "/scan", icon: QrCode, label: "Scan QR" },
  { href: "/companies", icon: Building2, label: "Companies" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/approvals", icon: CheckCircle2, label: "Approvals" },
  { href: "/analytics", icon: FileText, label: "Analytics" },
];

// â”€â”€â”€ Inspector Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function InspectorPanel({ product, onDone }: { product: ScannedProduct; onDone: () => void }) {
  const [rating, setRating] = useState(7);
  const [notes, setNotes] = useState("");
  const [recommendedAction, setRecommendedAction] = useState("keep");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit() {
    if (!product.eventId) {
      setErr("No active event assigned to this asset. Contact admin to assign one.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await submitConditionRating({
        instanceId: product.instanceId,
        eventId: product.eventId,
        rating,
        ratingLabel: rating >= 8 ? "Good" : rating >= 5 ? "Fair" : "Poor",
        notes: notes || undefined,
        recommendedAction:
          recommendedAction === "keep" ? "Keep in service"
          : recommendedAction === "repair" ? "Send for repair"
          : "Condemn / Dispose",
      });
      setDone(true);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 py-6">
        <CheckCircle2 size={28} className="text-green-500" />
        <p className="font-black text-green-700 text-sm">Rating Submitted!</p>
        <button onClick={onDone} className="text-xs text-saffron-600 underline">Scan another</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {err && <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{err}</p>}
      <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
          Condition Rating: <span className="text-saffron-600">{rating}</span>/10
        </label>
        <input
          type="range" min={1} max={10} value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full accent-saffron-500"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>Poor (1)</span><span>Fair (5)</span><span>Good (10)</span>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Recommended Action</label>
        <select
          value={recommendedAction}
          onChange={(e) => setRecommendedAction(e.target.value)}
          className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400"
        >
          <option value="keep">Keep in service</option>
          <option value="repair">Send for repair</option>
          <option value="condemn">Condemn / Dispose</option>
        </select>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Inspection Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observations about condition, damage, wear..."
          rows={3}
          className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400 resize-none"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-600 disabled:opacity-60"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Submit Condition Rating
      </button>
    </div>
  );
}

// â”€â”€â”€ Volunteer Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function VolunteerPanel({ product, scanId, onDone }: { product: ScannedProduct; scanId: string | null; onDone: () => void }) {
  const [severity, setSeverity] = useState<DefectSeverity>("minor");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit() {
    if (!description.trim()) { setErr("Please describe the defect."); return; }
    setLoading(true);
    setErr("");
    try {
      await submitDefectReport({
        instanceId: product.instanceId,
        severity,
        description: description.trim(),
        scanId: scanId ?? undefined,
      });
      setDone(true);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 py-6">
        <CheckCircle2 size={28} className="text-green-500" />
        <p className="font-black text-green-700 text-sm">Defect Reported!</p>
        <button onClick={onDone} className="text-xs text-saffron-600 underline">Scan another</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {err && <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{err}</p>}
      <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Defect Severity</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(["minor", "moderate", "major", "critical"] as DefectSeverity[]).map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={`py-2 rounded-xl text-[11px] font-bold capitalize border transition-colors ${
                severity === s
                  ? s === "critical" ? "bg-red-600 text-white border-red-600"
                    : s === "major" ? "bg-orange-500 text-white border-orange-500"
                    : s === "moderate" ? "bg-yellow-500 text-white border-yellow-500"
                    : "bg-blue-500 text-white border-blue-500"
                  : "border-border text-gray-500 hover:bg-surface"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Defect Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the defect in detail..."
          rows={4}
          className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400 resize-none"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-60"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        <AlertOctagon size={14} /> Report Defect
      </button>
    </div>
  );
}

// â”€â”€â”€ Warehouse Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function WarehousePanel({ product, onDone }: { product: ScannedProduct; onDone: () => void }) {
  const [warehouseAction, setWarehouseAction] = useState<"receive" | "dispatch">("receive");
  const [location, setLocation] = useState(product.warehouseLocation ?? "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setErr("");
    try {
      await submitWarehouseAction({
        instanceId: product.instanceId,
        action: warehouseAction,
        warehouseLocation: location || undefined,
        notes: notes || undefined,
        eventId: warehouseAction === "dispatch" ? (product.eventId ?? undefined) : undefined,
      });
      setDone(true);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 py-6">
        <CheckCircle2 size={28} className="text-green-500" />
        <p className="font-black text-green-700 text-sm">
          {warehouseAction === "receive" ? "Asset Received!" : "Asset Dispatched!"}
        </p>
        <button onClick={onDone} className="text-xs text-saffron-600 underline">Scan another</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {err && <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{err}</p>}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setWarehouseAction("receive")}
          className={`py-2.5 rounded-xl text-sm font-bold border transition-colors flex items-center justify-center gap-2 ${warehouseAction === "receive" ? "bg-green-500 text-white border-green-500" : "border-border text-gray-500 hover:bg-surface"}`}
        >
          <Warehouse size={14} /> Receive
        </button>
        <button
          onClick={() => setWarehouseAction("dispatch")}
          className={`py-2.5 rounded-xl text-sm font-bold border transition-colors flex items-center justify-center gap-2 ${warehouseAction === "dispatch" ? "bg-saffron-500 text-white border-saffron-500" : "border-border text-gray-500 hover:bg-surface"}`}
        >
          <ArrowUpRight size={14} /> Dispatch
        </button>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Warehouse / Zone / Shelf</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Delhi WH-A Â· Bay 3 Â· Shelf 12"
          className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400"
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Notes</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about this movement..."
          className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 ${warehouseAction === "receive" ? "bg-green-500 hover:bg-green-600" : "bg-saffron-500 hover:bg-saffron-600"}`}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Confirm {warehouseAction === "receive" ? "Receipt" : "Dispatch"}
      </button>
    </div>
  );
}

// â”€â”€â”€ Admin Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AdminPanel({ product, onDone }: { product: ScannedProduct; onDone: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-surface rounded-xl p-3">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
          <p className="font-black text-gray-900 mt-0.5 capitalize">{product.instanceStatus.replace(/_/g, " ")}</p>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Condition</p>
          <p className="font-black text-gray-900 mt-0.5">{product.conditionRating ? `${product.conditionRating}/10` : "Not rated"}</p>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</p>
          <p className="font-black text-gray-900 mt-0.5 truncate">{product.warehouseLocation ?? "â€”"}</p>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Type</p>
          <p className="font-black text-gray-900 mt-0.5 capitalize">{product.productType}</p>
        </div>
      </div>
      <Link
        href="/assets"
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800 text-white text-sm font-bold hover:bg-gray-900"
      >
        View Full Asset History <ArrowUpRight size={14} />
      </Link>
      <button onClick={onDone} className="text-xs text-gray-400 hover:text-gray-600 underline self-center">Scan another</button>
    </div>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ScanPage() {
  const [input, setInput] = useState("");
  const [cameraMode, setCameraMode] = useState(false);
  const [scanError, setScanError] = useState("");
  const [loading, setLoading] = useState(false);

  const [scanned, setScanned] = useState<ScannedProduct | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [scanFail, setScanFail] = useState<string | null>(null);

  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);

  // Load scan history from DB
  useEffect(() => {
    const db = createClient();
    db.from("scans")
      .select("id, scanned_at, instance_id, action, is_valid, notes")
      .order("scanned_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!data) return;
        setScanHistory(data.map((s) => ({
          id: s.id,
          instanceCode: s.instance_id ? s.instance_id.slice(0, 8).toUpperCase() : "UNKNOWN",
          productName: s.notes ?? `Asset #${s.instance_id?.slice(0, 8) ?? "â€”"}`,
          action: s.action as ScanAction,
          result: s.is_valid ? "ok" : "invalid",
          timestamp: new Date(s.scanned_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        })));
      });
  }, [scanned]); // reload after each successful scan

  // Camera integration via html5-qrcode
  useEffect(() => {
    if (!cameraMode) return;
    let scanner: { stop: () => Promise<void> } | null = null;
    let active = true;

    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!active) return;
        scanner = new Html5Qrcode("qr-reader-manage");
        await (scanner as unknown as { start: (c: unknown, o: unknown, s: (t: string) => void, e: () => void) => Promise<void> }).start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText: string) => {
            if (!active) return;
            setCameraMode(false);
            void handleScanToken(decodedText);
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
      if (scanner) scanner.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraMode]);

  async function handleScanToken(rawToken: string) {
    const token = rawToken.trim();
    if (!token) return;
    setScanFail(null);
    setScanned(null);
    setScanId(null);
    setUserRole(null);
    setLoading(true);
    try {
      const res = await verifyScanToken(token);
      if (res.valid === false) {
        setScanFail(res.error ?? "Unknown error");
        if (res.userRole) setUserRole(res.userRole);
      } else {
        setScanned({
          instanceId: res.instance.id,
          instanceCode: res.instance.code,
          instanceStatus: res.instance.status,
          warehouseLocation: res.instance.warehouseLocation,
          conditionRating: res.instance.conditionRating,
          eventId: res.instance.eventId,
          productName: res.product.name,
          category: res.product.category,
          productType: res.product.productType,
        });
        setScanId(res.scanId);
        setUserRole(res.userRole);
      }
    } catch (e: unknown) {
      setScanFail("Scan failed: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setInput("");
    setScanned(null);
    setScanId(null);
    setScanFail(null);
    setUserRole(null);
  }

  const ACTION_PANEL_TITLE: Partial<Record<UserRole, string>> = {
    inspector: "Condition Inspection",
    volunteer: "Report Defect",
    warehouse_officer: "Warehouse Action",
    gov_admin: "Admin Overview",
    super_admin: "Admin Overview",
    event_manager: "Asset Log",
  };

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">à¤­à¤¾à¤°à¤¤ à¤¸à¤°à¤•à¤¾à¤° Â· GOI</p>
          <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/scan" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}
            >
              <Icon size={15} /> {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-border">
          <p className="text-[10px] text-[#9A9A9A]">GAMS v1.0 Â· Ministry of Finance</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

        <header className="bg-white border-b border-border px-6 py-4">
          <h1 className="text-lg font-black text-gray-900">QR Code Scanner</h1>
          <p className="text-xs text-gray-400">Scan or enter an asset code to verify, inspect, or log a warehouse action</p>
        </header>

        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
          {/* â”€â”€ Left: Scanner + Result + Action Panel â”€â”€ */}
          <div className="flex flex-col gap-4">
            {/* Camera viewport */}
            {cameraMode ? (
              <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-square max-w-xs w-full relative shrink-0">
                <div id="qr-reader-manage" className="w-full h-full" />
                <button
                  onClick={() => setCameraMode(false)}
                  className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80"
                >
                  <X size={14} />
                </button>
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                  <div className="border-2 border-saffron-400 rounded-xl w-44 h-44 opacity-80" />
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-square max-w-xs w-full flex items-center justify-center flex-col gap-3 shrink-0">
                <Camera size={40} className="text-gray-600" />
                <p className="text-gray-500 text-xs text-center px-4">Point camera at an asset QR code</p>
                <button
                  onClick={() => { setScanError(""); setCameraMode(true); }}
                  className="px-5 py-2 rounded-xl bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-600"
                >
                  Start Camera
                </button>
                {scanError && <p className="text-red-400 text-[10px] text-center px-4">{scanError}</p>}
              </div>
            )}

            {/* Manual entry */}
            <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
              <p className="text-sm font-black text-gray-900">Manual Entry</p>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Instance Code or Signed QR Token
                </label>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { void handleScanToken(input); } }}
                  placeholder="e.g. GOI-MHT001-R-ELEC-2025-00000001"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { void handleScanToken(input); }}
                  disabled={loading || !input.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-600 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <ScanLine size={14} />}
                  Verify Asset
                </button>
                <button onClick={reset} className="p-2.5 rounded-xl border border-border hover:bg-surface text-gray-400">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Verified asset info card */}
            {scanned && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-green-700">Asset Verified</p>
                    <p className="text-xs text-gray-700 mt-0.5 font-semibold">{scanned.productName}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{scanned.instanceCode} Â· {scanned.category}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Status</p>
                    <p className="font-black text-gray-900 mt-0.5 capitalize">{scanned.instanceStatus.replace(/_/g, " ")}</p>
                  </div>
                  <div className="bg-white rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Location</p>
                    <p className="font-black text-gray-900 mt-0.5 truncate">{scanned.warehouseLocation ?? "â€”"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Scan failed */}
            {scanFail && !scanned && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-red-700">Scan Failed</p>
                  <p className="text-xs text-red-600 mt-1">{scanFail}</p>
                </div>
              </div>
            )}

            {/* Role-based action panel */}
            {scanned && userRole && (
              <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4">
                <p className="text-sm font-black text-gray-900">{ACTION_PANEL_TITLE[userRole] ?? "Actions"}</p>
                {userRole === "inspector" && <InspectorPanel product={scanned} onDone={reset} />}
                {userRole === "volunteer" && <VolunteerPanel product={scanned} scanId={scanId} onDone={reset} />}
                {userRole === "warehouse_officer" && <WarehousePanel product={scanned} onDone={reset} />}
                {(userRole === "gov_admin" || userRole === "super_admin") && <AdminPanel product={scanned} onDone={reset} />}
                {(
                  userRole === "event_manager" ||
                  userRole === "auditor" ||
                  userRole === "company_rep" ||
                  userRole === "institution_rep" ||
                  userRole === "citizen"
                ) && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 p-3 bg-surface rounded-xl">
                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      <p className="text-xs text-gray-600">Scan logged successfully. No further actions available for your role.</p>
                    </div>
                    <button onClick={reset} className="text-xs text-saffron-600 underline self-start">Scan another</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* â”€â”€ Right: Scan History â”€â”€ */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-black text-gray-900">Recent Scans</p>
              <p className="text-xs text-gray-400 mt-0.5">Live from database Â· refreshes after each scan</p>
            </div>
            <div className="overflow-y-auto flex-1">
              {scanHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                  <QrCode size={32} />
                  <p className="text-xs">No scans recorded yet.</p>
                  <p className="text-[10px]">Scan an asset to see the history here.</p>
                </div>
              ) : (
                scanHistory.map((s) => (
                  <div key={s.id} className="flex items-start gap-3 px-5 py-4 border-b border-border last:border-b-0 hover:bg-surface">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${s.result === "ok" ? "bg-green-100" : "bg-red-100"}`}>
                      {s.result === "ok"
                        ? <CheckCircle2 size={13} className="text-green-600" />
                        : <X size={13} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{s.productName}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 capitalize">
                        {s.action.replace(/_/g, " ")} Â· {s.instanceCode}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
                      <Clock size={10} />{s.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

