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
| `execil-wordmark-reversed.svg` | on `ink900` — white letters, `teal600` badge            |
| `execil-wordmark-mono.svg`     | `currentColor` throughout, one-colour contexts          |
| `execil-wordmark-notag.svg`    | no tagline — small sizes, where it cannot be read       |
| `execil-mark.svg`              | badge alone. Shorter, heavier cross so it survives 16px |

`src/base/Wordmark.tsx` carries the same geometry inline, so the letterforms can
take `currentColor` and the badge can take theme tokens. It is the component
that renders in the header and footer; these files are for anything outside the
app — email signatures, decks, the client's own use. **They are two copies of
one drawing: change one and change the other.**

`public/favicon.svg` is `execil-mark.svg` fitted to a 32×32 box.

### Clearance

The badge replaces the tittle of the "i", so it sits against the letterforms
rather than against the page — and at `teal700` it separates from `ink900` by
only 2.74:1, which at header size reads as one dark mass rather than as a mark.

It is separated by space instead. A ring 20% of the badge radius wide is masked
out of the letterforms, so the ground shows through around the badge. It is a
mask rather than a filled circle on purpose: the ring shows whatever the mark is
placed on, so the same drawing works on the light page and on the inverse
footer without a second colour. Narrower than about 15% stops registering at
28px; wider than about 25% starts eating the stem of the "i".

## plus-split — not in use

"+ execil" lowercase at wght 900, cut by a diagonal two-tone split through the
"c", with the name stacked alongside. Kept at the client's request.

Note the reversed variant is compromised: the palette's brightest teal is
`teal600`, which lands about 3.3:1 on `ink900`, so the accent falls back to
`teal100` and reads as pale mint rather than teal. Adding a brighter teal to the
ramp would fix it.
