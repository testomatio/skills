# CodeceptJS Best Practices - Complete Guide

This document combines fundamental and advanced CodeceptJS test automation practices for building scalable, maintainable E2E frameworks with Playwright, WebDriver, or other helpers.

---

## Architecture Overview

**Core Principles:**
- **Pages**: Dumb locator containers with simple element interactions only
- **Actors (I)**: Own all business logic, orchestrate multiple Page actions into domain workflows
- **Helpers**: Low-level browser automation wrappers (Playwright, WebDriver, Puppeteer)
- **Custom Steps**: Reusable high-level business actions attached to the Actor
- **Test Tags**: Use `@tag` annotations for filtering and prioritization

---

## Project Structure

```
project-root/
├── codecept.conf.js              # CodeceptJS configuration
├── jsconfig.json                  # JavaScript config (optional)
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── package.json                   # Scripts and dependencies
│
├── tests/                    # Test specifications (grouped by feature or scope)
│   ├── beta/                 # Main/regression suite
│   |    ├── auth/
│   |    ├── products/
│   ├── prod/                 # Smoke/production checks
│   └── ...
│
├── src/ (optional but preferred for larger projects)
│   ├── pages/                # Page Objects (locators + simple actions only)
│   ├── steps/                # Custom steps (business flows)
│   ├── helpers/              # API clients, DB helpers, utilities
│   ├── testData/             # Test data, constants, enums
│   └── plugins/              # Custom plugins
│
├── plugins/                       # Custom plugins
│   └── customPlugin.js
│
├── output/                        # Test reports & screenshots
└── log/                           # CodeceptJS logs
```

### Alternative (Flat) Structure

For smaller or legacy projects, folders may exist at root level:

```
pages/
steps/
helpers/
data/ (or testData/)
plugins/
```

✔️ This is acceptable, but grouping under src/ is preferred for scalability and separation of concerns.

---

## Naming rules

No abbreviations — always write full words:

| Wrong | Correct |
|-------|---------|
| `Nav` | `Navigation` |
| `Btn` | `Button` |
| `Pg`  | `Page` |

Locator names must include the **element type** as a suffix — the name should answer both "what is it?" and "what kind of thing?":

| Wrong (no type) | Correct (with type) |
|-----------------|---------------------|
| `compareOverview` | `compareOverviewSection` |
| `finishRun` | `finishRunButton` |

---

## Page Objects

**Rule**: Pages are dumb containers - only locators and simple actions. Never put complex logic in Pages or mix surfaces in one file.

Example-1:

```
settingsLabels.page.ts      — labels list/index page
settingsLabelForm.page.ts   — create/edit label form
setLabelsPanel.page.ts      — "Set Labels" panel on tests page
```

Example-2:


```javascript
// pages/LoginPage.js

module.exports = {
  // Locators using semantic approach
  fields: {
    email: { css: '[name="email"]' },
    password: { css: '[name="password"]' },
  },
  buttons: {
    submit: { xpath: '//button[@type="submit"]' },
    forgotPassword: { xpath: '//a[contains(text(), "Forgot")]' },
  },
  containers: {
    errorMessage: { css: '.alert-error' },
    form: { css: 'form.login-form' },
  },

  // Simple actions only - no business logic
  async fillEmail(email) {
    await I.fillField(this.fields.email, email)
  },

  async fillPassword(password) {
    await I.fillField(this.fields.password, password)
  },

  async submit() {
    await I.click(this.buttons.submit)
    I.waitForNavigation()
  },

  async getErrorMessage() {
    return await I.grabTextFrom(this.containers.errorMessage)
  },

  async isErrorVisible() {
    return await I.grabNumberOfVisibleElements(this.containers.errorMessage) > 0
  },

  async isFormVisible() {
    return await I.seeElement(this.containers.form)
  },
}
```

### Register New Page Objects

After creating a new page object file, add it to:
1. `codecept.conf.ts` - `include` section
2. `steps.d.ts` - type declarations

### Locator Strategy

**Priority Order (use top to bottom):**

