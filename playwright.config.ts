import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.testing' })

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:8000'

export default defineConfig({
  testDir: './e2e/specs',
  timeout: 60 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: [['html', { open: 'never' }]],
  webServer: {
    command: 'docker compose -f docker/dolibarr-test/docker-compose.yml up',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 180 * 1000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/fixtures/test-user.json',
      },
      dependencies: ['setup'],
    },
  ],
})
