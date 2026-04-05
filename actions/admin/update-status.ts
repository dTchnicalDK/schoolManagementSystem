"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
};

export async function updateApplicationStatus(
  applicationId: string,
  newStatus: string,
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { status: true },
  });

  if (!application) return { error: "Application not found" };

  const allowed = VALID_TRANSITIONS[application.status] ?? [];
  if (!allowed.includes(newStatus)) {
    return {
      error: `Cannot transition from ${application.status} to ${newStatus}`,
    };
  }

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus },
    }),
    prisma.auditLog.create({
      data: {
        applicationId,
        actorId: session.user.id,
        actorRole: "ADMIN",
        action: "STATUS_CHANGED",
        fromStatus: application.status,
        toStatus: newStatus,
      },
    }),
  ]);

  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
}
