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
import { layout, space, text } from '../styles/tokens.stylex'

const HEADING_ID = 'problem-h'

const styles = stylex.create({
  intro: { maxWidth: layout.containerText },
  stat: {
    fontSize: text['3xl'],
    fontWeight: text.weightBlack,
    letterSpacing: text.trackingTight,
  },
  /** Attribution. Every statistic here is an industry figure from a named
   *  third party — never a claim about Execile's own results (issue #19). */
  source: { marginBlockStart: space.s12 },
})

export function Problem() {
  return (
    <Section labelledBy={HEADING_ID} tone="page" size="lg">
      <Stack gap="s32">
        <Stack gap="s12" style={styles.intro}>
          <Eyebrow tone="danger">{m.problem.eyebrow}</Eyebrow>
          <Heading level={2} size="displayMd" id={HEADING_ID}>
            {m.problem.title}
          </Heading>
        </Stack>

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
              <Text size="xs" tone="muted" style={styles.source}>
                {card.source}
              </Text>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
