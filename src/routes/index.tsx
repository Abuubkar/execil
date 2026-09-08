import { createFileRoute } from '@tanstack/react-router'

import { HERO_SIZES, HERO_SRC, HERO_SRCSET } from '../hero-image'
import { m } from '../messages'
import { SITE_URL, faqLd } from '../seo'

import { Box } from '../base/Box'
import { Assessment } from '../sections/Assessment'
import { Faq } from '../sections/Faq'
import { Fit } from '../sections/Fit'
import { Hero } from '../sections/Hero'
import { HowItWorks } from '../sections/HowItWorks'
import { Problem } from '../sections/Problem'
import { Results } from '../sections/Results'
import { Services } from '../sections/Services'
import { SiteFooter } from '../sections/SiteFooter'
import { SiteHeader } from '../sections/SiteHeader'
import { Specialties } from '../sections/Specialties'
import { Systems } from '../sections/Systems'
import { WhyUs } from '../sections/WhyUs'

export const Route = createFileRoute('/')({
  head: () => ({
    // The home page's title lives here rather than in the root head, so that
    // the not-found page is free to render its own. See __root.tsx.
    meta: [{ title: m.meta.title }],
    links: [
      { rel: 'canonical', href: SITE_URL },
      // The hero picture is the LCP element on narrow screens. Preloading it
      // here starts the fetch alongside the stylesheet instead of after it;
      // imageSrcSet and imageSizes must match the <img> exactly or the browser
      // resolves a different candidate and downloads the picture twice.
      {
        rel: 'preload',
        as: 'image',
        href: HERO_SRC,
        imageSrcSet: HERO_SRCSET,
        imageSizes: HERO_SIZES,
        fetchPriority: 'high',
      },
    ],
    // FAQPage belongs to this route, not the root: the questions render here
    // and nowhere else.
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(faqLd) }],
  }),
  component: Home,
})

/** tabIndex -1 so SkipLink can move focus here, not just scroll. */
function Home() {
  return (
    <>
      <SiteHeader />
      <Box as="main" id="top" tabIndex={-1}>
        <Hero />
        <Problem />
        <Services />
        <HowItWorks />
        <Specialties />
        <Systems />
        <WhyUs />
        <Fit />
        <Results />
        <Faq />
        <Assessment />
      </Box>
      <SiteFooter />
    </>
  )
}
