import { type Ref } from 'react'

/** A bare mount point for a third-party script to render into. Exists so
 *  feature code never writes a raw <div>, and so the escape hatch is named and
 *  greppable rather than an exemption comment. */
export function Mount({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return <div ref={ref} />
}
