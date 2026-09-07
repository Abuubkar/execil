import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'
import { color } from '../styles/tokens.stylex'

export type WordmarkSize = 'sm' | 'md'

const sizes = stylex.create({
  sm: { height: '28px' },
  md: { height: '40px' },
})

const styles = stylex.create({
  root: { color: color.textHeading, display: 'block', flex: 'none', width: 'auto' },
  badge: { fill: color.surfaceBrand },
  cross: { fill: color.textOnBrand },
})

/**
 * The Execil wordmark. Satoshi Black outlines with the tittle of the "i"
 * replaced by the cross badge — the letterforms are paths, not live text, so
 * the badge can sit exactly where the dot was at any size.
 *
 * Generated from the same geometry as `public/brand/cross-dot/`. Regenerate
 * both together rather than editing the path data by hand.
 *
 * Decorative by default — aria-hidden unless given a title, in which case it
 * becomes an img with an accessible name. Matches Icon.
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
        <g fill="currentColor">
          <path
            transform="translate(0.0 0)"
            d="M547.0 0.0H77.0V740.0H547.0V590.0H194.0L239.0 632.0V445.0H512.0V303.0H239.0V108.0L194.0 150.0H547.0Z"
          />
          <path
            transform="translate(603.0 0)"
            d="M185.0 0.0H10.0L178.0 242.0L10.0 500.0H188.0L280.0 348.0L366.0 500.0H538.0L373.0 245.0L532.0 0.0H355.0L269.0 144.0Z"
          />
          <path
            transform="translate(1126.0 0)"
            d="M290.0 -13.0Q215.0 -13.0 156.5 21.0Q98.0 55.0 64.5 114.5Q31.0 174.0 31.0 251.0Q31.0 329.0 63.5 388.5Q96.0 448.0 154.0 482.0Q212.0 516.0 287.0 516.0Q366.0 516.0 423.0 483.5Q480.0 451.0 511.0 391.5Q542.0 332.0 542.0 250.0V211.0L112.0 209.0L114.0 304.0H389.0Q389.0 344.0 362.0 367.5Q335.0 391.0 288.0 391.0Q249.0 391.0 224.5 376.0Q200.0 361.0 188.0 329.5Q176.0 298.0 176.0 249.0Q176.0 179.0 204.5 145.5Q233.0 112.0 293.0 112.0Q337.0 112.0 366.0 127.0Q395.0 142.0 403.0 169.0H544.0Q531.0 86.0 462.0 36.5Q393.0 -13.0 290.0 -13.0Z"
          />
          <path
            transform="translate(1701.0 0)"
            d="M31.0 252.0Q31.0 329.0 64.0 388.5Q97.0 448.0 154.5 482.0Q212.0 516.0 287.0 516.0Q398.0 516.0 467.0 459.0Q536.0 402.0 543.0 304.0H388.0Q380.0 342.0 356.5 360.0Q333.0 378.0 293.0 378.0Q261.0 378.0 236.5 362.5Q212.0 347.0 199.0 319.0Q186.0 291.0 186.0 252.0Q186.0 212.0 198.5 183.5Q211.0 155.0 234.5 140.0Q258.0 125.0 291.0 125.0Q332.0 125.0 356.5 143.5Q381.0 162.0 388.0 199.0H543.0Q538.0 136.0 504.5 88.5Q471.0 41.0 416.0 14.0Q361.0 -13.0 291.0 -13.0Q212.0 -13.0 153.5 20.0Q95.0 53.0 63.0 112.5Q31.0 172.0 31.0 252.0Z"
          />
          <path transform="translate(2270.0 0)" d="M58.0 0.0V500.0H212.0V0.0ZZ" />
          <path transform="translate(2540.0 0)" d="M212.0 0.0H58.0V754.0H212.0Z" />
        </g>
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
