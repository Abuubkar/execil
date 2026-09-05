import * as stylex from '@stylexjs/stylex'

import { Eyebrow } from '../base/Eyebrow'
import { Heading } from '../base/Heading'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Table } from '../base/Table'
import { darkSurface } from '../styles/theme'
import { m } from '../messages'
import { color, layout, radius, shadow, space } from '../styles/tokens.stylex'

const HEADING_ID = 'why-h'

const styles = stylex.create({
  intro: { maxWidth: layout.containerText },
  // The Inverse surface: the Dark theme on a subtree, so the SAME Role tokens
  // inside Table resolve to their dark values. No on-dark colour is hard-coded.
  card: {
    backgroundColor: color.surfaceInverse,
    borderRadius: radius['3xl'],
    boxShadow: shadow.xl,
    padding: space.s20,
  },
})

export function WhyUs() {
  return (
    <Section id="why" labelledBy={HEADING_ID} tone="page" size="lg">
      <Stack gap="s40">
        <Stack gap="s12" style={styles.intro}>
          <Eyebrow>{m.why.eyebrow}</Eyebrow>
          <Heading level={2} size="displayMd" id={HEADING_ID}>
            {m.why.title}
          </Heading>
        </Stack>

        <Stack style={[darkSurface, styles.card]}>
          <Table
            caption={m.why.table.caption}
            columns={m.why.table.columns}
            rows={m.why.table.rows}
          />
        </Stack>
      </Stack>
    </Section>
  )
}
