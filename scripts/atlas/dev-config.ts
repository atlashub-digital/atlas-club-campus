import { randomBytes } from 'node:crypto'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { generateDockerCompose } from '../../apps/cli/src/templates/docker-compose'
import { generateEnvFile } from '../../apps/cli/src/templates/env'
import { generateNginxConf } from '../../apps/cli/src/templates/nginx'
import type { SetupConfig } from '../../apps/cli/src/types'

export function makeConfig(directory: string, password: string): SetupConfig {
  return {
    deploymentId: 'atlas-clubos-dev', installDir: directory, channel: 'stable',
    edition: 'community', domain: 'localhost', useHttps: false, httpPort: 8080, autoSsl: false,
    useExternalDb: false, dbPassword: randomBytes(24).toString('hex'), useAiDatabase: true,
    useExternalRedis: false, orgName: 'Atlas Club', orgSlug: 'atlas-club',
    adminEmail: 'admin@atlas-campus.example.com', adminPassword: password,
    aiEnabled: false, emailEnabled: false, s3Enabled: false, googleOAuthEnabled: false,
  }
}
export function renderConfig(config: SetupConfig) {
  // Keep the official topology; only the edge binding is restricted to loopback.
  const upstream = generateDockerCompose(config, 'atlas-club-campus:dev')
  const binding = '"${HTTP_PORT:-80}:80"'
  if (!upstream.includes(binding)) throw new Error('Upstream port template changed; review before running')
  const compose = upstream.replace(binding, '"127.0.0.1:${HTTP_PORT:-8080}:80"')
  // Redis database indices must be numeric for redis-py; isolated Redis instance.
  const env = generateEnvFile(config).replace('redis://redis:6379/learnhouse', 'redis://redis:6379/0')
  return { compose, env, nginx: generateNginxConf(config) }
}
if (import.meta.main) {
  const directory = resolve('.atlas/dev')
  if (existsSync(resolve(directory, '.env'))) throw new Error('Existing development secrets preserved; use the existing configuration')
  const password = process.env.ATLAS_DEV_ADMIN_PASSWORD || randomBytes(24).toString('hex')
  const config = makeConfig(directory, password)
  const output = renderConfig(config)
  mkdirSync(resolve(directory, 'extra'), { recursive: true })
  writeFileSync(resolve(directory, '.env'), output.env, { mode: 0o600 })
  writeFileSync(resolve(directory, 'docker-compose.yml'), output.compose)
  writeFileSync(resolve(directory, 'extra/nginx.prod.conf'), output.nginx)
  console.log('Development configuration created in .atlas/dev. Admin credentials are in its private .env; no secrets printed.')
}
