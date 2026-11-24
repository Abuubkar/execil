import problem600 from './assets/sections/problem-600.webp'
import problem900 from './assets/sections/problem-900.webp'
import results600 from './assets/sections/results-600.webp'
import results900 from './assets/sections/results-900.webp'

/**
 * The two supporting photographs. Both sit beside a section's intro, capped at
 * `layout.containerText`, so one `sizes` covers them: the image never exceeds
 * that cap, and below `screen.navUp` it is the full content width. A `sizes`
 * attribute cannot read a token; change both together.
 */
export const SECTION_SIZES = 'min(100vw - 48px, 640px)'

/** 16:9. Problem's intro is an eyebrow and a two-line heading, so a 3:2 frame
 *  beside it left the text floating in the middle of an over-tall row. */
export const PROBLEM_SRC = problem900
export const PROBLEM_SRCSET = `${problem600} 600w, ${problem900} 900w`
export const PROBLEM_WIDTH = 900
export const PROBLEM_HEIGHT = 506

/** 3:2. Results carries a lead paragraph as well, which fills the taller row. */
export const RESULTS_SRC = results900
export const RESULTS_SRCSET = `${results600} 600w, ${results900} 900w`
export const RESULTS_WIDTH = 900
export const RESULTS_HEIGHT = 600
