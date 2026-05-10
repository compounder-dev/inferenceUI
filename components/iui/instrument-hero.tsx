import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bookmark, Zap } from "lucide-react";
import { Numeric } from "./numeric";
import { Delta } from "./delta";
import { Sparkline } from "./sparkline";
import { StatusPill } from "./status-pill";
import { WireframeGpu } from "./wireframe-gpu";

/**
 * <InstrumentHero>
 *
 * Opening block of an instrument detail page. Composes:
 *   - artwork tile (left), with status overlay
 *   - identity block (right), with name / host / type
 *   - price block, big mono numerals + delta + sparkline
 */
export interface InstrumentHeroProps {
  name: string;
  /** A short classifier rendered subtly to the right — e.g. "GPU · Hopper". */
  kind: string;
  hostedBy: string;
  region: string;
  status: "available" | "live" | "low" | "offline";
  price: number;
  unit: string;
  secondaryUnit?: string;
  /** 24h change as a decimal — `0.021` → `+2.10%`. */
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
      {/* Artwork tile */}
      <div className="relative aspect-[4/3] bg-background lg:aspect-auto">
        <div className="absolute inset-0 gridlines-fine opacity-50" />
        <WireframeGpu className="absolute inset-0" />
        <div className="absolute left-3 top-3">
          <StatusPill tone={sb.tone} pulse={sb.pulse}>
            {sb.label}
          </StatusPill>
        </div>
        <button
          type="button"
          onClick={onWatch}
          className={cn(
            "absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5",
            "h-8 rounded-sm border border-line-subtle bg-card/40 text-[12px] text-fg-muted backdrop-blur",
            "transition-[border-color,color,background] duration-150",
            "hover:border-line-strong hover:bg-card/80 hover:text-fg",
          )}
        >
          <Bookmark className="size-3.5" strokeWidth={1.75} />
          Add to watchlist
        </button>
      </div>

      {/* Identity + numeric block */}
      <div className="bg-background p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="display text-5xl text-fg lg:text-6xl">{name}</h1>
          <span className="font-mono text-[11px] tracking-[0.06em] text-fg-subtle">{kind}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-fg-muted">
          <span>
            Hosted by <span className="text-fg">{hostedBy}</span>
          </span>
          <span className="text-fg-subtle/40">·</span>
          <span>{region}</span>
        </div>

        <div className="mt-8 grid grid-cols-1 items-end gap-6 sm:grid-cols-[max-content_1fr]">
          <div>
            <div className="flex items-baseline gap-3">
              <Numeric weight="display" tone="default" prefix="USD" size="3.5rem">
                {price.toFixed(2)}
              </Numeric>
              <span className="font-mono text-[11px] tracking-[0.04em] text-fg-subtle">
                {unit}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-[12px] text-fg-subtle tabular">
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

        <div className="mt-8 flex items-center gap-2">
          <Button size="lg" className="gap-2">
            <Zap className="size-4" strokeWidth={2.4} fill="currentColor" />
            Launch runtime
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            View order book
            <ArrowUpRight className="size-3.5" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </section>
  );
}
