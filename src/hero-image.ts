import hero1254 from './assets/hero/hero-1254.webp'
import hero900 from './assets/hero/hero-900.webp'
import hero600 from './assets/hero/hero-600.webp'

/**
 * The hero picture, in one place because two files need the same three values:
 * the Hero section renders it, and the home route preloads it.
 *
 * It is the LCP element on narrow screens, where it sits above the copy. The
 * markup alone is not enough there: the preload scanner finds the <img> only
 * after the CSS that sizes it has arrived, and `fetchpriority` on the tag
 * cannot start a request that has not been discovered. The preload link in the
 * document head starts it in parallel with the stylesheet, and carries the same
 * srcset and sizes so the browser picks one candidate rather than two.
 */
export const HERO_SRC = hero1254
export const HERO_SRCSET = `${hero600} 600w, ${hero900} 900w, ${hero1254} 1254w`

/** Mirrors the Hero's own breakpoint: half the viewport beside the copy on
 *  desktop, the full width above it below the nav breakpoint. */
export const HERO_SIZES = '(min-width: 940px) 50vw, 100vw'

/** Intrinsic size of the source render, so the box is reserved before the
 *  bytes land. 1254 is the square's native size and its ceiling. */
export const HERO_WIDTH = 1254
export const HERO_HEIGHT = 1254
