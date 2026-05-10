"use client";

import * as React from "react";
import { Bookmark, Link2 } from "lucide-react";
import { Button } from "./primitives/button";
import { TileCard } from "./tile-card";
import { Sparkline } from "./sparkline";
import { Delta } from "./delta";
import { Numeric } from "./numeric";
import { NewsItem } from "./news-item";
import { cn } from "../lib/utils";

/**
 * <FeaturedMarket>
 *
 * The hero composition of the exchange homepage. A two-column block —
 * identity + dual primary actions on the left, a wide chart on the right
 * with optional event annotations along the price line. Below the actions
 * sits a context rail of recent news / market events.
 *
 * Designed to stack cleanly on mobile (chart below identity) and to host
 * either a binary primary action ("Launch / Watchlist") or a single CTA.
 */

export interface MarketEventMarker {
  /** Index along the data series (0..data.length-1). */
  at: number;
  /** Short caption — e.g. "+ $5", "Launch", "+12 inst". */
  label: React.ReactNode;
  /** Tone — defaults to up. */
  tone?: "up" | "down" | "neutral";
}

export interface FeaturedMarketProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Headline question / instrument name. */
  title: React.ReactNode;
  /** Big leading metric — e.g. "$3.42", "7% chance", "99.91%". */
  primaryValue: React.ReactNode;
  /** Caption beneath the metric — e.g. "spot · 24h" or "chance". */
  primaryLabel?: React.ReactNode;
  /** 24h decimal change — `0.021` → `+2.10%`. */
  change?: number;
  /** Sparkline / chart data. */
  data: readonly number[];
  /** Optional thumbnail / logo to the left of the title. */
  thumbnail?: React.ReactNode;
  /** Primary action — e.g. "Launch runtime" or "Buy". */
  primaryAction?: { label: React.ReactNode; tone?: "up" | "accent"; onClick?: () => void };
  /** Secondary action — e.g. "Watchlist", "Compare". Optional. */
  secondaryAction?: { label: React.ReactNode; tone?: "down" | "neutral"; onClick?: () => void };
  /** Volume / footer label — e.g. "$5M Vol · Ends Dec 31, 2026". */
  footer?: React.ReactNode;
  /** Optional event markers placed on the chart. */
  events?: readonly MarketEventMarker[];
  /** Optional news context items rendered alongside the chart. */
  context?: readonly { source: string; logo?: React.ReactNode; title: React.ReactNode; timeAgo: string }[];
  /** Wire the share/copy button. */
  onShare?: () => void;
  /** Wire the bookmark/save button. */
  onSave?: () => void;
  /** Show the bookmark in active state. */
  saved?: boolean;
}

