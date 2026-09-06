import * as stylex from '@stylexjs/stylex'

import { Card } from '../base/Card'
import { Eyebrow } from '../base/Eyebrow'
import { Grid } from '../base/Grid'
import { Heading } from '../base/Heading'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { m } from '../messages'
import { layout, space } from '../styles/tokens.stylex'

const HEADING_ID = 'results-h'

/**
 * Results mode. Launches in "coming soon" because Execile has no measured
 * client outcomes yet, and placeholder case studies would read as real ones
 * (see CONTEXT.md). Flip to case studies only when the numbers exist and the
 * client has approved sharing them. The disclosure every published outcome
 * must carry is written down in docs/research/competitor-landing-pages.md.
 */
const SHOW_CASE_STUDIES = false

const styles = stylex.create({
  intro: { maxWidth: layout.containerText },
  /** Attribution, as in Problem: a third party's benchmark, never a claim
   *  about Execile's own results. `auto` pins it to the foot of the card, so
   *  the one card that carries a source still lines up with the row. */
  source: { marginBlockStart: 'auto', paddingBlockStart: space.s12 },
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
          {SHOW_CASE_STUDIES ? null : <Prose size="lead">{m.results.comingSoon}</Prose>}
        </Stack>

        <Stack gap="s18">
          <Heading level={3} size="xl">
            {m.results.measuresTitle}
          </Heading>
          <Grid floor="md" gap="s18">
            {m.results.measures.map((measure) => (
              <Card key={measure.title} interactive>
                <Stack gap="s8">
                  <Heading level={4} size="lg">
                    {measure.title}
                  </Heading>
                  <Prose>{measure.blurb}</Prose>
                </Stack>
                {'source' in measure ? (
                  <Text size="xs" tone="muted" style={styles.source}>
                    {measure.source}
                  </Text>
                ) : null}
              </Card>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Section>
  )
}
