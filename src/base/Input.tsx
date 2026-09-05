import * as stylex from '@stylexjs/stylex'

import { color, radius, space, text } from '../styles/tokens.stylex'

export const controlStyles = stylex.create({
  control: {
    backgroundColor: color.surfaceRaised,
    borderColor: { default: color.borderStrong, ':focus': color.focusRing },
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: '1px',
    color: color.textBody,
    fontFamily: 'inherit',
    fontSize: text.md,
    height: '46px',
    outlineWidth: 0,
    paddingInline: space.s14,
    width: '100%',
    ':focus-visible': {
      outlineColor: color.focusRing,
      outlineOffset: '1px',
      outlineStyle: 'solid',
      outlineWidth: '2px',
    },
  },
  multiline: { height: 'auto', paddingBlock: space.s12, resize: 'vertical' },
})

export type InputType = 'text' | 'email' | 'tel'

export function Input({
  name,
  type = 'text',
  autoComplete,
  required = false,
}: {
  name: string
  type?: InputType
  autoComplete?: string
  required?: boolean
}) {
  return (
    <input
      name={name}
      type={type}
      autoComplete={autoComplete}
      required={required}
      {...stylex.props(controlStyles.control)}
    />
  )
}

export function Textarea({
  name,
  rows = 3,
  required = false,
}: {
  name: string
  rows?: number
  required?: boolean
}) {
  return (
    <textarea
      name={name}
      rows={rows}
      required={required}
      {...stylex.props(controlStyles.control, controlStyles.multiline)}
    />
  )
}

export function Select({
  name,
  options,
  placeholder,
  required = false,
}: {
  name: string
  options: readonly string[]
  placeholder: string
  required?: boolean
}) {
  return (
    <select
      name={name}
      required={required}
      defaultValue=""
      {...stylex.props(controlStyles.control)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
