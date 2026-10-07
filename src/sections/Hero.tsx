import * as stylex from '@stylexjs/stylex'

import { useTrack } from '../analytics/useTrack'
import { Badge } from '../base/Badge'
import { Box } from '../base/Box'
import { Dot } from '../base/Dot'
import { Heading } from '../base/Heading'
import { Image } from '../base/Image'
import { Link } from '../base/Link'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { RichText } from '../base/RichText'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { HERO_HEIGHT, HERO_SIZES, HERO_SRC, HERO_SRCSET, HERO_WIDTH } from '../hero-image'
import { heroTitle, m } from '../messages'
import { color, layout, radius, screen, shadow, space, text } from '../styles/tokens.stylex'

const styles = stylex.create({
  section: { overflow: 'hidden' },
  layout: {
    alignItems: 'center',
    display: 'grid',
    gap: space.s40,
    gridTemplateColumns: { default: '1fr', [screen.navUp]: '1.05fr 0.95fr' },
  },
  copy: {
    alignItems: { default: 'center', [screen.navUp]: 'flex-start' },
    display: 'flex',
    flexDirection: 'column',
    gap: space.s24,
    maxWidth: {
      default: layout.containerHero,
      [screen.navUp]: layout.containerText,
    },
    textAlign: { default: 'center', [screen.navUp]: 'left' },
  },
  lead: { maxWidth: layout.containerText },
  ctas: { justifyContent: { default: 'center', [screen.navUp]: 'flex-start' } },
  // Grid, not a wrapped flex row: with six items flex breaks the second line
  // wherever the content happens to end, leaving the last item unaligned.
  trust: {
    columnGap: space.s20,
    display: 'grid',
    fontSize: text.base,
    gridTemplateColumns: { default: 'repeat(2, auto)', [screen.navUp]: 'repeat(3, 1fr)' },
    justifyContent: { default: 'center', [screen.navUp]: 'start' },
    marginBlockStart: space.s16,
    rowGap: space.s10,
  },
  // The arch and its outline are two boxes, not one with a pseudo-element:
  // the frame has to sit OUTSIDE the clip, and `overflow: hidden` on the
  // picture would cut off a ring drawn inside it.
  frame: {
    justifySelf: 'center',
    maxWidth: layout.heroArchMax,
    padding: space.s8,
    position: 'relative',
    width: '100%',
  },
  outline: {
    borderColor: color.borderBrand,
    // `full` on the top corners clamps to half the width, so the arch stays a
    // true semicircle at any size without naming one.
    borderRadius: `${radius.full} ${radius.full} ${radius['3xl']} ${radius['3xl']}`,
    borderStyle: 'solid',
    borderWidth: '1px',
    inset: 0,
    opacity: 0.35,
    pointerEvents: 'none',
    position: 'absolute',
  },
  picture: {
    aspectRatio: '4 / 5',
    borderRadius: `${radius.full} ${radius.full} ${radius['3xl']} ${radius['3xl']}`,
    boxShadow: shadow.lg,
    overflow: 'hidden',
  },
})

export const HERO_HEADING_ID = 'hero-h'

export function Hero() {
  const track = useTrack()

  return (
    <Section
      labelledBy={HERO_HEADING_ID}
      tone="heroWash"
      size="hero"
      width="wide"
      style={styles.section}
    >
      <Box style={styles.layout}>
        <Box style={styles.copy}>
          <Badge tone="accent" dot="success">
            {m.hero.badge}
          </Badge>

          <Heading level={1} size="displayLg" id={HERO_HEADING_ID}>
            <RichText segments={heroTitle} />
          </Heading>

          <Prose size="lead" style={styles.lead}>
            {m.hero.lead}
          </Prose>

          <Stack direction="row" gap="s12" wrap style={styles.ctas}>
            <Link
              href="/#assessment"
              variant="button"
              onActivate={() => {
                track({ name: 'cta_clicked', props: { location: 'hero', variant: 'primary' } })
              }}
            >
              {m.hero.ctaPrimary}
            </Link>
            <Link
              href="/#services"
              variant="buttonSecondary"
              onActivate={() => {
                track({ name: 'cta_clicked', props: { location: 'hero', variant: 'secondary' } })
              }}
            >
              {m.hero.ctaSecondary}
            </Link>
          </Stack>

          <List direction="row" wrap label={m.hero.trustPointsLabel} style={styles.trust}>
            {m.hero.trustPoints.map((point) => (
              <ListItem key={point}>
                <Dot tone="brand" size="xs" />
                <Text size="base" tone="secondary" weight="medium">
                  {point}
                </Text>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box style={styles.frame}>
          <Box style={styles.outline} />
          <Box style={styles.picture}>
            <Image
              src={HERO_SRC}
              srcSet={HERO_SRCSET}
              sizes={HERO_SIZES}
              width={HERO_WIDTH}
              height={HERO_HEIGHT}
              alt={m.hero.imageAlt}
              fit="cover"
              anchor="center"
              priority
            />
          </Box>
        </Box>
      </Box>
    </Section>
  )
}
