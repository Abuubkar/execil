import * as stylex from '@stylexjs/stylex'

import { useTrack } from '../analytics/useTrack'
import hero1254 from '../assets/hero/hero-1254.webp'
import hero900 from '../assets/hero/hero-900.webp'
import hero600 from '../assets/hero/hero-600.webp'
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
import { heroTitle, m } from '../messages'
import { layout, screen, space, text } from '../styles/tokens.stylex'

// 1254 is the source's native size — the square render is capped there.
const HERO_SRCSET = `${hero600} 600w, ${hero900} 900w, ${hero1254} 1254w`
// Matches the desktop split below: the picture takes the right half of the
// viewport once the nav breakpoint is crossed, the full width before it.
const HERO_SIZES = `(min-width: 940px) 50vw, 100vw`

const styles = stylex.create({
  // The picture is positioned against the section, not the container, so it
  // can bleed to the viewport edge and span the full padded height. Nothing
  // between here and the picture may be positioned, or it becomes the box.
  section: { overflow: 'hidden', position: 'relative' },
  layout: { display: 'flex', flexDirection: 'column' },
  // Centred on small screens, as the canvas draws it, rising into the faded
  // foot of the picture above it. Once the picture moves beside the copy the
  // copy ranges left to meet it, and is capped so its right edge always lands
  // inside the picture's fade.
  copy: {
    alignItems: { default: 'center', [screen.navUp]: 'flex-start' },
    display: 'flex',
    flexDirection: 'column',
    gap: space.s24,
    // The overlap reaches only the quiet lower band of the picture — desk and
    // keyboard — which the mask has already faded past half.
    marginBlockStart: { default: '-15vw', [screen.navUp]: 0 },
    maxWidth: {
      default: layout.containerHero,
      [screen.navUp]: `min(${layout.containerText}, 55%)`,
    },
    textAlign: { default: 'center', [screen.navUp]: 'left' },
    // Keeps the copy above the picture, both when it overlaps below the
    // breakpoint and when the picture is absolutely positioned above it.
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
  // Below the breakpoint it comes first, bleeds past the section's padding to
  // the viewport edges as a 4:3 band, and fades out at the foot so the copy
  // can rise into it. On desktop it leaves the flow, fills the section's
  // height and fades on its left edge instead. A mask rather than a gradient
  // overlay so no colour is named — the picture dissolves into whatever the
  // section is painted.
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
    // First in the stack visually, after the copy in the DOM, so a screen
    // reader still meets the heading before the picture.
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
            src={hero1254}
            srcSet={HERO_SRCSET}
            sizes={HERO_SIZES}
            width={1254}
            height={1254}
            alt={m.hero.imageAlt}
            fit="cover"
            // Desktop's box is taller than the square, so "right" keeps the
            // monitors; the narrow band is wider, so "upper" keeps her head
            // without the empty band above it.
            anchor="upperRight"
            priority
          />
        </Box>
      </Box>
    </Section>
  )
}