| Priority | Locator | When to Use |
|----------|---------|-------------|
| 1 | `{ name: 'fieldName' }` or `I.seeElement()` with semantic text | Semantic elements |
| 2 | `{ css: '#id' }` | CSS ID selectors |
| 3 | `{ xpath: '//button' }` | XPath for complex queries |
| 4 | `{ testId: 'submit-btn' }` | `data-testid` attributes |
| 5 | Custom locators | Last resort only |

```javascript
// Good locators
I.click('Submit')
I.fillField('Email', 'user@test.com')
I.seeElement({ name: 'submit-button' })

// With test IDs (using custom locator)
I.click({ testId: 'submit-form-btn' })

// Avoid - CSS class only when necessary
I.click('.btn-primary.submit-form')
```

#### Reusing Locators

Before creating a new locator, always search in:
- `src/pages/`
- `pages/`
- `components/`
- etc.
(If a locator for the same element already exists — reuse it)

**Avoid duplicates:** (e.g. `reportButton` vs `combinedReportButton`) - They create confusion, inconsistency, and maintenance issues.

#### Locator Best Practices

**Be specific:**
- ❌ Never use locate("*") (too broad, generates `//*[...]`).
  - ✅ Always specify a tag: locate("div"), locate("button"), etc.

**Avoid positional selectors:**
- ❌ Never use `.at(n)` unless absolutely necessary. These break when the DOM changes.
  - ✅ Prefer: `id`, `aria-*`, `data-*`, `withText()`, `inside()`.

**Use correct assertions:**
- ❌ Avoid `I.see()`
  - ✅ Use I.seeElement()

#### XPath & Locator Behavior Notes

`inside()`:
- Uses `ancestor::` (matches any ancestor in the tree).
- Can lead to false positives
  - ✅ Always narrow with a specific parent (class, role, etc.)

`withChild()`:
- Uses `child::` (direct children only)
`- ✅ Use when validating parent → child relationships

`withText()`:
- Uses substring matching (`contains()`)
- ⚠️ Can match unintended elements
  - ✅ Ensure test data text is unique

### Tab Active State Verification

After clicking a tab, always verify it is active. Different implementations use different indicators - try to inspect the DOM before writing locators
Common patterns:
- `aria-selected="true"`
- `.active` class

The method belongs in the page object of the surface that owns the tabs:

```typescript
private generateActiveTabLocator(tabName: string) {
  return locate('[role="tab"][aria-selected="true"]').withText(tabName);
}

checkThatTabIsActive(tabName: string) {
  const activeTab = this.generateActiveTabLocator(tabName);
  I.waitForElement(activeTab, timeouts.THREE);
  I.seeElement(activeTab);
}
```

In the test, call it immediately after each tab click:

```typescript
requirementsPage.clickOnSourceTab();
requirementsPage.checkThatTabIsActive("Source");
```

---

## Custom Steps (Actor Methods)

**Rule**: All conditional logic and multi-step flows belong in custom steps attached to the Actor.

```javascript
// steps/auth.steps.js
const { I } = inject()

module.exports = function () {
  return actor({
    // Simple step
    async loginAs(email, password) {
      I.amOnPage('/login')
      I.fillField('Email', email)
      I.fillField('Password', password)
      I.click('Sign In')
      I.waitForUrl('**/dashboard')
    },

    // Step with return value
    async getCurrentUserEmail() {
      return await I.grabTextFrom('.user-email')
    },

    // Step with conditional logic
    async ensureLoggedIn(user = { email: 'admin@test.com', password: 'password123' }) {
      const isLoggedIn = await I.grabNumberOfVisibleElements('.logout-button') > 0
      if (!isLoggedIn) {
        this.loginAs(user.email, user.password)
      }
    },

    // Step with explicit waits
    async waitForDashboard() {
      I.waitForElement('.dashboard-container', 10)
      I.waitForText('Welcome', 5)
    },

    // API + UI combined step
    async createAndLoginUser(userData) {
      const response = await I.sendPostRequest('/api/users', userData)
      I.assertEqual(response.status, 201)
      this.loginAs(userData.email, userData.password)
    },
  })
}
```

---

## API Testing

### REST Helper Integration

```javascript
// steps/api.steps.js

