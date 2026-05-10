"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * <QuantityStepper>
 *
 * A tabular numeric input with `−` / `+` flank buttons. Composes shadcn
 * `<Button>` for the steppers and a native `<input type="number">` so
 * every behaviour lines up with form expectations.
 */
export interface QuantityStepperProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value" | "defaultValue"> {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Optional hint shown beneath the field, e.g. "6 available". */
  hint?: React.ReactNode;
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  hint,
  className,
  ...rest
}: QuantityStepperProps) {
  const clamp = React.useCallback(
    (n: number) => Math.min(max, Math.max(min, n)),
    [min, max],
  );
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex h-9 items-stretch overflow-hidden rounded-md border border-line bg-card/40">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Decrement"
          onClick={() => onChange(clamp(value - step))}
          disabled={value <= min}
          className="h-full rounded-none border-r border-line text-fg-subtle hover:text-fg"
        >
          <Minus className="size-3.5" strokeWidth={2} />
        </Button>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={Number.isFinite(max) ? max : undefined}
          step={step}
          onChange={(e) => {
            const n = Number(e.currentTarget.value);
            if (!Number.isNaN(n)) onChange(clamp(n));
          }}
          className="flex-1 bg-transparent text-center font-mono tabular text-base text-fg outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...rest}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Increment"
          onClick={() => onChange(clamp(value + step))}
          disabled={value >= max}
          className="h-full rounded-none border-l border-line text-fg-subtle hover:text-fg"
        >
          <Plus className="size-3.5" strokeWidth={2} />
        </Button>
      </div>
      {hint ? <span className="text-xs text-fg-subtle tabular">{hint}</span> : null}
    </div>
  );
}
