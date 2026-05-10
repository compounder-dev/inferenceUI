"use client";

import { Toggle } from "@/components/ui/toggle";
import { useTheme, type Mode } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export interface ThemeSwitchProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ThemeSwitch({ className, ...rest }: ThemeSwitchProps) {
  const { mode, setMode } = useTheme();
  const items: { value: Mode; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];
  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex items-center rounded-md border border-line bg-card p-0.5",
        className,
      )}
      {...rest}
    >
      {items.map((it) => (
        <Toggle
          key={it.value}
          size="sm"
          pressed={mode === it.value}
          onPressedChange={(pressed) => pressed && setMode(it.value)}
          aria-checked={mode === it.value}
          role="radio"
          className={cn(
            "h-7 rounded-sm px-2.5 text-xs font-medium",
            mode === it.value
              ? "bg-secondary text-fg hover:bg-secondary hover:text-fg"
              : "text-fg-muted hover:text-fg",
          )}
        >
          {it.label}
        </Toggle>
      ))}
    </div>
  );
}
