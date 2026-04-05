"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  remarks: z.string().min(10, "Remarks must be at least 10 characters"),
  recommendation: z.enum(["ACCEPT", "REJECT", "PENDING"]),
});

export async function submitReview(
  applicationId: string,
  data: { remarks: string; recommendation: string },
) {
  const session = await auth();
  if (session?.user?.role !== "REVIEWER") return { error: "Unauthorized" };

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // ensure this reviewer is assigned to this application
  const assignment = await prisma.reviewAssignment.findFirst({
    where: { applicationId, reviewerId: session.user.id },
  });

  if (!assignment) return { error: "You are not assigned to this application" };

  await prisma.$transaction([
    prisma.reviewAssignment.update({
      where: { applicationId },
      data: {
        remarks: parsed.data.remarks,
        recommendation: parsed.data.recommendation,
        reviewedAt: new Date(),
      },
    }),
    prisma.auditLog.create({
      data: {
        applicationId,
        actorId: session.user.id,
        actorRole: "REVIEWER",
        action: "REVIEW_SUBMITTED",
        note: `Recommendation: ${parsed.data.recommendation}`,
      },
    }),
  ]);

  revalidatePath(`/reviewer/applications/${applicationId}`);
  revalidatePath(`/admin/applications/${applicationId}`);
}
