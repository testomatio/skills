<!-- suite -->
# Advanced Relaunch

Covers the Advanced Relaunch sidebar — the only lifecycle action that can create a new run from a finished one and preserve or reset per-test statuses. The sidebar exposes a custom Title, a 'Create new run' toggle, a 'Keep values' toggle (gated on 'Create new run'), per-test selection with filter-aware 'Select All', and a terminal 'Relaunch' action. Row-menu variants are owned by basic-relaunch.md; CI-routing variants live in cross-cutting.md as @unclear.

<!-- test
type: manual
priority: critical
source: AC-64, ac-delta-2
automation: candidate
-->
## Advanced Relaunch with 'Create new run' OFF reuses the original Run ID and resets selected tests to Pending @smoke

## Preconditions
- A finished manual run exists with ≥3 tests and mixed outcomes (≥1 Passed, ≥1 Failed)
- Note the finished run's short ID and the status of each test

## Steps
- Navigate to the 'Runs' page and open the finished run's extra menu → 'Advanced Relaunch'
  - _Expected_: Advanced Relaunch sidebar opens; heading shows the source run's title
- Leave 'Create new run' toggle OFF (default)
  - _Expected_: 'Keep values' toggle is disabled (greyed out)
- Select two specific tests from the list (one previously Passed, one previously Failed)
  - _Expected_: Each chosen row shows a checked checkbox
- Click 'Relaunch'
  - _Expected_:
  - Sidebar closes
  - Browser navigates to the runner for the SAME original run ID (no new ID)
- Inspect the test tree in the runner
  - _Expected_:
  - Selected two tests show the Pending status indicator (reset)
  - Unselected tests retain their prior Passed/Failed/Skipped statuses
  - Run count in the list did NOT increase

---

<!-- test
type: manual
priority: critical
source: AC-63, ac-delta-2, ac-delta-13
automation: candidate
-->
## Advanced Relaunch with 'Create new run' ON creates a new Run ID inheriting the source metadata @smoke

## Preconditions
- A finished manual run exists with ≥2 tests

## Steps
- Open the finished run's extra menu → 'Advanced Relaunch'
  - _Expected_: Advanced Relaunch sidebar opens
- Toggle 'Create new run' to ON
  - _Expected_: 'Keep values' toggle becomes enabled (no longer greyed out)
- Leave the Title blank and leave 'Keep values' OFF
  - _Expected_: Title field is empty; 'Keep values' toggle remains OFF
- Click 'Select all (N)' to select every test, then click 'Relaunch'
  - _Expected_:
  - Sidebar closes
  - Browser navigates to a runner whose URL uses a DIFFERENT run ID than the source
- Return to the 'Runs' list
  - _Expected_:
  - A NEW run row is present alongside the source finished run
  - New run's title inherits the source (with an optional relaunch indicator)
  - New run's tests are all Pending

---

<!-- test
type: manual
priority: high
source: ac-delta-11
automation: candidate
-->
## 'Keep values' toggle is disabled while 'Create new run' is OFF @negative @boundary

## Preconditions
- A finished manual run exists

## Steps
- Open the finished run's extra menu → 'Advanced Relaunch'
  - _Expected_: Advanced Relaunch sidebar opens with 'Create new run' toggle OFF by default
- Inspect the 'Keep values' toggle
  - _Expected_: 'Keep values' toggle is visually greyed out and not interactive
- Toggle 'Create new run' to ON
  - _Expected_: 'Keep values' toggle becomes enabled (interactive)
- Toggle 'Create new run' back to OFF
  - _Expected_: 'Keep values' toggle returns to its disabled state regardless of its last value

---

<!-- test
type: manual
priority: high
source: AC-65, AC-63
automation: candidate
-->
## 'Keep values' ${keep_values_state} with 'Create new run' ON ${expected_outcome} @boundary

## Preconditions
- A finished manual run exists with ≥2 tests, at least one Passed and at least one Failed
- Record the status of each test in the source run

