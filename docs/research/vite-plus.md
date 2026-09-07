# Vite+ for a TanStack Start project

Ticket: `.scratch/landing-page/issues/01-vite-plus.md`. Researched 2026-09-05 against VoidZero, Oxc, TanStack, StyleX and Husky primary sources.

## Summary and recommendation

Vite+ (`vp`) is VoidZero's single CLI that wraps Vite 8 + Rolldown, Vitest, Oxlint, Oxfmt, tsdown and the Vite Task runner, and also manages the Node runtime and the package manager. Current release is **v0.3.0 (2026-08-24), beta**, bundling Vite 8.2.2, Rolldown 1.2.5, Vitest 4.1.11, Oxlint 1.79.0, Oxfmt 0.64.0 and `oxlint-tsgolint` 7.0.2001. All configuration lives in one `vite.config.ts` (`lint`, `fmt`, `check`, `staged`, `test` blocks next to ordinary Vite config).

Recommendation for Execil:

1. **Scaffold with `vp create @tanstack/start`**, which runs `@tanstack/cli create --no-install --no-toolchain`, then `vp migrate` the result (it pins `vite-plus`, aliases `vite` to `@voidzero-dev/vite-plus-core`, rewrites `defineConfig` to come from `vite-plus`, and offers hook setup). Alternatively scaffold with `npx @tanstack/cli@latest create --toolchain none` and run `vp migrate`; same end state.
2. **Use Vite+'s built-in lint/format** (Oxlint + Oxfmt) configured in the `lint` / `fmt` blocks with `typeAware: true, typeCheck: true`. `vp check` then formats, lints and type-checks in one pass.
3. **Rule 8 (no raw HTML in feature code)**: enable the `react` Oxlint plugin and use `react/forbid-elements` scoped with `lint.overrides` to `src/routes/**` and `src/features/**`, with base components exempt. **Rule 7 (all copy from `messages.json`)**: `react/jsx-no-literals` (native, Oxlint >= 1.70) with `noStrings: true`, same scoping. Anything beyond JSX (string literals in plain TS) needs a small local JS-plugin rule; Oxlint's JS-plugin API is ESLint-compatible but alpha.
4. **Drop Husky.** Vite+ ships its own hook dispatcher (`vp hooks enable` / `vp config`, `.vite-hooks/pre-commit` running `vp staged`, `staged` block in `vite.config.ts`). Husky and Vite+ both write `core.hooksPath`, so they cannot coexist; Vite+ also honours `HUSKY=0`. If Husky must stay, its `.husky/pre-commit` should run `vp staged` and the project must not run `vp config`/`vp hooks enable`.
5. **No documented conflict** between Vite+ and either `@tanstack/react-start/plugin/vite` or `@stylexjs/unplugin`. Plugin order that satisfies both plugins' documented constraints: `stylex.vite()`, `tanstackStart()`, `viteReact()`. TanStack Start is in Vite+'s ecosystem CI. StyleX's Vite 8 / Rolldown support is not stated in its docs (see "Not confirmed").

## 1. What Vite+ is and what it bundles

