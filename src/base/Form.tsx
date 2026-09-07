import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { color, radius, space } from '../styles/tokens.stylex'

const styles = stylex.create({
  form: {
    backgroundColor: color.surfaceRaised,
    borderColor: color.borderDefault,
    borderRadius: radius['3xl'],
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    gap: space.s14,
    padding: space.s24,
  },
})

export function Form({
  label,
  onSubmit,
  onFocusCapture,
  children,
  style,
}: {
  /** Names the form for assistive tech. */
  label: string
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  /** Used to lazy-load third-party form scripts on first interaction. */
  onFocusCapture?: () => void
  children?: React.ReactNode
  style?: StyleProp
}) {
  return (
    <form
      aria-label={label}
      onSubmit={onSubmit}
      onFocusCapture={onFocusCapture}
      noValidate={false}
      {...stylex.props(styles.form, style)}
    >
      {children}
    </form>
  )
}
