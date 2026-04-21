<!-- suite -->
# Cross-cutting — Filter Scope and Bulk Multi-Select

This nested suite covers the two cross-cutting concerns that intersect bulk-status-actions:

- **Concern F (Filter applied vs not)** — when a filter is active in the runner, selection methods and bulk apply target only the filter-matching tests.
- **Concern H (Bulk multi-select mode)** — the canonical end-to-end bulk Result Message flow, including the optional message persisting alongside the bulk-applied status.

It does NOT re-test Multi-Select mode lifecycle, per-test selection mechanics, or the generic Result Message modal validation — those live in their respective nested suites.

<!-- test
type: manual
priority: normal
source: AC-66, ac-delta-3
automation: candidate
-->
## Suite-level checkbox with a status filter active selects only filter-matching tests @boundary

Concern F — with a status filter reducing the tree, the suite-level checkbox must only select the visible (filter-matching) tests; tests excluded by the filter must not be secretly added to the selection.

## Preconditions
- Unfinished Manual Run with a suite containing 6 Pending tests and 3 Passed tests
- Manual Runner open with Multi-Select mode active
- No filter applied initially; no tests selected

## Steps
- Click the "Passed" filter in the runner header status counter bar
  - _Expected_: The test tree is reduced to show only the 3 Passed tests under that suite
- Click the suite-level checkbox for that suite
  - _Expected_:
     - The 3 filter-matching test checkboxes become checked
     - The bulk-action bottom toolbar appears showing "3 tests selected"
- Click the "Passed" filter again to clear the filter
  - _Expected_:
     - The test tree expands back to show all 9 tests in the suite
     - The 3 previously selected tests remain checked
     - The 6 Pending tests stay unchecked — they were NOT retroactively added to the selection
     - The bulk-action bottom toolbar still shows "3 tests selected"

<!-- test
type: manual
priority: critical
source: AC-66, AC-94, AC-95, ac-delta-6, ac-delta-8, ac-delta-9
automation: candidate
-->
## Bulk Result Message apply with a status filter active affects only filter-matching tests @boundary

Concerns F + H end-to-end — a bulk apply performed under an active filter must propagate the new status to every selected (filter-matching) test, leave filter-excluded tests untouched, and update the header counters accordingly.

## Preconditions
- Unfinished Manual Run with ≥ 6 Pending and ≥ 3 Passed tests under the same suite
- Manual Runner open with Multi-Select mode active
- The "Pending" filter is active — only Pending tests are visible in the tree
- Runner header status counters captured as baseline

## Steps
- Click the suite-level checkbox under the filtered view
  - _Expected_: The bulk-action bottom toolbar shows a selection count equal to the number of currently visible Pending tests (6 in this suite configuration)
- Click the "Result message" icon in the bulk-action bottom toolbar
  - _Expected_: The "Result message" modal opens with Apply disabled
- Click the "Failed" status button
  - _Expected_: "Failed" adopts its selected visual state; Apply becomes enabled
- Click the Apply button
  - _Expected_:
     - The modal closes; the bulk-action bottom toolbar disappears
     - The tree (under the still-active Pending filter) becomes empty because the previously selected tests are no longer Pending
- Click the "Pending" filter again to clear it
  - _Expected_:
     - All 9 tests become visible
     - The 3 previously Passed tests still show the Passed status icon — they were NOT affected by the bulk apply
     - The 6 previously selected tests now show the FAILED status icon
- Observe the runner header status counters
  - _Expected_:
     - The "Failed" counter increased by 6 relative to the captured baseline
     - The "Pending" counter decreased by 6 relative to the captured baseline
     - The "Passed" counter is unchanged

<!-- test
type: manual
priority: high
source: AC-30, AC-93, AC-94, ac-delta-6, ac-delta-8
automation: candidate
-->
## Bulk apply with a message persists the status and the message together

Concern H — the canonical bulk Result Message flow with a message filled in. The bulk operation commits the status AND the message as a single unit; both must be visible on every affected test after apply.

## Preconditions
- Unfinished Manual Run with at least 2 Pending tests
- Manual Runner open with Multi-Select mode active
- 2 Pending tests selected across different suites

## Steps
- Click the "Result message" icon in the bulk-action bottom toolbar
  - _Expected_: The "Result message" modal opens; Apply disabled
- Click the "Passed" status button
  - _Expected_: "Passed" adopts its selected state; Apply becomes enabled
- Type "Bulk smoke: manual review OK" in the Result message textarea
  - _Expected_: The entered text is visible in the textarea
- Click the Apply button
  - _Expected_:
     - The modal closes; the bulk-action bottom toolbar disappears
     - Both previously selected tests display the Passed status icon in the tree
- Click the first previously selected test row to open its detail pane
  - _Expected_: The test detail pane shows the Passed status with the result message "Bulk smoke: manual review OK"
- Click the second previously selected test row to open its detail pane
  - _Expected_: The test detail pane shows the Passed status with the same result message "Bulk smoke: manual review OK"

<!--
Validation Log (ui-validator subagent, 2026-04-19):
Mismatches fixed: 2 (modal status button labels corrected from "FAILED"/"PASSED" to "Failed"/"Passed" — same fix pattern as bulk-status-application.md).
Toolbar quick-set labels + "FAILED status icon" phrasing left intact (those are status-label references, not button labels).
Gaps: 0.
-->

