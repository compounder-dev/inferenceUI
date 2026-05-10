import { cn } from "@/lib/utils";

/**
 * <Numeric>
 *
 * Canonical numeric display. Always tabular. Defaults to the UI sans so
 * numbers sit on the same line as labels without optical drift, with a
 * `mono` weight available for monospaced data tables / code.
 */
export interface NumericProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  tone?: "default" | "up" | "down" | "muted" | "accent";
  /**
   * `display` — big hero numerics (semibold, tight tracking)
   * `medium` — card / inline numerics
   * `regular` — body numerics
   * `mono` — fixed-width data tables
   */
  weight?: "display" | "medium" | "regular" | "mono";
  /** Override font size (rem, px, or any CSS length). */
  size?: string;
}

const toneClass = {
  default: "text-fg",
  up: "text-data-up",
  down: "text-data-down",
  muted: "text-fg-muted",
  accent: "text-accent",
} as const;

const weightClass = {
  display: "font-semibold tracking-[-0.02em]",
  medium: "font-medium",
  regular: "font-normal",
  mono: "font-mono",
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
        "inline-flex items-baseline gap-1 leading-none tabular",
        weightClass[weight],
        toneClass[tone],
        className,
      )}
      style={{ fontSize: size, ...style }}
      {...props}
    >
      {prefix ? (
        <span className="font-mono text-[0.5em] uppercase tracking-[0.12em] text-fg-subtle translate-y-[-0.1em]">
          {prefix}
        </span>
      ) : null}
      <span>{children}</span>
      {suffix ? (
        <span className="font-mono text-[0.45em] uppercase tracking-[0.12em] text-fg-subtle translate-y-[-0.35em]">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}
