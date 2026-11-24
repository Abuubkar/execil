import * as stylex from '@stylexjs/stylex'

import { Box } from '../base/Box'
import { Card } from '../base/Card'
import { Eyebrow } from '../base/Eyebrow'
import { Grid } from '../base/Grid'
import { Heading } from '../base/Heading'
import { Image } from '../base/Image'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { m } from '../messages'
import {
  RESULTS_HEIGHT,
  RESULTS_SRC,
  RESULTS_SRCSET,
  RESULTS_WIDTH,
  SECTION_SIZES,
} from '../section-images'
import { layout, radius, screen, shadow, space } from '../styles/tokens.stylex'

const HEADING_ID = 'results-h'

/**
 * Results mode. Launches in "coming soon" because Execil has no measured
 * client outcomes yet, and placeholder case studies would read as real ones
 * (see CONTEXT.md). Flip to case studies only when the numbers exist and the
 * client has approved sharing them. The disclosure every published outcome
 * must carry is written down in docs/research/competitor-landing-pages.md.
 */
const SHOW_CASE_STUDIES = false

const styles = stylex.create({
  /** Mirrors Problem, photograph first: the two sections bracket the page and
   *  the alternation reads as rhythm rather than a repeated template. */
  head: {
    alignItems: 'center',
    display: 'grid',
    gap: space.s32,
    gridTemplateColumns: { default: '1fr', [screen.navUp]: '1fr 1fr' },
  },
  intro: { maxWidth: layout.containerText },
  figure: {
    aspectRatio: '3 / 2',
    borderRadius: radius['3xl'],
    boxShadow: shadow.lg,
    maxWidth: layout.containerText,
    order: { default: 1, [screen.navUp]: -1 },
    overflow: 'hidden',
    width: '100%',
  },
  /** Attribution, as in Problem: a third party's benchmark, never a claim
   *  about Execil's own results. `auto` pins it to the foot of the card, so
   *  the one card that carries a source still lines up with the row. */
  source: { marginBlockStart: 'auto', paddingBlockStart: space.s12 },
})

export function Results() {
  return (
    <Section labelledBy={HEADING_ID} tone="page" size="lg">
      <Stack gap="s32">
        <Box style={styles.head}>
          <Stack gap="s12" style={styles.intro}>
            <Eyebrow>{m.results.eyebrow}</Eyebrow>
            <Heading level={2} size="displayMd" id={HEADING_ID}>
              {m.results.title}
            </Heading>
            {SHOW_CASE_STUDIES ? null : <Prose size="lead">{m.results.comingSoon}</Prose>}
          </Stack>

          <Box style={styles.figure}>
            <Image
              src={RESULTS_SRC}
              srcSet={RESULTS_SRCSET}
              sizes={SECTION_SIZES}
              width={RESULTS_WIDTH}
              height={RESULTS_HEIGHT}
              alt={m.results.imageAlt}
            />
          </Box>
        </Box>

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
                  <Text size="sm" tone="muted" style={styles.source}>
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
