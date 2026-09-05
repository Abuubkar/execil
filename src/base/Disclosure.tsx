import * as stylex from '@stylexjs/stylex'

import { color, motion, radius, space, text } from '../styles/tokens.stylex'

const styles = stylex.create({
  details: {
    backgroundColor: color.surfacePage,
    borderColor: color.borderDefault,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: '1px',
    overflow: 'hidden',
  },
  summary: {
    alignItems: 'center',
    color: { default: color.textHeading, ':hover': color.textLink },
    cursor: 'pointer',
    display: 'flex',
    fontSize: text.lg,
    fontWeight: text.weightBold,
    gap: space.s16,
    justifyContent: 'space-between',
    listStyle: 'none',
    minHeight: '56px',
    paddingBlock: space.s18,
    paddingInline: space.s20,
    transitionDuration: motion.fast,
    transitionProperty: 'color',
    transitionTimingFunction: motion.ease,
    '::-webkit-details-marker': { display: 'none' },
    ':focus-visible': {
      borderRadius: radius.xl,
      outlineColor: color.focusRing,
      outlineOffset: '-2px',
      outlineStyle: 'solid',
      outlineWidth: '2px',
    },
  },
  marker: {
    alignItems: 'center',
    backgroundColor: color.surfaceAccent,
    borderRadius: radius.circle,
    color: color.textLink,
    display: 'flex',
    flex: 'none',
    fontSize: text.lg,
    fontWeight: text.weightMedium,
    height: '26px',
    justifyContent: 'center',
    lineHeight: '1',
    transitionDuration: motion.base,
    transitionProperty: 'rotate',
    transitionTimingFunction: motion.ease,
    width: '26px',
    // StyleX has no descendant combinators, so `details[open] .marker` cannot
    // be written. when.ancestor is the supported form (issue #10) — and it
    // compiles to :where(.x-default-marker[open] *), so the ANCESTOR must opt
    // in by carrying stylex.defaultMarker(). Without it the rule never matches
    // and the marker silently fails to rotate.
    [stylex.when.ancestor('[open]')]: { rotate: '45deg' },
  },
  panel: {
    color: color.textProse,
    fontSize: text.md,
    lineHeight: text.leadingBody,
    paddingBlock: 0,
    paddingInline: space.s20,
    paddingBlockEnd: space.s20,
  },
})

/**
 * Native disclosure. Sharing a `name` makes a group EXCLUSIVE with no
 * JavaScript — opening one closes the others. Where `name` is unsupported the
 * attribute is ignored and panels open independently: it degrades, never breaks.
 *
 * No heading inside <summary>: some browsers give summary a button role that
 * strips its children's roles, so a heading there is unreliable. The section
 * keeps its own heading and these are navigated as buttons (issue #10).
 *
 * No role is added to <details> or the panel — the element permits none, and
 * the APG disclosure pattern does not ask for one.
 */
export function Disclosure({
  name,
  summary,
  marker = '+',
  children,
}: {
  name?: string
  summary: string
  marker?: string
  children?: React.ReactNode
}) {
  return (
    <details name={name} {...stylex.props(styles.details, stylex.defaultMarker())}>
      <summary {...stylex.props(styles.summary)}>
        <span>{summary}</span>
        <span aria-hidden="true" {...stylex.props(styles.marker)}>
          {marker}
        </span>
      </summary>
      <div {...stylex.props(styles.panel)}>{children}</div>
    </details>
  )
}
