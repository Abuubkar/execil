import { createFileRoute } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'

import { Box } from '../base/Box'
import { m } from '../messages'
import { color, layout, radius, space, text } from '../styles/tokens.stylex'
import { darkSurface } from '../styles/theme'

export const Route = createFileRoute('/')({ component: Home })

// Placeholder composition. Sections replace this from issue #22 onward — it
// exists here to prove tokens, roles, the Dark theme and the font all resolve.
const styles = stylex.create({
  page: {
    backgroundColor: color.surfacePage,
    color: color.textProse,
    fontFamily: text.familySans,
    minHeight: '100vh',
    paddingBlock: space.sectionMd,
    paddingInline: space.gutter,
  },
  container: {
    marginInline: 'auto',
    maxWidth: layout.containerText,
  },
  heading: {
    color: color.textHeading,
    fontSize: text.displayMd,
    fontWeight: text.weightBlack,
    letterSpacing: text.trackingTight,
    lineHeight: text.leadingHeading,
    marginBlock: 0,
  },
  body: {
    fontSize: text.md,
    lineHeight: text.leadingBody,
    marginBlockStart: space.s16,
  },
  inverse: {
    backgroundColor: color.surfacePage,
    borderRadius: radius['3xl'],
    color: color.textProse,
    marginBlockStart: space.s32,
    padding: space.s24,
  },
})

function Home() {
  return (
    <Box as="main" style={styles.page}>
      <Box style={styles.container}>
        <Box style={styles.heading}>{m.scaffold.heading}</Box>
        <Box style={styles.body}>{m.scaffold.body}</Box>

        {/* Dark theme on a subtree — the same Roles resolve to inverse values. */}
        <Box style={[darkSurface, styles.inverse]}>
          <Box style={styles.body}>{m.scaffold.inverse}</Box>
        </Box>
      </Box>
    </Box>
  )
}
