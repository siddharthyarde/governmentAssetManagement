"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2, Users, Package, CheckCircle2, XCircle,
  Clock, Eye, MoreVertical, Search, ChevronDown,
  AlertTriangle, Filter, Download, ExternalLink,
  FileText, Mail, Phone, MapPin, BadgeCheck,
  RefreshCw, ShieldAlert, TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "companies" | "institutions" | "products";
type ApprovalStatus = "pending" | "approved" | "rejected" | "info_required";

interface Company {
  id: string;
  name: string;
  gstin: string;
  pan: string;
  type: string;
  state: string;
  contact: string;
  email: string;
  phone: string;
  submittedAt: string;
  status: ApprovalStatus;
  docs: number;
  productsPlanned: number;
  notes?: string;
}

interface Institution {
  id: string;
  name: string;
  ministry: string;
  type: string;
  state: string;
  district: string;
  contactPerson: string;
  email: string;
  phone: string;
  submittedAt: string;
  status: ApprovalStatus;
  docs: number;
  notes?: string;
}

interface ProductSubmission {
  id: string;
  name: string;
  category: string;
  company: string;
  companyId: string;
  qty: number;
  unitPrice: number;
  submittedAt: string;
  status: ApprovalStatus;
  hsn: string;
  verified: boolean;
  notes?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const COMPANIES: Company[] = [
  { id: "C001", name: "Arjuna Furniture Pvt. Ltd.", gstin: "27AAACA1234B1Z5", pan: "AAACA1234B", type: "Manufacturer", state: "Maharashtra", contact: "Rahul Arora", email: "rahul@arjunafur.com", phone: "9876543210", submittedAt: "2024-06-14", status: "pending", docs: 5, productsPlanned: 8 },
  { id: "C002", name: "BharatTech Solutions LLP",   gstin: "07AAAFB5678C1Z2", pan: "AAAFB5678C", type: "Trader",       state: "Delhi",       contact: "Sunita Verma",  email: "sunita@btsol.in",   phone: "9123456789", submittedAt: "2024-06-13", status: "pending", docs: 4, productsPlanned: 12 },
  { id: "C003", name: "Green Canopy Infra Co.",      gstin: "29AAACG9012D1Z8", pan: "AAACG9012D", type: "Manufacturer", state: "Karnataka",   contact: "Mohan Das",     email: "mohan@greencanopy.com", phone: "8765432109", submittedAt: "2024-06-12", status: "info_required", docs: 2, productsPlanned: 5, notes: "GST certificate scan unreadable. Please re-upload." },
  { id: "C004", name: "Vega AV Systems Pvt. Ltd.",   gstin: "33AAACV3456E1Z6", pan: "AAACV3456E", type: "Manufacturer", state: "Tamil Nadu",  contact: "Priya Kumar",   email: "priya@vegaav.com",  phone: "9988776655", submittedAt: "2024-06-10", status: "approved", docs: 6, productsPlanned: 15 },
  { id: "C005", name: "SafeGuard Equipment Ltd.",    gstin: "19AAACS7890F1Z3", pan: "AAACS7890F", type: "Importer",    state: "West Bengal", contact: "Deepak Roy",    email: "deepak@safeguard.in", phone: "7766554433", submittedAt: "2024-06-08", status: "rejected", docs: 3, productsPlanned: 4, notes: "MSME registration does not match PAN records." },
];

const INSTITUTIONS: Institution[] = [
  { id: "I001", name: "Delhi State Library",                ministry: "Ministry of Education",           type: "State Library",     state: "Delhi",       district: "Central Delhi",     contactPerson: "Kavita Sharma",    email: "lib@delhigov.in",    phone: "9876501234", submittedAt: "2024-06-14", status: "pending", docs: 4 },
  { id: "I002", name: "AIIMS Lucknow",                      ministry: "Ministry of Health",               type: "Central Hospital",  state: "Uttar Pradesh", district: "Lucknow",          contactPerson: "Dr. R. Srivastava", email: "admin@aiimslko.edu.in", phone: "9123455678", submittedAt: "2024-06-13", status: "pending", docs: 5 },
  { id: "I003", name: "Rajasthan State Police HQ",          ministry: "Ministry of Home Affairs",         type: "Police HQ",         state: "Rajasthan",   district: "Jaipur",            contactPerson: "ACP Sundar Singh", email: "rphq@rajgov.in",     phone: "8877665544", submittedAt: "2024-06-11", status: "approved", docs: 6 },
  { id: "I004", name: "IIT Bombay — Facilities Division",   ministry: "Ministry of Education",           type: "Central University", state: "Maharashtra", district: "Mumbai Suburban",   contactPerson: "Mr. Naik",         email: "facilities@iitb.ac.in", phone: "9988001122", submittedAt: "2024-06-10", status: "info_required", docs: 2, notes: "Letter of authorisation from Director's office is missing." },
  { id: "I005", name: "District Collectorate Nashik",       ministry: "Ministry of Home Affairs",         type: "District Office",   state: "Maharashtra", district: "Nashik",            contactPerson: "Collector Joshi",  email: "collector@nashik.gov.in", phone: "7755331100", submittedAt: "2024-06-08", status: "rejected", docs: 3, notes: "Document tampering suspected. Forwarded to vigilance." },
];

const PRODUCTS: ProductSubmission[] = [
  { id: "P001", name: "Steel Folding Chair 80cm — Black Seat",                category: "Furniture",      company: "Arjuna Furniture Pvt. Ltd.",      companyId: "C001", qty: 8000, unitPrice: 2400,    submittedAt: "2024-06-14", status: "pending",        hsn: "9401", verified: false },
  { id: "P002", name: "LED Par Light 100W RGBW — Stage Grade",               category: "Electronics",    company: "Vega AV Systems Pvt. Ltd.",       companyId: "C004", qty: 500,  unitPrice: 12000,   submittedAt: "2024-06-14", status: "pending",        hsn: "9405", verified: false },
  { id: "P003", name: "Crowd Control Barrier — Galvanised Steel 2.5m",        category: "Safety",         company: "BharatTech Solutions LLP",        companyId: "C002", qty: 2000, unitPrice: 3200,    submittedAt: "2024-06-13", status: "pending",        hsn: "7308", verified: false },
  { id: "P004", name: "AV Amplifier 2000W Rack Mount — JBL PRX",             category: "Electronics",    company: "Vega AV Systems Pvt. Ltd.",       companyId: "C004", qty: 120,  unitPrice: 85000,   submittedAt: "2024-06-10", status: "approved",       hsn: "8518", verified: true },
  { id: "P005", name: "Industrial Generator 125 kVA — Kirloskar",             category: "Electrical",     company: "BharatTech Solutions LLP",        companyId: "C002", qty: 30,   unitPrice: 4200000, submittedAt: "2024-06-09", status: "info_required", hsn: "8502", verified: false, notes: "OEM authorisation letter needed from Kirloskar." },
  { id: "P006", name: "Fire Extinguisher CO2 10kg — BIS Certified",          category: "Safety",         company: "SafeGuard Equipment Ltd.",        companyId: "C005", qty: 300,  unitPrice: 6800,    submittedAt: "2024-06-08", status: "rejected",       hsn: "8424", verified: false, notes: "BIS certificate expired. Product cannot be listed." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

import { createClient } from "@gams/lib/supabase/client";
import type { CompanyRow, InstitutionRow, ProductRow } from "@gams/lib/supabase/database.types";
import { approveCompany, rejectCompany, requestInfoCompany, approveInstitution, rejectInstitution, requestInfoInstitution, approveProduct, rejectProduct } from "../actions";

function mapAppComp(row: CompanyRow): Company {
  const statusMap: Record<string, ApprovalStatus> = {
    pending_review: "pending", documents_requested: "pending",
    approved: "approved", suspended: "approved", blacklisted: "rejected",
  };
  const addr = (row.registered_address as Record<string, string>) ?? {};
  const docs = (row.documents as Record<string, unknown>) ?? {};
  return {
    id: row.company_code, name: row.legal_name, gstin: row.gstin ?? "—",
    pan: row.pan, type: "Manufacturer",
    state: addr.state ?? "—",
    contact: addr.contact_name ?? row.contact_email,
    email: row.contact_email, phone: row.contact_mobile,
    submittedAt: row.created_at.split("T")[0],
    status: (statusMap[row.status] as ApprovalStatus) ?? "pending",
    docs: Object.values(docs).filter(Boolean).length,
    productsPlanned: 0, notes: row.review_notes ?? undefined,
  };
}

function mapAppInst(row: InstitutionRow): Institution {
  const statusMap: Record<string, ApprovalStatus> = {
    pending_review: "pending", documents_requested: "info_required",
    approved: "approved", suspended: "approved", blacklisted: "rejected",
  };
  const addr = (row.registered_address as Record<string, string>) ?? {};
  const docs = (row.documents as Record<string, unknown>) ?? {};
  return {
    id: row.institution_code, name: row.name, ministry: "—",
    type: row.institution_type.replace(/_/g, " "),
    state: addr.state ?? "—",
    district: addr.district ?? addr.city ?? "—",
    contactPerson: row.nodal_officer ?? row.head_of_organisation ?? "—",
    email: row.contact_email, phone: row.contact_mobile,
    submittedAt: row.created_at.split("T")[0],
    status: (statusMap[row.status] as ApprovalStatus) ?? "pending",
    docs: Object.values(docs).filter(Boolean).length,
    notes: row.review_notes ?? undefined,
  };
}

function mapAppProd(row: ProductRow): ProductSubmission {
  const statusMap: Record<string, ApprovalStatus> = {
    draft: "pending", pending_approval: "pending",
    approved: "approved", rejected: "rejected", discontinued: "rejected",
  };
  return {
    id: row.product_code, name: row.name, category: row.category,
    company: "—", companyId: row.company_id, qty: 0,
    unitPrice: Math.round(row.original_price_paise / 100),
    submittedAt: row.created_at.split("T")[0],
    status: (statusMap[row.status] as ApprovalStatus) ?? "pending",
    hsn: row.hsn_code ?? "—",
    verified: row.status === "approved",
    notes: row.rejection_reason ?? undefined,
  };
}

function formatPrice(n: number) {
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(n % 1_00_000 === 0 ? 0 : 1)}L`;
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `₹${n}`;
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const map: Record<ApprovalStatus, { label: string; cls: string }> = {
    pending:       { label: "Pending Review",  cls: "bg-yellow-100 text-yellow-700" },
    approved:      { label: "Approved",        cls: "bg-green-100 text-green-700"  },
    rejected:      { label: "Rejected",        cls: "bg-red-100 text-red-700"      },
    info_required: { label: "Info Required",   cls: "bg-blue-100 text-blue-700"    },
  };
  const { label, cls } = map[status];
  return <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

type ReviewTarget =
  | { kind: "company";     item: Company }
  | { kind: "institution"; item: Institution }
  | { kind: "product";     item: ProductSubmission };

function ReviewModal({ target, onClose }: { target: ReviewTarget; onClose: () => void }) {
  const [action, setAction]       = useState<"approve" | "reject" | "info" | null>(null);
  const [reason, setReason]       = useState("");
  const [done, setDone]           = useState(false);
  const [working, setWorking]     = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  async function handleConfirm() {
    if (!action || (action !== "approve" && !reason.trim())) return;
    setWorking(true);
    setSubmitErr(null);
    try {
      const code = target.item.id;
      if (target.kind === "company") {
        if (action === "approve") await approveCompany(code);
        else if (action === "reject") await rejectCompany(code, reason);
        else await requestInfoCompany(code, reason);
      } else if (target.kind === "institution") {
        if (action === "approve") await approveInstitution(code);
        else if (action === "reject") await rejectInstitution(code, reason);
        else await requestInfoInstitution(code, reason);
      } else {
        if (action === "approve") await approveProduct(code);
        else await rejectProduct(code, reason);
      }
      setDone(true);
    } catch (err) {
      setSubmitErr(err instanceof Error ? err.message : "Action failed. Please try again.");
    } finally {
      setWorking(false);
    }
  }

  const label = target.kind === "company" ? target.item.name : target.kind === "institution" ? target.item.name : target.item.name;

  if (done) {
    const actionLabel = action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Info Requested";
    const actionColor = action === "approve" ? "text-green-700 bg-green-100" : action === "reject" ? "text-red-700 bg-red-100" : "text-blue-700 bg-blue-100";
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${actionColor}`}>
            {action === "approve" ? <CheckCircle2 size={26} /> : action === "reject" ? <XCircle size={26} /> : <RefreshCw size={26} />}
          </div>
          <h3 className="font-bold text-gray-900 mb-2">{actionLabel}!</h3>
          <p className="text-sm text-gray-500 mb-5">
            <strong>{label}</strong> has been {actionLabel.toLowerCase()}. The applicant will be notified via email.
          </p>
          <button onClick={onClose} className="w-full text-white font-bold py-2.5 rounded-xl" style={{ background: "#E07B00" }}>
            Back to Queue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between" style={{ background: "#E07B0008" }}>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{label}</h3>
            <p className="text-xs text-gray-400 capitalize">{target.kind} review</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-gray-400"><XCircle size={16} /></button>
        </div>

        <div className="p-6 flex flex-col gap-4 max-h-[70dvh] overflow-y-auto">
          {/* Details */}
          {target.kind === "company" && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["GSTIN",       target.item.gstin],
                ["PAN",         target.item.pan],
                ["Type",        target.item.type],
                ["State",       target.item.state],
                ["Contact",     target.item.contact],
                ["Email",       target.item.email],
                ["Phone",       target.item.phone],
                ["Docs Uploaded", `${target.item.docs} documents`],
                ["Plans to List",  `${target.item.productsPlanned} products`],
                ["Submitted",   target.item.submittedAt],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{k}</p>
                  <p className="font-semibold text-gray-900 truncate">{v}</p>
                </div>
              ))}
            </div>
          )}

          {target.kind === "institution" && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Ministry",    target.item.ministry],
                ["Type",        target.item.type],
                ["State",       target.item.state],
                ["District",    target.item.district],
                ["Contact",     target.item.contactPerson],
                ["Email",       target.item.email],
                ["Phone",       target.item.phone],
                ["Docs Uploaded", `${target.item.docs} documents`],
                ["Submitted",   target.item.submittedAt],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{k}</p>
                  <p className="font-semibold text-gray-900 truncate">{v}</p>
                </div>
              ))}
            </div>
          )}

          {target.kind === "product" && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Company",     target.item.company],
                ["Category",    target.item.category],
                ["HSN Code",    target.item.hsn],
                ["Quantity",    target.item.qty.toLocaleString("en-IN")],
                ["Unit Price",  formatPrice(target.item.unitPrice)],
                ["Batch Value", formatPrice(target.item.qty * target.item.unitPrice)],
                ["Submitted",   target.item.submittedAt],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{k}</p>
                  <p className="font-semibold text-gray-900 truncate">{v}</p>
                </div>
              ))}
            </div>
          )}

          {/* Existing notes */}
          {(target.item as Company | Institution | ProductSubmission).notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-600 font-semibold mb-1">Existing Note</p>
              <p className="text-sm text-blue-700">{(target.item as Company | Institution | ProductSubmission).notes}</p>
            </div>
          )}

          {/* Docs link */}
          <button
            onClick={() => downloadDocManifest(target.item, target.kind)}
            className="flex items-center gap-2 text-sm font-semibold text-saffron-600 hover:text-saffron-700"
          >
            <FileText size={14} /> View Uploaded Documents <ExternalLink size={12} />
          </button>

          {/* Action selector */}
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Action</p>
            <div className="flex gap-2">
              {[
                { key: "approve", label: "Approve", icon: CheckCircle2, cls: "border-green-500 bg-green-50 text-green-700" },
                { key: "reject",  label: "Reject",  icon: XCircle,      cls: "border-red-500 bg-red-50 text-red-700"      },
                { key: "info",    label: "Request Info", icon: RefreshCw, cls: "border-blue-500 bg-blue-50 text-blue-700" },
              ].map(({ key, label, icon: Icon, cls }) => (
                <button
                  key={key}
                  onClick={() => setAction(key as "approve" | "reject" | "info")}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl border-2 transition-colors ${action === key ? cls : "border-border bg-white text-gray-600"}`}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          {action && action !== "approve" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                {action === "reject" ? "Rejection Reason" : "Info Requested"} <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-saffron-400"
                rows={3}
                placeholder={action === "reject" ? "State the reason for rejection (sent to applicant)…" : "Specify what additional info/docs are needed…"}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}

          {/* Error */}
          {submitErr && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <p className="text-sm text-red-700">{submitErr}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} disabled={working} className="flex-1 border border-border rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-surface disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={working || !action || (action !== "approve" && !reason.trim())}
              className="flex-1 text-white text-sm font-bold py-2.5 rounded-xl disabled:opacity-40 hover:opacity-90 transition-opacity"
              style={{ background: "#E07B00" }}
            >
              {working ? "Processing…" : `Confirm ${action === "approve" ? "Approval" : action === "reject" ? "Rejection" : action === "info" ? "Request" : "Action"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Page helpers ─────────────────────────────────────────────────────────────────

function csvDownload(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadDocManifest(item: Company | Institution | ProductSubmission, kind: string) {
  const docs = (item as Company).docs ?? 0;
  const docTypes = kind === "company"
    ? ["GSTIN Certificate", "PAN Card Copy", "MSME Certificate", "Cancelled Cheque", "Director ID Proof", "Balance Sheet", "GST Returns"]
    : kind === "institution"
    ? ["Authorisation Letter", "Registration Certificate", "Ministry Approval", "Contact ID Proof", "Budget Sanction Letter", "Audit Report"]
    : ["Product Specification Sheet", "Quality Certificate", "HSN Declaration", "OEM Authorisation", "BIS/ISI Certificate"];
  const rows: string[][] = [
    ["GAMS — Document Manifest"],
    ["Entity ID", item.id],
    ["Entity Name", item.name],
    ["Type", kind.charAt(0).toUpperCase() + kind.slice(1)],
    ["Status", item.status],
    [""],
    ["#", "Document Name", "Status"],
    ...docTypes.slice(0, docs).map((d, i) => [String(i + 1), d, "Uploaded"]),
    [""],
    ["Generated", new Date().toLocaleString("en-IN")],
  ];
  csvDownload(rows, `Docs-${item.id}.csv`);
}
// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApprovalsPage() {
  const [companies, setCompanies]       = useState<Company[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [products, setProducts]         = useState<ProductSubmission[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]           = useState<Tab>("companies");
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatus] = useState<ApprovalStatus | "all">("all");
  const [review, setReview]     = useState<ReviewTarget | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const db = createClient();
    Promise.all([
      db.from("companies").select("*").order("created_at", { ascending: false }),
      db.from("institutions").select("*").order("created_at", { ascending: false }),
      db.from("products").select("*").order("created_at", { ascending: false }),
    ]).then(([{ data: cos, error: ce }, { data: ins, error: ie }, { data: pros, error: pe }]) => {
      setCompanies(!ce && cos ? (cos as CompanyRow[]).map(mapAppComp) : []);
      setInstitutions(!ie && ins ? (ins as InstitutionRow[]).map(mapAppInst) : []);
      setProducts(!pe && pros ? (pros as ProductRow[]).map(mapAppProd) : []);
      setLoading(false);
    });
  }, []);

  const pendingCo  = companies.filter((c) => c.status === "pending").length;
  const pendingIn  = institutions.filter((i) => i.status === "pending").length;
  const pendingPr  = products.filter((p) => p.status === "pending").length;

  const filteredCompanies = companies.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.gstin.includes(search)) return false;
    return true;
  });

  const filteredInstitutions = institutions.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredProducts = products.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const TABS: { key: Tab; label: string; icon: React.ElementType; badge: number }[] = [
    { key: "companies",    label: "Companies",    icon: Building2, badge: pendingCo },
    { key: "institutions", label: "Institutions", icon: Users,     badge: pendingIn },
    { key: "products",     label: "Products",     icon: Package,   badge: pendingPr },
  ];

  return (
    <div className="min-h-dvh bg-surface">
      {/* Tiranga bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="px-4 md:px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-lg font-black text-gray-900">GAMS</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-sm font-bold text-gray-900">Approval Queues</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                if (tab === "companies") {
                  csvDownload(
                    [["ID", "Name", "GSTIN", "Type", "State", "Contact", "Email", "Submitted", "Status", "Docs"],
                     ...filteredCompanies.map((c) => [c.id, c.name, c.gstin, c.type, c.state, c.contact, c.email, c.submittedAt, c.status, String(c.docs)])],
                    `Approvals-Companies-${new Date().toISOString().slice(0,10)}.csv`,
                  );
                } else if (tab === "institutions") {
                  csvDownload(
                    [["ID", "Name", "Ministry", "Type", "State", "District", "Contact", "Email", "Submitted", "Status", "Docs"],
                     ...filteredInstitutions.map((i) => [i.id, i.name, i.ministry, i.type, i.state, i.district, i.contactPerson, i.email, i.submittedAt, i.status, String(i.docs)])],
                    `Approvals-Institutions-${new Date().toISOString().slice(0,10)}.csv`,
                  );
                } else {
                  csvDownload(
                    [["ID", "Product Name", "Category", "Company", "Qty", "Unit Price", "HSN", "Submitted", "Status"],
                     ...filteredProducts.map((p) => [p.id, p.name, p.category, p.company, String(p.qty), String(p.unitPrice), p.hsn, p.submittedAt, p.status])],
                    `Approvals-Products-${new Date().toISOString().slice(0,10)}.csv`,
                  );
                }
              }}
              className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 text-xs text-gray-600 font-semibold hover:bg-surface"
            >
              <Download size={13} /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Clock,        label: "Pending Review",   val: pendingCo + pendingIn + pendingPr, color: "text-yellow-600", bg: "bg-yellow-50" },
            { icon: CheckCircle2, label: "Approved Today",   val: 4,                                  color: "text-green-600",  bg: "bg-green-50"  },
            { icon: XCircle,      label: "Rejected",         val: 3,                                  color: "text-red-600",    bg: "bg-red-50"    },
            { icon: ShieldAlert,  label: "Info Required",    val: 3,                                  color: "text-blue-600",   bg: "bg-blue-50"   },
          ].map(({ icon: Icon, label, val, color, bg }) => (
            <div key={label} className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{val}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="bg-white border border-border rounded-2xl p-1 flex gap-1">
          {TABS.map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSearch(""); setStatus("all"); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${tab === key ? "text-white" : "text-gray-600 hover:bg-surface"}`}
              style={tab === key ? { background: "#E07B00" } : {}}
            >
              <Icon size={14} /> {label}
              {badge > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${tab === key ? "bg-white text-saffron-600" : "bg-yellow-100 text-yellow-700"}`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-saffron-400"
              placeholder={`Search ${tab}…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatus(e.target.value as ApprovalStatus | "all")}
              className="border border-border rounded-xl pl-9 pr-8 py-2.5 text-sm bg-white focus:outline-none focus:border-saffron-400 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="info_required">Info Required</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* ── Companies Table ────────────────────────────────────────────── */}
        {tab === "companies" && (
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">Company Registrations</p>
              <p className="text-xs text-gray-400">{filteredCompanies.length} records</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    {["Company", "GSTIN", "Type", "State", "Docs", "Products Planned", "Submitted", "Status", ""].map((h) => (
                      <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{c.name}</p>
                        <p className="text-[10px] text-gray-400">{c.id}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{c.gstin}</td>
                      <td className="px-4 py-3 text-gray-600">{c.type}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-gray-600"><MapPin size={10} /> {c.state}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="flex items-center gap-1 text-xs font-semibold text-saffron-600 hover:text-saffron-700">
                          <FileText size={11} /> {c.docs} docs
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">{c.productsPlanned}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{c.submittedAt}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReview({ kind: "company", item: c })}
                            className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-xl hover:opacity-90"
                            style={{ background: "#E07B00" }}
                          >
                            <Eye size={11} /> Review
                          </button>
                          <div className="relative">
                            <button onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)} className="p-1.5 rounded-xl hover:bg-surface text-gray-400">
                              <MoreVertical size={14} />
                            </button>
                            {openMenu === c.id && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-10 py-1 min-w-36">
                                {[
                                  { icon: Mail,       label: "Send Email",   action: () => { window.location.href = `mailto:${(c as Company).email}`; } },
                                  { icon: Phone,      label: "Call Contact", action: () => { window.location.href = `tel:+91${(c as Company).phone}`; } },
                                  { icon: BadgeCheck, label: "View Profile", action: () => setReview({ kind: "company", item: c }) },
                                ].map(({ icon: Icon, label, action }) => (
                                  <button key={label} onClick={() => { action(); setOpenMenu(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-xs text-gray-700 hover:bg-surface font-semibold">
                                    <Icon size={12} /> {label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Institutions Table ─────────────────────────────────────────── */}
        {tab === "institutions" && (
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">Institution Registrations</p>
              <p className="text-xs text-gray-400">{filteredInstitutions.length} records</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    {["Institution", "Ministry", "Type", "State / District", "Docs", "Submitted", "Status", ""].map((h) => (
                      <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredInstitutions.map((i) => (
                    <tr key={i.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{i.name}</p>
                        <p className="text-[10px] text-gray-400">{i.id} · {i.contactPerson}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{i.ministry}</td>
                      <td className="px-4 py-3 text-gray-600">{i.type}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900 text-xs font-semibold">{i.state}</p>
                        <p className="text-gray-400 text-[10px]">{i.district}</p>
                      </td>
                      <td className="px-4 py-3">
                        <button className="flex items-center gap-1 text-xs font-semibold text-saffron-600 hover:text-saffron-700">
                          <FileText size={11} /> {i.docs} docs
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{i.submittedAt}</td>
                      <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setReview({ kind: "institution", item: i })}
                          className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-xl hover:opacity-90"
                          style={{ background: "#E07B00" }}
                        >
                          <Eye size={11} /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Products Table ─────────────────────────────────────────────── */}
        {tab === "products" && (
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">Product Submissions</p>
              <p className="text-xs text-gray-400">{filteredProducts.length} records</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    {["Product", "Company", "Category", "Qty", "Unit Price", "Batch Value", "Submitted", "Status", ""].map((h) => (
                      <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900 max-w-52 truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-400">{p.id} · HSN {p.hsn}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-32 truncate">{p.company}</td>
                      <td className="px-4 py-3 text-gray-600">{p.category}</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{p.qty.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-gray-600">{formatPrice(p.unitPrice)}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">{formatPrice(p.qty * p.unitPrice)}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{p.submittedAt}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setReview({ kind: "product", item: p })}
                          className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-xl hover:opacity-90"
                          style={{ background: "#E07B00" }}
                        >
                          <Eye size={11} /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity summary */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-border rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-saffron-600" /> Approval Velocity</h3>
            {[
              { label: "Companies Approved (last 7 days)", val: 8,  total: 12 },
              { label: "Institutions Approved",            val: 5,  total: 7  },
              { label: "Products Approved",                val: 14, total: 20 },
            ].map(({ label, val, total }) => (
              <div key={label} className="flex flex-col gap-1 mb-3 last:mb-0">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-bold text-gray-900">{val}/{total}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(val / total) * 100}%`, background: "#E07B00" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-border rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle size={14} className="text-yellow-600" /> Attention Required</h3>
            {[
              { title: "C003 — Green Canopy Infra Co.",        note: "GST cert unreadable",          ago: "2 days ago",   color: "bg-blue-500"   },
              { title: "I004 — IIT Bombay Facilities",         note: "Director auth letter missing",  ago: "3 days ago",   color: "bg-blue-500"   },
              { title: "P005 — Kirloskar Generator",           note: "OEM authorisation needed",      ago: "4 days ago",   color: "bg-yellow-500" },
              { title: "C005 — SafeGuard Equipment",           note: "MSME-PAN mismatch",             ago: "5 days ago",   color: "bg-red-500"    },
            ].map(({ title, note, ago, color }) => (
              <div key={title} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{title}</p>
                  <p className="text-[10px] text-gray-400">{note} · {ago}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {review && <ReviewModal target={review} onClose={() => setReview(null)} />}

      {/* Click outside to close menus */}
      {openMenu && <div className="fixed inset-0 z-0" onClick={() => setOpenMenu(null)} />}
    </div>
  );
}
