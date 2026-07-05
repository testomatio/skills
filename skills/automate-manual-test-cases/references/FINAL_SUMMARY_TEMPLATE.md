# Final Summary Template

Use this template after completing the conversion process:

> 🚦 **`Status: ✅ Done` is allowed only when `Executed == Tests generated` and every one passed.** If any test did not run — including framework-level blockers like a missing env var — use **`⛔ Blocked`** (nothing executed) or **`⚠️ Needs review`** (some ran, some didn't), put the reason at the top, and do **not** mark generated files ✅.

```
**Summary:**
- Status: [✅ Done | ⚠️ Needs review | ⛔ Blocked]
- Framework: [Playwright/CodeceptJS/Cypress]
- Tests generated: [N]
- Executed: [N]
- Passed: [N]
- Needs review: [N]

**Generated Files:**
- [path/to/test1.spec.ts] ✅
- [path/to/test2.spec.ts] ⚠️ ([issue])
- [path/to/test3.spec.ts] ✅

**Key Issues:**
[Short description of main problems, if any]

**Next steps:**
...
```

## Example Final Summary

```
**Summary:**
- Status: ⚠️ Needs review
- Framework: Playwright
- Tests generated: 10
- Executed: 10
- Passed: 8
- Needs review: 2

**Generated Files:**
- tests/e2e/test1.spec.ts ✅
- tests/e2e/test2.spec.ts ⚠️ (locator issue)
- tests/e2e/test3.spec.ts ✅
...

**Key Issues:**
- 2 tests have unstable locators
- 1 test has assumption on missing step details

**Next steps:**
- Review ⚠️ tests
- Run full suite if needed
```

## Example Blocked Summary

When the tests could not run at all, lead with the blocker — never present unrun tests as done.

```
**⛔ Blocked — tests were written but NOT executed**

Cannot run: `npx codeceptjs run` stops at bootstrap because env var `BETA_MAIN_USER_GENERAL_TOKEN` is missing.

**Summary:**
- Status: ⛔ Blocked
- Framework: CodeceptJS
- Tests generated: 4
- Executed: 0
- Passed: 0

**Generated Files (unverified — did not run):**
- tests/defects/defectsBoard.test.ts ⛔

**To unblock:**
- Set `BETA_MAIN_USER_GENERAL_TOKEN` in `.env`, then re-run the test.
```
