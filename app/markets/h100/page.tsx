"use client";

import * as React from "react";
import {
  ChevronRight, Bell, Share2, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TopNav } from "@/components/iui/top-nav";
import { TileCard } from "@/components/iui/tile-card";
import { HardwareThumb } from "@/components/iui/hardware-thumb";
import { Numeric } from "@/components/iui/numeric";
import { Delta } from "@/components/iui/delta";
import { Sparkline } from "@/components/iui/sparkline";
import { StatusPill } from "@/components/iui/status-pill";
import { LaunchPanel } from "@/components/iui/launch-panel";
import { DeployPanel } from "@/components/iui/deploy-panel";
import { PriceChart, type Timeframe } from "@/components/iui/price-chart";
import { ProvidersTable, type ProviderRow } from "@/components/iui/providers-table";
import { BenchmarkBar } from "@/components/iui/benchmark-bar";
import { MetricCard } from "@/components/iui/metric-card";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────

const series24h = [
  3.14, 3.18, 3.21, 3.19, 3.22, 3.27, 3.30, 3.34, 3.31, 3.28,
  3.30, 3.36, 3.41, 3.39, 3.34, 3.38, 3.43, 3.40, 3.37, 3.39,
  3.42, 3.46, 3.45, 3.42,
];
const series7d = [3.06, 3.11, 3.15, 3.21, 3.28, 3.36, 3.42];
const series30d = Array.from({ length: 30 }, (_, i) => 2.9 + Math.sin(i / 3) * 0.18 + i * 0.018);
const heroSpark = series24h.slice(-12);

const PROVIDER_ROWS: ProviderRow[] = [
  { id: "vultr-jnb",   name: "Vultr",       region: "ZA-JNB", flag: "🇿🇦", status: "available", price: 3.42, change: 0.021,  latencyMs: 18,  capacity: { used: 6, total: 16 } },
  { id: "vultr-cpt",   name: "Vultr",       region: "ZA-CPT", flag: "🇿🇦", status: "available", price: 3.58, change: 0.014,  latencyMs: 42,  capacity: { used: 1, total: 6 } },
  { id: "edgelab-fra", name: "EdgeLab",     region: "EU-FRA", flag: "🇩🇪", status: "live",      price: 3.71, change: -0.008, latencyMs: 186, capacity: { used: 0, total: 4 } },
  { id: "compute-iad", name: "CapeCompute", region: "US-IAD", flag: "🇺🇸", status: "low",       price: 3.84, change: 0.032,  latencyMs: 142, capacity: { used: 7, total: 8 } },
];

const BENCHMARKS = [
  { label: "LLM inference",    value: 2843, unit: "tok/s", max: 3500, delta: "+15" },
  { label: "Stable Diffusion", value: 18.7, unit: "it/s",  max: 25,   delta: "+0.8", format: (n: number) => n.toFixed(1) },
  { label: "FP16 TFLOPS",      value: 989,  unit: "TF",    max: 1200, delta: "—" },
  { label: "FP8 TFLOPS",       value: 1979, unit: "TF",    max: 2400, delta: "+12" },
];

const SERIES_BY_TF: Record<Timeframe, readonly number[]> = {
  "1h":  series24h.slice(-12),
  "6h":  series24h.slice(-12),
  "24h": series24h,
  "7d":  series7d,
  "30d": series30d,
  "90d": series30d,
};

const DEPLOY_SNIPPETS = [
  { id: "vllm",   label: "vLLM",   language: "shell", code: `vllm serve meta-llama/Meta-Llama-3-70B-Instruct \\\n  --tensor-parallel-size 1 \\\n  --max-model-len 8192 \\\n  --gpu-memory-utilization 0.9 \\\n  --host 0.0.0.0 --port 8000` },
  { id: "sglang", label: "SGLang", language: "shell", code: `python -m sglang.launch_server \\\n  --model-path meta-llama/Meta-Llama-3-70B-Instruct \\\n  --tp 1 --port 8000` },
  { id: "docker", label: "Docker", language: "shell", code: `docker run --gpus=all -p 8000:8000 \\\n  -e HF_TOKEN=$HF_TOKEN \\\n  vllm/vllm-openai:latest \\\n  --model meta-llama/Meta-Llama-3-70B-Instruct` },
];

const SPECS = [
  ["Architecture",      "Hopper"],
  ["Memory",            "80 GB HBM3e"],
  ["Memory bandwidth",  "3.35 TB/s"],
  ["Interconnect",      "NVLink 4 · 900 GB/s"],
  ["CUDA cores",        "16,896"],
  ["Tensor cores",      "528"],
  ["Max power",         "700 W"],
  ["Process node",      "TSMC 4N"],
];

