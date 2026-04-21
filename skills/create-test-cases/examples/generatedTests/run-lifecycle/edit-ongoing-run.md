<!-- suite -->
# Edit Ongoing Run

Covers the Edit Run form for an ongoing (unfinished) run — updating metadata, appending tests and plans, removing individual tests, and the Cancel escape hatch. The Edit Run form's base fields are shared with run creation; here we focus on the edit-specific affordances (`+ Tests`, `+ Plans`, row trash-delete, Save persistence) and the state-gate that hides Edit on finished runs. Multi-user assignment ownership lives in #3 tester-assignment — this suite only verifies that Edit Run can add/remove assignees on an in-progress run (Concern B).

<!-- test
type: manual
priority: high
source: AC-27, ac-delta-6
automation: candidate
-->
## Editing ${field} on an ongoing run via Save persists the change @smoke

## Preconditions
- An ongoing manual run exists with at least one Pending test
- At least two distinct environment values (e.g. `Browser:Chrome` and `Browser:Firefox`) are configured at Settings → Environments

## Steps
- Open the ongoing run's extra menu on the Runs list and click 'Edit'
  - _Expected_: Edit Run form opens at `/projects/{project}/runs/edit/{id}/` with the existing values pre-filled
- Update the ${field} field to ${new_value}
  - _Expected_: Input reflects ${new_value}; existing value is replaced
- Click 'Save'
  - _Expected_:
  - Success toast "Run has been updated" appears
  - Browser returns to the Runs list
- Reopen the run's detail panel
  - _Expected_: ${field} now reads ${new_value}

<!-- example -->
| field | new_value |
|-------|-----------|
| Title | QA lifecycle edit run |
| Description | Updated during lifecycle regression run |
| Environment | Browser:Firefox |

---

<!-- test
type: manual
priority: high
source: AC-27, ac-delta-6
automation: deferred
automation-note: Multi-user fixture required; cross-sub-feature coordination with #3 tester-assignment — validation here focuses on add/remove persistence only.
-->
## Adding and removing testers on an ongoing run via Edit Run persists the assignee set

## Preconditions
- An ongoing manual run exists
- Project has ≥2 additional users (besides the run creator) who are not yet assigned to the run

## Steps
- Open the ongoing run's extra menu and click 'Edit'
  - _Expected_: Edit Run form opens with the creator listed as manager and an empty additional-assignees list
- In the Assign users control, select two additional testers
  - _Expected_: Chosen testers appear as chips inside the assignees control
- Click 'Save'
  - _Expected_:
  - Success toast "Run has been updated" appears
  - Runs list row shows both assignees in the "Assigned to" column
- Reopen Edit Run and remove one of the testers via their chip's remove control
  - _Expected_: The removed tester's chip disappears from the assignees control; remaining assignee chip is still present
- Click 'Save'
  - _Expected_:
  - Remaining assignee still appears in the list
  - Removed assignee no longer appears in the "Assigned to" column on the Runs list row

---

<!-- test
type: manual
priority: high
source: AC-27, ac-delta-3
automation: candidate
-->
## Appending tests via the `+ Tests` tab on an ongoing run adds them as Pending

## Preconditions
- An ongoing manual run exists with a known initial test count N
- At least two manual tests exist in the project that are NOT part of this run

## Steps
- Open the ongoing run's extra menu and click 'Edit'
  - _Expected_: Edit Run form opens; 'Current tests N' tab is selected by default with the initial test count N shown in its badge
- Switch to the `+ Tests` tab (label `Tests 0`)
  - _Expected_: Tab content changes to show the project's test tree with per-test checkboxes
- Select two tests that are not currently in the run
  - _Expected_: Tab counter updates to `Tests 2`; chosen tests appear highlighted in the tree
- Click 'Save'
  - _Expected_:
  - Success toast "Run has been updated" appears
  - Run's test count increments to N+2 on the Runs list row
- Open the run's detail panel
  - _Expected_: The two newly added tests are listed with the Pending status indicator

---

<!-- test
type: manual
priority: normal
source: AC-27, ac-delta-4
automation: candidate
-->
## Appending a plan via the `+ Plans` tab on an ongoing run adds the plan's tests as Pending

## Preconditions
- An ongoing manual run exists with a known initial test count N
- A test plan exists containing ≥2 tests that are NOT already in the run

## Steps
- Open the ongoing run's extra menu and click 'Edit'
  - _Expected_: Edit Run form opens
- Switch to the `+ Plans` tab
  - _Expected_: Tab content shows the list of available plans with selection controls
- Select the fixture plan
  - _Expected_: Tab counter updates to reflect the number of tests the plan contributes
- Click 'Save'
  - _Expected_:
  - Success toast "Run has been updated" appears
  - Run's test count on the Runs list row increases by the plan's test count
  - All newly added tests carry the Pending status indicator

---

<!-- test
type: manual
priority: normal
source: AC-27, ac-delta-5
automation: candidate
-->
## Removing a test from an ongoing run via the row trash icon persists the removal

## Preconditions
- An ongoing manual run exists with ≥3 tests; at least one test is in the Pending state

## Steps
- Open the run's Edit form
  - _Expected_: 'Current tests N' tab renders the run's tests as rows
- Click the trash (delete) icon on one Pending test row
  - _Expected_: Row becomes visually marked for deletion (struck through or removed from the list) and the 'Current tests' counter decrements by 1
- Click 'Save'
  - _Expected_:
  - Success toast "Run has been updated" appears
  - Run's total test count on the Runs list decreases by 1
- Open the run's detail panel
  - _Expected_: The deleted test is no longer listed; remaining tests keep their statuses

---

<!-- test
type: manual
priority: normal
source: ac-delta-6
automation: candidate
-->
## Cancelling the Edit Run form discards pending changes @negative

## Preconditions
- An ongoing manual run exists

## Steps
- Open the run's Edit form
  - _Expected_: Form pre-fills with the current Title
- Change the Title to `TEMP-cancel-check`
  - _Expected_: Title input reflects `TEMP-cancel-check`
- Switch the Environment to a different value
  - _Expected_: Environment input reflects the new selection; Save button is enabled
- Click 'Cancel'
  - _Expected_:
  - Browser returns to the Runs list without a success toast
  - No notification indicates a save occurred
- Open the run's detail panel
  - _Expected_: Title still shows the original value (not `TEMP-cancel-check`) and Environment is unchanged

---

<!-- test
type: manual
priority: normal
source: AC-27, ac-delta-8
automation: candidate
-->
## Edit is not available on a finished run @negative @unclear

## Preconditions
- A finished manual run exists

## Steps
- Navigate to the 'Runs' page and open the extra menu on the finished run's row
  - _Expected_: Menu contains 'Relaunch', 'Advanced Relaunch', 'Launch a Copy' — and does NOT contain the 'Edit' item
- Click the run's row to open the Run Detail panel
  - _Expected_: Panel header does NOT render the inline Edit (pencil) icon; only 'Report' link, Copy Settings, and Close remain
- Navigate directly to `/projects/{project}/runs/edit/{id}/` for the finished run's ID
  - _Expected_: Either the Edit form redirects back to the run's detail page OR the form loads in a read-only/disabled state with Save unavailable — record the deterministic form so automation can assert the gate
