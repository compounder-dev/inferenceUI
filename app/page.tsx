"use client";

import { CoordStrip } from "@/components/iui/coord-strip";
import { InstrumentCard } from "@/components/iui/instrument-card";
import { InstrumentHero } from "@/components/iui/instrument-hero";
import { MetricCard } from "@/components/iui/metric-card";
import { ProfileChip } from "@/components/iui/profile-chip";
import { SidebarNav } from "@/components/iui/sidebar-nav";
import { ThemeSwitch } from "@/components/iui/theme-switch";
import { Toolbar } from "@/components/iui/toolbar";
import { TileCard } from "@/components/iui/tile-card";
import {
  Activity,
  Boxes,
  Cpu,
  Gauge,
  HardDrive,
  KeyRound,
  LayoutDashboard,
  Package,
  Receipt,
  Server,
  Settings,
} from "lucide-react";

const series = [
  3.14, 3.18, 3.21, 3.19, 3.22, 3.27, 3.30, 3.34, 3.31, 3.28,
  3.30, 3.36, 3.41, 3.39, 3.34, 3.38, 3.43, 3.40, 3.37, 3.39,
  3.42, 3.46, 3.45, 3.42,
];
const latencySeries = [22, 21, 20, 19, 19, 18, 18, 19, 18, 18, 17, 18];
const uptimeSeries  = [99.85, 99.86, 99.88, 99.87, 99.89, 99.91, 99.92, 99.91];
const a100Series    = [2.40, 2.41, 2.43, 2.42, 2.44, 2.45, 2.46, 2.45, 2.44, 2.45, 2.46, 2.45];
const m2Series      = [0.50, 0.49, 0.48, 0.47, 0.47, 0.46, 0.46, 0.46, 0.45, 0.45, 0.45, 0.45];
const opusSeries    = [14.8, 14.9, 15.0, 15.1, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-fg">
      <CoordStrip
        system="INFERENCE.EX"
        region="ZA-JNB"
        state="All systems operational"
        tone="up"
        fixedTime="14:32:18 UTC"
      />

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
            breadcrumb={<Breadcrumb path={["Markets", "GPUs", "H100 80GB SXM"]} />}
            actions={<ThemeSwitch className="ml-1" />}
          />

          <main className="flex-1 overflow-y-auto px-5 py-8 lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-[1400px]">
              <InstrumentHero
                name="H100 80GB SXM"
                kind="GPU · Hopper"
                hostedBy="Vultr"
                region="Johannesburg, ZA"
                status="available"
                price={3.42}
                unit="/ hr"
                secondaryUnit="$0.0095 / min"
                change={0.021}
                series={series}
              />

              <div className="grid grid-cols-2 gap-px border-x border-b border-line-subtle bg-line-subtle md:grid-cols-4">
                <MetricCard density="compact" label="Low · 24h"    value="$3.21" />
                <MetricCard density="compact" label="High · 24h"   value="$3.58" />
                <MetricCard density="compact" label="Avg · 24h"    value="$3.38" />
                <MetricCard density="compact" label="Volume · 24h" value="1,248" unit="GPU-hr" />
              </div>

              <div className="mt-10 grid grid-cols-1 gap-px border border-line-subtle bg-line-subtle md:grid-cols-3">
                <MetricCard
                  label="P50 latency"
                  value="18"
                  unit="ms"
                  change={-0.072}
                  invertChange
                  spark={latencySeries}
                  sparkTone="up"
                />
                <MetricCard
                  label="Uptime · 30d"
                  value="99.91%"
                  change={0.0008}
                  spark={uptimeSeries}
                  sparkTone="up"
                />
                <MetricCard
                  label="Capacity"
                  value="6 / 16"
                  unit="running"
                  spark={[2, 3, 3, 4, 5, 5, 6, 6]}
                  sparkTone="accent"
                />
              </div>

              <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
                <article>
                  <h2 className="text-md font-medium text-fg">Instrument</h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
                    NVIDIA H100 80GB SXM5 with NVLink. Optimised for large-language-model
                    inference and high-throughput training workloads. Fourth-generation
                    tensor cores, FP8 support, 900 GB/s NVLink interconnect.
                  </p>
                  <dl className="mt-6 grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2.5 text-sm">
                    <Spec k="Architecture"     v="Hopper" />
                    <Spec k="Memory"           v="80 GB HBM3e" />
                    <Spec k="Interconnect"     v="NVLink 4 · 900 GB/s" />
                    <Spec k="Max power"        v="700 W" />
                    <Spec k="CUDA cores"       v="16,896" />
                    <Spec k="Tensor cores"     v="528" />
                    <Spec k="Memory bandwidth" v="3.35 TB/s" />
                    <Spec k="Process node"     v="TSMC 4N" />
                  </dl>
                </article>

                <article className="lg:col-span-2">
                  <h2 className="text-md font-medium text-fg">Order history</h2>
                  <TileCard density="compact" className="mt-4 p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-line-subtle bg-card/40 text-fg-subtle">
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
                        <Row id="ord_8f3a2c" type="Launch" region="ZA-JNB" duration="1h"  qty="1" price="$3.42"  status="Completed" created="2m ago" />
                        <Row id="ord_7b9e1d" type="Launch" region="ZA-JNB" duration="2h"  qty="2" price="$6.80"  status="Completed" created="1h ago" />
                        <Row id="ord_5c2d9a" type="Rent"   region="ZA-JNB" duration="24h" qty="1" price="$72.00" status="Active"    created="3h ago" />
                        <Row id="ord_1a8d7f" type="Launch" region="ZA-CPT" duration="1h"  qty="1" price="$3.58"  status="Completed" created="1d ago" />
                        <Row id="ord_0f6b3e" type="Launch" region="ZA-JNB" duration="30m" qty="1" price="$1.71"  status="Completed" created="1d ago" />
                      </tbody>
                    </table>
                  </TileCard>
                </article>
              </div>

              <section className="mt-14">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-md font-medium text-fg">Related markets</h2>
                    <p className="mt-1 text-sm text-fg-muted">Other instruments routed in the same region.</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-px border border-line-subtle bg-line-subtle md:grid-cols-3">
                  <InstrumentCard
                    name="A100 80GB PCIe"
                    kind="GPU · Ampere"
                    hostedBy="Vultr"
                    region="ZA-JNB"
                    status="available"
                    price={2.45}
                    unit="/ hr"
                    change={0.012}
                    series={a100Series}
                    onLaunch={() => {}}
                  />
                  <InstrumentCard
                    name="Mac mini M2 Pro"
                    kind="Edge · Apple Silicon"
                    hostedBy="EdgeLab ZA"
                    region="ZA-STB"
                    status="low"
                    price={0.45}
                    unit="/ hr"
                    change={-0.031}
                    series={m2Series}
                    onLaunch={() => {}}
                  />
                  <InstrumentCard
                    name="Claude Opus 4.7"
                    kind="Model · 1M ctx"
                    hostedBy="Anthropic"
                    region="Global"
                    status="live"
                    price={15.00}
                    unit="/ 1M tok"
                    change={0.012}
                    series={opusSeries}
                    onLaunch={() => {}}
                  />
                </div>
              </section>
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

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-fg-subtle">{k}</dt>
      <dd className="text-right text-fg numeric tabular">{v}</dd>
    </>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={`px-3 py-2.5 text-xs font-normal ${align === "right" ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}

function Row({
  id, type, region, duration, qty, price, status, created,
}: {
  id: string; type: string; region: string; duration: string; qty: string; price: string; status: string; created: string;
}) {
  const tone =
    status === "Completed" ? "text-data-up"
    : status === "Active" ? "text-accent"
    : status === "Failed" ? "text-data-down"
    : "text-fg-muted";
  return (
    <tr className="border-b border-line-subtle text-sm last:border-b-0 hover:bg-card/30">
      <Td><span className="font-mono text-fg">{id}</span></Td>
      <Td>{type}</Td>
      <Td><span className="font-mono">{region}</span></Td>
      <Td align="right" tabular>{duration}</Td>
      <Td align="right" tabular>{qty}</Td>
      <Td align="right" tabular>{price}</Td>
      <Td><span className={tone}>{status}</span></Td>
      <Td align="right">{created}</Td>
    </tr>
  );
}

function Td({
  children, align = "left", tabular = false,
}: {
  children: React.ReactNode; align?: "left" | "right"; tabular?: boolean;
}) {
  return (
    <td
      className={`px-3 py-2.5 text-fg-muted ${align === "right" ? "text-right" : "text-left"} ${tabular ? "tabular numeric" : ""}`}
    >
      {children}
    </td>
  );
}
