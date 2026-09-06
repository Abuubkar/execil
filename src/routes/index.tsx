import { createFileRoute } from '@tanstack/react-router'

import { SITE_URL } from '../seo'

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
  head: () => ({ links: [{ rel: 'canonical', href: SITE_URL }] }),
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
