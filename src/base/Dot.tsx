import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { color, motion, radius, shadow } from '../styles/tokens.stylex'

export type DotTone = 'brand' | 'success' | 'subtle'
export type DotSize = 'xs' | 'sm' | 'md'

const tones = stylex.create({
  brand: { backgroundColor: color.surfaceBrand },
  success: { backgroundColor: color.textSuccess },
  subtle: { backgroundColor: color.textSubtle },
})

/** The pulse. Opacity and transform only, so no colour is named here and the
 *  ring is composited rather than repainted. The global prefers-reduced-motion
 *  rule in app.css covers ::after, so this stops on its own for anyone who has
 *  asked it to. */
const pulse = stylex.keyframes({
  '0%': { opacity: 0.9, transform: 'scale(1)' },
  '70%': { opacity: 0, transform: 'scale(2.2)' },
  '100%': { opacity: 0, transform: 'scale(2.2)' },
})

/** Keyed by tone: a glow is the dot's own colour bloomed outwards, so a brand
 *  dot wearing the success glow would just look wrong. `subtle` has none —
 *  a decorative grey dot has nothing to announce.
 *
 *  The steady bloom sits on the dot and the travelling ring on ::after, so the
 *  dot still reads as lit when the animation is suppressed. */
const glows = stylex.create({
  brand: {
    boxShadow: shadow.glowBrand,
    '::after': {
      animationDuration: motion.pulse,
      animationIterationCount: 'infinite',
      animationName: pulse,
      animationTimingFunction: motion.ease,
      borderRadius: radius.circle,
      boxShadow: shadow.glowBrand,
      content: '""',
      inset: 0,
      position: 'absolute',
    },
  },
  success: {
    boxShadow: shadow.glowSuccess,
    '::after': {
      animationDuration: motion.pulse,
      animationIterationCount: 'infinite',
      animationName: pulse,
      animationTimingFunction: motion.ease,
      borderRadius: radius.circle,
      boxShadow: shadow.glowSuccess,
      content: '""',
      inset: 0,
      position: 'absolute',
    },
  },
  subtle: {},
})

const sizes = stylex.create({
  xs: { height: '6px', width: '6px' },
  sm: { height: '8px', width: '8px' },
  md: { height: '12px', width: '12px' },
})

const base = stylex.create({
  // position: the glow's travelling ring is an inset ::after.
  dot: { borderRadius: radius.circle, display: 'block', flex: 'none', position: 'relative' },
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
