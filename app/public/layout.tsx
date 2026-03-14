import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GAMS — Government Asset Marketplace | Government of India",
  description: "Buy quality government surplus assets at transparent, discounted prices.",
  keywords: ["government surplus", "government asset sale", "India surplus", "GAMS marketplace"],
  openGraph: {
    title: "GAMS — Government Asset Marketplace",
    description: "Transparent resale of government assets at discounted prices.",
    type: "website",
  },
};

export default function PublicSectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
