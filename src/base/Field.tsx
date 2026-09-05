import * as stylex from '@stylexjs/stylex'

import { Text } from './Text'
import { color, space, text } from '../styles/tokens.stylex'

const styles = stylex.create({
  field: { display: 'flex', flexDirection: 'column', gap: space.s6 },
  hint: { fontWeight: text.weightRegular },
  error: { color: color.textDanger },
})

/**
 * `label` is REQUIRED — a control cannot render without one. This is the
 * structural mitigation for jsx-no-literals not seeing attribute strings
 * (issue #11): the string arrives as a prop the rule does see.
 *
 * Wrapping the control in the label associates them without needing an id.
 */
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children?: React.ReactNode
}) {
  return (
    <Text as="label" size="base" tone="body" weight="semibold" style={styles.field}>
      <span>
        {label}
        {hint ? (
          <Text size="base" tone="muted" style={styles.hint}>
            {` ${hint}`}
          </Text>
        ) : null}
      </span>
      {children}
      {error ? (
        <Text size="base" tone="danger" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </Text>
  )
}
