// @inferenceui/ui — public API surface.
//
// All components compose vendored shadcn primitives (./components/primitives)
// plus base-ui under the hood. Consumers can use the high-level iui composites
// (TileCard, HardwareThumb, MarketCard, …) and / or the primitives directly.

// ─── Surfaces ─────────────────────────────────────────────────────────────
export { TileCard } from "./components/tile-card";
export type { TileCardProps } from "./components/tile-card";

// ─── Hardware identity ────────────────────────────────────────────────────
export { HardwareThumb } from "./components/hardware-thumb";
export type { HardwareThumbProps, HardwareKind } from "./components/hardware-thumb";

// ─── Numerics ─────────────────────────────────────────────────────────────
export { Numeric } from "./components/numeric";
export type { NumericProps } from "./components/numeric";

export { Delta } from "./components/delta";
export type { DeltaProps } from "./components/delta";

// ─── Charts ───────────────────────────────────────────────────────────────
export { Sparkline } from "./components/sparkline";
export { PriceChart } from "./components/price-chart";
export type { Timeframe } from "./components/price-chart";
export { BenchmarkBar } from "./components/benchmark-bar";

// ─── Status ───────────────────────────────────────────────────────────────
export { StatusPill } from "./components/status-pill";
export type { StatusPillProps } from "./components/status-pill";

// ─── Chrome ───────────────────────────────────────────────────────────────
export { TopNav } from "./components/top-nav";
export type { TopNavProps } from "./components/top-nav";

export { SidebarNav } from "./components/sidebar-nav";
export { Toolbar } from "./components/toolbar";
export { ProfileChip } from "./components/profile-chip";
export { CoordStrip } from "./components/coord-strip";

// ─── Discovery + market surfaces ──────────────────────────────────────────
export { DiscoveryRow } from "./components/discovery-row";
export type { DiscoveryRowProps, DiscoveryRowMetric } from "./components/discovery-row";

export { InstrumentCard } from "./components/instrument-card";
export type { InstrumentCardProps } from "./components/instrument-card";

export { InstrumentHero } from "./components/instrument-hero";
export type { InstrumentHeroProps } from "./components/instrument-hero";

export { ProvidersTable } from "./components/providers-table";
export type { ProviderRow } from "./components/providers-table";

export { LaunchPanel } from "./components/launch-panel";
export type { LaunchPanelProps } from "./components/launch-panel";

export { DeployPanel } from "./components/deploy-panel";

export { FeaturedMarket } from "./components/featured-market";
export type { FeaturedMarketProps, MarketEventMarker } from "./components/featured-market";

export { CategoryNav } from "./components/category-nav";
export { TagPills } from "./components/tag-pills";
export { RankedRail } from "./components/ranked-rail";
export { CarouselDots } from "./components/carousel-dots";
export { TickerTape } from "./components/ticker-tape";
export { NewsItem } from "./components/news-item";
export { MetricCard } from "./components/metric-card";
export { Metric } from "./components/metric";
export { QuantityStepper } from "./components/quantity-stepper";
export { DataTable } from "./components/data-table";
export { CommandPalette } from "./components/command-palette";
export type { CommandItem } from "./components/command-palette";
export { WireframeGpu } from "./components/wireframe-gpu";
export { AdonaiDownloadCard } from "./components/adonai-download-card";

// ─── Theme ────────────────────────────────────────────────────────────────
export { ThemeProvider, themeBootstrapScript, useTheme } from "./components/theme-provider";
export type { Mode } from "./components/theme-provider";
export { ThemeSwitch } from "./components/theme-switch";

// ─── Vendored shadcn primitives ───────────────────────────────────────────
// Available under the same import path so consumers can compose at any layer.
export * from "./components/primitives/avatar";
export * from "./components/primitives/badge";
export * from "./components/primitives/button";
export * from "./components/primitives/card";
export * from "./components/primitives/dialog";
export * from "./components/primitives/dropdown-menu";
export * from "./components/primitives/input";
export * from "./components/primitives/popover";
export * from "./components/primitives/progress";
export * from "./components/primitives/scroll-area";
export * from "./components/primitives/select";
export * from "./components/primitives/separator";
export * from "./components/primitives/sheet";
export * from "./components/primitives/skeleton";
export * from "./components/primitives/table";
export * from "./components/primitives/tabs";
export * from "./components/primitives/textarea";
export * from "./components/primitives/toggle";
export * from "./components/primitives/toggle-group";
export * from "./components/primitives/tooltip";

// ─── Helpers ──────────────────────────────────────────────────────────────
export { cn } from "./lib/utils";
