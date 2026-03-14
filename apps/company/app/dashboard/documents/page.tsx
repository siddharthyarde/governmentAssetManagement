"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  FileText, Upload, CheckCircle2, AlertCircle, Clock,
  Download, Trash2, Eye, Plus, X, Shield, Building2,
  Package, FileCheck, Tag, RefreshCw, Lock, Info,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = "verified" | "pending" | "rejected" | "missing";

interface DocEntry {
  id:          string;
  name:        string;
  type:        string;
  size:        string;
  uploadedAt:  string;
  expiresAt?:  string;
  status:      DocStatus;
  rejNote?:    string;
}

type DocSection = {
  title:    string;
  icon:     React.ElementType;
  required: boolean;
  docs:     DocEntry[];
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SECTIONS: DocSection[] = [
  {
    title: "Company Registration", icon: Building2, required: true,
    docs: [
      { id: "d1", name: "Certificate of Incorporation",   type: "PDF", size: "1.2 MB", uploadedAt: "2024-03-10", status: "verified" },
      { id: "d2", name: "Memorandum of Association",      type: "PDF", size: "2.8 MB", uploadedAt: "2024-03-10", status: "verified" },
      { id: "d3", name: "Articles of Association",        type: "PDF", size: "1.5 MB", uploadedAt: "2024-03-10", status: "verified" },
    ],
  },
  {
    title: "Tax & Compliance", icon: Shield, required: true,
    docs: [
      { id: "d4", name: "GST Registration Certificate",  type: "PDF", size: "0.5 MB", uploadedAt: "2024-03-12", expiresAt: "2025-03-31", status: "verified" },
      { id: "d5", name: "PAN Card",                      type: "PDF", size: "0.2 MB", uploadedAt: "2024-03-12", status: "verified" },
      { id: "d6", name: "TAN Certificate",               type: "PDF", size: "0.3 MB", uploadedAt: "2024-03-15", status: "pending" },
      { id: "d7", name: "ITR Last 3 Years",              type: "ZIP", size: "8.4 MB", uploadedAt: "2024-03-15", status: "rejected", rejNote: "ITR for FY 2021-22 appears to have incorrect signatory. Please re-upload." },
    ],
  },
  {
    title: "MSME & Industry Certifications", icon: Tag, required: false,
    docs: [
      { id: "d8", name: "MSME Udyam Registration",       type: "PDF", size: "0.4 MB", uploadedAt: "2024-04-02", expiresAt: "2027-04-01", status: "verified" },
      { id: "d9", name: "BIS/IS Certification",          type: "PDF", size: "1.1 MB", uploadedAt: "2024-04-05", status: "pending" },
    ],
  },
  {
    title: "Make in India (MII)", icon: Package, required: false,
    docs: [
      { id: "d10", name: "MII Certification (DPIIT)",    type: "PDF", size: "0.9 MB", uploadedAt: "2024-04-10", expiresAt: "2026-04-09", status: "verified" },
    ],
  },
  {
    title: "GeM Portal", icon: FileCheck, required: false,
    docs: [
      { id: "d11", name: "GeM Seller Registration",      type: "PDF", size: "0.6 MB", uploadedAt: "2024-04-12", status: "verified" },
    ],
  },
  {
    title: "Product Brochures & Specs", icon: FileText, required: false,
    docs: [],
  },
];

const STATUS_META: Record<DocStatus, { label: string; cls: string; icon: React.ElementType }> = {
  verified: { label: "Verified",  cls: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  pending:  { label: "Pending",   cls: "bg-yellow-100 text-yellow-700",icon: Clock        },
  rejected: { label: "Rejected",  cls: "bg-red-100 text-red-700",      icon: AlertCircle  },
  missing:  { label: "Missing",   cls: "bg-gray-100 text-gray-500",    icon: AlertCircle  },
};

function sectionSummary(docs: DocEntry[]) {
  const verified  = docs.filter((d) => d.status === "verified").length;
  const rejected  = docs.filter((d) => d.status === "rejected").length;
  const pending   = docs.filter((d) => d.status === "pending").length;
  return { verified, rejected, pending, total: docs.length };
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

function UploadModal({ section, onClose }: { section: string; onClose: () => void }) {
  const [dragging, setDragging]       = useState(false);
  const [file, setFile]               = useState<File | null>(null);
  const [done, setDone]               = useState(false);
  const [docName, setDocName]         = useState("");
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef                      = useRef<HTMLInputElement>(null);

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={24} className="text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Document Uploaded</h3>
          <p className="text-sm text-gray-500 mb-5">Your document has been submitted for review. GAMS admins will verify it within 2–3 business days.</p>
          <button onClick={onClose} className="w-full text-white font-bold py-2.5 rounded-xl" style={{ background: "#E07B00" }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Upload Document</h3>
            <p className="text-xs text-gray-400 mt-0.5">To: {section}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-gray-400"><X size={16} /></button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Document Name</label>
            <input value={docName} onChange={(e) => setDocName(e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400" placeholder="e.g. GST Certificate 2024-25" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">File</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors ${dragging ? "border-saffron-400 bg-saffron-50" : file ? "border-green-400 bg-green-50" : "border-border hover:border-saffron-300"}`}
            >
              <input ref={inputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.zip" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
              {file ? (
                <>
                  <CheckCircle2 size={24} className="text-green-600" />
                  <p className="text-sm font-bold text-green-700">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-gray-300" />
                  <p className="text-sm font-semibold text-gray-500">Drag & drop or click to select</p>
                  <p className="text-xs text-gray-400">PDF, JPG, PNG or ZIP · max 25 MB</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Expiry Date (if applicable)</label>
            <input type="date" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-500 bg-surface border border-border rounded-xl p-3">
            <Lock size={12} className="shrink-0 mt-0.5 text-gray-400" />
            <p>Documents are encrypted at rest and only accessible to GAMS admin reviewers.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-border rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-surface">Cancel</button>
            <button
              onClick={async () => {
                if (!file) return;
                setUploading(true);
                setUploadError(null);
                try {
                  const db = createClient();
                  const { data: { user } } = await db.auth.getUser();
                  const userId = user?.id ?? "anonymous";
                  const slug = section.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                  const ext = file.name.split(".").pop() ?? "bin";
                  const name = docName.trim() || file.name.replace(/\.[^.]+$/, "");
                  const path = `companies/${userId}/${slug}/${Date.now()}-${name.replace(/\s+/g, "_")}.${ext}`;
                  const { error } = await db.storage.from("gams-documents").upload(path, file, { cacheControl: "3600", upsert: false });
                  if (error) throw new Error(error.message);
                  setDone(true);
                } catch (err: any) {
                  setUploadError(err.message ?? "Upload failed. Please try again.");
                } finally {
                  setUploading(false);
                }
              }}
              disabled={!file || uploading}
              className="flex-1 text-white text-sm font-bold py-2.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#E07B00" }}
            >
              {uploading ? "Uploading…" : "Upload Document"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompanyDocumentsPage() {
  const [uploadSection, setUploadSection] = useState<string | null>(null);

  const allDocs     = SECTIONS.flatMap((s) => s.docs);
  const verified    = allDocs.filter((d) => d.status === "verified").length;
  const rejected    = allDocs.filter((d) => d.status === "rejected").length;
  const pending     = allDocs.filter((d) => d.status === "pending").length;
  const profilePct  = Math.round((verified / allDocs.length) * 100);

  return (
    <div className="min-h-dvh bg-surface">
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="text-lg font-black text-gray-900">GAMS</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-sm font-bold text-gray-900">Documents</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">

        {/* Compliance banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Verified",  val: verified.toString(),  color: "text-green-600",  bg: "bg-green-50"    },
            { label: "Pending",   val: pending.toString(),   color: "text-yellow-600", bg: "bg-yellow-50"   },
            { label: "Rejected",  val: rejected.toString(),  color: "text-red-600",    bg: "bg-red-50"      },
            { label: "Profile Completion", val: `${profilePct}%`, color: "text-saffron-600", bg: "bg-saffron-50" },
          ].map(({ label, val, color, bg }) => (
            <div key={label} className={`${bg} border border-border rounded-2xl p-4`}>
              <p className={`text-2xl font-black ${color}`}>{val}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Profile completion bar */}
        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-bold text-gray-900">Document Profile</span>
            <span className="font-black text-saffron-600">{profilePct}% complete</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${profilePct}%`, background: "#E07B00" }} />
          </div>
          {rejected > 0 && (
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
              <AlertCircle size={11} /> {rejected} document{rejected > 1 ? "s" : ""} rejected — re-upload to complete your profile.
            </p>
          )}
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => {
          const sum  = sectionSummary(section.docs);
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white border border-border rounded-2xl overflow-hidden">
              {/* Section header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-gray-500" />
                  <p className="font-bold text-gray-900 text-sm">{section.title}</p>
                  {section.required && <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Required</span>}
                </div>
                <div className="flex items-center gap-3">
                  {sum.total > 0 && (
                    <span className="text-xs text-gray-400">
                      {sum.verified}/{sum.total} verified
                    </span>
                  )}
                  <button
                    onClick={() => setUploadSection(section.title)}
                    className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-lg hover:opacity-90"
                    style={{ background: "#E07B00" }}
                  >
                    <Plus size={11} /> Upload
                  </button>
                </div>
              </div>

              {/* Doc list */}
              {section.docs.length > 0 ? (
                <div className="divide-y divide-border">
                  {section.docs.map((doc) => {
                    const meta    = STATUS_META[doc.status];
                    const MetaIcon = meta.icon;
                    return (
                      <div key={doc.id} className="px-6 py-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                          <FileText size={16} className="text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{doc.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{doc.type} · {doc.size} · Uploaded {doc.uploadedAt}</p>
                          {doc.expiresAt && <p className="text-[10px] text-gray-400">Expires: {doc.expiresAt}</p>}
                          {doc.status === "rejected" && doc.rejNote && (
                            <div className="flex items-start gap-1.5 mt-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-2">
                              <AlertCircle size={11} className="shrink-0 mt-0.5" />
                              <span>{doc.rejNote}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${meta.cls}`}>
                            <MetaIcon size={9} /> {meta.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-surface text-gray-400" title="Preview"><Eye size={13} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-surface text-gray-400" title="Download"><Download size={13} /></button>
                            {doc.status !== "verified" && (
                              <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500" title="Delete"><Trash2 size={13} /></button>
                            )}
                            {doc.status === "rejected" && (
                              <button onClick={() => setUploadSection(section.title)} className="text-[10px] font-bold text-red-600 border border-red-300 px-2.5 py-1 rounded-lg hover:bg-red-50 flex items-center gap-1">
                                <RefreshCw size={9} /> Re-upload
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText size={28} className="text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No documents uploaded yet</p>
                  <button onClick={() => setUploadSection(section.title)} className="mt-3 text-xs font-bold text-saffron-600 hover:underline flex items-center gap-1">
                    <Upload size={11} /> Upload your first document
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Notice */}
        <div className="flex items-start gap-3 text-xs text-gray-500 bg-white border border-border rounded-xl p-4">
          <Info size={13} className="shrink-0 mt-0.5 text-gray-400" />
          <p>All documents are securely stored and encrypted. Verified documents cannot be deleted. Contact <span className="font-bold text-saffron-600">support@gams.gov.in</span> if you need to update a verified document.</p>
        </div>
      </div>

      {uploadSection && <UploadModal section={uploadSection} onClose={() => setUploadSection(null)} />}
    </div>
  );
}
