import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { space } from '../styles/tokens.stylex'

export type SpaceStep =
  | 's4'
  | 's6'
  | 's8'
  | 's10'
  | 's12'
  | 's14'
  | 's16'
  | 's18'
  | 's20'
  | 's24'
  | 's28'
  | 's32'
  | 's40'
  | 's48'

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

const base = stylex.create({
  stack: { display: 'flex' },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  wrap: { flexWrap: 'wrap' },
  alignStart: { alignItems: 'flex-start' },
  alignCenter: { alignItems: 'center' },
  alignEnd: { alignItems: 'flex-end' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
})

type StackProps = {
  gap?: SpaceStep
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'between'
  wrap?: boolean
  /** Live-region role for panels that announce a result (status / alert). */
  role?: 'status' | 'alert'
  children?: React.ReactNode
  style?: StyleProp
}

/** Layout from space tokens only. Components never set their own outer margin;
 *  spacing is the parent's job. */
export function Stack({
  gap,
  direction = 'column',
  align,
  justify,
  wrap = false,
  role,
  children,
  style,
}: StackProps) {
  return (
    <div
      role={role}
      {...stylex.props(
        base.stack,
        direction === 'row' ? base.row : base.column,
        wrap && base.wrap,
        align === 'start' && base.alignStart,
        align === 'center' && base.alignCenter,
        align === 'end' && base.alignEnd,
        justify === 'start' && base.justifyStart,
        justify === 'center' && base.justifyCenter,
        justify === 'between' && base.justifyBetween,
        gap && gaps[gap],
        style,
      )}
    >
      {children}
    </div>
  )
}
