import * as stylex from '@stylexjs/stylex'

import { Heading } from '../base/Heading'
import { Link } from '../base/Link'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { m } from '../messages'
import { color, motion, radius, space, text } from '../styles/tokens.stylex'

const HEADING_ID = 'systems-h'

/**
 * Deliberately the quietest section on the page. It sits directly under
 * Specialties, which is another list of names, so the canvas gives its heading
 * an Eyebrow's weight rather than a display size and makes the pills read as
 * plain product chips. Two loud pill rows in a row look like one repeated
 * section.
 *
 * That is also why the list has no "+ more" pill. Specialties already uses one,
 * and repeating it here restated the motif that made the two sections look
 * alike. The note carries the same point in prose instead.
 */
const styles = stylex.create({
  pill: {
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'inline-block',
    fontSize: text.md,
    fontWeight: text.weightBold,
    paddingBlock: space.s10,
    paddingInline: space.s18,
  },
  vendor: {
    backgroundColor: { default: color.surfaceRaised, ':hover': color.surfaceAccent },
    borderColor: { default: color.borderDefault, ':hover': color.borderAccent },
    color: { default: color.textSecondary, ':hover': color.textLink },
    textDecoration: 'none',
    transitionDuration: motion.fast,
    transitionProperty: 'background-color, border-color, color',
    transitionTimingFunction: motion.ease,
  },
})

export function Systems() {
  return (
    <Section labelledBy={HEADING_ID} tone="page" size="sm">
      <Stack gap="s20" align="center">
        <Heading level={2} size="label" tone="muted" id={HEADING_ID}>
          {m.systems.title}
        </Heading>
        <List direction="row" wrap center gap="s14" label={m.systems.label}>
          {m.systems.items.map((item) => (
            <ListItem key={item.name}>
              <Link href={item.href} variant="plain" external style={[styles.pill, styles.vendor]}>
                {item.name}
              </Link>
            </ListItem>
          ))}
        </List>
        <Prose>{m.systems.note}</Prose>
      </Stack>
    </Section>
  )
}
