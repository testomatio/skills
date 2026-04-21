# UC-04: Finish a Run — QA Creator / Tester

<!-- use-case
id: UC-04
primary-actor: QA Creator
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** QA Creator (also performed by Tester who holds Execute permission).
**Stakeholders:** Manager / Owner (observes the transition); downstream consumers of the [Run Report](../03-glossary.md#run-report), TQL filters, and Combined Report ([UC-08](./UC-08-manage-rungroup.md), [UC-10](./UC-10-manage-runs-list.md), [UC-11](./UC-11-view-run-report.md)); Tests with *Pending* status at finish time (auto-marked Skipped per [BR-7](../07-business-rules.md#br-7)).
**Goal:** Close out an [In-Progress](../03-glossary.md#in-progress) [Run](../03-glossary.md#run) to the [Finished](../03-glossary.md#finished) terminal state so its results are available for reporting, comparison, archival, and Relaunch variants.
**Trigger:** Actor clicks **Finish Run** in the Manual Runner header, or **Continue** on a Pending/unfinished Run in the Runs list and then Finish.
**Scope:** `run-lifecycle` (owner). Touches `run-creation` (consumes Launched/Saved outputs from [UC-01](./UC-01-create-manual-run.md) / [UC-02](./UC-02-create-mixed-run.md)), `tester-assignment` (Edit-run may amend assignees — see [UC-06](./UC-06-assign-testers.md)), `environment-configuration` (Edit-run may amend environment — see [UC-07](./UC-07-configure-environments.md)), `runs-list-management` (Continue action is exposed from the list — [UC-10](./UC-10-manage-runs-list.md)).

## Preconditions

- Target Run is either **In-Progress** (the actor is executing in the runner) or **Pending** (Saved via [UC-01 A4](./UC-01-create-manual-run.md#a4-save-store-without-launching) and resumable via **Continue**).
- Actor holds Manage-Run permission (see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix)).
- The Run must not already be [Terminated](../03-glossary.md#terminated) (Terminated Runs cannot be resumed — [BR-8](../07-business-rules.md#br-8)).

## Main success scenario — Finish an In-Progress Run with some Pending tests

1. Actor is in the Manual Runner of an In-Progress Run with N tests Pending.
2. Actor clicks **Finish Run** in the runner header (AC-25).
3. System opens a confirmation dialog stating the count of not-run tests and announcing that they will be marked **Skipped** unless linked to another result (AC-28, `run-lifecycle-ac-delta.md` ac-delta-9).
4. Actor confirms.
5. System transitions the Run to **Finished** (AC-25), flips every Pending test to **Skipped** (AC-26, [BR-7](../07-business-rules.md#br-7)), navigates to the [Run Report](../03-glossary.md#run-report), and exposes Relaunch variants + Archive actions on the row extra menu going forward (see [UC-05](./UC-05-relaunch-run.md), [UC-12](./UC-12-archive-unarchive-purge.md)).

## Alternate flows

### A1: Continue a Pending Run, then Finish
**Replaces step 1.**
1. Run is in Pending state (created via **Save** in [UC-01 A4](./UC-01-create-manual-run.md#a4-save-store-without-launching)).
2. Actor clicks **Continue** in the Runs list row — System transitions the Run to In-Progress on first entry and navigates to `/projects/{p}/runs/launch/{id}/` (AC-24, ac-delta-7).
3. Flow continues at the main scenario step 2.

### A2: Edit an unfinished Run — `+ Tests`, `+ Plans`, remove test, amend metadata
**Branches before Finish; actor opens Edit Run from the runner header or the Runs list row.**
1. Edit sidebar exposes: Assign to, Title, Environment, Description, `+ Tests`, `+ Plans`, and per-test Trash icon (AC-27, ac-delta-3, ac-delta-4, ac-delta-5).
2. `+ Tests` appends selected tests to the Run without restarting it; added tests are Pending (ac-delta-3).
3. `+ Plans` appends a plan's tests; added tests are Pending (ac-delta-4).
4. Trash icon on a row removes that test; removal persists on Save (ac-delta-5).
5. **Save** commits; **Cancel** discards — no implicit save on navigation (ac-delta-6).
6. Flow continues to Finish (main scenario step 2).

### A3: Multi-environment Run — finish one env group at a time
**Applies when the Run spans ≥ 2 environment groups (see [UC-07](./UC-07-configure-environments.md) for configuration).**
1. Each env group runs its own lifecycle; Finish is applied per-group — see *Concern A* in [destructuring.md](../../../test-cases/manual-tests-execution/destructuring.md#cross-cutting-concerns).
2. The runner header exposes one Finish Run action per env; confirming Finish transitions only the active env's slice.
3. When the last env group finishes, the parent Run's consolidated state becomes Finished and the Report is served.

> **Note:** exact multi-env Finish affordance is unverified in the POC window — see [13-open-questions.md § OQ-13](../13-open-questions.md#oq-13).

### A4: Edit assignees / environment on an ongoing Run
1. Edit sidebar amends assignees (delegated to [UC-06](./UC-06-assign-testers.md)) or env groups (delegated to [UC-07](./UC-07-configure-environments.md)) without restarting the Run (AC-27; concern B and concern A).

## Exception flows

### E1: Cancel the Finish Run confirmation
1. Actor clicks Finish Run and the confirmation dialog appears.
2. Actor dismisses the dialog (Cancel / `Esc`).
3. System leaves the Run In-Progress; no status changes occur; the runner remains open (AC-28, ac-delta-10). This preserves [BR-7](../07-business-rules.md#br-7)'s invariant — Pending tests are only auto-Skipped on confirmed Finish.

### E2: Actor attempts to Finish a Terminated Run
1. Run was previously Terminated (e.g., by an admin via the runner's Terminate affordance — tracked in [13-open-questions.md § OQ-14](../13-open-questions.md#oq-14)).
2. System does not expose Finish Run on a Terminated Run — the runner is not reachable and the Run Report is served instead (`test-execution-runner-ac-delta.md` ac-delta-1). The `Terminated → In-Progress` transition is explicitly absent ([05-state-diagrams.md § Run](../05-state-diagrams.md#run), [BR-8](../07-business-rules.md#br-8)).

### E3: Server error on Finish commit
1. System fails to commit the transition (network, 4xx, 5xx).
2. Run stays In-Progress; the runner remains open; an error banner/toast surfaces inline. Actor may retry.

## Postconditions

- **Success:** Run state is **Finished**. Every previously Pending test is now Skipped ([BR-7](../07-business-rules.md#br-7), AC-26). Row extra menu now exposes Relaunch variants (AC-58..AC-62, ac-delta-8 — owned by [UC-05](./UC-05-relaunch-run.md)), Archive ([UC-12](./UC-12-archive-unarchive-purge.md)), and Export / Share entry points in the Report ([UC-11](./UC-11-view-run-report.md)).
- **Failure:** Run remains In-Progress (or Pending if A1 was interrupted). No test statuses are mutated.

## Business rules referenced

- [**BR-7**](../07-business-rules.md#br-7) — Finished Pending → Skipped transition.
- [**BR-8**](../07-business-rules.md#br-8) — Terminated Runs cannot resume.

## Functional requirements covered

- AC-23, AC-24, AC-25, AC-26, AC-27, AC-28.
- `run-lifecycle-ac-delta.md` ac-delta-3 (+ Tests), ac-delta-4 (+ Plans), ac-delta-5 (Trash delete), ac-delta-6 (Save/Cancel), ac-delta-7 (Continue visibility), ac-delta-9 (Finish dialog message), ac-delta-10 (Cancel Finish).

## Related use cases

- **[UC-01](./UC-01-create-manual-run.md)** / **[UC-02](./UC-02-create-mixed-run.md)** — upstream creation flows producing In-Progress / Pending Runs.
- **[UC-03](./UC-03-execute-test-in-runner.md)** — per-test execution inside the In-Progress Run.
- **[UC-05](./UC-05-relaunch-run.md)** — Relaunch variants consume the Finished state.
- **[UC-06](./UC-06-assign-testers.md)** — Edit-run assignee amendment.
- **[UC-07](./UC-07-configure-environments.md)** — Edit-run environment amendment + multi-env Finish semantics.
- **[UC-11](./UC-11-view-run-report.md)** — destination after Finish.
- **[UC-12](./UC-12-archive-unarchive-purge.md)** — Archive / Purge become actionable on Finished Runs.

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-04 -->
<!-- sources: AC-23, AC-24, AC-25, AC-26, AC-27, AC-28, run-lifecycle/ac-delta-3, run-lifecycle/ac-delta-4, run-lifecycle/ac-delta-5, run-lifecycle/ac-delta-6, run-lifecycle/ac-delta-7, run-lifecycle/ac-delta-9, run-lifecycle/ac-delta-10 -->
<!-- sub-feature: run-lifecycle -->

_19 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | normal | run-creation | [Double-clicking Launch creates only a single run @negative](../../../../test-cases/manual-tests-execution/run-creation/launch-and-save.md) | AC-23 |
| 2 | critical | run-creation | [Launch creates a run and navigates to the Manual Runner with the first test pre-opened @smoke](../../../../test-cases/manual-tests-execution/run-creation/launch-and-save.md) | AC-23 |
| 3 | critical | run-creation | ["All tests" is the default scope and Launch creates a run with every manual test @smoke](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | AC-23 |
| 4 | high | run-lifecycle | [Finish on a multi-environment run terminates the expected scope and leaves other environment runs intact](../../../../test-cases/manual-tests-execution/run-lifecycle/cross-cutting.md) | AC-25 |
| 5 | high | run-lifecycle | [Adding and removing testers on an ongoing run via Edit Run persists the assignee set](../../../../test-cases/manual-tests-execution/run-lifecycle/edit-ongoing-run.md) | AC-27, run-lifecycle/ac-delta-6 |
| 6 | normal | run-lifecycle | [Appending a plan via the `+ Plans` tab on an ongoing run adds the plan's tests as Pending](../../../../test-cases/manual-tests-execution/run-lifecycle/edit-ongoing-run.md) | AC-27, run-lifecycle/ac-delta-4 |
| 7 | high | run-lifecycle | [Appending tests via the `+ Tests` tab on an ongoing run adds them as Pending](../../../../test-cases/manual-tests-execution/run-lifecycle/edit-ongoing-run.md) | AC-27, run-lifecycle/ac-delta-3 |
| 8 | normal | run-lifecycle | [Cancelling the Edit Run form discards pending changes @negative](../../../../test-cases/manual-tests-execution/run-lifecycle/edit-ongoing-run.md) | run-lifecycle/ac-delta-6 |
| 9 | normal | run-lifecycle | [Edit is not available on a finished run @negative @unclear](../../../../test-cases/manual-tests-execution/run-lifecycle/edit-ongoing-run.md) | AC-27 |
| 10 | high | run-lifecycle | [Editing ${field} on an ongoing run via Save persists the change @smoke](../../../../test-cases/manual-tests-execution/run-lifecycle/edit-ongoing-run.md) | AC-27, run-lifecycle/ac-delta-6 |
| 11 | normal | run-lifecycle | [Removing a test from an ongoing run via the row trash icon persists the removal](../../../../test-cases/manual-tests-execution/run-lifecycle/edit-ongoing-run.md) | AC-27, run-lifecycle/ac-delta-5 |
| 12 | high | run-lifecycle | [Cancelling the Finish Run confirmation leaves the run ongoing @negative](../../../../test-cases/manual-tests-execution/run-lifecycle/finish-run.md) | AC-28, run-lifecycle/ac-delta-10 |
| 13 | critical | run-lifecycle | [Finish Run confirms and terminates the run, marking Pending tests as Skipped @smoke](../../../../test-cases/manual-tests-execution/run-lifecycle/finish-run.md) | AC-25, AC-26, AC-28, run-lifecycle/ac-delta-9 |
| 14 | normal | run-lifecycle | [Finish Run when every test already has a result still surfaces the confirmation with count 0 @boundary](../../../../test-cases/manual-tests-execution/run-lifecycle/finish-run.md) | AC-25, AC-28, run-lifecycle/ac-delta-9 |
| 15 | normal | run-lifecycle | [Continue and Edit are not available on a finished run @negative](../../../../test-cases/manual-tests-execution/run-lifecycle/launch-and-continue.md) | run-lifecycle/ac-delta-7, AC-27 |
| 16 | high | run-lifecycle | [Continue from the Run Detail panel resumes an unfinished run in the Manual Runner](../../../../test-cases/manual-tests-execution/run-lifecycle/launch-and-continue.md) | AC-24, run-lifecycle/ac-delta-7 |
| 17 | high | run-lifecycle | [Launching a new run transitions it to the in-progress state and opens the runner @smoke](../../../../test-cases/manual-tests-execution/run-lifecycle/launch-and-continue.md) | AC-23 |
| 18 | high | run-lifecycle | [Launching a previously saved Pending run transitions it to in-progress on first entry @boundary](../../../../test-cases/manual-tests-execution/run-lifecycle/launch-and-continue.md) | AC-23 |
| 19 | normal | run-lifecycle | [Resume an unfinished run from the Runs list row extra menu via the 'Launch' item](../../../../test-cases/manual-tests-execution/run-lifecycle/launch-and-continue.md) | AC-24, run-lifecycle/ac-delta-7 |
<!-- end-trace -->
