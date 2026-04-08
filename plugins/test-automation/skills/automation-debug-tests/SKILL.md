---
name: automation-debugging-tests
description: Diagnose and fix failing automated tests. Analyze failures, inspect DOM, identify root causes, and apply targeted fixes following a systematic healing methodology. Use test framework tools and MCP/CLI debug modes where available.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# AUTOMATION-DEBUGGING-TESTS SKILL: What I do

This skill systematically diagnoses and heals failing automated tests. It analyzes test results using framework-native tools, inspects the application state, identifies root causes, and applies targeted fixes following a structured healing methodology. Where available, it leverages MCP snapshots and CLI debug modes to enhance test inspection and repair.

## When to Use

Trigger this skill when:
- A test fails during execution.
- User asks to: "debug this test", "fix failing test", "heal test", etc.
- Test passes locally but fails in CI.
- Flaky or intermittent tests need stabilization.

---

## Skill Checklist

Complete ALL items in order:

1. [ ] **Analyze Failure** => Capture error type, failure context, test environment (1.1-1.3)
2. [ ] **Inspect & Diagnose** => DOM inspection, logs, screenshots, trace analysis (2.1-2.4)
3. [ ] **Apply Fix** => Fix in priority order: locators → timing → assertions → flow (3.1-3.3)
4. [ ] **Verify & Stabilize** => Re-run, confirm stability, document fix (4.1-4.2)

---

## Debug & Healing Workflow

### Step 1: Analyze Failure

1. **Identify framework** - Determines available debug tools.
  - Playwright: CLI debug, trace viewer, MCP snapshots.
  - CodeceptJS: `--steps` mode, CDP inspection.
  - Cypress: devTools, screenshots on failure.
  - WebdriverIO: Selenium logs.
2. **Capture error type** - Categorize for priority fixing:
  - Locator (element missing/unreachable).
  - Timing (timeout/race).
  - Assertion (expected ≠ actual).
  - Flow (navigation, preconditions).
  - Infrastructure (CI/browser/network).
3. **Gather failure context** - Collect:
  - Full stack trace & error message.
  - Screenshot / video.
  - Test name, file, line number.
  - Test data & environment (browser, viewport, CI/local).

**Step 1 Overview:** Hypothesis for root cause and likely fix type.

---

### Step 2: Inspect & Diagnose

1. **DOM Inspection:**
  - Playwright: `page.locator('selector').evaluate(el => el.outerHTML)`.
  - CodeceptJS: `I.executeScript(() => document.querySelector('.selector').outerHTML)`.
  - MCP snapshot: capture live DOM state for complex elements
2. **Network & Console Logs:**
  - Capture console: `page.on('console', msg => console.log(msg.text()))`.
  - Capture request failures: `page.on('requestfailed', r => console.log(r.failure().errorText))`.
3. **Trace Analysis (Playwright):**
  - CLI: `npx playwright show trace.zip`.
  - Inspect timing/order of clicks, navigation, network requests.
4. **Compare Expected vs Actual:**
  - Check assertion values against test spec, not assumptions.

**Step 2 Overview:** Root cause + recommended fix category (locator, timing, assertion, flow).

---

### Step 3: Apply Fix

#### 3.1 Fix Locators

**Fix priority order:** Locators → Timing → Assertions → Flow

1. **Locator Fixes (Priority 1):**
  - Use stable selectors (`data-testid` → `aria-labe`l → `role` → `id` → `text` → `CSS/XPath`)
  - Re-fetch elements if stale, scroll into view if hidden, filter `.first()` for multiple matches.

Example:
```typescript
// Before (fragile)
await page.click('.parent .child .btn-primary:nth-child(2)');

// After (stable)
await page.getByRole('button', { name: 'Submit' }).click();
```

2. **Timing Fixes (Priority 2):**
  - Framework-native waits: `waitFor`, `waitForNavigation`, `waitForLoadState('networkidle')`.
  - Avoid hard sleeps: like `sleep(5000)` or `wait(2)`.

Example:

```typescript
await page.locator('.result').waitFor();
expect(await page.locator('.result').textContent()).toBe('Success');
```

3. **Assertion Fixes (Priority 3):**
  - Use contains/regex for flexible matching.
  - Confirm expected values with spec.

**Common assertion fixes:**

| Issue | Fix |
|-------|-----|
| Exact match too strict | Use `toContain()`, regex |
| Wrong expected value | Verify against test spec, not assumption |
| Timing issue | Add wait before assertion |
| Multiple elements | Use `.first()` or `.nth(0)` |

Example:
```typescript
// Before: exact match fails on whitespace
await expect(page.locator('.title').textContent()).toBe('Hello World');

// After: contains check
await expect(page.locator('.title')).toContainText('Hello');
```

4. **Flow Fixes (Priority 4):**
  - Ensure preconditions: login setup, navigation order, missing test-data.
  - Isolate test state from prior runs.

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
- Uses resilient locators.
- Proper waits for dynamic content.

**Document the fix:**
- Root cause.
- Applied fix.
- Verification result.

**Step 4 Overview:** Output final status, fix applied, stability check

---

## MCP & Advanced Debagging Tools (Optional)

When MCP tools are available, use them for complex debugging:
- **Playwright MCP:** Live snapshots, element count, DOM inspection, after each action.
- **CodeceptJS MCP:** CDP-based inspection, `--steps` mode for live debugging.

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
| Run CodeceptJS steps | `npx codeceptjs run --steps` |
| View Playwright trace | `npx playwright show trace.zip` |

---

## References

| Description | File |
|-------------|------|
| Debugging Practices | ./automation-debugging-tests/references/DEBUGGING_QUICK_REFERENCE.md |
