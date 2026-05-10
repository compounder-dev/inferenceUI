import { cn } from "@/lib/utils";

/**
 * <Numeric>
 *
 * The single canonical way to render a number anywhere a number matters.
 * Always tabular, always mono, opinionated about prefix/suffix slot
 * styling so prices, latency, and rates read consistently.
 */
export interface NumericProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Tone applied to the value (not the prefix/suffix). */
  tone?: "default" | "up" | "down" | "muted" | "accent";
  /** Display weight — "display" uses the heavy industrial face for hero-scale numbers. */
  weight?: "regular" | "medium" | "display";
  /** Override font size (rem). */
  size?: string;
}

const toneClass = {
  default: "text-fg",
  up: "text-data-up",
  down: "text-data-down",
  muted: "text-fg-muted",
  accent: "text-accent",
} as const;

export function Numeric({
  prefix,
  suffix,
  tone = "default",
  weight = "medium",
  size,
  className,
  children,
  style,
  ...props
}: NumericProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1 leading-none",
        weight === "display" ? "display" : "numeric",
        weight === "medium" && "font-medium",
        toneClass[tone],
        className,
      )}
      style={{ fontSize: size, ...style }}
      {...props}
    >
      {prefix ? (
        <span className="text-fg-subtle font-mono text-[0.5em] tracking-[0.14em] uppercase translate-y-[-0.1em]">
          {prefix}
        </span>
      ) : null}
      <span>{children}</span>
      {suffix ? (
        <span className="text-fg-subtle font-mono text-[0.4em] tracking-[0.14em] uppercase translate-y-[-0.4em]">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}
