import React from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import { CheckCircle, XCircle, ChevronRight, ArrowRight, AlertTriangle } from "lucide-react";

export const metadata = { title: "Supplier Guidelines — GAMS" };

const GUIDELINES = [
  {
    title: "1. Eligibility Requirements",
    items: [
      "Company must be registered in India with a valid CIN (Company Identification Number).",
      "Active GSTIN required — must match company PAN and registered address.",
      "Minimum 2 years of incorporation. Startups may apply under the Startup India exception.",
      "Prior experience in event management, logistics, or government supply preferred.",
      "No active blacklisting by any government ministry, PSU, or MSME registration body.",
    ],
    type: "check",
  },
  {
    title: "2. Products & Listing Standards",
    items: [
      "All products must have an accurate name, category, and specification (multilingual: English + Hindi).",
      "Each product requires at least one high-resolution image (min. 800×600px) with white background.",
      "Pricing must be GEM-compliant. Prices must not exceed your registered GeM catalogue price.",
      "Products must pass GAMS quality verification before QR codes are issued.",
      "Product descriptions must not be misleading. Listing false condition information is a disqualifying offence.",
    ],
    type: "check",
  },
  {
    title: "3. Delivery & Handover",
    items: [
      "All deliveries must be completed within the timeline specified in the Purchase Order (default: 14 days).",
      "Assets must be delivered with individual QR labels pre-attached as specified by GAMS admin.",
      "A signed Delivery Challan must accompany every shipment — this triggers QR scan confirmation.",
      "Partial deliveries are not permitted unless pre-approved by the assigned GAMS admin.",
      "Supplier must maintain valid cargo insurance for all deliveries above ₹5 lakh.",
    ],
    type: "check",
  },
  {
    title: "4. Prohibited Conduct",
    items: [
      "Price manipulation, bid rigging, or collusion with other suppliers.",
      "Delivering assets in worse condition than stated in the listing — attracts penalty and blacklisting.",
      "Creating multiple company accounts to circumvent approval or rating limits.",
      "Soliciting payments or commissions from buyers outside the GAMS platform.",
      "Tampering with, duplicating, or defacing GAMS QR labels.",
    ],
    type: "cross",
  },
  {
    title: "5. Penalties & Suspension",
    items: [
      "First violation: Formal warning and 30-day product listing suspension.",
      "Second violation: 90-day account suspension and clawback of disputed payments.",
      "Third violation: Permanent blacklisting from GAMS and referral to MCA for CIN action.",
      "Fraudulent documentation: Immediate suspension, FIR under IPC Section 420/467, and forfeit of security deposit.",
    ],
    type: "warn",
  },
  {
    title: "6. Payments & Reconciliation",
    items: [
      "GAMS releases payments within 10 working days of delivery confirmation by the buyer institution.",
      "All payments are via NEFT/RTGS to the registered bank account. No cash or cheque payments.",
      "GST invoices (GSTN-compliant) must be submitted within 3 days of delivery for payment processing.",
      "GAMS service fee of 1.5% is deducted from each transaction before payout.",
      "Disputes over payment may be raised within 15 days of payout via the Supplier Dashboard.",
    ],
    type: "check",
  },
];

const CHECKLIST = [
  "GST Registration Certificate (GSTIN)",
  "Company PAN Card",
  "Certificate of Incorporation (MCA/ROC)",
  "Cancelled cheque / Bank passbook (company account)",
  "Board Resolution authorising GAMS signatory",
  "GeM Seller Certificate (if applicable)",
  "MSME Certificate (if registered — optional but expedites review)",
];

export default function CompanyGuidelinesPage() {
  const getIcon = (type: string) => {
    if (type === "check") return <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />;
    if (type === "cross") return <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />;
    return <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5" />;
  };

  const getSectionBg = (type: string) => {
    if (type === "cross") return "bg-red-50/50 border-red-200";
    if (type === "warn") return "bg-yellow-50/50 border-yellow-200";
    return "bg-white border-border";
  };

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Header */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-neutral-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      <header className="bg-white border-b border-border px-6 py-3 flex items-center gap-3">
        <Link href="/company" className="flex items-center gap-2.5">
          <AshokaChakra size={30} />
          <div>
            <p className="text-xs text-gray-400 font-medium">GAMS</p>
            <p className="text-sm font-semibold text-gray-900">Supplier Portal</p>
          </div>
        </Link>
        <nav className="ml-auto flex gap-4 text-sm">
          <Link href="/company/login" className="text-gray-500 hover:text-gray-900">Sign In</Link>
          <Link href="/company/register" className="text-primary font-semibold hover:underline">Register Company</Link>
        </nav>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/company" className="hover:text-gray-700">Supplier Portal</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Supplier Guidelines</span>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FFF8EE] to-white py-10 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">GAMS Supplier Guidelines</h1>
          <p className="text-sm text-gray-500">
            Please read these guidelines carefully before registering as a GAMS supplier.
            Violations may result in suspension or permanent blacklisting.
          </p>
          <p className="text-xs text-gray-400 mt-2">Version 1.0 · Effective 1 January 2026</p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-10 w-full space-y-6">
        {GUIDELINES.map((section) => (
          <div key={section.title} className={`border rounded-2xl p-5 ${getSectionBg(section.type)}`}>
            <h2 className="text-base font-bold text-gray-900 mb-3">{section.title}</h2>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
                  {getIcon(section.type)}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Document checklist */}
        <div className="border border-saffron-200 bg-saffron-50/50 rounded-2xl p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">Registration Document Checklist</h2>
          <p className="text-xs text-gray-500 mb-4">Ensure you have these ready before starting registration:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHECKLIST.map((doc, i) => (
              <div key={doc} className="flex items-start gap-2.5 text-sm text-gray-700">
                <div className="w-5 h-5 rounded bg-saffron-100 border border-saffron-200 flex items-center justify-center shrink-0 text-[10px] font-black text-saffron-700">
                  {i + 1}
                </div>
                {doc}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-6 text-center text-white">
          <h3 className="text-lg font-bold mb-2">Ready to Register?</h3>
          <p className="text-sm text-orange-100 mb-4 max-w-md mx-auto">
            Registration is free and takes under 15 minutes. Once approved, you can list products and bid for government supply orders.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/company/register" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-2.5 rounded-xl hover:bg-orange-50 text-sm">
              Register Your Company <ArrowRight size={14} />
            </Link>
            <Link href="/company/login" className="inline-flex items-center gap-2 border border-orange-400 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-700 text-sm">
              Already Registered → Sign In
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex flex-wrap gap-4 justify-between text-xs text-gray-400">
          <span>Questions? Email: supplier.support@gams.gov.in</span>
          <div className="flex gap-3">
            <Link href="/public/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            <Link href="/public/terms" className="text-primary hover:underline">Terms of Service</Link>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-400 py-4 border-t border-border">
        © 2026 Government of India · GAMS Supplier Portal · GFR 2017 Compliant
      </footer>
    </div>
  );
}
