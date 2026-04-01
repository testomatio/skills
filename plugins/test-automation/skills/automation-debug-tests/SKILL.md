---
name: automation-debugging-tests
description: Diagnose and fix failing automated tests. Analyze failures, inspect DOM, identify root causes, and apply targeted fixes following a systematic healing methodology.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# AUTOMATION-DEBUGGING-TESTS SKILL: What I do

This skill diagnoses and fixes failing automated tests. I analyze test failures, inspect the application state, identify root causes, and apply targeted fixes following a systematic healing methodology.

## When to Use

Trigger this skill when:
- A test fails during execution.
- User asks to: "debug this test", "fix failing test", "heal test", etc.
- Test passes locally but fails in CI.
- Flaky tests that need stabilization.

---

## Skill Checklist

Complete ALL items in order:

1. [ ] **Analyze Failure** => Capture error type, failure context, test environment (1.1-1.3)
2. [ ] **Inspect & Diagnose** => DOM inspection, logs, screenshots, trace analysis (2.1-2.4)
3. [ ] **Apply Fix** => Fix in priority order: locators → timing → assertions → flow (3.1-3.3)
4. [ ] **Verify & Stabilize** => Re-run, confirm stability, document fix (4.1-4.2)

---

## Workflow: Debug & Heal Failing Tests

### Step 1: Analyze Failure

#### 1.1 Identify Framework

- **Playwright** - Use trace viewer, codegen, debug mode.
- **CodeceptJS** - Use --steps mode, CDP.
- **Cypress** - Use devTools, screenshot on failure.
- **WebdriverIO** - Use selenium-standalone logs.

#### 1.2 Capture Error Type

Categorize the failure:
- **Locator failure** - Element not found, not visible, not clickable.
- **Timing failure** - Timeout, race condition, element appeared too late.
- **Assertion failure** - Expected vs actual value mismatch.
- **Flow failure** - Wrong navigation, missing preconditions, state issues.
- **Infrastructure failure** - Browser crash, network error, config issue.

#### 1.3 Gather Failure Context

Collect:
- Error message (full stack trace).
- Screenshot (if available).
- Test name, file, line number.
- Test data used.
- Environment (browser, viewport, CI/local).

**Step 1 Summary:** Output failure category and initial hypothesis.

---

### Step 2: Inspect & Diagnose

#### 2.1 DOM Inspection

Use framework-specific tools:

**Playwright:**
```bash
# Open browser in debug mode
npx playwright test --debug

# Inspect element
page.locator('selector').evaluate(el => el.outerHTML)

# Get all matching elements
page.locator('selector').count()
```

**CodeceptJS:**
```javascript
// In test or debug console
I.executeScript(() => document.querySelector('.selector').outerHTML)
```

**General pattern:**
```javascript
// Inspect target element
const html = await page.locator('your-selector').first().evaluate(el => el.outerHTML);
console.log(html);
```

#### 2.2 Network & Console Logs

```javascript
// Capture console logs
page.on('console', msg => console.log(msg.text()));

// Capture network failures
page.on('requestfailed', request => console.log(request.failure().errorText));
```

#### 2.3 Trace Analysis

**Playwright trace:**
```bash
npx playwright show trace.zip
```

Look for:
- Click happened before element visible.
- Navigation happened before assertion.
- Network request pending during assertion.

#### 2.4 Compare Expected vs Actual

For assertion failures:
- What was expected?
- What was actual?
- Is the expected value correct?

If expected value seems wrong:
    - Ask user to confirm expected results.

**Step 2 Summary:** Output root cause and recommended fix category.

---

### Step 3: Apply Fix

#### 3.1 Fix Locators (Priority 1)

**Choose stable selectors in this order:**
1. `data-testid` - Most reliable.
2. `aria-label` / `aria-*` - Accessible and stable.
3. `role` + accessible name - Semantic.
4. `id` - Unique identifiers.
5. Text content - For links, buttons, labels.
6. CSS/XPath - Last resort only.

**Common locator fixes:**

| Issue | Fix |
|-------|-----|
| Element not found | Add wait, check if element exists |
| Element not visible | Scroll into view, check overlay |
| Element not clickable | Wait for enabled state, check for overlays |
| Multiple matches | Add more specific filter, use `.first()` |
| Stale element | Re-fetch element before action |

**Example:**
```typescript
// Before (fragile)
await page.click('.parent .child .btn-primary:nth-child(2)');

// After (stable)
await page.getByRole('button', { name: 'Submit' }).click();
```

#### 3.2 Fix Timing (Priority 2)

**Use framework-native waits:**

**Playwright:**
```typescript
// Wait for element visible
await page.getByTestId('modal').waitFor({ state: 'visible' });

// Wait for navigation
await page.waitForURL('/dashboard/**');

// Wait for network idle
await page.waitForLoadState('networkidle');
```

