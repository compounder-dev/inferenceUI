import { cn } from "@/lib/utils";

/**
 * <StatusPill>
 *
 * A compact status indicator. A coloured dot plus a label. The chrome is
 * intentionally minimal — a hairline outline around a tabular label keeps
 * the dot doing the talking.
 */
type Tone = "up" | "warn" | "down" | "info" | "neutral";

const toneStyle: Record<Tone, string> = {
  up:      "bg-data-up",
  warn:    "bg-data-warn",
  down:    "bg-data-down",
  info:    "bg-data-info",
  neutral: "bg-fg-subtle",
};

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  pulse?: boolean;
  /** Renders a dot-only marker with no surrounding chrome. */
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
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        bare
          ? "text-[12px] text-fg-muted"
          : "h-6 rounded-sm border border-line bg-card/40 px-2 text-[11px] text-fg-muted",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "relative inline-block h-1.5 w-1.5 rounded-full",
          toneStyle[tone],
          pulse && "dot-live",
        )}
      />
      <span>{children}</span>
    </span>
  );
}
