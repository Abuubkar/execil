import * as stylex from '@stylexjs/stylex'

import { Eyebrow } from '../base/Eyebrow'
import { Grid } from '../base/Grid'
import { Heading } from '../base/Heading'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { m } from '../messages'
import { color, layout, radius, space, text } from '../styles/tokens.stylex'

const HEADING_ID = 'spec-h'

const styles = stylex.create({
  intro: { maxWidth: layout.containerText },
  pill: {
    backgroundColor: color.surfaceAccent,
    borderColor: 'transparent',
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: '1px',
    fontSize: text.md,
    fontWeight: text.weightMedium,
    paddingBlock: space.s10,
    paddingInline: space.s16,
  },
  // Dashed outline marks the open-ended "+ more" pill, matching the canvas.
  pillMore: {
    backgroundColor: 'transparent',
    borderColor: color.borderDashed,
    borderStyle: 'dashed',
  },
})

export function Specialties() {
  return (
    <Section id="specialties" labelledBy={HEADING_ID} tone="raised" size="md">
      <Grid floor="lg" gap="s32" align="center">
        <Stack gap="s12" style={styles.intro}>
          <Eyebrow>{m.specialties.eyebrow}</Eyebrow>
          <Heading level={2} size="displayMd" id={HEADING_ID}>
            {m.specialties.title}
          </Heading>
          <Prose>{m.specialties.lead}</Prose>
        </Stack>

        <List direction="row" wrap gap="s10" label={m.specialties.label}>
          {m.specialties.items.map((item) => (
            <ListItem key={item} style={styles.pill}>
              <Text size="md" tone="link">
                {item}
              </Text>
            </ListItem>
          ))}
          <ListItem style={[styles.pill, styles.pillMore]}>
            <Text size="md" tone="muted">
              {m.specialties.more}
            </Text>
          </ListItem>
        </List>
      </Grid>
    </Section>
  )
}