- Vite+ "is the unified toolchain and entry point for web development. It manages your runtime, package manager, and frontend toolchain in one place by combining Vite, Vitest, Oxlint, Oxfmt, Rolldown, tsdown, and Vite Task." It ships as `vp` (global CLI) plus `vite-plus` (local package per project). <https://viteplus.dev/guide>
- Beta announced 2026-07-02: "Vite+ is stable, but not yet complete"; MIT licensed. <https://voidzero.dev/posts/announcing-vite-plus-beta>. The troubleshooting page repeats "Vite+ is in beta: stable, but not yet complete." <https://viteplus.dev/guide/troubleshooting>
- **Version**: latest GitHub release `v0.3.0`, published 2026-08-24; npm `vite-plus@0.3.0` (`latest` tag). <https://github.com/voidzero-dev/vite-plus/releases/tag/v0.3.0>, <https://registry.npmjs.org/vite-plus>
- **Bundled tool versions in 0.3.0** (from the release notes' toolchain upgrade and the package's pinned deps): `vite` 8.2.2, `rolldown` 1.2.5, `vitest` 4.1.11, `oxlint` =1.79.0, `oxfmt` =0.64.0, `@oxlint/plugins` =1.79.0, `oxlint-tsgolint` =7.0.2001, `@voidzero-dev/vite-plus-core` 0.3.0. <https://github.com/voidzero-dev/vite-plus/releases/tag/v0.3.0>, <https://registry.npmjs.org/vite-plus/latest>
- **Install**: `curl -fsSL https://vite.plus | bash` (macOS/Linux). Vite+ manages the global Node runtime and package manager; opt out with `vp env off`. <https://viteplus.dev/guide>
- **Exact CLI command names** (all `vp <cmd>`; `vpr` = `vp run`, `vpx` = global runner):
  - Start: `vp create`, `vp migrate`, `vp config`, `vp hooks` (`enable|disable|status`), `vp staged`, `vp install`, `vp env`
  - Develop: `vp dev`, `vp check`, `vp lint`, `vp fmt`, `vp test`
  - Execute: `vp run`, `vp exec`, `vp node`, `vp dlx`, `vp cache clean`, `vpx`
  - Build: `vp build`, `vp pack`, `vp preview`
  - Dependencies: `vp add|remove|update|dedupe|outdated|list|why|info|link|unlink|rebuild`, `vp pm <command>`
  - Maintain: `vp toolchain`, `vp upgrade`, `vp implode`
  <https://viteplus.dev/guide>
- Built-in commands cannot be overridden by `package.json` scripts: `vp dev`/`vp build`/`vp test` always run the built-ins; `vp run dev` etc. run the scripts. <https://viteplus.dev/guide/troubleshooting>
- **Package manager**: Vite+ wraps pnpm, npm, Yarn and Bun (`vp install`, `vp add`, ...). Detection order starts with `packageManager` in `package.json`, then `devEngines.packageManager`, then lockfiles; with none present it "falls back to `pnpm` by default" and downloads the matching package manager. <https://viteplus.dev/guide/install>
- **Linter/formatter**: `vp lint` is Oxlint, `vp fmt` is Oxfmt, `vp check` is both plus type checks via tsgolint. <https://viteplus.dev/guide/check>, <https://viteplus.dev/guide/lint>, <https://viteplus.dev/guide/fmt>
- **Test runner**: `vp test` is Vitest, re-exported as `vite-plus/test`; unlike bare Vitest it does not stay in watch mode by default. <https://viteplus.dev/guide/test> (Rule 12 says no automated tests for v1, so this is unused.)
- **Task runner**: `vp run` runs `package.json` scripts and `run.tasks` from `vite.config.ts` "with caching, dependency ordering, and workspace-aware execution built in." <https://viteplus.dev/guide/run>
- **Build**: `vp build` "runs the standard Vite production build through Vite+ ... Vite+ uses Vite 8 and Rolldown for builds." Standard Vite `plugins`, `build`, `preview` config apply. <https://viteplus.dev/guide/build>, <https://viteplus.dev/config/build>
- **Config surface**: one `vite.config.ts` with `import { defineConfig } from 'vite-plus'` and blocks `server`, `build`, `preview`, `create`, `run`, `fmt`, `lint`, `check`, `test`, `pack`, `staged`, `defaultPackage`. <https://viteplus.dev/config>

## 2. Scaffolding / adopting TanStack Start + TypeScript under Vite+

### Option A: `vp create @tanstack/start`

