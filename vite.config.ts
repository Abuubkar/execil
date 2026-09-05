import { defineConfig } from 'vite-plus'
import stylex from '@stylexjs/unplugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'

/** Tags feature code may not use directly. Base components own them (issue #22).
 *  NOTE: this is an explicit list, not a wildcard — a tag not listed passes
 *  silently. A wildcard version would need a custom JS plugin, which the
 *  enforcement policy rules out. */
const FORBIDDEN_ELEMENTS = [
  { element: 'div', message: 'Use Box or a layout component from base/.' },
  { element: 'span', message: 'Use Text, or a role component from base/.' },
  { element: 'p', message: 'Use Text as="p" or Prose.' },
  { element: 'a', message: 'Use Link.' },
  { element: 'button', message: 'Use Button or IconButton.' },
  { element: 'ul' },
  { element: 'ol' },
  { element: 'li' },
  { element: 'h1' },
  { element: 'h2' },
  { element: 'h3' },
  { element: 'h4' },
  { element: 'h5' },
  { element: 'h6' },
  { element: 'section' },
  { element: 'article' },
  { element: 'aside' },
  { element: 'header' },
  { element: 'footer' },
  { element: 'main' },
  { element: 'nav' },
  { element: 'address' },
  { element: 'form' },
  { element: 'label' },
  { element: 'input' },
  { element: 'select' },
  { element: 'option' },
  { element: 'textarea' },
  { element: 'table' },
  { element: 'thead' },
  { element: 'tbody' },
  { element: 'tr' },
  { element: 'th' },
  { element: 'td' },
  { element: 'details' },
  { element: 'summary' },
  { element: 'svg' },
  { element: 'img' },
  { element: 'br' },
]

export default defineConfig({
  resolve: { tsconfigPaths: true },

  plugins: [
    // MUST be first in the plugin list (issue #3).
    stylex.vite({ lightningcssOptions: { minify: true } }),

    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({ prerender: { enabled: true } }),
    viteReact(),
  ],

  // docs/ holds the design canvas and the research notes. Both are primary
  // sources that must stay byte-identical, not code to be reformatted.
  fmt: {
    ignorePatterns: ['docs/**', 'src/routeTree.gen.ts', 'dist/**'],
    singleQuote: true,
    semi: false,
  },

  lint: {
    ignorePatterns: ['docs/**', 'src/routeTree.gen.ts', 'dist/**'],
    // Setting `plugins` REPLACES the default set, so the defaults are re-listed
    // alongside `react`, which is not on by default.
    plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'react'],
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // base/ is deliberately exempt: Base components exist to render raw
        // tags, and Icon must render svg/path/circle/rect.
        files: ['src/sections/**', 'src/routes/**'],
        rules: {
          'react/jsx-no-literals': [
            'error',
            // ignoreProps: children only. Attributes are checked by default,
            // which would flag structural props like as="main" and lang="en".
            // The trade-off: user-facing attribute strings (aria-label, alt,
            // title, placeholder) are NOT caught — that gap is why IconButton,
            // Field and Icon require their strings as props. See issue #11.
            { noStrings: true, ignoreProps: true },
          ],
          'react/forbid-elements': ['error', { forbid: FORBIDDEN_ELEMENTS }],
        },
      },
    ],
  },

  // Pre-commit stays fast: format and lint staged files only. Type-check and
  // build run in CI, so nobody reaches for --no-verify (issue #33).
  staged: { '*': ['vp fmt', 'vp lint --fix'] },
})
