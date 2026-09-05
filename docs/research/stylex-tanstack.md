# StyleX in TanStack Start on Vite, and whether LightningCSS earns a place

Research for ticket `02-stylex-tanstack`. Investigated 2026-09-05 against primary sources only (stylexjs.com, facebook/stylex, HorusGoul/vite-plugin-stylex, tanstack.com and TanStack/router, vite.dev and vitejs/vite, lightningcss.dev, viteplus.dev, the npm registry).

Versions at time of writing (npm `latest`): `@stylexjs/stylex` / `@stylexjs/unplugin` / `@stylexjs/babel-plugin` / `@stylexjs/rollup-plugin` / `@stylexjs/postcss-plugin` **0.19.0** (2026-06-16); `vite-plugin-stylex` **0.13.0** (2024-11-06, peer `vite ^5.2.7`, `@stylexjs/stylex ^0.9.3`); `vite` **8.2.2** (depends on `lightningcss ^1.33.0`); `lightningcss` **1.33.0**; `@tanstack/react-start` **1.168.49** (peer `vite >=7.0.0`, `react >=18 || >=19`); `@vitejs/plugin-react` **6.1.1** (peer `vite ^8.0.0`); `vite-plus` **0.3.0**. Source: `https://registry.npmjs.org/<package>`.

## Summary and recommendation

1. **Use `@stylexjs/unplugin` (`stylex.vite()`), pinned to the `@stylexjs/stylex` version.** It is the plugin the StyleX team ships in the facebook/stylex monorepo, it is the only Vite integration the StyleX docs describe, and it is the only one whose design covers multi-environment builds (client + SSR), which is what TanStack Start produces. `vite-plugin-stylex` is unofficial, last published in November 2024 against Vite 5 and StyleX 0.9, and should not be used. The Babel and Rollup plugins still exist but the docs no longer list the Rollup plugin, and the Babel plugin alone does not emit a stylesheet.
2. **Plugin order:** `[stylex.vite(), tanstackStart({ prerender: { enabled: true } }), viteReact()]`. StyleX requires its plugin before `@vitejs/plugin-react`; TanStack requires the React plugin after `tanstackStart()`. This ordering satisfies both. Neither project documents this specific combination; treat it as the first thing the build ticket verifies.
3. **Ship the CSS through a side-effect import** (`import './app.css'` in `__root.tsx`), not the `?url` pattern. The unplugin appends StyleX CSS to the emitted CSS asset during Vite's `generateBundle` and re-hashes it; TanStack Start's manifest plugin captures the client bundle in a later (`enforce: 'post'`) `generateBundle` hook, so the prerendered HTML's `<link rel="stylesheet">` from `HeadContent` points at the appended file. The `?url` path bakes the stylesheet URL into the server bundle, which the unplugin does not rewrite; I could not confirm from a primary source that it survives the re-hash, so avoid it. Optionally turn on `server.build.inlineCss` to inline the stylesheet into the prerendered HTML.
4. **LightningCSS: no as a separate decision, yes as what is already there.** Vite 8 already minifies CSS with LightningCSS by default, and the unplugin already runs LightningCSS over the StyleX output (vendor prefixes and syntax lowering against browserslist). The only wiring needed is a `browserslist` field in `package.json` (both consumers read it) and `lightningcssOptions: { minify: true }` on the unplugin, because the appended StyleX CSS bypasses Vite's minifier. Do not switch `css.transformer` to `'lightningcss'`: it is still marked experimental in Vite 8.2 and there is nothing in this project's hand-written CSS that needs it.
5. **Pitfalls to design around:** StyleX cannot express descendant or arbitrary selectors (use `stylex.when.*`), `@container` ordering is a known open bug, media query + pseudo-class combinations have an open bug, dynamic styles must be top-level object-literal arrow functions, and the `sx` prop only works on lowercase host elements, so base components must accept a `style?: StyleXStyles<...>` prop and spread `stylex.props()` themselves. React 19 is what StyleX's own examples run on; I found no React 19-specific issue in the tracker.

