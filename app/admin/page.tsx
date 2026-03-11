import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import { requireAdminSession } from "@/lib/admin-guard";

const cards = [
  {
    href: "/admin/submissions",
    title: "Submissions",
    description: "View and manage email submissions."
  },
  {
    href: "/admin/venues",
    title: "Venues",
    description: "Manage venue names and addresses."
  },
  {
    href: "/admin/slots",
    title: "Slots",
    description: "Manage event time slots and states."
  },
  {
    href: "/admin/applications",
    title: "Applications",
    description: "Manage submission-slot applications."
  }
];

export default async function AdminDashboardPage() {
  await requireAdminSession();

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <AdminNav active="dashboard" />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Use the sections below to manage records.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
              href={card.href}
              key={card.href}
            >
              <h2 className="text-base font-medium text-slate-900">{card.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

