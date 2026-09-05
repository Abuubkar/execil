import * as stylex from '@stylexjs/stylex'

import { color, radius } from '../styles/tokens.stylex'

export type DotTone = 'brand' | 'success' | 'subtle'
export type DotSize = 'xs' | 'sm' | 'md'

const tones = stylex.create({
  brand: { backgroundColor: color.surfaceBrand },
  success: { backgroundColor: color.textSuccess },
  subtle: { backgroundColor: color.textSubtle },
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
export function Dot({ tone = 'brand', size = 'xs' }: { tone?: DotTone; size?: DotSize }) {
  return <span aria-hidden="true" {...stylex.props(base.dot, sizes[size], tones[tone])} />
}
