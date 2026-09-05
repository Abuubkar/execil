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
import { color, layout, radius, space, text } from '../styles/tokens.stylex'

const HEADING_ID = 'how-h'

const styles = stylex.create({
  intro: { maxWidth: layout.containerText },
  card: { gap: space.s14 },
  marker: {
    alignItems: 'center',
    backgroundColor: color.surfaceBrand,
    borderRadius: radius.circle,
    color: color.surfaceRaised,
    display: 'flex',
    flex: 'none',
    fontSize: text.md,
    fontWeight: text.weightBlack,
    height: '36px',
    justifyContent: 'center',
    width: '36px',
  },
})

export function HowItWorks() {
  return (
    <Section id="how" labelledBy={HEADING_ID} tone="page" size="lg">
      <Stack gap="s40">
        <Stack gap="s12" style={styles.intro}>
          <Eyebrow>{m.how.eyebrow}</Eyebrow>
          <Heading level={2} size="displayMd" id={HEADING_ID}>
            {m.how.title}
          </Heading>
        </Stack>

        <Grid floor="sm" gap="s18">
          {m.how.steps.map((step, index) => (
            <Card key={step.title} tone="raised" style={styles.card}>
              {/* aria-hidden: the step order is conveyed by document order, and
                  reading "1" before every heading is noise. */}
              <Text aria-hidden style={styles.marker}>
                {String(index + 1)}
              </Text>
              <Heading level={3} size="lg">
                {step.title}
              </Heading>
              <Prose>{step.blurb}</Prose>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  )
}
