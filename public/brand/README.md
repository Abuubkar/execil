# Brand assets

Two directions were drawn from client-supplied reference images. **`cross-dot/`
is the chosen one** and is what the site ships; `plus-split/` is kept for
reference and is not referenced by any code.

Every file is real vector outlines — Satoshi Variable instanced at the weight
below and converted to paths. There is no font dependency at render time and no
`<text>` element, so the marks render identically wherever they land.

## cross-dot — in use

"Execil" at wght 900, with the tittle of the "i" replaced by the cross badge.

| file                           | use                                                     |
| ------------------------------ | ------------------------------------------------------- |
| `execil-wordmark.svg`          | primary, with the MEDICAL BILLING tagline               |
| `execil-wordmark-reversed.svg` | on `ink900` — white letters                             |
| `execil-wordmark-mono.svg`     | `currentColor` throughout, one-colour contexts          |
| `execil-wordmark-notag.svg`    | no tagline — small sizes, where it cannot be read       |
| `execil-mark.svg`              | badge alone. Shorter, heavier cross so it survives 16px |

`src/base/Wordmark.tsx` carries the same geometry inline, so the letterforms can
take `currentColor` and the badge can take theme tokens. It is the component
that renders in the header and footer; these files are for anything outside the
app — email signatures, decks, the client's own use. **They are two copies of
one drawing: change one and change the other.**

`public/favicon.svg` is `execil-mark.svg` fitted to a 32×32 box.

### Colours

The badge is `teal600` `#0E8A8A` on every ground, light or dark. It runs a step
brighter than `surfaceBrand`, deliberately: the badge touches the `ink900`
letterforms, and at `teal700` it separates from them by only 2.74:1 — at header
size it stops reading as a mark and becomes part of the "i". `teal600` lifts
that to 4.13:1 while holding the white cross inside the badge at 4.18:1. Going
brighter trades one for the other — a hypothetical `teal500` would reach 5.72:1
against the letters but drop the cross to 3.02:1, which is mush at 16px.

The MEDICAL BILLING tagline stays `teal700` `#0A6B6B`. It is real text at a
small size, so it needs the 6.31:1 that `teal700` gives it and `teal600` does
not.

## plus-split — not in use

"+ execil" lowercase at wght 900, cut by a diagonal two-tone split through the
"c", with the name stacked alongside. Kept at the client's request.

Note the reversed variant is compromised: the palette's brightest teal is
`teal600`, which lands about 3.3:1 on `ink900`, so the accent falls back to
`teal100` and reads as pale mint rather than teal. Adding a brighter teal to the
ramp would fix it.
