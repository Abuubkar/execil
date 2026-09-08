import hero1254 from './assets/hero/hero-1254.webp'
import hero900 from './assets/hero/hero-900.webp'
import hero600 from './assets/hero/hero-600.webp'

/** Shared by the Hero section and the home route's preload link. The two must
 *  agree on srcset and sizes or the browser fetches the picture twice. */
export const HERO_SRC = hero1254
export const HERO_SRCSET = `${hero600} 600w, ${hero900} 900w, ${hero1254} 1254w`

/** Copy of `screen.nav`; a `sizes` attribute cannot read a token. */
export const HERO_SIZES = '(min-width: 1040px) 50vw, 100vw'

/** Intrinsic size, so the box is reserved before the bytes land. */
export const HERO_WIDTH = 1254
export const HERO_HEIGHT = 1254
