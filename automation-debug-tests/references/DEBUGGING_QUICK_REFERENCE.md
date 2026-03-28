# Debugging Quick Reference

## Priority: Fix Locators First, Then Timing, Then Assertions, Then Flow

---

## Locator Fixes (Priority 1)

### Selector Priority Order
1. `data-testid` - Most reliable
2. `aria-label` / `aria-*` - Accessible
3. `role` + accessible name - Semantic
4. `id` - Unique identifiers
5. Text content - Links, buttons, labels
6. CSS/XPath - Last resort only

### Common Locator Issues

| Problem | Bad | Good |
|---------|-----|------|
| Deep nesting | `.parent .child .grandchild` | `[data-testid="target"]` |
| Index-based | `button:nth-child(2)` | `getByRole('button', { name: 'Submit' })` |
| Partial text | `button:contains("Save")` | `getByText('Save', { exact: true })` |
| Dynamic classes | `.btn-primary-123` | `[data-testid="save-btn"]` |

### Element State Issues

| Issue | Fix |
|-------|-----|
| Not found | Add `waitFor()` before action |
| Not visible | Scroll into view first |
| Not clickable | Wait for enabled state, check overlays |
| Stale element | Re-fetch element before action |
| Multiple matches | Add filter, use `.first()` |

---

## Timing Fixes (Priority 2)

### Use Explicit Waits

**Playwright:**
```typescript
// Wait for visible
await page.getByTestId('modal').waitFor({ state: 'visible' });

// Wait for hidden
await page.getByTestId('loader').waitFor({ state: 'hidden' });

// Wait for URL
await page.waitForURL('/dashboard/**');

// Wait for response
await page.waitForResponse(response => response.status() === 200);
```

**CodeceptJS:**
```javascript
I.waitForElement('#modal', 5);
I.waitForNavigationVisible();
I.waitForResponse(response => response.status() === 200);
```

### Fix Race Conditions

```typescript
// BEFORE: assertion before element ready
await page.click('button');
expect(await page.locator('.result').textContent()).toBe('Success');

// AFTER: wait for element
await page.click('button');
await page.locator('.result').waitFor();
expect(await page.locator('.result').textContent()).toBe('Success');
```

### What to Avoid

| Bad | Why | Better |
|-----|-----|--------|
| `waitForTimeout(5000)` | Flaky, slow | Explicit wait |
| `sleep(2)` | Hard wait | `waitForElement` |
| Implicit short waits | Not reliable | Explicit waits |

---

## Assertion Fixes (Priority 3)

### Common Assertion Issues

| Problem | Fix |
|---------|-----|
| Exact match fails | Use `toContain()` or regex |
| Whitespace differences | Trim or use regex |
| Case differences | Use case-insensitive match |
| Multiple elements | Use `.first()` or filter |

### Assertion Examples

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

## Flow Fixes (Priority 4)

### Missing Preconditions

```typescript
// Before: assumes logged in
test('create item', async ({ page }) => {
  await page.goto('/items/new'); // fails - not authenticated
});

// After: ensure login
test('create item', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'test@test.com');
  await page.click('button[type="submit"]');
  await page.goto('/items/new');
});
```

### Test Isolation Issues

| Symptom | Fix |
|---------|-----|
| Fails on 2nd run | Add cleanup in After hook |
| Depends on order | Use beforeEach for fresh state |
| Shared state | Use test isolation per worker |

---

## Framework-Specific Commands

### Playwright

```bash
# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui

# Show trace
npx playwright show trace.zip

# Codegen
npx playwright codegen

# Run with headed browser
npx playwright test --headed

# Single file
npx playwright test path/to/test.spec.ts
```

### CodeceptJS

```bash
# Steps mode
npx codeceptjs run --steps

# Verbose
npx codeceptjs run --verbose

# Debug
npx codeceptjs run --debug

# Single file
npx codeceptjs run path/to/test.js
```

---

## MCP Tools (If Available)

### DOM Inspection

```javascript
// Get element HTML
document.querySelector('.selector').outerHTML

// Count elements
document.querySelectorAll('[role="button"]').length

// Get computed style
getComputedStyle(document.querySelector('.selector')).display
```

### Screenshot

```javascript
browser_snapshot() // MCP Playwright
```

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

If still failing → STOP, document issues, ask user for guidance