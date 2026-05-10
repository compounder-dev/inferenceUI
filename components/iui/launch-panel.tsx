"use client";

import * as React from "react";
import { Zap, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TileCard } from "./tile-card";
import { QuantityStepper } from "./quantity-stepper";
import { Numeric } from "./numeric";
import { cn } from "@/lib/utils";

/**
 * <LaunchPanel>
 *
 * The right-rail action panel on an instrument detail page. Two top-level
 * modes — Launch (interactive runtime) and Rent (longer-form lease) — and
 * a billing toggle (on-demand / reserved). Renders an estimate readout
 * and a primary `Launch` CTA, plus an "Or use API" code-block fallback.
 */
export interface LaunchPanelProps extends React.ComponentProps<typeof TileCard> {
  /** Per-unit price in USD. */
  unitPrice: number;
  /** Unit string — e.g. "/ hr" or "/ 1M tok". */
  unit: string;
  /** Available stock — drives the quantity stepper max. */
  available?: number;
  /** Code block snippet shown under "Or use API". */
  apiSnippet?: string;
}

export function LaunchPanel({
  unitPrice,
  unit,
  available = 6,
  apiSnippet = `curl https://api.inference.exchange/v1/runtimes \\
  -H "Authorization: Bearer $IEX_KEY" \\
  -d '{ "model": "h100-80gb-sxm", "duration": "1h", "quantity": 1 }'`,
  className,
  ...rest
}: LaunchPanelProps) {
  const [mode, setMode] = React.useState<"launch" | "rent">("launch");
  const [billing, setBilling] = React.useState<"on-demand" | "reserved">("on-demand");
  const [duration, setDuration] = React.useState("1h");
  const [quantity, setQuantity] = React.useState(1);

  const total = quantity * unitPrice;
  const perMinute = unitPrice / 60;

  return (
    <TileCard density="comfortable" className={cn("flex flex-col gap-5 p-0", className)} {...rest}>
      <div className="flex flex-col gap-3 px-5 pt-5">
        <Button size="lg" className="w-full gap-2">
          <Zap className="size-4" strokeWidth={2.4} fill="currentColor" />
          Launch runtime
        </Button>
        <Button size="lg" variant="outline" className="w-full">
          Rent now
        </Button>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as "launch" | "rent")} className="px-5">
        <TabsList className="h-9 w-full bg-card/40 p-0.5">
          <TabsTrigger value="launch" className="text-xs">Launch</TabsTrigger>
          <TabsTrigger value="rent" className="text-xs">Rent</TabsTrigger>
        </TabsList>

        <TabsContent value="launch" className="mt-4 flex flex-col gap-4">
          <Field label="Billing">
            <div className="inline-flex w-full items-center gap-0.5 rounded-md border border-line bg-card/40 p-0.5">
              <BillingChip
                active={billing === "on-demand"}
                onClick={() => setBilling("on-demand")}
              >
                On-demand
              </BillingChip>
              <BillingChip
                active={billing === "reserved"}
                onClick={() => setBilling("reserved")}
              >
                Reserved
              </BillingChip>
            </div>
          </Field>

          <Field label="Duration">
            <Select value={duration} onValueChange={(v) => v && setDuration(v)}>
              <SelectTrigger className="h-9 w-full border-line bg-card/40 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">15 minutes</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="4h">4 hours</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
              </SelectContent>
            </Select>
            <span className="mt-1 text-xs text-fg-subtle">Minimum 1 min</span>
          </Field>

          <Field label="Quantity">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={available}
              hint={`${available} available`}
            />
          </Field>
        </TabsContent>

        <TabsContent value="rent" className="mt-4 text-sm text-fg-muted">
          Reserved leases lock pricing for a fixed window. Contact sales for terms.
        </TabsContent>
      </Tabs>

      <div className="mx-5 flex flex-col gap-1 border-t border-line-subtle pt-4 text-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-fg-subtle">Estimated total</span>
          <Numeric weight="display" prefix="USD" size="1.5rem">{total.toFixed(2)}</Numeric>
        </div>
        <div className="flex items-baseline justify-between font-mono text-xs tabular text-fg-subtle">
          <span>per-minute</span>
          <span>${perMinute.toFixed(4)} / min</span>
        </div>
      </div>

      <div className="px-5 pb-5">
        <Button size="lg" className="w-full gap-2">
          <Zap className="size-4" strokeWidth={2.4} fill="currentColor" />
          Launch runtime
        </Button>
      </div>

      <div className="border-t border-line-subtle bg-card/30 px-5 py-4">
        <ApiSnippet snippet={apiSnippet} />
      </div>
    </TileCard>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-fg-subtle">{label}</span>
      {children}
    </label>
  );
}

function BillingChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Toggle
      size="sm"
      pressed={active}
      onPressedChange={(p) => p && onClick()}
      className={cn(
        "h-7 flex-1 rounded-sm text-xs",
        active
          ? "bg-secondary text-fg hover:bg-secondary hover:text-fg"
          : "text-fg-subtle hover:text-fg",
      )}
    >
      {children}
    </Toggle>
  );
}

function ApiSnippet({ snippet }: { snippet: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore — clipboard not available
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-fg-subtle">Or use API</span>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Copy snippet"
          onClick={handleCopy}
          className="h-6 w-6"
        >
          {copied ? <Check className="size-3" strokeWidth={2.4} /> : <Copy className="size-3" strokeWidth={2} />}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-sm border border-line-subtle bg-background p-3 font-mono text-xs leading-relaxed text-fg-muted">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}
