"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

/**
 * <CoordStrip>
 *
 * A top-of-page strip that renders system identity, region, and live UTC
 * timestamp in mono caps. It exists to ground every page in a
 * mission-critical operational frame: where am I, what region, what time,
 * what state.
 *
 * Always lives inside a 1px hairline-bordered row.
 */
export interface CoordStripProps extends React.HTMLAttributes<HTMLDivElement> {
  /** First slot, e.g. "INFERENCE.EX". */
  system?: string;
  /** Second slot, e.g. "ZA-JNB". */
  region?: string;
  /** Right-side state indicator label, e.g. "ALL SYSTEMS OPERATIONAL". */
  state?: string;
  /** State tone — matches the leading dot. */
  tone?: "up" | "warn" | "down" | "info";
  /** Override the live clock with a static string. */
  fixedTime?: string;
}

const toneClass: Record<NonNullable<CoordStripProps["tone"]>, string> = {
  up: "bg-data-up",
  warn: "bg-data-warn",
  down: "bg-data-down",
  info: "bg-data-info",
};

export function CoordStrip({
  system = "INFERENCE.EX",
  region = "GLOBAL",
  state = "ALL SYSTEMS OPERATIONAL",
  tone = "up",
  fixedTime,
  className,
  ...props
}: CoordStripProps) {
  const [now, setNow] = useState(() => fmt(new Date()));
  useEffect(() => {
    if (fixedTime) return;
    const id = window.setInterval(() => setNow(fmt(new Date())), 1000);
    return () => window.clearInterval(id);
  }, [fixedTime]);

  const time = fixedTime ?? now;

  return (
    <div
      className={cn(
        "coord-strip flex h-7 items-center justify-between gap-4 border-b border-line-subtle px-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Slot label={system} />
        <Sep />
        <Slot label={region} />
        <Sep />
        <Slot label={time} />
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("h-1.5 w-1.5 rounded-full", toneClass[tone])} />
        <Slot label={state} muted />
      </div>
    </div>
  );
}

function Slot({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <span className={cn("tabular", muted ? "text-fg-subtle" : "text-fg-muted")}>
      {label}
    </span>
  );
}

function Sep() {
  return <span className="text-fg-subtle/40">{"·"}</span>;
}

function fmt(d: Date): string {
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
