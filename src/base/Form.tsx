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
  children,
  style,
}: {
  /** Names the form for assistive tech. */
  label: string
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  children?: React.ReactNode
  style?: StyleProp
}) {
  return (
    <form
      aria-label={label}
      onSubmit={onSubmit}
      noValidate={false}
      {...stylex.props(styles.form, style)}
    >
      {children}
    </form>
  )
}
