import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { AdminNav } from "@/components/admin-nav";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-guard";

type SubmissionsPageProps = {
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

async function createSubmissionAction(formData: FormData) {
  "use server";

  await requireAdminSession();

  const email = normalizeTextValue(formData, "email").toLowerCase();
  const lineId = normalizeTextValue(formData, "lineId");
  const verified = formData.get("verified") === "on";

  if (!email || !lineId) {
    return;
  }

  try {
    await prisma.submission.create({
      data: {
        email,
        lineId,
        verified,
        verifiedAt: verified ? new Date() : null
      }
    });
    revalidatePath("/admin/submissions");
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return;
    }
    throw error;
  }
}

async function updateSubmissionAction(formData: FormData) {
  "use server";

  await requireAdminSession();

  const id = normalizeTextValue(formData, "id");
  const email = normalizeTextValue(formData, "email").toLowerCase();
  const lineId = normalizeTextValue(formData, "lineId");
  const verified = formData.get("verified") === "on";

  if (!id || !email || !lineId) {
    return;
  }

  try {
    await prisma.submission.update({
      where: { id },
      data: {
        email,
        lineId,
        verified,
        verifiedAt: verified ? new Date() : null
      }
    });
    revalidatePath("/admin/submissions");
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return;
    }
    throw error;
  }
}

async function deleteSubmissionAction(formData: FormData) {
  "use server";

  await requireAdminSession();
  const id = normalizeTextValue(formData, "id");
  if (!id) {
    return;
  }

  await prisma.submission.delete({ where: { id } });
  revalidatePath("/admin/submissions");
}

export default async function AdminSubmissionsPage({ searchParams }: SubmissionsPageProps) {
  await requireAdminSession();

  const params = await searchParams;
  const query = params?.q?.trim() ?? "";

  const submissions = await prisma.submission.findMany({
    where: query
      ? {
          email: {
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
      <AdminNav active="submissions" />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Submissions</h1>

        <form className="mt-4 flex flex-wrap items-end gap-3" method="get">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="search-email">
              Search Email
            </label>
            <input
              className={inputClassName}
              defaultValue={query}
              id="search-email"
              name="q"
              placeholder="user@example.com"
              type="text"
            />
          </div>
          <button className={secondaryButtonClassName} type="submit">
            Search
          </button>
        </form>

        <form action={createSubmissionAction} className="mt-6 grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-5">
          <input className={inputClassName} name="email" placeholder="Email" required type="email" />
          <input className={inputClassName} name="lineId" placeholder="LINE ID" required type="text" />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input name="verified" type="checkbox" />
            Verified
          </label>
          <div className="md:col-span-2 md:text-right">
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
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">lineId</th>
                <th className="px-2 py-2">Verified</th>
                <th className="px-2 py-2">Created At</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr className="border-b border-slate-100 align-top" key={submission.id}>
                  <td className="px-2 py-3 font-mono text-xs">{submission.id}</td>
                  <td className="px-2 py-3">{submission.email}</td>
                  <td className="px-2 py-3">{submission.lineId}</td>
                  <td className="px-2 py-3">{submission.verified ? "Yes" : "No"}</td>
                  <td className="px-2 py-3">{submission.createdAt.toLocaleString()}</td>
                  <td className="px-2 py-3">
                    <div className="flex min-w-[420px] items-start gap-2">
                      <form action={updateSubmissionAction} className="flex flex-wrap items-center gap-2">
                        <input name="id" type="hidden" value={submission.id} />
                        <input
                          className={inputClassName}
                          defaultValue={submission.email}
                          name="email"
                          required
                          type="email"
                        />
                        <input
                          className={inputClassName}
                          defaultValue={submission.lineId}
                          name="lineId"
                          required
                          type="text"
                        />
                        <label className="flex items-center gap-1 text-xs text-slate-700">
                          <input defaultChecked={submission.verified} name="verified" type="checkbox" />
                          Verified
                        </label>
                        <button className={secondaryButtonClassName} type="submit">
                          Edit
                        </button>
                      </form>

                      <form action={deleteSubmissionAction}>
                        <input name="id" type="hidden" value={submission.id} />
                        <ConfirmSubmitButton className={deleteButtonClassName}>Delete</ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 ? (
                <tr>
                  <td className="px-2 py-4 text-slate-500" colSpan={6}>
                    No submissions found.
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

