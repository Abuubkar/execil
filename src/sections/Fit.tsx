import * as stylex from '@stylexjs/stylex'

import { Card } from '../base/Card'
import { Dot } from '../base/Dot'
import { Grid } from '../base/Grid'
import { Heading } from '../base/Heading'
import { List, ListItem } from '../base/List'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { m } from '../messages'
import { color, space, text } from '../styles/tokens.stylex'

const HEADING_ID = 'fit-h'

const styles = stylex.create({
  item: { alignItems: 'flex-start' },
  itemText: { lineHeight: text.leadingBody },
  tick: {
    color: color.textSuccess,
    flex: 'none',
    fontWeight: text.weightBold,
    marginBlockStart: '1px',
  },
  dash: { marginBlockStart: space.s8 },
})

export function Fit() {
  return (
    <Section labelledBy={HEADING_ID} tone="raised" size="md">
      <Stack gap="s32">
        <Heading level={2} size="displayMd" id={HEADING_ID}>
          {m.fit.title}
        </Heading>

        <Grid floor="lg" gap="s18">
          <Card tone="page">
            <Stack gap="s16">
              <Heading level={3} size="lg">
                {m.fit.goodTitle}
              </Heading>
              <List gap="s12">
                {m.fit.good.map((item) => (
                  <ListItem key={item} style={styles.item}>
                    <Text aria-hidden tone="success" style={styles.tick}>
                      ✓
                    </Text>
                    <Text size="md" tone="body" style={styles.itemText}>
                      {item}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Card>

          <Card tone="page">
            <Stack gap="s16">
              <Heading level={3} size="lg">
                {m.fit.badTitle}
              </Heading>
              <List gap="s12">
                {m.fit.bad.map((item) => (
                  <ListItem key={item} style={styles.item}>
                    <Dot tone="subtle" size="xs" style={styles.dash} />
                    <Text size="md" tone="prose" style={styles.itemText}>
                      {item}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Section>
  )
}
