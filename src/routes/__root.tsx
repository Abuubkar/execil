import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'

import { color, text } from '../styles/tokens.stylex'

import { m } from '../messages'

import appCss from '../styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: m.site.name,
      },
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
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

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
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body {...stylex.props(styles.body)}>
        {children}

        <Scripts />
      </body>
    </html>
  )
}
