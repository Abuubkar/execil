import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { color, text } from '../styles/tokens.stylex'

/** Closed union — never unrestricted. */
export type TextElement = 'span' | 'p' | 'label'

export type TextSize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'lead'

export type Tone =
  | 'heading'
  | 'body'
  | 'secondary'
  | 'prose'
  | 'muted'
  | 'link'
  | 'danger'
  | 'success'
  | 'accentDisplay'

export type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'black'

const sizes = stylex.create({
  xs: { fontSize: text.xs },
  sm: { fontSize: text.sm },
  base: { fontSize: text.base },
  md: { fontSize: text.md },
  lg: { fontSize: text.lg },
  xl: { fontSize: text.xl },
  '2xl': { fontSize: text['2xl'] },
  '3xl': { fontSize: text['3xl'] },
  lead: { fontSize: text.lead },
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

const weights = stylex.create({
  regular: { fontWeight: text.weightRegular },
  medium: { fontWeight: text.weightMedium },
  semibold: { fontWeight: text.weightSemibold },
  bold: { fontWeight: text.weightBold },
  black: { fontWeight: text.weightBlack },
})

const base = stylex.create({
  reset: { marginBlock: 0 },
})

type TextProps = {
  as?: TextElement
  size?: TextSize
  tone?: Tone
  weight?: Weight
  children?: React.ReactNode
  style?: StyleProp
  htmlFor?: string
  /** For decorative text whose meaning is already carried by context. */
  'aria-hidden'?: boolean
}

/** Tokens reach this component only as variant props — never raw values. */
export function Text({
  as: Tag = 'span',
  size,
  tone,
  weight,
  children,
  style,
  htmlFor,
  'aria-hidden': ariaHidden,
}: TextProps) {
  return (
    <Tag
      htmlFor={htmlFor}
      aria-hidden={ariaHidden}
      {...stylex.props(
        base.reset,
        size && sizes[size],
        tone && tones[tone],
        weight && weights[weight],
        style,
      )}
    >
      {children}
    </Tag>
  )
}
