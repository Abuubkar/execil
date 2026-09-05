# 06 — Can Satoshi be self-hosted, and how is it loaded without layout shift?

Type: research
Status: open

## Question

The brand font is Satoshi from Fontshare. Rule 6 forbids layout shift. Establish from primary sources (Fontshare site and its font licence, MDN, web.dev):

- The Fontshare licence terms: whether self-hosting the font files on our own domain is permitted, and whether Fontshare's CDN is the only sanctioned delivery. Any attribution requirement.
- Available weights and formats for Satoshi, including the variable font, and the recommended subset for English-only text.
- The loading strategy that avoids layout shift: `font-display` choice, preload of the primary file, and metric-compatible fallback via `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` against a system fallback. Provide the computed override values if a tool can produce them.
- How `@font-face` is declared in a StyleX project, since StyleX has no global stylesheet primitive by default.

Record findings in `docs/research/satoshi-font.md`, each claim cited.
