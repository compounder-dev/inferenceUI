"use client";

import * as React from "react";
import {
  Activity, Boxes, Cpu, Globe, HardDrive, KeyRound, LayoutDashboard,
  Package, Receipt, Server, Settings, Sparkles, Flame, TrendingUp,
  Zap, Plus, ChevronRight, GraduationCap, Briefcase, Code,
} from "lucide-react";
import { CoordStrip } from "@/components/iui/coord-strip";
import { CategoryNav } from "@/components/iui/category-nav";
import { CarouselDots } from "@/components/iui/carousel-dots";
import { FeaturedMarket } from "@/components/iui/featured-market";
import { AdonaiDownloadCard } from "@/components/iui/adonai-download-card";
import { DiscoveryRow } from "@/components/iui/discovery-row";
import { ProfileChip } from "@/components/iui/profile-chip";
import { RankedRail } from "@/components/iui/ranked-rail";
import { SidebarNav } from "@/components/iui/sidebar-nav";
import { TagPills } from "@/components/iui/tag-pills";
import { ThemeSwitch } from "@/components/iui/theme-switch";
import { TickerTape } from "@/components/iui/ticker-tape";
import { Toolbar } from "@/components/iui/toolbar";

const TICKER_ITEMS = [
  { symbol: "H100·JNB",    price: 3.42,  change:  0.021, unit: "/ hr",     live: true },
  { symbol: "A100·JNB",    price: 2.45,  change:  0.012, unit: "/ hr",     live: true },
  { symbol: "L40S·FRA",    price: 1.84,  change: -0.014, unit: "/ hr" },
  { symbol: "M2-Pro·STB",  price: 0.45,  change: -0.031, unit: "/ hr" },
  { symbol: "Orin·CPT",    price: 0.18,  change: -0.067, unit: "/ hr" },
  { symbol: "Opus·1M",     price: 15.0,  change:  0.012, unit: "/ 1M tok", live: true },
  { symbol: "GPT5·200K",   price: 10.0,  change: -0.008, unit: "/ 1M tok" },
  { symbol: "Llama4·128K", price: 0.42,  change: -0.028, unit: "/ 1M tok", live: true },
  { symbol: "Qwen-VL",     price: 0.09,  change:  0.04,  unit: "/ 1M tok", live: true },
  { symbol: "Sonnet·200K", price: 3.0,   change:  0.003, unit: "/ 1M tok", live: true },
];

const CATEGORIES = [
  { id: "trending", label: "Trending", icon: <TrendingUp className="size-3.5" strokeWidth={2} /> },
  { id: "new",      label: "New",      icon: <Sparkles className="size-3.5" strokeWidth={2} /> },
  { id: "hardware", label: "Hardware", icon: <Cpu className="size-3.5" strokeWidth={2} /> },
  { id: "models",   label: "Models",   icon: <Package className="size-3.5" strokeWidth={2} /> },
  { id: "agents",   label: "Agents",   icon: <Sparkles className="size-3.5" strokeWidth={2} /> },
  { id: "edge",     label: "Edge",     icon: <HardDrive className="size-3.5" strokeWidth={2} /> },
  { id: "open",     label: "Open weight", icon: <Code className="size-3.5" strokeWidth={2} /> },
  { id: "research", label: "Research", icon: <GraduationCap className="size-3.5" strokeWidth={2} /> },
  { id: "business", label: "Business", icon: <Briefcase className="size-3.5" strokeWidth={2} /> },
  { id: "global",   label: "Global",   icon: <Globe className="size-3.5" strokeWidth={2} /> },
];

const TAG_FILTERS = [
  { id: "all",        label: "All",         count: 243 },
  { id: "h100",       label: "H100" },
  { id: "llama-4",    label: "Llama 4" },
  { id: "claude",     label: "Claude" },
  { id: "edge",       label: "Edge" },
  { id: "open",       label: "Open weight" },
  { id: "fp8",        label: "FP8" },
  { id: "agents",     label: "Agents" },
  { id: "sandbox",    label: "Sandboxes" },
  { id: "stb",        label: "ZA-STB" },
];

const FEATURED_SERIES = [
  0.42, 0.40, 0.41, 0.40, 0.42, 0.40, 0.41, 0.40, 0.42, 0.42,
  0.41, 0.42, 0.43, 0.55, 0.85, 1.20, 0.95, 0.78, 0.72, 0.68,
  0.62, 0.58, 0.54, 0.50, 0.48, 0.46, 0.44, 0.43, 0.42, 0.42,
  0.42, 0.41, 0.41, 0.41,
];

