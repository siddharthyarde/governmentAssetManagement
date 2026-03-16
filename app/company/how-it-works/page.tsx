import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  CheckCircle, FileText, Package, BarChart3, Truck, Shield,
  Star, ArrowRight, Clock, Globe, IndianRupee, Zap,
} from "lucide-react";

export const metadata = {
  title: "How It Works — GAMS Supplier Portal",
  description: "Learn how to supply government assets through GAMS — registration, approval, QR tracking, and payments.",
};

const STEPS = [
  {
    num: "01",
    icon: FileText,
    title: "Register & Submit Documents",
    desc: "Create a company account and upload your GST certificate, PAN, CIN/LLPIN, and business authorization. Our team reviews all documents within 3–5 working days.",
    color: "bg-saffron-50 border-saffron-200 text-saffron-600",
    detail: ["Business registration documents (MCA portal)", "GST registration certificate", "PAN card (company)", "Bank account details for payment", "Authorized signatory ID proof"],
  },
  {
    num: "02",
    icon: CheckCircle,
    title: "Get Approved",
    desc: "After document verification, your company gets 'Approved' status. You receive an official Supplier Code and can start listing products on the GAMS catalog.",
    color: "bg-green-50 border-green-200 text-green-600",
    detail: ["Approval email with Supplier Code", "Access to add products and inventory", "GAMS Supplier badge for your business", "Training materials & portal guide"],
  },
  {
    num: "03",
    icon: Package,
    title: "List Your Products",
    desc: "Add products to the GAMS catalog with full specifications, photos, and pricing. Each approved product gets a unique product code used for government procurement.",
    color: "bg-gold-50 border-gold-200 text-gold-600",
    detail: ["Product name, category, description, photos", "Technical specifications and standards", "Price (in INR, excl. GST)", "Available quantity and lead time", "CSV bulk upload for large catalogs"],
  },
  {
    num: "04",
    icon: Zap,
    title: "Receive Government Orders",
    desc: "Government departments place orders from your catalog. Each order is assigned asset instances with unique QR-coded IDs before delivery.",
    color: "bg-saffron-50 border-saffron-200 text-saffron-600",
    detail: ["Order notification via email and portal", "Each unit gets a unique GOI asset ID", "QR codes generated for every physical unit", "Dispatch and delivery tracking required"],
  },
  {
    num: "05",
    icon: Star,
    title: "Assets Rated Post-Event",
    desc: "After government events, certified inspectors rate each of your supply units on a 1–10 condition scale. High ratings reflect quality and are visible publicly.",
    color: "bg-gold-50 border-gold-200 text-gold-600",
    detail: ["Ratings and photos uploaded by certified inspectors", "All inspection data is tamper-proof", "Helps future procurement decisions", "Feedback loop for quality improvement"],
  },
  {
    num: "06",
    icon: IndianRupee,
    title: "Get Paid Promptly",
    desc: "Payments are processed via Direct Benefit Transfer (DBT) to your verified bank account within 15 days of delivery confirmation, per GFR 2017 rules.",
    color: "bg-green-50 border-green-200 text-green-600",
    detail: ["Payment within 15 days of delivery", "GST invoice auto-generated", "Payment status tracked in portal", "Download payment certificates for audit"],
  },
];

const BENEFITS = [
  { icon: Globe,        title: "Pan-India Gov Access",    desc: "Supply to central, state, municipal governments across all 28 states and 8 UTs." },
  { icon: Shield,       title: "Transparent Procurement", desc: "All orders are rule-book compliant (GFR 2017, GeM integration). No corruption, no bias." },
  { icon: BarChart3,    title: "Real-Time Analytics",     desc: "Track your orders, ratings, payment status, and asset lifecycle from one dashboard." },
  { icon: Truck,        title: "Logistics Integration",   desc: "QR-based dispatch and delivery tracking built in. No manual paperwork." },
  { icon: Clock,        title: "Fast Onboarding",          desc: "From registration to first order in 5 working days if documents are in order." },
  { icon: IndianRupee,  title: "Guaranteed Payments",     desc: "DBT payments with 15-day SLA. Full payment audit trail for your accounts team." },
];

