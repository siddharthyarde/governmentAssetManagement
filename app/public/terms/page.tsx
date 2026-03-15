import React from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import { FileText, ChevronRight } from "lucide-react";

export const metadata = { title: "Terms of Service — GAMS" };

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using GAMS, you agree to be bound by these Terms of Service and all applicable laws and regulations of India.",
      "If you do not agree with any part of these terms, you may not access or use GAMS portals.",
      "These terms apply to all users: citizens, institutional buyers, suppliers, and government staff.",
      "GAMS reserves the right to update these terms at any time. Continued use after changes constitutes acceptance.",
    ],
  },
  {
    title: "2. Eligibility",
    body: [
      "Citizen accounts: Indian residents with a valid mobile number. Aadhaar linkage required for purchases above ₹50,000.",
      "Institutional buyers: Government bodies, PSUs, NGOs with 80G/FCRA registration, educational institutions, and district hospitals. Subject to GAMS verification.",
      "Suppliers: Registered Indian companies with valid GSTIN, PAN, and CIN. Must be incorporated for at least 2 years. Subject to GAMS empanelment review.",
      "Government staff: Ministry/department-issued credentials required. Access is restricted to assigned jurisdiction.",
    ],
  },
  {
    title: "3. Prohibited Conduct",
    body: [
      "Submitting false or misleading information during registration or in any transaction.",
      "Attempting to circumvent QR authentication, forge disposal certificates, or manipulate asset condition ratings.",
      "Using GAMS marketplace for resale or arbitrage — assets are for direct end-use only.",
      "Placing orders with no intent to fulfil or take delivery (phantom ordering).",
      "Sharing account credentials or acting on behalf of an unregistered entity.",
      "Any conduct that violates the IT Act 2000, Prevention of Corruption Act 1988, or Indian Penal Code.",
    ],
  },
  {
    title: "4. Asset Transactions",
    body: [
      "All asset conditions are certified by GAMS-empanelled inspectors. Condition ratings are indicative and based on physical inspection at time of listing.",
      "Transactions are final once payment is confirmed. Cancellations are subject to the GAMS Buyer Protection Policy.",
      "Assets are sold as-is. GAMS does not provide any warranty beyond the stated condition rating.",
      "Institutional priority windows are strictly enforced. Suppliers and citizens may not access institution-reserved listings.",
      "All transactions generate a Government Disposal Certificate which is the binding legal record for GFR compliance.",
    ],
  },
  {
    title: "5. Payments",
    body: [
      "All payments are processed through Razorpay, a PCI-DSS Level 1 certified payment gateway.",
      "GAMS does not store any card or UPI credentials. Payment data resides with Razorpay under their privacy policy.",
      "Government institutions may request Purchase Order (PO)-based billing subject to pre-approval.",
      "Refunds are processed within 7–10 working days subject to delivery verification and dispute resolution.",
    ],
  },
  {
    title: "6. QR Codes and Asset Traceability",
    body: [
      "Each GAMS QR code is HMAC-SHA256 signed and uniquely linked to one asset instance. Duplication or reproduction is a criminal offence.",
      "Scanning a GAMS QR code is equivalent to performing an official government asset check. Falsified scan records attract penalties under the IT Act 2000.",
      "Chain-of-custody data generated through QR scans forms part of the official Parliamentary audit record.",
    ],
  },
  {
    title: "7. Intellectual Property",
    body: [
      "The GAMS brand, Ashoka Chakra usage in this context, and all platform code are the property of the Government of India.",
      "Users may not reproduce, distribute, or create derivative works from GAMS data without written permission from the Ministry of Finance.",
      "Public data published on the GAMS open data portal is licensed under the National Data Sharing and Accessibility Policy (NDSAP).",
    ],
  },
  {
    title: "8. Limitation of Liability",
    body: [
      "GAMS shall not be liable for any indirect, incidental, or consequential damages arising from platform use.",
      "In no event shall government liability exceed the value of the transaction in dispute.",
      "GAMS is not liable for loss due to force majeure events including natural disasters, cyber-attacks on third-party systems, or government policy changes.",
    ],
  },
  {
    title: "9. Governing Law & Dispute Resolution",
    body: [
      "These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of New Delhi courts.",
      "Disputes must first be escalated to GAMS Grievance Cell at grievance@gams.gov.in (resolution within 30 days).",
      "Unresolved disputes may be escalated to the Ministry of Finance Secretariat before approaching courts.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-neutral-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

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

      <div className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/public" className="hover:text-gray-700">Home</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Terms of Service</span>
      </div>

      <div className="bg-gradient-to-br from-[#F0F4FF] to-white py-10 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
              <FileText size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Terms of Service</h1>
              <p className="text-sm text-gray-500">
                Government Asset Management System (GAMS) · Ministry of Finance, Government of India
              </p>
              <p className="text-xs text-gray-400 mt-1">Last updated: 1 January 2026 · Version 1.0</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-10 w-full">
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-border">{section.title}</h2>
              <ul className="space-y-2">
                {section.body.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-xs text-gray-400">For queries: legal@gams.gov.in</p>
          <div className="flex gap-3 text-xs font-semibold">
            <Link href="/public/privacy" className="text-saffron-600 hover:underline">Privacy Policy</Link>
            <Link href="/public/accessibility" className="text-saffron-600 hover:underline">Accessibility</Link>
          </div>
        </div>
      </main>

      <footer className="bg-[#1A3A6B] text-white py-6">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-blue-200">© {new Date().getFullYear()} Ministry of Finance, Government of India · GAMS</p>
          <div className="flex gap-4 text-xs text-blue-300">
            <Link href="/public/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/public/accessibility" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
