import * as stylex from '@stylexjs/stylex'

import type { StyleProp } from './Box'

export type ImageFit = 'cover' | 'contain'
export type ImageAnchor = 'center' | 'right' | 'upperRight'

const fits = stylex.create({
  cover: { objectFit: 'cover' },
  contain: { objectFit: 'contain' },
})

const anchors = stylex.create({
  center: { objectPosition: 'center' },
  right: { objectPosition: 'right center' },
  // Each axis only bites when that axis is the one being cropped, so this
  // serves a box that is taller than the image and one that is wider. Upper,
  // not top: a portrait subject usually has dead headroom above it.
  upperRight: { objectPosition: 'right 18%' },
})

const base = stylex.create({
  image: { display: 'block', height: '100%', width: '100%' },
})

type ImageProps = {
  src: string
  /** Width descriptors, e.g. `${a} 800w, ${b} 1600w`. Pair with `sizes`. */
  srcSet?: string
  sizes?: string
  /** Intrinsic dimensions, so the box is reserved before the bytes arrive. */
  width: number
  height: number
  /** Required, and never a literal — user-facing strings come from messages. */
  alt: string
  /** How the image fills its box. The parent owns the box; this owns the fill. */
  fit?: ImageFit
  /** Which part survives a `cover` crop. */
  anchor?: ImageAnchor
  /** The one image above the fold: fetched first, never lazy. */
  priority?: boolean
  style?: StyleProp
}

/** Closes the raw-`<img>` hole. Always fills its parent's box — sizing and
 *  cropping decisions belong to the parent, so it never sets its own width,
 *  radius or border. */
export function Image({
  src,
  srcSet,
  sizes,
  width,
  height,
  alt,
  fit = 'cover',
  anchor = 'center',
  priority = false,
  style,
}: ImageProps) {
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      {...stylex.props(base.image, fits[fit], anchors[anchor], style)}
    />
  )
}
