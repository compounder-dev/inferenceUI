# @inferenceui/ui

Open-source UI components for compute exchanges, runtime control planes, and inference platforms. Every component composes a vendored shadcn primitive — no parallel implementation.

## Install

```sh
bun add @inferenceui/ui @inferenceui/tokens
```

Or with npm / pnpm:

```sh
npm install @inferenceui/ui @inferenceui/tokens
pnpm add @inferenceui/ui @inferenceui/tokens
```

## Setup

### 1. Import the design tokens once

```css
/* app/globals.css or equivalent */
@import "@inferenceui/tokens/tokens.css";
```

### 2. Use components

```tsx
import { TopNav, TileCard, HardwareThumb, Numeric, Delta } from "@inferenceui/ui";

export default function Home() {
  return (
    <div>
      <TopNav active="discover" />
      <TileCard density="comfortable">
        <HardwareThumb kind="gpu" image="/h100.jpg" alt="H100" size={48} />
        <Numeric weight="display" size="2rem">$3.42</Numeric>
        <Delta value={0.021} />
      </TileCard>
    </div>
  );
}
```

## Design discipline

InferenceUI follows the "shadcn + Polymarket grammar" pattern:

- **One accent color**, used surgically (active nav, primary CTA, chart line, accent-soft pill backgrounds).
- **Green / red only for outcome semantics** — `<Delta>` chips, status dots, order side. Never decorative, never on chart lines.
- **Cards: 12px radius, hairline border, soft shadow.** No glows, no gradients.
- **Single sans family** (Geist Sans by default). Tabular numerics inline. Mono only for code, IDs, wallet addresses.
- **Sharp + accessible**: every interactive element has a visible focus state, every icon-only button has an `aria-label`.

## Components

| Component | Purpose |
| --- | --- |
| `<TopNav>` | App-shell header with logo, tabs, search, account. |
| `<TileCard>` | Canonical surface — replaces `<Card>` for InferenceUI density. |
| `<HardwareThumb>` | Square instrument thumbnail with image / glyph fallback + outline. |
| `<Numeric>` | Tabular numeric display — handles prefix/suffix, tone, weight. |
| `<Delta>` | Signed % change with arrow + auto tone (semantic). |

More components ship as they stabilize — see the [showcase app](../../apps/showcase) for the canonical reference.

## License

MIT
