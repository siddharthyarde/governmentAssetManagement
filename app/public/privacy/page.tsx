import React from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import { Shield, ChevronRight } from "lucide-react";

export const metadata = { title: "Privacy Policy — GAMS" };

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: [
      "Mobile number and Aadhaar-linked identity (for citizen accounts, verified via OTP).",
      "Official email, GST/PAN/CIN details for supplier and institutional accounts.",
      "Asset scan logs including location (GPS coordinates) and timestamp at point of QR scan.",
      "Purchase and order records including quantities, amounts, and delivery addresses.",
      "Device information and browser metadata for security audit purposes.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "To verify your identity under the IT Act 2000 and Aadhaar Act 2016 frameworks.",
      "To process and fulfil asset orders and generate Disposal Certificates under GFR 2017.",
      "To maintain immutable audit logs in accordance with CVC transparency guidelines.",
      "To send transactional notifications (order updates, approval statuses, OTPs).",
      "To generate aggregated, anonymised reports for Ministry of Finance dashboard.",
    ],
  },
  {
    title: "3. Data Sharing",
    body: [
      "GAMS does not sell or rent personal data to any third party.",
      "Data may be shared with NIC-hosted infrastructure for hosting and backup under MoU.",
      "Razorpay receives minimal data (amount, order ID) required to process payments — no full card data is stored by GAMS.",
      "Data may be disclosed to law enforcement agencies under valid court orders or RTI requests.",
      "Aggregated, non-identified data may appear in public GOI dashboard reports.",
    ],
  },
  {
    title: "4. Data Retention",
    body: [
      "Transaction records are retained for 7 years per GFR 2017 and Indian Accounting Standards.",
      "Audit logs are immutable: once written, they cannot be modified or deleted by any user.",
      "Inactive citizen accounts may be purged after 3 years of inactivity with prior notice.",
      "QR scan records are retained indefinitely as they form the asset chain-of-custody record.",
    ],
  },
  {
    title: "5. Your Rights",
    body: [
      "You may request a copy of your personal data by writing to dataprotection@gams.gov.in.",
      "You may request correction of inaccurate personal data through the account settings page.",
      "You may request account deletion — note that transaction records will be retained for compliance.",
      "Citizens may raise RTI requests for any GAMS transaction data in the public interest.",
    ],
  },
  {
    title: "6. Security",
    body: [
      "All data in transit is encrypted using TLS 1.3. Data at rest is encrypted using AES-256.",
      "QR codes are HMAC-SHA256 signed to prevent tampering or forgery.",
      "Access is role-based: staff cannot access data outside their assigned ministry/department.",
      "Penetration testing is conducted bi-annually by empanelled CERT-In auditors.",
    ],
  },
  {
    title: "7. Cookies",
    body: [
      "GAMS uses strictly necessary cookies for session management — no tracking or advertising cookies.",
      "Session cookies expire when your browser is closed or after 24 hours of inactivity.",
      "No third-party analytics or marketing cookies are used on GAMS portals.",
    ],
  },
  {
    title: "8. Contact & Grievances",
    body: [
      "Data Protection Officer: dataprotection@gams.gov.in",
      "Grievance Officer: grievance@gams.gov.in (response within 15 working days as per IT Rules 2021)",
      "Physical address: Ministry of Finance, North Block, New Delhi — 110001",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Tiranga accent */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-neutral-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Nav */}
      <header className="bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-3">
        <Link href="/public" className="flex items-center gap-2.5">
          <AshokaChakra size={30} />
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">GAMS</p>
            <p className="text-sm font-black text-gray-900 leading-tight">Government Asset Management</p>
          </div>
        </Link>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/public/marketplace" className="text-gray-500 hover:text-gray-900 font-medium hidden sm:block">Marketplace</Link>
          <Link href="/public/about" className="text-gray-500 hover:text-gray-900 font-medium hidden sm:block">About</Link>
          <Link href="/public/login" className="text-sm font-semibold border border-border px-3 py-1.5 rounded-lg hover:bg-surface">Sign In</Link>
        </nav>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/public" className="hover:text-gray-700">Home</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Privacy Policy</span>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#FFF8EE] to-white py-10 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-saffron-100 flex items-center justify-center shrink-0">
              <Shield size={24} className="text-saffron-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Privacy Policy</h1>
              <p className="text-sm text-gray-500">
                Government Asset Management System (GAMS) · Ministry of Finance, Government of India
              </p>
              <p className="text-xs text-gray-400 mt-1">Last updated: 1 January 2026 · Effective from launch</p>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
            <strong>Note:</strong> GAMS is a Government of India portal operated under the Ministry of Finance.
            Your data is protected under the Information Technology Act 2000, the Digital Personal Data Protection Act 2023,
            and GFR 2017.
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-10 w-full">
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-border">{section.title}</h2>
              <ul className="space-y-2">
                {section.body.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-xs text-gray-400">
            This policy is part of GAMS Terms of Service and is binding on all portal users.
          </p>
          <div className="flex gap-3 text-xs font-semibold">
            <Link href="/public/terms" className="text-saffron-600 hover:underline">Terms of Service</Link>
            <Link href="/public/accessibility" className="text-saffron-600 hover:underline">Accessibility</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A3A6B] text-white py-6">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-blue-200">© {new Date().getFullYear()} Ministry of Finance, Government of India · GAMS</p>
          <div className="flex gap-4 text-xs text-blue-300">
            <Link href="/public/terms" className="hover:text-white">Terms</Link>
            <Link href="/public/accessibility" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