const FEATURED_EVENTS = [
  { at: 4,  label: "+ 0.02", tone: "up"   as const },
  { at: 12, label: "+ 0.05", tone: "up"   as const },
  { at: 14, label: "spike",  tone: "up"   as const },
  { at: 22, label: "− 0.10", tone: "down" as const },
];

const FEATURED_NEWS = [
  { source: "Vultr",     logo: "V", title: "H100 80GB SXM capacity expanded in ZA-JNB · 8 new instances live", timeAgo: "2m ago" },
  { source: "Anthropic", logo: "A", title: "Claude Sonnet 4.6 added to global routing pool", timeAgo: "1h ago" },
  { source: "EdgeLab",   logo: "E", title: "Mac mini M2 Pro cluster relisted at -8% in ZA-STB", timeAgo: "3h ago" },
];

const HOT_MODELS = [
  { id: "opus-4-7",      label: "Claude Opus 4.7",  meta: "Anthropic · 1M ctx",     value: "$141K", change: 0.084, hot: true,  thumbnail: <span className="font-mono text-2xs">OP</span> },
  { id: "gpt-5",         label: "GPT-5",            meta: "OpenAI · 200K ctx",      value: "$272M", change: 0.024, hot: true,  thumbnail: <span className="font-mono text-2xs">G5</span> },
  { id: "llama-4",       label: "Llama 4 Instruct", meta: "Meta · 128K · open",     value: "$270K", change: -0.012,             thumbnail: <span className="font-mono text-2xs">L4</span> },
  { id: "sonnet-4-6",    label: "Claude Sonnet 4.6", meta: "Anthropic · 200K",      value: "$114K", change: 0.012,              thumbnail: <span className="font-mono text-2xs">S4</span> },
  { id: "qwen-vl",       label: "Qwen VL 7B",       meta: "Alibaba · 32K · open",   value: "$117K", change: 0.040, hot: true,   thumbnail: <span className="font-mono text-2xs">QW</span> },
];

const TRENDING_COMPUTE = [
  { id: "h100-jnb",      label: "H100 80GB SXM",     meta: "Vultr · ZA-JNB",        value: "$3.42",  change: 0.021, hot: true,  thumbnail: <Cpu className="size-3.5" strokeWidth={2} /> },
  { id: "a100-jnb",      label: "A100 80GB PCIe",    meta: "Vultr · ZA-JNB",        value: "$2.45",  change: 0.012,              thumbnail: <Cpu className="size-3.5" strokeWidth={2} /> },
  { id: "l40s-fra",      label: "L40S 48GB",         meta: "EdgeLab · EU-FRA",      value: "$1.84",  change: -0.014,             thumbnail: <Cpu className="size-3.5" strokeWidth={2} /> },
  { id: "m2-stb",        label: "Mac mini M2 Pro",   meta: "EdgeLab · ZA-STB",      value: "$0.45",  change: -0.031,             thumbnail: <HardDrive className="size-3.5" strokeWidth={2} /> },
  { id: "orin-cpt",      label: "Jetson Orin Nano",  meta: "CapeCompute · ZA-CPT",  value: "$0.18",  change: -0.067, hot: true,  thumbnail: <HardDrive className="size-3.5" strokeWidth={2} /> },
];

const HARDWARE_ROWS = [
  { id: "h100-jnb",  name: "H100 80GB SXM",   kind: "GPU · Hopper",         hostedBy: "Vultr · ZA-JNB",        status: "available" as const, price: 3.42, change:  0.021, metrics: [{ label: "P50", value: "18 ms", tone: "up" as const }, { label: "Uptime", value: "99.91%", tone: "up" as const }], series: [3.14, 3.18, 3.21, 3.27, 3.30, 3.34, 3.36, 3.42] },
  { id: "a100-jnb",  name: "A100 80GB PCIe",  kind: "GPU · Ampere",         hostedBy: "Vultr · ZA-JNB",        status: "available" as const, price: 2.45, change:  0.016, metrics: [{ label: "P50", value: "15 ms", tone: "up" as const }, { label: "Uptime", value: "99.89%", tone: "up" as const }], series: [2.40, 2.41, 2.43, 2.44, 2.45, 2.46, 2.45] },
  { id: "l40s-fra",  name: "L40S 48GB",       kind: "GPU · Ada Lovelace",   hostedBy: "EdgeLab · EU-FRA",      status: "live" as const,      price: 1.84, change: -0.014, metrics: [{ label: "P50", value: "24 ms", tone: "up" as const }, { label: "Uptime", value: "99.62%", tone: "warn" as const }], series: [1.92, 1.90, 1.88, 1.86, 1.84, 1.82, 1.84] },
  { id: "m2-stb",    name: "Mac mini M2 Pro", kind: "Edge · Apple Silicon", hostedBy: "EdgeLab · ZA-STB",      status: "low" as const,       price: 0.45, change: -0.031, metrics: [{ label: "P50", value: "28 ms", tone: "up" as const }, { label: "Uptime", value: "99.60%", tone: "warn" as const }], series: [0.50, 0.49, 0.48, 0.47, 0.46, 0.45, 0.45] },
  { id: "rpi-5",     name: "Raspberry Pi 5",  kind: "Edge · ARM",           hostedBy: "Self-host kit",         status: "available" as const, price: 0.04, change:  0.0,   metrics: [{ label: "Cores", value: "4 × A76" }, { label: "RAM", value: "8 GB" }], series: [0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04] },
];