module.exports = function () {
  return actor({
    async apiGet(endpoint, headers = {}) {
      return await I.sendGetRequest(endpoint, headers)
    },

    async apiPost(endpoint, data, headers = {}) {
      return await I.sendPostRequest(endpoint, data, headers)
    },

    async apiPut(endpoint, data, headers = {}) {
      return await I.sendPutRequest(endpoint, data, headers)
    },
    //...
    async apiCreateUser(userData) {
      const response = await this.apiPost('/api/users', userData)
      I.assertEqual(response.status, 201)
      return response.data
    },
  })
}
```

### API + UI Testing Pattern

```javascript
// tests/user-management.test.js
const users = require('../data/users')

Feature('User Management')

Scenario('@smoke @P1 should create user via API and verify in UI', async ({ I }) => {
  // Step 1: Create user via API
  Given('I am authenticated as admin')
  I.amOnPage('/login')
  I.loginAs('admin@test.com', 'admin123')

  // Step 2: Create user via API
  When('I create a new user via API')
  const newUser = {
    email: `test${Date.now()}@test.com`,
    name: 'Test User',
    role: 'user',
  }
  const response = await I.sendPostRequest('/api/users', newUser)
  I.assertEqual(response.status, 201)

  // Step 3: Navigate to users list
  And('I navigate to user management page')
  I.amOnPage('/admin/users')

  // Step 4: Verify user in UI
  Then('I should see the new user in the list')
  I.see(newUser.name)
  I.see(newUser.email)
})

Scenario('@P2 should update user profile via API', async ({ I }) => {
  I.amOnPage('/login')
  I.loginAs('user@test.com', 'password123')
  I.amOnPage('/profile')

  const updateData = { name: 'Updated Name' }
  await I.sendPutRequest('/api/users/1', updateData)

  I.click('Refresh Profile')
  I.see('Updated Name')
})
```

---

## Test Tags & Filtering

| Tag | Purpose | Command |
|-----|---------|---------|
| `@P0` | Critical - must pass | `npx codeceptjs run --grep "@P0"` |
| `@P1` | High priority | `npx codeceptjs run --grep "@P1"` |
| `@P2` | Medium priority | `npx codeceptjs run --grep "@P2"` |
| `@Smoke` | Smoke test suite | `npx codeceptjs run --grep "@Smoke"` |
| `@Regression` | Full regression | `npx codeceptjs run --grep "@Regression"` |
| `@Slow` | Slow tests | `npx codeceptjs run --grep -v "@Slow"` |
| `@API` | API-only tests | `npx codeceptjs run --grep "@API"` |
| `@UI` | UI-only tests | `npx codeceptjs run --grep "@UI"` |

---

## Test Structure

### Gherkin-Style with Comments

```javascript
// tests/login.test.js

Feature('Authentication')

Scenario('@P1 @smoke successful login with valid credentials', async ({ I }) => {
  // Given
  Given('I am on the login page')
  I.amOnPage('/login')
  I.seeElement('form.login-form')

  // When
  When('I enter valid credentials')
  I.fillField('Email', 'user@test.com')
  I.fillField('Password', 'password123')

  And('I click the submit button')
  I.click('Sign In')

  // Then
  Then('I should be redirected to the dashboard')
  I.waitForUrl('**/dashboard')
  I.see('Welcome back')

  And('I should see my email in the header')
  I.see('user@test.com', '.user-email')
})

Scenario('@P1 login with invalid credentials shows error', async ({ I }) => {
  Given('I am on the login page')
  I.amOnPage('/login')

  When('I enter invalid credentials')
  I.fillField('Email', 'invalid@test.com')
  I.fillField('Password', 'wrongpass')
  I.click('Sign In')

  Then('I should see an error message')
  I.see('Invalid credentials')
  I.dontSeeInCurrentUrl('/dashboard')
})
```

### Data-Driven Tests

```javascript
// data/users.js
module.exports = {
  valid: [
    { email: 'admin@test.com', role: 'admin', password: 'admin123' },
    { email: 'user@test.com', role: 'user', password: 'password123' },
    { email: 'guest@test.com', role: 'guest', password: 'guest123' },
  ],
  invalid: [
    { email: 'invalid', password: 'short', expectedError: 'Invalid email format' },
    { email: 'notexist@test.com', password: 'wrongpass', expectedError: 'Invalid credentials' },
  ],
}

