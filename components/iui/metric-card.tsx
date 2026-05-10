import { TileCard } from "./tile-card";
import { Sparkline } from "./sparkline";
import { Delta } from "./delta";
import { cn } from "@/lib/utils";

/**
 * <MetricCard>
 *
 * A tile that pairs a label, a value, an optional change, and an optional
 * sparkline. Use for KPI grids, side rails, instrument detail panels.
 *
 * Composes <TileCard> (which extends shadcn <Card>) so every metric tile
 * lives inside the same surface lineage.
 */
export interface MetricCardProps extends Omit<React.ComponentProps<typeof TileCard>, "size"> {
  /** Caption above the value. */
  label: React.ReactNode;
  /** Primary numeric — string or pre-rendered ReactNode. */
  value: React.ReactNode;
  /** Optional unit suffix shown next to the value. */
  unit?: React.ReactNode;
  /** Optional decimal change — e.g. `0.024` → `+2.40%`. */
  change?: number;
  /** When true, an "up" change reads as a negative outcome (lower-is-better metrics). */
  invertChange?: boolean;
  /** Optional secondary line beneath the value. */
  hint?: React.ReactNode;
  /** Optional sparkline series. */
  spark?: readonly number[];
  sparkTone?: "auto" | "up" | "down" | "accent" | "neutral";
  /** Bigger numeric size — for hero or top-of-page placements. */
  size?: "sm" | "md" | "lg";
}

const valueSize = {
  sm: "text-md",
  md: "text-xl",
  lg: "text-3xl",
} as const;

export function MetricCard({
  label,
  value,
  unit,
  change,
  invertChange,
  hint,
  spark,
  sparkTone = "auto",
  size = "md",
  density = "comfortable",
  className,
  ...rest
}: MetricCardProps) {
  return (
    <TileCard density={density} className={cn("flex flex-col gap-3", className)} {...rest}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-fg-subtle">{label}</span>
        {typeof change === "number" ? <Delta value={change} size="sm" invert={invertChange} /> : null}
      </div>

      <div className="flex items-baseline gap-1.5 numeric font-medium tabular text-fg">
        <span className={cn(valueSize[size], "leading-none")}>{value}</span>
        {unit ? <span className="text-xs text-fg-subtle">{unit}</span> : null}
      </div>

      {hint ? <span className="text-xs text-fg-subtle tabular">{hint}</span> : null}

      {spark ? (
        <Sparkline
          data={spark}
          width={300}
          height={size === "lg" ? 60 : 40}
          tone={sparkTone}
          emphasizeLast
          strokeWidth={1.1}
          className="-mt-1 w-full"
        />
      ) : null}
    </TileCard>
  );
}
