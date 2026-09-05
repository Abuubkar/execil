import * as stylex from '@stylexjs/stylex'

/** Closed union. Adding an icon means adding a case here, so feature code can
 *  never reference one that does not exist. */
export type IconName = 'menu' | 'target' | 'checkSquare' | 'trend' | 'bars'

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
  target: (
    <>
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  checkSquare: (
    <>
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <path d="M6.5 10.5l2.5 2.5 4.5-5" strokeLinejoin="round" />
    </>
  ),
  trend: (
    <>
      <path d="M3 14l4-4 3 3 7-7" strokeLinejoin="round" />
      <path d="M13 6h4v4" strokeLinejoin="round" />
    </>
  ),
  bars: (
    <>
      <rect x="3" y="11" width="3" height="6" rx="1" fill="currentColor" stroke="none" />
      <rect x="8.5" y="7" width="3" height="10" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="3" width="3" height="14" rx="1" fill="currentColor" stroke="none" />
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