const MODEL_ROWS = [
  { id: "opus-4-7",   name: "Claude Opus 4.7",  kind: "Model · 1M ctx",   hostedBy: "Anthropic",  status: "live" as const, price: 15.0, change:  0.012, metrics: [{ label: "Throughput", value: "2,843 tok/s" }, { label: "MMLU", value: "98.4", tone: "up" as const }], series: [14.7, 14.8, 14.9, 15.0, 15.1, 15.0, 15.0] },
  { id: "gpt-5",      name: "GPT-5",            kind: "Model · 200K ctx", hostedBy: "OpenAI",     status: "live" as const, price: 10.0, change: -0.008, metrics: [{ label: "Throughput", value: "3,120 tok/s" }, { label: "MMLU", value: "97.6", tone: "up" as const }], series: [10.1, 10.05, 10.0, 9.95, 10.0, 10.0] },
  { id: "llama-4",    name: "Llama 4 Instruct", kind: "Model · 128K · open", hostedBy: "Meta", status: "live" as const, price: 0.42, change: -0.028, metrics: [{ label: "Throughput", value: "4,210 tok/s", tone: "up" as const }, { label: "MMLU", value: "92.1" }], series: [0.45, 0.44, 0.43, 0.42, 0.42, 0.42] },
];

const AGENT_ROWS = [
  { id: "openclaw", name: "openclaw",        kind: "Agent · routing",    hostedBy: "Inference Exchange",  status: "live" as const,      price: 0.0, change: undefined, metrics: [{ label: "Calls · 24h", value: "12.4k" }, { label: "Latency", value: "240 ms", tone: "up" as const }] },
  { id: "hermes",   name: "Hermes Agent",    kind: "Agent · cloud sandbox", hostedBy: "NousResearch · pilot", status: "available" as const, price: 0.50, change: undefined, metrics: [{ label: "Tools", value: "12" }, { label: "Sandbox", value: "Cloud · 4GB" }] },
];

const ICON_FOR = (kind?: string) => {
  if (!kind) return null;
  if (kind.startsWith("GPU"))   return <Cpu className="size-4 text-fg-muted" strokeWidth={1.75} />;
  if (kind.startsWith("Edge"))  return <HardDrive className="size-4 text-fg-muted" strokeWidth={1.75} />;
  if (kind.startsWith("Model")) return <Package className="size-4 text-fg-muted" strokeWidth={1.75} />;
  if (kind.startsWith("Agent")) return <Sparkles className="size-4 text-fg-muted" strokeWidth={1.75} />;
  return null;
};

