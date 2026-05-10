"use client";

import * as React from "react";
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * <DataTable>
 *
 * A dense, sortable, sticky-headed list. Built directly on shadcn
 * `<Table>` so it inherits `<table>` semantics, screen-reader behaviour,
 * and the styling baseline. Every row gets `data-slot="data-row"` so
 * surrounding code can target it for selection / keyboard nav.
 *
 *   const columns: DataColumn<Row>[] = [
 *     { key: "name",  header: "Name",  cell: r => r.name },
 *     { key: "price", header: "Price", align: "right", tabular: true,
 *       sortable: true, accessor: r => r.price },
 *   ];
 *
 *   <DataTable rows={rows} columns={columns} rowKey={r => r.id} />
 */

export type SortDir = "asc" | "desc";

export interface DataColumn<Row> {
  key: string;
  header: React.ReactNode;
  cell?: (row: Row) => React.ReactNode;
  /** When sortable, supply an accessor that returns a comparable value. */
  sortable?: boolean;
  accessor?: (row: Row) => string | number;
  align?: "left" | "right" | "center";
  width?: string;
  /** Apply tabular numerics to the cell. */
  tabular?: boolean;
  /** Hide on mobile (below md). */
  hideBelow?: "sm" | "md" | "lg";
}

export interface DataTableProps<Row> extends React.HTMLAttributes<HTMLDivElement> {
  rows: readonly Row[];
  columns: readonly DataColumn<Row>[];
  rowKey: (row: Row, i: number) => string;
  onRowClick?: (row: Row) => void;
  /** Initial sort. */
  defaultSort?: { key: string; dir: SortDir };
  /** Sticky header — defaults to true. */
  stickyHeader?: boolean;
  /** Empty-state slot. */
  empty?: React.ReactNode;
  /** Hide divider line between rows. */
  borderless?: boolean;
}

const hideBelowClass: Record<NonNullable<DataColumn<unknown>["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

export function DataTable<Row>({
  rows,
  columns,
  rowKey,
  onRowClick,
  defaultSort,
  stickyHeader = true,
  empty = "No rows",
  borderless,
  className,
  ...rest
}: DataTableProps<Row>) {
  const [sort, setSort] = React.useState<{ key: string; dir: SortDir } | null>(defaultSort ?? null);

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.accessor) return rows;
    const a = col.accessor;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((x, y) => {
      const ax = a(x);
      const ay = a(y);
      if (ax === ay) return 0;
      return ax > ay ? dir : -dir;
    });
  }, [rows, columns, sort]);

  function toggle(key: string) {
    setSort((s) => {
      if (s?.key !== key) return { key, dir: "asc" };
      if (s.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  return (
    <div
      className={cn(
        "iui-table overflow-hidden border border-line-subtle",
        className,
      )}
      {...rest}
    >
      <ShadTable className="text-sm">
        <TableHeader
          className={cn(
            "bg-card/40 [&_tr]:border-line-subtle",
            stickyHeader && "sticky top-0 z-10",
          )}
        >
          <TableRow className="border-b border-line-subtle hover:bg-transparent">
            {columns.map((c) => {
              const sortable = c.sortable && c.accessor;
              const active = sort?.key === c.key;
              const Arrow = !sortable
                ? null
                : !active
                  ? ArrowUpDown
                  : sort?.dir === "asc"
                    ? ArrowUp
                    : ArrowDown;
              return (
                <TableHead
                  key={c.key}
                  className={cn(
                    "h-9 px-3 text-xs font-normal text-fg-subtle",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.hideBelow && hideBelowClass[c.hideBelow],
                  )}
                  style={{ width: c.width }}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => toggle(c.key)}
                      className={cn(
                        "inline-flex items-center gap-1 transition-colors hover:text-fg",
                        active && "text-fg",
                      )}
                    >
                      {c.header}
                      {Arrow ? <Arrow className="size-3" strokeWidth={2} /> : null}
                    </button>
                  ) : (
                    c.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {sorted.length === 0 ? (
            <TableRow className="border-b-0 hover:bg-transparent">
              <TableCell colSpan={columns.length} className="px-3 py-12 text-center text-sm text-fg-subtle">
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((row, i) => (
              <TableRow
                key={rowKey(row, i)}
                data-slot="data-row"
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  borderless ? "border-0" : "border-b border-line-subtle last:border-b-0",
                  onRowClick && "cursor-pointer hover:bg-card/40",
                )}
              >
                {columns.map((c) => {
                  const value = c.cell
                    ? c.cell(row)
                    : ((row as Record<string, React.ReactNode>)[c.key] ?? null);
                  return (
                    <TableCell
                      key={c.key}
                      className={cn(
                        "px-3 py-2.5 text-fg-muted",
                        c.align === "right" && "text-right",
                        c.align === "center" && "text-center",
                        c.tabular && "numeric tabular",
                        c.hideBelow && hideBelowClass[c.hideBelow],
                      )}
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </ShadTable>
    </div>
  );
}
