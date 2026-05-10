"use client";

import * as React from "react";
import { ChevronRight, Flame } from "lucide-react";
import { TileCard } from "./tile-card";
import { Delta } from "./delta";
import { cn } from "../lib/utils";

/**
 * <RankedRail>
 *
 * The right-rail vertical leaderboard — "Hot models", "Trending compute",
 * "Live activity". Numbered rows with a primary value, an optional fire
 * indicator for hot items, and a drill-in chevron.
 *
 *   <RankedRail
 *     title="Hot models"
 *     items={hotModels}
 *     onSelect={…}
 *     viewAllHref="/markets?type=models"
 *   />
 */
export interface RankedItem {
  id: string;
  label: React.ReactNode;
  /** Primary trailing value — e.g. "$141K · 24h". */
  value: React.ReactNode;
  /** Optional secondary line. */
  meta?: React.ReactNode;
  /** Optional decimal change shown beneath the value. */
  change?: number;
  /** When true, renders the flame icon next to the value. */
  hot?: boolean;
  /** Optional thumbnail / avatar at the leading edge. */
  thumbnail?: React.ReactNode;
}

export interface RankedRailProps extends Omit<React.ComponentProps<typeof TileCard>, "title" | "onSelect"> {
  title: React.ReactNode;
  items: readonly RankedItem[];
  /** Click handler per row. */
  onSelect?: (item: RankedItem) => void;
  /** "View all" link href. Renders a chevron in the header. */
  viewAllHref?: string;
  /** Override the rank-number rendering. Defaults to two-digit padded integers. */
  formatRank?: (i: number) => React.ReactNode;
}

const defaultRank = (i: number) => (i + 1).toString().padStart(2, "0");

export function RankedRail({
  title,
  items,
  onSelect,
  viewAllHref,
  formatRank = defaultRank,
  className,
  ...rest
}: RankedRailProps) {
  return (
    <TileCard density="comfortable" className={cn("flex flex-col gap-3 p-0", className)} {...rest}>
      <header className="flex items-center justify-between border-b border-line-subtle px-4 py-3">
        <h3 className="text-md font-medium text-fg">{title}</h3>
        {viewAllHref ? (
          <a
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-xs text-fg-subtle transition-colors hover:text-fg"
          >
            View all
            <ChevronRight className="size-3" strokeWidth={2} />
          </a>
        ) : null}
      </header>

      <ol className="flex flex-col">
        {items.map((it, i) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => onSelect?.(it)}
              className={cn(
                "group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                "border-t border-line-subtle first:border-t-0 hover:bg-card/30",
              )}
            >
              <span className="w-5 shrink-0 font-mono text-xs tabular text-fg-subtle">
                {formatRank(i)}
              </span>
              {it.thumbnail ? (
                <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-sm border border-line-subtle bg-card">
                  {it.thumbnail}
                </span>
              ) : null}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-fg">{it.label}</span>
                {it.meta ? <span className="block truncate text-xs text-fg-subtle">{it.meta}</span> : null}
              </span>
              <span className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="flex items-center gap-1 font-mono text-xs tabular text-fg">
                  <span>{it.value}</span>
                  {it.hot ? <Flame className="size-3 text-accent" strokeWidth={2} fill="currentColor" /> : null}
                </span>
                {typeof it.change === "number" ? <Delta value={it.change} size="sm" /> : null}
              </span>
              <ChevronRight
                className="size-3.5 shrink-0 text-fg-subtle/40 transition-colors group-hover:text-fg-subtle"
                strokeWidth={2}
              />
            </button>
          </li>
        ))}
      </ol>
    </TileCard>
  );
}
