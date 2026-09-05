import * as stylex from '@stylexjs/stylex'

const styles = stylex.create({
  hidden: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
})

/** Unconditionally hidden from sight, still announced. A skip link needs
 *  hidden-UNTIL-focused, which is different behaviour — that is SkipLink. */
export function VisuallyHidden({ children }: { children?: React.ReactNode }) {
  return <span {...stylex.props(styles.hidden)}>{children}</span>
}
