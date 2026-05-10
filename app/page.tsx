import { CoordStrip } from "@/components/iui/coord-strip";
import { InstrumentHero } from "@/components/iui/instrument-hero";
import { Metric } from "@/components/iui/metric";
import { Sparkline } from "@/components/iui/sparkline";
import { ThemeSwitch } from "@/components/iui/theme-switch";

const series = [
  3.14, 3.18, 3.21, 3.19, 3.22, 3.27, 3.30, 3.34, 3.31, 3.28,
  3.30, 3.36, 3.41, 3.39, 3.34, 3.38, 3.43, 3.40, 3.37, 3.39,
  3.42, 3.46, 3.45, 3.42,
];

const latencySeries = [22, 21, 20, 19, 19, 18, 18, 19, 18, 18, 17, 18];
const uptimeSeries = [99.85, 99.86, 99.88, 99.87, 99.89, 99.91, 99.92, 99.91];

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col">
      <CoordStrip
        system="INFERENCE.EX"
        region="ZA-JNB"
        state="All systems operational"
        tone="up"
        fixedTime="14:32:18 UTC"
      />

      <div className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-10 lg:px-10 lg:py-14">
        <div className="flex items-center justify-between">
          <Breadcrumb path={["Markets", "GPUs", "H100 80GB SXM"]} />
          <ThemeSwitch />
        </div>

        <div className="mt-8">
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
        </div>

        <div className="grid grid-cols-2 gap-px border-x border-b border-line-subtle bg-line-subtle md:grid-cols-4">
          <StatTile label="Low · 24h"    value="$3.21" />
          <StatTile label="High · 24h"   value="$3.58" />
          <StatTile label="Avg · 24h"    value="$3.38" />
          <StatTile label="Volume · 24h" value="1,248" unit="GPU-hr" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px border border-line-subtle bg-line-subtle md:grid-cols-3">
          <PanelTile
            label="P50 latency"
            value="18 ms"
            change={-0.072}
            invertChange
            spark={latencySeries}
            sparkTone="up"
          />
          <PanelTile
            label="Uptime · 30d"
            value="99.91%"
            change={0.0008}
            spark={uptimeSeries}
            sparkTone="up"
          />
          <PanelTile
            label="Capacity"
            value="6 / 16"
            unit="running"
            spark={[2, 3, 3, 4, 5, 5, 6, 6]}
            sparkTone="accent"
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <article>
            <h2 className="text-lg font-medium tracking-tight text-fg">Instrument</h2>
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
            <h2 className="text-lg font-medium tracking-tight text-fg">Order history</h2>
            <div className="mt-4 overflow-hidden border border-line-subtle">
              <table className="w-full text-[12px]">
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
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

function Breadcrumb({ path }: { path: string[] }) {
  return (
    <nav className="flex items-center gap-2 text-[12px] text-fg-subtle">
      {path.map((p, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className={i === path.length - 1 ? "text-fg" : "hover:text-fg cursor-default"}>{p}</span>
          {i < path.length - 1 ? <span className="text-fg-subtle/40">/</span> : null}
        </span>
      ))}
    </nav>
  );
}

function StatTile({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="bg-background px-5 py-4">
      <div className="text-[11px] text-fg-subtle">{label}</div>
      <div className="mt-2 flex items-baseline gap-1.5 numeric font-medium tabular">
        <span className="text-lg text-fg">{value}</span>
        {unit ? <span className="text-[11px] text-fg-subtle">{unit}</span> : null}
      </div>
    </div>
  );
}

function PanelTile({
  label, value, unit, change, invertChange, spark, sparkTone = "auto",
}: {
  label: string; value: string; unit?: string; change?: number; invertChange?: boolean;
  spark?: number[]; sparkTone?: "auto" | "up" | "down" | "accent";
}) {
  return (
    <div className="bg-background px-6 py-5">
      <Metric
        label={label}
        value={
          <span className="flex items-baseline gap-1.5">
            <span className="text-2xl font-medium tabular">{value}</span>
            {unit ? <span className="text-[11px] text-fg-subtle">{unit}</span> : null}
          </span>
        }
        change={change}
        invertChange={invertChange}
      />
      {spark ? (
        <Sparkline
          data={spark}
          width={300}
          height={48}
          tone={sparkTone}
          emphasizeLast
          strokeWidth={1.1}
          className="mt-4 w-full"
        />
      ) : null}
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-fg-subtle">{k}</dt>
      <dd className="text-right text-fg numeric tabular text-[13px]">{v}</dd>
    </>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={`px-3 py-2.5 text-[11px] font-normal ${align === "right" ? "text-right" : "text-left"}`}>
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
    <tr className="border-b border-line-subtle text-[12px] last:border-b-0 hover:bg-card/30">
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
  children,
  align = "left",
  tabular = false,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  tabular?: boolean;
}) {
  return (
    <td
      className={`px-3 py-2.5 text-fg-muted ${align === "right" ? "text-right" : "text-left"} ${tabular ? "tabular numeric" : ""}`}
    >
      {children}
    </td>
  );
}
