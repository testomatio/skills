# UC-06: Assign testers to a Run, a suite, or a test — QA Creator

<!-- use-case
id: UC-06
primary-actor: QA Creator
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** QA Creator (also performed by Manager / Owner; Tester holds only read affordances on the assignee chip — see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix)).
**Stakeholders:** Tester (receives assignments and executes); Project (supplies role data — the manager exclusion in random distribution relies on the manager role per project); [Manual Runner](../03-glossary.md#manual-runner) and Runs list / Report readers (consume assignee rendering).
**Goal:** Establish who is responsible for executing which tests within a Run — at Run level (prerequisite for finer granularity per [BR-6](../07-business-rules.md#br-6)), at suite level, and at test level (individually or in bulk).
**Trigger:** Actor opens the **Assign more users** link in the New Manual Run sidebar, the Edit Run **Assign users** multi-select, or the Manual Runner's per-suite / per-test / Multi-Select **Assign to** affordances.
**Scope:** `tester-assignment` (owner — cross-cutting concern B and affects concern H for bulk assign). Touches `run-creation` (sidebar exposes the entry point — [UC-01](./UC-01-create-manual-run.md)), `run-lifecycle` (Edit-run surface — [UC-04](./UC-04-finish-run.md)), `test-execution-runner` (per-suite / per-test affordances render in the runner but assignment UX is owned here — [UC-03](./UC-03-execute-test-in-runner.md)), `bulk-status-actions` (shares the Multi-Select bottom toolbar with a distinct *Assign to* action — [UC-09](./UC-09-bulk-status-in-runner.md)).

## Preconditions

- Target Run exists (from [UC-01](./UC-01-create-manual-run.md) / [UC-02](./UC-02-create-mixed-run.md)) or is being created (assign-at-creation path).
- Actor holds Manage-Run permission (see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix); readonly / some paths are tracked in [AC-100 UNCLEAR](../../../test-cases/manual-tests-execution/tester-assignment-ac-delta.md)).
- Project has ≥ 1 additional member for multi-user assignment (otherwise only the creator manager chip is shown, AC-37).
- For per-suite / per-test assignment: target users **must already be assigned to the Run** (AC-41, [BR-6](../07-business-rules.md#br-6)).

## Main success scenario — add two testers at creation time

1. Actor opens the New Manual Run sidebar ([UC-01](./UC-01-create-manual-run.md) main flow).
2. Assignee section shows the creator chip labeled `as manager` — unremovable from this surface (AC-37, `tester-assignment-ac-delta.md` ac-delta-1).
3. Actor clicks **Assign more users** — System opens the Assignee panel with:
   - **Assign users** — multi-select populated from project membership.
   - **Auto-Assign Users** strategy selector — options: `None`, `Prefer test assignee`, `Randomly distribute tests between team members`; default `None` (AC-39, ac-delta-2, ac-delta-3).
4. Actor picks two users. Strategy stays `None`.
5. Actor clicks **Launch** (or proceeds into [UC-01](./UC-01-create-manual-run.md) main steps 6–8).
6. System creates the Run with three assignees — the creator (manager) and the two added users; tests are unassigned at test-level until further action (AC-41).

## Alternate flows

### A1: Auto-Assign — `Prefer test assignee`
**Branches at step 4.**
1. Actor picks the `Prefer test assignee` strategy (AC-39).
2. On Launch, tests whose pre-set assignee is one of the Run's assigned users are given to that user; tests without a pre-set assignee fall back to **unassigned** (or to the manager — **UNCLEAR**, see [13-open-questions.md § OQ-08](../13-open-questions.md#oq-08); ac-delta-4).

### A2: Auto-Assign — `Randomly distribute tests between team members`
1. Actor picks the random-distribute strategy.
2. On Launch, every **non-manager** assigned user receives a share of the Run's tests; the distribution is deterministic at launch (no re-shuffle on refresh, ac-delta-5).
3. **Manager exclusion** ([BR-5](../07-business-rules.md#br-5) analogue — actually [BR-6a](../07-business-rules.md#br-6a) below): the manager role is skipped; if the only assigned user *is* a manager, no tests are auto-assigned and the per-test assignee column shows an empty/"—" state without surfacing an error (AC-40, ac-delta-11).

### A3: Per-suite assignment inside the Runner
**Applies on an In-Progress Run.**
1. Actor hovers a suite row in the Runner tree and clicks the **Assign to** icon (AC-42).
2. System opens a user dropdown **limited to users already assigned to the Run** (ac-delta-8, enforcement of [BR-6](../07-business-rules.md#br-6)).
3. Actor picks a user — System applies the assignment to every test within the suite; per-test assignee avatars update (ac-delta-22 of test-execution-runner).

### A4: Per-test assignment via Multi-Select (bulk)
1. Actor enters Multi-Select mode in the Runner and selects ≥ 1 test.
2. Actor clicks **Assign to** in the bulk-action bottom toolbar (AC-43, ac-delta-9).
3. System opens a user dropdown limited to Run-assigned users and a confirmation dialog ("Are you sure you want to assign …").
4. Actor confirms — System applies the user to every selected test in one operation; per-test column updates immediately (ac-delta-10).
5. When a filter is active in the Runner, only filter-matching tests are affected (AC-66, concern F — shared with [UC-09](./UC-09-bulk-status-in-runner.md)).

### A5: Per-test reassignment via the detail pane (no confirmation)
1. Inside the Runner, Actor clicks the per-test **Assignee chip** in the detail pane.
2. System opens a dropdown limited to Run-assigned users plus `Unassigned`.
3. Actor picks a user — change is applied **immediately, without a confirmation dialog** (ac-delta-13 — contrast with A4).

### A6: Edit an ongoing Run — amend assignees
1. Actor opens Edit Run (per [UC-04 A2](./UC-04-finish-run.md#a2-edit-an-unfinished-run-tests--plans-remove-test-amend-metadata)).
2. Assign users multi-select and `Remove assign users` are available; `Select All` convenience button bulk-adds every project member without confirmation (ac-delta-13, ac-delta-7).
3. Actor adds / removes users and clicks **Save** — assignment changes propagate inside the Runner without a full reload (ac-delta-7).
4. Removing a user who has already recorded results prompts a confirmation (ac-delta-6; exact copy **UNCLEAR** — see [13-open-questions.md § OQ-09](../13-open-questions.md#oq-09)).

### A7: Read-only surfaces
1. The Runs list **Assigned to** column and the Extended Run Report **Assignees** overview render assignee state (ac-delta-12). Rendering is owned by [UC-10](./UC-10-manage-runs-list.md) / [UC-11](./UC-11-view-run-report.md) respectively.

## Exception flows

### E1: Attempt per-suite / per-test assign for a non-Run user
1. Actor tries to assign a user who is not on the Run.
2. System does not present them in the dropdown (ac-delta-8, ac-delta-9). There is no affordance to bypass — the prerequisite is enforced at UI level per [BR-6](../07-business-rules.md#br-6). This is not surfaced as an explicit error.

### E2: Random-distribute with only a manager assigned
1. Actor picks `Randomly distribute` strategy with only a manager-role user assigned.
2. System launches the Run with zero per-test auto-assignments (ac-delta-11); no error is shown. Per [BR-6a](../07-business-rules.md#br-6a), the manager exclusion is by design; the resulting empty state is not an error.

### E3: Remove a user who has logged results
1. Actor removes the user via Edit Run.
2. System prompts a confirmation (ac-delta-6). On confirm, the user is removed from all per-suite / per-test assignments within the Run; recorded results are retained (attributed state — see [13-open-questions.md § OQ-09](../13-open-questions.md#oq-09)).

## Postconditions

- **Success (Run-level assignment):** Run has ≥ 1 additional assignee beyond the manager chip; users are selectable in downstream per-suite / per-test assignment dropdowns ([BR-6](../07-business-rules.md#br-6)).
- **Success (per-suite / per-test):** Targeted tests carry the new assignee; the Runner tree and Runs list `Assigned to` column (ac-delta-12) reflect the change.
- **Success (Auto-Assign):** Tests are distributed per strategy at Launch; state is deterministic and visible in the Runner and Report.
- **Failure:** No assignee changes persist. For Auto-Assign variants, no partial distribution occurs (commit is atomic at Launch).

## Business rules referenced

- [**BR-6**](../07-business-rules.md#br-6) — Run-assignment prerequisite for per-suite / per-test assignment (AC-41).
- [**BR-6a**](../07-business-rules.md#br-6a) — Manager-role exclusion from random distribution (AC-40).

## Functional requirements covered

- AC-37, AC-38, AC-39, AC-40, AC-41, AC-42, AC-43.
- `tester-assignment-ac-delta.md` ac-delta-1..13.

## Related use cases

- **[UC-01](./UC-01-create-manual-run.md)** — entry point `Assign more users` during creation.
- **[UC-04](./UC-04-finish-run.md)** — Edit-run surfaces assignee amendment on ongoing Runs.
- **[UC-03](./UC-03-execute-test-in-runner.md)** — Runner renders per-suite / per-test affordances whose UX is owned here.
- **[UC-09](./UC-09-bulk-status-in-runner.md)** — shares the Multi-Select bottom toolbar.
- **[UC-10](./UC-10-manage-runs-list.md)** / **[UC-11](./UC-11-view-run-report.md)** — read-only assignee rendering.

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-06 -->
<!-- sources: AC-37, AC-38, AC-39, AC-40, AC-41, AC-42, AC-43, AC-66, tester-assignment/ac-delta-1, tester-assignment/ac-delta-2, tester-assignment/ac-delta-3, tester-assignment/ac-delta-4, tester-assignment/ac-delta-5, tester-assignment/ac-delta-6, tester-assignment/ac-delta-7, tester-assignment/ac-delta-8, tester-assignment/ac-delta-9, tester-assignment/ac-delta-10, tester-assignment/ac-delta-11, tester-assignment/ac-delta-12, tester-assignment/ac-delta-13 -->
<!-- sub-feature: tester-assignment -->

_39 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | critical | bulk-status-actions | [Bulk Result Message apply with a status filter active affects only filter-matching tests @boundary](../../../../test-cases/manual-tests-execution/bulk-status-actions/cross-cutting.md) | AC-66 |
| 2 | normal | bulk-status-actions | [Suite-level checkbox with a status filter active selects only filter-matching tests @boundary](../../../../test-cases/manual-tests-execution/bulk-status-actions/cross-cutting.md) | AC-66 |
| 3 | normal | run-creation | [Cancelling the Assign more users panel reverts the assignee section to creator-only @negative](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | AC-38 |
| 4 | normal | run-creation | [Create a run with multiple testers assigned via "Assign more users"](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | AC-38 |
| 5 | normal | run-creation | [Assignee section shows the creator with "as manager" label by default](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-37 |
| 6 | normal | run-lifecycle | ['Select all' inside Advanced Relaunch respects an active status filter](../../../../test-cases/manual-tests-execution/run-lifecycle/advanced-relaunch.md) | AC-66 |
| 7 | high | tester-assignment | [Auto-Assign defaults to None and leaves all tests unassigned after Launch @smoke](../../../../test-cases/manual-tests-execution/tester-assignment/auto-assign-strategies.md) | AC-39, tester-assignment/ac-delta-3 |
| 8 | high | tester-assignment | [Auto-Assign strategy ${strategy} produces ${expected_distribution} after Launch](../../../../test-cases/manual-tests-execution/tester-assignment/auto-assign-strategies.md) | AC-39, AC-40, tester-assignment/ac-delta-4, tester-assignment/ac-delta-5, tester-assignment/ac-delta-11 |
| 9 | normal | tester-assignment | [Prefer test assignee fallback for tests without a pre-set assignee is recorded @unclear @boundary](../../../../test-cases/manual-tests-execution/tester-assignment/auto-assign-strategies.md) | AC-39, tester-assignment/ac-delta-4 |
| 10 | normal | tester-assignment | [Randomly distribute outcome is deterministic after Launch](../../../../test-cases/manual-tests-execution/tester-assignment/auto-assign-strategies.md) | tester-assignment/ac-delta-5 |
| 11 | normal | tester-assignment | [Randomly distribute with a single non-manager user assigns every test to that user @boundary](../../../../test-cases/manual-tests-execution/tester-assignment/auto-assign-strategies.md) | AC-39, tester-assignment/ac-delta-5 |
| 12 | high | tester-assignment | [Randomly distribute with only a manager attached leaves every test unassigned @boundary @negative](../../../../test-cases/manual-tests-execution/tester-assignment/auto-assign-strategies.md) | AC-40, tester-assignment/ac-delta-5, tester-assignment/ac-delta-11 |
| 13 | normal | tester-assignment | [Switching strategy then dismissing the sidebar discards the selection @negative](../../../../test-cases/manual-tests-execution/tester-assignment/auto-assign-strategies.md) | tester-assignment/ac-delta-3 |
| 14 | normal | tester-assignment | [Add a user via ${add_method} to the Assign users multi-select](../../../../test-cases/manual-tests-execution/tester-assignment/creation-dialog-assignment.md) | AC-38, tester-assignment/ac-delta-2 |
| 15 | high | tester-assignment | [Adding the first user reveals Auto-Assign selector and propagates the assignee on Launch @smoke](../../../../test-cases/manual-tests-execution/tester-assignment/creation-dialog-assignment.md) | AC-38, tester-assignment/ac-delta-2, tester-assignment/ac-delta-3, tester-assignment/ac-delta-12 |
| 16 | low | tester-assignment | [Creator manager chip has no remove control and cannot be cleared from the sidebar @negative](../../../../test-cases/manual-tests-execution/tester-assignment/creation-dialog-assignment.md) | AC-37, tester-assignment/ac-delta-1 |
| 17 | normal | tester-assignment | [Dismiss the sidebar via ${dismiss_method} after editing assignees discards the pending state @negative](../../../../test-cases/manual-tests-execution/tester-assignment/creation-dialog-assignment.md) | tester-assignment/ac-delta-2, tester-assignment/ac-delta-3 |
| 18 | critical | tester-assignment | [Opening the New Manual Run sidebar shows the creator as manager with the Assign more users entry point @smoke](../../../../test-cases/manual-tests-execution/tester-assignment/creation-dialog-assignment.md) | AC-37, tester-assignment/ac-delta-1, tester-assignment/ac-delta-2 |
| 19 | normal | tester-assignment | [Remove an added user via the chip × before Launch keeps them off the new run @negative](../../../../test-cases/manual-tests-execution/tester-assignment/creation-dialog-assignment.md) | tester-assignment/ac-delta-2, tester-assignment/ac-delta-12 |
| 20 | critical | tester-assignment | [Concern B — multi-user assignment propagates from creation through runner to runs list @smoke](../../../../test-cases/manual-tests-execution/tester-assignment/cross-cutting.md) | AC-38, AC-39, AC-40, tester-assignment/ac-delta-5, tester-assignment/ac-delta-12 |
| 21 | normal | tester-assignment | [Concern B × permissions — a qa-role run-assignee can use Assign to controls end-to-end](../../../../test-cases/manual-tests-execution/tester-assignment/cross-cutting.md) | AC-42, AC-43 |
| 22 | high | tester-assignment | [Concern H × F — bulk Assign to in runner respects the active filter @negative @boundary](../../../../test-cases/manual-tests-execution/tester-assignment/cross-cutting.md) | AC-43, tester-assignment/ac-delta-10 |
| 23 | critical | tester-assignment | [Adding a user on Edit Run propagates to the ongoing runner Assign to dropdowns @smoke](../../../../test-cases/manual-tests-execution/tester-assignment/edit-run-assignment.md) | AC-38, AC-41, tester-assignment/ac-delta-7, tester-assignment/ac-delta-8 |
| 24 | normal | tester-assignment | [Cancel on Edit Run after modifying assignees discards the pending state @negative](../../../../test-cases/manual-tests-execution/tester-assignment/edit-run-assignment.md) | tester-assignment/ac-delta-7 |
| 25 | normal | tester-assignment | [Manager chip on Edit Run cannot be removed by any control @negative](../../../../test-cases/manual-tests-execution/tester-assignment/edit-run-assignment.md) | AC-37, tester-assignment/ac-delta-1 |
| 26 | normal | tester-assignment | [Remove ${remove_scope} via ${remove_method} on Edit Run updates chips immediately](../../../../test-cases/manual-tests-execution/tester-assignment/edit-run-assignment.md) | tester-assignment/ac-delta-6, tester-assignment/ac-delta-7, tester-assignment/ac-delta-13 |
| 27 | normal | tester-assignment | [Removing a user who has recorded results surfaces the confirmation flow @unclear](../../../../test-cases/manual-tests-execution/tester-assignment/edit-run-assignment.md) | tester-assignment/ac-delta-6 |
| 28 | normal | tester-assignment | [Save on Edit Run with all non-managers removed keeps the run with the manager only @boundary](../../../../test-cases/manual-tests-execution/tester-assignment/edit-run-assignment.md) | AC-37, tester-assignment/ac-delta-7, tester-assignment/ac-delta-11 |
| 29 | normal | tester-assignment | [Select All on Edit Run adds every project member to Assign users in one click](../../../../test-cases/manual-tests-execution/tester-assignment/edit-run-assignment.md) | tester-assignment/ac-delta-13 |
| 30 | normal | tester-assignment | [Detail-panel Assignee chip single-click assigns a test without a confirmation](../../../../test-cases/manual-tests-execution/tester-assignment/runner-assignment-paths.md) | tester-assignment/ac-delta-13 |
| 31 | normal | tester-assignment | [Detail-panel Assignee dropdown lists only run-assigned users plus Unassigned](../../../../test-cases/manual-tests-execution/tester-assignment/runner-assignment-paths.md) | AC-41, tester-assignment/ac-delta-13 |
| 32 | high | tester-assignment | [Multi-Select bulk Assign to → Cancel on the native confirm leaves tests unchanged @negative](../../../../test-cases/manual-tests-execution/tester-assignment/runner-assignment-paths.md) | AC-43, tester-assignment/ac-delta-9 |
| 33 | critical | tester-assignment | [Multi-Select bulk Assign to applies to every selected test after OK on the native confirm @smoke](../../../../test-cases/manual-tests-execution/tester-assignment/runner-assignment-paths.md) | AC-43, tester-assignment/ac-delta-9, tester-assignment/ac-delta-10 |
| 34 | normal | tester-assignment | [Multi-Select bulk Assign to with exactly one test selected still applies the assignment @boundary](../../../../test-cases/manual-tests-execution/tester-assignment/runner-assignment-paths.md) | AC-43, tester-assignment/ac-delta-10 |
| 35 | normal | tester-assignment | [Multi-Select bulk Assign to with zero tests selected does not open a confirm @negative @boundary](../../../../test-cases/manual-tests-execution/tester-assignment/runner-assignment-paths.md) | AC-43, tester-assignment/ac-delta-9 |
| 36 | normal | tester-assignment | [Reassign an assigned test to Unassigned via detail-panel chip clears all indicators @boundary](../../../../test-cases/manual-tests-execution/tester-assignment/runner-assignment-paths.md) | tester-assignment/ac-delta-13 |
| 37 | low | tester-assignment | [Run header avatar stack reflects all run-assigned users with tooltips](../../../../test-cases/manual-tests-execution/tester-assignment/runner-assignment-paths.md) | AC-38 |
| 38 | high | tester-assignment | [Suite Assign to dropdown excludes non-run project members @negative](../../../../test-cases/manual-tests-execution/tester-assignment/runner-assignment-paths.md) | AC-41, tester-assignment/ac-delta-8 |
| 39 | critical | tester-assignment | [Suite Assign to dropdown lists Unassigned and run-assigned users only @smoke](../../../../test-cases/manual-tests-execution/tester-assignment/runner-assignment-paths.md) | AC-41, AC-42, tester-assignment/ac-delta-8 |
<!-- end-trace -->
