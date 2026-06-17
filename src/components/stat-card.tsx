import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_COLOR: Record<string, string> = {
  primary:     "text-primary border-primary/30 bg-primary/5",
  blue:        "text-chart-1 border-chart-1/30 bg-chart-1/5",
  green:       "text-chart-2 border-chart-2/30 bg-chart-2/5",
  amber:       "text-chart-3 border-chart-3/30 bg-chart-3/5",
  red:         "text-chart-4 border-chart-4/30 bg-chart-4/5",
  purple:      "text-chart-5 border-chart-5/30 bg-chart-5/5",
  destructive: "text-destructive border-destructive/30 bg-destructive/5",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "primary",
  valueClassName,
  trend,
  hint,
}: {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  color?: keyof typeof ICON_COLOR;
  valueClassName?: string;
  trend?: { value: string; positive: boolean };
  hint?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-border shadow-sm">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full border", ICON_COLOR[color])}>
          <Icon className="size-[18px]" />
        </span>
      </div>

      {/* Value + trend */}
      <div className="flex flex-col gap-1">
        <p className={cn("text-2xl font-bold tracking-tight", valueClassName)}>{value}</p>
        {trend && (
          <span className={cn("inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            trend.positive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          )}>
            {trend.positive
              ? <TrendingUp className="size-3" />
              : <TrendingDown className="size-3" />}
            {trend.value}
          </span>
        )}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
