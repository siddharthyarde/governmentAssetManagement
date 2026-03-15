import React from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import { Eye, ChevronRight, CheckCircle } from "lucide-react";

export const metadata = { title: "Accessibility Statement — GAMS" };

export default function AccessibilityPage() {
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
          <Link href="/public/login" className="text-sm font-semibold border border-border px-3 py-1.5 rounded-lg hover:bg-surface">Sign In</Link>
        </nav>
      </header>

      <div className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/public" className="hover:text-gray-700">Home</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Accessibility Statement</span>
      </div>

      <div className="bg-gradient-to-br from-[#F0FFF4] to-white py-10 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
              <Eye size={24} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Accessibility Statement</h1>
              <p className="text-sm text-gray-500">GAMS is committed to WCAG 2.1 Level AA conformance and GIGW compliance.</p>
              <p className="text-xs text-gray-400 mt-1">Last reviewed: 1 January 2026</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-10 w-full space-y-8">

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-border">Our Commitment</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The Government Asset Management System (GAMS) is committed to making its portals accessible to all users,
            including persons with disabilities, in accordance with the Rights of Persons with Disabilities Act 2016
            and the Guidelines for Indian Government Websites (GIGW) 2.0. We target WCAG 2.1 Level AA conformance.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-border">Conformance Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Semantic HTML5 structure with proper heading hierarchy",
              "All images have descriptive alt text",
              "Full keyboard navigation support across all forms and modals",
              "ARIA labels on all interactive icon-only controls",
              "Colour contrast ratios exceed WCAG AA 4.5:1 standard",
              "Screen-reader tested with NVDA and VoiceOver",
              "Mobile-responsive design supporting text resize up to 200%",
              "Hindi language (Devanagari) support on key pages",
              "No flashing content or animations that may trigger photosensitive conditions",
              "Session timeout warnings with keyboard-accessible extensions",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-border">Known Limitations</h2>
          <ul className="space-y-2">
            {[
              "PDF documents (Disposal Certificates, Inspection Reports) may not be fully accessible to screen readers. Text versions are available on request.",
              "QR code scanning feature requires camera access and is not accessible via keyboard alone. Manual GOI-ID entry is provided as an alternative.",
              "Some embedded Recharts data-visualisations are not yet fully screen-reader annotated — text data tables are provided alongside.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-border">Feedback & Contact</h2>
          <p className="text-sm text-gray-600 mb-4">
            If you experience any accessibility barriers while using GAMS, please contact us:
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-2">
            <p className="text-sm"><strong className="text-gray-900">Accessibility Officer:</strong> <a href="mailto:accessibility@gams.gov.in" className="text-green-700 hover:underline">accessibility@gams.gov.in</a></p>
            <p className="text-sm"><strong className="text-gray-900">Response time:</strong> Within 5 working days</p>
            <p className="text-sm"><strong className="text-gray-900">Phone:</strong> 1800-111-GAMS (toll-free, available in Hindi and English)</p>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-border">Enforcement</h2>
          <p className="text-sm text-gray-600">
            If you are not satisfied with our response, you may contact the Disability Commissioner of your state
            or write to the Department of Empowerment of Persons with Disabilities, Ministry of Social Justice,
            Shastri Bhavan, New Delhi — 110115.
          </p>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-xs text-gray-400">Last accessibility audit: November 2025 by NIC Accessibility Team</p>
          <div className="flex gap-3 text-xs font-semibold">
            <Link href="/public/privacy" className="text-saffron-600 hover:underline">Privacy Policy</Link>
            <Link href="/public/terms" className="text-saffron-600 hover:underline">Terms</Link>
          </div>
        </div>
      </main>

      <footer className="bg-[#1A3A6B] text-white py-6">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-blue-200">© {new Date().getFullYear()} Ministry of Finance, Government of India · GAMS</p>
          <div className="flex gap-4 text-xs text-blue-300">
            <Link href="/public/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/public/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
