import hero1254 from './assets/hero/hero-1254.webp'
import hero900 from './assets/hero/hero-900.webp'
import hero600 from './assets/hero/hero-600.webp'

/** The hero picture. There is no preload link any more: the arch is the LCP
 *  candidate on desktop only, TanStack drops `media` from a head link, and an
 *  unscoped preload would compete with the font on narrow screens where the
 *  heading is the LCP. The <img> carries fetchpriority="high" instead, and the
 *  preload scanner finds it in the prerendered HTML in the same parse. */
export const HERO_SRC = hero1254
export const HERO_SRCSET = `${hero600} 600w, ${hero900} 900w, ${hero1254} 1254w`

/** The arch is capped at `layout.heroArchMax` minus its padding, at every
 *  width — so one `min()` covers both columns and the stacked layout. Declaring
 *  a share of the viewport instead made the browser fetch the 1254 file for a
 *  404px box. A `sizes` attribute cannot read a token; change both together. */
export const HERO_SIZES = 'min(100vw, 404px)'

/** Intrinsic size, so the box is reserved before the bytes land. 4:5, which is
 *  what the arched crop needs to hold both faces and the paperwork. */
export const HERO_WIDTH = 1254
export const HERO_HEIGHT = 1568
