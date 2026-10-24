import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './atlas', testMatch: 'campus.spec.ts', timeout: 120_000, workers: 1, retries: 0,
  outputDir: 'atlas-results',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'atlas-report' }]],
  use: { baseURL: process.env.E2E_BASE_URL || 'http://localhost:8080', screenshot: 'only-on-failure', trace: 'off', video: 'off' },
})
