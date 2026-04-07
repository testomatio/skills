# Playwright Best Practices - Complete Guide

This document combines fundamental and advanced Playwright test automation practices for building scalable, maintainable E2E frameworks.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Test Specs  →  Fixtures  →  Modules  →  Pages  →  Browser  │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    Reports (HTML, Trace)
                    
```

**Core Principles:**
- **Pages**: Dumb locator containers with simple element interactions only
- **Modules**: Own all business logic, orchestrate multiple Page actions into domain workflows
- **Fixtures**: Dependency injection - tests never instantiate Pages or Modules directly
- **Test.step()**: Use for reporting, trace analysis, and debugging

---

## Project Structure

```
project-root/
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript config with path aliases
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Scripts and dependencies
│
├── tests/                        # Test specifications
│   ├── auth/
│   │   └── login.spec.ts
│   ├── products/
│   │   └── product.spec.ts
│   └── ...
│
├── fixtures/                     # Custom fixtures for DI
│   ├── base.ts
│   ├── authenticated.ts
│   └── index.ts
│
├── src/
│   ├── pages/                   # Locators & basic actions
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   └── index.ts
│   │
│   ├── modules/                 # Business logic layer
│   │   ├── AuthModule.ts
│   │   ├── ProductModule.ts
│   │   └── index.ts
│   │
│   └── api/                     # API testing
│       ├── AuthApi.ts
│       ├── ProductApi.ts
│       └── index.ts
│
├── utils/                        # Utilities
│   ├── Logger.ts
│   ├── WaitHelper.ts
│   ├── DataGenerator.ts
│   ├── ApiHelper.ts
│   └── index.ts
│
├── config/                       # Configuration
│   ├── index.ts
│   ├── test-groups.ts
│   └── test-data/
│       ├── users.json
│       └── products.json
│
├── playwright-report/           # Default Playwright reports
└── test-results/                # JSON results & artifacts
```

### TypeScript Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["src/pages/*"],
      "@modules/*": ["src/modules/*"],
      "@api/*": ["src/api/*"],
      "@utils/*": ["utils/*"],
      "@config/*": ["config/*"],
      "@fixtures/*": ["fixtures/*"]
    }
  }
}
```

---

## Configuration

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['testomatio', { apiKey: process.env.TESTOMATIO }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: process.env.CI ? {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  } : undefined,
})
```

---

## Locator Strategy

**Priority Order (use top to bottom):**

| Priority | Locator | When to Use |
|----------|---------|-------------|
| 1 | `getByRole()` | Buttons, links, headings, alerts |
| 2 | `getByLabel()` | Form input fields |
| 3 | `getByPlaceholder()` | Input placeholders |
| 4 | `getByText()` | Visible text content |
| 5 | `getByTestId()` | `data-testid` attributes |
| 6 | CSS/XPath | **Last resort only** |

```typescript
// Good locators
await page.getByRole('button', { name: 'Submit' }).click()
await page.getByLabel('Email').fill('user@test.com')
await page.getByPlaceholder('Enter your name').fill('John')
await page.getByText('Welcome back').isVisible()
await page.getByTestId('submit-button').click()

// Avoid - CSS only when necessary
await page.locator('.btn-primary.submit-form').click()
```

### Test IDs

Always prefer semantic locators. Only add `data-testid` when:
- No semantic locator is possible
- Element has dynamic attributes
- Testing specific interactive components

```typescript
// In your application HTML
<button data-testid="submit-form-btn">Submit</button>

// In tests
await page.getByTestId('submit-form-btn').click()
```

---

## Page Objects

**Rule**: Pages are dumb containers - only locators and simple actions.

```typescript
// src/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.getByLabel('Email')
    this.passwordInput = page.getByLabel('Password')
    this.submitButton = page.getByRole('button', { name: 'Sign In' })
    this.errorMessage = page.getByRole('alert')
  }

  async navigate(): Promise<void> {
    await this.goto('/login')
  }

  async fillEmail(email: string): Promise<void> {
    await this.fill(this.emailInput, email)
  }

  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password)
  }

  async submit(): Promise<void> {
    await this.click(this.submitButton)
    await this.page.waitForURL(/\/dashboard/)
  }

  async getErrorMessage(): Promise<string> {
    return this.errorMessage.textContent() ?? ''
  }
}
```

---

## Modules (Business Logic)

**Rule**: All conditional logic and multi-step flows belong in Modules.

```typescript
// src/modules/AuthModule.ts
import { Page } from '@playwright/test'
import { LoginPage } from '@pages/LoginPage'
import { DashboardPage } from '@pages/DashboardPage'

export class AuthModule {
  private loginPage: LoginPage
  private dashboardPage: DashboardPage

  constructor(page: Page) {
    this.loginPage = new LoginPage(page)
    this.dashboardPage = new DashboardPage(page)
  }

  async doLogin(credentials: { email: string; password: string }): Promise<void> {
    await this.loginPage.navigate()
    await this.loginPage.fillEmail(credentials.email)
    await this.loginPage.fillPassword(credentials.password)
    await this.loginPage.submit()
    await this.dashboardPage.waitForLoaded()
  }

