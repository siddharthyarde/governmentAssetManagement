"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText, Download, Calendar, Package, BarChart3, QrCode,
  Building2, Users, LayoutDashboard, Bell, CheckCircle2,
  Clock, FileBarChart, ChevronRight, AlertTriangle,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconCls: string;
  estimatedRows: number;
  formats: ("PDF" | "CSV" | "XLSX")[];
}

interface GeneratedReport {
  id: string;
  name: string;
  typeId: string;
  dateFrom: string;
  dateTo: string;
  generatedAt: string;
  generatedBy: string;
  format: "PDF" | "CSV" | "XLSX";
  size: string;
  status: "ready" | "generating" | "failed";
}

const REPORT_TYPES: ReportType[] = [
  { id: "monthly-summary", name: "Monthly Asset Summary", description: "Overview of all assets — total count, value, status distribution and utilization rate.", icon: FileBarChart, iconBg: "bg-blue-50", iconCls: "text-blue-600", estimatedRows: 450, formats: ["PDF", "CSV", "XLSX"] },
  { id: "asset-utilization", name: "Asset Utilization Report", description: "Per-asset usage history, event assignments, downtime and redistribution frequency.", icon: BarChart3, iconBg: "bg-saffron-50", iconCls: "text-saffron-600", estimatedRows: 1200, formats: ["PDF", "XLSX"] },
  { id: "event-report", name: "Event Asset Report", description: "Assets assigned to each event, condition before/after, company performance metrics.", icon: Calendar, iconBg: "bg-purple-50", iconCls: "text-purple-600", estimatedRows: 320, formats: ["PDF", "CSV"] },
  { id: "qr-audit", name: "QR Scan Audit Log", description: "All QR verification scans — asset ID, location, timestamp, mismatch events.", icon: QrCode, iconBg: "bg-green-50", iconCls: "text-green-600", estimatedRows: 5400, formats: ["CSV", "XLSX"] },
  { id: "company-performance", name: "Company Performance", description: "Defect rates, on-time returns, damage claims and ratings by company.", icon: Building2, iconBg: "bg-red-50", iconCls: "text-red-500", estimatedRows: 180, formats: ["PDF", "XLSX"] },
  { id: "redistribution", name: "Redistribution Report", description: "All redistribution requests — approvals, rejections, transit times and delivery rates.", icon: AlertTriangle, iconBg: "bg-yellow-50", iconCls: "text-yellow-600", estimatedRows: 240, formats: ["PDF", "CSV"] },
];

const RECENT_REPORTS: GeneratedReport[] = [
  { id: "RPT-001", name: "Monthly Asset Summary — Jan 2024", typeId: "monthly-summary", dateFrom: "2024-01-01", dateTo: "2024-01-31", generatedAt: "2024-02-01 09:15", generatedBy: "Suresh Kumar", format: "PDF", size: "1.2 MB", status: "ready" },
  { id: "RPT-002", name: "Event Asset Report — Republic Day 2024", typeId: "event-report", dateFrom: "2024-01-20", dateTo: "2024-01-26", generatedAt: "2024-01-29 16:42", generatedBy: "Meena Shah", format: "XLSX", size: "340 KB", status: "ready" },
  { id: "RPT-003", name: "QR Scan Audit Log — Q4 2023", typeId: "qr-audit", dateFrom: "2023-10-01", dateTo: "2023-12-31", generatedAt: "2024-01-15 11:08", generatedBy: "Anil Tripathi", format: "CSV", size: "2.8 MB", status: "ready" },
  { id: "RPT-004", name: "Company Performance — FY 2023-24", typeId: "company-performance", dateFrom: "2023-04-01", dateTo: "2024-03-31", generatedAt: "2024-01-10 14:20", generatedBy: "Priya Verma", format: "PDF", size: "890 KB", status: "ready" },
  { id: "RPT-005", name: "Asset Utilization — Dec 2023", typeId: "asset-utilization", dateFrom: "2023-12-01", dateTo: "2023-12-31", generatedAt: "2024-01-03 10:30", generatedBy: "Suresh Kumar", format: "XLSX", size: "1.5 MB", status: "ready" },
];