- `@tanstack/start` is a recognised shorthand for `vp create`. Options include `--package-manager <pnpm|npm|yarn|bun>`, `--git`/`--no-git`, `--hooks`/`--no-hooks` (pre-commit dispatcher + `.vite-hooks` + `staged` config), `--agent`, `--editor`, `--no-interactive`; arguments after `--` go to the underlying template. <https://viteplus.dev/guide/create>
- Since PR #1259 (merged 2026-04-02) the shorthand expands to `@tanstack/cli` and runs `@tanstack/cli create` with `--no-install --no-toolchain` appended (and `--no-git` inside a monorepo). Source: `packages/cli/src/create/discovery.ts` ("`@tanstack/start` → `@tanstack/cli` (@tanstack/create-start is deprecated)") and `packages/cli/src/create/templates/remote.ts` (`autoFixRemoteTemplateCommand`). <https://github.com/voidzero-dev/vite-plus/pull/1259>, <https://github.com/voidzero-dev/vite-plus/blob/main/packages/cli/src/create/discovery.ts>, <https://github.com/voidzero-dev/vite-plus/blob/main/packages/cli/src/create/templates/remote.ts>
- TanStack CLI `create` flags: `--template`, `--add-ons`, `--package-manager`, `--framework React|Solid`, `--target-dir`, `--toolchain <id>` ("use `--list-add-ons` to see options"), `--no-install`, `--no-git`, `--tailwind`/`--no-tailwind`. <https://tanstack.com/cli/latest/docs/cli-reference>
- Because `--no-toolchain` is forced, the scaffold arrives without ESLint/Prettier/Biome, which is what we want: Vite+ supplies lint and format.

### Option B: scaffold with TanStack, then `vp migrate`

