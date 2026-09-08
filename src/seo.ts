import { m } from './messages'

/** Canonical, og:url and the absolute OG image URL all derive from this.
 *  `||` rather than `??`: an unset GitHub Actions variable arrives as an empty
 *  string, which `??` keeps and `new URL()` then rejects, failing prerender. */
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000'

export const absolute = (path: string) => new URL(path, SITE_URL).toString()

export const OG_IMAGE = absolute('/og.png')

/** Organization.logo, NOT the OG banner. Google reads this one for the
 *  knowledge panel and wants the logo itself on a white ground, at 112px
 *  minimum in both axes. og.png is a 1200x630 social card with a headline on
 *  it, which is a different picture for a different job. */
export const LOGO_IMAGE = absolute('/logo.png')

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
export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: m.site.name,
  legalName: m.meta.legalName,
  url: SITE_URL,
  logo: LOGO_IMAGE,
  telephone: m.site.phoneHref.replace('tel:', ''),
  description: m.meta.description,
  address: {
    '@type': 'PostalAddress',
    addressRegion: m.meta.addressRegion,
    addressCountry: m.meta.addressCountry,
  },
  areaServed: { '@type': 'Country', name: m.meta.areaServed },
}

/**
 * FAQPage, for the home page only — the questions live in the Faq section and
 * nowhere else, so this must not go in the root head beside organizationLd.
 *
 * Worth setting expectations: since 2023 Google shows FAQ rich results only for
 * government and health *authority* sites, and Execil is neither. This is
 * cheap, valid, and read by other consumers of structured data; the accordion
 * in Google's results is not the reason to have it.
 *
 * `a` is the whole answer. One item also carries a `link`, but that is a
 * "read more" the section renders after the text, not part of the answer.
 */
export const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: m.faq.items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}
