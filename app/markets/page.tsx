"use client";

import * as React from "react";
import {
  Activity, Boxes, Box, Cpu, HardDrive, KeyRound, LayoutDashboard,
  Package, Receipt, Server, Settings, Sparkles,
} from "lucide-react";
import { CoordStrip } from "@/components/iui/coord-strip";
import { DiscoveryRow } from "@/components/iui/discovery-row";
import { MetricCard } from "@/components/iui/metric-card";
import { ProfileChip } from "@/components/iui/profile-chip";
import { SidebarNav } from "@/components/iui/sidebar-nav";
import { ThemeSwitch } from "@/components/iui/theme-switch";
import { TickerTape } from "@/components/iui/ticker-tape";
import { Toolbar } from "@/components/iui/toolbar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TICKER_ITEMS = [
  { symbol: "H100·JNB",  price: 3.42,  change:  0.021, unit: "/ hr",     live: true },
  { symbol: "A100·JNB",  price: 2.45,  change:  0.012, unit: "/ hr",     live: true },
  { symbol: "L40S·FRA",  price: 1.84,  change: -0.014, unit: "/ hr" },
  { symbol: "M2-Pro·STB", price: 0.45, change: -0.031, unit: "/ hr" },
  { symbol: "Orin·CPT",  price: 0.18,  change: -0.067, unit: "/ hr" },
  { symbol: "Opus·1M",   price: 15.0,  change:  0.012, unit: "/ 1M tok", live: true },
  { symbol: "GPT5·200K", price: 10.0,  change: -0.008, unit: "/ 1M tok" },
  { symbol: "Llama4·128K", price: 0.42, change: -0.028, unit: "/ 1M tok", live: true },
  { symbol: "Qwen-VL·32K", price: 0.09, change:  0.04,  unit: "/ 1M tok", live: true },
  { symbol: "Sonnet·200K", price: 3.0,  change:  0.003, unit: "/ 1M tok", live: true },
];

const ZA = "🇿🇦";

const HARDWARE_ROWS = [
  {
    id: "h100-jnb",
    name: "H100 80GB SXM",
    kind: "GPU · Hopper",
    hostedBy: "Vultr · Johannesburg, ZA",
    status: "available" as const,
    price: 3.42,
    change: 0.021,
    metrics: [
      { label: "P50", value: "18 ms", tone: "up" as const },
      { label: "Uptime", value: "99.91%", tone: "up" as const },
    ],
    series: [3.14, 3.18, 3.21, 3.22, 3.27, 3.30, 3.34, 3.31, 3.36, 3.42],
  },
  {
    id: "a100-jnb",
    name: "A100 80GB PCIe",
    kind: "GPU · Ampere",
    hostedBy: "Vultr · Johannesburg, ZA",
    status: "available" as const,
    price: 2.45,
    change: 0.016,
    metrics: [
      { label: "P50", value: "15 ms", tone: "up" as const },
      { label: "Uptime", value: "99.89%", tone: "up" as const },
    ],
    series: [2.40, 2.41, 2.43, 2.44, 2.45, 2.46, 2.45, 2.45],
  },
  {
    id: "l40s-fra",
    name: "L40S 48GB",
    kind: "GPU · Ada Lovelace",
    hostedBy: "EdgeLab · Frankfurt, DE",
    status: "live" as const,
    price: 1.84,
    change: -0.014,
    metrics: [
      { label: "P50", value: "24 ms", tone: "up" as const },
      { label: "Uptime", value: "99.62%", tone: "warn" as const },
    ],
    series: [1.92, 1.90, 1.88, 1.86, 1.84, 1.82, 1.84, 1.84],
  },
  {
    id: "m2-stb",
    name: "Mac mini M2 Pro",
    kind: "Edge · Apple Silicon",
    hostedBy: "EdgeLab · Stellenbosch, ZA",
    status: "low" as const,
    price: 0.45,
    change: -0.031,
    metrics: [
      { label: "P50", value: "28 ms", tone: "up" as const },
      { label: "Uptime", value: "99.60%", tone: "warn" as const },
    ],
    series: [0.50, 0.49, 0.48, 0.47, 0.46, 0.46, 0.45, 0.45],
  },
  {
    id: "orin-cpt",
    name: "Jetson Orin Nano",
    kind: "Edge · ARM",
    hostedBy: "CapeCompute · Cape Town, ZA",
    status: "low" as const,
    price: 0.18,
    change: -0.067,
    metrics: [
      { label: "P50", value: "42 ms", tone: "warn" as const },
      { label: "Uptime", value: "98.11%", tone: "warn" as const },
    ],
    series: [0.21, 0.20, 0.19, 0.19, 0.18, 0.18, 0.18, 0.18],
  },
];

