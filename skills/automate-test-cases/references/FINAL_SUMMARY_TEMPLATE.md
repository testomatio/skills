# Final Summary Template

Use this template after completing the conversion process:

```
**Summary:**
- Framework: [Playwright/CodeceptJS/Cypress]
- Tests generated: [N]
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
- Framework: Playwright
- Tests generated: 10
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
