"use client";

import * as React from "react";
import { Activity, Bell, ChevronDown, HelpCircle, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "./primitives/avatar";
import { Button } from "./primitives/button";
import { Input } from "./primitives/input";
import { cn } from "../lib/utils";

const DEFAULT_ITEMS = [
  { id: "discover",  label: "Discover" },
  { id: "markets",   label: "Markets" },
  { id: "portfolio", label: "Portfolio" },
  { id: "research",  label: "Research" },
  { id: "activity",  label: "Activity" },
] as const;

export interface TopNavProps {
  active?: string;
  onChange?: (id: string) => void;
  items?: ReadonlyArray<{ id: string; label: string }>;
  /** Wallet / account label shown on the right. Falls back to a truncated address. */
  account?: { initials: string; label: string };
}

export function TopNav({
  active = "discover",
  onChange,
  items = DEFAULT_ITEMS,
  account = { initials: "NL", label: "0x7f…3a2e" },
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-6 px-6 lg:px-10">
        <a href="/" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-accent text-accent-foreground">
            <Activity className="size-4" strokeWidth={2.5} />
          </span>
          <span className="text-base font-semibold tracking-tight text-fg">Inference Exchange</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((it) => {
            const isActive = active === it.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onChange?.(it.id)}
                className={cn(
                  "relative h-9 px-3 text-sm font-medium transition-colors",
                  isActive ? "text-accent" : "text-fg-muted hover:text-fg",
                )}
              >
                {it.label}
                {isActive ? (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" aria-hidden />
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2">
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" strokeWidth={1.75} />
            <Input
              placeholder="Search markets, models, providers…"
              className="h-9 pl-9 pr-14 bg-card"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line bg-background px-1.5 py-0.5 font-mono text-2xs text-fg-subtle">
              ⌘K
            </kbd>
          </div>

          <Button size="icon-sm" variant="ghost" aria-label="Notifications" className="relative">
            <Bell className="size-4" strokeWidth={1.75} />
            <span className="absolute right-1 top-1 size-1.5 rounded-full bg-accent" />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Help">
            <HelpCircle className="size-4" strokeWidth={1.75} />
          </Button>
          <button className="flex h-9 items-center gap-2 rounded-md border border-line bg-card px-2.5 text-sm">
            <Avatar className="size-6">
              <AvatarFallback className="bg-accent-soft text-accent text-2xs">{account.initials}</AvatarFallback>
            </Avatar>
            <span className="font-mono text-xs text-fg-muted tabular">{account.label}</span>
            <ChevronDown className="size-3.5 text-fg-subtle" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}
