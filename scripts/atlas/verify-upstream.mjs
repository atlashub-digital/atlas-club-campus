import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const pin = JSON.parse(readFileSync('upstream.lock.json', 'utf8'))
execFileSync('git', ['merge-base', '--is-ancestor', pin.commit, 'HEAD'])
for (const file of ['LICENSE','apps/api/pyproject.toml','apps/api/uv.lock','apps/web/bun.lock','apps/collab/bun.lock']) {
  const upstream = execFileSync('git', ['show', pin.commit + ':' + file])
  assert.equal(readFileSync(file, 'utf8').replace(/\r\n/g, '\n'), upstream.toString().replace(/\r\n/g, '\n'), file + ' changed from pinned upstream')
}
console.log('PASS: upstream ancestry, license and dependency locks preserved')
