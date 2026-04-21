# `create-test-cases` — worked example

This folder contains a real end-to-end run of the `create-test-cases` skill against the **Manual Tests Execution** feature of [Testomat.io](https://testomat.io).

## What's inside

| Folder / file | What it is | Produced by |
|---|---|---|
| [`flow-diagram.md`](./flow-diagram.md) | ASCII diagram of the full skill flow (feature phase → sub-feature phase → handoff), including subagent fan-out | — (reference) |
| [`generatedTests/`](./generatedTests/) | **Primary output of this skill** — full feature folder with 10 sub-feature suites, AC baseline, shared UI catalog, destructuring map, style carry-over, per-suite deltas, reviews, and nested test-case MD files | `/create-test-cases` |
| [`generatedDocs/`](./generatedDocs/) | **Downstream output** — BA-style product documentation derived from the test cases (feature context, actors & permissions, state diagrams, use cases, business rules, data model, process flows, integrations, traceability matrix). Demonstrates what else you can build once you have a solid test-case baseline. | downstream docs pipeline (example of what this skill enables) |

## How to read it

1. Start with [`flow-diagram.md`](./flow-diagram.md) to see the shape of the skill.
2. Open [`generatedTests/intake.md`](./generatedTests/intake.md) — the 5-answer questionnaire that seeded the whole run.
3. Then [`generatedTests/destructuring.md`](./generatedTests/destructuring.md) — the sub-feature map + cross-cutting concerns that drove decomposition.
4. Pick any sub-feature folder (e.g. [`environment-configuration/`](./generatedTests/environment-configuration/)) and read in order:
   - `environment-configuration-ac-delta.md` — ACs specific to this sub-feature
   - `environment-configuration-ui-delta.md` — UI elements specific to this sub-feature
   - `environment-configuration-scope.md` — scope contract approved by the user before generation
   - nested `*.md` test-case files — the actual test cases
   - `environment-configuration-review.md` — automated self-review report
5. Finally, browse [`generatedDocs/`](./generatedDocs/) to see how the same feature looks as BA documentation — an illustration of what's possible once the test-case baseline exists.

## Scale of this example

- **1 feature** (manual-tests-execution)
- **10 sub-features** (run-creation, test-execution-runner, tester-assignment, environment-configuration, run-groups, run-lifecycle, runs-list-management, run-detail-and-report, archive-and-purge, bulk-status-actions)
- Feature-level artifacts: `intake.md`, `_ac-baseline.md`, `_shared-ui.md`, `_existing-steps.md`, `destructuring.md`, `_style.md`, `_feature-review.md`
- Per sub-feature: ac-delta, ui-delta, scope, review, validation log, plus either a flat test-case MD or a nested directory with multiple MD files

Feel free to open any individual file — they are fully self-contained and illustrate the artifact contracts described in [`../references/artifacts.md`](../references/artifacts.md).
