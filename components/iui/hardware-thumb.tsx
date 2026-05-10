"use client";

import * as React from "react";
import Image from "next/image";
import { Cpu, HardDrive, Package, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * <HardwareThumb>
 *
 * A square instrument thumbnail. Tries to render a real product photo via
 * `next/image`; falls back to a typed iconographic glyph if the image
 * fails to load or no `image` was provided. Always renders with a 1px
 * dark/light overlay outline (per make-interfaces-feel-better §11) so it
 * sits cleanly on any surface.
 *
 *   <HardwareThumb kind="gpu" image="https://…/h100.jpg" alt="H100 GPU" size={40} />
 */
export type HardwareKind = "gpu" | "edge" | "model" | "agent";

export interface HardwareThumbProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  kind: HardwareKind;
  /** Optional photo URL — real product shot. */
  image?: string;
  /** Required alt text (image or glyph). */
  alt: string;
  /** Box size in px (square). */
  size?: number;
  /** Border radius — defaults to "md". */
  radius?: "sm" | "md" | "lg";
  /** Make the thumbnail clickable / focusable. */
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

      {/* 1px overlay outline — black @ 10% in light mode, white @ 10% in dark.
          Using a ring keeps the outline above the image without inflating its
          rendered box. */}
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
