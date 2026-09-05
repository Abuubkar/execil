import { createFileRoute } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'

import { Box } from '../base/Box'
import { m } from '../messages'

export const Route = createFileRoute('/')({ component: Home })

// Placeholder styling. Real tokens arrive in issue #21; sections in #22 onward.
const styles = stylex.create({
  main: {
    width: 'min(42rem, calc(100% - 2rem))',
    marginBlock: '4rem',
    marginInline: 'auto',
    fontFamily: 'system-ui, sans-serif',
  },
})

function Home() {
  return (
    <Box as="main" style={styles.main}>
      <Box>{m.scaffold.heading}</Box>
      <Box>{m.scaffold.body}</Box>
    </Box>
  )
}
