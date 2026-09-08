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

const ring = stylex.keyframes({
  '0%': { opacity: 0.85, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(3)' },
})

const breathe = stylex.keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.18)' },
  '100%': { transform: 'scale(1)' },
})

/** Two staggered rings on ::before/::after and a breathing dot; app.css stops
 *  all three under prefers-reduced-motion, leaving the steady bloom. */
const glows = stylex.create({
  brand: {
    animationDuration: motion.pulse,
    animationIterationCount: 'infinite',
    animationName: breathe,
    animationTimingFunction: motion.ease,
    boxShadow: shadow.glowBrand,
    '::before': {
      animationDelay: `calc(${motion.pulse} / 2)`,
      animationDuration: motion.pulse,
      animationIterationCount: 'infinite',
      animationName: ring,
      animationTimingFunction: motion.easeOut,
      borderColor: color.surfaceBrand,
      borderRadius: radius.circle,
      borderStyle: 'solid',
      borderWidth: '2px',
      content: '""',
      inset: 0,
      position: 'absolute',
    },
    '::after': {
      animationDuration: motion.pulse,
      animationIterationCount: 'infinite',
      animationName: ring,
      animationTimingFunction: motion.easeOut,
      borderColor: color.surfaceBrand,
      borderRadius: radius.circle,
      borderStyle: 'solid',
      borderWidth: '2px',
      content: '""',
      inset: 0,
      position: 'absolute',
    },
  },
  success: {
    animationDuration: motion.pulse,
    animationIterationCount: 'infinite',
    animationName: breathe,
    animationTimingFunction: motion.ease,
    boxShadow: shadow.glowSuccess,
    '::before': {
      animationDelay: `calc(${motion.pulse} / 2)`,
      animationDuration: motion.pulse,
      animationIterationCount: 'infinite',
      animationName: ring,
      animationTimingFunction: motion.easeOut,
      borderColor: color.textSuccess,
      borderRadius: radius.circle,
      borderStyle: 'solid',
      borderWidth: '2px',
      content: '""',
      inset: 0,
      position: 'absolute',
    },
    '::after': {
      animationDuration: motion.pulse,
      animationIterationCount: 'infinite',
      animationName: ring,
      animationTimingFunction: motion.easeOut,
      borderColor: color.textSuccess,
      borderRadius: radius.circle,
      borderStyle: 'solid',
      borderWidth: '2px',
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
