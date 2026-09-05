# 02 — How does StyleX compile inside TanStack Start on Vite, and is LightningCSS worth adding?

Type: research
Status: resolved

## Question

StyleX is the styling system and every public page is statically prerendered. Establish from primary sources (StyleX docs and repo, TanStack Start docs, LightningCSS docs):

- The supported ways to run the StyleX compiler in a Vite project today: `@stylexjs/unplugin`, `vite-plugin-stylex`, Babel plugin, Rollup plugin. Which is maintained by the StyleX team, and which works with TanStack Start's Vite plugin and SSR/SSG build.
- How the generated stylesheet is emitted and linked during static prerendering, so the prerendered HTML ships with its CSS and no flash of unstyled content.
- The theming and token primitives: `defineVars`, `createTheme`, `defineConsts`, `keyframes`, `firstThatWorks`, media and pseudo support. What the design system can and cannot express in StyleX.
- Whether LightningCSS earns a place: what it would add on top of StyleX's output (minification, nesting, vendor prefixing, browserslist targeting), whether Vite+ already ships it, and the recommended way to wire it if adopted.
- Known pitfalls: StyleX with React 19, dynamic styles, `stylex.props` on custom components.

Record findings in `docs/research/stylex-tanstack.md`, each claim cited.

## Answer

Full findings: [docs/research/stylex-tanstack.md](../../../docs/research/stylex-tanstack.md).

- **Plugin:** `@stylexjs/unplugin` 0.19.0 via `stylex.vite()`, pinned to the `@stylexjs/stylex` version. It is the only Vite integration the StyleX docs describe and the only one built for multi-environment (client plus SSR) builds. `vite-plugin-stylex` is unofficial and frozen at Vite 5 / StyleX 0.9 (Nov 2024); do not use it.
- **Plugin order:** `[stylex.vite(), tanstackStart({ prerender: { enabled: true } }), viteReact()]`. Satisfies both projects' documented ordering rules, but no primary source shows this exact combination. First thing the scaffold verifies.
- **CSS emission:** side-effect `import './app.css'` in `__root.tsx`, not `?url`. The unplugin appends StyleX CSS to the emitted CSS asset and re-hashes it in `generateBundle`; TanStack Start's manifest plugin captures the bundle in a later post hook, so prerendered HTML links the appended file with no flash of unstyled content. `server.build.inlineCss` can inline it. `?url` bakes the pre-append URL into the server bundle and its survival is unconfirmed.
- **LightningCSS: no new dependency, yes to what is already there.** Vite 8 minifies CSS with LightningCSS by default and the unplugin already runs it over StyleX output. Wire only a `browserslist` field in `package.json` and `lightningcssOptions: { minify: true }` on the unplugin (appended CSS bypasses Vite's minifier). Do not switch `css.transformer`; it is still experimental in Vite 8.2.
- **Release-gap pitfalls:** unplugin 0.19.0's CSS-asset picker misses Vite's hashed `index-*.css` (fixed on main 2026-09-02, unreleased): set `cssInjectionTarget` or keep a single CSS asset. The `light-dark()` lowering trap needs modern browserslist targets or `exclude: Features.LightDark`.
- **Design-system limits:** no descendant or arbitrary selectors (use `stylex.when.*`); `@container` ordering and media-plus-pseudo combinations are open bugs; dynamic styles must be top-level object-literal arrow functions; the `sx` prop only works on host elements, so base components must accept `style?: StyleXStyles<...>` and spread `stylex.props()` themselves. Token primitives available: `defineVars`, `defineConsts`, `createTheme`, `keyframes`, `firstThatWorks`, media and pseudo support. React 19.2 runs StyleX's own examples; no React 19 defect found.
