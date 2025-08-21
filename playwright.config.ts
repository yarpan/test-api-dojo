import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
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
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects */
  projects: [

    {
      name: 'jsonplaceholder',
      testDir: './tests/json-placeholder/',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    },

    {
      name: 'nasa-apod',
      testDir: './tests/nasa-apod/',
      use: {
        baseURL: 'https://api.nasa.gov',
      },
    },

    {
      name: 'restful-booker',
      testDir: './tests/restful-booker/',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
      },
    },

    {
      name: 'spotify',
      testDir: './tests/spotify/',
      use: {
        baseURL: 'https://api.spotify.com/v1',
      },
    },
  ],

});
