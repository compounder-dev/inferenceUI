import { Card } from "./primitives/card";
import { cn } from "../lib/utils";

/**
 * <TileCard>
 *
 * The InferenceUI surface primitive. Composes shadcn `<Card>` with rounded
 * corners, a hairline border, soft elevation, and tighter density controls.
 * Use it anywhere you'd reach for a `<Card>` — it slots into the same data
 * lineage so any shadcn helper that targets card surfaces still works.
 */
export interface TileCardProps extends React.ComponentProps<typeof Card> {
  density?: "compact" | "comfortable" | "roomy";
  /** Adds a soft hover elevation transition. Use on clickable surfaces. */
  interactive?: boolean;
  /** Drop the inner padding entirely — for cards that own their own layout. */
  flush?: boolean;
}

const densityClass = {
  compact: "p-4",
  comfortable: "p-5",
  roomy: "p-6",
} as const;

export function TileCard({
  className,
  density = "comfortable",
  interactive,
  flush,
  children,
  ...rest
}: TileCardProps) {
  return (
    <Card
      className={cn(
        "rounded-lg border-line bg-card text-card-foreground gap-0 py-0 shadow-[var(--shadow-card)]",
        !flush && densityClass[density],
        interactive &&
          "cursor-pointer transition-shadow duration-[var(--duration-smooth)] ease-[var(--ease-out-quint)] hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
      {...rest}
    >
      {children}
    </Card>
  );
}
