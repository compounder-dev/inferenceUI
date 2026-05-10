"use client";

import * as React from "react";
import { Apple, Download, Terminal } from "lucide-react";
import { Button } from "./primitives/button";
import { TileCard } from "./tile-card";
import { cn } from "../lib/utils";

export interface AdonaiDownloadCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tagline?: React.ReactNode;
  version?: string;
  macUrl?: string;
  cli?: string;
  headline?: React.ReactNode;
}

export function AdonaiDownloadCard({
  tagline = "Run open-weight models locally on owned hardware. Pair to your workspace, route inference at the edge.",
  version = "v0.4.0 · Apple Silicon",
  macUrl = "#",
  cli = "curl -fsSL https://adonai.run/install.sh | sh",
  headline = "Adonai",
  className,
  ...rest
}: AdonaiDownloadCardProps) {
  return (
    <TileCard
      density="comfortable"
      className={cn(
        "relative overflow-hidden bg-background p-0",
        className,
      )}
      {...rest}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(from var(--accent) l c h / 12%) 1px, transparent 1px), linear-gradient(to bottom, oklch(from var(--accent) l c h / 12%) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(115deg, #000 20%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative grid grid-cols-1 items-stretch gap-8 p-6 md:grid-cols-[minmax(240px,1fr)_minmax(280px,1.2fr)] md:p-8">
        <div className="relative flex items-center justify-center">
          <Schematic className="w-full max-w-md text-accent" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.18em] text-accent">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
            New · runtime
          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-fg lg:text-4xl">{headline}</h2>
          <p className="mt-3 max-w-md text-md leading-relaxed text-fg-muted">{tagline}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-2xs tabular text-fg-subtle">
            <span className="rounded-sm border border-line-subtle bg-card/40 px-1.5 py-0.5">{version}</span>
            <span className="rounded-sm border border-line-subtle bg-card/40 px-1.5 py-0.5">macOS</span>
            <span className="rounded-sm border border-line-subtle bg-card/40 px-1.5 py-0.5">Linux · soon</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button size="lg" className="h-12 gap-2 px-5 text-base" onClick={() => { if (typeof window !== "undefined") window.location.href = macUrl; }}>
              <Apple className="size-4" strokeWidth={2} fill="currentColor" />
              Download for macOS
              <Download className="size-3.5" strokeWidth={2} />
            </Button>
            <CliCopy cli={cli} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line-subtle pt-4 text-xs">
            <div>
              <dt className="text-fg-subtle">Cold start</dt>
              <dd className="mt-0.5 font-mono text-sm tabular text-fg">~1.4 s</dd>
            </div>
            <div>
              <dt className="text-fg-subtle">Models supported</dt>
              <dd className="mt-0.5 font-mono text-sm tabular text-fg">42 · open weight</dd>
            </div>
            <div>
              <dt className="text-fg-subtle">Pairs with</dt>
              <dd className="mt-0.5 font-mono text-sm tabular text-fg">Inference Exchange</dd>
            </div>
            <div>
              <dt className="text-fg-subtle">Footprint</dt>
              <dd className="mt-0.5 font-mono text-sm tabular text-fg">28 MB · binary</dd>
            </div>
          </dl>
        </div>
      </div>
    </TileCard>
  );
}

function CliCopy({ cli }: { cli: string }) {
  const [copied, setCopied] = React.useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(cli);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-12 items-center gap-2 rounded-md border border-line bg-card/40 px-4 font-mono text-xs tabular text-fg-muted",
        "transition-colors hover:border-line-strong hover:text-fg",
      )}
    >
      <Terminal className="size-3.5 text-fg-subtle" strokeWidth={2} />
      <span className="truncate max-w-xs">{cli}</span>
      <span className={cn("ml-2 text-2xs uppercase tracking-[0.14em]", copied ? "text-data-up" : "text-fg-subtle")}>
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

function Schematic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 240"
      className={className}
      role="img"
      aria-label="Adonai hardware schematic"
    >
      <defs>
        <linearGradient id="adonai-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* outer chassis */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* top plate */}
        <path d="M 30 60 L 330 60 L 340 70 L 340 180 L 330 190 L 30 190 L 20 180 L 20 70 Z" />
        {/* corner bevels */}
        <path d="M 30 60 L 30 190" />
        <path d="M 330 60 L 330 190" />

        {/* board */}
        <rect x="42" y="76" width="276" height="98" fill="url(#adonai-fade)" />

        {/* SoC */}
        <rect x="138" y="100" width="84" height="48" />
        <text
          x="180"
          y="128"
          fontFamily="var(--font-mono)"
          fontSize="7"
          fill="currentColor"
          textAnchor="middle"
          letterSpacing="0.22em"
          opacity="0.95"
        >
          ADONAI · M
        </text>

        {/* RAM stacks */}
        <g>
          <rect x="76" y="92" width="40" height="64" />
          <line x1="80" y1="100" x2="112" y2="100" />
          <line x1="80" y1="112" x2="112" y2="112" />
          <line x1="80" y1="124" x2="112" y2="124" />
          <line x1="80" y1="136" x2="112" y2="136" />
          <line x1="80" y1="148" x2="112" y2="148" />
        </g>
        <g>
          <rect x="244" y="92" width="40" height="64" />
          <line x1="248" y1="100" x2="280" y2="100" />
          <line x1="248" y1="112" x2="280" y2="112" />
          <line x1="248" y1="124" x2="280" y2="124" />
          <line x1="248" y1="136" x2="280" y2="136" />
          <line x1="248" y1="148" x2="280" y2="148" />
        </g>

        {/* heat-pipes */}
        <path d="M 42 86 L 52 76 L 308 76 L 318 86" />
        <path d="M 42 164 L 52 174 L 308 174 L 318 164" />

        {/* IO edge */}
        <line x1="42" y1="84" x2="42" y2="166" />
        <line x1="36" y1="92" x2="36" y2="158" />
        <line x1="318" y1="84" x2="318" y2="166" />
        <line x1="324" y1="92" x2="324" y2="158" />

        {/* mounting tabs */}
        <rect x="14" y="90" width="6" height="14" />
        <rect x="14" y="146" width="6" height="14" />
        <rect x="340" y="90" width="6" height="14" />
        <rect x="340" y="146" width="6" height="14" />

        {/* coordinate ticks */}
        <g opacity="0.6" strokeWidth="0.5">
          <line x1="20" y1="50" x2="20" y2="56" />
          <line x1="180" y1="50" x2="180" y2="56" />
          <line x1="340" y1="50" x2="340" y2="56" />
          <line x1="20" y1="194" x2="20" y2="200" />
          <line x1="180" y1="194" x2="180" y2="200" />
          <line x1="340" y1="194" x2="340" y2="200" />
        </g>
        <g
          opacity="0.85"
          fontFamily="var(--font-mono)"
          fontSize="5"
          fill="currentColor"
          letterSpacing="0.22em"
        >
          <text x="20" y="46" textAnchor="start">A1</text>
          <text x="180" y="46" textAnchor="middle">CORE</text>
          <text x="340" y="46" textAnchor="end">B2</text>
          <text x="20" y="206" textAnchor="start">EDGE · 12W</text>
          <text x="180" y="206" textAnchor="middle">ADONAI · OS</text>
          <text x="340" y="206" textAnchor="end">RUNTIME · LOCAL</text>
        </g>
      </g>
    </svg>
  );
}
