import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import { CalendarDays, GraduationCap, ArrowRight } from "lucide-react";

interface Props {
  application: {
    id: string;
    studentName: string;
    applyingClass: string;
    status: string;
    createdAt: Date;
  };
}

export default function ApplicationCard({ application }: Props) {
  const { id, studentName, applyingClass, status, createdAt } = application;

  return (
    <div className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-base">{studentName}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{applyingClass}</span>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>
            Applied{" "}
            {new Date(createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <Link
          href={`/dashboard/applications/${id}`}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
