"use client";

import { useState, useTransition } from "react";
import { assignReviewer } from "@/actions/admin/assign-reviewer";

interface Reviewer {
  id: string;
  name: string | null;
  email: string | null;
}

interface Props {
  applicationId: string;
  reviewers: Reviewer[];
  currentReviewerId?: string | null;
}

export default function ReviewerAssigner({
  applicationId,
  reviewers,
  currentReviewerId,
}: Props) {
  const [selected, setSelected] = useState(currentReviewerId ?? "");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleAssign = () => {
    if (!selected) return;
    setSuccess(false);
    startTransition(async () => {
      await assignReviewer(applicationId, selected);
      setSuccess(true);
    });
  };

  if (reviewers.length === 0)
    return (
      <p className="text-sm text-muted-foreground">
        No reviewers available.{" "}
        <a href="/admin/reviewers" className="text-primary underline">
          Add reviewers →
        </a>
      </p>
    );

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
        Assign Reviewer
      </p>
      <div className="flex gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a reviewer</option>
          {reviewers.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name ?? r.email}
            </option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          disabled={isPending || !selected}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {isPending ? "Assigning..." : "Assign"}
        </button>
      </div>
      {success && (
        <p className="text-green-600 text-xs">
          Reviewer assigned successfully.
        </p>
      )}
    </div>
  );
}
