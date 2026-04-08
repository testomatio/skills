# CodeceptJS Best Practices - Complete Guide

This guide consolidates foundational and advanced CodeceptJS practices for scalable, maintainable E2E frameworks using Playwright, WebDriver, or other helpers.

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

Think of a test project as layers of responsibility, not folders. Each layer has a clear role:
- **Pages / UI Surfaces** - Encapsulate locators and simple UI actions. No business logic. Each page represents a UI surface (form, panel, modal, etc.).
- **Steps / Actor Methods** - High-level workflows, multi-step interactions, and conditional logic. Combine multiple Page actions or API calls. Own the business behavior.
- **Helpers / Utilities** - Technical operations such as API calls, DB access, file operations, custom locators, or low-level automation.
- **Test Data / Constants** - Shared configuration, constants, enums, mock data, fixtures. Avoid hardcoding in tests.
- **Plugins / Extensions** - Optional enhancements: auto-login, soft assertions, reporting, or debugging utilities.
- **Tests / Specs** - Independent, readable feature- or scenario-focused tests. Use Pages, Steps, Helpers, and Test Data.

### Core Principles

**Layer separation** - Each layer has one responsibility. Avoid mixing locators, business logic, and assertions in the same place.
**Reusability** - Pages, Steps, and Helpers should be reusable across tests and features.
**Independence** - Tests should rely on the layers, not on each other. Each test sets up its own state.
**Abstraction first** - Tests describe what is being tested; Steps describe how to perform the workflow; Pages describe how to interact with UI elements.

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

**Rules**:
- Only locators + simple actions.
- No business logic.
- Organize by surface/context (form, panel, page).

**Example:**

```javascript
// pages/LoginPage.js
module.exports = {
  fields: { email: { css: '[name="email"]' }, password: { css: '[name="password"]' } },
  buttons: { submit: { xpath: '//button[@type="submit"]' } },
  
  async fillEmail(email) { await I.fillField(this.fields.email, email) },
  async fillPassword(password) { await I.fillField(this.fields.password, password) },
  async submit() { await I.click(this.buttons.submit); I.waitForNavigation() },
}
```

### Register New Page Objects

After creating a new page object file, add it to:
1. `codecept.conf.ts` - `include` section
2. `steps.d.ts` - type declarations

### Locator Strategy

**Priority:**
- Semantic text / element roles (`I.seeElement()`, `{ name: 'field' }`).
- CSS ID selectors.
- XPath (for complex queries).
- `data-testid` (when semantic locators aren’t possible).
- Custom locators (last resort).

Exampels:
```javascript
// Good locators
I.click('Submit')
I.fillField('Email', 'user@test.com')
I.click({ testId: 'submit-form-btn' })
I.click('.btn-primary.submit-form') // only if necessary
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

**Rules**: 
- Multi-step logic belongs in Actor methods.
- Use for login, conditional flows, API+UI flows, or explicit waits.

```javascript
// steps/auth.steps.js
module.exports = function() {
  return actor({
    async loginAs(email, password) {
      I.amOnPage('/login')
      I.fillField('Email', email)
      I.fillField('Password', password)
      I.click('Sign In')
      I.waitForUrl('**/dashboard')
    },

    async ensureLoggedIn(user) {
      const loggedIn = await I.grabNumberOfVisibleElements('.logout-button') > 0
      if (!loggedIn) await this.loginAs(user.email, user.password)
    }
  })
}
```

---

## API Testing

- Prefer API for setup/teardown/data prep.
- Use UI for behavior verification.

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
    ...
  })
}
```

### API + UI Testing Pattern

Example: API+UI combined step

```js
const response = await I.sendPostRequest('/api/users', newUser)
I.assertEqual(response.status, 201)
I.loginAs(newUser.email, newUser.password)
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

- Use `--debug` / `--verbose`.
- Save screenshots: `I.saveScreenshot('name.png')`.
- Playwright traces can be enabled in helper config.
- Custom helpers: `DebugHelper` for logs, screenshots, pause.

---

## Anti-Patterns (Avoid)

1. **Never put business logic in test files** - Use custom steps for reusable flows
2. **Never hardcode test data** - Use data files or environment variables
3. **Never share state between tests** - Each test should set up its own state
4. **Never commit secrets or credentials** - Use environment variables
5. **Never ignore flaky tests** - Fix immediately with proper waits
6. **Prefer semantic locators over CSS-only** - Prioritize `{ name: 'button' }` over `.btn-primary`
7. **Never skip test cleanup** - Use After hooks to clean up state

### Code Smells from Legacy Code (Do Not Repeat)

* Hardcoded waits (like `I.wait(n)`).
* Inline cleanup inside test scenarios (`// cleanup`).
* Direct use of locators in test files instead of page objects.
* Hardcoded IDs and config values in tests.

