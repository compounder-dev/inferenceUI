import * as React from "react";
import { cn } from "../lib/utils";

/**
 * <SidebarNav>
 *
 * A workspace navigation column. Composed of:
 *   - SidebarNav.Root        — the outer aside
 *   - SidebarNav.Header      — workspace identity (often a <ProfileChip>)
 *   - SidebarNav.Section     — labelled group of links
 *   - SidebarNav.Item        — a link/button row with icon + label + badge
 *   - SidebarNav.Footer      — pinned slot at the bottom
 *
 * Each item adopts shadcn `<Button>`-style focus/hover treatment via
 * className composition; we don't render an actual Button so the slot
 * stays free for the consumer to drop a Link / NextLink / a inside.
 */

function Root({
  className,
  width = 240,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { width?: number }) {
  return (
    <aside
      data-slot="sidebar-nav"
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-line-subtle bg-background",
        className,
      )}
      style={{ inlineSize: width }}
      {...rest}
    >
      {children}
    </aside>
  );
}

function Header({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-nav-header"
      className={cn(
        "flex items-center gap-2 border-b border-line-subtle px-3 py-3",
        className,
      )}
      {...rest}
    />
  );
}

function Section({
  label,
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { label?: React.ReactNode }) {
  return (
    <div
      data-slot="sidebar-nav-section"
      className={cn("flex flex-col gap-px px-2 py-3", className)}
      {...rest}
    >
      {label ? (
        <span className="px-2 pb-1.5 text-xs text-fg-subtle">{label}</span>
      ) : null}
      {children}
    </div>
  );
}

interface ItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /** Optional href — if set, renders an anchor (consumers can wrap with their router Link). */
  href?: string;
  /** Optional onClick — if set, renders a button. */
  onClick?: () => void;
  active?: boolean;
  icon?: React.ReactNode;
  label: React.ReactNode;
  badge?: React.ReactNode;
}

function Item({
  href,
  onClick,
  active,
  icon,
  label,
  badge,
  className,
  ...rest
}: ItemProps) {
  const classes = cn(
    "group relative flex h-9 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-sm text-fg-muted outline-none",
    "transition-[color,background-color] duration-150",
    "hover:bg-secondary/60 hover:text-fg",
    "focus-visible:bg-secondary/60 focus-visible:text-fg",
    active && [
      "bg-accent-soft text-fg",
      "before:absolute before:left-0 before:top-2 before:h-5 before:w-0.5 before:rounded-r-sm before:bg-accent",
    ],
    className,
  );

  const inner = (
    <>
      <span className="grid size-4 shrink-0 place-items-center text-fg-subtle group-hover:text-fg [[data-active=true]_&]:text-accent">
        {icon}
      </span>
      <span className="flex-1 truncate text-left">{label}</span>
      {badge ? <span className="ml-auto">{badge}</span> : null}
    </>
  );

  if (href) {
    return (
      <a
        data-slot="sidebar-nav-item"
        data-active={active || undefined}
        href={href}
        className={classes}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      data-slot="sidebar-nav-item"
      data-active={active || undefined}
      type="button"
      onClick={onClick}
      className={classes}
      // forward HTMLAnchor extras as div attrs on the button when relevant
    >
      {inner}
    </button>
  );
}

function Footer({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-nav-footer"
      className={cn("mt-auto border-t border-line-subtle px-3 py-3", className)}
      {...rest}
    />
  );
}

export const SidebarNav = { Root, Header, Section, Item, Footer };