## 1. Ways to run the StyleX compiler in a Vite project

### `@stylexjs/unplugin` (official, recommended)

- Lives in the facebook/stylex monorepo at `packages/@stylexjs/unplugin` alongside `babel-plugin`, `rollup-plugin`, `postcss-plugin`, `stylex`, etc. Source: https://github.com/facebook/stylex/tree/main/packages/@stylexjs (directory listing via the GitHub API).
- Introduced in StyleX 0.17.0 (2025-11-18) as a "unplugin bundler plugin" for multiple bundlers. Source: https://github.com/facebook/stylex/releases (tag 0.17.0). The 0.12.0 blog post had said the Rollup plugin "may be generalized into an unplugin package"; 0.17 did that. Source: https://stylexjs.com/blog/v0.12.0, https://stylexjs.com/blog/v0.17.1.
- The StyleX docs' Vite page says: "`@stylexjs/unplugin` integrates directly with Vite to compile StyleX code, aggregate the generated CSS, and append it to the CSS assets Vite emits." No other Vite plugin is mentioned. Source: https://stylexjs.com/docs/learn/installation/vite
- The API reference lists exactly four configuration packages: `babel-plugin`, `eslint-plugin`, `unplugin`, `postcss-plugin`. The Rollup plugin page (`/docs/api/configuration/rollup-plugin`) returns 404. Source: https://stylexjs.com/docs/api/
- The 2026 roadmap says examples "should be updated to use the unplugin whenever possible." Source: https://stylexjs.com/blog/a-new-year-2026
- Entry points: `@stylexjs/unplugin/vite`, `/webpack`, `/esbuild`, `/bun`; there are also `rolldown`, `rspack`, `farm`, `unloader` adapters in `src/`. Source: README and `src/` listing at https://github.com/facebook/stylex/tree/main/packages/@stylexjs/unplugin
- Options (README and https://stylexjs.com/docs/api/configuration/unplugin): `dev`, `importSources` (default `['stylex', '@stylexjs/stylex']`), `useCSSLayers` (boolean or `{before, after, prefix}`), `babelConfig`, `unstable_moduleResolution` (defaults to `{ type: 'commonJS', rootDir: process.cwd() }` in `core.js`), `lightningcssOptions`, `cssInjectionTarget`, `externalPackages`, `devMode: 'full' | 'css-only' | 'off'` (Vite only), `devPersistToDisk`, `treeshakeCompensation` (defaults true for Vite/Rollup/Rolldown), `sxPropName`, `enableLTRRTLComments`.
- Dependencies of 0.19.0: `@babel/core`, `@stylexjs/babel-plugin 0.19.0`, `browserslist ^4.24`, `lightningcss ^1.29.1`; peer `unplugin ^2.3.11`. So it *is* the Babel plugin, wrapped, plus LightningCSS post-processing. Source: npm registry.
- Plugin order: "Keep the StyleX plugin before `@vitejs/plugin-react` to preserve Fast Refresh." Source: https://stylexjs.com/docs/learn/installation/vite/vite-react/
- SSR/multi-output: "With multiple outputs (e.g. client/SSR), each output gets its own aggregated StyleX CSS." Source: unplugin README. `core.js` keeps a `globalThis.__stylex_unplugin_store` so Vite dev can "aggregate across environments (client/ssr/rsc)"; `devPersistToDisk` writes rules to `node_modules/.stylex/rules.json` for setups that "run separate Node processes per environment." Source: https://github.com/facebook/stylex/blob/main/packages/@stylexjs/unplugin/src/core.js
- The docs cover React Server Components and React Router (RSC) on Vite, both multi-environment builds, with `stylex.vite()` first in the plugin list: "plugins: [stylex.vite({ useCSSLayers: true }), react(), rsc()]". Source: https://stylexjs.com/docs/learn/installation/vite/react-router/, https://stylexjs.com/docs/learn/installation/vite/vite-rsc/
- StyleX's own `example-vite-react` and `example-react-router` use `react ^19.2.0`, `@stylexjs/unplugin 0.19.0`, and Vite 7. Source: `examples/*/package.json` in facebook/stylex.

### `vite-plugin-stylex` (unofficial, stale)

- README: "Unofficial Vite plugin for StyleX" with a warning: "This plugin is in early development and may not work as expected." It is "built upon `@stylexjs/rollup-plugin`". Source: https://github.com/HorusGoul/vite-plugin-stylex
- Last commit on `main`: 2024-11-06 ("Version Packages (#91)"). Latest npm release 0.13.0 on 2024-11-06 with peers `@stylexjs/stylex ^0.9.3` and `vite ^5.2.7`. Source: GitHub API commits endpoint; npm registry.
- It uses an `@stylex stylesheet;` marker in a CSS file, has framework recipes for Remix, SvelteKit, Vue, Qwik, and none for TanStack. Source: README.
- Verdict: two major Vite versions and ten StyleX minor versions behind; not a candidate.

### `@stylexjs/babel-plugin` (the compiler itself)

- Options: `dev`, `test`, `runtimeInjection` (default false), `classNamePrefix` ('x'), `importSources`, `styleResolution` (default `'property-specificity'`), `treeshakeCompensation`, `aliases`, `env`, `sxPropName` ('sx'), `unstable_moduleResolution` (`commonJS` or `haste`). CSS is obtained by collecting each file's metadata and calling `processStylexRules(rules, { useLayers, enableLTRRTLComments })`. Source: https://stylexjs.com/docs/api/configuration/babel-plugin/
- Used alone (e.g. through `@vitejs/plugin-react`'s `babel.plugins`), it compiles the JS but emits no stylesheet; you would have to collect the metadata and write the CSS yourself. That is exactly what the unplugin does. A TanStack discussion shows people passing `@stylexjs/babel-plugin` through the React plugin's Babel options for react-strict-dom, but that predates the unplugin and does not solve CSS emission. Source: https://github.com/TanStack/router/discussions/3579
- Note `@vitejs/plugin-react` 6.x peers on `oxc-transform-react` and `@rolldown/plugin-babel`, i.e. Babel is optional there now (npm registry). The unplugin runs its own Babel pass, so it does not depend on the React plugin's Babel path.

### `@stylexjs/rollup-plugin`

- Still published in lockstep (0.19.0, depends on `lightningcss`), but no longer on the docs' configuration list (the page 404s). Source: npm registry; https://stylexjs.com/docs/api/
- The unplugin exposes `stylex.rollup()`, covering the same use. Source: unplugin README.

### `@stylexjs/postcss-plugin`

- Replaces an `@stylex;` declaration in a global CSS file with the generated rules; it globs and re-transforms source files (`include` patterns). Source: https://stylexjs.com/docs/learn/installation/ (PostCSS settings), npm deps (`fast-glob`, `postcss`).
- Documented for Next.js, not Vite. Not needed here.

### Which works with TanStack Start's Vite plugin and SSR/SSG build

- TanStack Start's own docs require "react's vite plugin must come after start's vite plugin". Source: https://tanstack.com/start/latest/docs/framework/react/build-from-scratch
- Start builds two Vite environments, `client` and `server` (plus an optional server-function provider env). Source: https://github.com/TanStack/router/blob/main/packages/start-plugin-core/src/vite/plugin.ts
- So the config is `plugins: [stylex.vite({...}), tanstackStart({...}), viteReact()]`. Both ordering constraints hold. **Not confirmed from a primary source:** neither StyleX nor TanStack publishes a TanStack Start example; the only evidence of the combination in the wild is a TanStack Router + Vite + StyleX reproducer in a StyleX issue about dev-mode style ordering (https://github.com/facebook/stylex/issues/1415). Verify with a throwaway build before the base-component ticket depends on it.

## 2. How the stylesheet is emitted and linked during static prerendering

### What the unplugin does at build time

- The Vite adapter's `generateBundle` hook collects all StyleX rules, picks a CSS asset from the bundle (`cssInjectionTarget`, else `index-*.css`, else `style-*.css`, else the first `.css` asset), appends the StyleX CSS, emits a new hashed copy of that asset, rewrites references to the old file name in chunk code, in each chunk's `viteMetadata.importedCss`, and in other assets, then deletes the old asset. If no CSS asset exists it falls back to writing `assets/stylex.css` in `writeBundle`. Source: https://github.com/facebook/stylex/blob/main/packages/@stylexjs/unplugin/src/vite.js and `core.js` (`replaceCssAssetWithHashedCopy`, `replaceBundleReferences`).
- PR #1547 (merged 2026-04-01) made this Vite 8 safe: in Vite 8 (Rolldown) CSS assets are present at `generateBundle`, so the plugin now skips `writeBundle` when `generateBundle` already injected, "preserving the fallback for SSR/Workers." Source: https://github.com/facebook/stylex/pull/1547
- Issue #1815 (closed 2026-09-02 by PR #1817): with 0.19.0 the default picker regex did not match Vite's hashed `index-<hash>.css`, so with more than one CSS chunk the StyleX CSS could land in a lazy route's chunk and "every other route loses its styles", silently. Fixed on `main` (the regexes are now `/(^|\/)index(-[\w-]{8,})?\.css$/i` etc.) but **not yet in an npm release** as of 0.19.0. Until the next release, set `cssInjectionTarget` explicitly, e.g. `(f) => /assets\/index-.*\.css$/.test(f)`, or keep exactly one CSS asset. Source: https://github.com/facebook/stylex/issues/1815, https://github.com/facebook/stylex/pull/1817
- The docs also require a CSS entry: "Import a CSS file from your app root ... This ensures Vite generates a CSS asset. During production builds, StyleX appends its compiled styles to that CSS file." Source: https://stylexjs.com/docs/learn/installation/vite/vite-react/

### How TanStack Start links CSS in prerendered HTML

- Start distinguishes two import styles. Side-effect `import './app.css'` (and CSS modules): "Start discovers the generated CSS asset from the client build and attaches it to the matching route manifest entry. During SSR, `HeadContent` renders stylesheet links for the matched route tree, so the page is styled before hydration." This path also enables static Early Hints, `transformAssets`, and CSS inlining. `import appCss from './app.css?url'` + `head().links` instead returns a URL you place yourself; such links "are not rewritten by Start's runtime `transformAssets` option" and "are not inlined by Start CSS inlining." Source: https://tanstack.com/start/latest/docs/framework/react/guide/css-styling
- Source-level: Start's manifest plugin captures the client bundle in a `generateBundle` hook with `enforce: 'post'` scoped to the `client` environment, normalises each chunk's `viteMetadata.importedCss` into `chunk.css`, and reads each `.css` asset's `source` (for inlining). Source: https://github.com/TanStack/router/blob/main/packages/start-plugin-core/src/vite/start-manifest-plugin/plugin.ts and `normalized-client-build.ts`
- Because the unplugin is a normal (non-`post`) plugin, its `generateBundle` runs before Start's capture, so Start sees the re-hashed, StyleX-appended asset in `importedCss`. The prerendered `<link rel="stylesheet">` therefore points at a file that contains the StyleX rules, and there is no FOUC. **This ordering conclusion is mine from reading both sources; no doc states it.**
- Prerender writes each page to `<path>/index.html` under the client output directory (`dist/client` for Vite builds). Source: https://github.com/TanStack/router/blob/main/packages/start-plugin-core/src/prerender.ts (`getClientOutputDirectory`, `joinURL(cleanPagePath, 'index.html')`); https://tanstack.com/start/latest/docs/framework/react/guide/hosting (Vite client assets in `dist/client`).
- Prerender config: `tanstackStart({ prerender: { enabled, autoSubfolderIndex, autoStaticPathsDiscovery, concurrency, crawlLinks, filter, retryCount, retryDelay, maxRedirects, failOnError, onSuccess } })`. Source: https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering
- `server.build.inlineCss: true` "embeds Start manifest-managed route CSS directly into the server-rendered HTML response for production builds" (side-effect imports only). For a one-page marketing site this removes the stylesheet request entirely and is worth enabling once the CSS size is known. Source: css-styling guide above.
- `?url` risk: Vite does not emit assets in the SSR build ("During the SSR build, static assets aren't emitted as it is assumed they would be emitted as part of the client build", `build.ssrEmitAssets` default `false`), so the server bundle carries a URL computed from the *original* CSS content. The unplugin only rewrites references inside the bundle it is currently generating. Whether Start reconciles that URL with the client output I could not confirm from a primary source; the side-effect import avoids the question. Source: https://vite.dev/config/build-options.html

### Dev server

- In dev the plugin serves `/virtual:stylex.css` and (with `devMode: 'full'`) injects a `<link>` and a runtime script via `transformIndexHtml`, plus a WebSocket `stylex:css-update` event on HMR. TanStack Start has no `index.html`, so `transformIndexHtml` does nothing; the docs' pattern for framework shells is a small client component that, when `import.meta.env.DEV`, renders `<link rel="stylesheet" href="/virtual:stylex.css">` and `import('virtual:stylex:runtime')` (or `virtual:stylex:css-only`). Source: unplugin README ("Dev HTML injection"), https://stylexjs.com/docs/learn/installation/vite/react-router/, `vite.js`
- Waku's recipe (also multi-environment) uses `devMode: 'css-only', devPersistToDisk: true` so "multiple Waku environments share collected rules while developing." The same two options are the likely fit for Start's client/server environments. Source: https://stylexjs.com/docs/learn/installation/vite/waku/
- Known dev-only wart: the injected `<style>` can end up above imported stylesheets in dev while the production order is correct (open issue, TanStack Router reproducer). Source: https://github.com/facebook/stylex/issues/1415
- Known test wart: the Vite adapter leaks a `setInterval` under Vitest (no `httpServer` to clear it), open issue #1836 (2026-09-02). Irrelevant while rule 12 (no automated tests) holds. Source: https://github.com/facebook/stylex/issues/1836

## 3. Theming and token primitives

### `defineVars`

- Signature `defineVars(styles) => Vars`. Creates "global CSS Custom Properties (variables)"; names are hashed unless the key starts with `--`. Values: strings, numbers, conditional objects `{ default, '@media ...': ..., '@supports ...': ... }`, and zero-argument functions that derive from other keys in the same group (compile-time, with missing/cyclic reference errors). Source: https://stylexjs.com/docs/api/javascript/defineVars/, https://stylexjs.com/docs/learn/theming/defining-variables/, https://stylexjs.com/blog/v0.18
- File rules: must live in `.stylex.js|.mjs|.cjs|.ts|.tsx|.jsx` files, as named exports directly at module level, no default export, no intermediate constants, no nesting, "no other exports allowed in variable-definition files." Source: defining-variables page.
- "Variables are the only type of non-local value that can be used within a `create` call." They are CSS identifiers: "They cannot be used as values within JavaScript code." Named imports "directly from the `.stylex.js` files that define them" are required. Source: defining-variables and https://stylexjs.com/docs/learn/theming/using-variables/
- Requires `unstable_moduleResolution` in the compiler config (the unplugin defaults it to `commonJS`). Source: defining-variables page; `core.js`.

### `createTheme`

- `createTheme(vars, overrides) => StyleXStyles`; apply with `stylex.props(theme, ...)` on a subtree. Partial overrides allowed ("revert back to their default value"); values may be conditional (`{ default, [DARK]: ... }`); themes are plain style objects that can be passed around; "the last applied theme wins" for the same var group. Source: https://stylexjs.com/docs/api/javascript/createTheme/, https://stylexjs.com/docs/learn/theming/creating-themes/
- Open bug to watch: "Theming not working as intended" (#1606, 2026-04-10). I did not dig into it. Source: https://github.com/facebook/stylex/issues/1606

### `defineConsts`

- "Defines static style constants that can be used directly in `create` calls anywhere in the codebase." Inlined at build time (no CSS variable), for media queries/breakpoints, z-index, durations, easings. Same `.stylex.*` named-export file rules; can share a file with `defineVars`. "defineConsts does not currently have `enableMediaQueryOrder` config support." Source: https://stylexjs.com/docs/api/javascript/defineConsts/
- Open requests: tokens inside `defineConsts` (#1549), arithmetic support in the unplugin (#1707). Source: https://github.com/facebook/stylex/issues/1549, https://github.com/facebook/stylex/pull/1707

### `stylex.env` (experimental)

- Compile-time tokens/functions configured in the plugin `env` option; "Values are replaced before compilation" and, unlike `defineConsts`, it emits no extra CSS. Source: https://stylexjs.com/docs/api/javascript/env

### `keyframes`

- `keyframes(frames) => string`; "You must declare your keyframes in the same file as where you use them"; duplicates dedupe; multiple animations via comma-separated strings; export names via `defineVars` to share across files. Siblings: `viewTransitionClass()` and `positionTry()`. Source: https://stylexjs.com/docs/api/javascript/keyframes/, https://stylexjs.com/docs/api/

### `firstThatWorks`

- `firstThatWorks(...values)` emits every value as a fallback declaration so the browser cascades to the first it supports; order from most modern to oldest, e.g. `position: stylex.firstThatWorks('sticky', '-webkit-sticky', 'fixed')`. Source: https://stylexjs.com/docs/api/javascript/firstThatWorks/

### Media, pseudo, and other conditions

- Pseudo-classes nest inside a property value (`{ default, ':hover', ':active' }`); pseudo-elements (`::placeholder`) are top-level keys in a namespace, and the docs recommend "avoiding pseudo-elements when possible." Media queries are keys inside a value; conditions nest "more than one level deep" (e.g. `:hover` inside `@media (hover: hover)`); "The `default` case is required when authoring contextual styles"; `null` resets. Source: https://stylexjs.com/docs/learn/styling-ui/defining-styles/
- `@supports` is documented for variable values; `@starting-style` nesting had a fix in 2024 (#703); `@container` works but its ordering is an open bug (#1798, "wider breakpoints appear before narrower ones", PR #1802 pending) and `enableMediaQueryOrder` does not cover it. Source: defining-variables page; https://github.com/facebook/stylex/pull/703; https://github.com/facebook/stylex/issues/1798
- Open bug: `@media` combined with `:last-child` in one value does not apply on the media branch (#1314). Source: https://github.com/facebook/stylex/issues/1314
- Contextual styling: `stylex.when.ancestor | descendant | anySibling | siblingBefore | siblingAfter(pseudoOrAttr, marker?)` with `stylex.defaultMarker()` / `stylex.defineMarker()`; attribute selectors like `[data-state="open"]` supported since 0.18. "Lookahead selectors (`siblingAfter`, `anySibling`, `descendant`) rely on the CSS `:has()` selector." Source: https://stylexjs.com/docs/api/javascript/when/, https://stylexjs.com/blog/v0.18

### What the design system cannot express

- No descendant/child/sibling combinators (`.a > *`, `.a:hover button`), no arbitrary or global selectors: "All styles on an element should be caused by class names on that element itself." Source: https://stylexjs.com/docs/learn/thinking-in-stylex/
- No project-level "magic" config: every style, var and const is an explicit import. Source: same page.
- Global CSS (reset, `@font-face` for Satoshi, `html { color-scheme }`) therefore lives in the one plain `app.css` that the unplugin needs anyway.

## 4. Does LightningCSS earn a place?

### What it does

- Minification (shorthand collapsing, rule merging, prefix removal, colour and calc reduction), transpilation with vendor prefixing driven by browserslist targets, nesting, colour functions, media-range syntax, logical properties, `light-dark()`, `:is()/:not()` lowering; `include`/`exclude` via the `Features` enum. Source: https://lightningcss.dev/docs.html, https://lightningcss.dev/transpilation.html, https://lightningcss.dev/minification.html

### What is already in the stack

- **Vite 8:** `build.cssMinify` defaults to `'lightningcss'` ("Vite uses Lightning CSS by default to minify CSS"), respecting `build.cssTarget`; esbuild is now optional. `css.transformer: 'lightningcss'` (replacing PostCSS for all CSS processing) is still labelled experimental in v8.2.2, and `css.modules` has no effect under it. Source: https://vite.dev/config/build-options.html, https://vite.dev/config/shared-options.html, https://vite.dev/guide/features.html, https://vite.dev/guide/migration.html
- **Vite+:** `vp build` "runs the standard Vite production build through Vite+", on "Vite 8 and Rolldown", with the same `vite.config.ts` model; `@voidzero-dev/vite-plus-core` 0.3.0 depends on `lightningcss ^1.33.0`. The Vite+ docs say nothing about CSS defaults beyond inheriting Vite's. Source: https://viteplus.dev/guide/build, npm registry.
- **The StyleX unplugin:** "runs lightningcss over the collected CSS to apply vendor prefixes and lower modern syntax for older browsers", with targets from browserslist (env var, `package.json` field, `.browserslistrc`, else defaults `"> 0.5%, last 2 versions, Firefox ESR, not dead"`). `lightningcssOptions` is spread over `{ targets }` so you can override `targets`, `exclude`, `minify`. Source: unplugin README; `core.js` `processCollectedRulesToCSS`.

### The gap it does not close by itself

- The appended StyleX CSS is not minified by Vite: Vite minifies CSS assets in `renderChunk` (`finalizeCss`) before user plugins' `generateBundle` runs, and the unplugin appends afterwards. Issue #1378 reports exactly this ("bypasses minification"); the maintainer's answer: "For now, the lightningcssOptions can be used to enable minification, although I think it might be possible to read the options from your Vite config automatically." Still open. Source: https://github.com/facebook/stylex/issues/1378, https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/css.ts
- `light-dark()` trap: if browserslist includes browsers without native `light-dark()`, the unplugin's lowering "silently break[s] dark-mode colors" because `color-scheme` is not in the same transform. Fix: modern targets (Chrome >= 123, Firefox >= 120, Safari >= 17.5) or `lightningcssOptions: { exclude: Features.LightDark }`. Source: unplugin README.

### Recommendation

- **Do not add LightningCSS as a separate step or switch `css.transformer`.** Minification is already LightningCSS in Vite 8; prefixing/lowering of StyleX output is already LightningCSS in the unplugin; the hand-written CSS is a reset plus `@font-face`, which needs neither nesting nor lowering.
- **Do** add one `browserslist` in `package.json` (shared by Vite's `build.cssTarget` defaults, the unplugin, and any future tooling) and set `stylex.vite({ lightningcssOptions: { minify: true } })` so the appended CSS is minified. Recheck when the unplugin closes #1378.
- If a later ticket wants to drop PostCSS entirely, `css: { transformer: 'lightningcss', lightningcss: { targets: browserslistToTargets(browserslist()) } }` is the documented switch (https://lightningcss.dev/docs.html, Vite shared-options); it stays experimental in Vite 8.2.

## 5. Known pitfalls

- **React 19.** StyleX's runtime has no React peer dependency; its `example-vite-react` and `example-react-router` run `react ^19.2.0` with unplugin 0.19.0. GitHub issue search for "React 19" in facebook/stylex returns only dependency bumps and unrelated items. `@tanstack/react-start` peers on React 18 or 19. **Not confirmed:** any React 19-specific StyleX bug; none found. Source: facebook/stylex `examples/*/package.json`; GitHub issue search; npm registry.
- **Dynamic styles.** "Function arguments must be simple identifiers -- No destructuring or default values" and "The function body must be an object literal." They compile to CSS variables set via inline `style`, so the returned `style` object must reach the DOM element (`stylex.props` returns `{ className, style }`). Use "sparingly". Open bugs: function styles nested inside a component body throw "Unsupported expression: FunctionDeclaration" (#1235); `stylex.attrs` mishandles multi-word properties with dynamic styles (#1709); dynamic styles inside pseudo-elements broke in the unplugin (#1396, fixed). Source: https://stylexjs.com/docs/learn/styling-ui/defining-styles/, https://stylexjs.com/docs/api/javascript/props/, https://github.com/facebook/stylex/issues/1235, https://github.com/facebook/stylex/issues/1709, https://github.com/facebook/stylex/issues/1396
- **`stylex.props` on custom components.** Custom components accept a style prop and spread `stylex.props(styles.base, style)` themselves; pass-through styles are applied after local styles by convention; arrays and falsy values are fine. Type it with `StyleXStyles<{ color?: ...; padding?: 0 | 4 | 8 }>` (or `StyleXStylesWithout`, `StaticStyles`) to constrain what callers may override; "Any key not defined in the object type will be disallowed", but unknown properties do not error. The `sx` prop shorthand "only works on lowercase DOM elements like `<div>` or `<button>`, not custom components." Implication for rule 8/9 (no raw HTML in feature code; base components render semantic tags): base components can use `sx` internally on their host element, but their public API must be a `style?: StyleXStyles<...>` prop. Source: https://stylexjs.com/docs/learn/styling-ui/using-styles/, https://stylexjs.com/docs/api/types/StyleXStyles, https://stylexjs.com/docs/api/javascript/props/
- **Themes and vars require `unstable_moduleResolution`.** The unplugin sets `{ type: 'commonJS', rootDir: process.cwd() }` by default; a tsconfig `paths` alias for `.stylex.ts` files is a long-open issue (#40) and 0.19.0 fixed "aliased theme file resolution", so import token files by relative path or configure `aliases`. Source: `core.js`; https://github.com/facebook/stylex/issues/40; https://stylexjs.com/blog/v0.19.0
- **CSS asset picking (0.19.0).** See #1815 above: set `cssInjectionTarget` or keep a single CSS asset until the next release.
- **`useCSSLayers`.** Off by default in the unplugin; turning it on wraps StyleX output in `@layer` blocks with optional `before`/`after` layer names, which is the documented way to make a hand-written reset lose to StyleX predictably. Source: https://stylexjs.com/docs/api/configuration/unplugin
- **Atoms (0.19.0).** `@stylexjs/atoms` offers inline atomic styles (`_.display.flex`) compiled to the same CSS. It conflicts with rule 10 (use the design system, not arbitrary values); do not adopt. Source: https://stylexjs.com/blog/v0.19.0

## Not confirmed from primary sources

- That `[stylex.vite(), tanstackStart(), viteReact()]` works end to end with `prerender.enabled: true`; no example exists in either project.
- That Start's `?url` stylesheet pattern survives the unplugin's asset re-hash (reasoned from `build.ssrEmitAssets` semantics, not tested). Side-effect import avoids it.
- Exact hook ordering between the unplugin's `generateBundle` and Vite 8's native manifest plugin (`native:manifest-compatible`); Start does not read `.vite/manifest.json` for CSS, it reads the bundle directly, so this only matters if something else consumes the manifest.
- Any React 19-specific StyleX defect.
- The 0.18.x release notes as a GitHub release: the releases feed stops at 0.17.5 (2026-01-21) while npm is at 0.19.0; the blog is the record for 0.18 and 0.19.
