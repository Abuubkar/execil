import * as stylex from '@stylexjs/stylex'

import { Text } from './Text'
import type { Tone } from './Text'
import { text } from '../styles/tokens.stylex'

const styles = stylex.create({
  eyebrow: {
    letterSpacing: text.trackingWide,
    textTransform: 'uppercase',
  },
})

/** The small uppercase label above a section or card heading. */
export function Eyebrow({ tone = 'link', children }: { tone?: Tone; children?: React.ReactNode }) {
  return (
    <Text size="md" tone={tone} weight="semibold" style={styles.eyebrow}>
      {children}
    </Text>
  )
}
