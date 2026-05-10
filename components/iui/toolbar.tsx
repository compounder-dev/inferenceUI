"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, HelpCircle, Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * <Toolbar>
 *
 * Page-level top bar. Renders an optional breadcrumb on the left, a
 * keyboard-shortcut search field in the middle, secondary icon actions,
 * and a primary CTA on the right.
 *
 * Children of `actions` are appended after the bell. Children of
 * `primary` replaces the default Launch CTA.
 */
export interface ToolbarProps extends React.HTMLAttributes<HTMLElement> {
  breadcrumb?: React.ReactNode;
  /** Bind a search-input to your own state. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Replace the default `⌘K` shortcut hint. */
  searchHint?: React.ReactNode;
  /** Hide the search field entirely. */
  hideSearch?: boolean;
  /** Slot rendered before the primary CTA — e.g. extra icon buttons. */
  actions?: React.ReactNode;
  /** Override the primary CTA. Defaults to `Launch runtime`. */
  primary?: React.ReactNode;
}

export function Toolbar({
  breadcrumb,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search markets, models, regions…",
  searchHint = "⌘K",
  hideSearch,
  actions,
  primary,
  className,
  ...rest
}: ToolbarProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center gap-3 border-b border-line-subtle bg-background/80 px-3 backdrop-blur md:px-5",
        className,
      )}
      {...rest}
    >
      <div className="hidden md:block">{breadcrumb}</div>

      {!hideSearch ? (
        <div className="relative ml-auto flex-1 md:ml-3 md:max-w-xl">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-subtle"
            strokeWidth={2}
          />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 border-line bg-card/50 pl-8 pr-12 text-sm placeholder:text-fg-subtle"
          />
          {searchHint ? (
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-fg-subtle">
              {searchHint}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="flex shrink-0 items-center gap-1.5">
        <Button variant="ghost" size="icon-sm" aria-label="Help" className="hidden md:inline-flex">
          <HelpCircle className="size-4" strokeWidth={2} />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell className="size-4" strokeWidth={2} />
        </Button>
        {actions}
        {primary === undefined ? (
          <Button size="sm" className="ml-1 hidden gap-1.5 sm:inline-flex">
            <Zap className="size-3.5" strokeWidth={2.4} fill="currentColor" />
            Launch runtime
          </Button>
        ) : (
          primary
        )}
      </div>
    </header>
  );
}
