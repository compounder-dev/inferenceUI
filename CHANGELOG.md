# Changelog

## 0.1.0 — 2026-05-10

First public release. Two packages publishable to npm:

- **@inferenceui/tokens@0.1.0** — Design tokens (CSS) for the light canvas + blue accent system. Surfaces, foreground stack, line palette, accent, semantic up/down, radius scale (12px base), shadow tokens, motion timings.
- **@inferenceui/ui@0.1.0** — React component library. Composes vendored shadcn primitives. Ships:
  - **Surfaces:** `<TileCard>`
  - **Hardware identity:** `<HardwareThumb>` with image fallback + outline
  - **Numerics:** `<Numeric>`, `<Delta>`, `<Sparkline>`, `<PriceChart>`, `<BenchmarkBar>`
  - **Status:** `<StatusPill>`
  - **Chrome:** `<TopNav>`, `<SidebarNav>`, `<Toolbar>`, `<ProfileChip>`, `<CoordStrip>`
  - **Discovery:** `<DiscoveryRow>`, `<InstrumentCard>`, `<InstrumentHero>`, `<ProvidersTable>`, `<LaunchPanel>`, `<DeployPanel>`, `<FeaturedMarket>`, `<CategoryNav>`, `<TagPills>`, `<RankedRail>`, `<CarouselDots>`, `<TickerTape>`, `<NewsItem>`, `<MetricCard>`, `<Metric>`, `<QuantityStepper>`, `<DataTable>`, `<CommandPalette>`, `<WireframeGpu>`, `<AdonaiDownloadCard>`
  - **Theme:** `<ThemeProvider>`, `<ThemeSwitch>`, `useTheme`
  - **Vendored shadcn primitives:** `Avatar`, `Badge`, `Button`, `Card`, `Dialog`, `DropdownMenu`, `Input`, `Popover`, `Progress`, `ScrollArea`, `Select`, `Separator`, `Sheet`, `Skeleton`, `Table`, `Tabs`, `Textarea`, `Toggle`, `ToggleGroup`, `Tooltip`
  - **Helpers:** `cn`

### Initial design direction

- Light canvas as default, dark mode opt-in via `[data-mode="dark"]`.
- Single accent: electric blue (`oklch(0.55 0.20 255)`).
- Polymarket-grammar discipline: charts always render in accent; direction lives in `<Delta>` chips only.

### Known limitations

- `@inferenceui/ui` ships as a single client-component bundle (`"use client"` banner). A future `/server` entry will split server-safe primitives (Numeric, Delta, etc.) once the library matures.
- Tailwind v4 consumers need an explicit `@source "../node_modules/@inferenceui/ui"` directive to pick up classes inside the package.
