import * as stylex from '@stylexjs/stylex'

import { color, palette } from './tokens.stylex'

/**
 * The Dark theme, applied to the two Inverse surfaces — the footer and the
 * Systems comparison card. This is a design inversion, NOT a
 * prefers-color-scheme dark mode: the site is light.
 *
 * Overrides Roles only; everything not listed reverts to its default. See
 * issue #8 for the contrast ratios (all AA on ink900).
 */
export const darkSurface = stylex.createTheme(color, {
  textHeading: palette.white,
  textBody: palette.ink300,
  textProse: palette.ink300,
  textMuted: palette.ink400,
  // Footer nav links use textSecondary; without this override they rendered
  // ink700 on ink900 at 1.96:1 (validator-confirmed). ink300 is 9.27:1.
  textSecondary: palette.ink300,
  textLink: palette.green200,
  // Hover step for links on dark. teal800 (the light value) would be invisible
  // on ink900; white is 17.28:1 and clearly distinct from the green textLink.
  textLinkHover: palette.white,

  surfacePage: palette.ink900,
  surfaceRaised: 'rgba(255, 255, 255, 0.08)',
  surfaceAccent: 'rgba(159, 212, 163, 0.14)',

  borderDefault: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.12)',
})
