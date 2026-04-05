"use client";

import { useState, useTransition } from "react";
import { submitReview } from "@/actions/reviewer/submit-review";

interface Props {
  applicationId: string;
  existingRemarks?: string | null;
  existingRecommendation?: string | null;
}

const RECOMMENDATIONS = [
  {
    value: "ACCEPT",
    label: "Recommend Accept",
    color: "border-green-500 text-green-700 bg-green-50",
  },
  {
    value: "REJECT",
    label: "Recommend Reject",
    color: "border-red-500 text-red-700 bg-red-50",
  },
  {
    value: "PENDING",
    label: "Need More Info",
    color: "border-yellow-500 text-yellow-700 bg-yellow-50",
  },
];

export default function RemarkForm({
  applicationId,
  existingRemarks,
  existingRecommendation,
}: Props) {
  const [remarks, setRemarks] = useState(existingRemarks ?? "");
  const [recommendation, setRecommendation] = useState(
    existingRecommendation ?? "",
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setError(null);
    setSuccess(false);

    if (!recommendation) {
      setError("Please select a recommendation.");
      return;
    }

    startTransition(async () => {
      const result = await submitReview(applicationId, {
        remarks,
        recommendation,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  };

  return (
    <div className="space-y-5">
      {/* Recommendation */}
      <div>
        <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide mb-3">
          Recommendation
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          {RECOMMENDATIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRecommendation(r.value)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition
                ${recommendation === r.value ? r.color : "border-border hover:bg-muted"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Remarks */}
      <div>
        <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide mb-2">
          Remarks
        </p>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={5}
          placeholder="Write your observations about this application..."
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm">Review submitted successfully.</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {isPending
          ? "Submitting..."
          : existingRemarks
            ? "Update Review"
            : "Submit Review"}
      </button>
    </div>
  );
}
