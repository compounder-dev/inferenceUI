import { Card } from "./primitives/card";
import { cn } from "../lib/utils";

export interface TileCardProps extends React.ComponentProps<typeof Card> {
  density?: "compact" | "comfortable" | "roomy";
  interactive?: boolean;
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