  async doLoginAndExpectError(credentials: { email: string; password: string }): Promise<string> {
    await this.loginPage.navigate()
    await this.loginPage.fillEmail(credentials.email)
    await this.loginPage.fillPassword(credentials.password)
    await this.loginPage.submit()
    return this.loginPage.getErrorMessage()
  }
}
```

## API Testing

### ApiHelper Utility

```typescript
// utils/ApiHelper.ts
import { APIRequestContext } from '@playwright/test'

export class ApiHelper {
  constructor(
    private request: APIRequestContext,
    private baseURL: string,
  ) {}

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.request.get(`${this.baseURL}${endpoint}`, { headers })
    return response.json() as Promise<T>
  }
...
}
```

---

### API + UI Testing Pattern

```typescript
test('should create user via API and verify in UI @P1', async ({ request, page }) => {
  const api = new AuthApi(request)
  
  await test.step('Create user via API', async () => {
    const { userId } = await api.register('newuser@test.com', 'password123', 'New User')
    return userId
  })
  
  await test.step('Navigate to user profile in UI', async () => {
    await page.goto(`/users/${userId}`)
  })
  
  await test.step('Verify user data in UI', async () => {
    await expect(page.getByText('New User')).toBeVisible()
    await expect(page.getByText('newuser@test.com')).toBeVisible()
  })
})
```

---

## Utilities

### Logger

```typescript
// utils/Logger.ts
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

export class Logger {
  constructor(private context: string) {}

  private log(level: LogLevel, message: string, data?: unknown): void {
    const timestamp = new Date().toISOString()
    const entry = `[${timestamp}] [${level}] [${this.context}] ${message}`
    
    if (data) {
      console.log(entry, JSON.stringify(data, null, 2))
    } else {
      console.log(entry)
    }
  }

  debug(message: string, data?: unknown): void { this.log('DEBUG', message, data) }
  info(message: string, data?: unknown): void { this.log('INFO', message, data) }
  warn(message: string, data?: unknown): void { this.log('WARN', message, data) }
  error(message: string, data?: unknown): void { this.log('ERROR', message, data) }
}
```

### Soft Assertions

```typescript
// utils/soft-assert.ts
import { test as base } from '@playwright/test'

const softExpect = base.expect.configure({ soft: true })

export { softExpect }

// Usage in tests:
await softExpect(page.getByTestId('name')).toHaveText('John')
await softExpect(page.getByTestId('email')).toHaveText('john@test.com')
```

### Assertions

```typescript
import { expect } from '@playwright/test'

// Element assertions
await expect(page.getByTestId('status')).toHaveText('Active')
await expect(page.getByRole('alert')).toBeVisible()
await expect(page.getByTestId('loading')).not.toBeVisible()
await expect(page.getByTestId('count')).toHaveCount(5)
...
```

---

## Test Tags & Filtering

| Tag | Purpose | Command |
|-----|---------|---------|
| `@P0` | Critical - must pass | `npx playwright test --grep @P0` |
| `@P1` | High priority | `npx playwright test --grep @P1` |
| `@P2` | Medium priority | `npx playwright test --grep @P2` |
| `@Smoke` | Smoke test suite | `npx playwright test --grep @Smoke` |
| `@Regression` | Full regression | `npx playwright test --grep @Regression` |
| `@Slow` | Slow tests | `npx playwright test --grep -v @Slow` |

---

## Parallel Execution

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  
  // For shared state tests
  workers: 1,
})

// Test-level isolation
test.describe.configure({ mode: 'serial' }) // Run tests sequentially within describe
```

---

## Debugging & Reporting

### Debug Commands

```bash
# Show trace viewer
npx playwright show-trace trace.zip

# Debug mode with UI
npx playwright test --debug

# Debug with Playwright Inspector
npx playwright test --project=chromium --debug

# Open browser with selectors
npx playwright open --debug https://example.com

# Checkcodegen
npx playwright codegen https://example.com
```

---

## Anti-Patterns (Avoid)

1. **Never use `page.locator()` in a Module** - always go through Page class methods
2. **Never put complex logic in Pages** - Pages are dumb locator containers
3. **Never hardcode test data** - use DataGenerator or JSON test data files
4. **Never share state between tests** - each test is isolated
5. **Never ignore flaky tests** - fix immediately with proper waits
6. **Never use arbitrary `sleep()`** - use explicit waits instead
7. **Never test multiple things in one test** - single responsibility
8. **Never commit secrets or credentials** - use environment variables


## Best Practices Checklist

- [ ] Pages contain only locators and simple actions
- [ ] Modules own all business logic and conditional flows
- [ ] Use fixtures for dependency injection
- [ ] Prefer `getByRole()`, `getByLabel()` over CSS selectors
- [ ] Use `data-testid` only when semantic locators aren't possible
- [ ] Use `test.step()` for reporting and trace analysis
- [ ] Tag all tests with `@P0`/`@P1`/`@P2` for priority
- [ ] Use API for setup/teardown over UI when possible
- [ ] Keep tests independent - each test sets up its own state
- [ ] Use path aliases (`@pages/`, `@modules/`)
- [ ] Use test data instead of hardcode
- [ ] Run tests in parallel (when safe)
- [ ] Implement soft assertions for non-critical checks