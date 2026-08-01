---
name: qa-split-testing-levels
description: Apply the testing pyramid to a feature — divide test scenarios across levels (unit, integration, e2e), assign each scenario to the cheapest sufficient level, and produce a coverage split per level. Use when asked "unit, integration or e2e?", "what level should this test be?", "how should we test this feature?", "what test coverage do we need?", or to apply the test pyramid to a feature or project.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA Split Testing Levels

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
- When the environment can render charts, add a pie chart or test pyramid: test count and share per level. Skip the diagram in plain terminal output.
- For manual items: how to verify (`action → expected result`).

## Next actions

Offer after the plan:

- Write manual test cases or a checklist → `qa-write-test-cases` skill.
- Automate manual cases into autotests → `automate-manual-test-cases` skill.
- Map tests to source files for change-aware runs → `qa-test-code-coverage` skill.
