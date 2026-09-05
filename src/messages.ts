import type { Segment } from './base/RichText'
import messages from './messages.json'

/** Every user-facing string. Static import — no hook, no key strings, no
 *  codegen; resolveJsonModule infers the shape. See issue #11. */
export const m = messages

/** JSON widens the segment array to a structural type; this narrows it back to
 *  the encoding RichText accepts. The only place a cast is needed. */
export const heroTitle = m.hero.title as readonly Segment[]
