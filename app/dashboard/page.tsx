import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ApplicationCard from "@/components/dashboard/ApplicationCard";
import { PlusCircle } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  const applications = await prisma.application.findMany({
    where: {
      parentId: session!.user.id,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      studentName: true,
      applyingClass: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {session?.user?.name}
          </p>
        </div>
        <Link
          href="/apply"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          <PlusCircle className="w-4 h-4" />
          New Application
        </Link>
      </div>

      {/* Applications */}
      {applications.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/30">
          <GraduationCapIcon />
          <p className="text-muted-foreground mt-3 text-sm">
            No applications yet.
          </p>
          <Link
            href="/apply"
            className="mt-4 inline-block text-sm text-primary font-medium hover:underline"
          >
            Start your first application →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function GraduationCapIcon() {
  return (
    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
      <svg
        className="w-6 h-6 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-4l4 4 4-4"
        />
      </svg>
    </div>
  );
}
