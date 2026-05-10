import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * <Delta>
 *
 * A signed percentage change. Tone is automatic: positive → up,
 * negative → down, zero → neutral. Every render is tabular and mono.
 */
export interface DeltaProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Decimal — 0.021 → +2.10%. */
  value: number;
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  /** Override the natural tone — useful when the metric inverts (lower is better). */
  invert?: boolean;
}

const sizeClass = {
  sm: "text-[10px] gap-0.5",
  md: "text-xs gap-1",
  lg: "text-sm gap-1",
} as const;

const arrowSize = { sm: 8, md: 10, lg: 12 } as const;

export function Delta({
  value,
  size = "md",
  showArrow = true,
  invert = false,
  className,
  ...props
}: DeltaProps) {
  const direction = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const semantic = invert ? (direction === "up" ? "down" : direction === "down" ? "up" : "flat") : direction;

  const tone =
    semantic === "up" ? "text-data-up" : semantic === "down" ? "text-data-down" : "text-fg-subtle";

  const Icon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;
  const formatted = `${value > 0 ? "+" : ""}${(value * 100).toFixed(2)}%`;

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono tabular tracking-tight font-medium",
        sizeClass[size],
        tone,
        className,
      )}
      {...props}
    >
      {showArrow ? <Icon size={arrowSize[size]} strokeWidth={2.5} /> : null}
      {formatted}
    </span>
  );
}
