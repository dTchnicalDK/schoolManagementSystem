import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";
import { FileText, Clock, CheckCircle, XCircle, Users } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();

  const [total, submitted, underReview, accepted, rejected, reviewers] =
    await Promise.all([
      prisma.application.count({ where: { deletedAt: null } }),
      prisma.application.count({
        where: { status: "SUBMITTED", deletedAt: null },
      }),
      prisma.application.count({
        where: { status: "UNDER_REVIEW", deletedAt: null },
      }),
      prisma.application.count({
        where: { status: "ACCEPTED", deletedAt: null },
      }),
      prisma.application.count({
        where: { status: "REJECTED", deletedAt: null },
      }),
      prisma.user.count({ where: { role: "REVIEWER" } }),
    ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome, {session?.user?.name}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/reviewers"
            className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition"
          >
            <Users className="w-4 h-4" /> Manage Reviewers
          </Link>
          <Link
            href="/admin/applications"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            <FileText className="w-4 h-4" /> All Applications
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <StatsCard label="Total Applications" value={total} icon={FileText} />
        <StatsCard
          label="Submitted"
          value={submitted}
          icon={Clock}
          color="text-blue-600"
        />
        <StatsCard
          label="Under Review"
          value={underReview}
          icon={Clock}
          color="text-yellow-600"
        />
        <StatsCard
          label="Accepted"
          value={accepted}
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatsCard
          label="Rejected"
          value={rejected}
          icon={XCircle}
          color="text-red-600"
        />
        <StatsCard
          label="Reviewers"
          value={reviewers}
          icon={Users}
          color="text-purple-600"
        />
      </div>

      {/* Recent Applications */}
      <RecentApplications />
    </div>
  );
}

async function RecentApplications() {
  const recent = await prisma.application.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      studentName: true,
      applyingClass: true,
      status: true,
      createdAt: true,
      parent: { select: { name: true, email: true } },
    },
  });

  if (recent.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4 tracking-wide">
        Recent Applications
      </h2>
      <div className="border rounded-xl divide-y">
        {recent.map((app) => (
          <Link
            key={app.id}
            href={`/admin/applications/${app.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition"
          >
            <div>
              <p className="text-sm font-medium">{app.studentName}</p>
              <p className="text-xs text-muted-foreground">
                {app.applyingClass} · by {app.parent.name ?? app.parent.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {new Date(app.createdAt).toLocaleDateString("en-IN")}
              </span>
              <StatusBadge status={app.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// inline to avoid extra import in server component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-600",
    SUBMITTED: "bg-blue-100 text-blue-700",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