## Steps
- Open 'Advanced Relaunch' for the finished run
- Toggle 'Create new run' to ON
- Toggle 'Keep values' to ${keep_values_state}
  - _Expected_: Toggles are set as requested and are both enabled/interactive
- Select both test rows via their checkboxes, then click 'Relaunch'
  - _Expected_:
  - Sidebar closes; browser navigates to the NEW run's runner
- Inspect the new run's test tree
  - _Expected_: ${expected_outcome}

<!-- example -->
| keep_values_state | expected_outcome                                                                                                              |
|-------------------|------------------------------------------------------------------------------------------------------------------------------|
| ON                | Each selected test retains its source status (Passed / Failed) in the new run; nothing was reset to Pending                 |
| OFF               | Each selected test appears as Pending in the new run; prior Passed/Failed statuses were NOT preserved                        |

---

<!-- test
type: manual
priority: normal
source: AC-62, ac-delta-12, ac-delta-13
automation: candidate
-->
## Advanced Relaunch with a custom Title and per-test selection relaunches only the chosen tests

## Preconditions
- A finished manual run exists with ≥4 tests; record which tests were Passed vs Failed

## Steps
- Open 'Advanced Relaunch' for the finished run
- Fill the Title field with `Relaunch subset — advanced`
  - _Expected_: Title input reflects the typed value
- Toggle 'Create new run' ON and leave 'Keep values' OFF
  - _Expected_: 'Create new run' is ON; 'Keep values' is enabled but OFF
- Tick exactly two test checkboxes — both previously Passed
  - _Expected_: Only the two rows are checked; 'Select all (N)' is NOT activated
- Click 'Relaunch'
  - _Expected_:
  - Sidebar closes
  - Browser navigates to a NEW run whose title reads `Relaunch subset — advanced`
- Inspect the new run's test tree
  - _Expected_:
  - New run's test list equals the source run's full test list (same scope)
  - The two selected tests are Pending
  - The unselected tests retain their source statuses

---

<!-- test
type: manual
priority: normal
source: AC-66, ac-delta-12
automation: candidate
-->
## 'Select all' inside Advanced Relaunch respects an active status filter

## Preconditions
- A finished manual run exists with a known mixture: at least 2 Passed, 2 Failed, 1 Skipped

## Steps
- Open 'Advanced Relaunch' for the finished run
- Click the status filter 'Failed N' above the test list
  - _Expected_: Test list narrows to Failed tests only; list header reflects the active filter
- Open the 'Select' control and click 'Select all (N)' where N equals the visible Failed count
  - _Expected_: Only the visible (Failed) tests are checked; Passed and Skipped rows remain unselected (verify by clearing the filter)
- Clear the status filter
  - _Expected_: All source-run tests are visible again; only the previously Failed tests remain checked — Passed and Skipped are not selected
- Toggle 'Create new run' ON
  - _Expected_: 'Keep values' toggle becomes enabled
- Click 'Relaunch'
  - _Expected_:
  - New run is created and opens in the runner
  - Only the originally Failed tests are Pending; all others retain their source statuses

---

<!-- test
type: manual
priority: normal
source: AC-62
automation: candidate
-->
## Cancelling the Advanced Relaunch sidebar leaves the source run unchanged @negative

## Preconditions
- A finished manual run exists; record the current run count for the project

## Steps
- Open 'Advanced Relaunch' for the finished run
  - _Expected_: Sidebar opens with Title input, toggles, and test list
- Fill the Title with `Should not persist`, toggle 'Create new run' ON, tick a subset of tests
  - _Expected_: Sidebar reflects the user's input
- Click 'Cancel' (or the close × control)
  - _Expected_:
  - Sidebar closes without navigating to a runner
  - No toast about a new or relaunched run appears
- Return to the 'Runs' page
  - _Expected_:
  - Total run count is unchanged
  - Source finished run still has all its prior statuses intact

---
