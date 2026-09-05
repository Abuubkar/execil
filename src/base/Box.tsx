import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

/** Closed union — never unrestricted. `as="marquee"` must not typecheck. */
export type BoxElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'nav'
  | 'header'
  | 'footer'
  | 'main'
  | 'address'

type BoxProps = {
  as?: BoxElement
  children?: React.ReactNode
  /** Positions this element within a parent's layout. Never restyles its
   *  interior — see the conventions in CLAUDE.md. */
  style?: StyleXStyles
}

/** Deliberately shallow. Its job is to close the raw-tag hole with a
 *  constrained set, not to hide complexity — the depth lives in tier 2.
 *  See issue #22. */
export function Box({ as: Tag = 'div', children, style }: BoxProps) {
  // The sx prop only works on lowercase host elements, so every base component
  // spreads stylex.props() itself.
  return <Tag {...stylex.props(style)}>{children}</Tag>
}
