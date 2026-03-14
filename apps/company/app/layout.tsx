import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GAMS Company Portal | Government Asset Management System",
    template: "%s | GAMS Company Portal",
  },
  description:
    "Register your company to supply goods to the Government of India. Track purchase orders, delivery receipts, QR code generations, batch uploads, and payment status via the GAMS Company Portal.",
  keywords: ["GeM alternative", "government supplier", "GAMS company", "government procurement India"],
  robots: { index: false, follow: false },  // Internal / company-facing portal
  icons: { icon: "/favicon.ico" },
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
