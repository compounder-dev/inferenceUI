import * as React from "react";
import { cn } from "../lib/utils";

/**
 * <NewsItem>
 *
 * A single feed entry — source identity (logo + name) on the left of the
 * meta row, then a one-line title. Used in featured market context rails
 * and in standalone activity feeds. Reads correctly in both dark and
 * light modes.
 */
export interface NewsItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Source name — e.g. "Vultr", "Anthropic", "OpenAI". */
  source: string;
  /** Optional source glyph — a logo, initial, or thumbnail. */
  sourceLogo?: React.ReactNode;
  /** Headline / title — kept short, single line by default. */
  title: React.ReactNode;
  /** Relative timestamp — e.g. "2m ago", "3d ago". */
  timeAgo: string;
  /** Optional href — turns the row into a clickable link. */
  href?: string;
  /** When true, the title can wrap up to 2 lines. */
  multiline?: boolean;
}

export function NewsItem({
  source, sourceLogo, title, timeAgo, href, multiline,
  className, ...rest
}: NewsItemProps) {
  const inner = (
    <>
      <div className="flex items-center gap-2 text-xs text-fg-subtle">
        {sourceLogo ? (
          <span className="grid size-4 place-items-center overflow-hidden rounded-[3px] bg-card text-2xs font-medium">
            {sourceLogo}
          </span>
        ) : null}
        <span className="font-medium text-fg-muted">{source}</span>
        <span className="text-fg-subtle/50">·</span>
        <time className="tabular">{timeAgo}</time>
      </div>
      <p
        className={cn(
          "mt-1 text-sm text-fg",
          multiline ? "line-clamp-2" : "truncate",
        )}
      >
        {title}
      </p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn("block transition-colors hover:bg-card/40 rounded-sm p-1 -m-1", className)}
        {...(rest as React.HTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }
  return (
    <div className={cn("min-w-0", className)} {...rest}>
      {inner}
    </div>
  );
}
