import * as stylex from '@stylexjs/stylex'

/** Closed union. Adding an icon means adding a case here, so feature code can
 *  never reference one that does not exist. */
export type IconName =
  | 'menu'
  | 'target'
  | 'checkSquare'
  | 'trend'
  | 'bars'
  | 'phone'
  | 'city'
  | 'pin'
  | 'chevronDown'

export type IconSize = 'xs' | 'sm' | 'md'

const sizes = stylex.create({
  xs: { height: '16px', width: '16px' },
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
  phone: (
    <g transform="scale(0.8333)">
      <path
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      />
    </g>
  ),
  city: (
    <g transform="scale(0.8333)">
      <path strokeLinejoin="round" d="M3 21h18" />
      <path strokeLinejoin="round" d="M4 21V9h7v12" />
      <path strokeLinejoin="round" d="M11 21V4h9v17" />
      <path d="M7.5 13v0M7.5 17v0M15.5 8v0M15.5 12v0M15.5 16v0" />
    </g>
  ),
  pin: (
    <g transform="scale(0.8333)">
      <path strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </g>
  ),
  chevronDown: (
    <g transform="scale(0.8333)">
      <path strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </g>
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