const MODEL_ROWS = [
  {
    id: "claude-opus-4-7",
    name: "Claude Opus 4.7",
    kind: "Model · 1M ctx",
    hostedBy: "Anthropic · global",
    status: "live" as const,
    price: 15.0,
    change: 0.012,
    metrics: [
      { label: "Throughput", value: "2,843 tok/s" },
      { label: "Quality", value: "98.4 MMLU", tone: "up" as const },
    ],
    series: [14.7, 14.8, 14.9, 15.0, 15.1, 15.0, 15.0, 15.0],
  },
  {
    id: "gpt-5",
    name: "GPT-5",
    kind: "Model · 200K ctx",
    hostedBy: "OpenAI · global",
    status: "live" as const,
    price: 10.0,
    change: -0.008,
    metrics: [
      { label: "Throughput", value: "3,120 tok/s" },
      { label: "Quality", value: "97.6 MMLU", tone: "up" as const },
    ],
    series: [10.1, 10.05, 10.0, 9.95, 10.0, 10.0, 10.0],
  },
  {
    id: "llama-4-instruct",
    name: "Llama 4 Instruct",
    kind: "Model · 128K · open",
    hostedBy: "Meta · open weight",
    status: "live" as const,
    price: 0.42,
    change: -0.028,
    metrics: [
      { label: "Throughput", value: "4,210 tok/s", tone: "up" as const },
      { label: "Quality", value: "92.1 MMLU" },
    ],
    series: [0.45, 0.44, 0.43, 0.42, 0.42, 0.42, 0.42],
  },
];

const AGENT_ROWS = [
  {
    id: "ix-router",
    name: "IX Router",
    kind: "Agent · routing",
    hostedBy: "Inference Exchange · v0.4",
    status: "live" as const,
    price: 0.0,
    change: undefined,
    metrics: [
      { label: "Calls · 24h", value: "12.4k" },
      { label: "Avg latency", value: "240 ms", tone: "up" as const },
    ],
  },
  {
    id: "researcher",
    name: "Deep Researcher",
    kind: "Agent · research",
    hostedBy: "Compounder · v1.2",
    status: "available" as const,
    price: 0.50,
    metrics: [
      { label: "Tools", value: "12" },
      { label: "Sandbox", value: "Cloud · 4GB" },
    ],
  },
];

const TABS = [
  { id: "all",       label: "All",      count: HARDWARE_ROWS.length + MODEL_ROWS.length + AGENT_ROWS.length },
  { id: "hardware",  label: "Hardware", count: HARDWARE_ROWS.length },
  { id: "models",    label: "Models",   count: MODEL_ROWS.length },
  { id: "agents",    label: "Agents",   count: AGENT_ROWS.length },
];

type TabKey = (typeof TABS)[number]["id"];

type DiscoveryRowData = (typeof HARDWARE_ROWS)[number] & { series?: readonly number[] };

const ALL_ROWS: DiscoveryRowData[] = [
  ...HARDWARE_ROWS,
  ...(MODEL_ROWS as unknown as DiscoveryRowData[]),
  ...(AGENT_ROWS as unknown as DiscoveryRowData[]),
];

const ROWS_BY_TAB: Record<TabKey, DiscoveryRowData[]> = {
  all:      ALL_ROWS,
  hardware: HARDWARE_ROWS,
  models:   MODEL_ROWS as unknown as DiscoveryRowData[],
  agents:   AGENT_ROWS as unknown as DiscoveryRowData[],
};

const ICON_BY_KIND = (kind?: string) => {
  if (!kind) return null;
  if (kind.startsWith("GPU"))    return <Cpu className="size-4 text-fg-muted" strokeWidth={1.75} />;
  if (kind.startsWith("Edge"))   return <HardDrive className="size-4 text-fg-muted" strokeWidth={1.75} />;
  if (kind.startsWith("Model"))  return <Package className="size-4 text-fg-muted" strokeWidth={1.75} />;
  if (kind.startsWith("Agent"))  return <Sparkles className="size-4 text-fg-muted" strokeWidth={1.75} />;
  if (kind.startsWith("Sandbox")) return <Box className="size-4 text-fg-muted" strokeWidth={1.75} />;
  return null;
};

