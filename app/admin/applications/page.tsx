import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import { ArrowLeft, DownloadIcon } from "lucide-react";

const STATUSES = [
  "ALL",
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "ACCEPTED",
  "REJECTED",
];

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const activeStatus = status && status !== "ALL" ? status : undefined;

  const applications = await prisma.application.findMany({
    where: {
      deletedAt: null,
      ...(activeStatus && { status: activeStatus }),
      ...(q && {
        studentName: { contains: q },
      }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      studentName: true,
      applyingClass: true,
      status: true,
      createdAt: true,
      parent: { select: { name: true, email: true } },
      reviewAssignment: { select: { reviewer: { select: { name: true } } } },
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link
        href="/admin"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Applications</h1>
        <p className="text-sm text-muted-foreground">
          {applications.length} results
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/applications?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
              ${
                (status ?? "ALL") === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-muted border-border"
              }`}
          >
            {s === "ALL" ? "All" : s.replace("_", " ")}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-xl divide-y">
        {/* download button  */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Applications</h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {applications.length} results
            </p>
            {activeStatus === "ACCEPTED" && (
              <Link
                href="/api/export/applications"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
              >
                <DownloadIcon />
                Download Excel
              </Link>
            )}
          </div>
        </div>

        {applications.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-16">
            No applications found.
          </p>
        ) : (
          applications.map((app) => (
            <Link
              key={app.id}
              href={`/admin/applications/${app.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {app.studentName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {app.applyingClass} · {app.parent.name ?? app.parent.email}
                </p>
              </div>
              <div className="flex items-center gap-6 ml-4 shrink-0">
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {app.reviewAssignment?.reviewer?.name ?? "Unassigned"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(app.createdAt).toLocaleDateString("en-IN")}
                </p>
                <StatusBadge status={app.status} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
