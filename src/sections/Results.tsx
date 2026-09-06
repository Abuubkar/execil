import * as stylex from '@stylexjs/stylex'

import { Dot } from '../base/Dot'
import { Eyebrow } from '../base/Eyebrow'
import { Heading } from '../base/Heading'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { m } from '../messages'
import { color, layout, radius, space } from '../styles/tokens.stylex'

const HEADING_ID = 'results-h'

/**
 * Results mode. Launches in "coming soon" because Execile has no measured
 * client outcomes yet, and placeholder case studies would read as real ones
 * (see CONTEXT.md). Flip to case studies only when the numbers exist and the
 * client has approved sharing them.
 */
const SHOW_CASE_STUDIES = false

const styles = stylex.create({
  intro: { maxWidth: layout.containerText },
  notice: {
    borderColor: color.borderDashed,
    borderRadius: radius['2xl'],
    borderStyle: 'dashed',
    borderWidth: '1px',
    paddingBlock: space.s40,
    paddingInline: space.s24,
  },
  measures: { maxWidth: layout.containerText },
  item: { alignItems: 'flex-start' },
  itemDot: { marginBlockStart: space.s8 },
  itemText: { flex: 1 },
})

export function Results() {
  return (
    <Section labelledBy={HEADING_ID} tone="page" size="lg">
      <Stack gap="s32">
        <Stack gap="s12" style={styles.intro}>
          <Eyebrow>{m.results.eyebrow}</Eyebrow>
          <Heading level={2} size="displayMd" id={HEADING_ID}>
            {m.results.title}
          </Heading>
        </Stack>

        {SHOW_CASE_STUDIES ? null : (
          <Stack gap="s24" style={styles.notice}>
            <Prose>{m.results.comingSoon}</Prose>

            <Stack gap="s12" style={styles.measures}>
              <Heading level={3} size="lg">
                {m.results.measuresTitle}
              </Heading>
              <List gap="s10">
                {m.results.measures.map((measure) => (
                  <ListItem key={measure} style={styles.item}>
                    <Dot tone="brand" size="xs" style={styles.itemDot} />
                    <Text size="md" tone="body" style={styles.itemText}>
                      {measure}
                    </Text>
                  </ListItem>
                ))}
              </List>
              <Text as="p" size="sm" tone="muted">
                {m.results.measuresNote}
              </Text>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Section>
  )
}
