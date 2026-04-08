# Playwright Best Practices

- This guide provides high-level Playwright-specific guidance.
- It does not replace general testing or POM best practices.
- It helps the agent align with Playwright capabilities and conventions.
- Prefer adapting to the existing project over enforcing new patterns.


## Architecture & Project Structure Overview

- Do not assume a fixed architecture (e.g., Pages, Modules, Fixtures).
- Detect and follow the existing project structure.
- Common patterns may include:
  - **Pages**: Dumb locator containers with simple element interactions only
  - **Modules**: Own all business logic, orchestrate multiple Page actions into domain workflows
  - **Fixtures**: Dependency injection - tests never instantiate Pages or Modules directly
  - **Test.step()**: Use for reporting, trace analysis, and debugging

**Choose the simplest approach that matches the project:**
- IF project uses Page Objects => USE them.
- ELSE => INTERACT directly in tests.

---

## Locator Strategy (Playwright Capabilities)

- Prefer user-facing and semantic locators.
- Use built-in Playwright locator strategies when possible.

**Priority (general guidance):**
1. Role-based selectors (buttons, links, alerts).
2. Labels (form inputs).
3. Visible text.
4. Test-specific attributes (data-testid).
5. CSS/XPath (last resort).

**Prefer stability over brevity.**
**Avoid selectors tied to layout or styling.**

Examples:
```typescript
// Preferred (semantic)
await page.getByRole('button', { name: 'Submit' }).click()
await page.getByLabel('Email').fill('user@test.com')

// Fallback (only if necessary)
await page.locator('.btn-primary.submit-form').click()
```

### Test IDs

**Purpose:** Use `data-testid` only when semantic locators are insufficient.

Use cases:
- Dynamic UI elements.
- Non-accessible components.
- Repeated structures (lists, tables).
- Table pattern (recommended):
  - Assign unique identifiers per row: `data-testid = "row_<id>"`.

### Soft Assertions

**Purpose:** Validate multiple checks in a single test without stopping at the first failure.
**When to use:** Non-critical verifications, data table rows, optional UI elements, or reporting multiple UI issues in one test.
**When not to use:** Core workflow steps where failure must block the test.

```typescript
// utils/soft-assert.ts
import { test as base } from '@playwright/test'

const softExpect = base.expect.configure({ soft: true })

export { softExpect }

// Usage in tests:
await softExpect(page.getByTestId('name')).toHaveText('John')
await softExpect(page.getByTestId('email')).toHaveText('john@test.com')
```

---

## Fixtures

- Playwright provides built-in fixtures (e.g., page, context, request).
- These are optional and project-dependent.
- Do not assume custom fixtures exist.

**Guidelines:**
- Use fixtures only if already present in the project.
- Do not introduce complex dependency injection unless required.

---

## TypeScript Path Aliases

Use path aliases to be clear in import lines.

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["src/pages/*"],
      "@utils/*": ["utils/*"],
      ...
    }
  }
}
```

---

## API Testing

### ApiHelper Utility

Use Api helper to separate reusable behavior.

```typescript
// utils/ApiHelper.ts
import { APIRequestContext } from '@playwright/test'

export class ApiHelper {
  constructor() {...}

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    ...
  }
...
}
```

### API + UI Testing Pattern

- Playwright supports both API and UI interactions.
- Prefer API for:
  - Test setup.
  - Test teardown.
  - Data preparation.

- Use UI for:
  - Behavior validation.
  - User-facing flows.

**Example (abstract):**
- SETUP data via API.
- VERIFY behavior via UI.

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

## Debugging & Reporting

- Use built-in Playwright debugging tools or Playwright MCP when needed:
  - Traces.
  - Screenshots.
  - Logs.
- Add additional steps or logs only if they improve clarity.
- Avoid excessive logging or noise in tests.

---

## Anti-Patterns (Avoid)

1. **Never hardcode test data** - use DataGenerator or JSON test data files.
2. **Never share state between tests** - each test is isolated.
3. **Never ignore flaky tests** - fix immediately with proper waits.
4. **Never use arbitrary `sleep()`** - use explicit waits instead.
5. **Never commit secrets or credentials** - use environment variables.
6. **Never write over-abstracting simple test flows**.

---

## Best Practices Checklist

- [ ] Use `test.step()` for reporting and trace analysis
- [ ] Tag all tests with `@P0`/`@P1`/`@P2` for priority
- [ ] Use API for setup/teardown over UI when possible
- [ ] Keep tests independent - each test sets up its own state
- [ ] Use test data instead of hardcode
- [ ] Run tests in parallel (when safe)
- [ ] Implement soft assertions for non-critical checks