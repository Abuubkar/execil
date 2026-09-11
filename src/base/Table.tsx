import * as stylex from '@stylexjs/stylex'

import { Text } from './Text'
import { color, radius, screen, space, text } from '../styles/tokens.stylex'

/**
 * Data-driven, not compositional. There is one table on the site and its
 * narrow-screen behaviour is the decision this interface exists to hold in one
 * place — call sites never write row or cell elements (issue #9).
 *
 * Below screen.table it renders STACKED rows under one header rather than
 * scrolling horizontally. The column names appear once; the teal on the last
 * column is what ties a value back to its heading once that heading has
 * scrolled away. Column order runs [label, them, us], so overflow-x would show a
 * phone the competitor's column in full and hide ours — the section would argue
 * against itself until the visitor scrolled sideways. Verified in the prototype
 * on branch prototype/table-options (issue #17).
 */
export type TableRow = {
  label: string
  /** One cell per column after the label. The last is emphasised. */
  cells: readonly string[]
}

const styles = stylex.create({
  // --- wide: a real table
  table: {
    borderCollapse: 'collapse',
    display: { default: 'none', [screen.tableUp]: 'table' },
    fontSize: text.md,
    // Auto layout sized the two compared columns unequally.
    tableLayout: 'fixed',
    width: '100%',
  },
  colLabel: { width: '30%' },
  colValue: { width: '35%' },
  th: {
    borderBlockEndColor: color.borderStrong,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    color: color.textMuted,
    fontSize: text.sm,
    fontWeight: text.weightSemibold,
    letterSpacing: text.trackingWide,
    paddingBlock: space.s12,
    paddingInline: space.s14,
    textAlign: 'start',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  rowHead: {
    borderBlockEndColor: color.borderDefault,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    color: color.textHeading,
    fontWeight: text.weightSemibold,
    paddingBlock: space.s12,
    paddingInline: space.s14,
    textAlign: 'start',
    verticalAlign: 'top',
  },
  td: {
    borderBlockEndColor: color.borderDefault,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    color: color.textProse,
    paddingBlock: space.s12,
    paddingInline: space.s14,
    verticalAlign: 'top',
  },
  tdEmphasis: { color: color.textLink, fontWeight: text.weightSemibold },

  // --- narrow: stacked rows
  stack: {
    display: { default: 'flex', [screen.tableUp]: 'none' },
    flexDirection: 'column',
    gap: space.s10,
  },
  stackRow: {
    borderBlockEndColor: color.borderDefault,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    gap: space.s6,
    paddingBlockEnd: space.s10,
  },
  stackPair: { display: 'grid', gap: space.s10, gridTemplateColumns: '1fr 1fr' },
  // The column names, once, on the same grid as every pair below them.
  stackHead: {
    borderBlockEndColor: color.borderStrong,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    paddingBlockEnd: space.s8,
  },
  stackKey: { letterSpacing: text.trackingWide, textTransform: 'uppercase' },
  caption: {
    borderRadius: radius.md,
    captionSide: 'top',
    textAlign: 'start',
  },
})

export function Table({
  caption,
  columns,
  rows,
}: {
  /** Names the table for assistive tech. Visually hidden is not used here —
   *  the section heading is visible and this repeats it for the table itself. */
  caption: string
  /** First entry labels the row-header column and is usually empty. */
  columns: readonly string[]
  rows: readonly TableRow[]
}) {
  const [, ...valueColumns] = columns

  return (
    <>
      <table {...stylex.props(styles.table)}>
        <caption {...stylex.props(styles.caption)}>
          <Text size="sm" tone="muted">
            {caption}
          </Text>
        </caption>
        <thead>
          <tr>
            {columns.map((heading, i) => (
              <th
                key={heading || `col-${i}`}
                scope="col"
                {...stylex.props(styles.th, i === 0 ? styles.colLabel : styles.colValue)}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" {...stylex.props(styles.rowHead)}>
                {row.label}
              </th>
              {row.cells.map((cell, i) => (
                <td
                  key={cell}
                  {...stylex.props(styles.td, i === row.cells.length - 1 && styles.tdEmphasis)}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div {...stylex.props(styles.stack)}>
        <div {...stylex.props(styles.stackPair, styles.stackHead)}>
          {valueColumns.map((heading, i) => (
            <Text
              key={heading}
              size="xs"
              tone={i === valueColumns.length - 1 ? 'link' : 'muted'}
              weight="semibold"
              style={styles.stackKey}
            >
              {heading}
            </Text>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.label} {...stylex.props(styles.stackRow)}>
            <Text size="md" tone="heading" weight="semibold">
              {row.label}
            </Text>
            <div {...stylex.props(styles.stackPair)}>
              {row.cells.map((cell, i) => (
                <Text
                  key={cell}
                  size="base"
                  tone={i === row.cells.length - 1 ? 'link' : 'prose'}
                  weight={i === row.cells.length - 1 ? 'semibold' : 'regular'}
                >
                  {cell}
                </Text>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
