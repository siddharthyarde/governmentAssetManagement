import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GAMS — Management Portal | Government of India",
  description: "Government Asset Management System — Internal management portal for government officials, volunteers, and inspectors.",
  keywords: ["government asset management", "GAMS", "India"],
  robots: "noindex, nofollow",
};

export default function ManageSectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
