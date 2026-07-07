# Playwright Best Practices

High-level Playwright-specific recommendations. They complement general testing and POM best practices.
Prefer adapting to the existing project over enforcing new patterns.

## Architecture & Project Structure

- Do not assume a fixed architecture (e.g., Pages, Modules, Fixtures).
- Detect and follow the existing project structure.
- Common patterns may include:
  - Pages: dumb locator containers with simple element interactions only.
  - Modules: own all business logic, orchestrate Page actions into domain workflows.
  - Fixtures: dependency injection — tests never instantiate Pages or Modules directly.
  - `test.step()`: use for reporting, trace analysis, and debugging.

Choose the simplest approach that matches the project:
- If project uses Page Objects => use them.
- Else => interact directly in tests.

## Locator Strategy

- Prefer user-facing and semantic locators.
- Use built-in Playwright locator strategies when possible.
- Prefer stability over brevity.
- Avoid selectors tied to layout or styling.

Priority:
1. Role-based selectors (buttons, links, alerts).
2. Labels (form inputs).
3. Visible text.
4. Test-specific attributes (data-testid).
5. CSS selectors.

Stay consistent within the project:
- If the project relies on semantic locators => follow that pattern.
- If it uses test IDs => prefer `data-testid` as the primary selector.

```typescript
// Preferred (semantic)
await page.getByRole('button', { name: 'Submit' }).click()
await page.getByLabel('Email').fill('user@test.com')

// Fallback (only if necessary)
await page.locator('.btn-primary.submit-form').click()
```

## Fixtures

- Playwright provides built-in fixtures (e.g., `page`, `context`, `request`).
- Reuse existing custom fixtures for setup, authentication, or shared state.
- If no fixture structure exists, simple tests can interact directly without introducing abstraction.
- Introduce new fixtures only when they clearly improve reuse, readability, or setup consistency.

## API Testing

Playwright supports both API and UI interactions via `request`.

- Prefer API for: test setup, teardown, data preparation.
- Use UI for: behavior validation, end-user flows.
- Pattern: setup via API, verify via UI.

## Test Tags & Filtering

- Tagging and filtering are project-specific.
- If the project already uses tags (e.g., @Smoke, @Regression, @P0), follow existing conventions.
- Do not introduce new tagging systems unless explicitly required.

## Debugging & Reporting

- Use built-in Playwright debugging tools or Playwright MCP when needed: traces, screenshots, logs.
- Add extra steps or logs only if they improve clarity.
- Avoid excessive logging or noise in tests.

## Anti-Patterns (Avoid)

- Never embed test data directly in test logic — prefer centralized test data (JSON, factories, or generators).
- Never share state between tests — each test is isolated.
- Never ignore flaky tests — fix immediately with proper waits.
- Never use arbitrary `sleep()` — use explicit waits instead.
- Never commit secrets or credentials — use environment variables.
- Never over-abstract simple test flows.

## Checklist

- [ ] Use `test.step()` for reporting and trace analysis
- [ ] Use API for setup/teardown over UI when possible
- [ ] Keep tests independent — each test sets up its own state
- [ ] Use test data instead of hardcode
- [ ] Run tests in parallel (when safe)
- [ ] Implement soft assertions for non-critical checks
