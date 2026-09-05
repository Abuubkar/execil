# Normalise the design canvas's raw values into token scales

The design canvas (`Landing page ready for review/RCM Landing.dc.html`) is a generative export. It uses roughly 110 distinct raw style values, including artefacts that read as incidental rather than intended: font sizes of 13.5/14.5/16.5px, spacing at 5/11/15/22/26px, ten border radii, and eleven greys — several used exactly once.

We normalise these onto scales rather than preserving them exactly. A value used four or more times earns its own step; a value used one to three times rounds to its nearest neighbour. Two carve-outs stop the rule destroying the design: a value providing the only contrast between two adjacent surfaces is kept regardless of frequency, and a value with no perceptually near neighbour is kept rather than rounded to something unrelated.

The trade-off: preserving every value exactly would keep perfect visual fidelity to the canvas, but it would make rule 10 ("use the design system instead of arbitrary styling values") unenforceable, because every arbitrary value would already be blessed as a token. A 62-token system that drifts sub-pixel from the export is worth more than a 110-value dump that cannot be reasoned about. `CLAUDE.md` names the canvas the design source of truth; this ADR narrows that to **structure and copy**, and makes the token set the source of truth for **values**.

**Amended (issue #19):** copy has since moved out too. The Problem section's statistics were placeholders that had to be replaced with sourced industry figures, which changed the wording as well as the numbers. The canvas is therefore the source of truth for **structure only**; `messages.json` owns copy, and the token set owns values.

## Consequences

- The built page will differ from the canvas by 1–2px in places. This is expected and is not a bug to be "fixed" by reintroducing the raw value.
- Two changes are larger than sub-pixel and are deliberate accessibility fixes, not normalisation: the primary CTA and link colour move from teal600 `#0E8A8A` to teal700 `#0A6B6B` (with a new teal800 `#085252` hover step), because white-on-teal600 and teal600-on-white both measure 4.18:1 and fail WCAG AA for normal text. `#9AA5B1` is barred from carrying text at 2.50:1.
- Anything the canvas adds later must be normalised through the same rule before it becomes a token.

See issue #8 for the full token table and the per-value rounding decisions.
