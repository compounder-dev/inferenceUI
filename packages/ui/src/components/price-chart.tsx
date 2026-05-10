"use client";

import * as React from "react";
import { Toggle } from "./primitives/toggle";
import { cn } from "../lib/utils";

/**
 * <PriceChart>
 *
 * A time-series chart tuned for inference instruments. Pure SVG, no
 * library — single hairline stroke + faint area shade + a coordinate
 * crosshair on hover that reads time, price, and delta in mono-tabular.
 *
 *   <PriceChart
 *     data={priceSeries}
 *     timeframe="24h"
 *     onTimeframeChange={setTf}
 *   />
 */
export type Timeframe = "1h" | "6h" | "24h" | "7d" | "30d" | "90d";

export interface PriceChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Series — equal-spaced numeric samples. */
  data: readonly number[];
  /** Active timeframe (controlled). */
  timeframe?: Timeframe;
  /** Timeframe change handler — receives the new timeframe. */
  onTimeframeChange?: (tf: Timeframe) => void;
  /** Currency / unit suffix on the y-axis label, e.g. "USD / hr". */
  unitLabel?: string;
  /** Format the y-axis price tick. Defaults to USD currency. */
  formatPrice?: (n: number) => string;
  /** Render approx. axis tick labels — defaults to 4. */
  yTicks?: number;
  height?: number;
}

const TIMEFRAMES: Timeframe[] = ["1h", "6h", "24h", "7d", "30d", "90d"];

const defaultFormat = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

export function PriceChart({
  data,
  timeframe = "24h",
  onTimeframeChange,
  unitLabel = "USD / hr",
  formatPrice = defaultFormat,
  yTicks = 4,
  height = 280,
  className,
  ...rest
}: PriceChartProps) {
  const [hover, setHover] = React.useState<{ idx: number; x: number; y: number } | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(720);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(Math.floor(e.contentRect.width));
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const padX = 0;
  const padTop = 12;
  const padBottom = 24;
  const innerW = Math.max(0, width - padX * 2);
  const innerH = Math.max(0, height - padTop - padBottom);

  const { points, min, max, range, areaPath, linePath } = React.useMemo(() => {
    if (data.length === 0) {
      return { points: [] as Array<readonly [number, number]>, min: 0, max: 0, range: 1, areaPath: "", linePath: "" };
    }
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
    return { points, min, max, range, areaPath, linePath };
  }, [data, innerW, innerH, padX, padTop]);

  const ticks = React.useMemo(() => {
    if (yTicks <= 0 || data.length === 0) return [] as number[];
    return Array.from({ length: yTicks }, (_, i) => min + (range * i) / (yTicks - 1));
  }, [data.length, min, range, yTicks]);

  // Charts always render in the brand accent. Direction is communicated
  // by <Delta> chips and explicit semantic indicators — never by chart tone.
  const stroke = "var(--accent)";

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (data.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - padX;
    if (x < 0 || x > innerW) {
      setHover(null);
      return;
    }
    const stepX = innerW / Math.max(1, data.length - 1);
    const idx = Math.min(data.length - 1, Math.max(0, Math.round(x / stepX)));
    const p = points[idx]!;
    setHover({ idx, x: p[0], y: p[1] });
  };

  const onLeave = () => setHover(null);

  const hoverValue = hover ? data[hover.idx] : null;
  const firstValue = data[0] ?? 0;
  const hoverDelta = hoverValue !== null ? (hoverValue - firstValue) / firstValue : 0;

  return (
    <div className={cn("flex flex-col gap-3", className)} {...rest}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-fg-subtle">{unitLabel}</span>
        <div className="inline-flex items-center gap-0.5 rounded-md border border-line bg-card/40 p-0.5">
          {TIMEFRAMES.map((tf) => (
            <Toggle
              key={tf}
              size="sm"
              pressed={tf === timeframe}
              onPressedChange={(p) => p && onTimeframeChange?.(tf)}
              className={cn(
                "h-6 rounded-sm px-2 font-mono text-xs uppercase",
                tf === timeframe
                  ? "bg-secondary text-fg hover:bg-secondary hover:text-fg"
                  : "text-fg-subtle hover:text-fg",
              )}
            >
              {tf}
            </Toggle>
          ))}
        </div>
      </div>

      <div ref={wrapRef} className="relative overflow-hidden border border-line-subtle">
        {/* Y-axis labels (rendered as absolute mono captions over the SVG) */}
        <div className="pointer-events-none absolute inset-0">
          {ticks.map((t, i) => {
            const y = padTop + (innerH * (yTicks - 1 - i)) / (yTicks - 1);
            return (
              <span
                key={i}
                className="absolute right-2 -translate-y-1/2 font-mono text-2xs tabular text-fg-subtle"
                style={{ top: y }}
              >
                {formatPrice(t)}
              </span>
            );
          })}
        </div>

        <svg
          width={width}
          height={height}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="block"
          role="img"
          aria-label="Price history"
        >
          {/* horizontal gridlines */}
          {ticks.map((_, i) => {
            const y = padTop + (innerH * (yTicks - 1 - i)) / (yTicks - 1);
            return (
              <line
                key={i}
                x1={0}
                x2={width}
                y1={y}
                y2={y}
                stroke="var(--line-subtle)"
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
            );
          })}

          {/* area shade */}
          {data.length > 1 ? (
            <path d={areaPath} fill={stroke} fillOpacity={0.05} stroke="none" />
          ) : null}

          {/* line */}
          <path
            d={linePath}
            fill="none"
            stroke={stroke}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* hover crosshair */}
          {hover ? (
            <>
              <line
                x1={hover.x}
                x2={hover.x}
                y1={padTop}
                y2={padTop + innerH}
                stroke="var(--accent)"
                strokeWidth={1}
                strokeDasharray="2 3"
                opacity={0.75}
              />
              <line
                x1={0}
                x2={width}
                y1={hover.y}
                y2={hover.y}
                stroke="var(--accent)"
                strokeWidth={1}
                strokeDasharray="2 3"
                opacity={0.5}
              />
              <circle cx={hover.x} cy={hover.y} r={3} fill="var(--accent)" />
            </>
          ) : null}
        </svg>

        {/* hover readout */}
        {hover && hoverValue !== null ? (
          <div
            className="pointer-events-none absolute top-2 -translate-x-1/2 whitespace-nowrap border border-line bg-card/95 px-2 py-1 font-mono text-2xs tabular shadow-sm backdrop-blur"
            style={{ left: Math.max(60, Math.min(width - 60, hover.x)) }}
          >
            <span className="text-fg">{formatPrice(hoverValue)}</span>
            <span className="ml-2 text-fg-subtle">{(hoverDelta * 100).toFixed(2)}%</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
