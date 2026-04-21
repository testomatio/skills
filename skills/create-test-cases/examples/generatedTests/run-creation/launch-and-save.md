<!-- suite -->
# Launch and Save

Creation-side lifecycle: the Launch and Save paths, their toast feedback, and inline validation that keeps the sidebar open on failure.

<!-- test
type: manual
priority: critical
source: AC-8, AC-23, ac-delta-11
automation: candidate
-->
## Launch creates a run and navigates to the Manual Runner with the first test pre-opened @smoke

The Launch button is the primary happy path: create the run, transition it to active, and open the runner with the first test ready to mark.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Fill the Title with "Launch happy path"
  - _Expected_: Title input shows the value
- Keep scope at "All tests"
  - _Expected_: "All tests" tab remains active
- Click the 'Launch' button
  - _Expected_:
  - Success toast "Run has been started" is shown
  - URL becomes `/projects/{project}/runs/launch/{id}/?entry={testId}`
  - Manual Runner opens with the left-side test tree populated
  - The execution panel on the right shows the first test of the project pre-opened with PASSED / FAILED / SKIPPED buttons visible
- Navigate back to the Runs list (click the 'Runs' header link)
  - _Expected_: The newly-created run appears in the list with an in-progress status indicator (orange ●) and title "Launch happy path"

<!-- test
type: manual
priority: critical
source: AC-8, ac-delta-12
automation: candidate
-->
## Save creates a pending run that can be resumed via Continue

The Save button must create the run without opening the runner; the run appears in the list as pending/not-started and is resumable later.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Fill the Title with "Save pending run"
  - _Expected_: Title input shows the value
- Keep scope at "All tests"
  - _Expected_: "All tests" tab remains active
- Click the 'Save' button
  - _Expected_:
  - Success toast "Run has been created" is shown
  - Sidebar closes
  - URL returns to the Runs list (or navigates to the run detail — whichever the UI does, the runner is NOT opened)
  - No URL fragment `/runs/launch/{id}/?entry=…` is present
- Locate the "Save pending run" row in the Runs list and click it
  - _Expected_: Run detail panel opens on the right side showing the run in pending state; a "Continue" link/button is visible
- Click the 'Continue' action in the detail panel
  - _Expected_:
  - URL becomes `/projects/{project}/runs/launch/{id}/`
  - Manual Runner opens; left-side tree shows the tests belonging to the run

<!-- test
type: manual
priority: high
source: ac-delta-10
automation: candidate
-->
## Creation ${action} shows success toast "${toast_text}"

Toast text is the primary success signal for both flows; each action must surface a distinct message.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Fill the Title with "Toast feedback for ${action}"
  - _Expected_: Title input shows the value
- Click the '${action}' button
  - _Expected_:
  - Toast appears in the top-right area
  - Toast text reads exactly "${toast_text}"
  - Toast auto-dismisses after the standard timeout
- Navigate to the Runs list if not already there
  - _Expected_: A new run with the title "Toast feedback for ${action}" is visible

<!-- example -->

| action | toast_text |
| --- | --- |
| Save | Run has been created |
| Launch | Run has been started |

<!-- test
type: manual
priority: normal
source: AC-9, ac-delta-18
automation: deferred
automation-note: requires toggling the "Require RunGroup for new runs" project setting as a precondition (currently not enabled in the standard test project)
-->
## Required-RunGroup setting blocks Launch when the field is empty @negative @needs-project-setting @unclear

When Project Settings enforce "Require RunGroup for new runs", the Launch action must be blocked until a RunGroup is selected.

## Preconditions

- In Project Settings, the "Require RunGroup for new runs" option is ENABLED.
- At least one existing RunGroup exists in the project.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Fill the Title with "Required RunGroup missing"
  - _Expected_: Title input shows the value
- Leave the RunGroup selector at its empty default ("Select RunGroup")
  - _Expected_: RunGroup selector shows no chosen value
- Click the 'Launch' button
  - _Expected_:
  - Launch does NOT proceed
  - RunGroup selector is highlighted (visually distinct — e.g. red border) and a warning message is shown near the field
  - Sidebar remains open
  - No run is created (Runs list count unchanged; no toast)
- Select an existing RunGroup from the dropdown and click 'Launch' again
  - _Expected_:
  - Highlight on the RunGroup field clears
  - Success toast "Run has been started" is shown
  - Manual Runner opens

<!-- test
type: manual
priority: normal
source: ac-delta-18
automation: deferred
automation-note: requires simulating a server error; not deterministic with standard UI fixtures
-->
## Server-side validation error keeps the sidebar open and surfaces inline feedback @negative

A server validation failure during Save/Launch must not dismiss the sidebar — the user must be able to correct the input without re-entering everything.

## Preconditions

- A server-side constraint can be triggered (e.g. duplicate-title constraint, rate limit, or another validation) — reproducible in the test environment.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Fill the Title with a value that triggers the server-side constraint (e.g. a duplicate of an existing run title when titles are enforced unique)
  - _Expected_: Title input shows the value
- Click the 'Save' button (or 'Launch')
  - _Expected_:
  - Request is rejected by the server
  - Sidebar remains open (not dismissed)
  - Title input retains the value previously entered
  - An inline error message or toast with specific wording indicates the problem (e.g. "Title already in use" or the returned server message)
  - No run is created (Runs list count unchanged)
- Change the Title to a unique value and click 'Save' again
  - _Expected_:
  - Success toast "Run has been created" is shown
  - Run appears in the Runs list

<!-- test
type: manual
priority: normal
source: AC-45, ac-delta-7
automation: candidate
-->
## Cancelling the Environment modal preserves the sidebar state without assigning env @negative

Opening the Multi-Environment Configuration modal and cancelling must not commit any env choices and must not disturb the sidebar's other fields.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Fill the Title with "Env cancel preserve"
  - _Expected_: Title input shows the value
- Click the environment selector
  - _Expected_: Multi-Environment Configuration modal opens with an initial slot "1"
- Tick two environment checkboxes in slot "1"
  - _Expected_: Slot "1" shows the two ticked environments
- Click the 'Cancel' button inside the modal
  - _Expected_:
  - Modal closes
  - Sidebar regains focus
  - Environment selector in the sidebar still shows the placeholder "Set environment for execution" (no env assigned)
  - Title input still shows "Env cancel preserve" (other fields preserved)
- Click the 'Save' button
  - _Expected_:
  - Success toast "Run has been created" is shown
  - The newly-created run's detail panel shows no environment assignment

<!-- test
type: manual
priority: normal
source: AC-8, AC-23
automation: deferred
automation-note: requires timing-sensitive double-click simulation; flaky to automate reliably
-->
## Double-clicking Launch creates only a single run @negative

Rapid repeated activation of Launch must be idempotent — only one run is created even if the button is clicked twice in quick succession.

## Steps

- Navigate to the 'Runs' page and note the current run count as `${before_count}`
  - _Expected_: Runs list shows `${before_count}` runs
- Click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Fill the Title with "Double-click launch idempotent"
  - _Expected_: Title input shows the value
- Double-click the 'Launch' button (two clicks within ~300ms)
  - _Expected_:
  - Only one success toast "Run has been started" is shown
  - Only one navigation occurs (to `/runs/launch/{id}/`)
  - No error toast appears
- Navigate back to the Runs list
  - _Expected_: Runs count is exactly `${before_count} + 1` (not `${before_count} + 2`); only one "Double-click launch idempotent" run exists
