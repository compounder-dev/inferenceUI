import { cn } from "@/lib/utils";

/**
 * <StatusPill>
 *
 * A compact status indicator. Two parts: a colour-coded dot and a label.
 * No heavy fill, no rounded oval — a hairline outline around a tabular
 * mono label keeps the chrome quiet so the dot does the talking.
 */
type Tone = "up" | "warn" | "down" | "info" | "neutral";

const toneStyle: Record<Tone, { dot: string; ring: string }> = {
  up:      { dot: "bg-data-up",   ring: "ring-data-up/30" },
  warn:    { dot: "bg-data-warn", ring: "ring-data-warn/30" },
  down:    { dot: "bg-data-down", ring: "ring-data-down/30" },
  info:    { dot: "bg-data-info", ring: "ring-data-info/30" },
  neutral: { dot: "bg-fg-subtle", ring: "ring-line" },
};

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  pulse?: boolean;
  /** Renders the dot with no surrounding label chrome. */
  bare?: boolean;
}

export function StatusPill({
  tone = "up",
  pulse,
  bare,
  className,
  children,
  ...props
}: StatusPillProps) {
  const ts = toneStyle[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em]",
        bare
          ? "text-fg-muted"
          : "h-5 rounded-sm border border-line-subtle bg-surface-1/40 px-2 text-fg-muted",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "relative inline-block h-1.5 w-1.5 rounded-full",
          ts.dot,
          pulse && "dot-live",
        )}
      />
      <span className="tabular">{children}</span>
    </span>
  );
}
