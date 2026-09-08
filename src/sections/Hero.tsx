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
import { layout, screen, space, text } from '../styles/tokens.stylex'

const styles = stylex.create({
  // Positioning context for the picture; nothing between may be positioned.
  section: { overflow: 'hidden', position: 'relative' },
  layout: { display: 'flex', flexDirection: 'column' },
  copy: {
    alignItems: { default: 'center', [screen.navUp]: 'flex-start' },
    display: 'flex',
    flexDirection: 'column',
    gap: space.s24,
    marginBlockStart: { default: '-15vw', [screen.navUp]: 0 },
    maxWidth: {
      default: layout.containerHero,
      [screen.navUp]: `min(${layout.containerText}, 55%)`,
    },
    textAlign: { default: 'center', [screen.navUp]: 'left' },
    position: 'relative',
    zIndex: 1,
  },
  lead: { maxWidth: layout.containerText },
  ctas: { justifyContent: { default: 'center', [screen.navUp]: 'flex-start' } },
  trust: {
    columnGap: space.s20,
    fontSize: text.base,
    justifyContent: { default: 'center', [screen.navUp]: 'flex-start' },
    marginBlockStart: space.s16,
    rowGap: space.s10,
  },
  // Masked rather than overlaid, so it fades into whatever ground the
  // section paints.
  picture: {
    aspectRatio: { default: '4 / 3', [screen.navUp]: 'auto' },
    insetBlock: { default: 'auto', [screen.navUp]: 0 },
    insetInlineEnd: { default: 'auto', [screen.navUp]: 0 },
    marginBlockStart: { default: `calc(-1 * ${space.heroTop})`, [screen.navUp]: 0 },
    marginInline: { default: `calc(-1 * ${space.gutter})`, [screen.navUp]: 0 },
    maxHeight: { default: layout.heroBandMax, [screen.navUp]: 'none' },
    maskImage: {
      default: 'linear-gradient(180deg, black 40%, transparent 100%)',
      [screen.navUp]: 'linear-gradient(90deg, transparent 0%, black 30%)',
    },
    // Visually first, after the copy in the DOM.
    order: { default: -1, [screen.navUp]: 0 },
    overflow: 'hidden',
    position: { default: 'relative', [screen.navUp]: 'absolute' },
    width: { default: `calc(100% + 2 * ${space.gutter})`, [screen.navUp]: '50%' },
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

        <Box style={styles.picture}>
          <Image
            src={HERO_SRC}
            srcSet={HERO_SRCSET}
            sizes={HERO_SIZES}
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            alt={m.hero.imageAlt}
            fit="cover"
            anchor="upperRight"
            priority
          />
        </Box>
      </Box>
    </Section>
  )
}
