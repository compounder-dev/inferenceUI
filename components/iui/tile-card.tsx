import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * <TileCard>
 *
 * The dense / edge-to-edge variant of shadcn `<Card>`. Sharp corners,
 * single hairline border, tighter default spacing — designed to tile
 * inside a 1px-gap CSS grid without competing chrome.
 *
 * Same `data-slot="card"` lineage so any shadcn helper that targets card
 * surfaces still works.
 */
export interface TileCardProps extends React.ComponentProps<typeof Card> {
  /** Tighten or loosen the inner padding. */
  density?: "compact" | "comfortable" | "roomy";
  /** Optional subtle gridline overlay (used for hero artwork tiles). */
  gridlines?: boolean;
}

const densityClass = {
  compact: "p-3",
  comfortable: "p-5",
  roomy: "p-6",
} as const;

export function TileCard({
  className,
  density = "comfortable",
  gridlines,
  children,
  ...rest
}: TileCardProps) {
  return (
    <Card
      className={cn(
        // Strip the default chrome that doesn't fit a tiled grid:
        "rounded-none border border-line ring-0 gap-0 py-0",
        // Apply our own padding scale:
        densityClass[density],
        // Optional gridline texture for hero tiles:
        gridlines && "gridlines-fine",
        className,
      )}
      {...rest}
    >
      {children}
    </Card>
  );
}
