# 01 — What does Vite+ provide, and how does a TanStack Start project live inside it?

Type: research
Status: resolved

## Question

Vite+ is the chosen build tool and its built-in tooling replaces separate lint/format setup. Establish from primary sources (VoidZero / Vite+ docs and source):

- What Vite+ is and what it bundles: package manager, linter, formatter, test runner, task runner. Exact CLI names and current version.
- How to scaffold or adopt a TanStack Start + TypeScript project under Vite+. Any template, or steps to wrap an existing Vite config.
- What the built-in lint and format tooling is (Oxlint / Oxfmt or otherwise), how it is configured, and which rules ship by default. Whether custom rules or a plugin can enforce "no raw HTML elements in feature code" and "no string literals outside messages.json".
- How Husky fits: which Vite+ commands a pre-commit hook should run for lint, format and typecheck.
- Anything Vite+ does that conflicts with StyleX's compiler plugin or TanStack Start's Vite plugin.

Record findings in `docs/research/vite-plus.md`, each claim cited.

## Answer

Full findings: [docs/research/vite-plus.md](../../../docs/research/vite-plus.md).

- **What it is:** `vp` v0.3.0 (beta, MIT, 2026-08-24): one CLI over Vite 8 + Rolldown, Vitest, Oxlint, Oxfmt, tsgolint and Vite Task, and it manages Node and the package manager (defaults to pnpm). All config lives in `vite.config.ts` in `lint` / `fmt` / `check` / `staged` blocks beside ordinary Vite config.
- **Scaffold:** `vp create @tanstack/start` (runs `@tanstack/cli create --no-install --no-toolchain`), then `vp migrate` to pin `vite-plus`, alias `vite` to the Vite+ core, and rewrite scripts. TanStack Start's peer range is `vite >=7`; a Start app is in Vite+'s ecosystem CI.
- **Lint/format:** Oxlint + Oxfmt through `vp check` (format, lint, type-check in one pass; set `typeAware` and `typeCheck`). Defaults are the `correctness` category; the `react` plugin must be enabled. Rule 8 maps to `react/forbid-elements` scoped with `lint.overrides` to feature and route globs; rule 7 maps to `react/jsx-no-literals` with `noStrings: true`. String literals outside JSX need a small custom JS-plugin rule (ESLint-compatible API, alpha).
- **Husky conflict:** Vite+ ships its own hook dispatcher (`vp hooks enable`, `.vite-hooks/pre-commit` running `vp staged`). Both it and Husky set `core.hooksPath`, so they cannot coexist. Recommendation: drop Husky and use `vp staged`. If Husky is kept, its pre-commit runs `vp staged` and `vp config` must never run. **Decision deferred to the scaffold ticket.**
- **Plugin order:** no documented conflict with the TanStack Start or StyleX plugins; `stylex.vite()`, `tanstackStart()`, `viteReact()` satisfies both plugins' constraints.
- **Unconfirmed:** StyleX's official Vite 8 / Rolldown support and its behaviour in Start's SSR/prerender build; how Vite+ resolves relative `jsPlugins` paths; whether `vp staged` type-checks the whole program. Smoke-test in the StyleX and scaffold tickets.
