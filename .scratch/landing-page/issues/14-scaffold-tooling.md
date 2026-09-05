# 14 — What is the project scaffold, and what runs on commit?

Type: grilling
Status: open
Blocked by: 01, 02, 03

## Question

Decide the repository shape and tooling wiring:

- Scaffold steps under Vite+ for TanStack Start + TypeScript + StyleX, and the Vite config with the StyleX plugin, prerender settings and the Cloudflare target.
- Directory conventions: `src/base`, `src/features`, `src/routes`, `src/messages`, `src/design-system`, `docs`.
- TypeScript strictness and path aliases.
- Git hooks: the Vite+ research found Husky and Vite+'s own hook dispatcher (`vp hooks enable`, `vp staged`) both set `core.hooksPath` and cannot coexist. Decide: drop Husky for `vp staged` (research recommendation), or keep Husky with `.husky/pre-commit` running `vp staged` and never running `vp config`. Then which lint, format and typecheck commands run pre-commit, and whether a pre-push build runs.
- The env/config layer that lets the app run with no Cloudflare, Workspace, PostHog or Turnstile accounts.

Produce the scaffold plan as the resolution.
