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

export interface MarketEventMarker {
  at: number;
  label: React.ReactNode;
  tone?: "up" | "down" | "neutral";
}

export interface FeaturedMarketProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  primaryValue: React.ReactNode;
  primaryLabel?: React.ReactNode;
  change?: number;
  data: readonly number[];
  thumbnail?: React.ReactNode;
  primaryAction?: { label: React.ReactNode; tone?: "up" | "accent"; onClick?: () => void };
  secondaryAction?: { label: React.ReactNode; tone?: "down" | "neutral"; onClick?: () => void };
  footer?: React.ReactNode;
  events?: readonly MarketEventMarker[];
  context?: readonly { source: string; logo?: React.ReactNode; title: React.ReactNode; timeAgo: string }[];
  onShare?: () => void;
  onSave?: () => void;
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
  // Chart is always accent. Direction lives in <Delta>, never in line colour.
  const stroke = "var(--accent)";

  return (
    <TileCard density="comfortable" className={cn("flex flex-col gap-0 p-0", className)} {...rest}>
      <div className="grid grid-cols-1 gap-px bg-line-subtle md:grid-cols-[minmax(280px,360px)_1fr]" data-trend="brand">
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

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => min + range * p);

  return (
    <div ref={wrapRef} className="relative">
      <svg width={width} height={height} className="block" role="img" aria-label="Market chart">
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

        {events.map((ev, i) => {
          const idx = Math.min(points.length - 1, Math.max(0, ev.at));
          const p = points[idx];
          if (!p) return null;
          const tone = ev.tone ?? "up";
          let colour = "var(--fg-subtle)";
          if (tone === "up") colour = "var(--data-up)";
          else if (tone === "down") colour = "var(--data-down)";
          return (
            <g key={i}>
              <circle cx={p[0]} cy={p[1]} r={3.5} fill={colour} stroke="var(--background)" strokeWidth={1.5} />
            </g>
          );
        })}

        {points.length > 0 ? (
          (() => {
            const last = points[points.length - 1]!;
            return <circle cx={last[0]} cy={last[1]} r={4} fill={stroke} stroke="var(--background)" strokeWidth={1.5} />;
          })()
        ) : null}
      </svg>

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

      {events.map((ev, i) => {
        const idx = Math.min(points.length - 1, Math.max(0, ev.at));
        const p = points[idx];
        if (!p) return null;
        const tone = ev.tone ?? "up";
        let toneClass = "text-fg-subtle";
        if (tone === "up") toneClass = "text-data-up";
        else if (tone === "down") toneClass = "text-data-down";
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
