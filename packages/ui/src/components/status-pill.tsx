import { Badge } from "./primitives/badge";
import { cn } from "../lib/utils";

/**
 * <StatusPill>
 *
 * A live-status indicator built on top of shadcn `<Badge>`. The shape is
 * the badge — colour-coded dot + label, all the focus / a11y / interaction
 * polish you get from the primitive.
 */
type Tone = "up" | "warn" | "down" | "info" | "neutral";

const dotClass: Record<Tone, string> = {
  up:      "bg-data-up",
  warn:    "bg-data-warn",
  down:    "bg-data-down",
  info:    "bg-data-info",
  neutral: "bg-fg-subtle",
};

export interface StatusPillProps extends React.ComponentProps<typeof Badge> {
  tone?: Tone;
  pulse?: boolean;
}

export function StatusPill({
  tone = "up",
  pulse,
  variant = "outline",
  className,
  children,
  ...props
}: StatusPillProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        "h-6 gap-1.5 rounded-sm border-line bg-card/40 px-2 text-xs font-normal text-fg-muted",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn("inline-block h-1.5 w-1.5 rounded-full", dotClass[tone], pulse && "dot-live")}
      />
      <span>{children}</span>
    </Badge>
  );
}
