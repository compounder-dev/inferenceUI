"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Copy } from "lucide-react";
import { TileCard } from "./tile-card";
import { cn } from "@/lib/utils";

/**
 * <DeployPanel>
 *
 * The "deployment commands" surface — picks a runtime framework
 * (vLLM / SGLang / Docker / Kubernetes) and shows a copyable code block
 * for that target. Composes shadcn `<Tabs>` + `<Button>` + `<TileCard>`.
 */
export interface DeploySnippet {
  /** Tab key. */
  id: string;
  /** Tab label. */
  label: string;
  /** The code block content. */
  code: string;
  /** Optional language hint shown at the bottom-left. */
  language?: string;
}

export interface DeployPanelProps extends Omit<React.ComponentProps<typeof TileCard>, "children" | "title"> {
  snippets: DeploySnippet[];
  /** Optional title above the tabs. */
  title?: React.ReactNode;
  /** Optional default tab. */
  defaultTab?: string;
}

export function DeployPanel({
  snippets,
  title = "Deployment commands",
  defaultTab,
  className,
  ...rest
}: DeployPanelProps) {
  const initial = defaultTab ?? snippets[0]?.id ?? "";
  const [active, setActive] = React.useState(initial);
  return (
    <TileCard density="compact" className={cn("flex flex-col gap-0 p-0", className)} {...rest}>
      <div className="flex items-center justify-between border-b border-line-subtle px-4 py-2.5">
        <h3 className="text-sm font-medium text-fg">{title}</h3>
        <Tabs value={active} onValueChange={setActive}>
          <TabsList className="h-7 bg-card/40 p-0.5">
            {snippets.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="px-2.5 font-mono text-xs uppercase tracking-[0.06em]"
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {snippets.map((s) => (
        <Snippet key={s.id} snippet={s} active={active === s.id} />
      ))}
    </TileCard>
  );
}

function Snippet({ snippet, active }: { snippet: DeploySnippet; active: boolean }) {
  const [copied, setCopied] = React.useState(false);
  if (!active) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative">
      <pre className="max-h-80 overflow-auto bg-background p-4 font-mono text-xs leading-relaxed text-fg-muted">
        <code>{snippet.code}</code>
      </pre>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Copy snippet"
        onClick={handleCopy}
        className="absolute right-2 top-2 h-7 w-7 border border-line-subtle bg-card/50 backdrop-blur"
      >
        {copied ? <Check className="size-3.5" strokeWidth={2.4} /> : <Copy className="size-3.5" strokeWidth={2} />}
      </Button>
      {snippet.language ? (
        <div className="border-t border-line-subtle px-4 py-1.5 font-mono text-2xs uppercase tracking-[0.14em] text-fg-subtle">
          {snippet.language}
        </div>
      ) : null}
    </div>
  );
}
