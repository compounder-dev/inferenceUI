"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface CategoryNavItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface CategoryNavProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: readonly CategoryNavItem[];
  value: string;
  onChange?: (id: string) => void;
}

export function CategoryNav({
  items,
  value,
  onChange,
  className,
  ...rest
}: CategoryNavProps) {
  return (
    <div
      className={cn(
        "relative flex items-stretch overflow-x-auto border-y border-line-subtle [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
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
              "group relative flex shrink-0 items-center gap-1.5 px-3.5 py-2.5 text-sm transition-colors",
              "after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-px after:h-0.5",
              active
                ? "text-fg after:bg-accent"
                : "text-fg-muted hover:text-fg after:bg-transparent",
            )}
            aria-pressed={active}
          >
            {item.icon ? (
              <span className={cn(
                "grid size-4 place-items-center transition-colors",
                active ? "text-accent" : "text-fg-subtle group-hover:text-fg",
              )}>
                {item.icon}
              </span>
            ) : null}
            <span className="whitespace-nowrap font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