**CodeceptJS:**
```javascript
I.waitForElement('#modal', 5);
I.waitForNavigationVisible();
I.waitForResponse(response => response.status() === 200);
```

**Avoid:**
- `sleep(5000)` - Hard waits
- `wait(2)` - CodeceptJS version of hard wait
- Implicit waits that are too short

**Fix race conditions:**
```typescript
// Before: assertion before element ready
await page.click('button');
expect(await page.locator('.result').textContent()).toBe('Success');

// After: wait for element
await page.click('button');
await page.locator('.result').waitFor();
expect(await page.locator('.result').textContent()).toBe('Success');
```

#### 3.3 Fix Assertions (Priority 3)

**Common assertion fixes:**

| Issue | Fix |
|-------|-----|
| Exact match too strict | Use `toContain()`, regex |
| Wrong expected value | Verify against test spec, not assumption |
| Timing issue | Add wait before assertion |
| Multiple elements | Use `.first()` or `.nth(0)` |

**Example:**
```typescript
// Before: exact match fails on whitespace
await expect(page.locator('.title').textContent()).toBe('Hello World');

// After: contains check
await expect(page.locator('.title')).toContainText('Hello');
```

#### 3.4 Fix Flow (Priority 4)

Check for:
- Missing login/Setup
- Wrong navigation order
- Missing test data
- State pollution from previous tests

**Fix missing preconditions:**
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

**Step 3 Summary:** Output applied fix and re-run command

---

### Step 4: Verify & Stabilize

#### 4.1 Re-run Test

Run the test again to verify fix:
```bash
# Single run
npx playwright test path/to/test.spec.ts
npx codeceptjs run path/to/test.js
```

**Max 3 healing attempts total** (across all steps).

#### 4.2 Ensure Stability

Test is stable when:
- Passes 2 consecutive runs.
- No hard waits.
- Uses resilient locators.
- Proper waits for dynamic content.

**Document the fix:**
- Root cause.
- Applied fix.
- Verification result.

**Step 4 Summary:** Output final status, fix applied, stability check

---

## MCP Integration (Optional)

When MCP tools are available, use them for complex debugging:

### Playwright MCP

```javascript
// After each action - capture snapshot
browser_snapshot();

// Inspect element
document.querySelector('.selector').outerHTML;

// Count elements
document.querySelectorAll('[role="button"]').length;
```

### CodeceptJS MCP

```bash
# Run in steps mode
npx codeceptjs run --grep "@tag" --steps

# Use CDP for inspection
I.executeScript(() => {
  return document.querySelector('.selector')?.outerHTML;
});
```

**Use MCP when:**
- Standard fixes don't resolve the issue.
- Complex UI (dropdowns, modals, dynamic content).
- Need live DOM inspection.

---

## Common Issues & Quick Fixes

### Locator Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Element not found | Wrong selector | Inspect DOM, use getByRole |
| Stale element | Element re-rendered | Re-fetch before action |
| Multiple matches | Selector too broad | Add more specific filter |

### Timing Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Timeout errors | Element not loaded | Add explicit wait |
| Flaky tests | Race condition | Wait for element/state |
| Works locally, fails CI | CI slower | Increase timeout, add waits |

### Assertion Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Expected wrong value | Test spec error | Verify against spec |
| Assertion too strict | Exact match issue | Use contains/regex |

### Flow Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Fails on 2nd run | Test isolation | Add cleanup, use fresh state |
| Depends on order | Test coupling | Use beforeEach setup |

---

## Error Handling

### Blocking Issues

- **After 3 attempts** → Stop, document, ask for guidance

---

## User Interaction Guidelines

### When Asking Questions

Use ❓ emoji for unclear items:

```
❓ Which element should I target for this action?

Options:
1. Submit button (data-testid="submit")
2. Save button (aria-label="Save")
3. Other (specify)
```

### Reporting Progress

Provide structured updates:

```
🔍 Analyzing failure...
   - Error: Element not found
   - Context: Login test, line 42
   
🔧 Applying fix...
   - Issue: Selector too broad
   - Fix: Using getByRole('button', { name: 'Login' })
   
✅ Test passed! (Run 1/2)
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Debug Playwright | `npx playwright test --debug` |
| Run CodeceptJS steps | `npx codeceptjs run --steps` |
| View Playwright trace | `npx playwright show trace.zip` |
| Run single test | `npx playwright test path` |
| Run single test | `npx codeceptjs run path` |

---

## References

| Description | File |
|-------------|------|
| Debugging Practices | ./automation-debugging-tests/references/DEBUGGING_QUICK_REFERENCE.md |