const FAQS = [
  { q: "Who can register as a supplier?", a: "Any entity legally incorporated in India — Private Ltd, Public Ltd, LLP, Partnership Firm, or Sole Proprietorship — with a valid GST number and PAN can register." },
  { q: "Is there a registration fee?", a: "No. GAMS supplier registration is completely free. There is no platform fee or commission deducted from your invoices." },
  { q: "How long does approval take?", a: "Document verification typically takes 3–5 working days. You'll receive an email at every stage — submitted, under review, approved/rejected." },
  { q: "What if my application is rejected?", a: "You'll receive a reason for rejection and can reapply after addressing the issue. Common reasons: incomplete documents, mismatch in GST/PAN data, or non-compliant products." },
  { q: "Can I upload products in bulk?", a: "Yes. You can upload a CSV file from the Products section in your dashboard. Download the template, fill it in, and upload — all products are then submitted for approval." },
  { q: "How are asset ratings shared?", a: "Post-event inspector ratings are visible in the GAMS Citizen Marketplace and in your Supplier Dashboard. They help government buyers make informed procurement decisions." },
];

export default function CompanyHowItWorksPage() {
  return (
    <div className="min-h-dvh bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#fff 33.33% 66.66%,#138808 66.66%)" }} />
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/company" className="flex items-center gap-3">
            <AshokaChakra size={34} />
            <div>
              <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">भारत सरकार · Government of India</p>
              <p className="text-sm font-bold text-[#1A1A1A]">GAMS Supplier Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/company/login" className="btn-outline text-sm">Sign In</Link>
            <Link href="/company/register" className="btn-primary text-sm">Register</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-16 md:py-24 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-saffron-50 border border-saffron-200 px-3 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-saffron-500 rounded-full" />
            <span className="text-xs font-semibold text-saffron-700 uppercase tracking-wider">Supplier Onboarding Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight mb-5">
            How to Supply <span className="text-saffron-500">Government Assets</span> via GAMS
          </h1>
          <p className="text-lg text-[#5A5A5A] max-w-2xl mx-auto mb-8">
            GAMS connects verified suppliers directly with government departments across India. Register once, supply to thousands of government events and departments — trackable, transparent, paid on time.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/company/register" className="btn-primary text-base px-7 py-3">
              Start Registering <ArrowRight size={18} />
            </Link>
            <Link href="/company/guidelines" className="btn-outline text-base px-7 py-3">
              Read Guidelines
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">PROCESS</p>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">6 Steps to Start Supplying</h2>
          </div>
          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className={`flex flex-col md:flex-row gap-6 bg-white border border-border rounded-2xl p-6 md:p-8 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-2xl border ${step.color} shrink-0`}>
                      <step.icon size={24} />
                    </div>
                    <div>
                      <span className="text-4xl font-black text-[#F0F0E8]">{step.num}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{step.title}</h3>
                  <p className="text-[#5A5A5A] leading-relaxed mb-4">{step.desc}</p>
                </div>
                <div className="md:w-72 shrink-0">
                  <div className="bg-surface rounded-2xl p-5 h-full">
                    <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-3">What you need</p>
                    <ul className="space-y-2">
                      {step.detail.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-[#3D3D3D]">
                          <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" /> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white border-t border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">WHY GAMS</p>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">Why Suppliers Choose GAMS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-surface border border-border rounded-2xl p-6 hover:border-saffron-200 transition-colors">
                <div className="p-3 bg-saffron-100 text-saffron-600 rounded-xl w-fit mb-4">
                  <b.icon size={20} />
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">{b.title}</h3>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-saffron-600 uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white border border-border rounded-2xl p-5">
                <p className="font-semibold text-[#1A1A1A] mb-2">{faq.q}</p>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-saffron-500">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Become a GAMS Supplier?</h2>
          <p className="text-saffron-100 text-sm mb-6 max-w-xl mx-auto">
            Join hundreds of verified companies supplying to Government of India events and departments. Registration is free and takes just 10 minutes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/company/register" className="bg-white text-saffron-700 font-bold px-7 py-3 rounded-xl hover:bg-saffron-50 transition-colors text-sm">
              Register Your Company
            </Link>
            <Link href="/company/support" className="border-2 border-white text-white font-bold px-7 py-3 rounded-xl hover:bg-saffron-600 transition-colors text-sm">
              Talk to Support
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#1A1A1A] text-white py-8 text-center text-xs text-[#6A6A6A]">
        <Link href="/company" className="flex items-center justify-center gap-2 mb-3">
          <AshokaChakra size={24} />
          <span className="font-bold text-white">GAMS Supplier Portal</span>
        </Link>
        © 2026 Ministry of Finance, Government of India · Hosted by NIC · GFR 2017 Compliant
      </footer>
    </div>
  );
}
