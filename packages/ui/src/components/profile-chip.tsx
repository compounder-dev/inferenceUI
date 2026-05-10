import { Avatar, AvatarFallback, AvatarImage } from "./primitives/avatar";
import { cn } from "../lib/utils";

/**
 * <ProfileChip>
 *
 * Identity row built on top of shadcn `<Avatar>`. Shows an avatar plus a
 * primary line (name / workspace) and an optional secondary line
 * (handle / email). Designed for sidebars, topbars, account menus.
 */
export interface ProfileChipProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** Optional secondary line — handle / email / role. */
  meta?: React.ReactNode;
  /** Image URL. Falls back to initials when missing or fails to load. */
  src?: string;
  /** Override the auto-generated initials. */
  initials?: string;
  size?: "sm" | "md" | "lg";
  /** Stack the meta row underneath (default) or hide it. */
  showMeta?: boolean;
}

const avatarSize = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
} as const;

export function ProfileChip({
  name,
  meta,
  src,
  initials,
  size = "md",
  showMeta = true,
  className,
  ...rest
}: ProfileChipProps) {
  const fallback = (initials ?? name)
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)} {...rest}>
      <Avatar className={cn(avatarSize[size], "rounded-sm")}>
        {src ? <AvatarImage src={src} alt={name} /> : null}
        <AvatarFallback className="rounded-sm bg-secondary text-xs font-medium text-fg">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate text-sm text-fg">{name}</div>
        {showMeta && meta ? (
          <div className="truncate text-xs text-fg-subtle">{meta}</div>
        ) : null}
      </div>
    </div>
  );
}
