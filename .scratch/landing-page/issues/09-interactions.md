# 09 — How is each interaction built with native CSS and Web APIs only?

Type: grilling
Status: open

## Question

Rules 1–6. The canvas has these behaviours: sticky blurred header, desktop nav versus mobile hamburger menu at 940px, FAQ accordion with one item open, smooth scroll to anchors, hover states, form submit to an inline success state, focus outlines. Decide for each:

- The mechanism: CSS-only (`:hover`, `scroll-behavior`, container/media queries), native elements (`<details>`, Popover API for the menu, `<dialog>`), or minimal JS state.
- The animation, its duration token, and the `prefers-reduced-motion` fallback.
- How it avoids layout shift and never blocks interaction (e.g. accordion height animation via `grid-template-rows` or `interpolate-size`, menu as overlay).
- Progressive enhancement: what still works with JS disabled on a prerendered page.

Prototype where behaviour is the question. Produce the interaction table as the resolution.
