import * as stylex from '@stylexjs/stylex'

import { Heading } from '../base/Heading'
import { Link } from '../base/Link'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { m } from '../messages'
import { space } from '../styles/tokens.stylex'

const HEADING_ID = 'not-found-h'

const styles = stylex.create({
  cta: { alignSelf: 'flex-start', marginBlockStart: space.s12 },
})

export function NotFound() {
  return (
    <Section labelledBy={HEADING_ID} tone="page" size="lg" width="text">
      <Stack gap="s12">
        <Heading level={1} size="displayMd" id={HEADING_ID}>
          {m.notFound.title}
        </Heading>
        <Prose size="lead">{m.notFound.lead}</Prose>
        <Link href={m.notFound.ctaHref} variant="button" style={styles.cta}>
          {m.notFound.cta}
        </Link>
      </Stack>
    </Section>
  )
}
