import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { color } from '../styles/tokens.stylex'

export type WordmarkSize = 'sm' | 'md'

const sizes = stylex.create({
  sm: { height: '32px' },
  md: { height: '40px' },
})

const styles = stylex.create({
  root: { color: color.textHeading, display: 'block', flex: 'none', width: 'auto' },
  badge: { fill: color.surfaceBrand },
  cross: { fill: color.textOnBrand },
})

/**
 * Satoshi Black outlines, the "i" tittle replaced by the cross badge. The
 * badge's clearance ring is cut into the letter paths — a mask here rasterises
 * through an intermediate surface and comes out soft.
 *
 * Generated from the same geometry as `public/brand/cross-dot/` — regenerate
 * both together. Decorative unless given a title, like Icon.
 */
export function Wordmark({
  size = 'sm',
  title,
  style,
}: {
  size?: WordmarkSize
  title?: string
  style?: StyleProp
}) {
  return (
    <svg
      viewBox="0 0 2890 887"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
      {...stylex.props(styles.root, sizes[size], style)}
    >
      <g transform="translate(40.0 847.2) scale(1 -1)">
        <path
          fill="currentColor"
          d="M547.0 0.0V150.0H239.0V303.0H512.0V445.0H239.0V590.0H547.0V740.0H77.0V0.0ZM1416.0 -13.0Q1519.0 -13.0 1588.0 36.5Q1657.0 86.0 1670.0 169.0H1529.0Q1521.0 142.0 1492.0 127.0Q1463.0 112.0 1419.0 112.0Q1359.0 112.0 1330.5 145.5Q1310.8 168.7 1304.7 209.3L1668.0 211.0V250.0Q1668.0 332.0 1637.0 391.5Q1606.0 451.0 1549.0 483.5Q1492.0 516.0 1413.0 516.0Q1338.0 516.0 1280.0 482.0Q1222.0 448.0 1189.5 388.5Q1157.0 329.0 1157.0 251.0Q1157.0 174.0 1190.5 114.5Q1224.0 55.0 1282.5 21.0Q1341.0 -13.0 1416.0 -13.0ZM1732.0 252.0Q1732.0 172.0 1764.0 112.5Q1796.0 53.0 1854.5 20.0Q1913.0 -13.0 1992.0 -13.0Q2062.0 -13.0 2117.0 14.0Q2172.0 41.0 2205.5 88.5Q2239.0 136.0 2244.0 199.0H2089.0Q2082.0 162.0 2057.5 143.5Q2033.0 125.0 1992.0 125.0Q1959.0 125.0 1935.5 140.0Q1912.0 155.0 1899.5 183.5Q1887.0 212.0 1887.0 252.0Q1887.0 291.0 1900.0 319.0Q1913.0 347.0 1937.5 362.5Q1962.0 378.0 1994.0 378.0Q2034.0 378.0 2057.5 360.0Q2081.0 342.0 2089.0 304.0H2244.0Q2237.0 402.0 2168.0 459.0Q2099.0 516.0 1988.0 516.0Q1913.0 516.0 1855.5 482.0Q1798.0 448.0 1765.0 388.5Q1732.0 329.0 1732.0 252.0ZM788.0 0.0 872.0 144.0 958.0 0.0H1135.0L976.0 245.0L1141.0 500.0H969.0L883.0 348.0L791.0 500.0H613.0L781.0 242.0L613.0 0.0ZM2752.0 0.0V754.0H2598.0V0.0ZM2328.0 0.0H2482.0V500.0H2443.0C2430.3 497.0 2417.1 495.4 2403.5 495.4C2389.9 495.4 2376.7 497.0 2364.0 500.0H2328.0ZM1306.8 304.0Q1309.6 317.9 1314.0 329.5Q1326.0 361.0 1350.5 376.0Q1375.0 391.0 1414.0 391.0Q1461.0 391.0 1488.0 367.5Q1515.0 344.0 1515.0 304.0Z"
        />
        <circle cx="2403.5" cy="665.5" r="141.8" {...stylex.props(styles.badge)} />
        <rect
          x="2352.5"
          y="648.1"
          width="102.1"
          height="34.7"
          rx="6.4"
          {...stylex.props(styles.cross)}
        />
        <rect
          x="2386.1"
          y="614.5"
          width="34.7"
          height="102.1"
          rx="6.4"
          {...stylex.props(styles.cross)}
        />
      </g>
    </svg>
  )
}
