import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

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

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <Scripts />
      </body>
    </html>
  )
}
