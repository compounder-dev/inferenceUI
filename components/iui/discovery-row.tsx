"use client";

import * as React from "react";
import { Bookmark, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TileCard } from "./tile-card";
import { Numeric } from "./numeric";
import { Delta } from "./delta";
import { Sparkline } from "./sparkline";
import { StatusPill } from "./status-pill";
import { cn } from "@/lib/utils";

/**
 * <DiscoveryRow>
 *
 * The horizontal listing row used on index pages — markets, models,
 * agents, hardware. Wide on desktop, stacked on mobile, reads as a row
 * in a vertical stack of <TileCard>s.
 *
 *   <DiscoveryRow
 *     name="H100 80GB SXM"
 *     kind="GPU"
 *     hostedBy="Vultr · ZA-JNB"
 *     status="available"
 *     price={3.42}
 *     unit="/ hr"
 *     change={0.021}
 *     metrics={[{ label: "P50", value: "18 ms" }, { label: "Uptime", value: "99.91%" }]}
 *     series={priceSeries}
 *     onLaunch={() => …}
 *   />
 */
export interface DiscoveryRowMetric {
  label: string;
  value: React.ReactNode;
  /** Optional tone for the value. */
  tone?: "default" | "up" | "down" | "warn";
}

export interface DiscoveryRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** Type classifier — e.g. "GPU · Hopper" or "Model · 1M ctx". */
  kind?: string;
  /** Provider · region label. */
  hostedBy?: string;
  /** Optional inline icon — provider logo, hardware glyph, etc. */
  icon?: React.ReactNode;
  status: "available" | "live" | "low" | "offline";
  price: number;
  unit: string;
  /** 24h decimal change — `0.021` → `+2.10%`. */
  change?: number;
  /** Up to 3 secondary metrics shown inline. */
  metrics?: readonly DiscoveryRowMetric[];
  /** Sparkline series — desktop only. */
  series?: readonly number[];
  /** Currency formatter. Defaults to USD. */
  formatPrice?: (n: number) => string;
  /** Save / watchlist toggle. */
  saved?: boolean;
  onSave?: () => void;
  /** Primary launch handler. */
  onLaunch?: () => void;
  /** Whole-row click handler — opens the detail page. */
  onSelect?: () => void;
}

const statusMap = {
  available: { tone: "up" as const,    label: "Available",    pulse: false },
  live:      { tone: "up" as const,    label: "Live",         pulse: true  },
  low:       { tone: "warn" as const,  label: "Low capacity", pulse: false },
  offline:   { tone: "down" as const,  label: "Offline",      pulse: false },
};

const defaultFormat = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

const metricToneClass = {
  default: "text-fg",
  up: "text-data-up",
  down: "text-data-down",
  warn: "text-data-warn",
} as const;

export function DiscoveryRow({
  name, kind, hostedBy, icon, status,
  price, unit, change, metrics = [],
  series, formatPrice = defaultFormat,
  saved, onSave, onLaunch, onSelect,
  className, ...rest
}: DiscoveryRowProps) {
  const sb = statusMap[status];
  return (
    <TileCard
      density="comfortable"
      onClick={onSelect}
      className={cn(
        "grid grid-cols-1 items-center gap-4 md:grid-cols-[minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_140px_140px_auto]",
        onSelect && "cursor-pointer transition-colors hover:border-line-strong hover:bg-card/30",
        className,
      )}
      {...rest}
    >
      {/* Identity */}
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-sm border border-line-subtle bg-card">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-md font-medium text-fg">{name}</span>
            {kind ? <span className="hidden font-mono text-xs text-fg-subtle md:inline">{kind}</span> : null}
          </div>
          {hostedBy ? <div className="mt-0.5 truncate text-xs text-fg-muted">{hostedBy}</div> : null}
        </div>
      </div>

      {/* Status */}
      <div className="md:justify-self-start">
        <StatusPill tone={sb.tone} pulse={sb.pulse}>{sb.label}</StatusPill>
      </div>

      {/* Inline metrics */}
      <div className="hidden flex-wrap items-baseline gap-x-4 gap-y-1 md:flex">
        {metrics.slice(0, 2).map((m, i) => (
          <span key={i} className="flex items-baseline gap-1.5 text-xs text-fg-subtle">
            {m.label}
            <span className={cn("numeric tabular text-sm", metricToneClass[m.tone ?? "default"])}>{m.value}</span>
          </span>
        ))}
      </div>

      {/* Sparkline */}
      <div className="hidden lg:block">
        {series && series.length > 1 ? (
          <Sparkline data={series} width={120} height={28} tone="auto" emphasizeLast strokeWidth={1.1} />
        ) : null}
      </div>

      {/* Price + delta */}
      <div className="flex items-baseline justify-end gap-2 md:justify-self-end md:text-right">
        <Numeric weight="medium" tone="default" prefix="USD" size="1rem">
          {price.toFixed(2)}
        </Numeric>
        <span className="font-mono text-xs text-fg-subtle">{unit}</span>
        {typeof change === "number" ? <Delta value={change} size="sm" className="ml-1" /> : null}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5 md:justify-self-end">
        {onSave ? (
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={saved ? "Saved" : "Save"}
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            className={cn("h-8 w-8", saved && "text-accent")}
          >
            <Bookmark className="size-3.5" strokeWidth={1.75} fill={saved ? "currentColor" : "none"} />
          </Button>
        ) : null}
        {onLaunch ? (
          <Button
            size="sm"
            className="h-8 gap-1 px-3 text-xs"
            onClick={(e) => { e.stopPropagation(); onLaunch(); }}
          >
            <Zap className="size-3" strokeWidth={2.4} fill="currentColor" />
            Launch
          </Button>
        ) : null}
      </div>
    </TileCard>
  );
}
