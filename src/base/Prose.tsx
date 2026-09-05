import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import type { TextSize } from './Text'
import { Text } from './Text'
import { text } from '../styles/tokens.stylex'

const styles = stylex.create({
  prose: { lineHeight: text.leadingBody, textWrap: 'pretty' },
})

/** Body copy: prose tone, body leading, pretty wrapping. */
export function Prose({
  size = 'md',
  children,
  style,
}: {
  size?: TextSize
  children?: React.ReactNode
  style?: StyleProp
}) {
  return (
    <Text as="p" size={size} tone="prose" style={[styles.prose, style]}>
      {children}
    </Text>
  )
}
