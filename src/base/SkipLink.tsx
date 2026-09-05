import * as stylex from '@stylexjs/stylex'

import { color, radius, space, text } from '../styles/tokens.stylex'

const styles = stylex.create({
  link: {
    backgroundColor: color.surfaceBrand,
    borderRadius: radius.md,
    color: color.surfaceRaised,
    fontSize: text.base,
    fontWeight: text.weightSemibold,
    insetBlockStart: { default: '-100%', ':focus-visible': space.s8 },
    insetInlineStart: space.s8,
    paddingBlock: space.s10,
    paddingInline: space.s16,
    position: 'fixed',
    textDecoration: 'none',
    // Above the sticky header, which sits at 50.
    zIndex: 100,
  },
})

/**
 * NOT VisuallyHidden + Link: VisuallyHidden is unconditionally hidden, and a
 * skip link must be hidden UNTIL focused. Revealed on :focus-visible rather
 * than :focus so it does not flash on a mouse click.
 *
 * The target must be focusable — <main> carries tabIndex={-1} — or the browser
 * scrolls but leaves focus in place and the next Tab returns to the header.
 */
export function SkipLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} {...stylex.props(styles.link)}>
      {children}
    </a>
  )
}
