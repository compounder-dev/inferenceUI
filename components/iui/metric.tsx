import { cn } from "@/lib/utils";
import { DataLabel } from "./data-label";
import { Delta } from "./delta";

/**
 * <Metric>
 *
 * The smallest "value with caption" pattern in the system. Used in the
 * stat row beneath every chart, in tile grids, in side-rails. Strict order:
 * label → value → optional change.
 */
export interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Decimal change — e.g. 0.021 → "+2.10%". */
  change?: number;
  /** Optional secondary line. */
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
        "flex flex-col gap-1",
        align === "end" && "items-end text-right",
        className,
      )}
      {...props}
    >
      <DataLabel>{label}</DataLabel>
      <div className="flex items-baseline gap-2 numeric font-medium text-fg">
        <span className="tabular text-md leading-none">{value}</span>
        {typeof change === "number" ? <Delta value={change} size="sm" invert={invertChange} /> : null}
      </div>
      {hint ? <span className="text-[11px] text-fg-subtle tabular">{hint}</span> : null}
    </div>
  );
}
