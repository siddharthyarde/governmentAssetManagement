"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@gams/lib/supabase/server";

type UserRole =
  | "super_admin"
  | "gov_admin"
  | "event_manager"
  | "inspector"
  | "volunteer"
  | "warehouse_officer"
  | "auditor"
  | "viewer";

function getRoleRedirect(role: UserRole | null | undefined): string {
  switch (role) {
    case "super_admin":
    case "gov_admin":
    case "event_manager":
      return "/manage";
    case "inspector":
      return "/manage/inspector";
    case "volunteer":
      return "/manage/volunteer";
    case "warehouse_officer":
    case "auditor":
      return "/manage/viewer";
    default:
      return "/manage";
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "";

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const errParam = `error=${encodeURIComponent(error.message)}`;
    const nextParam = next && next !== "/" && next.startsWith("/manage") ? `&next=${encodeURIComponent(next)}` : "";
    redirect(`/manage/login?${errParam}${nextParam}`);
  }

  revalidatePath("/", "layout");

  // Only use deep-link if it's a real manage sub-page (not root or login itself)
  const isDeepLink = next && next !== "/" && next.startsWith("/manage") && next !== "/manage/login";
  if (isDeepLink) {
    redirect(next);
  }

  // Always do role-based redirect otherwise
  const user = data.user;
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(getRoleRedirect(profile?.role as UserRole | null | undefined));
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/manage/login");
}
