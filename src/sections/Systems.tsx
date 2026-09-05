import * as stylex from '@stylexjs/stylex'

import { Heading } from '../base/Heading'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { m } from '../messages'
import { color, radius, space, text } from '../styles/tokens.stylex'

const HEADING_ID = 'systems-h'

const styles = stylex.create({
  pill: {
    backgroundColor: color.surfaceAccent,
    borderRadius: radius.lg,
    fontSize: text.md,
    fontWeight: text.weightMedium,
    paddingBlock: space.s8,
    paddingInline: space.s14,
  },
})

export function Systems() {
  return (
    <Section labelledBy={HEADING_ID} tone="page" size="sm">
      <Stack gap="s20">
        <Heading level={2} size="2xl" id={HEADING_ID}>
          {m.systems.title}
        </Heading>
        <List direction="row" wrap gap="s10" label={m.systems.label}>
          {m.systems.items.map((item) => (
            <ListItem key={item} style={styles.pill}>
              <Text size="md" tone="link">
                {item}
              </Text>
            </ListItem>
          ))}
        </List>
        <Prose>{m.systems.note}</Prose>
      </Stack>
    </Section>
  )
}
