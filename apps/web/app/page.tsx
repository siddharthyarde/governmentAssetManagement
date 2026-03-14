import { redirect } from "next/navigation";

/**
 * Root page — redirect visitors to the public citizen marketplace.
 * Staff use /manage, suppliers use /company, institutions use /buyer.
 */
export default function RootPage() {
  redirect("/public");
}
