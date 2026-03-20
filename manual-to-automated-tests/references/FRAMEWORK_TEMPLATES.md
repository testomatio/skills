# Framework Configuration Templates

## Playwright

### Minimal Config

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
})
```

### Full Config (CI-Ready)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-reports' }],
    ['testomatio', { apiKey: process.env.TESTOMATIO }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

## CodeceptJS

### Minimal Config

```javascript
// codecept.conf.js
exports.config = {
  tests: './tests/**/*test.js',
  helpers: {
    Playwright: {
      url: 'http://localhost:3000',
      browser: 'chromium'
    }
  },
  include: {
    I: './steps_file.js'
  }
}
```

### Full Config (CI-Ready)

```javascript
exports.config = {
  tests: './tests/**/*test.js',
  output: './output',
  helpers: {
    Playwright: {
      url: process.env.BASE_URL || 'http://localhost:3000',
      browser: process.env.BROWSER || 'chromium',
      show: false,
      windowSize: '1200x900',
      waitForNavigation: 'networkidle',
      waitForAction: 500,
      timeout: 10000,
      screenshotOnFail: true
    },
    REST: {
      endpoint: process.env.API_URL || 'http://localhost:8080'
    },
    Testomatio: {
      enabled: true,
      updateRun: false
    }
  },
  plugins: {
    testomatio: {
      enabled: true
    },
    retryFailedStep: {
      enabled: true,
      retries: 2
    },
    screenshotOnFail: {
      enabled: true
    },
    autoLogin: {
      enabled: true,
      saveToFile: true,
      inject: 'loginAs'
    }
  },
  include: {
    I: './steps_file.js',
    loginPage: './pages/Login.js',
    homePage: './pages/Home.js'
  },
  name: 'my-project-tests'
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BASE_URL` | Application URL | `http://localhost:3000` |
| `API_URL` | API endpoint | `http://localhost:8080` |
| `BROWSER` | Browser to use | `chromium`, `firefox` |
| `HEADLESS` | Run headless | `true`, `false` |
| `TESTOMATIO` | TMS API key | `tstmt_xxx` |

## CI Configuration

### GitHub Actions

```yaml
# .github/workflows/tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          TESTOMATIO: ${{ secrets.TESTOMATIO }}
        run: npm test
      
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-reports/
```

### GitLab CI

```yaml
# .gitlab-ci.yml
e2e-tests:
  image: mcr.microsoft.com/playwright:v1.40.0
  stage: test
  script:
    - npm ci
    - npx playwright install --with-deps
    - TESTOMATIO=$TESTOMATIO npm test
  artifacts:
    when: always
    paths:
      - playwright-reports/
    expire_in: 7 days
```
