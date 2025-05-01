import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000, // Increase global timeout to 60 seconds
  expect: {
    timeout: 10000, // Increase expect timeout to 10 seconds
  },
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',
    trace: 'retain-on-failure', // Trace only on failures to reduce overhead
    screenshot: 'only-on-failure', // Capture screenshots only if test fails
    video: 'retain-on-failure', // Saves video only for failed tests
    actionTimeout: 60000, // Increase action timeout to 15 seconds
    navigationTimeout: 30000, // Increase navigation timeout to 30 seconds
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  workers: 5, // Run tests in parallel to improve speed
  outputDir: 'test-results/', // Stores test artifacts (traces, videos, screenshots)
});