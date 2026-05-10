// @inferenceui/ui — entry point.
//
// Migration status (2026-05-10): the workspace boundary is in place. The
// canonical component sources still live in the showcase app at the repo
// root (`components/iui/*`, `components/ui/*`, `lib/utils.ts`). Per the
// migration plan, the next focused session moves them under `src/` here:
//
//     components/iui/* → packages/ui/src/components/*
//     components/ui/*  → packages/ui/src/components/primitives/*
//     lib/utils.ts     → packages/ui/src/lib/utils.ts
//
// The showcase will then update its imports from `@/components/iui/*` to
// `@inferenceui/ui` via the workspace alias. See:
// `docs/plans/2026-05-10-library-export.md`.

export {};
