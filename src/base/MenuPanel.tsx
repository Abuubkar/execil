import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { color, layout, motion, space } from '../styles/tokens.stylex'

const styles = stylex.create({
  panel: {
    // Reset the UA popover stylesheet, which centres [popover] in the viewport.
    backgroundColor: color.surfaceRaised,
    borderBlockEndColor: color.borderDefault,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    borderInlineWidth: 0,
    borderBlockStartWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: space.s6,
    inset: 'auto',
    insetBlockStart: layout.headerHeight,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    margin: 0,
    maxWidth: 'none',
    opacity: { default: 0, ':popover-open': 1 },
    paddingBlockEnd: space.s24,
    paddingBlockStart: space.s16,
    paddingInline: space.gutter,
    // display and overlay need allow-discrete for the exit animation; Firefox
    // lacks both and snaps shut, which is acceptable.
    transitionBehavior: 'allow-discrete',
    transitionDuration: motion.base,
    transitionProperty: 'opacity, translate, display, overlay',
    transitionTimingFunction: motion.ease,
    translate: { default: '0 -8px', ':popover-open': '0 0' },
    width: '100%',
  },
})

/**
 * Declarative Popover API — zero JavaScript. Light dismiss, Esc, top-layer
 * placement and aria-expanded on the invoker all come free.
 *
 * Popovers are non-modal by spec, so focus is NOT trapped: Tab walks out into
 * the page behind. Accepted for a short nav; trapping would mean
 * <dialog>.showModal() and JavaScript (issue #10).
 *
 * Renders as nav — a list of navigation links is a landmark (issue #14).
 */
export function MenuPanel({
  id,
  label,
  children,
  style,
}: {
  id: string
  label: string
  children?: React.ReactNode
  style?: StyleProp
}) {
  return (
    <nav id={id} popover="auto" aria-label={label} {...stylex.props(styles.panel, style)}>
      {children}
    </nav>
  )
}