const ORDER_HISTORY = [
  { id: "ord_8f3a2c", type: "Launch", region: "ZA-JNB", duration: "1h",  qty: "1", price: "$3.42",  status: "Completed", created: "2m ago" },
  { id: "ord_7b9e1d", type: "Launch", region: "ZA-JNB", duration: "2h",  qty: "2", price: "$6.80",  status: "Completed", created: "1h ago" },
  { id: "ord_5c2d9a", type: "Rent",   region: "ZA-JNB", duration: "24h", qty: "1", price: "$72.00", status: "Active",    created: "3h ago" },
  { id: "ord_1a8d7f", type: "Launch", region: "ZA-CPT", duration: "1h",  qty: "1", price: "$3.58",  status: "Completed", created: "1d ago" },
  { id: "ord_0f6b3e", type: "Launch", region: "ZA-JNB", duration: "30m", qty: "1", price: "$1.71",  status: "Completed", created: "1d ago" },
];

// ──────────────────────────────────────────────────────────────────────────

export default function H100DetailPage() {
  const [tab, setTab] = React.useState("markets");
  const [tf, setTf] = React.useState<Timeframe>("24h");
  const [overviewTab, setOverviewTab] = React.useState("overview");

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <TopNav active={tab} onChange={setTab} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-6 lg:px-10 lg:py-8">
          <Breadcrumb path={["Markets", "GPUs", "H100 80GB SXM"]} />

          {/* Title row — matches the Polymarket detail mockup */}
          <header className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_auto]">
            <div className="flex items-start gap-4">
              <HardwareThumb
                kind="gpu"
                image="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=240&h=240&fit=crop&q=80"
                alt="H100 80GB SXM"
                size={56}
                radius="lg"
              />
              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-[-0.02em] text-fg lg:text-[2.25rem] lg:leading-[1.15]">
                  H100 80GB SXM
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
                  <StatusPill tone="up">Available</StatusPill>
                  <span className="rounded-sm bg-accent-soft px-1.5 py-0.5 text-accent">GPU · Hopper</span>
                  <span>Hosted by <span className="text-fg">Vultr</span></span>
                  <span className="text-fg-subtle/40">·</span>
                  <span>Johannesburg, ZA</span>
                  <span className="text-fg-subtle/40">·</span>
                  <span>updated 12s ago</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:justify-self-end">
              <Button size="sm" variant="outline" className="h-9 gap-1.5">
                <Share2 className="size-3.5" strokeWidth={1.75} /> Share
              </Button>
              <Button size="sm" variant="outline" className="h-9 gap-1.5">
                <Star className="size-3.5" strokeWidth={1.75} /> Watch
              </Button>
              <Button size="sm" variant="outline" className="h-9 gap-1.5">
                <Bell className="size-3.5" strokeWidth={1.75} /> Add alert
              </Button>
            </div>

            {/* Spot price summary card — replaces Polymarket "Yes probability" */}
            <TileCard density="compact" className="flex w-full min-w-[280px] items-center gap-4 lg:w-auto">
              <div className="flex flex-col">
                <span className="text-2xs uppercase tracking-[0.12em] text-fg-subtle">Spot price</span>
                <Numeric weight="display" size="1.75rem">$3.42</Numeric>
                <div className="mt-0.5 flex items-center gap-2 text-2xs text-fg-subtle">
                  <Delta value={0.021} size="sm" />
                  <span>24h</span>
                </div>
              </div>
              <Sparkline data={heroSpark} width={140} height={48} tone="accent" emphasizeLast strokeWidth={1.5} />
            </TileCard>
          </header>

          {/* Two-col body */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            {/* LEFT — chart, tabs, content */}
            <div className="flex flex-col gap-6">
              <TileCard density="comfortable" className="flex flex-col gap-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-fg">Price history</h2>
                    <p className="text-xs text-fg-muted">USD per GPU-hour · {tf.toUpperCase()}</p>
                  </div>
                </div>
                <PriceChart
                  data={SERIES_BY_TF[tf]}
                  timeframe={tf}
                  onTimeframeChange={setTf}
                  unitLabel="USD / hr"
                  height={260}
                />
              </TileCard>

              {/* Stat row */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <MetricCard density="compact" label="Low · 24h"     value="$3.21" />
                <MetricCard density="compact" label="High · 24h"    value="$3.58" />
                <MetricCard density="compact" label="Avg · 24h"     value="$3.38" />
                <MetricCard density="compact" label="Volume · 24h"  value="1,248" unit="GPU-hr" />
              </div>

              {/* Tabs section */}
              <Tabs value={overviewTab} onValueChange={setOverviewTab}>
                <TabsList className="gap-1 bg-transparent p-0">
                  {[
                    { id: "overview",   label: "Overview" },
                    { id: "providers",  label: "Providers" },
                    { id: "benchmarks", label: "Benchmarks" },
                    { id: "deploy",     label: "Deploy" },
                    { id: "history",    label: "Order history" },
                  ].map((t) => (
                    <TabsTrigger
                      key={t.id}
                      value={t.id}
                      className={cn(
                        "h-8 rounded-md px-3 text-sm font-medium",
                        "data-[state=active]:bg-accent-soft data-[state=active]:text-accent",
                        "data-[state=inactive]:text-fg-muted hover:text-fg",
                      )}
                    >
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <TileCard density="comfortable" className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_3fr]">
                    <div>
                      <h3 className="text-sm font-semibold text-fg">Instrument</h3>
                      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                        NVIDIA H100 80GB SXM5 with NVLink. Optimised for large-language-model inference and high-throughput training. Fourth-generation tensor cores, FP8 support, 900 GB/s NVLink interconnect.
                      </p>
                    </div>
                    <dl className="grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2.5 text-sm">
                      {SPECS.map(([k, v]) => (
                        <React.Fragment key={k}>
                          <dt className="text-fg-subtle">{k}</dt>
                          <dd className="text-right tabular text-fg">{v}</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </TileCard>
                </TabsContent>

                <TabsContent value="providers" className="mt-4">
                  <TileCard flush>
                    <ProvidersTable providers={PROVIDER_ROWS} onLaunch={() => {}} className="border-0 shadow-none" />
                  </TileCard>
                </TabsContent>

                <TabsContent value="benchmarks" className="mt-4">
                  <TileCard density="comfortable" className="flex flex-col gap-3">
                    <div className="flex items-end justify-between">
                      <h3 className="text-sm font-semibold text-fg">Reference benchmarks</h3>
                      <span className="text-2xs uppercase tracking-[0.1em] text-fg-subtle">higher is better</span>
                    </div>
                    {BENCHMARKS.map((b) => <BenchmarkBar key={b.label} {...b} />)}
                  </TileCard>
                </TabsContent>

                <TabsContent value="deploy" className="mt-4">
                  <DeployPanel snippets={DEPLOY_SNIPPETS} />
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <TileCard flush>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-line-subtle text-fg-subtle">
                          <Th>Order</Th>
                          <Th>Type</Th>
                          <Th>Region</Th>
                          <Th align="right">Duration</Th>
                          <Th align="right">Qty</Th>
                          <Th align="right">Price</Th>
                          <Th>Status</Th>
                          <Th align="right">Created</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {ORDER_HISTORY.map((o) => (
                          <tr key={o.id} className="border-b border-line-subtle last:border-b-0 hover:bg-secondary/40">
                            <Td><span className="font-mono text-fg">{o.id}</span></Td>
                            <Td>{o.type}</Td>
                            <Td><span className="font-mono">{o.region}</span></Td>
                            <Td align="right">{o.duration}</Td>
                            <Td align="right">{o.qty}</Td>
                            <Td align="right">{o.price}</Td>
                            <Td>
                              <span className={cn(
                                o.status === "Completed" ? "text-data-up" :
                                o.status === "Active"    ? "text-accent" :
                                "text-fg-muted",
                              )}>
                                {o.status}
                              </span>
                            </Td>
                            <Td align="right">{o.created}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TileCard>
                </TabsContent>
              </Tabs>
            </div>

            {/* RIGHT — sticky launch rail */}
            <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
              <LaunchPanel unitPrice={3.42} unit="/ hr" available={6} />
            </aside>
          </div>
        </div>
      </main>

      <FooterBar />
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function Breadcrumb({ path }: { path: string[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-fg-muted">
      {path.map((p, i) => (
        <React.Fragment key={i}>
          <span className={i === path.length - 1 ? "text-fg" : "hover:text-fg cursor-pointer"}>{p}</span>
          {i < path.length - 1 ? (
            <ChevronRight className="size-3.5 text-fg-subtle/60" strokeWidth={2} />
          ) : null}
        </React.Fragment>
      ))}
    </nav>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={cn("px-4 py-3 text-2xs font-medium uppercase tracking-[0.08em]", align === "right" ? "text-right" : "text-left")}>
      {children}
    </th>
  );
}

function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <td className={cn("px-4 py-3 text-fg-muted tabular", align === "right" ? "text-right" : "text-left")}>
      {children}
    </td>
  );
}

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
        <span className="font-medium text-fg">All markets</span>
        {stats.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-fg-subtle">
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

// Drop the `Separator` import warning — avoid removing if other parts of file use it.
void Separator;
