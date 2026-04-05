import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/shared/StatusBadge";
import { ArrowLeft, CalendarDays, GraduationCap, User } from "lucide-react";
import Link from "next/link";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: {
      id,
      parentId: session!.user.id, // ensure parent can only see their own
      deletedAt: null,
    },
    include: {
      auditLogs: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!application) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{application.studentName}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Application ID: {application.id}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Details */}
      <div className="border rounded-xl divide-y mb-8">
        <Row
          icon={<GraduationCap className="w-4 h-4" />}
          label="Applying for"
          value={application.applyingClass}
        />
        <Row
          icon={<User className="w-4 h-4" />}
          label="Gender"
          value={application.gender}
        />
        <Row
          icon={<CalendarDays className="w-4 h-4" />}
          label="Date of Birth"
          value={new Date(application.dob).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
        <Row
          icon={<CalendarDays className="w-4 h-4" />}
          label="Applied on"
          value={new Date(application.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
        {application.previousSchool && (
          <Row
            icon={<GraduationCap className="w-4 h-4" />}
            label="Previous School"
            value={application.previousSchool}
          />
        )}
      </div>

      {/* Audit Timeline */}
      {application.auditLogs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4 tracking-wide">
            Application Timeline
          </h2>
          <div className="relative pl-5 border-l-2 border-border space-y-6">
            {application.auditLogs.map((log) => (
              <div key={log.id} className="relative">
                <div className="absolute -left-[1.4rem] w-3 h-3 rounded-full bg-primary border-2 border-background" />
                <p className="text-sm font-medium">
                  {formatAction(log.action)}
                </p>
                {log.note && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {log.note}
                  </p>
                )}
                {log.fromStatus && log.toStatus && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {log.fromStatus} → {log.toStatus}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(log.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm text-muted-foreground w-36 shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function formatAction(action: string) {
  switch (action) {
    case "SUBMITTED":
      return "Application submitted";
    case "STATUS_CHANGED":
      return "Status updated";
    case "REVIEWER_ASSIGNED":
      return "Reviewer assigned";
    default:
      return action;
  }
}
