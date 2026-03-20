# CodeceptJS Best Practices

## Project Structure

```
pages/                # Page Objects (Gherkin steps)
data/                 # Test data files
helpers/               # Custom helpers
steps/                # Custom step definitions
tests/
  └── *.test.js        # Test files
```

## Configuration

### codecept.conf.js
```javascript
const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure')

exports.config = {
  tests: './tests/**/*.test.js',
  output: './output',
  helpers: {
    Playwright: {
      url: 'http://localhost:3000',
      show: false,
      browser: 'chromium'
    },
    Testomato: {
      enabled: true
    }
  },
  plugins: {
    testomatio: {
      enabled: true,
      updateRun: process.env.TESTOMATIO_UPDATE_RUN || false
    },
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  },
  include: {
    I: './steps_file.js',
    LoginPage: './pages/Login.js'
  }
}

setHeadlessWhen(process.env.HEADLESS)
setCommonPlugins()
```

## Basic Test Structure

```javascript
// tests/login.test.js
Feature('Login')

Scenario('should login with valid credentials', async ({ I, loginPage }) => {
  I.amOnPage('/login')
  loginPage.fillCredentials('user@test.com', 'password123')
  loginPage.submit()
  
  I.see('Dashboard')
  I.seeInCurrentUrl('/dashboard')
})

Scenario('should show error with invalid credentials', async ({ I }) => {
  I.amOnPage('/login')
  I.fillField('Email', 'invalid@test.com')
  I.fillField('Password', 'wrongpass')
  I.click('Login')
  
  I.see('Invalid credentials')
  I.dontSeeInCurrentUrl('/dashboard')
})
```

## Page Objects

```javascript
// pages/Login.js
const { I, $ } = inject()

module.exports = {
  fields: {
    email: '#email',
    password: '#password'
  },
  submitButton: 'button[type="submit"]',
  
  fillCredentials(email, password) {
    I.fillField(this.fields.email, email)
    I.fillField(this.fields.password, password)
  },
  
  submit() {
    I.click(this.submitButton)
    I.waitForNavigation()
  },
  
  loginAs(email, password) {
    this.fillCredentials(email, password)
    this.submit()
  }
}
```

## Custom Steps

```javascript
// steps_file.js
const steps = require('.'

module.exports = function() {
  return actor({
    defineMetadata() {
      // Custom step
    },
    
    loginAs(email, password) {
      this.amOnPage('/login')
      this.fillField('Email', email)
      this.fillField('Password', password)
      this.click('Login')
      this.waitForUrl('**/dashboard')
    },
    
    uploadFile(selector, filePath) {
      I.attachFile(selector, filePath)
    }
  })
}
```

## Locators

### Priority Order
1. `#id` - CSS ID
2. `locator` - test_id data attribute
3. `role:name` - ARIA role + name
4. CSS/XPath - Last resort

```javascript
// Built-in locators
I.seeElement('#submit-btn')
I.click('Submit')
I.fillField('Email', 'test@test.com')
I.grabTextFrom('.title')

// With options
I.click('Save', { locator: '[data-testid="save-btn"]' })
I.waitForElement('.loading', { timeout: 10 })
```

## Hooks

```javascript
Scenario('@smoke user login', async ({ I }) => {
  // Test execution
}).timeout(10000).retry(2)

// Global hooks
Before(async ({ I }) => {
  await I.cleanUp()
})

After(async ({ I }) => {
  await I.logout()
})
```

## Data-Driven Tests

```javascript
// data/users.js
module.exports = {
  valid: [
    { email: 'user1@test.com', role: 'admin' },
    { email: 'user2@test.com', role: 'user' }
  ],
  invalid: [
    { email: 'invalid', error: 'Invalid email format' }
  ]
}

// tests/parametrized.test.js
const users = require('../data/users')

Feature('Parameterized Tests')

users.valid.forEach(user => {
  Scenario(`login as ${user.role}`, async ({ I }) => {
    I.loginAs(user.email, 'password123')
    I.see(`Welcome, ${user.email}`)
  })
})
```

### Custom Helper for Testomatio

```javascript
// helpers/TestomatioHelper.js
const Helper = require('@codeceptjs/base/helper')

class TestomatioHelper extends Helper {
  async setTestomatioRunId(runId) {
    this.testomatioRunId = runId
  }
}

module.exports = TestomatioHelper
```

## Assertions

```javascript
// Built-in
I.see('Text')
I.seeElement('#selector')
I.seeInCurrentUrl('/path')
I.seeInTitle('Title')
I.seeInField('#input', 'value')
I.seeCheckboxChecked('#checkbox')

// Negative
I.dontSee('Error')
I.dontSeeElement('#error')

// Grab for custom assertions
const count = await I.grabTextFrom('.items')
const value = await I.grabValueFrom('#input')
```

## Common Patterns

### Modal Handling
```javascript
async function acceptModal() {
  I.click('Confirm')
  I.waitForInvisible('.modal')
}

async function dismissModal() {
  I.click('Cancel')
  I.waitForInvisible('.modal')
}
```

### Wait Patterns
```javascript
I.waitForElement('.content', 10)
I.waitForVisible('.spinner', 5)
I.waitForText('Loaded', 10)
I.waitForUrl('**/success')
I.waitForNavigation()
```

### API Requests
```javascript
// Using REST helper
I.sendPostRequest('/api/login', { email, password })

// Or axios helper
const axios = require('axios')
const response = await axios.post('/api/users', { name: 'Test' })
```

## Debugging

```bash
# Interactive mode
npx codeceptjs run --debug

# Verbose output
npx codeceptjs run --verbose

# Single test
npx codeceptjs run tests/login.test.js --debug
```

## Summary Checklist

- [ ] Use Page Objects for UI interactions
- [ ] Keep step definitions simple
- [ ] Use semantic locators
- [ ] Configure proper timeouts
- [ ] Use data files for test data
- [ ] Enable screenshot on failure
- [ ] Use retries for flaky tests
- [ ] Configure Testomatio integration
