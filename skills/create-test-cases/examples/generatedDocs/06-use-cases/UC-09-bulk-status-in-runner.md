# UC-09: Apply bulk status in the Manual Runner — Tester

<!-- use-case
id: UC-09
primary-actor: Tester
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** Tester
**Stakeholders:** QA Creator / Manager (observes aggregate counters + result messages); [Custom Statuses](../03-glossary.md#custom-status) may not participate in bulk apply (to be verified in UI — [13-open-questions.md § OQ-18](../13-open-questions.md#oq-18)); downstream Report / RunGroup consumers (bulk updates reflect on the Report like single-test updates).
**Goal:** Mark a selection of tests in the [Manual Runner](../03-glossary.md#manual-runner) with a single standard status — PASSED / FAILED / SKIPPED — with an optional shared Result message, in one commit, so the Tester avoids repeating the single-test path per row.
**Trigger:** Tester activates **Multi-Select** in the Manual Runner header, selects ≥ 1 test, and chooses a bulk action from the bottom toolbar (**Result message** modal, or one of the **quick-set** PASSED / FAILED / SKIPPED buttons).
**Scope:** `bulk-status-actions` (owner). Touches `test-execution-runner` (shares the runner chrome — [UC-03](./UC-03-execute-test-in-runner.md)), `tester-assignment` (shares the Multi-Select bottom toolbar where *Assign to* lives — owned by [UC-06](./UC-06-assign-testers.md)), cross-cutting concern F (filter-applied scope, AC-66).

## Preconditions

- Target Run is [In-Progress](../03-glossary.md#in-progress) (runner is only reachable in this state, `test-execution-runner-ac-delta.md` ac-delta-1).
- Actor holds Execute-Run permission (see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix)).
- Run has ≥ 1 test (a *Without tests* Run has nothing to select).

## Main success scenario — bulk **Result message** → FAILED with a shared message

1. Tester opens the Manual Runner and toggles **Multi-Select** mode in the header.
2. System reveals per-test checkboxes in the tree; the single-test result entry stops being the primary affordance; the bulk-action bottom toolbar is **not yet rendered** (`bulk-status-actions-ac-delta.md` ac-delta-1, ac-delta-5).
3. Tester ticks checkboxes on several tests.
4. System renders the bulk-action bottom toolbar with a selection counter reflecting the tick count (ac-delta-4), and exposes: **Result message** (modal), **PASSED / FAILED / SKIPPED** quick-set buttons, **Assign to** (owned by [UC-06 A4](./UC-06-assign-testers.md#a4-per-test-assignment-via-multi-select-bulk)), **Clear-Selection ×** (ac-delta-11), **Create notes +** (owned by [UC-03 A4](./UC-03-execute-test-in-runner.md#a4-notes--test--suite--bulk--convert-to-test)).
5. Tester clicks **Result message** — System opens the Result Message modal with:
   - Status choice (PASSED / FAILED / SKIPPED).
   - Optional **Message** textarea.
   - Primary **Apply** (disabled until a status is picked — ac-delta-6).
6. Tester picks **FAILED**, types a message, clicks **Apply**.
7. System commits status + message to every selected test in one operation; the modal closes silently (no toast) (AC-94, ac-delta-6, ac-delta-8).
8. System updates the tree row icons for every affected test and increments / decrements the header status counters (Passed N / Failed N / Skipped N / Pending N) accordingly (AC-95, ac-delta-9).

## Alternate flows

### A1: Quick-set button with native confirm
1. Tester clicks the toolbar's **FAILED** (or PASSED / SKIPPED) quick-set button (ac-delta-10).
2. System shows a browser-native `confirm()` dialog: *"Are you sure to set status 'FAILED' for all selected tests?"*
3. On **Accept** — System applies FAILED to every selected test in one commit (no Result message); counters and row icons update (ac-delta-9).
4. On **Cancel** — Selection and state are untouched.

### A2: Select all (filter-aware)
1. Tester clicks **Select all** in Multi-Select mode.
2. System selects **every test currently visible** in the tree (ac-delta-3) — which equals every test when no filter is applied, or only the filter-matching subset when a filter is active (AC-66, concern F).
3. Subsequent bulk apply affects only the visible (possibly filtered) set — this is the runner-scope counterpart to [UC-05 A8 (Advanced Relaunch filter)](./UC-05-relaunch-run.md#a8-advanced-relaunch-with-a-filter-applied-selection-scope).

### A3: Dismiss the Result message modal without applying
1. Tester opens **Result message**, does not click Apply, and closes the modal (× / Esc).
2. System applies **no status change AND clears the current selection** — the bulk toolbar disappears together with the modal (ac-delta-7).

### A4: Clear-Selection × (keep Multi-Select mode)
1. Tester clicks the toolbar's **×** Clear-Selection affordance (ac-delta-11).
2. System clears every current selection and hides the toolbar; Multi-Select stays active (checkboxes remain visible; counter = 0).

### A5: Exit Multi-Select entirely
1. Tester toggles Multi-Select OFF, uses the Cancel affordance, or navigates away (ac-delta-2).
2. System clears any selections, hides the toolbar, and restores single-test result entry as the primary affordance.

## Exception flows

### E1: Zero selection — no toolbar
1. Tester enters Multi-Select but selects no tests.
2. System renders **no** bulk-action bottom toolbar — there is no empty-state toolbar and no affordance to trigger a bulk apply against an empty set (ac-delta-5).

### E2: Apply disabled until a status is picked
1. Tester opens **Result message**, types a message, and tries to click Apply without picking PASSED / FAILED / SKIPPED.
2. System keeps **Apply** disabled until a standard status is picked (ac-delta-6) — [BR-5](../07-business-rules.md#br-5) analogue for the bulk path.

### E3: Custom Status in bulk — UNCLEAR
1. Whether a Custom Status dropdown is exposed after standard status choice in the bulk modal (parallel to single-test AC-31) is **UNCLEAR** ([13-open-questions.md § OQ-18](../13-open-questions.md#oq-18)).
2. AC-31 is listed as *applicable* to this sub-feature but flagged for verification in UI. If absent, bulk apply cannot set a Custom Status and actors must fall back to single-test status entry.

## Postconditions

- **Success:** Every selected test carries the chosen standard status (PASSED / FAILED / SKIPPED) and, for the Result message path, the shared message string. Tree row icons update synchronously; Runner header counters reflect the delta. Run state is unchanged (still In-Progress — Finish Run is owned by [UC-04](./UC-04-finish-run.md)).
- **Failure / cancel:** No status or message change. Selection state depends on path — dismissing the Result message modal also clears selection (ac-delta-7); the × Clear-Selection path clears selection while keeping Multi-Select ON (ac-delta-11).

## Business rules referenced

- [**BR-5**](../07-business-rules.md#br-5) — analogue applies to bulk: standard status required before Apply / Custom Status.

## Functional requirements covered

- AC-29, AC-30, AC-31 (UNCLEAR — see E3), AC-66, AC-93, AC-94, AC-95.
- `bulk-status-actions-ac-delta.md` ac-delta-1..11.

## Related use cases

- **[UC-03](./UC-03-execute-test-in-runner.md)** — single-test runner flow; Multi-Select is its bulk variant (per concern H).
- **[UC-06](./UC-06-assign-testers.md)** — shares the same bottom toolbar (Assign-to action).
- **[UC-04](./UC-04-finish-run.md)** — destination after bulk apply (Finish Run).
- **[UC-05](./UC-05-relaunch-run.md)** — Advanced Relaunch filter-aware selection is the post-Finish counterpart (AC-66).

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-09 -->
<!-- sources: AC-29, AC-30, AC-31, AC-66, AC-93, AC-94, AC-95, bulk-status-actions/ac-delta-1, bulk-status-actions/ac-delta-2, bulk-status-actions/ac-delta-3, bulk-status-actions/ac-delta-4, bulk-status-actions/ac-delta-5, bulk-status-actions/ac-delta-6, bulk-status-actions/ac-delta-7, bulk-status-actions/ac-delta-8, bulk-status-actions/ac-delta-9, bulk-status-actions/ac-delta-10, bulk-status-actions/ac-delta-11 -->
<!-- sub-feature: bulk-status-actions -->

_23 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | critical | bulk-status-actions | [Bulk apply ${status} via the Result Message modal updates every selected test and header counters @smoke](../../../../test-cases/manual-tests-execution/bulk-status-actions/bulk-status-application.md) | AC-29, AC-94, AC-95, bulk-status-actions/ac-delta-6, bulk-status-actions/ac-delta-8, bulk-status-actions/ac-delta-9 |
| 2 | high | bulk-status-actions | [Bulk quick-set ${status} via the toolbar with native confirm Accept applies the status @smoke](../../../../test-cases/manual-tests-execution/bulk-status-actions/bulk-status-application.md) | AC-29, bulk-status-actions/ac-delta-10, bulk-status-actions/ac-delta-9 |
| 3 | low | bulk-status-actions | [Custom status dropdown appears in the bulk Result Message modal when custom statuses exist @unclear @needs-project-setting](../../../../test-cases/manual-tests-execution/bulk-status-actions/bulk-status-application.md) | AC-31, bulk-status-actions/ac-delta-6 |
| 4 | normal | bulk-status-actions | [Dismissing the quick-set native confirm dialog leaves all test statuses unchanged @negative](../../../../test-cases/manual-tests-execution/bulk-status-actions/bulk-status-application.md) | bulk-status-actions/ac-delta-10 |
| 5 | normal | bulk-status-actions | [Dismissing the Result Message modal via ${dismiss_method} clears the selection without applying a status @negative](../../../../test-cases/manual-tests-execution/bulk-status-actions/bulk-status-application.md) | bulk-status-actions/ac-delta-7 |
| 6 | high | bulk-status-actions | [Result Message modal Apply button stays disabled until a status is selected @negative](../../../../test-cases/manual-tests-execution/bulk-status-actions/bulk-status-application.md) | bulk-status-actions/ac-delta-6 |
| 7 | high | bulk-status-actions | [Bulk apply with a message persists the status and the message together](../../../../test-cases/manual-tests-execution/bulk-status-actions/cross-cutting.md) | AC-30, AC-93, AC-94, bulk-status-actions/ac-delta-6, bulk-status-actions/ac-delta-8 |
| 8 | critical | bulk-status-actions | [Bulk Result Message apply with a status filter active affects only filter-matching tests @boundary](../../../../test-cases/manual-tests-execution/bulk-status-actions/cross-cutting.md) | AC-66, AC-94, AC-95, bulk-status-actions/ac-delta-6, bulk-status-actions/ac-delta-8, bulk-status-actions/ac-delta-9 |
| 9 | normal | bulk-status-actions | [Suite-level checkbox with a status filter active selects only filter-matching tests @boundary](../../../../test-cases/manual-tests-execution/bulk-status-actions/cross-cutting.md) | AC-66, bulk-status-actions/ac-delta-3 |
| 10 | high | bulk-status-actions | [Activate Multi-Select mode reveals per-test checkboxes @smoke](../../../../test-cases/manual-tests-execution/bulk-status-actions/multi-select-mode.md) | bulk-status-actions/ac-delta-1, bulk-status-actions/ac-delta-4 |
| 11 | normal | bulk-status-actions | [Clearing the selection keeps Multi-Select mode active with an empty selection @boundary](../../../../test-cases/manual-tests-execution/bulk-status-actions/multi-select-mode.md) | bulk-status-actions/ac-delta-11 |
| 12 | high | bulk-status-actions | [Toggling Multi-Select off clears the selection and hides the bulk toolbar](../../../../test-cases/manual-tests-execution/bulk-status-actions/multi-select-mode.md) | bulk-status-actions/ac-delta-2 |
| 13 | normal | bulk-status-actions | [Bulk-action toolbar is not rendered when no tests are selected @boundary](../../../../test-cases/manual-tests-execution/bulk-status-actions/selection-mechanics.md) | bulk-status-actions/ac-delta-5 |
| 14 | normal | bulk-status-actions | [Per-test checkboxes update the selection counter as they toggle](../../../../test-cases/manual-tests-execution/bulk-status-actions/selection-mechanics.md) | bulk-status-actions/ac-delta-4 |
| 15 | normal | bulk-status-actions | [Suite-level checkbox selects every test in the suite](../../../../test-cases/manual-tests-execution/bulk-status-actions/selection-mechanics.md) | bulk-status-actions/ac-delta-3 |
| 16 | normal | run-lifecycle | ['Select all' inside Advanced Relaunch respects an active status filter](../../../../test-cases/manual-tests-execution/run-lifecycle/advanced-relaunch.md) | AC-66 |
| 17 | normal | test-execution-runner | [Custom sub-status counter impact is visible in the runner header (cross-cut E)](../../../../test-cases/manual-tests-execution/test-execution-runner/cross-cutting.md) | AC-31 |
| 18 | critical | test-execution-runner | [Apply standard status ${status} to a pending test @smoke](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-29 |
| 19 | high | test-execution-runner | [Applying a custom sub-status to ${standard_status} keeps the standard status selected](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-31 |
| 20 | high | test-execution-runner | [Custom sub-status dropdown is disabled before a standard status is chosen @negative](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-31 |
| 21 | high | test-execution-runner | [Result message is editable only after a standard status is selected @negative](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-30 |
| 22 | high | test-execution-runner | [Result message persists after navigating to another test and back](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-30 |
| 23 | normal | test-execution-runner | [Switching status from Passed to Failed updates the header counters accordingly @boundary](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-29, AC-30 |
<!-- end-trace -->
