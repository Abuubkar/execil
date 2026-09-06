import * as stylex from '@stylexjs/stylex'

import { Heading } from '../base/Heading'
import { Link } from '../base/Link'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { m } from '../messages'
import { color, motion, radius, space, text } from '../styles/tokens.stylex'

const HEADING_ID = 'systems-h'

const styles = stylex.create({
  pill: {
    borderRadius: radius.lg,
    display: 'inline-block',
    fontSize: text.md,
    fontWeight: text.weightMedium,
    paddingBlock: space.s8,
    paddingInline: space.s14,
  },
  vendor: {
    backgroundColor: { default: color.surfaceAccent, ':hover': color.borderAccent },
    color: color.textLink,
    textDecoration: 'none',
    transitionDuration: motion.fast,
    transitionProperty: 'background-color',
    transitionTimingFunction: motion.ease,
  },
  /** Not a link: there is no vendor behind it. Quieter surface and muted ink so
   *  it reads as "the list continues" rather than a pill nobody can click. */
  more: { backgroundColor: color.surfaceAccentSoft },
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
            <ListItem key={item.name}>
              <Link href={item.href} variant="plain" external style={[styles.pill, styles.vendor]}>
                {item.name}
              </Link>
            </ListItem>
          ))}
          <ListItem>
            <Text size="md" tone="muted" style={[styles.pill, styles.more]}>
              {m.systems.more}
            </Text>
          </ListItem>
        </List>
        <Prose>{m.systems.note}</Prose>
      </Stack>
    </Section>
  )
}
