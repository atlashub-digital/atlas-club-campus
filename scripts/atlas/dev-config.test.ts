import { test, expect } from 'bun:test'
import { makeConfig, renderConfig } from './dev-config'
test('isolated development stack uses loopback and preserves all upstream services', () => {
  const { compose, env } = renderConfig(makeConfig('/tmp/atlas-config-test', 'test-password-only'))
  expect(compose).toContain('"127.0.0.1:${HTTP_PORT:-8080}:80"')
  expect(compose).not.toContain('"80:80"')
  expect(compose).not.toContain('"443:443"')
  for (const service of ['learnhouse-app:', 'db:', 'redis:', 'nginx:', 'ssr-fwd:']) expect(compose).toContain(service)
  expect(compose).toContain('image: atlas-club-campus:dev')
  expect(compose).not.toContain(':latest')
  expect(env).toContain('NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG=atlas-club')
  expect(env).toContain('LEARNHOUSE_REDIS_CONNECTION_STRING=redis://redis:6379/0')
  expect(env).toContain('@db:5432/learnhouse')
  expect(env).not.toContain('SUPABASE')
  expect(env).not.toContain('LEARNHOUSE_FORCE_EE')
})
test('each generation produces independent database and authentication secrets', () => {
  const a = renderConfig(makeConfig('/tmp/a', 'test-password-only')).env
  const b = renderConfig(makeConfig('/tmp/b', 'test-password-only')).env
  for (const key of ['NEXTAUTH_SECRET','LEARNHOUSE_AUTH_JWT_SECRET_KEY','COLLAB_INTERNAL_KEY','POSTGRES_PASSWORD']) {
    const value = (s: string) => s.split('\n').find(line => line.startsWith(key + '='))
    expect(value(a)).toBeDefined()
    expect(value(a)).not.toEqual(value(b))
  }
})
