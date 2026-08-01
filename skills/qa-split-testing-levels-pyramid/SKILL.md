---
name: qa-split-testing-levels-pyramid
description: Apply the testing pyramid to a feature — divide test scenarios across levels (unit, integration, e2e), assign each scenario to the cheapest sufficient level, and produce a coverage split per level. Use when asked "unit, integration or e2e?", "what level should this test be?", "how should we test this feature?", "what test coverage do we need?", or to apply the test pyramid to a feature or project.
license: MIT
metadata:
  author: Testomat.io
  version: 1.0.0
---

# QA Split Testing Levels — Test Pyramid

Applies the testing pyramid to a feature: each scenario goes to the cheapest level that can still catch its failure.
Input: a feature description, or risk scenarios from a prior QA analysis.

## Testing levels

Default pyramid — three layers, bottom to top:

1. **unit + integration** — treated as one layer. In most projects the boundary between them is not discoverable from the code, so do not try to split it.
2. **e2e** — runs the assembled system through its real interface.
3. **manual** — everything left that no automated level can reasonably verify.

Derive the actual layers from the project instead of assuming the default. A scan may reveal component, functional, API, contract, or visual test suites with their own runners and directories — when it does, use those as layers and rebuild the pyramid around them. State the layers being used before assigning scenarios.

A level is not always a single kind of test. E2E commonly splits into e2e API and e2e web (UI), and often mobile, CLI, or cross-browser suites next to them; other levels split the same way. Each kind has its own entry point, cost, and failure modes — an API scenario is not covered by a web test of the same flow. Discover the kinds within a level from the project's runners, configs, and directory layout, keep them as distinct targets, and assign scenarios to a specific kind, not just to a level.

## Workflow

1. Inventory existing tests with the `scan-automation-project` skill.
2. Determine the levels this project actually has; fall back to the default three layers.
3. Within each level, identify the distinct kinds of tests (e.g. e2e api / e2e web) and their runners.
4. Assign each scenario to the lowest level that can catch its failure, and to a kind within that level.
5. Recommend a coverage split (% per level, broken down by kind where a level has several).

## Rules

- Do not recommend manual verification for scenarios already covered by automated tests.
- Explain why a scenario cannot sit at a lower level when assigning it upward.
- Do not treat a scenario as covered by a different kind of test at the same level — an e2e web test does not cover an e2e API contract, and the reverse.
- Generalize existing automated scenarios; expand only when the user asks.

## Output

- Section `📐 Testing levels`: the layers used and the kinds of tests within each, and why, when they differ from the default.
- Section `☑️ What is already tested`: number and scope of existing tests per level and kind.
- Section `🧪 Testing plan`: scenario → level and kind (e.g. `e2e / api`), with reasoning.
- When the environment can render charts, add a pie chart or test pyramid: test count and share per level, split by kind where a level has several. Skip the diagram in plain terminal output.
- For manual items: how to verify (`action → expected result`).

## Next actions

Offer after the plan:

- Write manual test cases or a checklist → `qa-write-test-cases` skill.
- Automate manual cases into autotests → `automate-manual-test-cases` skill.
- Map tests to source files for change-aware runs → `qa-test-code-coverage` skill.
