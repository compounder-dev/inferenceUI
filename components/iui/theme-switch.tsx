"use client";

import { useTheme, type Accent, type Mode } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/**
 * <ThemeSwitch>
 *
 * A two-axis preset picker. Each chip flips one axis — mode (dark/light)
 * or accent (amber/ember). Renders as a single 1px-bordered control rail.
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const { mode, accent, setMode, setAccent } = useTheme();
  return (
    <div
      className={cn(
        "inline-flex items-center gap-px rounded-md border border-line bg-card/40 p-px",
        className,
      )}
    >
      <ChipGroup<Mode>
        value={mode}
        onChange={setMode}
        options={[
          { value: "dark", label: "Dark" },
          { value: "light", label: "Light" },
        ]}
      />
      <span className="mx-1 h-4 w-px bg-line-subtle" aria-hidden />
      <ChipGroup<Accent>
        value={accent}
        onChange={setAccent}
        options={[
          { value: "amber", label: "Amber" },
          { value: "ember", label: "Ember" },
        ]}
      />
    </div>
  );
}

function ChipGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex items-center">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-7 rounded-sm px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
            value === opt.value
              ? "bg-accent text-accent-foreground"
              : "text-fg-subtle hover:text-fg",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
