import { createFileRoute } from '@tanstack/react-router'

import { Box } from '../base/Box'
import { m } from '../messages'
import { absolute, legalLd } from '../seo'
import { LegalDocument } from '../sections/LegalDocument'
import { SiteFooter } from '../sections/SiteFooter'
import { SiteHeader } from '../sections/SiteHeader'

const doc = m.meta.legal.hipaa
const url = absolute('/hipaa')
const title = `${doc.title} | ${m.site.name}`

export const Route = createFileRoute('/hipaa')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: doc.description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: doc.description },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: doc.description },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(legalLd('hipaa')) }],
  }),
  component: Page,
})

function Page() {
  return (
    <>
      <SiteHeader />
      <Box as="main" id="top" tabIndex={-1}>
        <LegalDocument id="hipaa" />
      </Box>
      <SiteFooter />
    </>
  )
}
