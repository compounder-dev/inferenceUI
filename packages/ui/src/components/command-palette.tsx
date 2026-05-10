"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./primitives/dialog";
import { Input } from "./primitives/input";
import { Search } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * <CommandPalette>
 *
 * Global ⌘K. Built on shadcn `<Dialog>` + a filterable list. Supports
 * keyboard nav (↑ / ↓ / ↵ / Esc) and group headers. The hot-key listener
 * is opt-in via the `hotkey` prop (default: ⌘K / Ctrl+K).
 */
export interface CommandItem {
  id: string;
  label: string;
  /** Group / section header — items with the same group cluster together. */
  group?: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Optional secondary line, e.g. command path. */
  hint?: React.ReactNode;
  /** Trailing keyboard shortcut chip text, e.g. "⌘L". */
  shortcut?: string;
  /** Hidden tokens to match additional keywords. */
  keywords?: readonly string[];
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: readonly CommandItem[];
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  /** Wire the global ⌘K / Ctrl+K hotkey. Pass `false` to handle externally. */
  hotkey?: boolean;
  /** Custom title — used by screen readers. */
  title?: string;
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = "Search markets, runtimes, regions…",
  emptyMessage = "No matches",
  hotkey = true,
  title = "Command palette",
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey, onOpenChange, open]);

  React.useEffect(() => {
    if (!open) setQuery("");
    setActive(0);
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const hay = [it.label, it.group ?? "", it.hint?.toString() ?? "", ...(it.keywords ?? [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const it of filtered) {
      const key = it.group ?? "Results";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const select = (it: CommandItem) => {
    it.onSelect?.();
    onOpenChange(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      const target = filtered[active];
      if (target) {
        e.preventDefault();
        select(target);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[20%] w-[min(640px,calc(100vw-2rem))] translate-y-0 gap-0 overflow-hidden rounded-md border-line p-0"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">Use the up and down arrows to navigate, return to select.</DialogDescription>

        <div className="flex items-center gap-3 border-b border-line-subtle px-4 py-3">
          <Search className="size-4 shrink-0 text-fg-subtle" strokeWidth={2} />
          <Input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="h-7 border-none bg-transparent p-0 text-md placeholder:text-fg-subtle focus-visible:ring-0"
          />
          <kbd className="hidden h-5 items-center rounded-sm border border-line-subtle bg-card px-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-fg-subtle md:inline-flex">
            esc
          </kbd>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-1.5">
          {grouped.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-fg-subtle">{emptyMessage}</p>
          ) : (
            grouped.map(([group, list]) => (
              <div key={group} className="px-1.5 pt-2 first:pt-1">
                <div className="px-2 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-fg-subtle">
                  {group}
                </div>
                <ul className="flex flex-col gap-px">
                  {list.map((it) => {
                    const idx = filtered.indexOf(it);
                    const isActive = idx === active;
                    return (
                      <li key={it.id}>
                        <button
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => select(it)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left text-sm",
                            "transition-colors",
                            isActive ? "bg-secondary text-fg" : "text-fg-muted",
                          )}
                        >
                          <span className="grid size-6 place-items-center rounded-sm bg-card text-fg-subtle">
                            {it.icon}
                          </span>
                          <span className="flex-1 truncate">{it.label}</span>
                          {it.hint ? (
                            <span className="hidden truncate text-xs text-fg-subtle md:inline">{it.hint}</span>
                          ) : null}
                          {it.shortcut ? (
                            <kbd className="font-mono text-2xs uppercase tracking-[0.12em] text-fg-subtle">
                              {it.shortcut}
                            </kbd>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line-subtle bg-card/30 px-3 py-2 font-mono text-2xs tabular text-fg-subtle">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>navigate</span>
            <Kbd>↵</Kbd>
            <span>select</span>
          </span>
          <span>{filtered.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-4 min-w-4 items-center justify-center rounded-[3px] border border-line-subtle bg-card px-1 font-mono text-[10px] text-fg-subtle">
      {children}
    </kbd>
  );
}
