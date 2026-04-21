<!-- suite -->
# Edit Run Assignment

The Edit Run page assignment controls for an ongoing run — adding users, per-chip remove, `Select All`, `Remove assign users`, the non-removable manager chip, and cancel/save semantics. The rest of the Edit-run metadata form (Title, Environment, Description, +Tests, +Plans, trash-delete) is owned by the `run-lifecycle` sub-feature.

<!-- test
type: manual
priority: critical
source: AC-38, AC-41, ac-delta-7, ac-delta-8
automation: candidate
-->
## Adding a user on Edit Run propagates to the ongoing runner Assign to dropdowns @smoke

A user added via the Edit Run page must be immediately selectable from the runner's per-suite Assign to dropdowns, satisfying the rule that assignment to suites/tests requires the user to be assigned to the run first.

## Preconditions

- An ongoing manual run exists in `project-for-testing` with the manager as the only assignee
- Project has at least one non-manager member not yet attached to the run

## Steps

- Navigate to the 'Runs' page and click the ongoing run's row
  - _Expected_: Run detail panel opens on the right showing the run's title and status
- Click the 'Edit' action in the run detail panel
  - _Expected_:
  - Page navigates to `/projects/{project}/runs/edit/{id}/`
  - Manager chip is rendered above the 'Assign users' multi-select with no "×" remove control
  - 'Assign users' multi-select is empty or shows existing non-manager assignees
- Click the 'Assign users' multi-select trigger and select the non-manager project member
  - _Expected_: Selected user's chip appears inside the multi-select trigger with a "×" remove control
- Click the 'Save' button
  - _Expected_: Page navigates back to the Runs list or run detail view
- Navigate to the runner for the same run (`/projects/{project}/runs/launch/{id}/`) and verify the added user is reflected on the ongoing run
  - _Expected_:
  - Run header avatar stack shows both the manager and the newly added user
  - Clicking a suite-level "Assign to" dropdown shows the newly added user in the option list (in addition to "Unassigned" and the manager)

<!-- test
type: manual
priority: normal
source: ac-delta-6, ac-delta-7, ac-delta-13
automation: candidate
-->
## Remove ${remove_scope} via ${remove_method} on Edit Run updates chips immediately

The Edit Run page must support per-user and bulk removal of non-manager assignees without requiring a confirmation when no results have been recorded.

## Preconditions

- An ongoing manual run exists in `project-for-testing` with at least two non-manager assignees
- No test in the run has recorded a result yet (PASSED / FAILED / SKIPPED) for any of those assignees

## Steps

- Navigate to the ongoing run's Edit page (`/projects/{project}/runs/edit/{id}/`)
  - _Expected_:
  - Manager chip is rendered with no "×" remove control
  - 'Assign users' multi-select contains at least two user chips, each with a "×" remove control
- Click the remove control described by ${remove_method}
  - _Expected_:
  - ${remove_scope} is cleared from the 'Assign users' multi-select immediately
  - No confirmation dialog is shown
  - No toast is shown (changes are unsaved until 'Save' is clicked)
  - Manager chip above the multi-select remains unchanged
- Click the 'Save' button
  - _Expected_: Page navigates back to the Runs list or run detail view
- Navigate to the runner for the same run
  - _Expected_:
  - Run header avatar stack reflects the removed user(s) — they are no longer present
  - Suite-level "Assign to" dropdowns no longer list the removed user(s)

<!-- example -->

| remove_scope | remove_method |
| --- | --- |
| a single non-manager user | the "×" control on that user's chip |
| all non-manager users | the 'Remove assign users' button |

<!-- test
type: manual
priority: normal
source: ac-delta-13
automation: candidate
-->
## Select All on Edit Run adds every project member to Assign users in one click

The `Select All` convenience button on the Edit Run page must add every project member to the Assign users multi-select in a single action, without a confirmation dialog.

## Preconditions

- An ongoing manual run exists in `project-for-testing` with the manager as the only assignee
- Project has a known total number of members (≥ 3 including the manager)

## Steps

- Navigate to the ongoing run's Edit page (`/projects/{project}/runs/edit/{id}/`)
  - _Expected_:
  - Manager chip is visible above the 'Assign users' multi-select
  - 'Assign users' multi-select is empty
  - 'Select All' and 'Remove assign users' buttons are visible near the multi-select
- Click the 'Select All' button
  - _Expected_:
  - Every project member is added as a chip to the 'Assign users' multi-select immediately
  - Chip count equals the project's member count minus one (the manager is already represented above the multi-select, not inside it)
  - No confirmation dialog or toast is shown
- Click the 'Save' button
  - _Expected_: Page navigates back to the Runs list or run detail view
- Navigate to the runner for the same run
  - _Expected_: Run header avatar stack contains every project member

