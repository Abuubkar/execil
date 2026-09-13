// Writes public/llms.txt from the copy files. Generated, not hand-kept: it
// restates most of the landing page in one plain-text file, and a second hand-
// edited copy of the same facts is exactly the drift the brand assets already
// taught us to avoid. Run by `pnpm build`; the output is committed so a copy
// change shows up in the diff.
import { readFile, writeFile } from 'node:fs/promises'

const read = async (name) =>
  JSON.parse(await readFile(new URL(`../src/${name}.json`, import.meta.url), 'utf8'))

const m = await read('messages')
const legal = await read('legal')

const SITE = 'https://execil.net'
const out = []
const push = (...lines) => out.push(...lines, '')

push(`# ${m.site.name}`)
push(`> ${m.meta.description}`)

push(
  `${m.footer.tagline} ${m.specialties.lead} ${m.systems.note}`,
  '',
  `- Audience: ${m.meta.audience}`,
  `- Service area: ${m.meta.areaServed}`,
  `- Pricing: ${m.faq.items.find((i) => i.id === 'pricing').a}`,
  `- Contract: ${m.faq.items.find((i) => i.id === 'contract').a}`,
  `- Onboarding: ${m.faq.items.find((i) => i.id === 'onboarding-time').a}`,
  `- Contact: ${m.footer.email}, ${m.site.phone}`,
)

push(`## ${m.services.eyebrow}`, m.services.title)
for (const card of m.services.cards) {
  push(`### ${card.eyebrow}: ${card.title}`, card.blurb, '', ...card.items.map((i) => `- ${i}`))
}
push(m.services.footnote)

push(`## ${m.how.eyebrow}`, m.how.title)
push(...m.how.steps.map((s, i) => `${i + 1}. **${s.title}** — ${s.blurb}`))

push(
  `## ${m.specialties.eyebrow}`,
  m.specialties.lead,
  '',
  ...m.specialties.items.map((s) => `- ${s}`),
)

push(`## ${m.systems.title}`, ...m.systems.items.map((s) => `- [${s.name}](${s.href})`))

push(
  `## ${m.why.table.caption}`,
  `| | ${m.why.table.columns.slice(1).join(' | ')} |`,
  `| --- | --- | --- |`,
  ...m.why.table.rows.map((r) => `| ${r.label} | ${r.cells.join(' | ')} |`),
)

push(
  `## ${m.results.measuresTitle}`,
  ...m.results.measures.map(
    (x) => `- **${x.title}** — ${x.blurb}${x.source ? ` ${x.source}` : ''}`,
  ),
)
push(m.results.comingSoon)

push(`## ${m.fit.title}`)
push(`### ${m.fit.goodTitle}`, ...m.fit.good.map((x) => `- ${x}`))
push(`### ${m.fit.badTitle}`, ...m.fit.bad.map((x) => `- ${x}`))

push(`## ${m.faq.title}`)
for (const item of m.faq.items) push(`### ${item.q}`, item.a)

push(
  `## Pages`,
  `- [${m.meta.title}](${SITE}/)`,
  ...Object.entries(m.meta.legal).map(
    ([id, doc]) =>
      `- [${doc.title}](${SITE}/${id}): ${doc.description} Last updated ${legal[id].updated}.`,
  ),
)

await writeFile(new URL('../public/llms.txt', import.meta.url), `${out.join('\n')}`)
console.log(`public/llms.txt — ${out.length} lines`)
