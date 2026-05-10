import { cn } from "@/lib/utils";

/**
 * <DataLabel>
 *
 * The smallest type slot in the system: a mono, uppercase, tracked label
 * that prefixes every dense data block. Always pairs with a <Numeric>,
 * a value, or a chart.
 */
export function DataLabel({
  children,
  className,
  index,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  /** Optional ordinal — renders as `01 //` prefix. */
  index?: number | string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-subtle",
        className,
      )}
      {...props}
    >
      {index !== undefined ? (
        <>
          <span className="text-fg-subtle/70 tabular-nums">
            {typeof index === "number" ? index.toString().padStart(2, "0") : index}
          </span>
          <span className="text-fg-subtle/40">{"//"}</span>
        </>
      ) : null}
      {children}
    </span>
  );
}
