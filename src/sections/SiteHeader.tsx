import { useCallback, useEffect, useRef, useState } from 'react'
import * as stylex from '@stylexjs/stylex'

import { useTrack } from '../analytics/useTrack'
import { Box } from '../base/Box'
import { Icon } from '../base/Icon'
import { IconButton } from '../base/IconButton'
import { Link } from '../base/Link'
import { MenuPanel } from '../base/MenuPanel'
import { SkipLink } from '../base/SkipLink'
import { Stack } from '../base/Stack'
import { Wordmark } from '../base/Wordmark'
import { m } from '../messages'
import { color, layout, motion, radius, screen, space, text } from '../styles/tokens.stylex'

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
    paddingInline: space.gutter,
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
    width: '100%',
  },
  brand: { alignItems: 'center', display: 'flex' },
  desktopOnly: { display: { default: 'none', [screen.navUp]: 'flex' } },
  mobileOnly: { display: { default: 'flex', [screen.navUp]: 'none' } },
  phone: {
    alignItems: 'center',
    color: { default: color.textHeading, ':hover': color.textLink },
    display: 'inline-flex',
    fontSize: text.md,
    fontWeight: text.weightSemibold,
    gap: space.s6,
    transitionDuration: motion.fast,
    transitionProperty: 'color',
    transitionTimingFunction: motion.ease,
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

/** Fraction of the viewport height that counts as the reading line. */
const READING_LINE = 0.4

/**
 * Chapter ranges: a link is current from its section's top until the next
 * linked section's top, so sections without a link belong to the one above.
 * The last chapter ends at its own bottom — nothing is lit on the form.
 */
function useCurrentSection(hrefs: readonly string[]): [string | null, (href: string) => void] {
  const [current, setCurrent] = useState<string | null>(null)
  const pinned = useRef<string | null>(null)
  const update = useRef<() => void>(() => {})

  useEffect(() => {
    const chapters = hrefs
      .map((href) => ({ href, el: document.getElementById(href.slice(href.indexOf('#') + 1)) }))
      .filter((c): c is { href: string; el: HTMLElement } => c.el !== null)
      .sort((a, b) => a.el.offsetTop - b.el.offsetTop)
    if (chapters.length === 0) return

    let frame: number | undefined
    const measure = () => {
      frame = undefined
      if (pinned.current !== null) return
      const line = globalThis.innerHeight * READING_LINE
      let next: string | null = null
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i]
        const after = chapters[i + 1]
        if (chapter === undefined) continue
        const rect = chapter.el.getBoundingClientRect()
        const end = after === undefined ? rect.bottom : after.el.getBoundingClientRect().top
        if (rect.top <= line && line < end) {
          next = chapter.href
          break
        }
      }
      setCurrent(next)
    }
    const schedule = () => {
      if (frame === undefined) frame = globalThis.requestAnimationFrame(measure)
    }
    update.current = measure

    measure()
    globalThis.addEventListener('scroll', schedule, { passive: true })
    globalThis.addEventListener('resize', schedule)
    return () => {
      if (frame !== undefined) globalThis.cancelAnimationFrame(frame)
      globalThis.removeEventListener('scroll', schedule)
      globalThis.removeEventListener('resize', schedule)
      update.current = () => {}
    }
  }, [hrefs])

  // Holds the clicked link through the smooth scroll so chapters in between
  // do not flash past.
  const pin = useCallback((href: string) => {
    pinned.current = href
    setCurrent(href)

    let timer: ReturnType<typeof globalThis.setTimeout> | undefined
    const release = () => {
      pinned.current = null
      if (timer !== undefined) globalThis.clearTimeout(timer)
      globalThis.removeEventListener('scrollend', release)
      update.current()
    }
    globalThis.addEventListener('scrollend', release, { once: true })
    timer = globalThis.setTimeout(release, 1200)
  }, [])

  return [current, pin]
}

export function SiteHeader() {
  const track = useTrack()
  const links = m.nav.links
  const [current, pinCurrent] = useCurrentSection(NAV_HREFS)

  return (
    <>
      <SkipLink href="#top">{m.nav.skip}</SkipLink>

      <Box as="header" style={styles.header}>
        <Box as="nav" aria-label={m.nav.label} style={styles.nav}>
          <Link
            href="/"
            variant="plain"
            aria-label={m.nav.home}
            style={styles.brand}
            onActivate={(event) => {
              if (globalThis.location.pathname !== '/') return
              event.preventDefault()
              globalThis.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <Wordmark />
          </Link>

          <Stack direction="row" gap="s24" align="center" style={styles.desktopOnly}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                variant="navHeader"
                current={current === link.href}
                onActivate={() => {
                  pinCurrent(link.href)
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
              href="/#assessment"
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
                pinCurrent(link.href)
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
            href="/#assessment"
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
