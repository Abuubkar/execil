// Computes the metric-matched fallback @font-face rules from the actual Satoshi
// file. No library publishes Satoshi's metrics, so they are read from the font.
// Re-run only if the font file changes (pinned at Satoshi 1.0). See issue #21.
import { readFile } from 'node:fs/promises'
import { fromBuffer } from '@capsizecss/unpack'
import { createFontStack } from '@capsizecss/core'
import arial from '@capsizecss/metrics/arial'
import roboto from '@capsizecss/metrics/roboto'

// NOTE: @capsizecss/unpack exports fromBuffer/fromUrl/fromBlob — there is no
// fromFile in this version, despite what several guides claim.
const satoshi = await fromBuffer(await readFile('public/fonts/Satoshi-Variable.woff2'))

console.log('--- Satoshi metrics read from the file')
console.log({
  familyName: satoshi.familyName,
  unitsPerEm: satoshi.unitsPerEm,
  ascent: satoshi.ascent,
  descent: satoshi.descent,
  lineGap: satoshi.lineGap,
  xWidthAvg: satoshi.xWidthAvg,
})

const { fontFamily, fontFaces } = createFontStack([satoshi, arial, roboto], {
  fontFaceProperties: { fontDisplay: 'swap' },
})

console.log('\n--- font-family stack')
console.log(fontFamily)
console.log('\n--- fallback @font-face rules (paste into app.css)')
console.log(fontFaces)
