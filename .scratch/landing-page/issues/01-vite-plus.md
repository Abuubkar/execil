# 01 — What does Vite+ provide, and how does a TanStack Start project live inside it?

Type: research
Status: claimed

## Question

Vite+ is the chosen build tool and its built-in tooling replaces separate lint/format setup. Establish from primary sources (VoidZero / Vite+ docs and source):

- What Vite+ is and what it bundles: package manager, linter, formatter, test runner, task runner. Exact CLI names and current version.
- How to scaffold or adopt a TanStack Start + TypeScript project under Vite+. Any template, or steps to wrap an existing Vite config.
- What the built-in lint and format tooling is (Oxlint / Oxfmt or otherwise), how it is configured, and which rules ship by default. Whether custom rules or a plugin can enforce "no raw HTML elements in feature code" and "no string literals outside messages.json".
- How Husky fits: which Vite+ commands a pre-commit hook should run for lint, format and typecheck.
- Anything Vite+ does that conflicts with StyleX's compiler plugin or TanStack Start's Vite plugin.

Record findings in `docs/research/vite-plus.md`, each claim cited.