export default function Home() {
  const [category, setCategory] = React.useState("trending");
  const [tag, setTag] = React.useState("all");
  const [slide, setSlide] = React.useState(0);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-fg">
      <CoordStrip system="INFERENCE.EX" region="GLOBAL" state="All systems operational" tone="up" fixedTime="14:32:18 UTC" />

      <div className="flex flex-1">
        <SidebarNav.Root width={232} className="hidden lg:flex">
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
            <SidebarNav.Item icon={<Sparkles className="size-4" strokeWidth={1.75} />} label="Agents" />
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
            breadcrumb={<span className="text-sm text-fg-subtle">Markets</span>}
            actions={<ThemeSwitch className="ml-1" />}
          />

          <CategoryNav items={CATEGORIES} value={category} onChange={setCategory} />
          <TickerTape items={TICKER_ITEMS} speed={32} />

          <main className="flex-1 overflow-y-auto px-5 py-6 lg:px-10 lg:py-8">
            <div className="mx-auto w-full max-w-[1400px]">
              {/* Featured market + ranked rails */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
                <div className="flex flex-col gap-3">
                  <FeaturedMarket
                    thumbnail={<Cpu className="size-6 text-accent" strokeWidth={1.75} />}
                    title="Llama 4 Instruct · 128K is the most-routed open model this week"
                    primaryValue="$0.42"
                    primaryLabel="spot · / 1M tok"
                    change={-0.028}
                    data={FEATURED_SERIES}
                    events={FEATURED_EVENTS}
                    primaryAction={{ label: "Launch runtime", tone: "accent", onClick: () => {} }}
                    secondaryAction={{ label: "Add to watchlist", tone: "neutral", onClick: () => {} }}
                    onShare={() => {}}
                    onSave={() => {}}
                    footer={
                      <div className="flex w-full items-center justify-between font-mono tabular text-2xs">
                        <span>$11.2M · 24h vol</span>
                        <span>62 providers · global</span>
                      </div>
                    }
                    context={FEATURED_NEWS}
                  />
                  <div className="flex items-center justify-between">
                    <CarouselDots count={5} active={slide} onSelect={setSlide} />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="inline-flex h-7 items-center gap-1 rounded-md border border-line bg-card/40 px-2.5 text-xs text-fg-muted hover:text-fg"
                      >
                        H100 80GB SXM
                        <ChevronRight className="size-3" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-7 items-center gap-1 rounded-md border border-line bg-card/40 px-2.5 text-xs text-fg-muted hover:text-fg"
                      >
                        Hermes Agent
                        <ChevronRight className="size-3" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>

                <aside className="flex flex-col gap-3">
                  <RankedRail
                    title={<span className="flex items-center gap-2"><Flame className="size-4 text-accent" strokeWidth={2} fill="currentColor" /> Hot models</span>}
                    items={HOT_MODELS}
                    onSelect={() => {}}
                    viewAllHref="/markets"
                  />
                  <RankedRail
                    title={<span className="flex items-center gap-2"><TrendingUp className="size-4 text-data-up" strokeWidth={2} /> Trending compute</span>}
                    items={TRENDING_COMPUTE}
                    onSelect={() => {}}
                    viewAllHref="/markets"
                  />
                </aside>
              </div>

              {/* Adonai download container */}
              <div className="mt-10">
                <AdonaiDownloadCard />
              </div>

              {/* All markets */}
              <section className="mt-12">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="display text-3xl text-fg">All markets</h2>
                    <p className="mt-2 max-w-xl text-sm text-fg-muted">
                      Hardware to buy and rent, models priced live, and agents you can host in a runtime — all in one network.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <TagPills items={TAG_FILTERS} value={tag} onChange={setTag} />
                </div>

                <h3 className="mt-8 text-md font-medium text-fg">Hardware</h3>
                <div className="mt-3 flex flex-col gap-px border border-line-subtle bg-line-subtle">
                  {HARDWARE_ROWS.map((r) => (
                    <DiscoveryRow
                      key={r.id}
                      name={r.name}
                      kind={r.kind}
                      hostedBy={r.hostedBy}
                      icon={ICON_FOR(r.kind)}
                      status={r.status}
                      price={r.price}
                      unit="/ hr"
                      change={r.change}
                      metrics={r.metrics}
                      series={r.series}
                      onSelect={() => {}}
                      onLaunch={() => {}}
                      onSave={() => {}}
                    />
                  ))}
                </div>

                <h3 className="mt-10 text-md font-medium text-fg">Models</h3>
                <div className="mt-3 flex flex-col gap-px border border-line-subtle bg-line-subtle">
                  {MODEL_ROWS.map((r) => (
                    <DiscoveryRow
                      key={r.id}
                      name={r.name}
                      kind={r.kind}
                      hostedBy={r.hostedBy}
                      icon={ICON_FOR(r.kind)}
                      status={r.status}
                      price={r.price}
                      unit="/ 1M tok"
                      change={r.change}
                      metrics={r.metrics}
                      series={r.series}
                      onSelect={() => {}}
                      onLaunch={() => {}}
                      onSave={() => {}}
                    />
                  ))}
                </div>

                <h3 className="mt-10 text-md font-medium text-fg">Agents</h3>
                <div className="mt-3 flex flex-col gap-px border border-line-subtle bg-line-subtle">
                  {AGENT_ROWS.map((r) => (
                    <DiscoveryRow
                      key={r.id}
                      name={r.name}
                      kind={r.kind}
                      hostedBy={r.hostedBy}
                      icon={ICON_FOR(r.kind)}
                      status={r.status}
                      price={r.price}
                      unit={r.price > 0 ? "/ hr" : "free"}
                      change={r.change}
                      metrics={r.metrics}
                      onSelect={() => {}}
                      onLaunch={() => {}}
                      onSave={() => {}}
                    />
                  ))}
                </div>

                <p className="mt-6 text-center font-mono text-xs tabular text-fg-subtle">
                  Showing 1 — {HARDWARE_ROWS.length + MODEL_ROWS.length + AGENT_ROWS.length} of 243
                </p>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
