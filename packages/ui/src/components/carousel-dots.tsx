"use client";

import * as React from "react";
import { cn } from "../lib/utils";

/**
 * <CarouselDots>
 *
 * Five-dot horizontal indicator. Click to jump. Designed to live beneath
 * a featured-market carousel and stay out of the way when there's only
 * one slide.
 */
export interface CarouselDotsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  count: number;
  active: number;
  onSelect?: (index: number) => void;
}

export function CarouselDots({
  count, active, onSelect, className, ...rest
}: CarouselDotsProps) {
  if (count <= 1) return null;
  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      role="tablist"
      aria-label="Carousel position"
      {...rest}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onSelect?.(i)}
            className={cn(
              "rounded-full transition-all",
              isActive
                ? "h-1.5 w-5 bg-fg"
                : "h-1.5 w-1.5 bg-fg-subtle/40 hover:bg-fg-subtle",
            )}
          />
        );
      })}
    </div>
  );
}
