import * as stylex from '@stylexjs/stylex'

import { Badge } from '../base/Badge'
import { Dot } from '../base/Dot'
import { Heading } from '../base/Heading'
import { Link } from '../base/Link'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { RichText } from '../base/RichText'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { heroTitle, m } from '../messages'
import { layout, space, text } from '../styles/tokens.stylex'

const styles = stylex.create({
  centred: { textAlign: 'center' },
  lead: { marginInline: 'auto', maxWidth: layout.containerText },
  trust: {
    columnGap: space.s20,
    fontSize: text.base,
    marginBlockStart: space.s16,
    rowGap: space.s10,
  },
})

export const HERO_HEADING_ID = 'hero-h'

export function Hero() {
  return (
    <Section
      labelledBy={HERO_HEADING_ID}
      tone="heroWash"
      size="hero"
      width="hero"
      style={styles.centred}
    >
      <Stack gap="s24" align="center">
        <Badge tone="accent" dot="success">
          {m.hero.badge}
        </Badge>

        <Heading level={1} size="displayLg" id={HERO_HEADING_ID}>
          <RichText segments={heroTitle} />
        </Heading>

        <Prose size="lead" style={styles.lead}>
          {m.hero.lead}
        </Prose>

        <Stack direction="row" gap="s12" justify="center" wrap>
          <Link href="/#assessment" variant="button">
            {m.hero.ctaPrimary}
          </Link>
          <Link href="/#services" variant="buttonSecondary">
            {m.hero.ctaSecondary}
          </Link>
        </Stack>

        <List direction="row" wrap center label={m.hero.trustPointsLabel} style={styles.trust}>
          {m.hero.trustPoints.map((point) => (
            <ListItem key={point}>
              <Dot tone="brand" size="xs" />
              <Text size="base" tone="secondary" weight="medium">
                {point}
              </Text>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Section>
  )
}
