import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Configuration for Playwright Test Runner
 * Includes multiple reporters, browser projects, and environment settings
 */
export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: parseInt(process.env.DEFAULT_TIMEOUT || '60000'),
  
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    // Line reporter for console output
    ['line'],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'https://demowebshop.tricentis.com',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Capture screenshot only on test failure
    screenshot: 'only-on-failure',
    
    // Record video only on test failure
    video: 'retain-on-failure',
    
    // Timeout for each action
    actionTimeout: 10000,
    
    // Navigation timeout
    navigationTimeout: 30000,
    
    // Viewport settings
    viewport: { 
      width: parseInt(process.env.VIEWPORT_WIDTH || '1920'), 
      height: parseInt(process.env.VIEWPORT_HEIGHT || '1080') 
    },
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome']
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  // Folder for test artifacts
  outputDir: 'test-results/',
});