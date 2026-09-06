// Lists every remaining bracketed placeholder in the copy files with its key
// path. Exits non-zero while any remain, so it can gate the production deploy
// (issue #32) while only reporting on pull requests. See issue #11.
import { readFile } from 'node:fs/promises'

const files = ['messages', 'legal']

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

for (const name of files) {
  const path = new URL(`../src/${name}.json`, import.meta.url)
  let copy
  try {
    copy = JSON.parse(await readFile(path, 'utf8'))
  } catch {
    console.log(`no src/${name}.json yet — nothing to check`)
    continue
  }
  walk(copy, name)
}

for (const [keyPath, placeholder] of hits) {
  console.log(`${keyPath.padEnd(48)} ${placeholder}`)
}
console.log(`\n${hits.length} placeholder(s) remaining`)
process.exit(hits.length ? 1 : 0)
