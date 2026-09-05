import * as stylex from '@stylexjs/stylex'

/** Closed union. Adding an icon means adding a case here, so feature code can
 *  never reference one that does not exist. */
export type IconName = 'menu'

export type IconSize = 'sm' | 'md'

const sizes = stylex.create({
  sm: { height: '18px', width: '18px' },
  md: { height: '20px', width: '20px' },
})

const PATHS: Record<IconName, React.ReactNode> = {
  menu: (
    <>
      <line x1="1" y1="4" x2="19" y2="4" />
      <line x1="1" y1="10" x2="19" y2="10" />
      <line x1="1" y1="16" x2="19" y2="16" />
    </>
  ),
}

/** Decorative by default — aria-hidden unless given a title, in which case it
 *  becomes an img with an accessible name. */
export function Icon({
  name,
  size = 'md',
  title,
}: {
  name: IconName
  size?: IconSize
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
      {...stylex.props(sizes[size])}
    >
      {PATHS[name]}
    </svg>
  )
}
