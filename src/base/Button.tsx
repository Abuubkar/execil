import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { color, motion, radius, space, text } from '../styles/tokens.stylex'

/** No `as` prop. A link that looks like a button is Link variant="button" —
 *  that keeps the semantics honest (issue #9). */
export type ButtonVariant = 'primary' | 'secondary'

const variants = stylex.create({
  primary: {
    backgroundColor: {
      default: color.surfaceBrand,
      ':hover': color.surfaceBrandHover,
      ':disabled': color.textSubtle,
    },
    borderWidth: 0,
    color: color.surfaceRaised,
  },
  secondary: {
    backgroundColor: color.surfaceRaised,
    borderColor: { default: color.borderStrong, ':hover': color.textLink },
    borderStyle: 'solid',
    borderWidth: '1px',
    color: { default: color.textHeading, ':hover': color.textLinkHover },
  },
})

const base = stylex.create({
  button: {
    borderRadius: radius.xl,
    cursor: { default: 'pointer', ':disabled': 'default' },
    fontFamily: 'inherit',
    fontSize: text.md,
    fontWeight: text.weightSemibold,
    paddingBlock: space.s14,
    paddingInline: space.s24,
    transitionDuration: motion.fast,
    transitionProperty: 'background-color, border-color, color',
    transitionTimingFunction: motion.ease,
  },
})

export function Button({
  type = 'button',
  variant = 'primary',
  disabled = false,
  busy = false,
  onClick,
  children,
  style,
}: {
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  disabled?: boolean
  busy?: boolean
  onClick?: () => void
  children?: React.ReactNode
  style?: StyleProp
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-busy={busy || undefined}
      onClick={onClick}
      {...stylex.props(base.button, variants[variant], style)}
    >
      {children}
    </button>
  )
}
