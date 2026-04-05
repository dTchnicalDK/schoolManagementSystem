"use client";

import { useTransition } from "react";
import {
  promoteToReviewer,
  demoteToParent,
} from "@/actions/admin/manage-reviewer";

interface Props {
  userId: string;
  currentRole: string;
}

export default function RoleToggleButton({ userId, currentRole }: Props) {
  const [isPending, startTransition] = useTransition();
  const isReviewer = currentRole === "REVIEWER";

  const handleClick = () => {
    startTransition(async () => {
      if (isReviewer) {
        await demoteToParent(userId);
      } else {
        await promoteToReviewer(userId);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50
        ${
          isReviewer
            ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
        }`}
    >
      {isPending
        ? "Updating..."
        : isReviewer
          ? "Demote to Parent"
          : "Promote to Reviewer"}
    </button>
  );
}
