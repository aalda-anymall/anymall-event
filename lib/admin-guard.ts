import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth";

export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return isValidAdminSessionToken(sessionToken);
}

export async function requireAdminSession(): Promise<void> {
  const isValid = await hasAdminSession();
  if (!isValid) {
    redirect("/admin/login");
  }
}

