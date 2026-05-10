"use client";

import * as React from "react";
import {
  Star, ArrowDownToLine, ArrowUpFromLine,
  Cpu, HardDrive, Code, Globe, Package,
  Activity, Zap, ChevronDown, Briefcase, ShieldCheck, FlaskConical,
} from "lucide-react";
import { Button } from "@inferenceui/ui";
import { Tabs, TabsList, TabsTrigger } from "@inferenceui/ui";
import { Separator } from "@inferenceui/ui";
import { TileCard } from "@inferenceui/ui";
import { Numeric } from "@inferenceui/ui";
import { Delta } from "@inferenceui/ui";
import { Sparkline } from "@inferenceui/ui";
import { TopNav } from "@inferenceui/ui";
import { HardwareThumb, type HardwareKind } from "@inferenceui/ui";
import { cn } from "@inferenceui/ui";

// Real product / brand image URLs. Sourced from Unsplash + Wikimedia (stable).
// HardwareThumb gracefully falls back to a typed glyph if a URL 404s.
const IMG = {
  h100:    "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=240&h=240&fit=crop&q=80",
  a100:    "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?w=240&h=240&fit=crop&q=80",
  l40s:    "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=240&h=240&fit=crop&q=80",
  macMini: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=240&h=240&fit=crop&q=80",
  jetson:  "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=240&h=240&fit=crop&q=80",
  rpi:     "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=240&h=240&fit=crop&q=80",
  meta:    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/240px-Meta_Platforms_Inc._logo.svg.png",
  anthropic: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Claude_AI_symbol.svg/240px-Claude_AI_symbol.svg.png",
} as const;

// ──────────────────────────────────────────────────────────────────────────
// Mock data — exchange seeds. In a real app these come from the API spine.
// ──────────────────────────────────────────────────────────────────────────

const FEATURED_SERIES = [
  3.18, 3.21, 3.19, 3.22, 3.27, 3.30, 3.34, 3.31, 3.28, 3.30,
  3.36, 3.41, 3.39, 3.34, 3.38, 3.43, 3.40, 3.37, 3.39, 3.42,
];

const TRENDING_TABS = [
  { id: "trending", label: "Trending" },
  { id: "new",      label: "New" },
  { id: "hardware", label: "Hardware" },
  { id: "models",   label: "Models" },
  { id: "agents",   label: "Agents" },
  { id: "edge",     label: "Edge" },
  { id: "open",     label: "Open weight" },
];

type MarketSeed = {
  id: string;
  hwKind: HardwareKind;
  image?: string;
  title: string;
  kind: string;
  venue: string;
  price: number;
  unit: string;
  change: number;
  vol: string;
  series: readonly number[];
};

const TRENDING_MARKETS: readonly MarketSeed[] = [
  { id: "h100",     hwKind: "gpu",   image: IMG.h100,    title: "H100 80GB SXM",     kind: "GPU · Hopper",         venue: "Vultr · ZA-JNB",       price: 3.42,  unit: "/ hr",      change:  0.021, vol: "$11.2M", series: [3.14, 3.18, 3.22, 3.27, 3.30, 3.34, 3.36, 3.42] },
  { id: "opus-4-7", hwKind: "model", image: IMG.anthropic, title: "Claude Opus 4.7", kind: "Model · 1M ctx",       venue: "Anthropic · global",   price: 15.00, unit: "/ 1M tok",  change:  0.012, vol: "$141K",  series: [14.7, 14.8, 14.9, 15.0, 15.1, 15.0, 15.0] },
  { id: "llama-4",  hwKind: "model", image: IMG.meta,    title: "Llama 4 Instruct",   kind: "Model · 128K · open",  venue: "Meta · global",        price: 0.42,  unit: "/ 1M tok",  change: -0.028, vol: "$270K",  series: [0.45, 0.44, 0.43, 0.42, 0.42, 0.42] },
  { id: "a100",     hwKind: "gpu",   image: IMG.a100,    title: "A100 80GB PCIe",     kind: "GPU · Ampere",         venue: "Vultr · ZA-JNB",       price: 2.45,  unit: "/ hr",      change:  0.012, vol: "$5.4M",  series: [2.40, 2.41, 2.43, 2.44, 2.45, 2.45, 2.45] },
  { id: "m2-stb",   hwKind: "edge",  image: IMG.macMini, title: "Mac mini M2 Pro",    kind: "Edge · Apple Silicon", venue: "EdgeLab · ZA-STB",     price: 0.45,  unit: "/ hr",      change: -0.031, vol: "$420K",  series: [0.50, 0.49, 0.48, 0.47, 0.46, 0.45, 0.45] },
  { id: "orin",     hwKind: "edge",  image: IMG.jetson,  title: "Jetson Orin Nano",   kind: "Edge · ARM",           venue: "CapeCompute · ZA-CPT", price: 0.18,  unit: "/ hr",      change: -0.067, vol: "$210K",  series: [0.22, 0.21, 0.20, 0.19, 0.18, 0.18, 0.18] },
];

