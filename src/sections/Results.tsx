import * as stylex from '@stylexjs/stylex'

import { Eyebrow } from '../base/Eyebrow'
import { Heading } from '../base/Heading'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { m } from '../messages'
import { color, layout, radius, space } from '../styles/tokens.stylex'

const HEADING_ID = 'results-h'

/**
 * Results mode. Launches in "coming soon" because Execile has no measured
 * client outcomes yet, and placeholder case studies would read as real ones
 * (see CONTEXT.md). Flip to case studies only when the numbers exist and the
 * client has approved sharing them.
 */
const SHOW_CASE_STUDIES = false

const styles = stylex.create({
  intro: { maxWidth: layout.containerText },
  notice: {
    borderColor: color.borderDashed,
    borderRadius: radius['2xl'],
    borderStyle: 'dashed',
    borderWidth: '1px',
    paddingBlock: space.s40,
    paddingInline: space.s24,
    textAlign: 'center',
  },
})

export function Results() {
  return (
    <Section labelledBy={HEADING_ID} tone="page" size="lg">
      <Stack gap="s32">
        <Stack gap="s12" style={styles.intro}>
          <Eyebrow>{m.results.eyebrow}</Eyebrow>
          <Heading level={2} size="displayMd" id={HEADING_ID}>
            {m.results.title}
          </Heading>
        </Stack>

        {SHOW_CASE_STUDIES ? null : (
          <Stack style={styles.notice}>
            <Prose>{m.results.comingSoon}</Prose>
          </Stack>
        )}
      </Stack>
    </Section>
  )
}
