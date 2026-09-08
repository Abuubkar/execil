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

const pulse = stylex.keyframes({
  '0%': { opacity: 0.9, transform: 'scale(1)' },
  '70%': { opacity: 0, transform: 'scale(2.2)' },
  '100%': { opacity: 0, transform: 'scale(2.2)' },
})

/** ::after carries the travelling ring; app.css stops it under
 *  prefers-reduced-motion, leaving the steady bloom on the dot. */
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
