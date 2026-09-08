import * as stylex from '@stylexjs/stylex'

import { Dot } from './Dot'
import type { DotTone } from './Dot'
import { color, radius, shadow, space, text } from '../styles/tokens.stylex'

export type BadgeTone = 'accent' | 'danger' | 'notice'

const tones = stylex.create({
  accent: {
    backgroundColor: color.surfaceAccent,
    borderColor: color.borderAccent,
    color: color.textLink,
  },
  danger: {
    backgroundColor: color.surfaceDanger,
    borderColor: color.surfaceDanger,
    color: color.textDanger,
  },
  notice: {
    backgroundColor: color.surfaceNotice,
    borderColor: color.surfaceNotice,
    color: color.textHeading,
  },
})

const base = stylex.create({
  badge: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: shadow.sm,
    display: 'inline-flex',
    fontSize: text.base,
    fontWeight: text.weightSemibold,
    gap: space.s8,
    paddingBlock: space.s6,
    paddingInline: space.s12,
  },
})

export function Badge({
  tone = 'accent',
  dot,
  children,
}: {
  tone?: BadgeTone
  /** Optional leading Dot; decorative, always aria-hidden. */
  dot?: DotTone
  children?: React.ReactNode
}) {
  return (
    <span {...stylex.props(base.badge, tones[tone])}>
      {dot ? <Dot tone={dot} size="sm" glow /> : null}
      {children}
    </span>
  )
}
