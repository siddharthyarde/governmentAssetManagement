import React from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  CheckCircle, XCircle, ChevronRight, ArrowRight, Building2,
  BookOpen, Users, Stethoscope, GraduationCap, Landmark,
} from "lucide-react";

export const metadata = { title: "Eligibility — GAMS Buyer Portal" };

const ELIGIBLE = [
  { icon: Landmark, label: "Central Government Ministries / Departments", detail: "All ministries, attached offices, and subordinate offices of the Government of India." },
  { icon: Building2, label: "State Government Bodies", detail: "State departments, state-level PSUs, and state government boards with official letterhead." },
  { icon: Users, label: "Public Sector Undertakings (PSUs)", detail: "Central and state PSUs with valid CIN and government ownership ≥51%." },
  { icon: BookOpen, label: "NGOs / Charitable Trusts with 80G / FCRA", detail: "Registered charities, trusts, and societies with valid 80G certification or FCRA registration." },
  { icon: GraduationCap, label: "Educational Institutions (Government-aided)", detail: "Colleges, universities, and schools receiving government grants with valid AISHE ID or DISE code." },
  { icon: Stethoscope, label: "District Hospitals & PHCs", detail: "Government hospitals, primary health centres, ESI hospitals, and AIIMS-affiliated institutions." },
];

const NOT_ELIGIBLE = [
  "Private for-profit companies (retailers, resellers, trading firms)",
  "Private unaided schools and colleges not receiving any government grant",
  "Individual citizens (citizens may purchase via the public marketplace instead)",
  "Foreign entities or organisations not domiciled in India",
  "Entities under active CBI/CVC investigation or debarred from government contracts",
];

const DOCUMENTS = [
  { label: "Registration Certificate", detail: "Certificate of Incorporation (companies), Trust Deed (NGOs), Government Gazette Notification (bodies)" },
  { label: "GST Registration", detail: "Valid GSTIN. Exempted entities must provide exemption certificate." },
  { label: "PAN Card", detail: "Organisation-level PAN (not individual PAN)." },
  { label: "80G / FCRA Certificate", detail: "Required for NGOs and charitable organisations." },
  { label: "Authorisation Letter", detail: "Signed by head of institution authorising the nodal officer to transact on GAMS." },
  { label: "Bank Account Details", detail: "Cancelled cheque or bank passbook page in the institution's name." },
];

export default function EligibilityPage() {
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/buyer" className="flex items-center gap-2.5">
              <AshokaChakra size={30} />
              <div>
                <span className="text-sm font-black text-[#1A1A1A]">GAMS</span>
                <span className="hidden sm:block text-[9px] text-[#5A5A5A] -mt-0.5">Institutional Buyer Portal</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/buyer/available-stock" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Available Stock</Link>
              <Link href="/buyer/how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">How It Works</Link>
              <Link href="/buyer/login" className="text-sm font-semibold border border-border px-3 py-1.5 rounded-lg hover:bg-surface">Sign In</Link>
              <Link href="/buyer/register" className="text-sm font-bold text-white px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800">Register</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/buyer" className="hover:text-gray-700">Buyer Portal</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Eligibility</span>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F0FFF4] to-white py-12 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Who Can Buy on GAMS?</h1>
          <p className="text-sm text-gray-500 max-w-2xl">
            GAMS institutional procurement is reserved for verified government and non-profit entities.
            Citizens can purchase via the <Link href="/public/marketplace" className="text-green-700 hover:underline">public marketplace</Link>.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-screen-xl mx-auto px-4 md:px-6 py-10 space-y-12 w-full">

        {/* Eligible organisations */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Eligible Organisations</h2>
          <p className="text-sm text-gray-500 mb-6">The following categories are eligible for institutional procurement on GAMS:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ELIGIBLE.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="border border-green-200 bg-green-50/50 rounded-2xl p-5 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Not eligible */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Not Eligible for Institutional Access</h2>
          <p className="text-sm text-gray-500 mb-5">The following cannot register as institutional buyers:</p>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-2.5">
            {NOT_ELIGIBLE.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-red-800">
                <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            If you&apos;re a private citizen, you can still purchase surplus assets via the{" "}
            <Link href="/public/marketplace" className="text-saffron-600 hover:underline">Public Marketplace</Link>.
          </p>
        </section>

        {/* Documents required */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Documents Required for Registration</h2>
          <p className="text-sm text-gray-500 mb-5">Upload the following during registration. All documents must be valid and not older than 3 years:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DOCUMENTS.map(({ label, detail }, i) => (
              <div key={label} className="border border-border rounded-xl p-4 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-saffron-100 flex items-center justify-center shrink-0 text-xs font-black text-saffron-700">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">{label}</p>
                  <p className="text-xs text-gray-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verification timeline */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Verification Timeline</h2>
          <div className="flex flex-col md:flex-row gap-0">
            {[
              { label: "Submit Registration", sub: "Day 0", color: "#138808" },
              { label: "Document Review", sub: "Day 1–2", color: "#C9960C" },
              { label: "Ministry Verification", sub: "Day 3–4", color: "#E07B00" },
              { label: "Account Activated", sub: "Day 5", color: "#1A3A6B" },
            ].map(({ label, sub, color }, i, arr) => (
              <div key={label} className="flex-1 flex flex-col items-center text-center p-4 relative">
                {i < arr.length - 1 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gray-200" />}
                <div className="relative z-10 w-14 h-14 rounded-full text-white font-black flex items-center justify-center mb-2 text-xl shadow-sm" style={{ background: color }}>
                  {i + 1}
                </div>
                <p className="text-sm font-bold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-green-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Ready to Register?</h3>
          <p className="text-green-100 text-sm mb-5 max-w-lg mx-auto">
            Registration is free and takes under 10 minutes. Once verified, your institution gets priority access to redistributed government assets.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/buyer/register" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 text-sm">
              Register Your Institution <ArrowRight size={14} />
            </Link>
            <Link href="/buyer/available-stock" className="inline-flex items-center gap-2 border border-green-400 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-600 text-sm">
              <CheckCircle size={14} /> Browse Available Stock
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-[#1A3A6B] text-white py-8">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5"><AshokaChakra size={26} /><p className="text-sm font-black">GAMS Buyer Portal</p></div>
          <p className="text-xs text-blue-200">© {new Date().getFullYear()} Ministry of Finance, Government of India</p>
        </div>
      </footer>
    </div>
  );
}
