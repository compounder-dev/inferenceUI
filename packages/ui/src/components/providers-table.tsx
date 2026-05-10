"use client";

import * as React from "react";
import { Button } from "./primitives/button";
import { Zap } from "lucide-react";
import { DataTable, type DataColumn } from "./data-table";
import { Delta } from "./delta";
import { StatusPill } from "./status-pill";

export interface ProviderRow {
  id: string;
  name: string;
  region: string;
  flag?: React.ReactNode;
  status: "available" | "live" | "low" | "offline";
  price: number;
  change?: number;
  latencyMs: number;
  capacity?: { used: number; total: number };
}

export interface ProvidersTableProps extends React.HTMLAttributes<HTMLDivElement> {
  providers: readonly ProviderRow[];
  onLaunch?: (row: ProviderRow) => void;
  formatPrice?: (n: number) => string;
}

const defaultFormat = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

const statusMap = {
  available: { tone: "up" as const,    label: "Available",    pulse: false },
  live:      { tone: "up" as const,    label: "Live",         pulse: true  },
  low:       { tone: "warn" as const,  label: "Low capacity", pulse: false },
  offline:   { tone: "down" as const,  label: "Offline",      pulse: false },
};

export function ProvidersTable({
  providers,
  onLaunch,
  formatPrice = defaultFormat,
  ...rest
}: ProvidersTableProps) {
  const columns: DataColumn<ProviderRow>[] = [
    {
      key: "name",
      header: "Provider",
      width: "minmax(160px, 1.4fr)",
      cell: (r) => <span className="text-fg">{r.name}</span>,
      sortable: true,
      accessor: (r) => r.name,
    },
    {
      key: "region",
      header: "Region",
      width: "minmax(140px, 1fr)",
      cell: (r) => (
        <span className="flex items-center gap-1.5 font-mono text-fg-muted">
          {r.flag}
          <span>{r.region}</span>
        </span>
      ),
      hideBelow: "md",
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      cell: (r) => {
        const sb = statusMap[r.status];
        return (
          <StatusPill tone={sb.tone} pulse={sb.pulse}>
            {sb.label}
          </StatusPill>
        );
      },
    },
    {
      key: "price",
      header: "Price · hr",
      width: "100px",
      align: "right",
      tabular: true,
      sortable: true,
      accessor: (r) => r.price,
      cell: (r) => <span className="text-fg">{formatPrice(r.price)}</span>,
    },
    {
      key: "change",
      header: "24h",
      width: "76px",
      align: "right",
      cell: (r) => (typeof r.change === "number" ? <Delta value={r.change} size="sm" /> : <span className="text-fg-subtle">—</span>),
      hideBelow: "md",
    },
    {
      key: "latency",
      header: "P50",
      width: "84px",
      align: "right",
      tabular: true,
      sortable: true,
      accessor: (r) => r.latencyMs,
      cell: (r) => (
        <span className="text-fg-muted">
          {r.latencyMs}<span className="text-fg-subtle"> ms</span>
        </span>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      width: "120px",
      cell: (r) => (r.capacity ? <CapacityCell {...r.capacity} /> : <span className="text-fg-subtle">—</span>),
      hideBelow: "lg",
    },
    {
      key: "actions",
      header: "",
      width: "92px",
      align: "right",
      cell: (r) => (
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 px-2.5 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onLaunch?.(r);
          }}
        >
          <Zap className="size-3" strokeWidth={2.4} fill="currentColor" />
          Launch
        </Button>
      ),
    },
  ];

  return <DataTable rows={providers} columns={columns} rowKey={(r) => r.id} {...rest} />;
}

function CapacityCell({ used, total }: { used: number; total: number }) {
  const ratio = total > 0 ? used / total : 0;
  let tone = "bg-data-up";
  if (ratio >= 0.9) tone = "bg-data-down";
  else if (ratio >= 0.6) tone = "bg-data-warn";
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs tabular text-fg">
        {used}<span className="text-fg-subtle"> / {total}</span>
      </span>
      <div className="relative h-1 w-12 overflow-hidden rounded-[2px] bg-card">
        <div className={`absolute inset-y-0 left-0 rounded-[2px] ${tone}`} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}
