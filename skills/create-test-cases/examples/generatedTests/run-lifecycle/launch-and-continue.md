<!-- suite -->
# Launch and Continue

Covers the state transitions that open the Manual Runner for the first time (Launch) and for a subsequent session (Continue / re-enter). The New Manual Run dialog's form fields and validations are owned by #1 run-creation; this suite verifies only the lifecycle transition — Pending → In-progress and subsequent re-entry into the runner — plus the state-based visibility of the Continue affordance.

<!-- test
type: manual
priority: high
source: AC-23
automation: candidate
-->
## Launching a new run transitions it to the in-progress state and opens the runner @smoke

## Preconditions
- Current user can create runs in the project
- At least one manual test exists in the project

## Steps
- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens with the heading "New Manual Run"
- Leave the title blank, accept the default 'All tests' scope, and click 'Launch'
  - _Expected_:
  - Success toast "Run has been started" appears
  - Browser navigates to `/projects/{project}/runs/launch/{id}/?entry={firstTestId}`
- Return to the Runs list via the 'Runs' link in the runner header
  - _Expected_:
  - Newly created run appears at the top of the list with status indicator in the in-progress (orange) state
  - Run type badge shows `manual`

---

<!-- test
type: manual
priority: high
source: AC-24, ac-delta-7
automation: candidate
-->
## Continue from the Run Detail panel resumes an unfinished run in the Manual Runner

## Preconditions
- An unfinished manual run exists in the project (in-progress or freshly saved)

## Steps
- Navigate to the 'Runs' page and click the unfinished run's row
  - _Expected_: Right-side Run Detail panel opens showing the run summary
- Verify the 'Continue' link is visible in the panel's header area
  - _Expected_: 'Continue' link is present with its target pointing at `/projects/{project}/runs/launch/{id}/`
- Click the 'Continue' link
  - _Expected_:
  - Browser navigates to the Manual Runner for the same run
  - Test tree renders at the left with each test retaining its prior status indicator
  - Runner opens on the first unresolved test (first Pending entry)

---

<!-- test
type: manual
priority: normal
source: AC-24, ac-delta-7
automation: candidate
-->
## Resume an unfinished run from the Runs list row extra menu via the 'Launch' item

## Preconditions
- An unfinished manual run exists

## Steps
- Navigate to the 'Runs' page
- Open the extra menu on the unfinished run's row
  - _Expected_: Menu opens containing at least the items 'Launch', 'Advanced Relaunch', 'Edit', and 'Finish' — no 'Relaunch' or 'Launch a Copy' items
- Click 'Launch'
  - _Expected_:
  - Browser navigates to `/projects/{project}/runs/launch/{id}/`
  - Manual Runner opens with the existing tests and their current statuses

---

<!-- test
type: manual
priority: normal
source: ac-delta-7, AC-27
automation: candidate
-->
## Continue and Edit are not available on a finished run @negative

## Preconditions
- A finished manual run exists (all tests resolved, Finish Run accepted)

## Steps
- Navigate to the 'Runs' page and click the finished run's row
  - _Expected_: Run Detail panel opens; header shows status indicator for the finished state
- Inspect the panel header
  - _Expected_: No 'Continue' link is rendered; the inline Edit (pencil) icon is not available
- Close the Run Detail panel
  - _Expected_: Panel dismisses; Runs list is visible
- Open the extra menu on the finished run's row
  - _Expected_: Menu contains 'Relaunch', 'Advanced Relaunch', 'Launch a Copy' — and does NOT contain 'Launch', 'Edit', or 'Finish'

---

<!-- test
type: manual
priority: high
source: AC-23
automation: candidate
-->
## Launching a previously saved Pending run transitions it to in-progress on first entry @boundary

## Preconditions
- A run exists that was created via the New Manual Run dialog with 'Save' (not 'Launch') — status is Pending and the run has never opened the runner

## Steps
- Navigate to the 'Runs' page and click the Pending run's row
  - _Expected_: Run Detail panel shows status in the pending (orange) state with all tests listed as Pending
- Click the 'Continue' link (or the row menu's 'Launch' item)
  - _Expected_:
  - Browser navigates to the Manual Runner for the run
  - Status indicator on the Runs list flips to the in-progress (orange) variant after returning to the list (first in-progress activity recorded)
- Return to the Runs list
  - _Expected_: Run's status indicator now represents the in-progress state and the "Executed" timestamp in the detail panel shows a start time
