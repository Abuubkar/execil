import * as stylex from '@stylexjs/stylex'

import { Icon } from './Icon'

import { color, radius, space, text } from '../styles/tokens.stylex'

export const controlStyles = stylex.create({
  control: {
    appearance: 'none',
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
      outlineOffset: '-1px',
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

const selectStyles = stylex.create({
  wrap: { display: 'block', position: 'relative' },
  field: { paddingInlineEnd: space.s40 },
  chevron: {
    alignItems: 'center',
    color: color.textMuted,
    display: 'flex',
    insetBlockEnd: 0,
    insetBlockStart: 0,
    insetInlineEnd: space.s14,
    pointerEvents: 'none',
    position: 'absolute',
  },
})

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
    <span {...stylex.props(selectStyles.wrap)}>
      <select
        name={name}
        required={required}
        defaultValue=""
        {...stylex.props(controlStyles.control, selectStyles.field)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span {...stylex.props(selectStyles.chevron)}>
        <Icon name="chevronDown" size="xs" />
      </span>
    </span>
  )
}
