import { createFileRoute } from '@tanstack/react-router'

import { Box } from '../base/Box'
import { Hero } from '../sections/Hero'

export const Route = createFileRoute('/')({ component: Home })

/** tabIndex -1 so the skip link (issue #23) can move focus here, not just
 *  scroll. The id matches the canvas's <main id="top">. */
function Home() {
  return (
    <Box as="main" id="top" tabIndex={-1}>
      <Hero />
    </Box>
  )
}
