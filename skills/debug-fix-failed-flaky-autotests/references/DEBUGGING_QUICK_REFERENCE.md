# Debugging Quick Reference

Fix in priority order: locators → timing → assertions → flow.

---

## Locator Fixes

| Problem | Avoid | Prefer |
|---------|-------|--------|
| Deep nesting | `.parent .child .grandchild` | `[data-testid="target"]` |
| Index-based | `button:nth-child(2)` | `getByRole('button', { name: 'Submit' })` |
| Partial text | `button:contains("Save")` | `getByText('Save', { exact: true })` |
| Dynamic classes | `.btn-primary-123` | `[data-testid="save-btn"]` |

Element state issues:

- Not found => wait for element before action.
- Not visible => scroll into view.
- Not clickable => wait for enabled state; check overlays.
- Stale element => re-fetch element before action.
- Multiple matches => filter or use `.first()`.

---

## Timing Fixes

Use framework-native waits instead of hard sleeps.

- Avoid hard sleeps (`sleep(5000)`, `wait(2)`) => flaky.
- Avoid implicit short waits => unreliable.
- Works locally, fails in CI => CI is slower; increase timeouts and add explicit waits.

**Playwright:**
```typescript
await page.getByTestId('loader').waitFor({ state: 'hidden' });
await page.waitForURL('/dashboard/**');
await page.waitForResponse(r => r.status() === 200);
```

**CodeceptJS:**
```javascript
I.waitForNavigationVisible();
I.waitForResponse(response => response.status() === 200);
```

### Fix Race Conditions

Ensure assertions happen after dynamic content updates.
Use `expect` with Playwright's built-in waiting, or `locator.waitFor()` only if needed.

```typescript
// Click triggers dynamic update
await page.getByRole('button', { name: 'Submit' }).click();

// Wait for result text to appear (optional, only if dynamically loaded)
await expect(page.getByTestId('result')).toHaveText('Success'); // automatically waits
```

---

## Assertion Fixes

- Exact match too strict => use `toContain()` or regex.
- Wrong expected value => verify against test spec.
- Timing issues => wait before assertion.
- Multiple elements => use `.first()` or `.nth(0)`.

Examples:

```typescript
// Before: exact match fails on whitespace
expect(await page.locator('.title').textContent()).toBe('Hello World');

// After: contains check
await expect(page.locator('.title')).toContainText('Hello');

// Better: trim if exact needed
const text = (await page.locator('.title').textContent()).trim();
expect(text).toBe('Hello World');
```

---

## Flow Fixes

- Missing preconditions => ensure login, proper navigation, and required test data.
- Fails on 2nd run => add cleanup hooks.
- Depends on order => use `beforeEach` for fresh state.
- Shared state => isolate per test worker.

---

## Framework-Specific Commands

**Playwright:**
- Show trace: `npx playwright show-trace trace.zip`
- Run single file: `npx playwright test path/to/test.spec.ts`

**CodeceptJS:**
- Steps mode: `npx codeceptjs run --steps`
- Verbose: `npx codeceptjs run --verbose`
- Single file: `npx codeceptjs run path/to/test.js`

---

## Max 3 Healing Attempts

1. Attempt 1: apply fix based on initial diagnosis.
2. Attempt 2: if still fails, re-diagnose with new info.
3. Attempt 3: last try with an alternative approach.

If still failing => STOP, document what was tried, ask the user for guidance.
