import * as stylex from '@stylexjs/stylex'

import { Icon } from './Icon'
import type { IconName } from './Icon'
import { color, radius } from '../styles/tokens.stylex'

const styles = stylex.create({
  tile: {
    alignItems: 'center',
    backgroundColor: color.surfaceAccent,
    borderRadius: radius.xl,
    color: color.textLink,
    display: 'flex',
    flex: 'none',
    height: '44px',
    justifyContent: 'center',
    width: '44px',
  },
})

/** Decorative container for a section icon. The heading beside it carries the
 *  meaning, so the icon inside stays aria-hidden. */
export function IconTile({ icon }: { icon: IconName }) {
  return (
    <span aria-hidden="true" {...stylex.props(styles.tile)}>
      <Icon name={icon} size="md" />
    </span>
  )
}
