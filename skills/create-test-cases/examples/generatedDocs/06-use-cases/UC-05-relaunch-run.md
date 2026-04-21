# UC-05: Relaunch a Run — QA Creator

<!-- use-case
id: UC-05
primary-actor: QA Creator
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** QA Creator
**Stakeholders:** Tester (receives the re-opened runner); CI orchestrator (consumes on-CI variants — Relaunch Failed on CI, Relaunch All on CI); Project (consumes RunGroup / environment / assignee inheritance); downstream Report / TQL consumers (new Runs land in the list and become filterable).
**Goal:** Re-execute some or all tests of a [Finished](../03-glossary.md#finished) Run — either in place (same Run ID), as a fresh Run, or as an independent copy — with fine-grained control over test selection, title, and prior-result retention.
**Trigger:** Actor opens the **Relaunch ▾** menu on a Finished Run (exposed from the Runs list row extra menu, the [Run Report](../03-glossary.md#run-report), or the Run Detail extra menu — `run-lifecycle-ac-delta.md` ac-delta-8).
**Scope:** `run-lifecycle` (owner). Touches `run-creation` (Launch-a-Copy produces a sibling Run), `test-execution-runner` (manual re-execution opens the Runner — see [UC-03](./UC-03-execute-test-in-runner.md)), `bulk-status-actions` / filter-applied scope for Advanced Relaunch selection ([UC-09](./UC-09-bulk-status-in-runner.md), AC-66), `run-detail-and-report` (entry point from the report — [UC-11](./UC-11-view-run-report.md)).

## Preconditions

- Target Run is in the **Finished** state (`run-lifecycle-ac-delta.md` ac-delta-8 — Relaunch variants are not exposed on In-Progress / Pending / Terminated Runs).
- Actor holds Create-Run permission (see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix)).
- For on-CI variants (*Relaunch Failed on CI*, *Relaunch All on CI*): a [CI Profile](../03-glossary.md#ci-profile) must be configured on the project (same precondition as UC-02, [BR-3](../07-business-rules.md#br-3)).
- Source Run's assignees, environment, and RunGroup exist (inherited unless overridden — ac-delta-13).

## Main success scenario — "Relaunch Manually" (re-execute all tests in UI)

1. Actor opens Relaunch ▾ on a Finished Run.
2. System exposes six variants:
   - **Relaunch** (AC-58) — re-open the same Run in the Manual Runner in place.
   - **Launch a Copy** (AC-67) — duplicate the Run as a new sibling Run (same scope and assignees).
   - **Advanced Relaunch** (AC-62) — sidebar with full control over selection, new/same Run ID, and Keep-values semantics.
   - **Relaunch Failed on CI** (AC-59) — failed automated tests go to CI; failed manual tests open in the runner.
   - **Relaunch All on CI** (AC-60) — every automated test is re-triggered via the CI Profile.
   - **Relaunch Manually** (AC-61) — every test re-executes manually in UI (including automated ones treated as manual).
3. Actor clicks **Relaunch Manually**.
4. System re-opens the Run in the [Manual Runner](../03-glossary.md#manual-runner); every test is reset to Pending; the Run transitions to In-Progress (AC-61). The title, assignees, environment, and RunGroup of the source Run are carried over (ac-delta-13).
5. Actor executes tests per [UC-03](./UC-03-execute-test-in-runner.md) and finishes per [UC-04](./UC-04-finish-run.md).

## Alternate flows

### A1: Relaunch (in-place)
1. Actor picks **Relaunch** (AC-58).
2. System re-opens the same Run ID in the Manual Runner; every test is reset to Pending; the Run is In-Progress. No new Run is created.

### A2: Launch a Copy
1. Actor picks **Launch a Copy** (AC-67) — creates a sibling Run with the same scope.
2. System creates a new Run record; both the source Finished Run and the new In-Progress copy coexist in the Runs list. The copy opens in the Manual Runner (or CI path for Mixed Runs — see A7).

### A3: Launch a Copy Manually
**Distinct from A2 — enforces the manual path regardless of source type.**
1. Actor picks **Launch a Copy Manually** (ac-delta-1).
2. System creates a new Run with the same scope and opens the Manual Runner immediately (not CI).

### A4: Relaunch Failed on CI
**Applies when the source Run is Mixed and the CI Profile is configured.**
1. Actor picks **Relaunch Failed on CI** (AC-59).
2. System triggers the CI Profile for tests that are *automated and failed*, and opens the Manual Runner for tests that are *manual and failed*. The rest of the Run's results are preserved on the source Run. [BR-3](../07-business-rules.md#br-3) gates the on-CI portion — missing CI Profile blocks the variant.

### A5: Relaunch All on CI
1. Actor picks **Relaunch All on CI** (AC-60).
2. System triggers the CI Profile for every automated test; manual tests are either untouched or queued per project policy (see [13-open-questions.md § OQ-15](../13-open-questions.md#oq-15)).

### A6: Advanced Relaunch (per-test selection, Create-new-run toggle, Keep values)
1. Actor picks **Advanced Relaunch** (AC-62) — System opens the Advanced sidebar.
2. Sidebar fields:
   - **Title** — optional override; otherwise inherits source title with a relaunch indicator (ac-delta-13).
   - **Create new run** (toggle).
   - **Keep values** (toggle) — enabled only when *Create new run* is ON (ac-delta-11).
   - **Tests list** with per-test checkboxes and **Select all** that honours any active filter (ac-delta-12, AC-66).
   - **Relaunch** (primary action).
3. Actor configures selection and toggles; clicks **Relaunch**.
4. System closes the sidebar and navigates the actor to the Manual Runner of the target Run (new Run ID if Create-new-run:ON, original Run ID if OFF — ac-delta-2).
5. Apply matrix:

   | Create new run | Keep values | Outcome |
   |---|---|---|
   | **ON** | **ON** | New Run ID; selected tests reset to Pending; **unselected tests retain their source statuses** (AC-63, AC-65). |
   | **ON** | **OFF** | New Run ID; every test resets to Pending (AC-63). |
   | **OFF** | n/a (hidden/disabled, ac-delta-11) | Original Run ID reused; only selected tests reset to Pending (AC-64). |

### A7: Relaunch on a Mixed Run
**Applies when the source Run is a [Mixed Run](../03-glossary.md#mixed-run).**
1. CI variants (A4 / A5) route automated tests to CI; manual tests open in the runner.
2. UI variants (main / A1 / A3 / A6-manual) stay entirely in the Manual Runner for every test (ac-delta-14).

### A8: Advanced Relaunch with a filter applied (selection scope)
1. Actor applies a filter on the runner / Runs list prior to opening Advanced Relaunch.
2. **Select all** in the Advanced sidebar covers only the filtered set (ac-delta-12, AC-66).

## Exception flows

### E1: On-CI variant without CI Profile
1. Actor picks *Relaunch Failed on CI* or *Relaunch All on CI* on a project with no CI Profile.
2. Behaviour unverified in the POC window — see [13-open-questions.md § OQ-02](../13-open-questions.md#oq-02) and [OQ-15](../13-open-questions.md#oq-15). Per [BR-3](../07-business-rules.md#br-3), the on-CI leg requires a source; the UI is expected to block or surface guidance.

### E2: Advanced Relaunch with zero tests selected
1. Actor unchecks every test in the Advanced sidebar and clicks **Relaunch**.
2. Behaviour unverified — the sidebar may disable the primary action or proceed with a no-op. Tracked in [13-open-questions.md § OQ-15](../13-open-questions.md#oq-15).

### E3: Source Run is not Finished
1. Actor attempts to open Relaunch ▾ on an In-Progress / Pending Run.
2. System does not expose the Relaunch menu items for that Run (ac-delta-8). Relaunch is specifically a post-Finish affordance.

## Postconditions

- **Success (in-place variants — A1, A6 with Create-new-run:OFF):** Source Run's selected tests reset to Pending; Run transitions back to In-Progress. No new Run record is created.
- **Success (new-Run variants — main flow, A2, A3, A6 with Create-new-run:ON):** A new Run exists, In-Progress, Title / assignees / env / RunGroup inherited (overridable via Advanced title, ac-delta-13). Source Run remains Finished.
- **Success (CI variants — A4, A5):** CI Profile is triggered for the applicable automated subset; manual subset opens in the runner or remains untouched per variant semantics.
- **Failure:** No state change. Source Run remains Finished; no new Run is created; CI is not triggered.

## Business rules referenced

- [**BR-3**](../07-business-rules.md#br-3) — CI-variants require a configured CI Profile.
- [**BR-8**](../07-business-rules.md#br-8) — Terminated Runs cannot resume (Relaunch is gated on Finished; Terminated is not Finished — see [05-state-diagrams.md § Run](../05-state-diagrams.md#run)).

## Functional requirements covered

- AC-58, AC-59, AC-60, AC-61, AC-62, AC-63, AC-64, AC-65, AC-66, AC-67.
- `run-lifecycle-ac-delta.md` ac-delta-1, ac-delta-2, ac-delta-8, ac-delta-11, ac-delta-12, ac-delta-13, ac-delta-14.

## Related use cases

- **[UC-04](./UC-04-finish-run.md)** — produces the Finished state that gates Relaunch.
- **[UC-03](./UC-03-execute-test-in-runner.md)** — consumes the re-opened runner for manual variants.
- **[UC-02](./UC-02-create-mixed-run.md)** — defines CI Profile / CLI duality that A4/A5 reuse.
- **[UC-07](./UC-07-configure-environments.md)** — source Run's environment is inherited; multi-env interaction with Relaunch tracked in [13-open-questions.md § OQ-15](../13-open-questions.md#oq-15).
- **[UC-11](./UC-11-view-run-report.md)** — Report is a Relaunch entry point.

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-05 -->
<!-- sources: AC-58, AC-59, AC-60, AC-61, AC-62, AC-63, AC-64, AC-65, AC-66, AC-67, run-lifecycle/ac-delta-1, run-lifecycle/ac-delta-2, run-lifecycle/ac-delta-8, run-lifecycle/ac-delta-11, run-lifecycle/ac-delta-12, run-lifecycle/ac-delta-13, run-lifecycle/ac-delta-14 -->
<!-- sub-feature: run-lifecycle -->

_18 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | critical | bulk-status-actions | [Bulk Result Message apply with a status filter active affects only filter-matching tests @boundary](../../../../test-cases/manual-tests-execution/bulk-status-actions/cross-cutting.md) | AC-66 |
| 2 | normal | bulk-status-actions | [Suite-level checkbox with a status filter active selects only filter-matching tests @boundary](../../../../test-cases/manual-tests-execution/bulk-status-actions/cross-cutting.md) | AC-66 |
| 3 | high | run-lifecycle | ['Keep values' ${keep_values_state} with 'Create new run' ON ${expected_outcome} @boundary](../../../../test-cases/manual-tests-execution/run-lifecycle/advanced-relaunch.md) | AC-65, AC-63 |
| 4 | high | run-lifecycle | ['Keep values' toggle is disabled while 'Create new run' is OFF @negative @boundary](../../../../test-cases/manual-tests-execution/run-lifecycle/advanced-relaunch.md) | run-lifecycle/ac-delta-11 |
| 5 | normal | run-lifecycle | ['Select all' inside Advanced Relaunch respects an active status filter](../../../../test-cases/manual-tests-execution/run-lifecycle/advanced-relaunch.md) | AC-66, run-lifecycle/ac-delta-12 |
| 6 | critical | run-lifecycle | [Advanced Relaunch with 'Create new run' OFF reuses the original Run ID and resets selected tests to Pending @smoke](../../../../test-cases/manual-tests-execution/run-lifecycle/advanced-relaunch.md) | AC-64, run-lifecycle/ac-delta-2 |
| 7 | critical | run-lifecycle | [Advanced Relaunch with 'Create new run' ON creates a new Run ID inheriting the source metadata @smoke](../../../../test-cases/manual-tests-execution/run-lifecycle/advanced-relaunch.md) | AC-63, run-lifecycle/ac-delta-2, run-lifecycle/ac-delta-13 |
| 8 | normal | run-lifecycle | [Advanced Relaunch with a custom Title and per-test selection relaunches only the chosen tests](../../../../test-cases/manual-tests-execution/run-lifecycle/advanced-relaunch.md) | AC-62, run-lifecycle/ac-delta-12, run-lifecycle/ac-delta-13 |
| 9 | normal | run-lifecycle | [Cancelling the Advanced Relaunch sidebar leaves the source run unchanged @negative](../../../../test-cases/manual-tests-execution/run-lifecycle/advanced-relaunch.md) | AC-62 |
| 10 | low | run-lifecycle | [CI-routing Relaunch variants via ${variant} appear on finished ${run_type} runs @unclear](../../../../test-cases/manual-tests-execution/run-lifecycle/basic-relaunch.md) | AC-59, AC-60, AC-61, run-lifecycle/ac-delta-1, run-lifecycle/ac-delta-14 |
| 11 | normal | run-lifecycle | [Launch a Copy of a finished run creates a duplicate run with a new Run ID @smoke](../../../../test-cases/manual-tests-execution/run-lifecycle/basic-relaunch.md) | AC-67, run-lifecycle/ac-delta-13 |
| 12 | normal | run-lifecycle | [Relaunch menu items appear only on finished runs — not on unfinished runs @negative](../../../../test-cases/manual-tests-execution/run-lifecycle/basic-relaunch.md) | run-lifecycle/ac-delta-8 |
| 13 | critical | run-lifecycle | [Relaunching a finished manual run re-opens the same Run ID in the Manual Runner @smoke](../../../../test-cases/manual-tests-execution/run-lifecycle/basic-relaunch.md) | AC-58, run-lifecycle/ac-delta-8 |
| 14 | low | run-lifecycle | ['Launch a Copy Manually' variant on a mixed run opens the duplicate in the Manual Runner @unclear](../../../../test-cases/manual-tests-execution/run-lifecycle/cross-cutting.md) | run-lifecycle/ac-delta-1 |
| 15 | high | run-lifecycle | [Finish on a multi-environment run terminates the expected scope and leaves other environment runs intact](../../../../test-cases/manual-tests-execution/run-lifecycle/cross-cutting.md) | run-lifecycle/ac-delta-8 |
| 16 | low | run-lifecycle | [Relaunch ${variant} on a finished ${run_type} run routes ${routing} @unclear](../../../../test-cases/manual-tests-execution/run-lifecycle/cross-cutting.md) | run-lifecycle/ac-delta-14, AC-59, AC-60, AC-61 |
| 17 | high | run-lifecycle | [Row extra-menu on ${run_state} runs exposes only ${available_items} lifecycle actions @boundary](../../../../test-cases/manual-tests-execution/run-lifecycle/cross-cutting.md) | run-lifecycle/ac-delta-8, AC-58, AC-67 |
| 18 | normal | run-lifecycle | [Edit is not available on a finished run @negative @unclear](../../../../test-cases/manual-tests-execution/run-lifecycle/edit-ongoing-run.md) | run-lifecycle/ac-delta-8 |
<!-- end-trace -->
