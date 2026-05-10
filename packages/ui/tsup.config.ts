import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  // shadcn primitives + react peers stay external — consumers bring their own.
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