// tests/login-data-driven.test.js
const { valid, invalid } = require('../data/users')

Feature('Login Data-Driven')

valid.forEach((user) => {
  Scenario(`@P1 login as ${user.role}`, async ({ I }) => {
    I.amOnPage('/login')
    I.loginAs(user.email, user.password)
    I.waitForUrl('**/dashboard')
    I.see(`Welcome`)
  })
})

invalid.forEach((data) => {
  Scenario(`@P2 login validation: ${data.expectedError}`, async ({ I }) => {
    I.amOnPage('/login')
    I.fillField('Email', data.email)
    I.fillField('Password', data.password)
    I.click('Sign In')
    I.see(data.expectedError, '.alert-error')
  })
})
```

### Constants & Test Data Usage

Prefer using shared constants, enums, or test data instead of hardcoded values in tests.

Avoid hardcoding user data, timeouts, or configuration values when a reusable option exists. This improves readability, consistency, and maintainability.

Use values from dedicated test data or config files, for example:

```typescript
import { timeouts } from "../testData/timeout";

I.waitForElement(locator, timeouts.THREE); // 3s
```

### API in Preconditions, UI for Test Steps

- **Before hook**: use API (`createUserApi`) to create test data: user, project, payment, etc.
- **Scenario body**: use UI interactions — that is what the test is verifying
- Exception: simple navigation to a starting URL in Before is acceptable

```typescript
Before(async ({ createUserApi }) => {
  // Create data via API — fast and reliable
  const user = await createUserApi.createUser("Ted", "admin", 200);
});

Scenario("...", async ({ project }) => {
  // Interact via UI — this is what we're testing
  project.openListItems(projectId);
  project.clickOnAddButton();
});
```

### UI User Navigation

Prefer UI navigaton instead fo URL shortcuts.
If a step says "Navigate to Settings" — implement it with UI clicks, not `I.amOnPage(...)`.

```typescript
// WRONG
I.amOnPage(`/settings/`);

// CORRECT
settings.openNavigationPage();
```

Exception: `openNavigationPage()` and similar helper methods in page objects that exist specifically for direct navigation (e.g. as a test precondition) are fine.

### Key formatting rules

- One blank line between every action in Scenario body.
- No step comments inside Scenario body — method names must be self-documenting.
- No magic strings in test body — extract to `const` at top of file.
- No long `projectData.x.y.z.w` chains in test body — extract to named `const`.
- `Before`: API token setup + UI login + navigate to starting point.
- `After`: API cleanup only (no UI).

---

## Advanced Patterns

### Soft Assertions

```javascript
// helpers/SoftAssertHelper.js
const Helper = require('@codeceptjs/base/helper')
const { expect } = require('chai')

class SoftAssertHelper extends Helper {
  errors = []

  async softAssert(condition, message) {
    try {
      expect(condition).to.be.true
    } catch (e) {
      this.errors.push(message)
    }
  }

  async assertAll() {
    if (this.errors.length > 0) {
      throw new Error(`Soft assertion failures:\n${this.errors.join('\n')}`)
    }
  }

  reset() {
    this.errors = []
  }
}

module.exports = SoftAssertHelper
```

### Auto-Login Pattern

```javascript
// Using the autoLogin plugin (built into config)
Scenario('@P1 should display user dashboard', async ({ I, loginAs }) => {
  // loginAs is automatically available via autoLogin plugin
  I.amOnPage('/dashboard')
  I.see('Welcome')
})

// Manual auto-login helper
Scenario('@P1 admin can access settings', async ({ I }) => {
  // API-based login
  const response = await I.sendPostRequest('/api/auth/login', {
    email: 'admin@test.com',
    password: 'admin123',
  })
  const { token } = response.data
  I.setCookie({ name: 'auth_token', value: token })

  I.amOnPage('/admin/settings')
  I.see('Admin Settings')
})
```

---

## Parallel Execution

```javascript
// codecept.conf.js
exports.config = {
  // Simple parallel (run all tests in parallel)
  // parallel: {
  //   workers: 2,
  // },

  // Chunked execution for CI
  parallel: {
    chunks: 3,
    workers: 2,
  },

  // Test grouping
  // Run: npx codeceptjs run --profile parallel
  profiles: {
    smoke: {
      grep: '@Smoke',
    },
    regression: {
      grep: '@Regression',
    },
  },
}

