# UC-03: Execute a test in the Manual Runner — Tester

<!-- use-case
id: UC-03
primary-actor: Tester
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** Tester
**Stakeholders:** QA Creator / Manager (observes results and progress); Project (consumes [Custom Statuses](../03-glossary.md#custom-status) configured at project scope); other assigned testers (share the same runner tree, see per-test assignee chips).
**Goal:** Record a pass/fail/skip outcome for a test inside an ongoing [Run](../03-glossary.md#run), optionally enriched with result message, attachments, step-by-step markings, notes, time tracking, and a [Custom Status](../03-glossary.md#custom-status).
**Trigger:** Tester opens the [Manual Runner](../03-glossary.md#manual-runner) for an [In-Progress](../03-glossary.md#in-progress) Run — either from **Launch**/**Continue** in the Runs list, or from a direct deep link `/projects/{p}/runs/launch/{id}/?entry={testId}`.
**Scope:** `test-execution-runner` (owner). Touches `bulk-status-actions` (Multi-Select mode — variant flow moves to [UC-09](./UC-09-bulk-status-in-runner.md)), `tester-assignment` (per-test assignee chip rendering only — assignment UX owned by [UC-06](./UC-06-assign-testers.md)), `run-lifecycle` (runner is only reachable for In-Progress Runs — state gating).

## Preconditions

- Actor holds Execute-Run permission on the target project (see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix)).
- The target Run is in the [In-Progress](../03-glossary.md#in-progress) state — [Finished](../03-glossary.md#finished) and [Terminated](../03-glossary.md#terminated) Runs open the [Run Report](../03-glossary.md#run-report) instead (`test-execution-runner-ac-delta.md` ac-delta-1; owner of the state transition is [UC-04](./UC-04-finish-run.md)).
- The Run contains at least one test — an empty *Without tests* Run opens the runner shell with no test pre-selected ([BR-2](../07-business-rules.md#br-2)).
- Actor is assigned to the Run, or can execute as the Run's manager (permission semantics noted in [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix) — self-assignment in the runner is covered in A7).

## Main success scenario — record a PASSED result with a message

1. Tester opens the Manual Runner for an In-Progress Run and the first test is pre-selected in the detail pane (ac-delta-1, ac-delta-2).
2. System renders the runner layout:
   - **Left:** tests tree grouped by suite, with status icons, labels / tags chips, priority markers, and per-test assignee avatars (ac-delta-22).
   - **Right:** detail pane with Title, Description (hidden when the Run is a [Checklist](../03-glossary.md#run-as-checklist), see A5), Steps, Attachments, Result message field, standard-status buttons (PASSED / FAILED / SKIPPED), optional [Custom Status](../03-glossary.md#custom-status) dropdown (disabled until a standard status is chosen, ac-delta-21, AC-31), Notes area, and Extra menu (AC-29, AC-30, ac-delta-2).
   - **Header:** status counters (Passed / Failed / Skipped / Pending / Custom), search + Priority filter (ac-delta-17), Multi-Select toggle, Extra options dots (ac-delta-16), Finish Run button.
3. Tester types a Result message into the message field (ac-delta-3).
4. Tester clicks **PASSED** (AC-29).
5. System commits the status, increments the *Passed N* counter, updates the tests-tree row icon, and keeps the detail pane focused on the test (AC-29, AC-30).
6. Tester presses the arrow key (↓) or clicks the next test row — System advances selection to the next test matching the current filter scope (ac-delta-18).

## Alternate flows

### A1: FAILED with attachment + Custom Status
**Branches at step 4.**
1. Tester clicks **FAILED** (AC-29).
2. Tester drags a screenshot into the Attachments drop zone (ac-delta-4) — System stores it and renders a thumbnail. Tester may toggle the attachment view between Large / Small Thumbnail / Grid / List (AC-32, ac-delta-5) and open the attachment in **Fit to width** or **Full screen** (AC-33, ac-delta-6).
3. Tester chooses a Custom Status (e.g., `Blocked`) from the dropdown, which is now enabled (AC-31, ac-delta-21).
4. System records standard=FAILED + custom=Blocked, increments both standard and custom counters, and updates the test row with both icons.

### A2: Step-by-step marking
**Extends the detail pane at step 2/3.**
1. Tester clicks a Step to mark it **Passed** (single-click → green), double-clicks a Step to mark it **Failed** (red), or triple-clicks to mark it **Skipped** (grey) (AC-35, ac-delta-8).
2. System records step results alongside the test result; the markings survive navigation away and return (AC-36, ac-delta-9).

### A3: Delete an attachment
**Extends A1 step 2 after upload.**
1. Tester clicks the trash icon on the attachment.
2. System prompts *"Are you sure?"* (AC-34, ac-delta-7).
3. Tester confirms — System removes the attachment. On cancel, the attachment is preserved.

### A4: Notes — test / suite / bulk / convert-to-test
1. Tester clicks **Create notes +** on the selected test and enters note text — System attaches the note to the test; it is visible on re-entry (ac-delta-10).
2. On a suite header, Tester uses **Add note to suite** — System attaches the note to the suite context (ac-delta-11).
3. Tester opens a note's context action and chooses **Convert to Test** — System creates a new test under the parent suite and the tree refreshes (ac-delta-12).
4. In [Multi-Select](../03-glossary.md#multi-select) mode, Tester selects several tests and invokes **Create notes +** — System attaches the same note body to every selected test (ac-delta-13).

### A5: Run as Checklist — description hidden
**Applies when the Run was created with the [Run as Checklist](../03-glossary.md#run-as-checklist) toggle ON (AC-96).**
1. The Description area is hidden by default for every test.
2. Tester opens the per-test Extra menu and clicks **Toggle Description** (ac-delta-15) — System reveals the description for that test; a subsequent click hides it again.
3. Per-test description visibility is local — other tests remain in their default hidden state.

### A6: Filter + Priority narrow the tree
1. Tester applies a status filter (e.g., `Pending only`), a search string, or a Priority chip (Low / Normal / High / Critical, ac-delta-17).
2. System restricts the tree to matching tests; ↑/↓ navigation scopes to matching tests only (ac-delta-18). This shapes the [selection-scope](../03-glossary.md#filter-applied-scope) used by bulk actions in [UC-09](./UC-09-bulk-status-in-runner.md).

### A7: Time tracking — Auto-Track vs Set Time
1. Tester enables **Auto-Track** — System starts a stopwatch when the test is opened and stops on navigate-away or status apply; the elapsed duration is stored on the result (ac-delta-19).
2. Alternatively, Tester opens **Set Time** and enters an explicit `hh:mm:ss`; the manual value replaces the auto-tracked value (ac-delta-20).

### A8: Extra options toggles (tree rendering)
1. Tester opens the runner header's Extra options menu (dots icon, ac-delta-16).
2. System exposes four toggles: **Refresh structure** (reloads the tree), **Show/Hide Creation Buttons**, **Show/Hide Labels**, **Show/Hide Tags**. Each updates the tree immediately.

### A9: Resize the detail pane
1. Tester drags the horizontal divider between description and result area (ac-delta-14).
2. System persists the resized height for the current session.

### A10: Fast Forward
1. Tester looks for a **Fast Forward** control to auto-advance through pending tests (AC-97).
2. **Behaviour unverified in the POC window** — see [13-open-questions.md § OQ-11](../13-open-questions.md#oq-11). Captured as [AC-97 UNCLEAR](../../../test-cases/manual-tests-execution/test-execution-runner-ac-delta.md).

## Exception flows

### E1: Run is not In-Progress
1. Tester opens a deep link to a [Finished](../03-glossary.md#finished) or [Terminated](../03-glossary.md#terminated) Run.
2. System opens the [Run Report](../03-glossary.md#run-report) (see [UC-11](./UC-11-view-run-report.md)) instead of the runner — the runner is gated on run state (ac-delta-1). No error is shown.

### E2: Custom Status picked without a standard status
1. Tester attempts to open the Custom Status dropdown before clicking PASSED / FAILED / SKIPPED.
2. System keeps the dropdown disabled (ac-delta-21, AC-31) — no implicit standard status is inferred. This is enforced by [BR-5](../07-business-rules.md#br-5).

### E3: Attachment upload failure
1. Tester drags a file whose size / type is rejected (exact limits unverified in POC — tracked in [13-open-questions.md § OQ-12](../13-open-questions.md#oq-12)).
2. System surfaces an inline failure indicator; previously-uploaded attachments are preserved.

## Postconditions

- **Success:** The selected test's stored result is PASSED / FAILED / SKIPPED (plus optional Custom Status, Result message, attachments, step markings, time, notes). Runner counters reflect the change; the tree row icon updates synchronously. Run state remains [In-Progress](../03-glossary.md#in-progress) (no auto-finish on last test — **Finish Run** is an explicit action owned by [UC-04](./UC-04-finish-run.md)).
- **Failure:** No status is recorded; detail pane remains editable. Attachments / notes may be partially persisted (per-call atomicity — see [13-open-questions.md § OQ-12](../13-open-questions.md#oq-12)).

## Business rules referenced

- [**BR-5**](../07-business-rules.md#br-5) — Custom Status requires a standard status first.
- [**BR-2**](../07-business-rules.md#br-2) — Empty Runs open the runner shell without a pre-selected test (inherits from UC-01 creation).

## Functional requirements covered

- AC-29, AC-30, AC-31, AC-32, AC-33, AC-34, AC-35, AC-36, AC-96, AC-97.
- `test-execution-runner-ac-delta.md` ac-delta-1..22.

## Related use cases

- **[UC-01](./UC-01-create-manual-run.md)** — owns the *Run as Checklist* toggle surfaced as A5 here.
- **[UC-04](./UC-04-finish-run.md)** — Finish Run closes out the In-Progress state.
- **[UC-06](./UC-06-assign-testers.md)** — owns per-test / per-suite assignment; runner only renders the per-test avatar (ac-delta-22).
- **[UC-09](./UC-09-bulk-status-in-runner.md)** — Multi-Select variant of runner status apply.
- **[UC-11](./UC-11-view-run-report.md)** — consumes the recorded results for reporting.

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-03 -->
<!-- sources: AC-29, AC-30, AC-31, AC-32, AC-33, AC-34, AC-35, AC-36, AC-96, AC-97, test-execution-runner/ac-delta-1, test-execution-runner/ac-delta-2, test-execution-runner/ac-delta-3, test-execution-runner/ac-delta-4, test-execution-runner/ac-delta-5, test-execution-runner/ac-delta-6, test-execution-runner/ac-delta-7, test-execution-runner/ac-delta-8, test-execution-runner/ac-delta-9, test-execution-runner/ac-delta-10, test-execution-runner/ac-delta-11, test-execution-runner/ac-delta-12, test-execution-runner/ac-delta-13, test-execution-runner/ac-delta-14, test-execution-runner/ac-delta-15, test-execution-runner/ac-delta-16, test-execution-runner/ac-delta-17, test-execution-runner/ac-delta-18, test-execution-runner/ac-delta-19, test-execution-runner/ac-delta-20, test-execution-runner/ac-delta-21, test-execution-runner/ac-delta-22 -->
<!-- sub-feature: test-execution-runner -->

_42 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | critical | bulk-status-actions | [Bulk apply ${status} via the Result Message modal updates every selected test and header counters @smoke](../../../../test-cases/manual-tests-execution/bulk-status-actions/bulk-status-application.md) | AC-29 |
| 2 | high | bulk-status-actions | [Bulk quick-set ${status} via the toolbar with native confirm Accept applies the status @smoke](../../../../test-cases/manual-tests-execution/bulk-status-actions/bulk-status-application.md) | AC-29 |
| 3 | low | bulk-status-actions | [Custom status dropdown appears in the bulk Result Message modal when custom statuses exist @unclear @needs-project-setting](../../../../test-cases/manual-tests-execution/bulk-status-actions/bulk-status-application.md) | AC-31 |
| 4 | high | bulk-status-actions | [Bulk apply with a message persists the status and the message together](../../../../test-cases/manual-tests-execution/bulk-status-actions/cross-cutting.md) | AC-30 |
| 5 | normal | run-creation | ["Run as checklist" ON at creation time persists on the created run](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | AC-96 |
| 6 | normal | run-creation | ["Run as checklist" toggle is OFF by default and can be enabled](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-96 |
| 7 | normal | test-execution-runner | [Add an attachment via drag-and-drop onto the drop zone](../../../../test-cases/manual-tests-execution/test-execution-runner/attachments.md) | AC-32, test-execution-runner/ac-delta-4 |
| 8 | high | test-execution-runner | [Add an attachment via the 'browse' file picker](../../../../test-cases/manual-tests-execution/test-execution-runner/attachments.md) | AC-32, test-execution-runner/ac-delta-4 |
| 9 | normal | test-execution-runner | [Cancelling the 'Are you sure?' dialog keeps the attachment @negative](../../../../test-cases/manual-tests-execution/test-execution-runner/attachments.md) | AC-34, test-execution-runner/ac-delta-7 |
| 10 | normal | test-execution-runner | [Change attachment display layout to ${view_mode} @unclear](../../../../test-cases/manual-tests-execution/test-execution-runner/attachments.md) | AC-32, test-execution-runner/ac-delta-5 |
| 11 | high | test-execution-runner | [Deleting the last attachment with 'Confirm' restores the empty drop zone @boundary](../../../../test-cases/manual-tests-execution/test-execution-runner/attachments.md) | AC-34, test-execution-runner/ac-delta-7 |
| 12 | normal | test-execution-runner | [Open an attachment preview in ${preview_mode} and close back to the runner @unclear](../../../../test-cases/manual-tests-execution/test-execution-runner/attachments.md) | AC-33, test-execution-runner/ac-delta-6 |
| 13 | high | test-execution-runner | [Checklist-mode run hides test descriptions by default (cross-cut D)](../../../../test-cases/manual-tests-execution/test-execution-runner/cross-cutting.md) | AC-96, test-execution-runner/ac-delta-15 |
| 14 | normal | test-execution-runner | [Custom sub-status counter impact is visible in the runner header (cross-cut E)](../../../../test-cases/manual-tests-execution/test-execution-runner/cross-cutting.md) | AC-31, test-execution-runner/ac-delta-21 |
| 15 | normal | test-execution-runner | [Per-test 'Toggle Description' in a checklist run reveals and re-hides the description (cross-cut D)](../../../../test-cases/manual-tests-execution/test-execution-runner/cross-cutting.md) | AC-96, test-execution-runner/ac-delta-15 |
| 16 | normal | test-execution-runner | [Per-test assignee badge is visible in the tree on a multi-assignee run (cross-cut B) @unclear](../../../../test-cases/manual-tests-execution/test-execution-runner/cross-cutting.md) | test-execution-runner/ac-delta-22 |
| 17 | low | test-execution-runner | ['Refresh structure' reloads the tests tree from the server](../../../../test-cases/manual-tests-execution/test-execution-runner/detail-pane-and-tree.md) | test-execution-runner/ac-delta-16 |
| 18 | normal | test-execution-runner | [Extra-options menu toggle ${toggle_label} hides the matching chrome in the tree](../../../../test-cases/manual-tests-execution/test-execution-runner/detail-pane-and-tree.md) | test-execution-runner/ac-delta-16 |
| 19 | normal | test-execution-runner | [Keyboard navigation between tests respects the active priority filter (cross-cut F)](../../../../test-cases/manual-tests-execution/test-execution-runner/detail-pane-and-tree.md) | test-execution-runner/ac-delta-18 |
| 20 | normal | test-execution-runner | [Opening a finished run does not present the Manual Runner @negative](../../../../test-cases/manual-tests-execution/test-execution-runner/detail-pane-and-tree.md) | test-execution-runner/ac-delta-1 |
| 21 | high | test-execution-runner | [Priority filter ${priority_level} restricts the tree to matching tests](../../../../test-cases/manual-tests-execution/test-execution-runner/detail-pane-and-tree.md) | test-execution-runner/ac-delta-17 |
| 22 | normal | test-execution-runner | [Priority filter with no matching tests renders an empty tree @negative @boundary](../../../../test-cases/manual-tests-execution/test-execution-runner/detail-pane-and-tree.md) | test-execution-runner/ac-delta-17 |
| 23 | low | test-execution-runner | [Resize handle between the tree and the detail pane changes pane widths](../../../../test-cases/manual-tests-execution/test-execution-runner/detail-pane-and-tree.md) | test-execution-runner/ac-delta-14 |
| 24 | normal | test-execution-runner | [Add a note to a suite via the suite row affordance](../../../../test-cases/manual-tests-execution/test-execution-runner/notes.md) | test-execution-runner/ac-delta-11 |
| 25 | normal | test-execution-runner | [Bulk-create a note across multiple selected tests @unclear](../../../../test-cases/manual-tests-execution/test-execution-runner/notes.md) | test-execution-runner/ac-delta-13 |
| 26 | normal | test-execution-runner | [Convert an existing note into a full test](../../../../test-cases/manual-tests-execution/test-execution-runner/notes.md) | test-execution-runner/ac-delta-12 |
| 27 | high | test-execution-runner | [Create a note via the runner header 'Create notes' action](../../../../test-cases/manual-tests-execution/test-execution-runner/notes.md) | test-execution-runner/ac-delta-10 |
| 28 | normal | test-execution-runner | [Saving a note with an empty title is rejected @negative](../../../../test-cases/manual-tests-execution/test-execution-runner/notes.md) | test-execution-runner/ac-delta-10 |
| 29 | normal | test-execution-runner | [Applied custom sub-status is reflected on the test row indicator in the tree (cross-cut E)](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | test-execution-runner/ac-delta-21 |
| 30 | critical | test-execution-runner | [Apply standard status ${status} to a pending test @smoke](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-29, test-execution-runner/ac-delta-1, test-execution-runner/ac-delta-2 |
| 31 | high | test-execution-runner | [Applying a custom sub-status to ${standard_status} keeps the standard status selected](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-31, test-execution-runner/ac-delta-21 |
| 32 | high | test-execution-runner | [Custom sub-status dropdown is disabled before a standard status is chosen @negative](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-31, test-execution-runner/ac-delta-21 |
| 33 | high | test-execution-runner | [Result message is editable only after a standard status is selected @negative](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-30, test-execution-runner/ac-delta-2 |
| 34 | high | test-execution-runner | [Result message persists after navigating to another test and back](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-30, test-execution-runner/ac-delta-3 |
| 35 | normal | test-execution-runner | [Switching status from Passed to Failed updates the header counters accordingly @boundary](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | AC-29, AC-30 |
| 36 | normal | test-execution-runner | [Test detail pane renders the documented sections for a test with description and steps](../../../../test-cases/manual-tests-execution/test-execution-runner/result-entry.md) | test-execution-runner/ac-delta-2 |
| 37 | normal | test-execution-runner | [Step left unmarked remains Pending when other steps of the same test are marked @negative @unclear](../../../../test-cases/manual-tests-execution/test-execution-runner/step-by-step-markings.md) | AC-35, AC-36 |
| 38 | normal | test-execution-runner | [Step markings persist after closing and re-opening the test @unclear](../../../../test-cases/manual-tests-execution/test-execution-runner/step-by-step-markings.md) | AC-36, test-execution-runner/ac-delta-9 |
| 39 | high | test-execution-runner | [Step-by-step click gesture ${click_count} sets the step to ${target_status} @unclear](../../../../test-cases/manual-tests-execution/test-execution-runner/step-by-step-markings.md) | AC-35, test-execution-runner/ac-delta-8 |
| 40 | normal | test-execution-runner | [Auto-Track records elapsed time on the test result](../../../../test-cases/manual-tests-execution/test-execution-runner/time-tracking.md) | test-execution-runner/ac-delta-19 |
| 41 | normal | test-execution-runner | [Saving 'Set Time' with an empty duration is rejected @negative @boundary @unclear](../../../../test-cases/manual-tests-execution/test-execution-runner/time-tracking.md) | test-execution-runner/ac-delta-20 |
| 42 | normal | test-execution-runner | [Set Time manual entry replaces the auto-tracked duration](../../../../test-cases/manual-tests-execution/test-execution-runner/time-tracking.md) | test-execution-runner/ac-delta-20 |
<!-- end-trace -->