const FORMAT_CLS: Record<string, string> = {
  PDF: "bg-red-100 text-red-700",
  CSV: "bg-green-100 text-green-700",
  XLSX: "bg-blue-100 text-blue-700",
};

const NAV_ITEMS = [
  { href: "/manage", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/manage/notifications", icon: Bell, label: "Notifications" },
  { href: "/manage/assets", icon: Package, label: "Asset Registry" },
  { href: "/manage/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/manage/reports", icon: FileText, label: "Reports" },
  { href: "/manage/audit", icon: Clock, label: "Audit Log" },
  { href: "/manage/approvals", icon: CheckCircle2, label: "Approvals" },
  { href: "/manage/settings", icon: Users, label: "Settings" },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2024-02-29");
  const [format, setFormat] = useState<"PDF" | "CSV" | "XLSX">("PDF");
  const [generating, setGenerating] = useState(false);
  const [recent, setRecent] = useState<GeneratedReport[]>(RECENT_REPORTS);
  const [formatToast, setFormatToast] = useState<string | null>(null);

  useEffect(() => {
    const db = createClient();
    db.from("audit_logs")
      .select("id, actor_role, logged_at, new_data")
      .eq("action", "export")
      .order("logged_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const mapped: GeneratedReport[] = data.map((row, i) => {
          const meta = (row.new_data ?? {}) as Record<string, string>;
          return {
            id: `RPT-DB-${String(i + 1).padStart(3, "0")}`,
            name: meta.reportName ?? "Exported Report",
            typeId: meta.typeId ?? "monthly-summary",
            dateFrom: meta.dateFrom ?? "",
            dateTo: meta.dateTo ?? "",
            generatedAt: (row.logged_at ?? "").slice(0, 16).replace("T", " "),
            generatedBy: row.actor_role ?? "Unknown",
            format: (meta.format as GeneratedReport["format"]) ?? "CSV",
            size: meta.size ?? "—",
            status: "ready",
          };
        });
        setRecent(mapped);
      });
  }, []);

  const selType = REPORT_TYPES.find((r) => r.id === selectedType);

  function buildCSV(typeId: string, name: string, from: string, to: string): string {
    const note = "Mock data — connect Supabase for live records";
    const rows: string[][] = [];
    if (typeId === "monthly-summary") {
      rows.push(["Asset ID", "Name", "Category", "Status", "Condition", "Location", "Value (INR)"]);
      rows.push(["GA-001", "Sound System 5KW", "Electronics", "Active", "Good", "Delhi", "210000"]);
      rows.push(["GA-002", "Generator 25KVA", "Machinery", "In Use", "Good", "Mumbai", "450000"]);
      rows.push(["GA-003", "LED Display 55in", "Electronics", "Available", "Excellent", "Bengaluru", "85000"]);
      rows.push(["GA-004", "Hydraulic Stage", "Furniture", "Active", "Fair", "Chennai", "320000"]);
      rows.push(["GA-005", "PA Speaker Array", "Electronics", "Available", "Good", "Hyderabad", "175000"]);
    } else if (typeId === "asset-utilization") {
      rows.push(["Asset ID", "Name", "Events Assigned", "Total Days Used", "Utilization %", "Last Assigned"]);
      rows.push(["GA-001", "Sound System 5KW", "12", "38", "83", "2024-01-22"]);
      rows.push(["GA-002", "Generator 25KVA", "9", "27", "59", "2024-01-18"]);
      rows.push(["GA-003", "LED Display 55in", "6", "14", "30", "2024-01-05"]);
      rows.push(["GA-004", "Hydraulic Stage", "15", "44", "96", "2024-01-29"]);
      rows.push(["GA-005", "PA Speaker Array", "11", "32", "70", "2024-01-20"]);
    } else if (typeId === "event-report") {
      rows.push(["Event", "Asset ID", "Asset Name", "Company", "Condition Before", "Condition After", "Days Assigned"]);
      rows.push(["Republic Day 2024", "GA-001", "Sound System 5KW", "Sharma Rentals", "Good", "Good", "4"]);
      rows.push(["Republic Day 2024", "GA-004", "Hydraulic Stage", "BuildRight Co.", "Good", "Fair", "5"]);
      rows.push(["Republic Day 2024", "GA-002", "Generator 25KVA", "PowerGen Ltd.", "Good", "Good", "5"]);
      rows.push(["New Year Gala", "GA-003", "LED Display 55in", "MediaTech", "Excellent", "Good", "2"]);
      rows.push(["New Year Gala", "GA-005", "PA Speaker Array", "Sharma Rentals", "Good", "Good", "2"]);
    } else if (typeId === "qr-audit") {
      rows.push(["Scan ID", "Asset ID", "Location", "Scanned By", "Timestamp", "Status", "Mismatch"]);
      rows.push(["QR-8821", "GA-001", "Delhi Expo", "Arjun Mehta", "2024-01-26 10:42", "OK", "No"]);
      rows.push(["QR-8822", "GA-002", "Mumbai Hall", "Priya Das", "2024-01-26 11:05", "OK", "No"]);
      rows.push(["QR-8823", "GA-004", "Delhi Expo", "Arjun Mehta", "2024-01-26 11:18", "MISMATCH", "Yes"]);
      rows.push(["QR-8824", "GA-003", "Bengaluru Hub", "Kavya Nair", "2024-01-27 09:15", "OK", "No"]);
      rows.push(["QR-8825", "GA-005", "Chennai Centre", "Raj Iyer", "2024-01-27 14:33", "OK", "No"]);
    } else if (typeId === "company-performance") {
      rows.push(["Company", "GSTIN", "Orders", "Defect Rate %", "On-time Return %", "Damage Claims", "Rating"]);
      rows.push(["Sharma Rentals Pvt Ltd", "07AAACS1234A1Z5", "34", "2.1", "97", "1", "4.8"]);
      rows.push(["BuildRight Co.", "27AABCB5678B1Z3", "21", "5.4", "89", "3", "4.2"]);
      rows.push(["PowerGen Ltd.", "29AABCP9012C1Z1", "18", "1.8", "100", "0", "4.9"]);
      rows.push(["MediaTech Solutions", "33AABCM3456D1Z7", "11", "8.2", "82", "2", "3.9"]);
      rows.push(["EventPro Services", "06AABCE7890E1Z2", "28", "3.6", "93", "1", "4.5"]);
    } else {
      rows.push(["Request ID", "Asset ID", "From Institution", "To Institution", "Status", "Requested", "Delivered"]);
      rows.push(["RD-201", "GA-003", "Ministry of Culture", "Ministry of Education", "Completed", "2024-01-05", "2024-01-09"]);
      rows.push(["RD-202", "GA-005", "Sports Authority", "Ministry of Youth", "In Transit", "2024-01-14", ""]);
      rows.push(["RD-203", "GA-001", "Ministry of Finance", "Ministry of Commerce", "Rejected", "2024-01-18", ""]);
      rows.push(["RD-204", "GA-002", "Ministry of Power", "Ministry of Railways", "Completed", "2024-01-20", "2024-01-24"]);
      rows.push(["RD-205", "GA-004", "Sports Authority", "Ministry of Culture", "Pending", "2024-01-28", ""]);
    }
    rows.push([]);
    rows.push(["Report", name]);
    rows.push(["Period", `${from} to ${to}`]);
    rows.push(["Generated", new Date().toISOString().replace("T", " ").slice(0, 16)]);
    rows.push(["Note", note]);
    return rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  }

  function triggerDownload(csv: string, filename: string) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function downloadReport(r: GeneratedReport) {
    if (r.format !== "CSV") {
      setFormatToast(r.format);
      setTimeout(() => setFormatToast(null), 3500);
      return;
    }
    const csv = buildCSV(r.typeId, r.name, r.dateFrom, r.dateTo);
    triggerDownload(csv, `${r.id}-${r.typeId}.csv`);
  }

  function generate() {
    if (!selType) return;
    setGenerating(true);
    setTimeout(async () => {
      const reportName = `${selType.name} — ${dateFrom} to ${dateTo}`;
      const newReport: GeneratedReport = {
        id: `RPT-${String(recent.length + 6).padStart(3, "0")}`,
        name: reportName,
        typeId: selType.id,
        dateFrom,
        dateTo,
        generatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        generatedBy: "Admin Officer",
        format,
        size: `${(Math.random() * 2 + 0.3).toFixed(1)} MB`,
        status: "ready",
      };
      setRecent((prev) => [newReport, ...prev]);
      // Persist to audit_logs
      const db = createClient();
      await db.from("audit_logs").insert({
        action: "export",
        entity_type: "report",
        new_data: {
          reportName,
          typeId: selType.id,
          dateFrom,
          dateTo,
          format,
          size: newReport.size,
        },
      });
      if (format === "CSV") {
        const csv = buildCSV(selType.id, reportName, dateFrom, dateTo);
        triggerDownload(csv, `${selType.id}-${dateFrom}-to-${dateTo}.csv`);
      }
      setGenerating(false);
    }, 1800);
  }

  return (
    <div className="min-h-dvh bg-surface flex">
      {formatToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <AlertTriangle size={13} className="text-yellow-400 shrink-0" />
          {formatToast} export requires server-side rendering. Select CSV format for immediate download.
        </div>
      )}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">भारत सरकार · GOI</p>
          <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/reports" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}>
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

        <header className="bg-white border-b border-border px-6 py-4">
          <h1 className="text-lg font-black text-gray-900">Reports</h1>
          <p className="text-xs text-gray-400">Generate and download data reports for audits, compliance and reviews</p>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Generator */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-black text-gray-800">Generate New Report</h2>
              <div className="grid grid-cols-2 gap-3">
                {REPORT_TYPES.map((rt) => {
                  const Icon = rt.icon;
                  return (
                    <button key={rt.id} onClick={() => setSelectedType(rt.id === selectedType ? null : rt.id)}
                      className={`text-left p-3 rounded-2xl border transition-all flex flex-col gap-2 ${selectedType === rt.id ? "border-saffron-400 bg-saffron-50" : "border-border bg-white hover:bg-surface"}`}>
                      <div className={`w-8 h-8 rounded-lg ${rt.iconBg} flex items-center justify-center`}><Icon size={15} className={rt.iconCls} /></div>
                      <p className="text-xs font-bold text-gray-900 leading-tight">{rt.name}</p>
                      <p className="text-[10px] text-gray-400 leading-relaxed">{rt.description}</p>
                    </button>
                  );
                })}
              </div>

              {selType && (
                <div className="bg-white border border-border rounded-2xl p-4 flex flex-col gap-3">
                  <p className="text-xs font-bold text-gray-700">Configure: <span className="text-saffron-600">{selType.name}</span></p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">From</label>
                      <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full mt-1 border border-border rounded-xl px-3 py-2 text-xs outline-none bg-surface" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">To</label>
                      <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full mt-1 border border-border rounded-xl px-3 py-2 text-xs outline-none bg-surface" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Format</label>
                    <div className="flex gap-2 mt-1">
                      {selType.formats.map((f) => (
                        <button key={f} onClick={() => setFormat(f)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${format === f ? "border-saffron-400 bg-saffron-50 text-saffron-700" : "border-border bg-surface text-gray-600"}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={generate} disabled={generating} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-saffron-500 text-white text-xs font-bold hover:bg-saffron-600 disabled:opacity-60">
                    {generating ? <><Clock size={13} className="animate-spin" /> Generating…</> : <><Download size={13} /> Generate {format}</>}
                  </button>
                </div>
              )}
            </div>

            {/* Recent Reports */}
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-black text-gray-800">Recent Reports</h2>
              <div className="bg-white border border-border rounded-2xl overflow-hidden">
                {recent.map((r, i) => (
                  <div key={r.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-surface ${i !== 0 ? "border-t border-border" : ""}`}>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{r.name}</p>
                      <p className="text-[10px] text-gray-400">{r.generatedAt} · {r.generatedBy} · {r.size}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${FORMAT_CLS[r.format]}`}>{r.format}</span>
                    <button onClick={() => downloadReport(r)} className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-saffron-600 transition-colors" title={r.format === "CSV" ? "Download CSV" : `${r.format} requires server rendering`}>
                      <Download size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
