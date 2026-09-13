import { createFileRoute } from '@tanstack/react-router'

import { HERO_SIZES, HERO_SRC, HERO_SRCSET } from '../hero-image'
import { m } from '../messages'
import { SITE_URL, homeLd } from '../seo'

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
    // Title lives here, not in the root head. See __root.tsx.
    meta: [{ title: m.meta.title }],
    links: [
      { rel: 'canonical', href: SITE_URL },
      // LCP element on narrow screens. imageSrcSet/imageSizes must match the
      // <img> or the picture is fetched twice.
      {
        rel: 'preload',
        as: 'image',
        href: HERO_SRC,
        imageSrcSet: HERO_SRCSET,
        imageSizes: HERO_SIZES,
        fetchPriority: 'high',
      },
    ],
    // The page, the service catalogue and the FAQ. The publisher nodes they
    // reference by @id come from the root.
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(homeLd) }],
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
