import * as stylex from '@stylexjs/stylex'

import { Icon } from './Icon'
import type { IconName } from './Icon'
import { color, radius } from '../styles/tokens.stylex'

const styles = stylex.create({
  button: {
    alignItems: 'center',
    backgroundColor: color.surfaceRaised,
    borderColor: color.borderStrong,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: '1px',
    color: color.textHeading,
    cursor: 'pointer',
    display: 'flex',
    height: '44px',
    justifyContent: 'center',
    padding: 0,
    width: '44px',
  },
})

/** `label` is REQUIRED — an icon-only control cannot render without an
 *  accessible name. This is the mitigation for jsx-no-literals not seeing
 *  attribute strings (issue #11). */
export function IconButton({
  icon,
  label,
  popoverTarget,
  type = 'button',
}: {
  icon: IconName
  label: string
  /** Makes this a declarative popover invoker — no JavaScript. */
  popoverTarget?: string
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      aria-label={label}
      popoverTarget={popoverTarget}
      {...stylex.props(styles.button)}
    >
      <Icon name={icon} size="sm" />
    </button>
  )
}
