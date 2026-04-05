"use client";

import { useState, useTransition } from "react";
import { updateApplicationStatus } from "@/actions/admin/update-status";

const TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
};

const LABELS: Record<string, string> = {
  UNDER_REVIEW: "Mark Under Review",
  ACCEPTED: "Accept",
  REJECTED: "Reject",
};

interface Props {
  applicationId: string;
  currentStatus: string;
}

export default function StatusUpdater({ applicationId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const allowed = TRANSITIONS[currentStatus] ?? [];

  if (allowed.length === 0)
    return (
      <p className="text-sm text-muted-foreground">
        No further status changes available.
      </p>
    );

  const handleUpdate = (newStatus: string) => {
    setError(null);
    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, newStatus);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
        Update Status
      </p>
      <div className="flex flex-wrap gap-2">
        {allowed.map((status) => (
          <button
            key={status}
            onClick={() => handleUpdate(status)}
            disabled={isPending}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50
              ${
                status === "ACCEPTED"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : status === "REJECTED"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
          >
            {isPending ? "Updating..." : LABELS[status]}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