export default function MarketsPage() {
  const [tab, setTab] = React.useState<TabKey>("all");
  const rows = ROWS_BY_TAB[tab];

  return (
    <div className="flex min-h-dvh flex-col bg-background text-fg">
      <CoordStrip system="INFERENCE.EX" region="GLOBAL" state="All systems operational" tone="up" fixedTime="14:32:18 UTC" />

      <div className="flex flex-1">
        <SidebarNav.Root width={232} className="hidden md:flex">
          <SidebarNav.Header>
            <ProfileChip name="Nightcat Labs" meta="Workspace" size="sm" />
          </SidebarNav.Header>
          <SidebarNav.Section label="Trade">
            <SidebarNav.Item icon={<LayoutDashboard className="size-4" strokeWidth={1.75} />} label="Overview" />
            <SidebarNav.Item icon={<Activity className="size-4" strokeWidth={1.75} />} label="Markets" active />
            <SidebarNav.Item icon={<Boxes className="size-4" strokeWidth={1.75} />} label="Deployments" />
            <SidebarNav.Item icon={<Cpu className="size-4" strokeWidth={1.75} />} label="Runtimes" />
            <SidebarNav.Item icon={<Package className="size-4" strokeWidth={1.75} />} label="Models" />
            <SidebarNav.Item icon={<HardDrive className="size-4" strokeWidth={1.75} />} label="Hardware" />
          </SidebarNav.Section>
          <SidebarNav.Section label="Account">
            <SidebarNav.Item icon={<Receipt className="size-4" strokeWidth={1.75} />} label="Usage & billing" />
            <SidebarNav.Item icon={<KeyRound className="size-4" strokeWidth={1.75} />} label="API keys" />
            <SidebarNav.Item icon={<Server className="size-4" strokeWidth={1.75} />} label="Logs & events" />
            <SidebarNav.Item icon={<Settings className="size-4" strokeWidth={1.75} />} label="Settings" />
          </SidebarNav.Section>
          <SidebarNav.Footer>
            <ProfileChip name="Marc Knowles" meta="marc@compounder.dev" size="sm" />
          </SidebarNav.Footer>
        </SidebarNav.Root>

        <div className="flex min-w-0 flex-1 flex-col">
          <Toolbar
            breadcrumb={<Breadcrumb path={["Markets"]} />}
            actions={<ThemeSwitch className="ml-1" />}
          />

          <TickerTape items={TICKER_ITEMS} speed={32} />

          <main className="flex-1 overflow-y-auto px-5 py-8 lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-[1400px]">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="display text-4xl text-fg">Markets</h1>
                  <p className="mt-2 max-w-xl text-md text-fg-muted">
                    Discover models, agents, and hardware across the network. Compare price, latency, and capacity in real time.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-px border border-line-subtle bg-line-subtle md:grid-cols-4">
                <MetricCard density="compact" label="Online providers" value="42" change={0.05} />
                <MetricCard density="compact" label="Active runtimes"  value="186" change={0.082} />
                <MetricCard density="compact" label="P50 routing"      value="18" unit="ms" change={-0.072} invertChange />
                <MetricCard density="compact" label="Volume · 24h"     value="1,248" unit="GPU-hr" change={0.124} />
              </div>

              <div className="mt-10 flex items-center justify-between">
                <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
                  <TabsList className="bg-card/40">
                    {TABS.map((t) => (
                      <TabsTrigger key={t.id} value={t.id} className="gap-1.5 text-sm">
                        {t.label}
                        <span className="font-mono text-2xs tabular text-fg-subtle">{t.count}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="mt-4 flex flex-col gap-px border border-line-subtle bg-line-subtle">
                {rows.map((r) => (
                  <DiscoveryRow
                    key={r.id}
                    name={r.name}
                    kind={r.kind}
                    hostedBy={r.hostedBy}
                    icon={ICON_BY_KIND(r.kind)}
                    status={r.status}
                    price={r.price}
                    unit={r.kind?.startsWith("Model") ? "/ 1M tok" : "/ hr"}
                    change={r.change}
                    metrics={r.metrics}
                    series={"series" in r ? (r as { series?: number[] }).series : undefined}
                    onSelect={() => {}}
                    onLaunch={() => {}}
                    onSave={() => {}}
                  />
                ))}
              </div>

              <p className="mt-6 text-center font-mono text-xs tabular text-fg-subtle">
                Showing 1 — {rows.length} of {rows.length}
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({ path }: { path: string[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-fg-subtle">
      {path.map((p, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className={i === path.length - 1 ? "text-fg" : "hover:text-fg cursor-default"}>{p}</span>
          {i < path.length - 1 ? <span className="text-fg-subtle/40">/</span> : null}
        </span>
      ))}
    </nav>
  );
}
