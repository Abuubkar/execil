import { Text } from './Text'
import type { Tone } from './Text'

/**
 * The hero headline is the ONLY rich text on the site and the only <br>.
 * Emphasis is encoded as segments rather than HTML in JSON, so the sentence
 * stays readable and re-wordable as a sentence — splitting it into five plain
 * keys would freeze the emphasis boundaries into JSX. See issue #11.
 */
export type Segment = string | { text: string; tone: 'brand' | 'success' } | { br: true }

/** 'brand' maps to the large-text-only display accent (4.18:1 — valid at
 *  display sizes, never below 24px). See the token comment in tokens.stylex.ts. */
const TONE_FOR: Record<'brand' | 'success', Tone> = {
  brand: 'accentDisplay',
  success: 'success',
}

export function RichText({ segments }: { segments: readonly Segment[] }) {
  return (
    <>
      {segments.map((segment, i) => {
        // Segments come from messages.json in a fixed order; index is a stable
        // key here because the array is static content, not a mutable list.
        const key = i
        if (typeof segment === 'string') return <span key={key}>{segment}</span>
        if ('br' in segment) return <br key={key} />
        return (
          <Text key={key} tone={TONE_FOR[segment.tone]}>
            {segment.text}
          </Text>
        )
      })}
    </>
  )
}
