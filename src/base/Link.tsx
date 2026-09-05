import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { color, motion, radius, shadow, space, text } from '../styles/tokens.stylex'

/** A link that looks like a button is `variant="button"` — NOT `Button as="a"`.
 *  The canvas has 6 brand-background anchors against 2 real buttons, so this is
 *  the common case, and it keeps the semantics honest. */
export type LinkVariant = 'plain' | 'inline' | 'nav' | 'navPill' | 'button' | 'buttonSecondary'

const variants = stylex.create({
  /** No visual treatment — for links that wrap their own composed content,
   *  such as the brand lockup. */
  plain: { color: 'inherit', textDecoration: 'none' },
  inline: {
    color: { default: color.textLink, ':hover': color.textLinkHover },
    textDecoration: 'underline',
  },
  nav: {
    color: { default: color.textSecondary, ':hover': color.textLinkHover },
    fontSize: text.md,
    fontWeight: text.weightMedium,
    textDecoration: 'none',
  },
  /** Header navigation. The plain `nav` colour shift (ink700 -> teal800) was
   *  too subtle to register, so this one fills a pill. Padding is constant and
   *  only the background changes, so hovering causes no layout shift. */
  navPill: {
    backgroundColor: { default: 'transparent', ':hover': color.surfaceAccent },
    borderRadius: radius.md,
    color: { default: color.textSecondary, ':hover': color.textLink },
    fontSize: text.md,
    fontWeight: text.weightMedium,
    paddingBlock: space.s6,
    paddingInline: space.s10,
    textDecoration: 'none',
    transitionDuration: motion.fast,
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion.ease,
  },
  button: {
    backgroundColor: {
      default: color.surfaceBrand,
      ':hover': color.surfaceBrandHover,
    },
    borderRadius: radius.xl,
    boxShadow: shadow.brandSm,
    color: color.surfaceRaised,
    fontSize: text.md,
    fontWeight: text.weightSemibold,
    paddingBlock: space.s14,
    paddingInline: space.s24,
    textDecoration: 'none',
    transitionDuration: motion.fast,
    transitionProperty: 'background-color',
    transitionTimingFunction: motion.ease,
  },
  buttonSecondary: {
    backgroundColor: color.surfaceRaised,
    borderColor: { default: color.borderStrong, ':hover': color.textLink },
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: '1px',
    color: { default: color.textHeading, ':hover': color.textLinkHover },
    fontSize: text.md,
    fontWeight: text.weightSemibold,
    paddingBlock: space.s14,
    paddingInline: space.s24,
    textDecoration: 'none',
    transitionDuration: motion.fast,
    transitionProperty: 'border-color, color',
    transitionTimingFunction: motion.ease,
  },
})

const base = stylex.create({
  link: { display: 'inline-block' },
  /** The section currently in view. Same treatment as hover, held. */
  current: {
    backgroundColor: color.surfaceAccent,
    color: color.textLink,
    fontWeight: text.weightSemibold,
  },
})

type LinkProps = {
  href: string
  variant?: LinkVariant
  /** Adds target and the rel pair. */
  external?: boolean
  children?: React.ReactNode
  style?: StyleProp
  'aria-label'?: string
  /** Fired on activation. Exists so sections can report an event without
   *  importing the analytics module — base/ must not depend on it, and
   *  sections must not depend on analytics either (issue #31). */
  onActivate?: () => void
  /** Marks the link whose section is in view. Renders aria-current, which is
   *  the semantic for "current item within a set" (nav scroll-spy). */
  current?: boolean
}

export function Link({
  href,
  variant = 'inline',
  external = false,
  children,
  style,
  'aria-label': ariaLabel,
  onActivate,
  current = false,
}: LinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      onClick={onActivate}
      aria-current={current ? 'location' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
      {...stylex.props(base.link, variants[variant], current && base.current, style)}
    >
      {children}
    </a>
  )
}
