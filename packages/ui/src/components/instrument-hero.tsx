import { Button } from "./primitives/button";
import { ArrowUpRight, Bookmark, Zap } from "lucide-react";
import { TileCard } from "./tile-card";
import { Numeric } from "./numeric";
import { Delta } from "./delta";
import { Sparkline } from "./sparkline";
import { StatusPill } from "./status-pill";
import { WireframeGpu } from "./wireframe-gpu";
import { cn } from "../lib/utils";

export interface InstrumentHeroProps {
  name: string;
  kind: string;
  hostedBy: string;
  region: string;
  status: "available" | "live" | "low" | "offline";
  price: number;
  unit: string;
  secondaryUnit?: string;
  change: number;
  series: readonly number[];
  onWatch?: () => void;
  className?: string;
}

const statusMap = {
  available: { tone: "up" as const,    label: "Available",    pulse: false },
  live:      { tone: "up" as const,    label: "Live",         pulse: true  },
  low:       { tone: "warn" as const,  label: "Low capacity", pulse: false },
  offline:   { tone: "down" as const,  label: "Offline",      pulse: false },
};

export function InstrumentHero({
  name, kind, hostedBy, region, status,
  price, unit, secondaryUnit, change, series,
  onWatch, className,
}: InstrumentHeroProps) {
  const sb = statusMap[status];

  return (
    <section
      className={cn(
        "grid grid-cols-1 gap-px overflow-hidden border border-line-subtle bg-line-subtle",
        "lg:grid-cols-[280px_1fr]",
        className,
      )}
    >
      <TileCard
        density="comfortable"
        className="relative aspect-[4/3] overflow-hidden lg:aspect-auto"
      >
        <WireframeGpu className="absolute inset-0" />
        <div className="absolute left-3 top-3">
          <StatusPill tone={sb.tone} pulse={sb.pulse}>{sb.label}</StatusPill>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onWatch}
          className="absolute bottom-3 left-3 right-3 gap-1.5 border-line-subtle bg-card/40 backdrop-blur"
        >
          <Bookmark className="size-3.5" strokeWidth={1.75} />
          Add to watchlist
        </Button>
      </TileCard>

      <TileCard density="roomy">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-fg lg:text-4xl">{name}</h1>
          <span className="font-mono text-xs text-fg-subtle">{kind}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
          <span>Hosted by <span className="text-fg">{hostedBy}</span></span>
          <span className="text-fg-subtle/40">·</span>
          <span>{region}</span>
        </div>

        <div className="mt-8 grid grid-cols-1 items-end gap-6 sm:grid-cols-[max-content_1fr]">
          <div>
            <div className="flex items-baseline gap-3">
              <Numeric weight="display" prefix="USD" size="2.5rem">{price.toFixed(2)}</Numeric>
              <span className="font-mono text-xs text-fg-subtle">{unit}</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-fg-subtle tabular">
              <Delta value={change} size="md" />
              {secondaryUnit ? (
                <>
                  <span className="text-fg-subtle/40">·</span>
                  <span>{secondaryUnit}</span>
                </>
              ) : null}
            </div>
          </div>

          <Sparkline
            data={series}
            width={520}
            height={88}
            tone="auto"
            emphasizeLast
            shade
            strokeWidth={1.25}
            className="w-full"
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Button size="lg" className="gap-2">
            <Zap className="size-4" strokeWidth={2.4} fill="currentColor" />
            Launch runtime
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            View order book
            <ArrowUpRight className="size-3.5" strokeWidth={2} />
          </Button>
        </div>
      </TileCard>
    </section>
  );
}
