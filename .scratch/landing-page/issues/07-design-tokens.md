# 07 — Which design tokens does the canvas define, and how do they become the StyleX design system?

Type: grilling
Status: open
Blocked by: 02, 06

## Question

Rule 10 forbids arbitrary styling values. Extract every value the canvas uses (colours, type sizes with their `clamp()` ranges, weights, spacing, radii, borders, shadows, breakpoints at 940px, transition durations) and decide:

- The token set: names, scales, and which raw values are normalised into a step on a scale versus kept as-is.
- How the tokens are expressed in StyleX (`defineVars`, `defineConsts`, theme variants) given the StyleX research.
- Typography tokens with Satoshi and its metric-matched fallback from the font research.
- Motion tokens and the reduced-motion variant.
- Where tokens live in the repo and how a component consumes them.

Produce the token table as the resolution.
