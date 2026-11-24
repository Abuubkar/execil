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
  PROBLEM_HEIGHT,
  PROBLEM_SRC,
  PROBLEM_SRCSET,
  PROBLEM_WIDTH,
  SECTION_SIZES,
} from '../section-images'
import { layout, radius, screen, shadow, space, text } from '../styles/tokens.stylex'

const HEADING_ID = 'problem-h'

const styles = stylex.create({
  /** Intro and photograph share a row so the card grid below is untouched. */
  head: {
    alignItems: 'center',
    display: 'grid',
    gap: space.s32,
    gridTemplateColumns: { default: '1fr', [screen.navUp]: '1fr 1fr' },
  },
  intro: { maxWidth: layout.containerText },
  figure: {
    aspectRatio: '16 / 9',
    borderRadius: radius['3xl'],
    boxShadow: shadow.lg,
    maxWidth: layout.containerText,
    overflow: 'hidden',
    width: '100%',
  },
  stat: {
    fontSize: text['3xl'],
    fontWeight: text.weightBlack,
    letterSpacing: text.trackingTight,
  },
  /** Attribution. Every statistic here is an industry figure from a named
   *  third party — never a claim about Execil's own results (issue #19). */
  source: { marginBlockStart: space.s12 },
})

export function Problem() {
  return (
    <Section labelledBy={HEADING_ID} tone="page" size="lg">
      <Stack gap="s32">
        <Box style={styles.head}>
          <Stack gap="s12" style={styles.intro}>
            <Eyebrow tone="danger">{m.problem.eyebrow}</Eyebrow>
            <Heading level={2} size="displayMd" id={HEADING_ID}>
              {m.problem.title}
            </Heading>
          </Stack>

          <Box style={styles.figure}>
            <Image
              src={PROBLEM_SRC}
              srcSet={PROBLEM_SRCSET}
              sizes={SECTION_SIZES}
              width={PROBLEM_WIDTH}
              height={PROBLEM_HEIGHT}
              alt={m.problem.imageAlt}
            />
          </Box>
        </Box>

        <Grid floor="md" gap="s18">
          {m.problem.cards.map((card) => (
            <Card key={card.title} interactive>
              <Stack gap="s12">
                <Text tone="stat" style={styles.stat}>
                  {card.stat}
                </Text>
                <Heading level={3} size="lg">
                  {card.title}
                </Heading>
                <Prose>{card.blurb}</Prose>
              </Stack>
              <Text size="sm" tone="muted" style={styles.source}>
                {card.source}
              </Text>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
