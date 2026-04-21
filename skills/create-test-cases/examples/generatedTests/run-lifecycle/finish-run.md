<!-- suite -->
# Finish Run

Covers the terminal transition of an in-progress manual run: the browser native Finish Run confirmation dialog, its cancel path, and invoking Finish from the Runs list row context menu. The runtime semantics inside the Manual Runner (PASSED/FAILED/SKIPPED entry, result messages) are owned by #2 test-execution-runner; here we verify only the transition itself and its side effects on run status and Pending tests.

<!-- test
type: manual
priority: critical
source: AC-25, AC-26, AC-28, ac-delta-9
automation: candidate
-->
## Finish Run confirms and terminates the run, marking Pending tests as Skipped @smoke

## Preconditions
- An ongoing manual run exists in the current project with ≥1 PASSED test and ≥1 Pending test
- Current user has permission to finish the run

## Steps
- Navigate to the run's Manual Runner via the Runs list row "Launch" action
  - _Expected_: URL matches `/projects/{project}/runs/launch/{id}/`; runner opens with the test tree on the left
- Click the 'Finish Run' button in the runner header
  - _Expected_:
  - Browser native confirmation dialog appears
  - Message reads `"{N} tests were not run. Pending tests that are not linked to any other test result will be marked as skipped."` where `{N}` equals the current Pending count
- Accept the confirmation by clicking 'OK'
  - _Expected_:
  - Dialog dismisses
  - Browser navigates to the run detail view for the same run ID
  - Run status indicator changes to the aggregated finished colour (green when all remaining tests pass, red when any failed)
- Open the run detail panel and verify the per-status counters
  - _Expected_:
  - Passed count matches pre-finish value
  - Skipped count equals the pre-finish Pending count (Pending tests were converted to Skipped)
  - Pending count is 0

---

<!-- test
type: manual
priority: high
source: AC-28, ac-delta-10
automation: candidate
-->
## Cancelling the Finish Run confirmation leaves the run ongoing @negative

## Preconditions
- An ongoing manual run exists in the current project with ≥1 Pending test
- Current user is inside the Manual Runner for that run

## Steps
- Click the 'Finish Run' button in the runner header
  - _Expected_: Browser native confirmation dialog appears with the "{N} tests were not run…" message
- Dismiss the dialog by clicking the browser's 'Cancel' button
  - _Expected_:
  - Dialog closes without navigation
  - Runner URL remains on `/projects/{project}/runs/launch/{id}/`
  - Test tree, status counters, and current test panel are unchanged
- Return to the Runs list and open the run's detail panel
  - _Expected_:
  - Run status indicator remains in the in-progress (orange) state
  - Pending counter is unchanged from its pre-Finish value

---

<!-- test
type: manual
priority: normal
source: AC-25, AC-28, ac-delta-9
automation: candidate
-->
## Finish Run when every test already has a result still surfaces the confirmation with count 0 @boundary

## Preconditions
- An ongoing manual run exists in which every test is already marked PASSED, FAILED, or SKIPPED (Pending count = 0)

## Steps
- Open the run's Manual Runner from the Runs list
  - _Expected_: Runner header shows `Pending 0`
- Click the 'Finish Run' button
  - _Expected_:
  - Browser native confirmation dialog appears
  - Message still renders with the `{N}` placeholder resolved to `0` (exact wording `"0 tests were not run…"`) OR the standard confirmation variant — record whichever the UI shows so that automation can assert the deterministic form
- Accept the dialog by clicking 'OK'
  - _Expected_:
  - Run transitions to Finished
  - No new Skipped tests were introduced by Finish (Skipped counter equals its pre-Finish value)

---
