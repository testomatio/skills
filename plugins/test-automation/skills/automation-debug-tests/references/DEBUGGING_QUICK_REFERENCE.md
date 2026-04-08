# Debugging Quick Reference

**Priority:** 
1. Fix Locators First
2. Timing
3. Assertions
4. Flow

---

## Locator Fixes

### Common Locator Issues

| Problem | Bad | Good |
|---------|-----|------|
| Deep nesting | `.parent .child .grandchild` | `[data-testid="target"]` |
| Index-based | `button:nth-child(2)` | `getByRole('button', { name: 'Submit' })` |
| Partial text | `button:contains("Save")` | `getByText('Save', { exact: true })` |
| Dynamic classes | `.btn-primary-123` | `[data-testid="save-btn"]` |

### Element State Issues

- Not found => Wait for element before action
- Not visible => Scroll into view
- Not clickable => Wait for enabled state; check overlays
- Stale element => Re-fetch element before action
- Multiple matches => Filter or use `.first()`

---

## Timing Fixes

Use framework-native waits instead of hard sleeps.

### Use Explicit Waits

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

Wait for element before assertion.

```typescript
await page.click('button');
await page.locator('.result').waitFor();
expect(await page.locator('.result').textContent()).toBe('Success');
```

**What to Avoid:**
- Hard sleeps (sleep(5000), wait(2)) → flaky.
- Implicit short waits → unreliable.

---

## Assertion Fixes

### Common Assertion Issues

- Exact match too strict => Use `toContain()` or regex.
- Wrong expected value => Verify against test spec.
- Timing issues => Wait before assertion.
- Multiple elements => Use `.first()` or `.nth(0)`.

Examples:

```typescript
// Before: exact match fails on whitespace
expect(await page.locator('.title').textContent()).toBe('Hello World');

// After: contains check
expect(page.locator('.title')).toContainText('Hello');

// Better: trim if exact needed
const text = (await page.locator('.title').textContent()).trim();
expect(text).toBe('Hello World');
```

---

## Flow Fixes

**Missing Preconditions:** Ensure login, proper navigation, and required test data.
**Test Isolation Issues:** 
  - Fails on 2nd run => Add cleanup hooks.
  - Depends on order => Use `beforeEach` for fresh state.
  - Shared state => Isolate per test worker.

---

## Framework-Specific Commands

**Playwright:**
- Show trace: `npx playwright show trace.zip`
- Run single file: `npx playwright test path/to/test.spec.ts`

**CodeceptJS:**
- Steps mode: `npx codeceptjs run --steps`
- Verbose: `npx codeceptjs run --verbose`
- Single file: `npx codeceptjs run path/to/test.js`

---

## Quick Decision Tree

```
Test Failed
    │
    ▼
What type of failure?
    │
    ├─► Locator (not found, not visible)
    │       │
    │       ▼
    │   Fix selector → use data-testid/aria-role
    │
    ├─► Timing (timeout)
    │       │
    │       ▼
    │   Add explicit wait
    │
    ├─► Assertion (expected ≠ actual)
    │       │
    │       ▼
    │   Check expected value vs test spec
    │
    └─► Flow (navigation, state)
            │
            ▼
        Check preconditions
```

---

## Max 3 Healing Attempts

1. **Attempt 1**: Apply fix based on initial diagnosis
2. **Attempt 2**: If still fails, re-diagnose with new info
3. **Attempt 3**: Last try with alternative approach

> If still failing => STOP, document issues, ask user for guidance