import { prisma } from "@/lib/prisma";
import { ArrowLeft, UserCheck } from "lucide-react";
import Link from "next/link";
import RoleToggleButton from "@/components/admin/RoleToggleButton";
import { auth } from "@/auth";

export default async function ReviewersPage() {
  const session = await auth();

  // fetch all users except current admin
  const users = await prisma.user.findMany({
    where: {
      id: { not: session!.user.id }, // exclude self
      role: { in: ["PARENT", "REVIEWER"] }, // exclude other admins
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { reviewAssignments: true } },
    },
    orderBy: [
      { role: "asc" }, // REVIEWERs first alphabetically
      { createdAt: "desc" },
    ],
  });

  const reviewers = users.filter((u) => u.role === "REVIEWER");
  const parents = users.filter((u) => u.role === "PARENT");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/admin"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Reviewers</h1>
        <p className="text-sm text-muted-foreground">
          {reviewers.length} reviewer{reviewers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Current Reviewers */}
      <Section title="Current Reviewers" count={reviewers.length}>
        {reviewers.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <UserCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No reviewers yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Promote a parent from the list below.
            </p>
          </div>
        ) : (
          reviewers.map((user) => <UserRow key={user.id} user={user} />)
        )}
      </Section>

      {/* All Parents — promotable */}
      <Section title="Registered Parents" count={parents.length}>
        {parents.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground text-center">
            No registered parents yet.
          </p>
        ) : (
          parents.map((user) => <UserRow key={user.id} user={user} />)
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
          {title}
        </h2>
        <span className="text-xs text-muted-foreground">{count} total</span>
      </div>
      <div className="border rounded-xl divide-y">{children}</div>
    </div>
  );
}

function UserRow({
  user,
}: {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    _count: { reviewAssignments: number };
  };
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      {/* Avatar */}
      {user.image ? (
        <img
          src={user.image}
          alt={user.name ?? ""}
          className="w-9 h-9 rounded-full shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
          {(user.name ?? user.email ?? "?")[0].toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{user.name ?? "—"}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>

      {/* Assignment count — only meaningful for reviewers */}
      {user.role === "REVIEWER" && (
        <div className="text-right shrink-0 mr-4">
          <p className="text-sm font-medium">{user._count.reviewAssignments}</p>
          <p className="text-xs text-muted-foreground">assigned</p>
        </div>
      )}

      {/* Action */}
      <RoleToggleButton userId={user.id} currentRole={user.role} />
    </div>
  );
}
