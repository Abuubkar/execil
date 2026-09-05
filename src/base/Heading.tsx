import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import type { Tone } from './Text'
import { color, text } from '../styles/tokens.stylex'

/** `level` sets semantics; `size` sets appearance. Deliberately independent,
 *  so an h3 can render large without lying about document structure. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingSize = 'displayLg' | 'displayMd' | '3xl' | '2xl' | 'xl' | 'lg'

const sizes = stylex.create({
  displayLg: { fontSize: text.displayLg, lineHeight: text.leadingTight },
  displayMd: { fontSize: text.displayMd, lineHeight: text.leadingHeading },
  '3xl': { fontSize: text['3xl'], lineHeight: text.leadingHeading },
  '2xl': { fontSize: text['2xl'], lineHeight: text.leadingSnug },
  xl: { fontSize: text.xl, lineHeight: text.leadingSnug },
  lg: { fontSize: text.lg, lineHeight: text.leadingSnug },
})

const tones = stylex.create({
  heading: { color: color.textHeading },
  body: { color: color.textBody },
  secondary: { color: color.textSecondary },
  prose: { color: color.textProse },
  muted: { color: color.textMuted },
  link: { color: color.textLink },
  danger: { color: color.textDanger },
  success: { color: color.textSuccess },
  accentDisplay: { color: color.textAccentDisplay },
})

const base = stylex.create({
  heading: {
    fontWeight: text.weightBlack,
    letterSpacing: text.trackingTight,
    marginBlock: 0,
    textWrap: 'balance',
  },
})

type HeadingProps = {
  level: HeadingLevel
  size: HeadingSize
  tone?: Tone
  id?: string
  children?: React.ReactNode
  style?: StyleProp
}

export function Heading({ level, size, tone = 'heading', id, children, style }: HeadingProps) {
  const Tag = `h${level}` as const
  return (
    <Tag id={id} {...stylex.props(base.heading, sizes[size], tones[tone], style)}>
      {children}
    </Tag>
  )
}
