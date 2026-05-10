# @inferenceui/tokens

Design tokens for InferenceUI. A single CSS file shipping the surface stack, foreground stack, line palette, accent system, semantic up/down colors, radius scale, shadow tokens, and motion timings used by every InferenceUI component.

## Install

```sh
bun add @inferenceui/tokens
```

## Usage

Import once in your app's global stylesheet (above any consumer styles):

```css
@import "@inferenceui/tokens/tokens.css";
```

Or in JavaScript / TypeScript entry points:

```ts
import "@inferenceui/tokens/tokens.css";
```

## What you get

- `--surface-0` through `--surface-3` — page → raised surface stack
- `--fg`, `--fg-muted`, `--fg-subtle`, `--fg-disabled` — foreground tiers
- `--line-subtle`, `--line`, `--line-strong` — hairline borders
- `--accent`, `--accent-soft`, `--accent-foreground` — single brand accent
- `--data-up`, `--data-down`, `--data-info`, `--data-warn` — outcome semantics
- `--shadow-card`, `--shadow-card-hover`, `--shadow-pop` — elevation
- `--radius`, `--radius-sm`/`md`/`lg`/`xl` — corner system (12px base)
- `--duration-instant` / `--duration-swift` / `--duration-smooth` / `--duration-elevate` — motion timings
- `--ease-out-quint` — easing curve

Light is the default. Dark mode is opt-in via `[data-mode="dark"]` on `<html>`.

## License

MIT
