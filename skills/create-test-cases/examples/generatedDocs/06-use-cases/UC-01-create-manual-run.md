# UC-01: Create a Manual Run — QA Creator

<!-- use-case
id: UC-01
primary-actor: QA Creator
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** QA Creator
**Stakeholders:** Tester (executes the launched run); Owner / Manager (may observe and launch); Project (consumes Require-RunGroup project setting).
**Goal:** Produce a new Manual [Run](../03-glossary.md#run) containing a deliberately-chosen slice of tests, ready to be executed against one or more [environments](../03-glossary.md#environment-group).
**Trigger:** QA Creator opens the [New Manual Run](../03-glossary.md#run) sidebar from the Runs page (or a shortcut from the Tests page).
**Scope:** `run-creation` (owner). Touches `tester-assignment` (assignee field — owner of strategy logic is UC-06), `environment-configuration` (env field — owner of mode logic is UC-07), `run-groups` (RunGroup field + Require-RunGroup gating), `run-lifecycle` (Launch → In-Progress transition).

## Preconditions

- Actor is signed into Testomat.io with Create-Run permission (see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix)).
- Target project is selected.
- **Optional project setting** — *Require RunGroup for new runs* — may be enabled (affects alternate flow A4).
- For [Test plan](../03-glossary.md#run) scope: at least one Test Plan exists in the project (or the actor creates one inline via the dialog's "create new plan" action).
- For [Select tests](../03-glossary.md#test-in-run) scope: the project contains at least one manual test.

## Main success scenario (happy path — "All tests" scope)

1. QA Creator navigates to the Runs page.
2. System renders the Runs list with a primary **Manual Run** split-button in the toolbar (AC-1, ac-delta-1).
3. QA Creator clicks the left part of the **Manual Run** button.
4. System opens a right-side sidebar titled *New Manual Run*, pushes the URL to `/projects/{project}/runs/new`, and renders the creation form with defaults:
   - **Assignee** populated with the creator chip and an `as manager` label ([ac-delta-5](../../../test-cases/manual-tests-execution/run-creation-ac-delta.md)).
   - **Title** (optional) empty.
   - **RunGroup** selector showing *Select RunGroup* (placeholder).
   - **Environment** selector showing *Set environment for execution*.
   - **Description** empty.
   - **Run as checklist** toggle OFF (ac-delta-14).
   - **Scope** tabs: *All tests* (default, AC-3) · *Test plan* · *Select tests* · *Without tests* (AC-2, mutually exclusive).
   - **Run Automated as Manual** toggle OFF (ac-delta-15).
   - **Actions**: Launch · Save · Cancel (AC-8).
5. QA Creator accepts the *All tests* default (or performs an alternate scope flow — see A1/A2/A3).
6. QA Creator clicks **Launch**.
7. System validates the form (see A4 / E1).
8. System creates a Run with all project manual tests attached, transitions it to In-Progress (AC-23), navigates to the Manual Runner at `/projects/{project}/runs/launch/{id}/?entry={firstTestId}`, and surfaces a success toast equivalent to "Run has been started" (ac-delta-10, ac-delta-11).

## Alternate flows

### A1: "Test plan" scope
**Branches at step 5.**
1. QA Creator clicks the **Test plan** tab.
2. System hides the test tree and shows a plan picker.
3. QA Creator selects one or more plans (AC-4). Optionally invokes *create new plan* to produce one inline (AC-4).
4. System displays the planned set's test count.
5. QA Creator proceeds with step 6 of the main flow. On Launch, the Run is created with the union of selected plans' tests (AC-21).

### A2: "Select tests" scope (includes "Run Automated as Manual")
**Branches at step 5.**
1. QA Creator clicks the **Select tests** tab.
2. System reveals the test tree (AC-5, AC-19) and the selected-tests counter (AC-20).
3. QA Creator expands/collapses suites, toggles individual tests, uses search/filter to narrow the tree, and may flip the **Run Automated as Manual** toggle ON to include automated tests for manual re-execution (AC-10, ac-delta-15).
4. System updates the selected-tests counter in real time (AC-20).
5. QA Creator proceeds with step 6. On Launch, the Run is created containing exactly the checked tests.

### A3: "Without tests" scope
**Branches at step 5.**
1. QA Creator clicks the **Without tests** tab.
2. System hides the tree and disables checkboxes (ac-delta-9).
3. QA Creator proceeds with step 6. On Launch, the Run is created with **zero** tests (AC-6, AC-22); the runner shell is opened with no test pre-selected (ac-delta-11). The empty Run can be populated later via Edit (AC-27) — see [UC-04](./UC-04-finish-run.md) / run-lifecycle.

### A4: Save (store without launching)
**Branches at step 6.**
1. QA Creator clicks **Save** instead of **Launch**.
2. System creates the Run in a Pending state without opening the Runner (ac-delta-12), surfaces a success toast "Run has been created" (ac-delta-10), and closes the sidebar.
3. The new Run appears in the Runs list with a **Continue** action (AC-24) — see [UC-04](./UC-04-finish-run.md).

### A5: RunGroup pre-populated from context
**Applies if the sidebar is opened from inside a RunGroup page.**
1. The RunGroup selector is pre-populated with that group's name but remains editable (AC-51, ac-delta-6).
2. QA Creator may keep it or switch to *Without rungroup* / another group before Launch/Save.

### A6: Entry from Tests page — single test
**Replaces steps 1–4.**
1. QA Creator navigates to the Tests page and opens a test's extra menu → **Add to Run** (AC-11).
2. System lists only **unfinished** runs as destinations; if none exist, it offers to create a new Run (ac-delta-16).
3. On choosing an unfinished run, the test is added to it — no New Manual Run dialog is opened. Flow ends.

### A7: Entry from Tests page — suite / Multi-select
**Replaces steps 1–4.**
1. QA Creator selects a suite (extra menu) or multiple tests (Multi-select) on the Tests page and chooses **Run Tests** → **Launch** (AC-12).
2. System opens the New Manual Run dialog **pre-populated** with the *Select tests* tab active and the suite's tests (or the Multi-select union) pre-checked (ac-delta-17).
3. QA Creator resumes at step 6 of the main flow.

### A8: Cancel / dismiss the dialog
**Branches at any step before Launch/Save.**
1. QA Creator clicks **Cancel**, the **×** close button, or the **Back** arrow.
2. System closes the sidebar, restores the URL to `/projects/{project}/runs/`, discards the draft, and does not create a Run (ac-delta-2).

## Exception flows

### E1: Require-RunGroup validation blocks Launch
**Preconditions:** Project setting *Require RunGroup for new runs* is ON and the RunGroup field is empty.

1. QA Creator clicks **Launch** at step 6.
2. System highlights the RunGroup field, displays a warning, and **does not** create the Run (AC-9, ac-delta-18). The sidebar remains open.
3. QA Creator selects a RunGroup (or creates a new one via the arrow dropdown → *New group* — see [UC-08](./UC-08-manage-rungroup.md)) and re-clicks **Launch**. Flow continues from step 7.

This exception maps to business rule [**BR-1**](../07-business-rules.md#br-1).

### E2: Server error / other validation failure on Launch or Save
1. System fails to create the Run (network, 4xx, 5xx, or other validation).
2. Sidebar remains open; failure is communicated inline — field highlight or error banner — without navigating away (ac-delta-18).
3. QA Creator retries or cancels.

## Postconditions

- **Success (Launch):** A new Run exists in the project, status **In-Progress**, tests attached per chosen scope, creator listed as the sole default assignee (AC-37). Runner opens with the first test pre-selected (AC-23, ac-delta-11). Business rule [**BR-2**](../07-business-rules.md#br-2) ensures that *Without tests* runs are legal and can be populated later.
- **Success (Save):** A new Run exists in **Pending** state, visible in the Runs list with a **Continue** affordance (ac-delta-12).
- **Failure:** No Run is created. Sidebar stays open for correction, or the actor dismisses it (ac-delta-2, ac-delta-18).

## Business rules referenced

- [**BR-1**](../07-business-rules.md#br-1) — Require-RunGroup gating on Launch.
- [**BR-2**](../07-business-rules.md#br-2) — A Run may be created and launched with zero tests.
- [**BR-4**](../07-business-rules.md#br-4) — Scope tabs are mutually exclusive — switching tabs discards prior-tab selection.

## Functional requirements covered

- AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9, AC-10, AC-11, AC-12, AC-19, AC-20, AC-21, AC-22, AC-23, AC-37 (default assignee), AC-45 (env field presence), AC-51 (RunGroup pre-populated), AC-96 (checklist toggle presence).
- `run-creation-ac-delta.md` ac-delta-1 through ac-delta-18 (except ac-delta-14 toggle default is covered as A2 / main flow state; full delta set is cited by the suite's tests — see Verifying tests).

## Related use cases

- **[UC-02](./UC-02-create-mixed-run.md)** — sibling flow reached from the same entry point (arrow dropdown), but launches a manual-plus-automated Run.
- **[UC-04](./UC-04-finish-run.md)** *(Phase 2)* — consumes *Save* output (Pending Run) via **Continue**; consumes *Launch* output (In-Progress) via **Finish Run**.
- **[UC-06](./UC-06-assign-testers.md)** *(Phase 2)* — owns the *Auto-Assign Users* strategy selector surfaced via "Assign more users" link in the creation sidebar.
- **[UC-07](./UC-07-configure-environments.md)** *(Phase 2)* — owns the multi-environment configurator opened from the *Environment* field "+" (AC-45, ac-delta-7).
- **[UC-08](./UC-08-manage-rungroup.md)** *(Phase 2)* — reachable via arrow dropdown → *New group* during creation.

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-01 -->
<!-- sources: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9, AC-10, AC-11, AC-12, AC-19, AC-20, AC-21, AC-22, AC-23, AC-37, AC-45, AC-51, AC-96, run-creation/ac-delta-1, run-creation/ac-delta-2, run-creation/ac-delta-3, run-creation/ac-delta-4, run-creation/ac-delta-5, run-creation/ac-delta-6, run-creation/ac-delta-7, run-creation/ac-delta-8, run-creation/ac-delta-9, run-creation/ac-delta-10, run-creation/ac-delta-11, run-creation/ac-delta-12, run-creation/ac-delta-13, run-creation/ac-delta-14, run-creation/ac-delta-15, run-creation/ac-delta-16, run-creation/ac-delta-17, run-creation/ac-delta-18 -->
<!-- sub-feature: run-creation -->

_57 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | normal | archive-and-purge | [Archiving a Without-tests run succeeds with zero-test counts @boundary](../../../../test-cases/manual-tests-execution/archive-and-purge/run-state-behavior.md) | AC-22 |
| 2 | normal | environment-configuration | [Select multiple environments in a single group and commit them](../../../../test-cases/manual-tests-execution/environment-configuration/group-management.md) | AC-45 |
| 3 | high | environment-configuration | [Open Multi-Environment Configuration modal from the sidebar @smoke](../../../../test-cases/manual-tests-execution/environment-configuration/modal-lifecycle.md) | AC-45 |
| 4 | high | environment-configuration | [Save one-group env selection commits it to the sidebar @smoke](../../../../test-cases/manual-tests-execution/environment-configuration/modal-lifecycle.md) | AC-45 |
| 5 | normal | run-creation | ["Run as checklist" ON at creation time persists on the created run](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | AC-96, run-creation/ac-delta-14 |
| 6 | normal | run-creation | [Adding and removing an environment slot leaves only the initial slot @boundary](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | AC-45, run-creation/ac-delta-7 |
| 7 | normal | run-creation | [Cancelling the Assign more users panel reverts the assignee section to creator-only @negative](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | run-creation/ac-delta-5 |
| 8 | normal | run-creation | [Create a run with multiple testers assigned via "Assign more users"](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | run-creation/ac-delta-5 |
| 9 | high | run-creation | [Create a run with two environment groups configured at creation time](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | AC-45, run-creation/ac-delta-7 |
| 10 | high | run-creation | [Opening creation from a RunGroup page pre-populates the RunGroup field](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | AC-51, run-creation/ac-delta-6 |
| 11 | normal | run-creation | [Arrow-dropdown closes on outside click without selecting any item @negative](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | run-creation/ac-delta-1 |
| 12 | normal | run-creation | [Arrow-dropdown item ${menu_item} opens ${target} without opening the creation sidebar](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | run-creation/ac-delta-1 |
| 13 | high | run-creation | [Clicking the Manual Run split-button left part navigates to the creation URL](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | AC-1, run-creation/ac-delta-1 |
| 14 | normal | run-creation | [Dismiss the New Manual Run sidebar via ${dismiss_method} restores runs list](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | run-creation/ac-delta-2 |
| 15 | critical | run-creation | [Open New Manual Run sidebar and verify form chrome renders @smoke](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | AC-1, AC-7, run-creation/ac-delta-1 |
| 16 | normal | run-creation | [Pressing ESC key closes the sidebar without creating a run @negative](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | run-creation/ac-delta-2 |
| 17 | high | run-creation | [From Tests page Multi-select, 'Run Tests' pre-populates creation with the union of selected items](../../../../test-cases/manual-tests-execution/run-creation/entry-points-and-extras.md) | AC-12, run-creation/ac-delta-17 |
| 18 | normal | run-creation | [From Tests page, single-test "Add to Run" lists only unfinished runs as destinations @unclear](../../../../test-cases/manual-tests-execution/run-creation/entry-points-and-extras.md) | AC-11, run-creation/ac-delta-16 |
| 19 | high | run-creation | [From Tests page, suite extra menu → 'Run Tests' pre-populates creation in Select tests tab](../../../../test-cases/manual-tests-execution/run-creation/entry-points-and-extras.md) | AC-12, run-creation/ac-delta-17 |
| 20 | normal | run-creation | [Multi-select bar 'Run Tests' is disabled when zero items are selected @negative](../../../../test-cases/manual-tests-execution/run-creation/entry-points-and-extras.md) | AC-12, run-creation/ac-delta-17 |
| 21 | normal | run-creation | ["Run as checklist" toggle is OFF by default and can be enabled](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-7, AC-96, run-creation/ac-delta-14 |
| 22 | normal | run-creation | ["Run Automated as Manual" toggle is actionable only in Select tests tab @negative](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-10, run-creation/ac-delta-15 |
| 23 | normal | run-creation | [Assignee section shows the creator with "as manager" label by default](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-37, run-creation/ac-delta-5 |
| 24 | high | run-creation | [Blank title auto-generates a default title on Launch](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-7, run-creation/ac-delta-4 |
| 25 | low | run-creation | [Description accepts very large content without enforced limit @boundary](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-7, run-creation/ac-delta-13 |
| 26 | normal | run-creation | [RunGroup dropdown lists "Without rungroup" plus existing named groups](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-7, run-creation/ac-delta-6 |
| 27 | normal | run-creation | [RunGroup dropdown shows only "Without rungroup" when no groups exist in the project @negative](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-7, run-creation/ac-delta-6 |
| 28 | low | run-creation | [Title input accepts a single character as the minimum valid input @boundary](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-7, run-creation/ac-delta-3 |
| 29 | low | run-creation | [Title input enforces the 255-character maximum @boundary](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-7, run-creation/ac-delta-3 |
| 30 | normal | run-creation | [Title with only whitespace characters is treated as blank @negative](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-7, run-creation/ac-delta-4 |
| 31 | normal | run-creation | [Whitespace-only description is stored as blank @negative](../../../../test-cases/manual-tests-execution/run-creation/form-fields.md) | AC-7, run-creation/ac-delta-13 |
| 32 | normal | run-creation | [Cancelling the Environment modal preserves the sidebar state without assigning env @negative](../../../../test-cases/manual-tests-execution/run-creation/launch-and-save.md) | AC-45, run-creation/ac-delta-7 |
| 33 | high | run-creation | [Creation ${action} shows success toast "${toast_text}"](../../../../test-cases/manual-tests-execution/run-creation/launch-and-save.md) | run-creation/ac-delta-10 |
| 34 | normal | run-creation | [Double-clicking Launch creates only a single run @negative](../../../../test-cases/manual-tests-execution/run-creation/launch-and-save.md) | AC-8, AC-23 |
| 35 | critical | run-creation | [Launch creates a run and navigates to the Manual Runner with the first test pre-opened @smoke](../../../../test-cases/manual-tests-execution/run-creation/launch-and-save.md) | AC-8, AC-23, run-creation/ac-delta-11 |
| 36 | normal | run-creation | [Required-RunGroup setting blocks Launch when the field is empty @negative @needs-project-setting @unclear](../../../../test-cases/manual-tests-execution/run-creation/launch-and-save.md) | AC-9, run-creation/ac-delta-18 |
| 37 | critical | run-creation | [Save creates a pending run that can be resumed via Continue](../../../../test-cases/manual-tests-execution/run-creation/launch-and-save.md) | AC-8, run-creation/ac-delta-12 |
| 38 | normal | run-creation | [Server-side validation error keeps the sidebar open and surfaces inline feedback @negative](../../../../test-cases/manual-tests-execution/run-creation/launch-and-save.md) | run-creation/ac-delta-18 |
| 39 | critical | run-creation | ["All tests" is the default scope and Launch creates a run with every manual test @smoke](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | AC-2, AC-3, AC-23 |
| 40 | low | run-creation | [Launching Select tests scope with zero tests selected @boundary @negative](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | AC-5, run-creation/ac-delta-11 |
| 41 | normal | run-creation | [Scope tabs are mutually exclusive — switching clears previously selected tests @boundary](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | AC-2, run-creation/ac-delta-8 |
| 42 | high | run-creation | [Select tests — browse tree, search, toggle tests, and Launch creates run with the picked subset](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | AC-5, AC-19, AC-20, run-creation/ac-delta-9 |
| 43 | normal | run-creation | [Select tests search with a zero-match query shows empty state @negative @boundary](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | AC-5, AC-19, run-creation/ac-delta-9 |
| 44 | normal | run-creation | [Selected-tests counter decrements back to 0 when a selected test is unticked @boundary](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | AC-5, AC-20, run-creation/ac-delta-9 |
| 45 | high | run-creation | [Test plan — selecting multiple plans unions their tests into the run](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | AC-4, AC-21 |
| 46 | normal | run-creation | [Test plan tab empty state shows "No test plans found" when none exist @negative](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | AC-4, AC-21 |
| 47 | normal | run-creation | [Test tree checkboxes are disabled outside the Select tests tab @negative](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | run-creation/ac-delta-9 |
| 48 | high | run-creation | [Without tests — Launch creates an empty run and navigates to the runner shell](../../../../test-cases/manual-tests-execution/run-creation/scope-selection.md) | AC-6, AC-22, run-creation/ac-delta-11 |
| 49 | critical | run-groups | [Add Manual Run from inside a RunGroup pre-populates the RunGroup field @smoke](../../../../test-cases/manual-tests-execution/run-groups/contents-and-runs.md) | AC-51 |
| 50 | high | run-lifecycle | [Launching a new run transitions it to the in-progress state and opens the runner @smoke](../../../../test-cases/manual-tests-execution/run-lifecycle/launch-and-continue.md) | AC-23 |
| 51 | high | run-lifecycle | [Launching a previously saved Pending run transitions it to in-progress on first entry @boundary](../../../../test-cases/manual-tests-execution/run-lifecycle/launch-and-continue.md) | AC-23 |
| 52 | high | test-execution-runner | [Checklist-mode run hides test descriptions by default (cross-cut D)](../../../../test-cases/manual-tests-execution/test-execution-runner/cross-cutting.md) | AC-96 |
| 53 | normal | test-execution-runner | [Per-test 'Toggle Description' in a checklist run reveals and re-hides the description (cross-cut D)](../../../../test-cases/manual-tests-execution/test-execution-runner/cross-cutting.md) | AC-96 |
| 54 | low | tester-assignment | [Creator manager chip has no remove control and cannot be cleared from the sidebar @negative](../../../../test-cases/manual-tests-execution/tester-assignment/creation-dialog-assignment.md) | AC-37 |
| 55 | critical | tester-assignment | [Opening the New Manual Run sidebar shows the creator as manager with the Assign more users entry point @smoke](../../../../test-cases/manual-tests-execution/tester-assignment/creation-dialog-assignment.md) | AC-37 |
| 56 | normal | tester-assignment | [Manager chip on Edit Run cannot be removed by any control @negative](../../../../test-cases/manual-tests-execution/tester-assignment/edit-run-assignment.md) | AC-37 |
| 57 | normal | tester-assignment | [Save on Edit Run with all non-managers removed keeps the run with the manager only @boundary](../../../../test-cases/manual-tests-execution/tester-assignment/edit-run-assignment.md) | AC-37 |
<!-- end-trace -->