const POSITIONS = [
  { id: "h100", label: "H100 80GB SXM", side: "Active", qty: "2 instances", value: "$2,341.20", change: 0.084 },
  { id: "opus", label: "Claude Opus 4.7", side: "Streaming", qty: "120K req · 24h", value: "$1,125.00", change: 0.024 },
  { id: "hermes", label: "Hermes Agent", side: "Idle", qty: "1 runtime", value: "$48.50", change: -0.012 },
];

const TOP_MOVERS = [
  { label: "Llama 4 Instruct", price: "$0.42", change: 0.180, sub: "/ 1M tok" },
  { label: "Hermes Agent", price: "$0.50", change: 0.120, sub: "/ hr" },
  { label: "H100 · ZA-JNB", price: "$3.42", change: 0.090, sub: "/ hr" },
  { label: "A100 · ZA-JNB", price: "$2.45", change: -0.014, sub: "/ hr" },
  { label: "Jetson Orin", price: "$0.18", change: -0.067, sub: "/ hr" },
];

const BUNDLES = [
  { id: "gpu",   title: "GPU compute", count: 6, vol: "$28.4M", icon: <Cpu className="size-4" strokeWidth={1.75} /> },
  { id: "open",  title: "Open-weight models", count: 12, vol: "$4.1M", icon: <Code className="size-4" strokeWidth={1.75} /> },
  { id: "edge",  title: "Edge hardware", count: 8, vol: "$1.2M", icon: <HardDrive className="size-4" strokeWidth={1.75} /> },
];

const WATCHLIST = [
  { label: "Claude Opus 4.7", price: "$15.00", change: 0.012 },
  { label: "H100 80GB SXM",   price: "$3.42",  change: 0.021 },
  { label: "Llama 4 Instruct", price: "$0.42", change: -0.028 },
  { label: "Hermes Agent",    price: "$0.50",  change: 0.120 },
  { label: "A100 80GB PCIe",  price: "$2.45",  change: 0.012 },
];

const CATALYSTS = [
  { date: "MAY 12", title: "Vultr ZA-JNB capacity expansion", tag: "Major" },
  { date: "MAY 14", title: "Llama 4 long-context release",   tag: "Major" },
  { date: "MAY 16", title: "Hermes Agent v2 rollout",        tag: "Medium" },
  { date: "MAY 22", title: "Frankfurt region maintenance",   tag: "Minor" },
];

