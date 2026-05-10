import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bookmark, Zap } from "lucide-react";
import { DataLabel } from "./data-label";
import { Numeric } from "./numeric";
import { Delta } from "./delta";
import { Sparkline } from "./sparkline";
import { StatusPill } from "./status-pill";
import { WireframeGpu } from "./wireframe-gpu";

/**
 * <InstrumentHero>
 *
 * The block that opens an instrument detail page. Composes:
 * - artwork tile (left), with status overlay
 * - identity block (right), with badge / name / host metadata
 * - price block, big mono numerals, paired with delta + sparkline
 *
 * Intentionally does *not* include the right-rail launch panel — that
 * composes alongside this block at the page level.
 */
export interface InstrumentHeroProps {
  /** The instrument identifier — e.g. "H100 80GB SXM". */
  name: string;
  /** Type pill — e.g. "GPU", "Edge", "Model". */
  kind: string;
  /** Hosted-by — provider name. */
  hostedBy: string;
  /** Region label — e.g. "Johannesburg, ZA". */
  region: string;
  /** Status pill state. */
  status: "available" | "live" | "low" | "offline";
  /** Current price as a number, in USD. */
  price: number;
  /** Per-unit string — e.g. "/ hr", "/ 1M tok". */
  unit: string;
  /** Secondary unit slot — e.g. "$0.0095 / min". */
  secondaryUnit?: string;
  /** 24h decimal change — 0.021 → +2.10%. */
  change: number;
  /** Sparkline series — last N points. */
  series: readonly number[];
  /** Click handler for "Add to watchlist". */
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
  name,
  kind,
  hostedBy,
  region,
  status,
  price,
  unit,
  secondaryUnit,
  change,
  series,
  onWatch,
  className,
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
      <div className="relative aspect-[4/3] bg-surface-0 lg:aspect-auto">
        <div className="absolute inset-0 gridlines-fine opacity-60" />
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
            "h-8 rounded-sm border border-line-subtle bg-surface-0/60 text-[10px] font-mono uppercase tracking-[0.14em] text-fg-muted backdrop-blur",
            "transition-[border-color,color,background] duration-150",
            "hover:border-line-strong hover:bg-surface-1/80 hover:text-fg",
          )}
        >
          <Bookmark className="size-3" strokeWidth={2} />
          Add to watchlist
        </button>
      </div>

      {/* Identity + numeric block */}
      <div className="bg-surface-0 p-6 lg:p-8">
        <div className="flex items-center gap-2">
          <DataLabel index={1}>Instrument</DataLabel>
          <span className="h-px flex-1 bg-line-subtle" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            {kind}
          </span>
        </div>

        <h1 className="display mt-3 text-5xl text-fg lg:text-6xl">{name}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-fg-muted">
          <span>
            Hosted by <span className="text-fg">{hostedBy}</span>
          </span>
          <span className="text-fg-subtle/40">·</span>
          <span>{region}</span>
        </div>

        {/* price block */}
        <div className="mt-8 grid grid-cols-1 items-end gap-6 sm:grid-cols-[max-content_1fr]">
          <div>
            <DataLabel>Spot price</DataLabel>
            <div className="mt-2 flex items-baseline gap-3">
              <Numeric weight="display" tone="default" prefix="USD" size="3.5rem">
                {price.toFixed(2)}
              </Numeric>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">
                {unit}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-fg-subtle tabular">
              <Delta value={change} size="md" />
              {secondaryUnit ? (
                <>
                  <span className="text-fg-subtle/40">·</span>
                  <span>{secondaryUnit}</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <DataLabel>24h trend</DataLabel>
              <span className="font-mono text-[10px] tabular text-fg-subtle">
                {series.length}p · 24h
              </span>
            </div>
            <Sparkline
              data={series}
              width={520}
              height={80}
              tone="auto"
              emphasizeLast
              shade
              strokeWidth={1.25}
              className="w-full"
            />
          </div>
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
