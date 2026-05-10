import { cn } from "@/lib/utils";
import { Delta } from "./delta";

/**
 * <Metric>
 *
 * A "value with caption" pattern. Used in stat tile grids, dense panels,
 * and side rails. Strict order: label → value → optional change.
 */
export interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Decimal change — e.g. `0.021` → `+2.10%`. */
  change?: number;
  hint?: React.ReactNode;
  align?: "start" | "end";
  invertChange?: boolean;
}

export function Metric({
  label,
  value,
  change,
  hint,
  align = "start",
  invertChange,
  className,
  ...props
}: MetricProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        align === "end" && "items-end text-right",
        className,
      )}
      {...props}
    >
      <span className="text-xs text-fg-subtle">{label}</span>
      <div className="flex items-baseline gap-2 numeric font-medium text-fg">
        {value}
        {typeof change === "number" ? <Delta value={change} size="sm" invert={invertChange} /> : null}
      </div>
      {hint ? <span className="text-xs text-fg-subtle tabular">{hint}</span> : null}
    </div>
  );
}
