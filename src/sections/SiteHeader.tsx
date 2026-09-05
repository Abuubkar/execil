import { useEffect, useState } from 'react'
import * as stylex from '@stylexjs/stylex'

import { Box } from '../base/Box'
import { BrandMark } from '../base/BrandMark'
import { Icon } from '../base/Icon'
import { IconButton } from '../base/IconButton'
import { Link } from '../base/Link'
import { MenuPanel } from '../base/MenuPanel'
import { SkipLink } from '../base/SkipLink'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { track } from '../analytics/posthog'
import { m } from '../messages'
import { color, layout, radius, screen, space, text } from '../styles/tokens.stylex'

const MENU_ID = 'site-menu'
const NAV_HREFS: readonly string[] = m.nav.links.map((link) => link.href)

const styles = stylex.create({
  header: {
    // 92% surfacePage so the blur reads through without a hard edge.
    backdropFilter: 'blur(10px)',
    backgroundColor: `color-mix(in srgb, ${color.surfacePage} 92%, transparent)`,
    borderBlockEndColor: color.borderDefault,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    insetBlockStart: 0,
    position: 'sticky',
    zIndex: 50,
  },
  nav: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s24,
    height: layout.headerHeight,
    justifyContent: 'space-between',
    marginInline: 'auto',
    maxWidth: layout.containerWide,
    paddingInline: space.gutter,
  },
  brand: {
    alignItems: 'center',
    color: color.textHeading,
    display: 'flex',
    gap: space.s10,
  },
  wordmark: {
    fontSize: text.lg,
    fontWeight: text.weightBlack,
    letterSpacing: text.trackingTight,
  },
  desktopOnly: { display: { default: 'none', [screen.navUp]: 'flex' } },
  mobileOnly: { display: { default: 'flex', [screen.navUp]: 'none' } },
  phone: {
    alignItems: 'center',
    color: color.textHeading,
    display: 'inline-flex',
    fontSize: text.md,
    fontWeight: text.weightSemibold,
    gap: space.s6,
  },
  headerCta: {
    borderRadius: radius.lg,
    boxShadow: 'none',
    fontSize: text.md,
    paddingBlock: space.s10,
    paddingInline: space.s18,
  },
  menuLink: {
    alignItems: 'center',
    color: color.textBody,
    display: 'inline-flex',
    gap: space.s8,
    fontSize: text.lg,
    fontWeight: text.weightMedium,
    paddingBlock: space.s12,
    paddingInline: space.s4,
  },
  menuCta: { marginBlockStart: space.s8, textAlign: 'center' },
})

function useCurrentSection(hrefs: readonly string[]): string | null {
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    const targets = hrefs
      .map((href) => document.getElementById(href.slice(1)))
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(`#${entry.target.id}`)
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    for (const target of targets) observer.observe(target)
    return () => {
      observer.disconnect()
    }
  }, [hrefs])

  return current
}

export function SiteHeader() {
  const links = m.nav.links
  const current = useCurrentSection(NAV_HREFS)

  return (
    <>
      <SkipLink href="#top">{m.nav.skip}</SkipLink>

      <Box as="header" style={styles.header}>
        <Box as="nav" aria-label={m.nav.label} style={styles.nav}>
          <Link href="#top" variant="plain" aria-label={m.nav.home} style={styles.brand}>
            <BrandMark />
            <Text style={styles.wordmark}>{m.site.name}</Text>
          </Link>

          <Stack direction="row" gap="s4" align="center" style={styles.desktopOnly}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                variant="navPill"
                current={current === link.href}
                onActivate={() => {
                  track({ name: 'nav_clicked', props: { target: link.href } })
                }}
              >
                {link.text}
              </Link>
            ))}
          </Stack>

          <Stack direction="row" gap="s18" align="center" style={styles.desktopOnly}>
            <Link
              href={m.site.phoneHref}
              variant="plain"
              style={styles.phone}
              onActivate={() => {
                track({ name: 'phone_clicked', props: { location: 'header' } })
              }}
            >
              <Icon name="phone" size="xs" />
              {m.site.phone}
            </Link>
            <Link
              href="#assessment"
              variant="button"
              style={styles.headerCta}
              onActivate={() => {
                track({ name: 'cta_clicked', props: { location: 'header', variant: 'primary' } })
              }}
            >
              {m.nav.cta}
            </Link>
          </Stack>

          <Box style={styles.mobileOnly}>
            <IconButton icon="menu" label={m.nav.menuLabel} popoverTarget={MENU_ID} />
          </Box>
        </Box>

        <MenuPanel id={MENU_ID} label={m.nav.menuLabel} style={styles.mobileOnly}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              variant="plain"
              style={styles.menuLink}
              onActivate={() => {
                track({ name: 'nav_clicked', props: { target: link.href } })
              }}
            >
              {link.text}
            </Link>
          ))}
          <Link
            href={m.site.phoneHref}
            variant="plain"
            style={styles.menuLink}
            onActivate={() => {
              track({ name: 'phone_clicked', props: { location: 'mobile_menu' } })
            }}
          >
            <Icon name="phone" size="xs" />
            {m.site.phone}
          </Link>
          <Link
            href="#assessment"
            variant="button"
            style={styles.menuCta}
            onActivate={() => {
              track({ name: 'cta_clicked', props: { location: 'mobile_menu', variant: 'primary' } })
            }}
          >
            {m.nav.cta}
          </Link>
        </MenuPanel>
      </Box>
    </>
  )
}
