import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Multi-PC E2E testing
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './packages',
  testMatch: '**/*.e2e.test.ts',
  
  /* Run tests in files in parallel */
  fullyParallel: false,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'all-packages',
      testMatch: '**/all-packages.spec.ts',
      timeout: 60000,
    },
    {
      name: 'integration',
      testMatch: '**/integration.spec.ts',
      timeout: 120000,
    },
    {
      name: 'multi-pc-tests',
      testMatch: '**/multi-pc-orchestration.e2e.test.ts',
      timeout: 120000,
    },
    {
      name: 'pipeline-tests',
      testMatch: '**/full_pipeline.e2e.test.ts',
      timeout: 60000,
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
