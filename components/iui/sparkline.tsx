import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * <Sparkline>
 *
 * Pure-SVG line chart. No fill, no endpoint dot, no glow — a single
 * hairline stroke. The signature treatment: the last segment optionally
 * brightens to the accent so the eye lands on "now".
 */
type Tone = "auto" | "up" | "down" | "neutral" | "accent";

const stroke: Record<Exclude<Tone, "auto">, string> = {
  up: "var(--data-up)",
  down: "var(--data-down)",
  neutral: "var(--fg-subtle)",
  accent: "var(--accent)",
};

export interface SparklineProps extends Omit<React.SVGAttributes<SVGSVGElement>, "fill"> {
  data: readonly number[];
  width?: number;
  height?: number;
  tone?: Tone;
  /** Highlight the last segment in the accent colour. */
  emphasizeLast?: boolean;
  /** Stroke width. */
  strokeWidth?: number;
  /** Render an extremely subtle area beneath the line. */
  shade?: boolean;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  tone = "auto",
  emphasizeLast = false,
  strokeWidth = 1,
  shade = false,
  className,
  ...rest
}: SparklineProps) {
  const resolvedTone = React.useMemo<Exclude<Tone, "auto">>(() => {
    if (tone !== "auto") return tone;
    if (data.length < 2) return "neutral";
    return data[data.length - 1]! > data[0]! ? "up" : data[data.length - 1]! < data[0]! ? "down" : "neutral";
  }, [data, tone]);

  const { path, areaPath, lastPath } = React.useMemo(() => {
    if (data.length === 0) return { path: "", areaPath: "", lastPath: "" };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padY = strokeWidth + 1;
    const innerH = height - padY * 2;
    const stepX = data.length > 1 ? width / (data.length - 1) : 0;

    const points = data.map((v, i) => {
      const x = i * stepX;
      const y = padY + innerH - ((v - min) / range) * innerH;
      return [x, y] as const;
    });
    const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

    const last = points[points.length - 1]!;
    const second = points[points.length - 2] ?? points[0]!;
    const lastPath = `M${second[0].toFixed(2)},${second[1].toFixed(2)} L${last[0].toFixed(2)},${last[1].toFixed(2)}`;

    const first = points[0]!;
    const areaPath = `${path} L${last[0].toFixed(2)},${height} L${first[0].toFixed(2)},${height} Z`;

    return { path, areaPath, lastPath };
  }, [data, width, height, strokeWidth]);

  const c = stroke[resolvedTone];

  return (
    <svg
      role="img"
      aria-label="trend"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      {...rest}
    >
      {shade && data.length > 1 ? (
        <path d={areaPath} fill={c} fillOpacity="0.06" stroke="none" />
      ) : null}
      <path
        d={path}
        fill="none"
        stroke={c}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={emphasizeLast ? 0.55 : 1}
      />
      {emphasizeLast ? (
        <path
          d={lastPath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={strokeWidth + 0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </svg>
  );
}
