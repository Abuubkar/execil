import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import type { SpaceStep } from './Stack'
import { layout, space } from '../styles/tokens.stylex'

/** The normalised minmax() floors — 8 raw canvas values collapsed to 3. */
export type GridFloor = 'sm' | 'md' | 'lg'

const floors = stylex.create({
  sm: { gridTemplateColumns: `repeat(auto-fit, minmax(${layout.gridFloorSm}, 1fr))` },
  md: { gridTemplateColumns: `repeat(auto-fit, minmax(${layout.gridFloorMd}, 1fr))` },
  lg: { gridTemplateColumns: `repeat(auto-fit, minmax(${layout.gridFloorLg}, 1fr))` },
})

const gaps = stylex.create({
  s4: { gap: space.s4 },
  s6: { gap: space.s6 },
  s8: { gap: space.s8 },
  s10: { gap: space.s10 },
  s12: { gap: space.s12 },
  s14: { gap: space.s14 },
  s16: { gap: space.s16 },
  s18: { gap: space.s18 },
  s20: { gap: space.s20 },
  s24: { gap: space.s24 },
  s28: { gap: space.s28 },
  s32: { gap: space.s32 },
  s40: { gap: space.s40 },
  s48: { gap: space.s48 },
})

const aligns = stylex.create({
  start: { alignItems: 'start' },
  center: { alignItems: 'center' },
})

const base = stylex.create({ grid: { display: 'grid' } })

/** Intrinsic layout — auto-fit with a minmax floor, no media queries. */
export function Grid({
  floor = 'md',
  gap = 's18',
  align,
  children,
  style,
}: {
  floor?: GridFloor
  gap?: SpaceStep
  /** Cross-axis alignment. Omit to keep the default stretch, which is what a
   *  row of equal-height cards wants. */
  align?: 'start' | 'center'
  children?: React.ReactNode
  style?: StyleProp
}) {
  return (
    <div {...stylex.props(base.grid, floors[floor], gaps[gap], align && aligns[align], style)}>
      {children}
    </div>
  )
}
