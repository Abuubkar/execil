import { legalDocs, type LegalDocId } from './legal'
import { m } from './messages'

/** Canonical, og:url and the absolute OG image URL all derive from this.
 *  `||` rather than `??`: an unset GitHub Actions variable arrives as an empty
 *  string, which `??` keeps and `new URL()` then rejects, failing prerender. */
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000'

export const absolute = (path: string) => new URL(path, SITE_URL).toString()

export const OG_IMAGE = absolute('/og.png')

/** Organization.logo, not the OG banner: Google wants the logo itself on
 *  white, 112px minimum in both axes. */
export const LOGO_IMAGE = absolute('/logo.png')

/**
 * Stable node identities. Every page emits the publisher nodes and its own
 * page node in separate <script> tags; consumers merge a graph by `@id`, so
 * the references below resolve across those tags rather than duplicating the
 * Organization on every route.
 */
const ORG_ID = absolute('/#organization')
const SITE_ID = absolute('/#website')
const SERVICE_ID = absolute('/#service')
const pageId = (path: string) => absolute(`${path}#webpage`)

const graph = (nodes: readonly object[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
})

/**
 * Organization, NOT LocalBusiness.
 *
 * The local-business types exist for places people visit and effectively need a
 * postal address to earn rich results. Only region and country are publishable
 * (the registered address is a residence), so LocalBusiness would be both wrong
 * and ineffective. See issue #30.
 *
 * sameAs is OMITTED rather than placeholdered — structured data carrying a
 * bracketed placeholder is worse than an absent field, because Google can flag
 * it. telephone was omitted on the same grounds until a real number existed.
 */
const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: m.site.name,
  legalName: m.meta.legalName,
  url: SITE_URL,
  logo: LOGO_IMAGE,
  image: LOGO_IMAGE,
  telephone: m.site.phoneHref.replace('tel:', ''),
  email: m.footer.email,
  description: m.meta.description,
  address: {
    '@type': 'PostalAddress',
    addressRegion: m.meta.addressRegion,
    addressCountry: m.meta.addressCountry,
  },
  areaServed: { '@type': 'Country', name: m.meta.areaServed },
  // The specialties the site actually names. An answer engine asked about
  // billing for one of them has something to match on.
  knowsAbout: [m.meta.serviceType, ...m.specialties.items],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: m.site.phoneHref.replace('tel:', ''),
    email: m.footer.email,
    areaServed: m.meta.addressCountry,
    availableLanguage: 'English',
  },
}

const website = {
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: SITE_URL,
  name: m.site.name,
  description: m.meta.description,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-US',
}

/** Emitted from the root, so it covers the not-found page too. */
export const siteLd = graph([organization, website])

const webPage = (path: string, name: string, extra?: object) => ({
  '@type': 'WebPage',
  '@id': pageId(path),
  url: absolute(path),
  name,
  isPartOf: { '@id': SITE_ID },
  about: { '@id': ORG_ID },
  inLanguage: 'en-US',
  ...extra,
})

/** The four cards in Services, as the catalogue an answer engine can read.
 *  Nested because the page groups them by stage of the revenue cycle. */
const offerCatalog = {
  '@type': 'OfferCatalog',
  name: m.services.title,
  itemListElement: m.services.cards.map((card) => ({
    '@type': 'OfferCatalog',
    name: card.eyebrow,
    description: card.blurb,
    itemListElement: card.items.map((item) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: item },
    })),
  })),
}

const service = {
  '@type': 'Service',
  '@id': SERVICE_ID,
  name: m.meta.serviceType,
  serviceType: m.meta.serviceType,
  description: m.meta.description,
  provider: { '@id': ORG_ID },
  areaServed: { '@type': 'Country', name: m.meta.areaServed },
  audience: { '@type': 'Audience', audienceType: m.meta.audience },
  hasOfferCatalog: offerCatalog,
}

/** Home page only. Google has shown FAQ rich results for government and
 *  health authority sites only since 2023, so expect none — this is for other
 *  consumers of structured data. */
const faq = {
  '@type': 'FAQPage',
  '@id': absolute('/#faq'),
  mainEntity: m.faq.items.map((item) => ({
    '@type': 'Question',
    '@id': absolute(`/#faq-${item.id}`),
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export const homeLd = graph([
  webPage('/', m.meta.title, { mainEntity: { '@id': SERVICE_ID } }),
  service,
  faq,
])

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** legal.json carries one date, written the way the page shows it. Schema wants
 *  ISO 8601, so it is derived rather than stored a second time. */
const isoDate = (display: string) => {
  const [month = '', day = '', year = ''] = display.replace(',', '').split(' ')
  const mm = String(MONTHS.indexOf(month) + 1).padStart(2, '0')
  return `${year}-${mm}-${day.padStart(2, '0')}`
}

export const legalLd = (id: LegalDocId) => {
  const path = `/${id}`
  const { title } = m.meta.legal[id]

  return graph([
    webPage(path, title, {
      description: m.meta.legal[id].description,
      dateModified: isoDate(legalDocs[id].updated),
      publisher: { '@id': ORG_ID },
    }),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: m.site.name, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: title, item: absolute(path) },
      ],
    },
  ])
}