export function FeaturedMarket({
  title,
  primaryValue,
  primaryLabel = "live",
  change,
  data,
  thumbnail,
  primaryAction,
  secondaryAction,
  footer,
  events = [],
  context = [],
  onShare,
  onSave,
  saved,
  className,
  ...rest
}: FeaturedMarketProps) {
  // Chart always renders in the brand accent — never auto-tones red/green.
  // Direction is conveyed by the <Delta> chip alone.
  const stroke = "var(--accent)";

  return (
    <TileCard density="comfortable" className={cn("flex flex-col gap-0 p-0", className)} {...rest}>
      <div className="grid grid-cols-1 gap-px bg-line-subtle md:grid-cols-[minmax(280px,360px)_1fr]" data-trend="brand">
        {/* LEFT — identity + actions + context */}
        <div className="flex min-w-0 flex-col gap-5 bg-background p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              {thumbnail ? (
                <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-card">
                  {thumbnail}
                </span>
              ) : null}
              <h2 className="text-xl font-medium leading-tight tracking-tight text-fg">{title}</h2>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {onShare ? (
                <Button size="icon-sm" variant="ghost" aria-label="Copy link" onClick={onShare} className="h-7 w-7">
                  <Link2 className="size-3.5" strokeWidth={1.75} />
                </Button>
              ) : null}
              {onSave ? (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={saved ? "Saved" : "Save"}
                  onClick={onSave}
                  className={cn("h-7 w-7", saved && "text-accent")}
                >
                  <Bookmark className="size-3.5" strokeWidth={1.75} fill={saved ? "currentColor" : "none"} />
                </Button>
              ) : null}
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <Numeric weight="display" tone="default" size="2.5rem">
                {primaryValue}
              </Numeric>
              {typeof change === "number" ? <Delta value={change} size="md" /> : null}
            </div>
            {primaryLabel ? (
              <p className="mt-1 text-xs text-fg-subtle">{primaryLabel}</p>
            ) : null}
          </div>

          {(primaryAction || secondaryAction) ? (
            <div className="flex items-center gap-2">
              {primaryAction ? (
                <Button
                  size="lg"
                  onClick={primaryAction.onClick}
                  className="h-11 flex-1 gap-2 text-base font-medium"
                >
                  {primaryAction.label}
                </Button>
              ) : null}
              {secondaryAction ? (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={secondaryAction.onClick}
                  className="h-11 flex-1 border-line bg-transparent text-base font-medium text-fg-muted hover:text-fg"
                >
                  {secondaryAction.label}
                </Button>
              ) : null}
            </div>
          ) : null}

          {context.length > 0 ? (
            <ul className="flex flex-col gap-3 border-t border-line-subtle pt-4">
              {context.slice(0, 3).map((c, i) => (
                <li key={i}>
                  <NewsItem
                    source={c.source}
                    sourceLogo={c.logo}
                    title={c.title}
                    timeAgo={c.timeAgo}
                    multiline
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* RIGHT — chart with event markers */}
        <div className="relative flex flex-col bg-background">
          <ChartArea data={data} events={events} stroke={stroke} />
          {footer ? (
            <div className="flex items-center justify-between border-t border-line-subtle px-5 py-3 text-xs text-fg-subtle">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </TileCard>
  );
}

function ChartArea({
  data,
  events,
  stroke,
}: {
  data: readonly number[];
  events: readonly MarketEventMarker[];
  stroke: string;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(720);
  const height = 260;
  const padTop = 24;
  const padBottom = 36;
  const padX = 16;
  const innerW = Math.max(0, width - padX * 2);
  const innerH = Math.max(0, height - padTop - padBottom);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.floor(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { points, min, max, range, linePath, areaPath } = React.useMemo(() => {
    if (data.length === 0) return { points: [], min: 0, max: 0, range: 1, linePath: "", areaPath: "" };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
    const points = data.map((v, i) => {
      const x = padX + i * stepX;
      const y = padTop + innerH - ((v - min) / range) * innerH;
      return [x, y] as const;
    });
    const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
    const last = points[points.length - 1]!;
    const first = points[0]!;
    const areaPath = `${linePath} L${last[0].toFixed(2)},${padTop + innerH} L${first[0].toFixed(2)},${padTop + innerH} Z`;
    return { points, min, max, range, linePath, areaPath };
  }, [data, innerW, innerH]);

  // Y-axis tick labels
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => min + range * p);

  return (
    <div ref={wrapRef} className="relative">
      <svg width={width} height={height} className="block" role="img" aria-label="Market chart">
        {/* horizontal gridlines */}
        {ticks.map((_, i) => {
          const y = padTop + (innerH * (ticks.length - 1 - i)) / (ticks.length - 1);
          return (
            <line
              key={i}
              x1={0} x2={width} y1={y} y2={y}
              stroke="var(--line-subtle)"
              strokeWidth={1}
              strokeDasharray={i === 0 || i === ticks.length - 1 ? undefined : "2 4"}
              shapeRendering="crispEdges"
            />
          );
        })}

        {data.length > 1 ? (
          <path d={areaPath} fill={stroke} fillOpacity={0.06} stroke="none" />
        ) : null}
        <path
          d={linePath}
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* event markers */}
        {events.map((ev, i) => {
          const idx = Math.min(points.length - 1, Math.max(0, ev.at));
          const p = points[idx];
          if (!p) return null;
          const tone = ev.tone ?? "up";
          const colour = tone === "up" ? "var(--data-up)" : tone === "down" ? "var(--data-down)" : "var(--fg-subtle)";
          return (
            <g key={i}>
              <circle cx={p[0]} cy={p[1]} r={3.5} fill={colour} stroke="var(--background)" strokeWidth={1.5} />
            </g>
          );
        })}

        {/* end-point dot */}
        {points.length > 0 ? (
          (() => {
            const last = points[points.length - 1]!;
            return <circle cx={last[0]} cy={last[1]} r={4} fill={stroke} stroke="var(--background)" strokeWidth={1.5} />;
          })()
        ) : null}
      </svg>

      {/* Y-axis labels overlay */}
      <div className="pointer-events-none absolute inset-0">
        {ticks.map((t, i) => {
          const y = padTop + (innerH * (ticks.length - 1 - i)) / (ticks.length - 1);
          if (i === 0 || i === ticks.length - 1) return null;
          return (
            <span
              key={i}
              className="absolute right-3 -translate-y-1/2 font-mono text-2xs tabular text-fg-subtle"
              style={{ top: y }}
            >
              {Math.round(((t - min) / (range || 1)) * 100)}%
            </span>
          );
        })}
      </div>

      {/* event labels (positioned absolutely above markers) */}
      {events.map((ev, i) => {
        const idx = Math.min(points.length - 1, Math.max(0, ev.at));
        const p = points[idx];
        if (!p) return null;
        const tone = ev.tone ?? "up";
        const toneClass =
          tone === "up" ? "text-data-up" : tone === "down" ? "text-data-down" : "text-fg-subtle";
        return (
          <span
            key={i}
            className={cn(
              "pointer-events-none absolute -translate-x-1/2 whitespace-nowrap font-mono text-2xs tabular",
              toneClass,
            )}
            style={{ left: p[0], top: Math.max(0, p[1] - 18) }}
          >
            {ev.label}
          </span>
        );
      })}
    </div>
  );
}