// Command examples
npx codeceptjs run --profile smoke
npx codeceptjs run --profile regression
npx codeceptjs run --grep "@P0|@P1"
npx codeceptjs run --steps --verbose
```

---

## Debugging & Reporting

### Debug Commands

```bash
# Interactive UI mode
npx codeceptjs run --ui

# Debug mode with console
npx codeceptjs run --debug

# Verbose output
npx codeceptjs run --verbose

# Single test
npx codeceptjs run tests/login.test.js --debug

# Generate reports
npx codeceptjs run --reporter mochawesome

# Open last HTML report
npx codeceptjs open
```

### Custom Debug Helper

```javascript
// helpers/DebugHelper.js
const Helper = require('@codeceptjs/base/helper')

class DebugHelper extends Helper {
  async debugLog(message, data = null) {
    console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`)
    if (data) {
      console.log(JSON.stringify(data, null, 2))
    }
  }

  async takeNamedScreenshot(name) {
    const helper = this.helpers.Playwright
    await helper.saveScreenshot(`${name}-${Date.now()}.png`)
    console.log(`Screenshot saved: ${name}-${Date.now()}.png`)
  }

  async pauseExecution() {
    console.log('Pausing execution. Press Enter to continue...')
    await new Promise((resolve) => process.stdin.once('data', resolve))
  }
}

module.exports = DebugHelper
```

---

## Anti-Patterns (Avoid)

1. **Never use complex logic in Pages** - Pages are dumb locator containers only
2. **Never put business logic in test files** - Use custom steps for reusable flows
3. **Never hardcode test data** - Use data files or environment variables
4. **Never share state between tests** - Each test should set up its own state
5. **Never use arbitrary `sleep()`** - Use explicit waits instead
6. **Never test multiple things in one test** - Single responsibility principle
7. **Never commit secrets or credentials** - Use environment variables
8. **Never ignore flaky tests** - Fix immediately with proper waits
9. **Never use CSS-only locators when semantic ones are available** - Prioritize `{ name: 'button' }` over `.btn-primary`
10. **Never skip test cleanup** - Use After hooks to clean up state

### Code Smells from Legacy Code (Do Not Repeat)

* Hardcoded waits (like `I.wait(n)`).
* Inline cleanup inside test scenarios (`// cleanup`).
* Direct use of locators in test files instead of page objects.
* Hardcoded IDs and config values in tests.

---

## Best Practices Checklist

### Architecture
- [ ] Pages contain only locators and simple actions
- [ ] Custom steps own all business logic and conditional flows
- [ ] Use helpers for low-level operations
- [ ] Keep test files clean and focused on BDD-style steps

### Configuration
- [ ] Use environment variables for URLs and credentials
- [ ] Configure proper timeouts (waitForTimeout, timeout)
- [ ] Enable screenshot on failure
- [ ] Configure retryFailedStep for flaky tests
- [ ] Set up Testomatio integration

### Test Writing
- [ ] Use `@P0`/`@P1`/`@P2` tags for prioritization
- [ ] Use `@smoke` and `@regression` tags for test suites
- [ ] Follow Given/When/Then structure in comments
- [ ] Use data files for test data instead of hardcoding
- [ ] Keep tests independent - each test sets up its own state
- [ ] Use API for setup/teardown over UI when possible

### Locators
- [ ] Prefer semantic locators (`I.click('Submit')`, `{ name: 'field' }`)
- [ ] Use CSS IDs and XPath as last resort
- [ ] Add `data-testid` only when semantic locators aren't possible
- [ ] Group locators in structured objects

### Assertions
- [ ] Use built-in CodeceptJS assertions
- [ ] Implement soft assertions for non-critical checks
- [ ] Take screenshots on assertion failures

### Debugging
- [ ] Use `--debug` and `--verbose` flags for troubleshooting
- [ ] Use `I.saveScreenshot()` for debugging
- [ ] Enable trace recording in Playwright helper
- [ ] Use `I.executeScript()` to inspect page state