<!-- test
type: manual
priority: normal
source: ac-delta-6
automation: deferred
automation-note: deferred — @unclear confirmation wording; requires pre-seeded recorded results for a non-manager user and confirmation dialog copy to be captured
-->
## Removing a user who has recorded results surfaces the confirmation flow @unclear

When a user being removed from the run has already recorded at least one test result, the UI is expected to confirm the action before the removal is applied. The exact dialog wording is `@unclear` and must be captured during execution.

## Preconditions

- An ongoing manual run exists with the manager + one non-manager user assigned
- The non-manager user has recorded ≥ 1 test result (PASSED / FAILED / SKIPPED) in the run

## Steps

- Navigate to the ongoing run's Edit page (`/projects/{project}/runs/edit/{id}/`)
  - _Expected_: Manager chip + one non-manager user chip with "×" remove control are visible
- Click the "×" remove control on the non-manager user's chip
  - _Expected_:
  - A confirmation dialog appears (exact wording to be captured)
  - Dialog offers an OK/Cancel (or Confirm/Cancel) pair
  - Record the exact dialog copy in the test run notes for product review
- Click the confirmation's primary action
  - _Expected_:
  - User chip is removed from the multi-select
  - User's previously recorded results remain attached to the run but are no longer attributed to an assignee (exact reattribution behaviour `@unclear`; record observed state)
- Click the 'Save' button
  - _Expected_: Page navigates back; run now has only the manager as an assignee

<!-- test
type: manual
priority: normal
source: AC-37, ac-delta-1
automation: candidate
-->
## Manager chip on Edit Run cannot be removed by any control @negative

The manager chip above the multi-select is structural and must not expose a remove affordance; bulk remove controls must skip it.

## Preconditions

- An ongoing manual run exists with the manager + at least one non-manager assignee

## Steps

- Navigate to the ongoing run's Edit page (`/projects/{project}/runs/edit/{id}/`)
  - _Expected_:
  - Manager chip is rendered ABOVE the 'Assign users' multi-select
  - Manager chip shows the "as manager" label
- Inspect the manager chip for a remove control
  - _Expected_:
  - No "×" remove control is rendered on the manager chip
  - The chip is not draggable out of the row, not right-clickable to a remove option
- Click the 'Remove assign users' button
  - _Expected_:
  - All non-manager user chips are cleared from the 'Assign users' multi-select
  - Manager chip remains intact above the multi-select
- Click the 'Save' button
  - _Expected_: Page navigates back; the run still has the manager as an assignee

<!-- test
type: manual
priority: normal
source: ac-delta-7
automation: candidate
-->
## Cancel on Edit Run after modifying assignees discards the pending state @negative

Changes to the Assign users multi-select must be discarded when Cancel is clicked — the run's assignees must match the state before the edit started.

## Preconditions

- An ongoing manual run exists with the manager + exactly one non-manager assignee (call them "UserA")
- Another non-manager user ("UserB") is a project member but is NOT attached to the run

## Steps

- Navigate to the ongoing run's Edit page (`/projects/{project}/runs/edit/{id}/`)
  - _Expected_: 'Assign users' multi-select shows UserA chip with "×" remove
- Add UserB to the 'Assign users' multi-select
  - _Expected_: Both UserA and UserB chips are present in the trigger
- Click the "×" remove control on the UserA chip
  - _Expected_: UserA chip is removed; only UserB chip remains in the multi-select
- Click the 'Cancel' button
  - _Expected_:
  - Page navigates back to the Runs list or run detail view
  - No toast is shown
- Navigate to the runner for the same run
  - _Expected_:
  - Run header avatar stack shows the manager and UserA (pre-edit state)
  - UserB is NOT attached to the run
  - Suite-level "Assign to" dropdowns do NOT list UserB

<!-- test
type: manual
priority: normal
source: AC-37, ac-delta-7, ac-delta-11
automation: candidate
-->
## Save on Edit Run with all non-managers removed keeps the run with the manager only @boundary

The lower boundary of Edit Run assignment — clearing all non-manager assignees — must keep the run valid with the manager alone and not produce an error.

## Preconditions

- An ongoing manual run exists with the manager + two non-manager assignees
- No recorded results exist for the non-manager users in this run

## Steps

- Navigate to the ongoing run's Edit page (`/projects/{project}/runs/edit/{id}/`)
  - _Expected_: Two non-manager user chips are present in the 'Assign users' multi-select
- Click the 'Remove assign users' button
  - _Expected_:
  - All non-manager chips are cleared from the multi-select immediately
  - Manager chip remains intact above the multi-select
- Click the 'Save' button
  - _Expected_:
  - Page navigates back to the Runs list or run detail view
  - No error toast is shown
- Navigate to the runner for the same run
  - _Expected_:
  - Run header avatar stack shows the manager only
  - Suite-level "Assign to" dropdowns list "Unassigned" and the manager only (no other users)
  - Per-test tree-row assignee chips for tests that were previously attached to the removed users are NOT rendered (those tests are now unassigned)
