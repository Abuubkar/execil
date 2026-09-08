import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { color, radius, shadow } from '../styles/tokens.stylex'

export type DotTone = 'brand' | 'success' | 'subtle'
export type DotSize = 'xs' | 'sm' | 'md'

const tones = stylex.create({
  brand: { backgroundColor: color.surfaceBrand },
  success: { backgroundColor: color.textSuccess },
  subtle: { backgroundColor: color.textSubtle },
})

/** Keyed by tone: a glow is the dot's own colour bloomed outwards, so a brand
 *  dot wearing the success glow would just look wrong. `subtle` has none —
 *  a decorative grey dot has nothing to announce. */
const glows = stylex.create({
  brand: { boxShadow: shadow.glowBrand },
  success: { boxShadow: shadow.glowSuccess },
  subtle: {},
})

const sizes = stylex.create({
  xs: { height: '6px', width: '6px' },
  sm: { height: '8px', width: '8px' },
  md: { height: '12px', width: '12px' },
})

const base = stylex.create({
  dot: { borderRadius: radius.circle, display: 'block', flex: 'none' },
})

/** Decorative only — always aria-hidden, so it can never be read out. */
export function Dot({
  tone = 'brand',
  size = 'xs',
  glow = false,
  style,
}: {
  tone?: DotTone
  size?: DotSize
  /** Lights the dot from its own colour. For a status dot that should read as
   *  live, not for every bullet in a list. */
  glow?: boolean
  style?: StyleProp
}) {
  return (
    <span
      aria-hidden="true"
      {...stylex.props(base.dot, sizes[size], tones[tone], glow && glows[tone], style)}
    />
  )
}
