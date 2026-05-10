# InferenceUI

Open-source UI for **compute exchanges, runtime control planes, and inference platforms**. Built on shadcn primitives. Light canvas, single blue accent, real-time data grammar.

Two packages, one repo:

| Package | What it is |
| --- | --- |
| [`@inferenceui/ui`](./packages/ui) | React components — TopNav, MarketCard, FeaturedMarket, PriceChart, LaunchPanel, HardwareThumb, and more. |
| [`@inferenceui/tokens`](./packages/tokens) | Design tokens as a single CSS file — surface stack, accent system, semantic colors, radius, motion. |

## Install

```sh
bun add @inferenceui/ui @inferenceui/tokens
```

## Use

```ts
// app/layout.tsx (or equivalent)
import "@inferenceui/tokens/tokens.css";
```

```tsx
// app/page.tsx
import { TopNav, TileCard, HardwareThumb, Numeric, Delta } from "@inferenceui/ui";

export default function Home() {
  return (
    <>
      <TopNav active="discover" />
      <TileCard density="comfortable">
        <HardwareThumb kind="gpu" image="/h100.jpg" alt="H100" size={48} />
        <Numeric weight="display" size="2rem">$3.42</Numeric>
        <Delta value={0.021} />
      </TileCard>
    </>
  );
}
```

If you use Tailwind v4, point the content scanner at the package source so classes are picked up:

```css
@source "../node_modules/@inferenceui/ui";
```

If you're on Next.js, add the package to `transpilePackages`:

```ts
// next.config.ts
const config: NextConfig = {
  transpilePackages: ["@inferenceui/ui", "@inferenceui/tokens"],
};
```

## Showcase

The reference app at [`apps/showcase`](./apps/showcase) is the canonical "what does this look like" demo. Run it locally:

```sh
bun install
bun dev
# open http://localhost:3000
```

It renders two routes:

- `/` — exchange Discover home (hero pitch, featured market, balance + positions rail, trending markets grid, bundles + watchlist + catalysts, footer)
- `/markets/h100` — instrument detail (TopNav, breadcrumb, title row, price chart with timeframe rail, stat cards, tabs, sticky launch panel)

## Design discipline

InferenceUI is opinionated:

- **One accent.** Blue. Used for primary CTAs, active nav, chart lines, accent-soft pill backgrounds. Nothing else.
- **Green/red are semantic.** Reserved for outcome chips (`<Delta>`), status dots, order side. Never decorative, never on chart line tone.
- **Cards: 12px radius, hairline border, soft shadow.** No glows, no gradients.
- **Single sans family.** Tabular numerics inline. Mono only for code, IDs, wallet addresses.
- **Sharp + accessible.** Focus states on every interactive element, `aria-label` on every icon-only button.

Components compose vendored shadcn primitives — no parallel implementation. If you want a primitive directly, it's exported too (`Button`, `Tabs`, `Avatar`, etc.).

## Repository layout

```
inferenceui/
├── apps/showcase/        # Next.js 16 demo site (consumes @inferenceui/ui)
├── packages/
│   ├── tokens/           # @inferenceui/tokens
│   └── ui/               # @inferenceui/ui
├── package.json          # workspace root
└── README.md             # this file
```

## Development

```sh
bun install                    # install workspace
bun dev                        # run the showcase
bun run build:packages         # build tokens + ui packages
bun run typecheck              # typecheck all workspaces
bun run publish:dry            # dry-run npm publish for both packages
```

## Contributing

Issues and pull requests welcome at [github.com/compounder-dev/inferenceUI](https://github.com/compounder-dev/inferenceUI).

When you contribute, match the design discipline. The showcase serves as the visual contract — if your component doesn't render the same way the showcase routes do, the diff goes back.

## License

[MIT](./LICENSE) © Marc Knowles
