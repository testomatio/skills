# Playwright Best Practices

- This document provides high-level Playwright-specific recommendations.
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
5. CSS selectors.

**Note:** Prefer consistency within the project:
- If the project relies on semantic locators => follow that pattern.
- If it uses test IDs => prefer `data-testid` as the primary selector.

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

---

## Fixtures

- Playwright provides built-in fixtures (e.g., `page`, `context`, `request`).
- Projects may define custom fixtures for setup, authentication, or shared state:
  - Reuse existing fixtures when they are present in the project.
  - If no fixture structure exists, simple tests can interact directly without introducing abstraction.
  - Introduce new fixtures only when they clearly improve reuse, readability, or test setup consistency.

---

## API Testing

Playwright supports both API and UI interactions via `request`.

**Best practices:**
- Prefer API for:
  - Test setup.
  - Test teardown.
  - Data preparation.

- Use UI for:
  - Behavior validation.
  - End-user flows.

**Pattern:**
- SETUP via API.
- VERIFY via UI.

---

## Test Tags & Filtering

- Test tagging and filtering are project-specific.
- If the project already uses tags (e.g., @Smoke, @Regression, @P0), follow existing conventions.
- Do not introduce new tagging systems unless explicitly required.

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

1. **Avoid embedding test data directly in test logic** - Prefer centralized test data (JSON, factories, or generators) for reuse and maintainability.
2. **Never share state between tests** - each test is isolated.
3. **Never ignore flaky tests** - fix immediately with proper waits.
4. **Never use arbitrary `sleep()`** - use explicit waits instead.
5. **Never commit secrets or credentials** - use environment variables.
6. **Never write over-abstracting simple test flows**.

---

## Best Practices Checklist

- [ ] Use `test.step()` for reporting and trace analysis
- [ ] Use API for setup/teardown over UI when possible
- [ ] Keep tests independent - each test sets up its own state
- [ ] Use test data instead of hardcode
- [ ] Run tests in parallel (when safe)
- [ ] Implement soft assertions for non-critical checks