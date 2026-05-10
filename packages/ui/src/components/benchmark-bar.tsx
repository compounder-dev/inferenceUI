import { cn } from "../lib/utils";

/**
 * <BenchmarkBar>
 *
 * A horizontal proportional bar for benchmark scores. Higher value renders
 * a longer bar; the value is shown right-aligned in tabular mono.
 *
 *   <BenchmarkBar label="LLM inference" value={2843} unit="tok/s" max={3500} />
 */
export interface BenchmarkBarProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: number;
  /** Optional unit suffix shown after the value. */
  unit?: string;
  /** Maximum scale — controls the bar fill. Defaults to value (full bar). */
  max?: number;
  /** Optional comparison reference — e.g. "+15 vs prev". */
  delta?: React.ReactNode;
  /** Tone for the bar fill. Defaults to "accent". */
  tone?: "accent" | "up" | "down" | "neutral";
  /** Format the numeric value. */
  format?: (n: number) => string;
}

const toneClass: Record<NonNullable<BenchmarkBarProps["tone"]>, string> = {
  accent: "bg-accent",
  up: "bg-data-up",
  down: "bg-data-down",
  neutral: "bg-fg-subtle",
};

const defaultFormat = (n: number) => n.toLocaleString();

export function BenchmarkBar({
  label,
  value,
  unit,
  max,
  delta,
  tone = "accent",
  format = defaultFormat,
  className,
  ...rest
}: BenchmarkBarProps) {
  const ratio = max && max > 0 ? Math.min(1, value / max) : 1;
  return (
    <div className={cn("flex items-center gap-3 text-sm", className)} {...rest}>
      <span className="w-32 shrink-0 truncate text-fg-muted">{label}</span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-[2px] bg-card">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-[2px]", toneClass[tone])}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span className="w-24 shrink-0 text-right font-mono text-xs tabular text-fg">
        {format(value)}
        {unit ? <span className="ml-1 text-fg-subtle">{unit}</span> : null}
      </span>
      {delta ? <span className="w-12 text-right font-mono text-2xs tabular text-fg-subtle">{delta}</span> : null}
    </div>
  );
}
