import * as stylex from '@stylexjs/stylex'

import { Card } from '../base/Card'
import { Dot } from '../base/Dot'
import { Eyebrow } from '../base/Eyebrow'
import { Grid } from '../base/Grid'
import { Heading } from '../base/Heading'
import type { IconName } from '../base/Icon'
import { IconTile } from '../base/IconTile'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { m } from '../messages'
import { layout, space, text } from '../styles/tokens.stylex'

const HEADING_ID = 'services-h'

const styles = stylex.create({
  intro: { maxWidth: layout.containerHero },
  card: { gap: space.s16 },
  item: { alignItems: 'flex-start' },
  itemDot: { marginBlockStart: space.s6 },
  itemText: { lineHeight: text.leadingBody },
  footnote: { textAlign: 'center' },
})

export function Services() {
  return (
    <Section id="services" labelledBy={HEADING_ID} tone="accent" size="lg">
      <Stack gap="s40">
        <Stack gap="s12" style={styles.intro}>
          <Eyebrow>{m.services.eyebrow}</Eyebrow>
          <Heading level={2} size="displayMd" tone="link" id={HEADING_ID}>
            {m.services.title}
          </Heading>
        </Stack>

        <Grid floor="md" gap="s18">
          {m.services.cards.map((card) => (
            <Card key={card.title} elevation="md" borderless style={styles.card}>
              <IconTile icon={card.icon as IconName} />
              <Stack gap="s6">
                <Eyebrow>{card.eyebrow}</Eyebrow>
                <Heading level={3} size="xl">
                  {card.title}
                </Heading>
                <Prose>{card.blurb}</Prose>
              </Stack>
              <List gap="s10">
                {card.items.map((item) => (
                  <ListItem key={item} style={styles.item}>
                    <Dot tone="brand" size="xs" style={styles.itemDot} />
                    <Text size="md" tone="body" style={styles.itemText}>
                      {item}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </Card>
          ))}
        </Grid>

        <Prose style={styles.footnote}>{m.services.footnote}</Prose>
      </Stack>
    </Section>
  )
}
