"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Delta } from "./delta";

/**
 * <TickerTape>
 *
 * A horizontal live feed strip — scrolls a stream of price + status ticks
 * across the top of an index page. Single-line, hairline-bordered, monospace.
 *
 * The scroll uses `requestAnimationFrame` to translate a duplicated track,
 * so it never reflows on container resize and respects `prefers-reduced-motion`.
 */
export interface TickerItem {
  /** Short symbol — e.g. "H100·JNB". */
  symbol: string;
  /** Pre-formatted price string (e.g. "$3.42") OR a number that will be formatted. */
  price: string | number;
  /** Decimal change — `0.021` → `+2.10%`. */
  change?: number;
  /** Trailing unit suffix — e.g. "/ hr", "/ 1M tok". */
  unit?: string;
  /** Status flag — `live` adds a pulsing dot prefix. */
  live?: boolean;
}

export interface TickerTapeProps extends React.HTMLAttributes<HTMLDivElement> {
  items: readonly TickerItem[];
  /** Pixels per second. Defaults to 30. */
  speed?: number;
  /** Pause animation when the cursor is over the tape. Defaults to true. */
  pauseOnHover?: boolean;
  /** Currency formatter when a numeric `price` is supplied. */
  formatPrice?: (n: number) => string;
}

const defaultFormat = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

export function TickerTape({
  items,
  speed = 30,
  pauseOnHover = true,
  formatPrice = defaultFormat,
  className,
  ...rest
}: TickerTapeProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el || reducedMotion) return;
    let raf = 0;
    let last = performance.now();
    let offset = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!hovered || !pauseOnHover) {
        offset += speed * dt;
        const half = el.scrollWidth / 2;
        if (half > 0 && offset >= half) offset -= half;
        el.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered, pauseOnHover, speed, reducedMotion]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "iui-ticker relative w-full overflow-hidden border-y border-line-subtle bg-card/30",
        className,
      )}
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 64px, #000 calc(100% - 64px), transparent)",
      }}
      {...rest}
    >
      <div ref={trackRef} className="flex w-max will-change-transform" aria-hidden>
        {[0, 1].map((dup) => (
          <React.Fragment key={dup}>
            {items.map((it, i) => {
              const value = typeof it.price === "number" ? formatPrice(it.price) : it.price;
              return (
                <span
                  key={`${dup}-${i}`}
                  className="flex shrink-0 items-center gap-2.5 border-r border-line-subtle px-4 py-2"
                >
                  {it.live ? <span className="dot-live h-1.5 w-1.5 rounded-full bg-data-up" /> : null}
                  <span className="font-mono text-2xs uppercase tracking-[0.12em] text-fg-subtle">{it.symbol}</span>
                  <span className="numeric tabular text-sm text-fg">{value}</span>
                  {it.unit ? <span className="font-mono text-2xs text-fg-subtle">{it.unit}</span> : null}
                  {typeof it.change === "number" ? <Delta value={it.change} size="sm" /> : null}
                </span>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
