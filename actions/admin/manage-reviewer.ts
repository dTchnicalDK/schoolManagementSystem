"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function promoteToReviewer(userId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.user.update({
    where: { id: userId },
    data: { role: "REVIEWER" },
  });

  revalidatePath("/admin/reviewers");
}

export async function demoteToParent(userId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  // keep their review history intact, just change role
  await prisma.user.update({
    where: { id: userId },
    data: { role: "PARENT" },
  });

  revalidatePath("/admin/reviewers");
}
