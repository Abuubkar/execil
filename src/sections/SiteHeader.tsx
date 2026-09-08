import { useCallback, useEffect, useRef, useState } from 'react'
import * as stylex from '@stylexjs/stylex'

import { useTrack } from '../analytics/useTrack'
import { Box } from '../base/Box'
import { Icon } from '../base/Icon'
import { IconButton } from '../base/IconButton'
import { Link } from '../base/Link'
import { MenuPanel } from '../base/MenuPanel'
import { SkipLink } from '../base/SkipLink'
import { Wordmark } from '../base/Wordmark'
import { m } from '../messages'
import { darkSurface } from '../styles/theme'
import { color, layout, radius, screen, space, text } from '../styles/tokens.stylex'

const MENU_ID = 'site-menu'
const NAV_HREFS: readonly string[] = m.nav.links.map((link) => link.href)

const styles = stylex.create({
  header: { insetBlockStart: 0, position: 'sticky', zIndex: 50 },

  // Inverse surface, so every Role inside resolves against the Dark theme.
  strip: { backgroundColor: color.surfaceInverse, paddingInline: space.gutter },
  stripInner: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s20,
    justifyContent: 'flex-end',
    minHeight: '32px',
  },
  stripItem: { alignItems: 'center', display: 'inline-flex', gap: space.s6 },
  // The phone fits beside the burger below the breakpoint; the address does not.
  stripEmail: { display: { default: 'none', [screen.navUp]: 'inline-flex' } },

  main: {
    // 92% surfacePage so the blur reads through without a hard edge.
    backdropFilter: 'blur(10px)',
    backgroundColor: `color-mix(in srgb, ${color.surfacePage} 92%, transparent)`,
    borderBlockEndColor: color.borderDefault,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    paddingInline: space.gutter,
  },
  // No container: the wordmark and the CTA each sit a gutter from the edge.
  nav: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s24,
    height: layout.headerHeight,
    justifyContent: 'space-between',
  },
  brand: { alignItems: 'center', display: 'flex' },
  rightGroup: {
    alignItems: 'center',
    display: 'flex',
    gap: { default: space.s32, [screen.navWide]: space.s64 },
  },
  navLinks: {
    alignItems: 'center',
    display: 'flex',
    gap: { default: space.s32, [screen.navWide]: space.s40 },
  },
  desktopOnly: { display: { default: 'none', [screen.navUp]: 'flex' } },
  mobileOnly: { display: { default: 'flex', [screen.navUp]: 'none' } },
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
        <Box style={[darkSurface, styles.strip]}>
          <Box style={styles.stripInner}>
            <Link
              href={m.site.phoneHref}
              variant="utility"
              style={styles.stripItem}
              onActivate={() => {
                track({ name: 'phone_clicked', props: { location: 'header' } })
              }}
            >
              <Icon name="phone" size="xs" />
              {m.site.phone}
            </Link>
            <Link
              href={m.footer.emailHref}
              variant="utility"
              style={[styles.stripItem, styles.stripEmail]}
            >
              {m.footer.email}
            </Link>
          </Box>
        </Box>

        <Box style={styles.main}>
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

            <Box style={[styles.rightGroup, styles.desktopOnly]}>
              <Box style={styles.navLinks}>
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
              </Box>
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
            </Box>

            <Box style={styles.mobileOnly}>
              <IconButton icon="menu" label={m.nav.menuLabel} popoverTarget={MENU_ID} />
            </Box>
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
