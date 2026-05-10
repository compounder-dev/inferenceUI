"use client";

import { Toggle } from "@/components/ui/toggle";
import { useTheme, type Accent, type Mode } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/**
 * <ThemeSwitch>
 *
 * Two single-select rails — one for canvas mode (dark / light), one for
 * accent (amber / ember). Each chip is a shadcn `<Toggle>` so keyboard
 * focus, aria-pressed, and hover states all come from the primitive.
 */
export interface ThemeSwitchProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ThemeSwitch({ className, ...rest }: ThemeSwitchProps) {
  const { mode, accent, setMode, setAccent } = useTheme();
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-line bg-card/40 p-0.5",
        className,
      )}
      {...rest}
    >
      <Rail<Mode>
        value={mode}
        onChange={setMode}
        items={[
          { value: "dark", label: "Dark" },
          { value: "light", label: "Light" },
        ]}
      />
      <span className="h-4 w-px bg-line" aria-hidden />
      <Rail<Accent>
        value={accent}
        onChange={setAccent}
        items={[
          { value: "amber", label: "Amber" },
          { value: "ember", label: "Ember" },
        ]}
        accentActive
      />
    </div>
  );
}

function Rail<T extends string>({
  value,
  onChange,
  items,
  accentActive,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: string }[];
  accentActive?: boolean;
}) {
  return (
    <div className="inline-flex items-center" role="radiogroup">
      {items.map((it) => (
        <Toggle
          key={it.value}
          size="sm"
          pressed={value === it.value}
          onPressedChange={(pressed) => {
            if (pressed) onChange(it.value);
          }}
          aria-checked={value === it.value}
          role="radio"
          className={cn(
            "h-7 rounded-sm px-2.5 text-xs font-medium",
            value === it.value
              ? accentActive
                ? "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                : "bg-secondary text-fg hover:bg-secondary hover:text-fg"
              : "text-fg-subtle hover:text-fg",
          )}
        >
          {it.label}
        </Toggle>
      ))}
    </div>
  );
}
