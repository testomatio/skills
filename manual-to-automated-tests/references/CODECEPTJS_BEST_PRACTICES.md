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
├── tests/                         # Test specifications
│   ├── auth/
│   │   └── login.test.js
│   ├── products/
│   │   └── product.test.js
│   └── ...
│
├── pages/                         # Page Objects (locators & basic actions)
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   └── index.js
│
├── steps/                         # Custom step definitions (Actor methods)
│   ├── steps_file.js              # Default generated steps
│   ├── auth.steps.js              # Authentication steps
│   ├── product.steps.js           # Product-related steps
│   └── index.js
│
├── helpers/                       # Custom helpers
│   ├── ApiHelper.js               # REST API helper
│   ├── DatabaseHelper.js          # Database operations
│   └── index.js
│
├── data/                          # Test data files
│   ├── users.js
│   ├── products.js
│   └── index.js
│
├── plugins/                       # Custom plugins
│   └── customPlugin.js
│
├── output/                        # Test reports & screenshots
└── log/                           # CodeceptJS logs
```

---

## Page Objects

**Rule**: Pages are dumb containers - only locators and simple actions. Never put complex logic in Pages.

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
I.click({ xpath: '//button[contains(@class, "primary")]' })

// With test IDs (using custom locator)
I.click({ testId: 'submit-form-btn' })

// Avoid - CSS class only when necessary
I.click('.btn-primary.submit-form')
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
