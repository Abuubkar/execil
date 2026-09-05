# 02 — How does StyleX compile inside TanStack Start on Vite, and is LightningCSS worth adding?

Type: research
Status: claimed

## Question

StyleX is the styling system and every public page is statically prerendered. Establish from primary sources (StyleX docs and repo, TanStack Start docs, LightningCSS docs):

- The supported ways to run the StyleX compiler in a Vite project today: `@stylexjs/unplugin`, `vite-plugin-stylex`, Babel plugin, Rollup plugin. Which is maintained by the StyleX team, and which works with TanStack Start's Vite plugin and SSR/SSG build.
- How the generated stylesheet is emitted and linked during static prerendering, so the prerendered HTML ships with its CSS and no flash of unstyled content.
- The theming and token primitives: `defineVars`, `createTheme`, `defineConsts`, `keyframes`, `firstThatWorks`, media and pseudo support. What the design system can and cannot express in StyleX.
- Whether LightningCSS earns a place: what it would add on top of StyleX's output (minification, nesting, vendor prefixing, browserslist targeting), whether Vite+ already ships it, and the recommended way to wire it if adopted.
- Known pitfalls: StyleX with React 19, dynamic styles, `stylex.props` on custom components.

Record findings in `docs/research/stylex-tanstack.md`, each claim cited.
