import { revalidatePath } from "next/cache";
import { AdminNav } from "@/components/admin-nav";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type VenuesPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

const inputClassName =
  "rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500";
const buttonClassName =
  "rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800";
const secondaryButtonClassName =
  "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";
const deleteButtonClassName =
  "rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500";

function normalizeTextValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function createVenueAction(formData: FormData) {
  "use server";

  await requireAdminSession();

  const name = normalizeTextValue(formData, "name");
  const address = normalizeTextValue(formData, "address");
  if (!name) {
    return;
  }

  await prisma.venue.create({
    data: {
      name,
      address: address || null
    }
  });
  revalidatePath("/admin/venues");
}

async function updateVenueAction(formData: FormData) {
  "use server";

  await requireAdminSession();

  const id = normalizeTextValue(formData, "id");
  const name = normalizeTextValue(formData, "name");
  const address = normalizeTextValue(formData, "address");
  if (!id || !name) {
    return;
  }

  await prisma.venue.update({
    where: { id },
    data: {
      name,
      address: address || null
    }
  });
  revalidatePath("/admin/venues");
}

async function deleteVenueAction(formData: FormData) {
  "use server";

  await requireAdminSession();

  const id = normalizeTextValue(formData, "id");
  if (!id) {
    return;
  }

  await prisma.venue.delete({
    where: { id }
  });
  revalidatePath("/admin/venues");
}

export default async function AdminVenuesPage({ searchParams }: VenuesPageProps) {
  await requireAdminSession();

  const params = await searchParams;
  const query = params?.q?.trim() ?? "";

  const venues = await prisma.venue.findMany({
    where: query
      ? {
          name: {
            contains: query,
            mode: "insensitive"
          }
        }
      : undefined,
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <AdminNav active="venues" />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Venues</h1>

        <form className="mt-4 flex flex-wrap items-end gap-3" method="get">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="search-name">
              Search Name
            </label>
            <input
              className={inputClassName}
              defaultValue={query}
              id="search-name"
              name="q"
              placeholder="Venue name"
              type="text"
            />
          </div>
          <button className={secondaryButtonClassName} type="submit">
            Search
          </button>
        </form>

        <form action={createVenueAction} className="mt-6 grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-3">
          <input className={inputClassName} name="name" placeholder="Name" required type="text" />
          <input className={inputClassName} name="address" placeholder="Address" type="text" />
          <div className="md:text-right">
            <button className={buttonClassName} type="submit">
              Create
            </button>
          </div>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-2 py-2">ID</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Address</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((venue) => (
                <tr className="border-b border-slate-100 align-top" key={venue.id}>
                  <td className="px-2 py-3 font-mono text-xs">{venue.id}</td>
                  <td className="px-2 py-3">{venue.name}</td>
                  <td className="px-2 py-3">{venue.address ?? "-"}</td>
                  <td className="px-2 py-3">
                    <div className="flex min-w-[360px] items-start gap-2">
                      <form action={updateVenueAction} className="flex flex-wrap items-center gap-2">
                        <input name="id" type="hidden" value={venue.id} />
                        <input className={inputClassName} defaultValue={venue.name} name="name" required type="text" />
                        <input
                          className={inputClassName}
                          defaultValue={venue.address ?? ""}
                          name="address"
                          type="text"
                        />
                        <button className={secondaryButtonClassName} type="submit">
                          Edit
                        </button>
                      </form>

                      <form action={deleteVenueAction}>
                        <input name="id" type="hidden" value={venue.id} />
                        <ConfirmSubmitButton className={deleteButtonClassName}>Delete</ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {venues.length === 0 ? (
                <tr>
                  <td className="px-2 py-4 text-slate-500" colSpan={4}>
                    No venues found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

