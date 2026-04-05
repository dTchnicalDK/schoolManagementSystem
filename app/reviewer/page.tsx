import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import { ArrowRight, ClipboardList } from "lucide-react";

export default async function ReviewerPage() {
  const session = await auth();

  const assignments = await prisma.reviewAssignment.findMany({
    where: { reviewerId: session!.user.id },
    orderBy: { assignedAt: "desc" },
    include: {
      application: {
        select: {
          id: true,
          studentName: true,
          applyingClass: true,
          status: true,
          createdAt: true,
          parent: { select: { name: true } },
        },
      },
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Assigned Applications</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome, {session?.user?.name} · {assignments.length} assigned
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/30">
          <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            No applications assigned yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            The admin will assign applications to you shortly.
          </p>
        </div>
      ) : (
        <div className="border rounded-xl divide-y">
          {assignments.map(({ application, recommendation, reviewedAt }) => (
            <Link
              key={application.id}
              href={`/reviewer/applications/${application.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {application.studentName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {application.applyingClass} · by{" "}
                  {application.parent.name ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-4 ml-4 shrink-0">
                {/* Review status */}
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full
                  ${
                    reviewedAt
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {reviewedAt ? "Reviewed" : "Pending"}
                </span>
                <StatusBadge status={application.status} />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
