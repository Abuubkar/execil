# 06 — Can Satoshi be self-hosted, and how is it loaded without layout shift?

Type: research
Status: resolved

## Question

The brand font is Satoshi from Fontshare. Rule 6 forbids layout shift. Establish from primary sources (Fontshare site and its font licence, MDN, web.dev):

- The Fontshare licence terms: whether self-hosting the font files on our own domain is permitted, and whether Fontshare's CDN is the only sanctioned delivery. Any attribution requirement.
- Available weights and formats for Satoshi, including the variable font, and the recommended subset for English-only text.
- The loading strategy that avoids layout shift: `font-display` choice, preload of the primary file, and metric-compatible fallback via `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` against a system fallback. Provide the computed override values if a tool can produce them.
- How `@font-face` is declared in a StyleX project, since StyleX has no global stylesheet primitive by default.

Record findings in `docs/research/satoshi-font.md`, each claim cited.

## Answer

Full findings: [docs/research/satoshi-font.md](../../../docs/research/satoshi-font.md).

- **Self-host, yes.** ITF Free Font License v2.0 (17 Aug 2026), section 01: self-hosting via `@font-face` is "permitted and recommended"; the Fontshare API is optional and carries no availability guarantee. No attribution required.
- **Ship the kit files unmodified.** The licence names subsetting and format conversion as prohibited modification, so there is no English-only subset. Use `Satoshi-Variable.woff2` (wght 300–900, about 43 KB) rather than static weights (about 25 KB each). Italic variable only if the design uses italics; the canvas does not.
- **Loading strategy:** `font-display: swap`, one `rel=preload as=font type=font/woff2 crossorigin` for the variable file from the root route's `head().links`, and a metric-matched `"Satoshi Fallback"` face mapping `local("Arial")` (plus a Roboto variant for Android) with `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`. Stack: `Satoshi, "Satoshi Fallback", Arial, sans-serif`. Switch to `font-display: optional` only if measured CLS is not zero.
- **Override values must be computed from the font file.** No published metrics exist for Satoshi (`@capsizecss/metrics` has no entry; fontaine reads the file at build). Use a one-off `@capsizecss/unpack` plus `createFontStack` script, or the fontaine Vite plugin.
- **StyleX has no `@font-face` API.** Put the rules in the plain CSS entry the StyleX Vite plugin already requires, attach via TanStack `head().links`, and expose the family stack through `stylex.defineVars`.
- **Caveats:** Safari supports `size-adjust` but not the three overrides, so vertical matching does not apply there. The licence asks that files be downloaded directly from Fontshare rather than handed between parties; worth a note for a client build.
