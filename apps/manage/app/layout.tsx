import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAMS — Management Portal | Government of India",
  description:
    "Government Asset Management System — Internal management portal for government officials, volunteers, and inspectors.",
  keywords: ["government asset management", "GAMS", "India"],
  robots: "noindex, nofollow", // management portal is not public
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-surface min-h-dvh antialiased">
        {children}
      </body>
    </html>
  );
}
