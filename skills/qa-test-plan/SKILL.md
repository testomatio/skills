---
name: qa-test-plan
description: Decide how a feature should be tested — what to cover with unit tests, e2e tests, and manual checks — and produce a testing plan. Use when asked "how should we test this?", "unit or e2e?", "what test coverage do we need?", or for a test plan for a feature.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA Test Plan

Builds a testing plan for a feature: which scenarios go to unit, e2e, and manual testing.
Input: a feature description, or risk scenarios from a prior QA analysis.

## Workflow

1. Inventory existing tests with the `scan-automation-project` skill.
2. Assign each scenario a level: unit, e2e, or manual.
3. Recommend a coverage split (% unit / e2e / manual).

## Rules

- Do not recommend manual verification for scenarios already covered by automated tests.
- Explain why a scenario cannot be unit tested when assigning it to e2e or manual.
- Generalize existing automated scenarios; expand only when the user asks.

## Output

- Section `☑️ What is already tested`: number and scope of existing unit/e2e tests.
- Section `🧪 Testing plan`: scenario → level (unit / e2e / manual), with reasoning.
- Draw the plan as an ASCII test pyramid: test count and share per level.
- For manual items: how to verify (`action → expected result`).

Pyramid template:

```
        /\
       /  \      🖐 manual — <count> checks (<percent>%)
      /----\
     /      \    🤖 e2e — <count> tests (<percent>%)
    /--------\
   /          \  🔬 unit — <count> tests (<percent>%)
  --------------
```

## Next actions

Offer after the plan:

- Write manual test cases or a checklist → `qa-write-test-cases` skill.
- Automate manual cases into autotests → `automate-manual-test-cases` skill.
- Map tests to source files for change-aware runs → `qa-test-code-coverage` skill.
