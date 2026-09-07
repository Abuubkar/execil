import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { PostHogProvider } from 'posthog-js/react'

import { Box } from '../base/Box'
import { NotFound } from '../sections/NotFound'
import { SiteFooter } from '../sections/SiteFooter'
import { SiteHeader } from '../sections/SiteHeader'
import { OG_IMAGE, SITE_URL, organizationLd } from '../seo'
import { color, text } from '../styles/tokens.stylex'

import { m } from '../messages'

import appCss from '../styles/app.css?url'

const POSTHOG_PROJECT_TOKEN = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (import.meta.env.DEV) {
  if (!POSTHOG_PROJECT_TOKEN) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
    )
  }

  if (!POSTHOG_HOST) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured',
    )
  }
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: m.meta.title },
      { name: 'description', content: m.meta.description },
      { name: 'robots', content: 'index, follow' },
      { name: 'theme-color', content: '#0A6B6B' },

      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: m.site.name },
      { property: 'og:title', content: m.meta.ogTitle },
      { property: 'og:description', content: m.meta.description },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: m.meta.ogImageAlt },
      { property: 'og:locale', content: 'en_US' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: m.meta.ogTitle },
      { name: 'twitter:description', content: m.meta.description },
      { name: 'twitter:image', content: OG_IMAGE },
      { name: 'twitter:image:alt', content: m.meta.ogImageAlt },
    ],
    links: [
      // Preload the variable font: it is on the LCP path (the hero h1 is text,
      // not an image). crossorigin is required even same-origin for fonts.
      {
        rel: 'preload',
        href: '/fonts/Satoshi-Variable.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      ...(import.meta.env.DEV
        ? [
            { rel: 'stylesheet', href: '/virtual:stylex.css' },
            { rel: 'stylesheet', href: `${appCss}?direct` },
          ]
        : [{ rel: 'stylesheet', href: appCss }]),
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(organizationLd),
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

/** Wears the site chrome so an unknown address still looks like the site.
 *  Prerendered to /404.html by the pages entry in vite.config.ts. */
function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <Box as="main" id="top" tabIndex={-1}>
        <NotFound />
      </Box>
      <SiteFooter />
    </>
  )
}

/** The page's base surface, text colour and font stack. These belong on <body>
 *  rather than in a component: every element inherits them, and putting the
 *  stack here means the token is the single source for it. */
const styles = stylex.create({
  body: {
    backgroundColor: color.surfacePage,
    color: color.textBody,
    fontFamily: text.familySans,
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const content = (
    <>
      {children}
      <Scripts />
    </>
  )

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body {...stylex.props(styles.body)}>
        {POSTHOG_PROJECT_TOKEN && POSTHOG_HOST ? (
          <PostHogProvider
            apiKey={POSTHOG_PROJECT_TOKEN}
            options={{
              api_host: POSTHOG_HOST,
              defaults: '2025-05-24',
              capture_exceptions: true,
              debug: import.meta.env.DEV,
              tracing_headers: typeof window !== 'undefined' ? [window.location.hostname] : [],
            }}
          >
            {content}
          </PostHogProvider>
        ) : (
          content
        )}
      </body>
    </html>
  )
}
