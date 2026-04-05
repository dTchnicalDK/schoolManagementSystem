"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignReviewer(
  applicationId: string,
  reviewerId: string,
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.$transaction([
    prisma.reviewAssignment.upsert({
      where: { applicationId },
      create: { applicationId, reviewerId },
      update: { reviewerId },
    }),
    prisma.application.update({
      where: { id: applicationId },
      data: { status: "UNDER_REVIEW" },
    }),
    prisma.auditLog.create({
      data: {
        applicationId,
        actorId: session.user.id,
        actorRole: "ADMIN",
        action: "REVIEWER_ASSIGNED",
        toStatus: "UNDER_REVIEW",
        note: `Reviewer assigned`,
      },
    }),
  ]);

  revalidatePath(`/admin/applications/${applicationId}`);
}
