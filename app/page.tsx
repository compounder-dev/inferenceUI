import { CoordStrip } from "@/components/iui/coord-strip";
import { DataLabel } from "@/components/iui/data-label";
import { InstrumentHero } from "@/components/iui/instrument-hero";
import { Metric } from "@/components/iui/metric";
import { Sparkline } from "@/components/iui/sparkline";

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
        state="ALL SYSTEMS OPERATIONAL"
        tone="up"
        fixedTime="14:32:18 UTC"
      />

      <div className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-10 lg:px-10 lg:py-14">
        <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
          <span className="text-fg-muted">MARKETS</span>
          <span className="text-fg-subtle/40">/</span>
          <span className="text-fg-muted">GPUS</span>
          <span className="text-fg-subtle/40">/</span>
          <span className="text-fg">H100 80GB SXM</span>
        </nav>

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
          <StatTile label="Low · 24h"  value="$3.21" />
          <StatTile label="High · 24h" value="$3.58" />
          <StatTile label="Avg · 24h"  value="$3.38" />
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

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <article>
            <DataLabel index={2}>Instrument card</DataLabel>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted">
              NVIDIA H100 80GB SXM5 with NVLink. Optimised for large-language-model inference
              and high-throughput training workloads. Fourth-generation tensor cores, FP8 support,
              900 GB/s NVLink interconnect.
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[11px] tabular">
              <Spec k="ARCHITECTURE"     v="Hopper" />
              <Spec k="MEMORY"           v="80 GB HBM3e" />
              <Spec k="INTERCONNECT"     v="NVLink 4 · 900 GB/s" />
              <Spec k="MAX POWER"        v="700 W" />
              <Spec k="CUDA CORES"       v="16,896" />
              <Spec k="TENSOR CORES"     v="528" />
              <Spec k="MEMORY BANDWIDTH" v="3.35 TB/s" />
              <Spec k="PROCESS NODE"     v="TSMC 4N" />
            </dl>
          </article>

          <article className="lg:col-span-2">
            <DataLabel index={3}>Order / reservation history</DataLabel>
            <div className="mt-4 overflow-hidden border border-line-subtle">
              <table className="w-full text-[12px]">
                <thead className="bg-surface-1/50">
                  <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                    <Th>ID</Th>
                    <Th>Type</Th>
                    <Th>Region</Th>
                    <Th align="right">Duration</Th>
                    <Th align="right">Qty</Th>
                    <Th align="right">Price</Th>
                    <Th>Status</Th>
                    <Th align="right">Created</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-subtle">
                  <Row id="ord_8f3a2c" type="Launch" region="ZA-JNB" duration="1h"  qty="1" price="$3.42"  status="completed" created="2m ago" />
                  <Row id="ord_7b9e1d" type="Launch" region="ZA-JNB" duration="2h"  qty="2" price="$6.80"  status="completed" created="1h ago" />
                  <Row id="ord_5c2d9a" type="Rent"   region="ZA-JNB" duration="24h" qty="1" price="$72.00" status="active"    created="3h ago" />
                  <Row id="ord_1a8d7f" type="Launch" region="ZA-CPT" duration="1h"  qty="1" price="$3.58"  status="completed" created="1d ago" />
                  <Row id="ord_0f6b3e" type="Launch" region="ZA-JNB" duration="30m" qty="1" price="$1.71"  status="completed" created="1d ago" />
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

function StatTile({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="bg-surface-0 px-5 py-4">
      <DataLabel>{label}</DataLabel>
      <div className="mt-2 flex items-baseline gap-1.5 numeric font-medium tabular">
        <span className="text-lg text-fg">{value}</span>
        {unit ? <span className="text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{unit}</span> : null}
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
    <div className="bg-surface-0 px-6 py-5">
      <Metric
        label={label}
        value={
          <span className="flex items-baseline gap-1.5">
            <span className="text-2xl font-medium tabular">{value}</span>
            {unit ? <span className="text-[10px] uppercase tracking-[0.14em] text-fg-subtle">{unit}</span> : null}
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
      <dt className="text-fg-subtle uppercase tracking-[0.14em]">{k}</dt>
      <dd className="text-right text-fg">{v}</dd>
    </>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={`px-3 py-2 font-medium ${align === "right" ? "text-right" : "text-left"}`}>
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
    status === "completed" ? "text-data-up"
    : status === "active" ? "text-accent-amber"
    : status === "failed" ? "text-data-down"
    : "text-fg-muted";
  return (
    <tr className="font-mono tabular text-[11px] hover:bg-surface-1/30">
      <Td><span className="text-fg">{id}</span></Td>
      <Td>{type}</Td>
      <Td>{region}</Td>
      <Td align="right">{duration}</Td>
      <Td align="right">{qty}</Td>
      <Td align="right">{price}</Td>
      <Td><span className={tone + " uppercase tracking-[0.14em]"}>{status}</span></Td>
      <Td align="right">{created}</Td>
    </tr>
  );
}

function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return <td className={`px-3 py-2 ${align === "right" ? "text-right" : "text-left"} text-fg-muted`}>{children}</td>;
}
