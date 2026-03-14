import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAMS — Government Asset Marketplace | Government of India",
  description:
    "Buy quality government surplus assets at transparent, discounted prices. India's first government asset resale platform — rated, verified, and GFR compliant.",
  keywords: [
    "government surplus",
    "government asset sale",
    "India surplus",
    "GAMS marketplace",
    "buy government goods India",
  ],
  openGraph: {
    title: "GAMS — Government Asset Marketplace",
    description: "Transparent resale of government assets at discounted prices.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
