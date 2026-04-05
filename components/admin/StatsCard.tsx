import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number;
  icon: LucideIcon;
  color?: string;
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
}: Props) {
  return (
    <div className="border rounded-xl p-5 bg-card flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-muted ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
