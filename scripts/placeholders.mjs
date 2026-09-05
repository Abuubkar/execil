// Lists every remaining bracketed placeholder in messages.json with its key
// path. Exits non-zero while any remain, so it can gate the production deploy
// (issue #32) while only reporting on pull requests. See issue #11.
import { readFile } from 'node:fs/promises'

const path = new URL('../src/messages.json', import.meta.url)

let messages
try {
  messages = JSON.parse(await readFile(path, 'utf8'))
} catch {
  console.log('no src/messages.json yet — nothing to check')
  process.exit(0)
}

const hits = []
const walk = (node, keyPath) => {
  if (typeof node === 'string') {
    for (const p of node.match(/\[[^\]]+\]/g) ?? []) hits.push([keyPath, p])
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      walk(v, keyPath ? `${keyPath}.${k}` : k)
    }
  }
}
walk(messages, '')

for (const [keyPath, placeholder] of hits) {
  console.log(`${keyPath.padEnd(48)} ${placeholder}`)
}
console.log(`\n${hits.length} placeholder(s) remaining`)
process.exit(hits.length ? 1 : 0)
