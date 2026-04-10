# CodeceptJS Best Practices

- This document provides high-level CodeceptJS-specific recommendations.
- It does not replace general testing or POM best practices.
- It helps the agent align with CodeceptJS capabilities and conventions.
- Prefer adapting to the existing project over enforcing new patterns.


## Architecture Overview

**Core Principles:**
- **Pages**: Dumb locator containers with simple element interactions only
- **Actors (I)**: Own all business logic, orchestrate multiple Page actions into domain workflows
- **Helpers**: Low-level browser automation wrappers (Playwright, WebDriver, Puppeteer)
- **Custom Steps**: Reusable high-level business actions attached to the Actor

**Layer separation** - Each layer has one responsibility. Avoid mixing locators, business logic, and assertions in the same place.

---

## Project Structure

Think of a test project as layers of responsibility, not folders:
- **Pages / UI Surfaces** - Encapsulate locators and simple UI actions. No business logic.
- **Steps / Actor Methods** - High-level workflows, multi-step interactions, and conditional logic.
- **Helpers / Utilities** - Technical operations: API calls, DB access, file operations, custom locators.
- **Test Data / Constants** - Shared configuration, constants, enums, mock data, fixtures.
- **Plugins / Extensions** - Optional enhancements: auto-login, soft assertions, reporting.
- **Tests / Specs** - Independent, readable feature- or scenario-focused tests.

**Choose the simplest approach that matches the project:**
- IF project uses Page Objects => USE them.
- ELSE => INTERACT directly in tests.

### Register New Page Objects

After creating a new page object file, add it to:
1. `codecept.conf.ts` - `include` section
2. `steps.d.ts` - type declarations

---

## Naming Rules

No abbreviations — always write full words:

| Wrong | Correct |
|-------|---------|
| `Nav` | `Navigation` |
| `Btn` | `Button` |
| `Pg`  | `Page` |

Locator names must include the **element type** as a suffix:

| Wrong (no type) | Correct (with type) |
|-----------------|---------------------|
| `compareOverview` | `compareOverviewSection` |
| `finishRun` | `finishRunButton` |
| `runGroupTitle` | `runGroupTitleHeader` |

---

## Locator Strategy

**Priority:**
1. Semantic text / element roles (`I.seeElement()`, `{ name: 'field' }`).
2. CSS ID selectors.
3. `data-testid` (when semantic locators aren't possible).
4. Custom locators (last resort).

**Examples:**
```javascript
// Good locators
I.click('Submit')
I.fillField('Email', 'user@test.com')
I.click({ testId: 'submit-form-btn' })
I.click('.btn-primary.submit-form') // only if necessary
```

#### Reusing Locators

Before creating a new locator, always search in:
- `src/pages/`, `pages/`, `components/`
- If a locator for the same element already exists — reuse it

**Avoid duplicates:** (e.g. `reportButton` vs `combinedReportButton`) - they create confusion and maintenance issues.

#### Tab Active State Verification

After clicking a tab, always verify it is active. Different implementations use different indicators:

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

---

## Custom Steps (Actor Methods)

**Rules:** 
- Multi-step logic belongs in Actor methods.
- Use for login, conditional flows, API+UI flows, or explicit waits.

```javascript
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

## Test Structure

## Fixtures & Hooks

- Use `Before` hook for setup and authentication.
- Use `After` hook for cleanup (API cleanup only, no UI).
- Reuse existing fixtures when present in the project.

**Pattern:**
```typescript
Before(async ({ app }) => {
  const login = await app.login(token);
  app.setToken(`Bearer ${login.data.jwt}`);
  loginAs("mainUser");
});

After(async ({ app }) => {
  await app.cleanup();
});
```

### Test Data Usage

Prefer using shared constants, enums, or test data instead of hardcoded values:

```typescript
import { timeouts } from "../testData/timeout";

I.waitForElement(locator, timeouts.THREE); // 3s
```

### API in Preconditions, UI for Test Steps

- **Before hook**: use API to create test data (users, projects, runs, etc.)
- **Scenario body**: use UI interactions — that is what the test is verifying
- Exception: simple navigation to a starting URL in Before is acceptable

**Key formatting rules:**
- One blank line between every action in Scenario body
- No step comments inside Scenario body — method names must be self-documenting
- No magic strings in test body — extract to `const` at top of file
- No long `projectData.x.y.z.w` chains in test body — extract to named `const`

---

## Test Tags & Filtering

- Test tagging and filtering are project-specific.
- If the project already uses tags (e.g., @Smoke, @Regression, @P0), follow existing conventions.
- Do not introduce new tagging systems unless explicitly required.

---

## Debugging & Reporting

- Use `--debug` / `--verbose`.
- Save screenshots: `I.saveScreenshot('name.png')`.
- Playwright traces can be enabled in helper config.
- Custom helpers: `DebugHelper` for logs, screenshots, pause.

---

## Anti-Patterns (Avoid)

1. **Never hardcode test data** - Use data files or environment variables
2. **Never share state between tests** - Each test should set up its own state
3. **Never commit secrets or credentials** - Use environment variables
4. **Never ignore flaky tests** - Fix immediately with proper waits
5. **Prefer semantic locators over CSS-only** - Prioritize `{ name: 'button' }` over `.btn-primary`
6. **Never skip test cleanup** - Use After hooks to clean up state

### Code Smells from Legacy Code (Do Not Repeat)

- Hardcoded waits (like `I.wait(n)`).
- Inline cleanup inside test scenarios (`// cleanup`).
- Direct use of locators in test files instead of page objects.
- Hardcoded IDs and config values in tests.

---

## Best Practices Checklist

- [ ] Keep tests independent - each test sets up its own state
- [ ] Use test data constants instead of hardcoded values
- [ ] Follow naming rules (full words, element type suffix)
- [ ] Reuse existing locators before creating new ones
- [ ] Add assertions based on expected results from manual steps