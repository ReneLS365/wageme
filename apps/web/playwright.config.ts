import { defineConfig, devices } from '@playwright/test';

// Basiskonfiguration for Playwright. E2E tests kører mod den lokale udviklingsserver.
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});