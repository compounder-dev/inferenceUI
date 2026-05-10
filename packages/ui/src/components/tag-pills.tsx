"use client";

import * as React from "react";
import { cn } from "../lib/utils";

/**
 * <TagPills>
 *
 * A horizontal scrolling rail of category chips. Used above dense list
 * surfaces to switch corpus (All / Hardware / Models / Agents / Sandboxes…).
 * Single-select. The active chip is the only filled one.
 */
export interface TagPillItem {
  id: string;
  label: React.ReactNode;
  /** Optional inline count, e.g. "243". */
  count?: number | string;
}

export interface TagPillsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: readonly TagPillItem[];
  value: string;
  onChange?: (id: string) => void;
}

export function TagPills({
  items,
  value,
  onChange,
  className,
  ...rest
}: TagPillsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...rest}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange?.(item.id)}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-sm transition-colors",
              active
                ? "border-fg bg-fg text-background hover:bg-fg/90"
                : "border-line bg-card/40 text-fg-muted hover:border-line-strong hover:text-fg",
            )}
            aria-pressed={active}
          >
            <span className="font-medium">{item.label}</span>
            {item.count !== undefined ? (
              <span className={cn("font-mono text-2xs tabular", active ? "text-background/60" : "text-fg-subtle")}>
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
