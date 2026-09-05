import * as stylex from '@stylexjs/stylex'

import { color, radius } from '../styles/tokens.stylex'

const styles = stylex.create({
  mark: {
    alignItems: 'center',
    backgroundColor: color.surfaceBrand,
    borderRadius: radius.md,
    display: 'flex',
    height: '32px',
    justifyContent: 'center',
    width: '32px',
  },
  inner: {
    backgroundColor: color.textSuccess,
    borderRadius: radius.sm,
    height: '12px',
    width: '12px',
  },
})

/** The logo lockup's square. Purely decorative — the brand link carries the
 *  accessible name, so this is always aria-hidden. */
export function BrandMark() {
  return (
    <span aria-hidden="true" {...stylex.props(styles.mark)}>
      <span {...stylex.props(styles.inner)} />
    </span>
  )
}
