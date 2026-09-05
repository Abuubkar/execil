import { createFileRoute } from '@tanstack/react-router'

import { Box } from '../base/Box'
import { Hero } from '../sections/Hero'
import { HowItWorks } from '../sections/HowItWorks'
import { Problem } from '../sections/Problem'
import { Services } from '../sections/Services'
import { SiteHeader } from '../sections/SiteHeader'
import { Specialties } from '../sections/Specialties'
import { Systems } from '../sections/Systems'
import { WhyUs } from '../sections/WhyUs'

export const Route = createFileRoute('/')({ component: Home })

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
      </Box>
    </>
  )
}
