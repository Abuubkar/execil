import * as stylex from '@stylexjs/stylex'
import type { CompiledStyles, StyleXArray } from '@stylexjs/stylex'

/** Mirrors what stylex.props() accepts, so a caller can pass a single style,
 *  an array, or a theme. `Parameters<typeof stylex.props>[0]` does NOT work —
 *  the declared `this` parameter makes it resolve to `undefined`. */
export type StyleProp = StyleXArray<CompiledStyles | boolean | null | undefined>

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
  id?: string
  /** Needed when `as` renders a landmark (nav, aside) that requires a name. */
  'aria-label'?: string
  /** -1 makes an element programmatically focusable — needed on <main> so the
   *  skip link actually moves focus, not just scroll position (issue #23). */
  tabIndex?: number
  children?: React.ReactNode
  /** Positions this element within a parent's layout. Never restyles its
   *  interior — see the conventions in CLAUDE.md. */
  style?: StyleProp
}

/** Deliberately shallow. Its job is to close the raw-tag hole with a
 *  constrained set, not to hide complexity — the depth lives in tier 2.
 *  See issue #22. */
export function Box({
  as: Tag = 'div',
  id,
  tabIndex,
  'aria-label': ariaLabel,
  children,
  style,
}: BoxProps) {
  // The sx prop only works on lowercase host elements, so every base component
  // spreads stylex.props() itself.
  return (
    <Tag id={id} tabIndex={tabIndex} aria-label={ariaLabel} {...stylex.props(style)}>
      {children}
    </Tag>
  )
}