- TanStack's documented starting points: TanStack Builder, `npx @tanstack/cli@latest create`, or cloning an example. <https://tanstack.com/start/latest/docs/framework/react/quick-start>
- Minimal hand-built TanStack Start project (what any scaffold reduces to): deps `@tanstack/react-start`, `@tanstack/react-router`, `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `typescript`, `@types/*`; `vite.config.ts` with `resolve: { tsconfigPaths: true }` and `plugins: [tanstackStart(), viteReact()]` ("react's vite plugin must come after start's vite plugin"); tsconfig `jsx: react-jsx`, `moduleResolution: Bundler`, `module: ESNext`, `target: ES2022`, `strictNullChecks: true`; files `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, generated `routeTree.gen.ts`. <https://tanstack.com/start/latest/docs/framework/react/build-from-scratch>
- `@tanstack/react-start@1.168.49` declares `peerDependencies.vite: ">=7.0.0"`, so Vite 8 (what Vite+ ships) is in range. <https://registry.npmjs.org/@tanstack/react-start/latest>

### What `vp migrate` does to a Vite project

- Prerequisites: Vite 8+ and Vitest 4.1+. Flow: updates dependencies, rewrites imports where needed, merges tool-specific config into `vite.config.ts`, updates scripts to `vp` commands, can set up commit hooks, formats the project. "Most projects will require further manual adjustments." <https://viteplus.dev/guide/migrate>
- Dependency rules: adds `vite-plus` pinned to the CLI version; keeps `vite` declarations and points them at the core alias; removes `vitest` in the common case. Manual equivalent: `vp install -D vite-plus` plus package-manager overrides `"vite": "npm:@voidzero-dev/vite-plus-core@latest"` and a `vitest` pin (`4.1.11` for 0.3.0). <https://viteplus.dev/guide/migrate>, <https://viteplus.dev/guide/migrate-rules>
- Source rewrites: `vite` imports are rewritten to `vite-plus` **only in config entry files** (`vite.config.*`); every other file keeps `import ... from 'vite'`, which "still resolves through the `@voidzero-dev/vite-plus-core` alias." Plugin packages are never rewritten. So `@tanstack/react-start/plugin/vite` and `@stylexjs/unplugin` importing `vite` are expected. <https://viteplus.dev/guide/migrate-rules>
- Script rewrites: `vite` -> `vp dev`/matching subcommand, `vitest` -> `vp test`, `oxlint` -> `vp lint`, `oxfmt` -> `vp fmt`, `lint-staged` -> `vp staged`, `eslint`/`prettier` -> `vp lint`/`vp fmt` when their optional migration runs. <https://viteplus.dev/guide/migrate-rules>
- After migration: `vp install`, `vp check`, `vp test`, `vp build`. <https://viteplus.dev/guide/migrate>

### Resulting config sketch (derived from the cited docs)

```ts
// vite.config.ts
import { defineConfig } from 'vite-plus';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    stylex.vite({ useCSSLayers: true }), // StyleX: before the React plugin
    tanstackStart({ prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true } }),
    viteReact(), // TanStack: after tanstackStart()
  ],
  lint: { plugins: ['typescript', 'react'], options: { typeAware: true, typeCheck: true }, /* rules, overrides: see section 3 */ },
  fmt: { singleQuote: true },
  staged: { '*.{ts,tsx,css,json,md}': 'vp check --fix' },
});
```

- Static prerendering is a `tanstackStart({ prerender: { ... } })` option: `enabled`, `autoSubfolderIndex`, `autoStaticPathsDiscovery`, `crawlLinks` (default `true`), `filter`, `failOnError`, plus per-route `pages: [{ path, prerender: { enabled, outputPath } }]`; described as "useful for deploying static sites to platforms that do not support server-side rendering." <https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering>
- `vp build` runs that same Vite build, so prerendering happens under `vp build` with no extra step. <https://viteplus.dev/guide/build>
- Vite+'s ecosystem CI builds and tests a TanStack Start app (`tanstack-start-helloworld`: `vp run test`, `vp run build`, Node 24). <https://github.com/voidzero-dev/vite-plus/blob/main/.github/workflows/e2e-test.yml>, <https://github.com/fengmk2/tanstack-start-helloworld>

## 3. Built-in lint and format tooling

### What it is and how it is configured

- Lint = Oxlint, "a fast replacement for ESLint ... ships with built-in support for core ESLint rules and many popular community rules." Config goes in the `lint` block of `vite.config.ts`; "We do not recommend using `oxlint.config.ts` or `.oxlintrc.json` with Vite+." <https://viteplus.dev/guide/lint>
- Format = Oxfmt, "full Prettier compatibility ... drop-in replacement for Prettier." Config goes in the `fmt` block; `.oxfmtrc.json` not recommended. Editors: set `"oxc.fmt.disableNestedConfig": true`. <https://viteplus.dev/guide/fmt>
- Oxfmt formats JS/JSX/TS/TSX, JSON, JSONC, YAML, TOML, HTML, CSS/SCSS/Less, Markdown, MDX, GraphQL and more; it passes 100% of Prettier's JS/TS conformance tests and has built-in import sorting and `package.json` sorting. <https://oxc.rs/docs/guide/usage/formatter>
- `fmt` block accepts Oxfmt options such as `ignorePatterns`, `singleQuote`, `semi`, `sortPackageJson`. <https://viteplus.dev/config/fmt>
- `lint` block accepts Oxlint config: `ignorePatterns`, `plugins`, `options.typeAware`, `options.typeCheck`, `rules`, `overrides` (with `files`, `plugins`, `rules`, `env`); override `plugins` merge with the base list. <https://viteplus.dev/config/lint>, <https://viteplus.dev/guide/monorepo>
- `vp check` = Oxfmt + Oxlint + type checks via tsgolint (TypeScript Go). `vp create` and `vp migrate` enable `typeAware` and `typeCheck` by default. Flags: `--fix`, `--no-fmt`, `--no-lint`. A `check` block can disable a step by default. <https://viteplus.dev/guide/check>, <https://viteplus.dev/config/check>
- tsgolint does not support `compilerOptions.baseUrl`; if present, Vite+ skips `typeAware`/`typeCheck` unless the `ts5to6 --fixBaseUrl` fix runs. TanStack's documented tsconfig uses `paths` via `resolve.tsconfigPaths`, not `baseUrl`. <https://viteplus.dev/guide/troubleshooting>, <https://tanstack.com/start/latest/docs/framework/react/build-from-scratch>
- In Oxlint itself `options.typeCheck` is marked experimental; type-aware linting covers 59 of 61 typescript-eslint type-aware rules. <https://oxc.rs/docs/guide/usage/linter/config>, <https://oxc.rs/docs/guide/usage/linter/type-aware>

### Which rules ship by default

- Oxlint default: rules in the `correctness` category, from the default plugins `eslint`, `typescript`, `unicorn`, `oxc`. Other categories: `suspicious`, `pedantic`, `perf`, `style`, `restriction`, `nursery`. Setting `plugins` **replaces** the default set. <https://oxc.rs/docs/guide/usage/linter/config>, <https://oxc.rs/docs/guide/usage/linter/plugins>
- The `react` plugin (eslint-plugin-react, react-hooks, react-refresh, React Compiler rules) is **not** on by default and must be listed in `lint.plugins`. <https://oxc.rs/docs/guide/usage/linter/plugins>
- Vite+ adds its own JS plugin `vite-plus/oxlint-plugin` and the rule `vite-plus/prefer-vite-plus-imports: 'error'` to every lint config (`ensureVitePlusImportRuleDefaults`), and `typeAware`/`typeCheck: true` when scaffolding. <https://github.com/voidzero-dev/vite-plus/blob/main/packages/cli/src/oxlint-plugin-config.ts>

### Enforcing "no raw HTML elements in feature code" (rule 8)

- Native rule `react/forbid-elements`: "Allows you to configure a list of forbidden elements and to specify their desired replacements", options `forbid: (string | { element, message })[]`, matches both JSX and `React.createElement`. Added in Oxlint v0.16.11. <https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-elements>
- It needs an explicit element list (no wildcard documented), so list the HTML tags the site uses (`div`, `span`, `section`, `h1`..`h6`, `p`, `a`, `button`, `input`, `form`, `ul`, `li`, `img`, `table`, ...). Scope it with `lint.overrides` to `src/routes/**` and `src/features/**` so base components (which must render semantic tags, rule 9) are exempt:

```ts
lint: {
  plugins: ['typescript', 'react'],
  overrides: [{
    files: ['src/routes/**', 'src/features/**'],
    rules: {
      'react/forbid-elements': ['error', { forbid: [
        { element: 'div', message: 'Use a base component' }, 'span', 'section', 'p', 'a', 'button', /* ... */
      ] }],
    },
  }],
}
```

- A wildcard version ("any lowercase JSX tag") is a ~15-line custom rule via Oxlint JS plugins (below), if the explicit list proves leaky.

### Enforcing "no string literals outside messages.json" (rule 7)

- Native rule `react/jsx-no-literals` (added Oxlint v1.70.0; Vite+ 0.3.0 bundles 1.79.0): "Disallows usage of unwrapped string literals inside JSX, such as text children of a JSX element or string-valued props." Options: `noStrings` (also forbid wrapped `{"..."}`), `noAttributeStrings`, `restrictedAttributes`, `allowedStrings`, `ignoreProps`, `elementOverrides`. <https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-literals>
- With `noStrings: true` and `noAttributeStrings: true` (allowing non-copy attributes via `elementOverrides`/`allowedStrings`), JSX copy can only come from an identifier or call, i.e. from the `messages.json` accessor. Apply through the same `overrides` block.
- Gap: the rule only sees JSX. String literals assigned in plain TS (`const title = 'Hello'`) or passed to non-JSX APIs are not covered; a custom rule is required for that.

### Custom rules via JS plugins

- "Oxlint supports plugins written in JS - either custom-written, or from npm. Oxlint's plugin API is compatible with ESLint v9+". Declared under `jsPlugins` (path or package specifier, "resolved relative to the config file"), rules referenced as `<plugin-name>/<rule>`. **JS plugins are in alpha and not subject to semver.** <https://oxc.rs/docs/guide/usage/linter/js-plugins>
- Writing one: an ESLint-style `{ meta: { name }, rules: { x: { create(context) { return { JSXOpeningElement(node) { ... context.report(...) } } } } } }` object; optional faster `createOnce` API via `eslintCompatPlugin` from `@oxlint/plugins` (bundled by `vite-plus`). <https://oxc.rs/docs/guide/usage/linter/writing-js-plugins>, <https://registry.npmjs.org/vite-plus/latest>
- Vite+'s lint guide points at both JS plugin pages ("JS Plugins also enable writing your own custom rules for Oxlint"), and Vite+'s own migration code reads and writes `lint.jsPlugins` in `vite.config.ts`. <https://viteplus.dev/guide/lint>, <https://github.com/voidzero-dev/vite-plus/blob/main/packages/cli/src/migration/migrator/eslint.ts>
- Existing ESLint plugins can be loaded the same way (e.g. `@stylexjs/eslint-plugin`, or an i18n literal-string plugin), but reserved names (`react`, `import`, ...) need an alias. <https://oxc.rs/docs/guide/usage/linter/config>

## 4. How Husky fits

### What Vite+ provides on its own

- "Vite+ supports commit hooks and staged-file checks without additional tooling": `vp hooks enable|disable|status` manage a generated dispatcher under `.vite-hooks/_` and set `core.hooksPath`; `vp config` installs the dispatcher (and agent files); `vp staged` runs the `staged` block from `vite.config.ts` against staged files. Project-owned `.vite-hooks/pre-commit` (committed) contains just `vp staged`. `vp create --hooks` / `vp migrate --hooks` scaffold all of this. <https://viteplus.dev/guide/commit-hooks>
- Default staged config, "should replace separate `lint-staged` configuration in most projects": `staged: { '*.{js,ts,tsx,vue,svelte}': 'vp check --fix' }`. <https://viteplus.dev/guide/commit-hooks>, <https://viteplus.dev/config/staged>
- Hooks can be skipped with `VP_GIT_HOOKS=0`; "`HUSKY=0` is honored the same way for ecosystem tooling compatibility", and the hooks source `~/.config/vite-plus/hooks-init.sh` or, as a fallback, `~/.config/husky/init.sh`. <https://viteplus.dev/guide/commit-hooks>
- Because `vp check` honours the `check` block, a pre-commit that calls `vp check` skips any step disabled there. <https://viteplus.dev/config/check>

### Husky facts

- Husky 9.1.7 is current on npm. `husky init` writes `prepare: "husky"` into `package.json` and `.husky/pre-commit` containing `<pm> test`; hooks are plain shell scripts. <https://registry.npmjs.org/husky/latest>, <https://typicode.github.io/husky/get-started.html>
- Husky's `index.js` runs `git config core.hooksPath <dir>/_` (default `.husky/_`) on every `husky` invocation and exits early when `HUSKY=0`. <https://github.com/typicode/husky/blob/main/index.js>, <https://github.com/typicode/husky/blob/main/bin.js>
- `vp migrate` "does not automatically convert Husky setups. When Husky is detected, Vite+ leaves its hooks, lifecycle scripts, configuration, and dependencies unchanged and shows a warning." Manual path: move staged commands into the `staged` block, make the lifecycle script run `vp config`, create `.vite-hooks/pre-commit` running `vp staged`, `vp hooks enable`, then remove the old tool. <https://viteplus.dev/guide/migrate>

### Conclusion

- Husky and the Vite+ dispatcher both own `core.hooksPath`; whichever `prepare` step runs last wins and the other's hooks silently stop firing. Pick one.
- Preferred: no Husky. `prepare: "vp config"` (or rely on `vp create --hooks`), `.vite-hooks/pre-commit` = `vp staged`, and `staged: { '*.{ts,tsx,css,json,md}': 'vp check --fix' }`. That runs format (Oxfmt), lint (Oxlint) and type-check (tsgolint, when `typeCheck: true`) in one command on staged files, with autofixes applied.
- If Husky is kept anyway (the map lists it): `prepare: "husky"`, `.husky/pre-commit` = `vp staged` (or `vp check --fix`), and never run `vp config`/`vp hooks enable` in the repo. Commands are the same; only the dispatcher differs.
- Full-project type check on commit, if wanted beyond the staged subset: add `vp check --no-fmt --no-lint` (type-check only) to the hook, or `vp exec tsc --noEmit`. <https://viteplus.dev/guide/check>, <https://viteplus.dev/guide/vpx>

## 5. Conflicts with StyleX's compiler plugin or TanStack Start's Vite plugin

- **TanStack Start**: no conflict found. `vp build`/`vp dev` are the standard Vite 8 build/dev server with normal `plugins`; `@tanstack/react-start` accepts `vite >=7`; the `vite` specifier that the plugin imports resolves through the `@voidzero-dev/vite-plus-core` alias by design; and a TanStack Start app is part of Vite+'s ecosystem CI. Constraint to keep: `viteReact()` after `tanstackStart()`. <https://viteplus.dev/guide/build>, <https://viteplus.dev/guide/migrate-rules>, <https://registry.npmjs.org/@tanstack/react-start/latest>, <https://github.com/voidzero-dev/vite-plus/blob/main/.github/workflows/e2e-test.yml>, <https://tanstack.com/start/latest/docs/framework/react/build-from-scratch>
- **Built-in command shadowing**: TanStack scaffolds put `"dev": "vite dev"`, `"build": "vite build"` in scripts; under Vite+ `vp dev`/`vp build` always run the built-ins and `vp run dev`/`vp run build` run the scripts, so both paths do the same thing after `vp migrate` rewrites the scripts. Not a conflict, just something to know. <https://viteplus.dev/guide/troubleshooting>
- **StyleX**: the official Vite integration is `@stylexjs/unplugin` (0.19.0), used as `stylex.vite({ useCSSLayers: true })` and placed **before** `@vitejs/plugin-react` "to preserve Fast Refresh"; a CSS file must be imported from the app root so Vite emits an asset that StyleX appends to at build time. Vite-specific options: `devMode: 'full' | 'css-only' | 'off'`, `devPersistToDisk`, `treeshakeCompensation` (default true for Vite/Rollup). Supported bundlers listed: Vite, Rollup, Webpack, Rspack, esbuild, Bun. <https://stylexjs.com/docs/learn/installation/vite/vite-react/>, <https://stylexjs.com/docs/api/configuration/unplugin>, <https://registry.npmjs.org/@stylexjs/unplugin/latest>
- Ordering `stylex.vite()`, `tanstackStart()`, `viteReact()` satisfies both documented constraints (StyleX before React; React after Start).
- The unplugin's dependencies include `lightningcss` and `@babel/core` (it is a Babel transform), which is input for the StyleX ticket's LightningCSS question. <https://registry.npmjs.org/@stylexjs/unplugin/latest>
- Known StyleX/Vite 8 report: issue #1562 (unplugin 0.18.2 on Vite 8.0.1) is specific to `.vue` files under `@vitejs/plugin-vue` in dev; the reporter states production builds work and React/TSX is not affected. Open at time of research. <https://github.com/facebook/stylex/issues/1562>
- **Oxlint vs StyleX lint**: StyleX ships `@stylexjs/eslint-plugin`; if its rules are wanted they must be loaded via Oxlint `jsPlugins` (alpha). <https://stylexjs.com/docs/api/configuration/eslint-plugin>, <https://oxc.rs/docs/guide/usage/linter/js-plugins>

## Not confirmed from a primary source

- Whether `@stylexjs/unplugin` officially supports Vite 8 / Rolldown: the StyleX docs list "Vite" without a version and do not mention Rolldown; the only Vite 8 evidence is the community issue above. Needs a local smoke test (`vp dev` and `vp build` with prerender) before the StyleX ticket closes.
- Whether the StyleX transform runs correctly in TanStack Start's SSR/prerender environment (server bundle plus client bundle). Not documented by either project.
- How `lint.jsPlugins` paths in `vite.config.ts` are resolved by Vite+ (Oxlint says "relative to the config file"; Vite+ passes the block through, but the exact base directory is not documented). Use a package-style specifier or verify with `vp lint`.
- Exact rule count in the default `correctness` set: the Oxlint rules page renders the number dynamically and the text export shows placeholders.
- `vp create --list` output and the interactive prompts were read from source and CLI snapshots, not executed here (`vp` is not installed on this machine).
- Whether `vp staged` with `typeCheck: true` type-checks only staged files or the whole program; the docs do not say.

## Sources

- Vite+ docs: <https://viteplus.dev/guide>, <https://viteplus.dev/guide/create>, <https://viteplus.dev/guide/migrate>, <https://viteplus.dev/guide/migrate-rules>, <https://viteplus.dev/guide/install>, <https://viteplus.dev/guide/check>, <https://viteplus.dev/guide/lint>, <https://viteplus.dev/guide/fmt>, <https://viteplus.dev/guide/test>, <https://viteplus.dev/guide/run>, <https://viteplus.dev/guide/build>, <https://viteplus.dev/guide/commit-hooks>, <https://viteplus.dev/guide/monorepo>, <https://viteplus.dev/guide/troubleshooting>, <https://viteplus.dev/config>, <https://viteplus.dev/config/lint>, <https://viteplus.dev/config/fmt>, <https://viteplus.dev/config/check>, <https://viteplus.dev/config/staged>, <https://viteplus.dev/llms-full.txt>
- Vite+ repo: <https://github.com/voidzero-dev/vite-plus/releases/tag/v0.3.0>, <https://github.com/voidzero-dev/vite-plus/pull/1259>, <https://github.com/voidzero-dev/vite-plus/issues/1238>, `packages/cli/src/create/discovery.ts`, `packages/cli/src/create/templates/remote.ts`, `packages/cli/src/oxlint-plugin-config.ts`, `.github/workflows/e2e-test.yml`
- VoidZero: <https://voidzero.dev/posts/announcing-vite-plus-beta>
- npm: <https://registry.npmjs.org/vite-plus/latest>, <https://registry.npmjs.org/@tanstack/react-start/latest>, <https://registry.npmjs.org/@stylexjs/unplugin/latest>, <https://registry.npmjs.org/husky/latest>
- Oxc: <https://oxc.rs/docs/guide/usage/linter/config>, <https://oxc.rs/docs/guide/usage/linter/plugins>, <https://oxc.rs/docs/guide/usage/linter/js-plugins>, <https://oxc.rs/docs/guide/usage/linter/writing-js-plugins>, <https://oxc.rs/docs/guide/usage/linter/type-aware>, <https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-elements>, <https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-literals>, <https://oxc.rs/docs/guide/usage/formatter>
- TanStack: <https://tanstack.com/start/latest/docs/framework/react/quick-start>, <https://tanstack.com/start/latest/docs/framework/react/build-from-scratch>, <https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering>, <https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode>, <https://tanstack.com/cli/latest/docs/cli-reference>
- StyleX: <https://stylexjs.com/docs/learn/installation/vite/vite-react/>, <https://stylexjs.com/docs/api/configuration/unplugin>, <https://github.com/facebook/stylex/issues/1562>
- Husky: <https://typicode.github.io/husky/get-started.html>, <https://typicode.github.io/husky/how-to.html>, <https://github.com/typicode/husky/blob/main/index.js>, <https://github.com/typicode/husky/blob/main/bin.js>
