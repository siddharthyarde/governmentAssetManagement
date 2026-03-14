import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "GAMS — Institutional Buyer Portal | Government of India", template: "%s | GAMS Buyer Portal" },
  description: "NGOs, private companies, and government institutions can request allocation of surplus government assets at discounted rates.",
  robots: { index: true, follow: true },
};

export default function BuyerSectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
