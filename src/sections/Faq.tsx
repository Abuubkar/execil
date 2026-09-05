import * as stylex from '@stylexjs/stylex'

import { Disclosure } from '../base/Disclosure'
import { Eyebrow } from '../base/Eyebrow'
import { Heading } from '../base/Heading'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { track } from '../analytics/posthog'
import { m } from '../messages'
import { layout } from '../styles/tokens.stylex'

const HEADING_ID = 'faq-h'
/** Shared name makes the group exclusive natively — no JavaScript. */
const FAQ_GROUP = 'faq'

const styles = stylex.create({
  intro: { maxWidth: layout.containerText },
})

export function Faq() {
  return (
    <Section id="faq" labelledBy={HEADING_ID} tone="raised" size="lg" width="hero">
      <Stack gap="s32">
        <Stack gap="s12" style={styles.intro}>
          <Eyebrow>{m.faq.eyebrow}</Eyebrow>
          <Heading level={2} size="displayMd" id={HEADING_ID}>
            {m.faq.title}
          </Heading>
        </Stack>

        <Stack gap="s10">
          {m.faq.items.map((item) => (
            <Disclosure
              key={item.id}
              name={FAQ_GROUP}
              summary={item.q}
              // Stable slug, NEVER an index: copy edits reorder questions and
              // an index-keyed event would silently re-point to a different
              // question, corrupting history already collected (issue #13).
              onOpen={() => {
                track({ name: 'faq_opened', props: { question_id: item.id } })
              }}
            >
              {item.a}
            </Disclosure>
          ))}
        </Stack>
      </Stack>
    </Section>
  )
}
