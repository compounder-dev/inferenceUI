import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "../lib/utils";

// value is decimal — 0.021 renders +2.10%. Tone is automatic from sign; `invert` flips it for metrics where lower is better.
export interface DeltaProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  invert?: boolean;
}

const sizeClass = {
  sm: "text-2xs gap-0.5",
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
  let direction: "up" | "down" | "flat" = "flat";
  if (value > 0) direction = "up";
  else if (value < 0) direction = "down";

  let semantic = direction;
  if (invert && direction === "up") semantic = "down";
  else if (invert && direction === "down") semantic = "up";

  let tone = "text-fg-subtle";
  if (semantic === "up") tone = "text-data-up";
  else if (semantic === "down") tone = "text-data-down";

  let Icon = Minus;
  if (direction === "up") Icon = ArrowUp;
  else if (direction === "down") Icon = ArrowDown;

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
