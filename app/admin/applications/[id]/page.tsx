import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  User,
  Mail,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import StatusUpdater from "@/components/admin/StatusUpdater";
import ReviewerAssigner from "@/components/admin/ReviewerAssigner";

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [application, reviewers] = await Promise.all([
    prisma.application.findFirst({
      where: { id, deletedAt: null },
      include: {
        parent: {
          select: { name: true, email: true, phone: true, address: true },
        },
        reviewAssignment: {
          include: {
            reviewer: { select: { id: true, name: true, email: true } },
          },
        },
        auditLogs: { orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.user.findMany({
      where: { role: "REVIEWER", isActive: true },
      select: { id: true, name: true, email: true },
    }),
  ]);

  if (!application) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/admin/applications"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to applications
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">{application.studentName}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            ID: {application.id}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Student Details */}
      <Section title="Student Info">
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
        {application.previousSchool && (
          <Row
            icon={<GraduationCap className="w-4 h-4" />}
            label="Previous School"
            value={application.previousSchool}
          />
        )}
      </Section>

      {/* Parent Details */}
      <Section title="Parent / Guardian">
        <Row
          icon={<User className="w-4 h-4" />}
          label="Name"
          value={application.parent.name ?? "—"}
        />
        <Row
          icon={<Mail className="w-4 h-4" />}
          label="Email"
          value={application.parent.email ?? "—"}
        />
        {application.parent.phone && (
          <Row
            icon={<User className="w-4 h-4" />}
            label="Phone"
            value={application.parent.phone}
          />
        )}
        {application.parent.address && (
          <Row
            icon={<User className="w-4 h-4" />}
            label="Address"
            value={application.parent.address}
          />
        )}
      </Section>

      {/* Reviewer Remarks */}
      {application.reviewAssignment && (
        <Section title="Reviewer Remarks">
          <div className="px-4 py-3 space-y-1">
            <p className="text-sm text-muted-foreground">
              Assigned to:{" "}
              <span className="font-medium text-foreground">
                {application.reviewAssignment.reviewer.name ??
                  application.reviewAssignment.reviewer.email}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Recommendation:{" "}
              <span className="font-medium text-foreground">
                {application.reviewAssignment.recommendation}
              </span>
            </p>
            {application.reviewAssignment.remarks && (
              <p className="text-sm mt-2 border-t pt-2">
                {application.reviewAssignment.remarks}
              </p>
            )}
          </div>
        </Section>
      )}

      {/* Admin Actions */}
      <Section title="Admin Actions">
        <div className="px-4 py-4 space-y-6">
          <ReviewerAssigner
            applicationId={application.id}
            reviewers={reviewers}
            currentReviewerId={application.reviewAssignment?.reviewer.id}
          />
          <StatusUpdater
            applicationId={application.id}
            currentStatus={application.status}
          />
        </div>
      </Section>

      {/* Audit Timeline */}
      {application.auditLogs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-4 tracking-wide">
            Timeline
          </h2>
          <div className="relative pl-5 border-l-2 border-border space-y-6">
            {application.auditLogs.map((log) => (
              <div key={log.id} className="relative">
                <div className="absolute -left-[1.4rem] w-3 h-3 rounded-full bg-primary border-2 border-background" />
                <p className="text-sm font-medium">
                  {formatAction(log.action)}
                </p>
                {log.fromStatus && log.toStatus && (
                  <p className="text-xs text-muted-foreground">
                    {log.fromStatus} → {log.toStatus}
                  </p>
                )}
                {log.note && (
                  <p className="text-xs text-muted-foreground">{log.note}</p>
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wide">
        {title}
      </h2>
      <div className="border rounded-xl divide-y">{children}</div>
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
