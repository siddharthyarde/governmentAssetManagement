import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GAMS — Institutional Buyer Portal | Government of India",
    template: "%s | GAMS Buyer Portal",
  },
  description:
    "NGOs, private companies, and government institutions can request allocation of surplus government assets at discounted rates. Register and get verified on the GAMS Institutional Buyer Portal.",
  keywords: [
    "government surplus allocation",
    "NGO government asset",
    "institutional buyer India",
    "GAMS buyer",
    "government asset redistribution",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "GAMS — Institutional Buyer Portal",
    description: "Request allocation of surplus government assets for your organization.",
    type: "website",
  },
};

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white min-h-dvh antialiased">
        {children}
      </body>
    </html>
  );
}
