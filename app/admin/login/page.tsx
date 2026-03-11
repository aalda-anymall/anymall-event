import { redirect } from "next/navigation";
import { isAdminPinConfigured } from "@/lib/admin-auth";
import { hasAdminSession } from "@/lib/admin-guard";
import { AdminLoginForm } from "./login-form";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-600">Enter the PIN to access the admin dashboard.</p>

        {!isAdminPinConfigured() ? (
          <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            `ADMIN_PIN` is not configured. Add it to your environment variables.
          </p>
        ) : null}

        <AdminLoginForm />
      </section>
    </main>
  );
}