// ──────────────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const [tab, setTab] = React.useState("discover");
  const [trendingTab, setTrendingTab] = React.useState("trending");

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <TopNav active={tab} onChange={setTab} account={{ initials: "NL", label: "0x7f…3a2e" }} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-10 lg:py-10">
          {/* Hero row — three columns: pitch / featured market / balance */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)_minmax(280px,320px)]">
            <HeroPitch />
            <FeaturedMarket />
            <BalanceRail />
          </section>

          {/* Trending markets */}
          <section className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight text-fg">Trending markets</h2>
              <a className="text-sm text-accent hover:underline" href="#">View all →</a>
            </div>

            <Tabs value={trendingTab} onValueChange={setTrendingTab} className="mt-4">
              <TabsList className="bg-transparent p-0 gap-1 h-auto flex-wrap justify-start">
                {TRENDING_TABS.map((t) => (
                  <TabsTrigger
                    key={t.id}
                    value={t.id}
                    className={cn(
                      "h-8 rounded-md border border-line px-3 text-sm font-medium",
                      "data-[state=active]:bg-accent-soft data-[state=active]:border-accent/40 data-[state=active]:text-accent",
                      "data-[state=inactive]:bg-card data-[state=inactive]:text-fg-muted",
                      "hover:text-fg",
                    )}
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TRENDING_MARKETS.map((m) => (
                <MarketCard key={m.id} {...m} />
              ))}
            </div>
          </section>

          {/* Bundles + Watchlist + Catalysts */}
          <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <BundlesCard />
            <WatchlistCard />
            <CatalystsCard />
          </section>
        </div>
      </main>

      <FooterBar />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────── Hero pitch

function HeroPitch() {
  const features = [
    { icon: Activity,     label: "Real-time",   sub: "Live spot updates" },
    { icon: ShieldCheck,  label: "Liquid",      sub: "Tight spreads" },
    { icon: Globe,        label: "Transparent", sub: "Auditable on-chain" },
    { icon: Code,         label: "Powerful",    sub: "APIs & SDKs" },
    { icon: Briefcase,    label: "Open",        sub: "Open-weight models" },
    { icon: FlaskConical, label: "Sandboxed",   sub: "Cloud agent runtimes" },
  ] as const;
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.025em] text-fg lg:text-[48px]">
        The world&apos;s compute, priced in{" "}
        <span className="text-accent">real&nbsp;time.</span>
      </h1>
      <p className="max-w-md text-pretty text-sm text-fg-muted">
        Trade GPUs, models, and agents on one exchange. Live prices. Real liquidity. Hosted, edge, or on your own metal.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.label}
              className="flex items-start gap-2 rounded-md border border-line bg-card px-3 py-2.5"
            >
              <Icon
                className="mt-0.5 size-3.5 shrink-0 text-fg-subtle"
                strokeWidth={1.75}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="text-xs font-medium text-fg">{f.label}</div>
                <div className="text-2xs leading-tight text-fg-subtle">{f.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────── Featured market

function FeaturedMarket() {
  return (
    <TileCard flush className="flex flex-col">
      {/* Header — caps mono label + save */}
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex items-center gap-2 font-mono text-2xs font-medium uppercase tracking-[0.14em] text-accent">
          <Zap className="size-3.5" strokeWidth={2.4} fill="currentColor" />
          Featured market
        </div>
        <button
          className="grid size-7 place-items-center rounded-md text-fg-subtle hover:bg-secondary hover:text-fg"
          aria-label="Save market"
        >
          <Star className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Body — identity + actions left, price summary + chart right */}
      <div className="grid grid-cols-1 gap-6 px-5 pb-4 md:grid-cols-[minmax(220px,260px)_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <HardwareThumb kind="gpu" image={IMG.h100} alt="H100 80GB SXM" size={48} radius="md" />
            <div className="min-w-0">
              <h3 className="text-balance text-base font-semibold leading-tight tracking-tight text-fg">
                Will H100 capacity hit 0 free in JNB this week?
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-2xs text-fg-muted">
                <span className="rounded-sm bg-accent-soft px-1.5 py-0.5 font-medium text-accent">GPU</span>
                <span>Vultr · ZA-JNB</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button className="h-10 flex-1 gap-1.5 text-sm font-medium">
              <Zap className="size-4" strokeWidth={2.4} fill="currentColor" />
              Launch
            </Button>
            <Button variant="outline" className="h-10 flex-1 text-sm font-medium">
              Rent
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <div className="text-2xs font-medium uppercase tracking-[0.12em] text-fg-subtle">Spot price</div>
              <div className="mt-1 flex items-baseline gap-2">
                <Numeric weight="display" size="1.875rem">$3.42</Numeric>
                <Delta value={0.021} size="sm" />
                <span className="text-2xs text-fg-subtle">24h</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xs font-medium uppercase tracking-[0.12em] text-fg-subtle">7-day high</div>
              <div className="mt-1 text-sm font-medium tabular text-fg">$3.58 / hr</div>
            </div>
          </div>
          <ChartBlock data={FEATURED_SERIES} />
        </div>
      </div>

      {/* Footer — stats row + view market */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line-subtle bg-secondary/40 px-5 py-3">
        <Stat label="Liquidity"  value="$11.2M" />
        <Stat label="24h volume" value="$1.84M" />
        <Stat label="Providers"  value="62" />
        <Stat label="Free capacity" value="2 / 8" />
        <a
          className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          href="#"
        >
          View market <span aria-hidden>→</span>
        </a>
      </div>
    </TileCard>
  );
}

function ChartBlock({ data }: { data: readonly number[] }) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(620);
  const height = 168;
  const padX = 10;
  const padY = 10;
  const innerW = Math.max(0, width - padX * 2);
  const innerH = Math.max(0, height - padY * 2);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.floor(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const points = data.map((v, i) => [padX + i * stepX, padY + innerH - ((v - min) / range) * innerH] as const);
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1]![0].toFixed(2)},${padY + innerH} L${points[0]![0].toFixed(2)},${padY + innerH} Z`;
  const last = points[points.length - 1]!;

  return (
    <div ref={wrapRef} className="relative -mx-1">
      <svg width={width} height={height} className="block">
        <defs>
          <linearGradient id="featured-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#featured-fill)" />
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last[0]} cy={last[1]} r={4} fill="var(--accent)" stroke="var(--card)" strokeWidth={2} />
      </svg>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xs font-medium uppercase tracking-[0.1em] text-fg-subtle">{label}</span>
      <span className="text-sm font-semibold text-fg tabular">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────── Balance rail

function BalanceRail() {
  return (
    <div className="flex flex-col gap-4">
      <TileCard density="comfortable" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-fg-muted">Your balance</span>
          <button className="text-xs text-fg-subtle hover:text-fg">Hide</button>
        </div>
        <div>
          <Numeric weight="display" size="2.25rem">$12,430.58</Numeric>
          <div className="mt-1 flex items-center gap-2">
            <Delta value={0.110} size="sm" />
            <span className="text-xs text-fg-subtle">+$1,234.21 · 24h</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button className="h-9 gap-1.5 text-sm font-medium">
            <ArrowDownToLine className="size-3.5" strokeWidth={2} />
            Deposit
          </Button>
          <Button variant="outline" className="h-9 gap-1.5 text-sm font-medium">
            <ArrowUpFromLine className="size-3.5" strokeWidth={2} />
            Withdraw
          </Button>
        </div>
      </TileCard>

      <TileCard flush className="flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-sm font-medium text-fg">Active runtimes</span>
          <a className="text-xs text-accent hover:underline" href="#">View all</a>
        </div>
        <ul className="flex flex-col">
          {POSITIONS.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 border-t border-line-subtle px-5 py-3 first:border-t-0"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-fg">{p.label}</div>
                <div className="text-2xs text-fg-subtle">
                  <span className={cn(
                    "inline-flex items-center gap-1",
                    p.side === "Active" ? "text-data-up" : p.side === "Streaming" ? "text-accent" : "text-fg-subtle",
                  )}>
                    <span className={cn(
                      "size-1.5 rounded-full",
                      p.side === "Active" ? "bg-data-up dot-live" : p.side === "Streaming" ? "bg-accent" : "bg-fg-subtle",
                    )} />
                    {p.side}
                  </span>
                  <span className="text-fg-subtle/40"> · </span>
                  {p.qty}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-fg tabular">{p.value}</div>
                <Delta value={p.change} size="sm" className="justify-end" />
              </div>
            </li>
          ))}
        </ul>
      </TileCard>

      <TileCard flush className="flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-sm font-medium text-fg">Top movers</span>
          <span className="text-2xs text-fg-subtle uppercase tracking-[0.12em]">24h</span>
        </div>
        <ul className="flex flex-col">
          {TOP_MOVERS.map((m, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 border-t border-line-subtle px-5 py-2.5 first:border-t-0"
            >
              <div className="min-w-0 truncate text-sm text-fg">{m.label}</div>
              <div className="flex items-center gap-3 text-right">
                <Delta value={m.change} size="sm" />
                <span className="text-sm tabular text-fg-muted">{m.price}</span>
              </div>
            </li>
          ))}
        </ul>
      </TileCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────── Trending market card

function MarketCard(props: MarketSeed) {
  return (
    <TileCard density="comfortable" interactive className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <HardwareThumb kind={props.hwKind} image={props.image} alt={props.title} size={40} radius="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-fg">{props.title}</h3>
          </div>
          <div className="mt-0.5 truncate text-xs text-fg-muted">{props.kind}</div>
        </div>
        <button className="grid size-7 place-items-center rounded-md text-fg-subtle hover:bg-secondary hover:text-fg" aria-label="Save">
          <Star className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <Numeric weight="display" size="1.75rem">${props.price.toFixed(2)}</Numeric>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <Delta value={props.change} size="sm" />
            <span className="text-fg-subtle">{props.unit}</span>
          </div>
        </div>
        <Sparkline
          data={props.series}
          width={120}
          height={40}
          tone={props.change >= 0 ? "up" : "down"}
          emphasizeLast
          strokeWidth={1.5}
        />
      </div>

      <div className="flex items-center justify-between border-t border-line-subtle pt-3 text-xs">
        <span className="text-fg-subtle">{props.vol} vol · 24h</span>
        <span className="text-fg-muted">{props.venue}</span>
      </div>
    </TileCard>
  );
}

// ─────────────────────────────────────────────────────────────────────── Bundles / watchlist / catalysts

function BundlesCard() {
  return (
    <TileCard flush className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-sm font-medium text-fg">Market bundles</span>
        <a className="text-xs text-accent hover:underline" href="#">View all →</a>
      </div>
      <ul className="flex flex-col">
        {BUNDLES.map((b) => (
          <li
            key={b.id}
            className="flex items-center gap-3 border-t border-line-subtle px-5 py-3.5 first:border-t-0 hover:bg-secondary/40"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
              {b.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-fg">{b.title}</div>
              <div className="text-xs text-fg-subtle">{b.count} markets · {b.vol} vol</div>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs">Explore</Button>
          </li>
        ))}
      </ul>
    </TileCard>
  );
}

function WatchlistCard() {
  return (
    <TileCard flush className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-sm font-medium text-fg">Watchlist</span>
        <a className="text-xs text-accent hover:underline" href="#">View all →</a>
      </div>
      <ul className="flex flex-col">
        {WATCHLIST.map((w, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 border-t border-line-subtle px-5 py-2.5 first:border-t-0 hover:bg-secondary/40"
          >
            <div className="flex min-w-0 items-center gap-2">
              <Star className="size-3 shrink-0 fill-current text-accent" />
              <span className="truncate text-sm text-fg">{w.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm tabular text-fg-muted">{w.price}</span>
              <Delta value={w.change} size="sm" />
            </div>
          </li>
        ))}
      </ul>
    </TileCard>
  );
}

function CatalystsCard() {
  return (
    <TileCard flush className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-sm font-medium text-fg">Upcoming catalysts</span>
        <a className="text-xs text-accent hover:underline" href="#">View calendar →</a>
      </div>
      <ul className="flex flex-col">
        {CATALYSTS.map((c, i) => (
          <li
            key={i}
            className="flex items-center gap-3 border-t border-line-subtle px-5 py-3 first:border-t-0"
          >
            <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-md border border-line bg-secondary text-2xs font-mono uppercase tracking-[0.06em] text-fg-muted">
              <span className="leading-none">{c.date.split(" ")[0]}</span>
              <span className="leading-none mt-0.5 text-fg">{c.date.split(" ")[1]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-fg">{c.title}</div>
              <div className="text-2xs text-fg-subtle">All day · global</div>
            </div>
            <span className={cn(
              "rounded-sm border px-1.5 py-0.5 text-2xs font-medium",
              c.tag === "Major" ? "border-data-down/30 bg-data-down/8 text-data-down" :
              c.tag === "Medium" ? "border-data-warn/40 bg-data-warn/10 text-data-warn" :
              "border-line bg-secondary text-fg-muted",
            )}>
              {c.tag}
            </span>
          </li>
        ))}
      </ul>
    </TileCard>
  );
}

// ─────────────────────────────────────────────────────────────────────── Footer

function FooterBar() {
  const stats = [
    { label: "24h volume",     value: "$2.45B" },
    { label: "Open interest",  value: "$1.12B" },
    { label: "Active traders", value: "312K" },
    { label: "Markets",        value: "8,742" },
  ];
  return (
    <footer className="border-t border-line bg-background">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-x-8 gap-y-2 px-6 py-4 text-xs lg:px-10">
        <button className="inline-flex items-center gap-1 font-medium text-fg">
          All markets <ChevronDown className="size-3" strokeWidth={2} />
        </button>
        {stats.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 text-fg-subtle">
            {s.label} <span className="text-fg tabular">{s.value}</span>
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1.5 text-fg-subtle">
          System status
          <span className="size-1.5 rounded-full bg-data-up dot-live" />
          <span className="text-data-up">All systems operational</span>
        </span>
      </div>
    </footer>
  );
}
