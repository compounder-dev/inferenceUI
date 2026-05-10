import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  // Force a client-component boundary for the whole barrel — every iui
  // composite either uses hooks or composes a primitive that does. Server
  // components in consumers should import from a future `/server` entry
  // (Numeric, Delta, etc.) once we split the bundle. For 0.1.0 the whole
  // package is client-only, which matches the Polymarket / shadcn pattern.
  banner: { js: '"use client";' },
  external: [
    "react",
    "react-dom",
    "next",
    "next/image",
    "@base-ui/react",
    "lucide-react",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
});
