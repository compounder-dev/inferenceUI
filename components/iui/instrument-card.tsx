import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { TileCard } from "./tile-card";
import { StatusPill } from "./status-pill";
import { Numeric } from "./numeric";
import { Delta } from "./delta";
import { Sparkline } from "./sparkline";
import { cn } from "@/lib/utils";

/**
 * <InstrumentCard>
 *
 * Compact instrument tile for grid views — search results, watchlists,
 * feature rails. Composes <TileCard>, <StatusPill>, <Numeric>, <Delta>,
 * <Sparkline>, and shadcn <Button>.
 *
 * The whole card is keyboard-clickable when `href` or `onClick` is set.
 */
export interface InstrumentCardProps extends Omit<React.ComponentProps<typeof TileCard>, "onClick"> {
  /** Instrument name (top of card). */
  name: string;
  /** Type / classifier — e.g. "GPU · Hopper". */
  kind?: string;
  /** Provider · region. */
  hostedBy?: string;
  region?: string;
  status: "available" | "live" | "low" | "offline";
  /** Numeric price. */
  price: number;
  /** Per-unit string — e.g. "/ hr". */
  unit: string;
  /** Decimal change — e.g. `0.021` → `+2.10%`. */
  change?: number;
  /** Sparkline series. */
  series?: readonly number[];
  /** Primary action handler — renders a Launch button if set. */
  onLaunch?: () => void;
  /** Make the entire surface clickable. */
  onClick?: () => void;
}

const statusMap = {
  available: { tone: "up" as const,    label: "Available",    pulse: false },
  live:      { tone: "up" as const,    label: "Live",         pulse: true  },
  low:       { tone: "warn" as const,  label: "Low capacity", pulse: false },
  offline:   { tone: "down" as const,  label: "Offline",      pulse: false },
};

export function InstrumentCard({
  name,
  kind,
  hostedBy,
  region,
  status,
  price,
  unit,
  change,
  series,
  onLaunch,
  onClick,
  className,
  density = "comfortable",
  ...rest
}: InstrumentCardProps) {
  const sb = statusMap[status];
  const interactive = Boolean(onClick);

  return (
    <TileCard
      density={density}
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-4",
        interactive && "cursor-pointer transition-colors hover:border-line-strong",
        className,
      )}
      {...rest}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-md font-medium text-fg">{name}</div>
          {(hostedBy || region) ? (
            <div className="mt-0.5 truncate text-xs text-fg-muted">
              {hostedBy}{hostedBy && region ? <span className="text-fg-subtle/40"> · </span> : null}{region}
            </div>
          ) : null}
        </div>
        <StatusPill tone={sb.tone} pulse={sb.pulse}>
          {sb.label}
        </StatusPill>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <Numeric weight="display" prefix="USD" size="1.75rem">
            {price.toFixed(2)}
          </Numeric>
          <div className="mt-1 flex items-center gap-2 text-xs text-fg-subtle">
            <span>{unit}</span>
            {typeof change === "number" ? (
              <>
                <span className="text-fg-subtle/40">·</span>
                <Delta value={change} size="sm" />
              </>
            ) : null}
          </div>
        </div>
        {series && series.length > 1 ? (
          <Sparkline
            data={series}
            width={120}
            height={32}
            tone="auto"
            emphasizeLast
            strokeWidth={1.1}
          />
        ) : null}
      </div>

      {kind || onLaunch ? (
        <div className="flex items-center justify-between gap-3 border-t border-line-subtle pt-3">
          {kind ? (
            <span className="font-mono text-xs text-fg-subtle">{kind}</span>
          ) : <span />}
          {onLaunch ? (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={(e) => { e.stopPropagation(); onLaunch(); }}
            >
              <Zap className="size-3" strokeWidth={2.4} fill="currentColor" />
              Launch
            </Button>
          ) : null}
        </div>
      ) : null}
    </TileCard>
  );
}
