import { Fragment } from 'react'
import * as stylex from '@stylexjs/stylex'

import { Dot } from '../base/Dot'
import { Eyebrow } from '../base/Eyebrow'
import { Heading } from '../base/Heading'
import { Link } from '../base/Link'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { legalDocs } from '../legal'
import type { LegalBlock, LegalDocId } from '../legal'
import { m } from '../messages'
import { space } from '../styles/tokens.stylex'

const HEADING_ID = 'legal-h'

const styles = stylex.create({
  item: { alignItems: 'flex-start' },
  itemDot: { marginBlockStart: space.s8 },
  itemText: { flex: 1 },
})

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === 'string') return <Prose>{block}</Prose>

  if ('items' in block) {
    return (
      <List gap="s8">
        {block.items.map((item) => (
          <ListItem key={item} style={styles.item}>
            <Dot tone="brand" size="xs" style={styles.itemDot} />
            <Text size="md" tone="prose" style={styles.itemText}>
              {item}
            </Text>
          </ListItem>
        ))}
      </List>
    )
  }

  return (
    <Prose>
      {block.parts.map((part, i) => {
        // Parts come from legal.json in a fixed order; index is a stable key
        // because the array is static content.
        const key = i
        if (typeof part === 'string') return <Fragment key={key}>{part}</Fragment>
        return (
          <Link key={key} href={part.href} variant="inline" external={part.external}>
            {part.text}
          </Link>
        )
      })}
    </Prose>
  )
}

export function LegalDocument({ id }: { id: LegalDocId }) {
  const doc = legalDocs[id]
  const shared = legalDocs.shared

  return (
    <Section labelledBy={HEADING_ID} tone="page" size="md" width="text">
      <Stack gap="s40">
        <Stack gap="s12">
          <Eyebrow tone="muted">
            {shared.updatedLabel}
            {doc.updated}
          </Eyebrow>
          <Heading level={1} size="displayMd" id={HEADING_ID}>
            {m.meta.legal[id].title}
          </Heading>
          {doc.intro.map((paragraph) => (
            <Prose key={paragraph} size="lead">
              {paragraph}
            </Prose>
          ))}
        </Stack>

        {doc.sections.map((section) => (
          <Stack key={section.heading} gap="s12">
            <Heading level={2} size="xl">
              {section.heading}
            </Heading>
            {section.blocks.map((block, i) => {
              const key = i
              return <Block key={key} block={block} />
            })}
          </Stack>
        ))}

        <Stack gap="s12">
          <Heading level={2} size="xl">
            {shared.contactHeading}
          </Heading>
          <Prose>
            {shared.contactBody}
            <Link href={m.footer.emailHref} variant="inline">
              {m.footer.email}
            </Link>
            {shared.contactOr}
            <Link href={m.site.phoneHref} variant="inline">
              {m.site.phone}
            </Link>
            {shared.contactEnd}
          </Prose>
        </Stack>
      </Stack>
    </Section>
  )
}
