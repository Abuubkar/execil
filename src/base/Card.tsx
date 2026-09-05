import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { color, motion, radius, shadow, space } from '../styles/tokens.stylex'

export type CardTone = 'raised' | 'page'
export type CardElevation = 'sm' | 'md'

const tones = stylex.create({
  raised: { backgroundColor: color.surfaceRaised },
  page: { backgroundColor: color.surfacePage },
})

const elevations = stylex.create({
  sm: { boxShadow: shadow.sm },
  md: { boxShadow: shadow.md },
})

const base = stylex.create({
  card: {
    borderColor: color.borderDefault,
    borderRadius: radius['2xl'],
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    padding: space.s24,
  },
  borderless: { borderWidth: 0, borderRadius: radius['3xl'] },
  // The lift is decoration, so it is guarded to hover-capable pointers. On
  // touch a plain :hover sticks after a tap and the card looks stuck.
  interactive: {
    transitionDuration: motion.fast,
    transitionProperty: 'transform, box-shadow',
    transitionTimingFunction: motion.ease,
    '@media (hover: hover)': {
      ':hover': { boxShadow: shadow.lg, transform: 'translateY(-2px)' },
    },
  },
})

export function Card({
  tone = 'raised',
  elevation = 'sm',
  interactive = false,
  borderless = false,
  gap,
  children,
  style,
}: {
  tone?: CardTone
  elevation?: CardElevation
  interactive?: boolean
  borderless?: boolean
  gap?: string
  children?: React.ReactNode
  style?: StyleProp
}) {
  return (
    <article
      {...stylex.props(
        base.card,
        tones[tone],
        elevations[elevation],
        borderless && base.borderless,
        interactive && base.interactive,
        style,
      )}
      data-gap={gap}
    >
      {children}
    </article>
  )
}
