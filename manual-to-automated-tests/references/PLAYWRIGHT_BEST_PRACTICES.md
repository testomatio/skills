# Playwright Best Practices

## Project Structure

```
fixtures/        # Test data & setup
src/
├── pages/           # Page Object Models
├── components/     # Reusable components
├── modules/     # Business Layer
tests/
  ├── api/             # Test specs
  ├── ui/              # Test specs
  └── e2e/             # Test specs
utils             # Utility functions
├── helpers/  
test-data/       
```

## Configuration

### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['testomatio', { apiKey: process.env.TESTOMATIO }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

## Basic Test Structure

```typescript
import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'

test.describe('Login Flow', () => {
  let loginPage: LoginPage
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    dashboardPage = new DashboardPage(page)
  })

  test('should login with valid credentials', async () => {
    await loginPage.goto()
    await loginPage.fillCredentials('user@test.com', 'password123')
    await loginPage.submit()
    
    await expect(dashboardPage.userName).toBeVisible()
  })
})
```

## Locators Priority

1. `page.getByTestId()` - Most reliable
2. `page.getByRole()` - Accessible
3. `page.getByLabel()` - Form fields
4. `page.getByText()` - Visible text
5. `page.locator()` - CSS/XPath last resort

## Actions

```typescript
// Click with navigation
await page.getByRole('link', { name: 'Dashboard' }).click()
await expect(page).toHaveURL(/dashboard/)

// Fill forms
await page.getByLabel('Email').fill('user@test.com')

// Select options
await page.getByRole('combobox').selectOption('Option 1')

// Checkboxes
await page.getByRole('checkbox').check()

// Hover & drag
await page.getByTestId('draggable').dragTo(page.getByTestId('dropzone'))
```

## Assertions

```typescript
// Built-in expect
await expect(page.getByTestId('status')).toHaveText('Active')
await expect(page.getByRole('alert')).toBeVisible()
await expect(page).toHaveURL(/\/dashboard/)
await expect(page).toHaveTitle('Dashboard')

// Soft assertions (continue on failure)
import { softExpect } from './helpers/soft-assert'
await softExpect(page.getByTestId('name')).toHaveText('John')
```

## Fixtures & Hooks

```typescript
// fixtures/users.ts
export const testUsers = {
  admin: { email: 'admin@test.com', role: 'admin' },
  user: { email: 'user@test.com', role: 'user' },
}

// tests/auth/login.spec.ts
test.use({ user: testUsers.admin })

test('admin dashboard', async ({ page, user }) => {
  // user is available
})
```

## API Testing in E2E

```typescript
test('create user via API then verify in UI', async ({ request }) => {
  const user = await request.post('/api/users', {
    data: { name: 'Test User', email: 'test@example.com' }
  })
  
  const userId = (await user.json()).id
  
  await page.goto(`/users/${userId}`)
  await expect(page.getByText('Test User')).toBeVisible()
})
```

## Debugging

```bash
# Show trace viewer
npx playwright show-trace trace.zip

# Debug mode
npx playwright test --debug

# Check selectors
npx playwright open --debug
```

## Parallel Execution

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  // For data-dependent tests
  workers: 1, // when using shared state
})
```

## Common Patterns

### Modal Handling
```typescript
async function handleModal(action: 'accept' | 'dismiss') {
  if (action === 'accept') {
    await page.getByRole('button', { name: 'Confirm' }).click()
  } else {
    await page.getByRole('button', { name: 'Cancel' }).click()
  }
  await page.getByRole('dialog').waitFor({ state: 'hidden' })
}
```

### Page Wait Pattern
```typescript
async goto(path = '') {
  await this.page.goto(`${process.env.BASE_URL || ''}${path}`)
  await this.page.waitForLoadState('networkidle')
}
```

## Summary Checklist

- [ ] Use Page Objects for UI interactions
- [ ] Prefer getByTestId over CSS selectors
- [ ] Use explicit waits
- [ ] Generate screenshots on failure
- [ ] Run tests in parallel (when safe)
- [ ] Use API for setup over UI when possible
- [ ] Configure retries for CI
