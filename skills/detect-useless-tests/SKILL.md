---
name: detect-useless-tests
description: Find useless tests within one testing level (unit, e2e, manual) and list them by area, file, and line for review. Use when asked "which tests can we delete?", "find useless tests", or "what in our suite is not worth keeping?".
---

# Detect Useless Tests

Go through tests of the same level (unit, e2e, manual) and detect useless ones.
Every test has tradeoffs in execution speed, conditions checked, and coupling to implementation details — judge tests against others of the same level only.
Your top priority for interest are tests that are fragile to changes, that rely on time consumed heavy operations: db, browser, etc.

## Useless tests

- Check conditions that never happen.
- Check conditions not important to the business flow.
- Over-test errors (all possible error codes or conditions).
- Check implementation details not exposed as public API and never used outside the module.
- Test a regression that happened under a different implementation.
- Can't fail: no meaningful assertion.
- Mock things other than 3rd party or async services 
- Repeat what another test of the same level already checks

**Exception: keep tests that have a defect explicitly defined.**

## Report

- Group findings by area, then file.
- Reference each test as `<path>` so it is clickable for review.
- One line per test: why it is useless.
- Offer to show a specific area or file in detail.
- **Remove or change tests only after the user approves.**

## Output format

path/to/test/file1:
  test name 1 <- explain why it is useless
  test name 2 <- explain why it is useless

path/to/test/file2:
  test name 3 <- explain why it is useless
  test name 4 <- explain why it is useless
