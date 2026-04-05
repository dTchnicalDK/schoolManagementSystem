import { prisma } from "@/lib/prisma";
import { ArrowLeft, UserCheck } from "lucide-react";
import Link from "next/link";

export default async function ReviewersPage() {
  const reviewers = await prisma.user.findMany({
    where: { role: "REVIEWER" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      _count: { select: { reviewAssignments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/admin"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Reviewers</h1>
        <p className="text-sm text-muted-foreground">
          {reviewers.length} total
        </p>
      </div>

      {reviewers.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/30">
          <UserCheck className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No reviewers yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Promote a user to REVIEWER role via the database to get started.
          </p>
        </div>
      ) : (
        <div className="border rounded-xl divide-y">
          {reviewers.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4">
              {r.image ? (
                <img
                  src={r.image}
                  alt={r.name ?? ""}
                  className="w-9 h-9 rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {(r.name ?? r.email ?? "?")[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.name ?? "—"}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {r.email}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">
                  {r._count.reviewAssignments}
                </p>
                <p className="text-xs text-muted-foreground">assigned</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
