import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { darkSurface } from '../styles/theme'
import { color, layout, space } from '../styles/tokens.stylex'

export type SectionTone = 'page' | 'raised' | 'accent' | 'inverse' | 'heroWash'
export type SectionSize = 'lg' | 'md' | 'sm' | 'hero'
export type SectionWidth = 'wide' | 'hero' | 'text' | 'narrow'

const tones = stylex.create({
  page: { backgroundColor: color.surfacePage },
  raised: { backgroundColor: color.surfaceRaised },
  accent: { backgroundColor: color.surfaceAccent },
  inverse: { backgroundColor: color.surfaceInverse },
  // The hero's vertical wash: surfacePage into surfaceAccentSoft.
  heroWash: {
    backgroundImage: `linear-gradient(180deg, ${color.surfacePage} 0%, ${color.surfaceAccentSoft} 100%)`,
  },
})

const sizes = stylex.create({
  lg: { paddingBlock: space.sectionLg },
  md: { paddingBlock: space.sectionMd },
  sm: { paddingBlock: space.sectionSm },
  // The hero is asymmetric in the canvas: a taller top than bottom.
  hero: { paddingBlockEnd: space.sectionMd, paddingBlockStart: space.heroTop },
})

const widths = stylex.create({
  wide: { maxWidth: layout.containerWide },
  hero: { maxWidth: layout.containerHero },
  text: { maxWidth: layout.containerText },
  narrow: { maxWidth: layout.containerNarrow },
})

const base = stylex.create({
  section: {
    paddingInline: space.gutter,
    // Matches layout.headerHeight so in-page links do not land under the
    // sticky header (issue #23).
    scrollMarginTop: layout.headerHeight,
  },
  container: { marginInline: 'auto', width: '100%' },
})

type SectionProps = {
  id?: string
  /** id of the heading that names this section — renders aria-labelledby. */
  labelledBy?: string
  tone?: SectionTone
  size?: SectionSize
  width?: SectionWidth
  children?: React.ReactNode
  style?: StyleProp
}

/** Owns section padding, the container width and scroll-margin. `tone="inverse"`
 *  also applies the Dark theme, so the subtree's Role tokens resolve dark. */
export function Section({
  id,
  labelledBy,
  tone = 'page',
  size = 'lg',
  width = 'wide',
  children,
  style,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      {...stylex.props(
        base.section,
        sizes[size],
        tones[tone],
        tone === 'inverse' && darkSurface,
        style,
      )}
    >
      <div {...stylex.props(base.container, widths[width])}>{children}</div>
    </section>
  )
}
