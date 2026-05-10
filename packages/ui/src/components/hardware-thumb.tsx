"use client";

import * as React from "react";
import Image from "next/image";
import { Cpu, HardDrive, Package, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export type HardwareKind = "gpu" | "edge" | "model" | "agent";

export interface HardwareThumbProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  kind: HardwareKind;
  image?: string;
  alt: string;
  size?: number;
  radius?: "sm" | "md" | "lg";
  asLink?: boolean;
}

const radiusClass = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
} as const;

const fallbackGlyph: Record<HardwareKind, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  gpu:   Cpu,
  edge:  HardDrive,
  model: Package,
  agent: Sparkles,
};

export function HardwareThumb({
  kind,
  image,
  alt,
  size = 40,
  radius = "md",
  className,
  asLink,
  ...rest
}: HardwareThumbProps) {
  const [errored, setErrored] = React.useState(false);
  const showImage = Boolean(image) && !errored;
  const Glyph = fallbackGlyph[kind];

  return (
    <span
      role={asLink ? "img" : undefined}
      aria-label={asLink ? alt : undefined}
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden bg-secondary text-fg-muted",
        radiusClass[radius],
        className,
      )}
      style={{ width: size, height: size }}
      {...rest}
    >
      {showImage ? (
        <Image
          src={image!}
          alt={alt}
          width={size * 2}
          height={size * 2}
          unoptimized
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <Glyph
          className="text-fg-muted"
          strokeWidth={1.5}
        />
      )}

      {/* 1px outline above the image, no box inflation. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          radiusClass[radius],
          "ring-1 ring-inset ring-black/10 dark:ring-white/10",
        )}
      />
    </span>
  );
}
