import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import type { SpaceStep } from './Stack'
import { space } from '../styles/tokens.stylex'

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
  list: {
    display: 'flex',
    listStyle: 'none',
    marginBlock: 0,
    paddingInline: 0,
  },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  wrap: { flexWrap: 'wrap' },
  center: { justifyContent: 'center' },
  item: { alignItems: 'center', display: 'flex', gap: space.s8 },
})

type ListProps = {
  ordered?: boolean
  gap?: SpaceStep
  direction?: 'row' | 'column'
  wrap?: boolean
  center?: boolean
  label?: string
  children?: React.ReactNode
  style?: StyleProp
}

/** Owns list-style:none and the flex layout behind every <li> on the site. */
export function List({
  ordered = false,
  gap,
  direction = 'column',
  wrap = false,
  center = false,
  label,
  children,
  style,
}: ListProps) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag
      aria-label={label}
      {...stylex.props(
        base.list,
        direction === 'row' ? base.row : base.column,
        wrap && base.wrap,
        center && base.center,
        gap && gaps[gap],
        style,
      )}
    >
      {children}
    </Tag>
  )
}

export function ListItem({ children, style }: { children?: React.ReactNode; style?: StyleProp }) {
  return <li {...stylex.props(base.item, style)}>{children}</li>
}
