<!-- suite -->
# Multi-Select Mode

This nested suite covers the Multi-Select mode lifecycle inside the Manual Runner — entering the mode, exiting it, and clearing an active selection while staying in the mode. It does NOT cover per-test / per-suite checkbox selection mechanics (owned by `selection-mechanics.md`), the Result Message modal, the quick-set toolbar buttons, or any cross-cutting filter-scoped selection behaviour (those live in `bulk-status-application.md` and `cross-cutting.md`).

<!-- test
type: manual
priority: high
source: ac-delta-1, ac-delta-4
automation: candidate
-->
## Activate Multi-Select mode reveals per-test checkboxes @smoke

Activating Multi-Select turns the single-test result workflow into a bulk workflow by exposing per-test and per-suite checkboxes and switching the toolbar toggle to an active state.

## Preconditions
- An unfinished Manual Run exists with ≥ 1 suite containing ≥ 3 tests
- The Manual Runner for that run is open
- Multi-Select mode is currently inactive (no checkboxes visible in the tree)

## Steps
- Observe the runner filter toolbar
  - _Expected_: The "Multi-select" toggle button is visible next to the "Collapse all" button; its tooltip reads "Multi-select"
- Click the "Multi-select" toggle
  - _Expected_:
     - The toggle adopts its active (selected) visual state
     - Per-test and per-suite checkboxes appear in the runner test tree
- Observe the test tree
  - _Expected_: Every test row shows an unchecked checkbox at the left edge; every suite row shows an unchecked suite-level checkbox

<!-- test
type: manual
priority: high
source: ac-delta-2
automation: candidate
-->
## Toggling Multi-Select off clears the selection and hides the bulk toolbar

Exiting Multi-Select discards any active selection without applying it and removes the bulk-action bottom toolbar from the viewport.

## Preconditions
- Manual Runner open with Multi-Select mode active
- At least 2 tests currently selected; the bulk-action bottom toolbar is visible

## Steps
- Note the current selection count in the bulk-action bottom toolbar
  - _Expected_: The toolbar displays "${N} tests selected" with N ≥ 2
- Click the "Multi-select" toggle (currently active)
  - _Expected_:
     - "Multi-select" toggle returns to its inactive visual state
     - All per-test and per-suite checkboxes are removed from the test tree
     - The bulk-action bottom toolbar is no longer rendered
- Click the "Multi-select" toggle again to re-enter the mode
  - _Expected_:
     - Checkboxes re-appear in the tree
     - All checkboxes are in the unchecked state — the previous selection is NOT restored

<!-- test
type: manual
priority: normal
source: ac-delta-11
automation: candidate
-->
## Clearing the selection keeps Multi-Select mode active with an empty selection @boundary

The Clear Selection affordance in the bulk toolbar wipes the current selection without leaving Multi-Select, so the user can immediately start a new bulk workflow.

## Preconditions
- Manual Runner open with Multi-Select mode active
- At least 2 tests currently selected; the bulk-action bottom toolbar is visible

## Steps
- Locate the "Clear Selection" (×) icon at the right edge of the bulk-action bottom toolbar
  - _Expected_: The "Clear Selection" (×) icon is visible within the toolbar
- Click the "Clear Selection" (×) icon
  - _Expected_:
     - All test and suite checkboxes return to the unchecked state
     - The bulk-action bottom toolbar is no longer rendered
- Observe the runner filter toolbar
  - _Expected_: The "Multi-select" toggle is still in its active state — Multi-Select mode remains on
- Click one test checkbox
  - _Expected_:
     - The test row gains the selected highlight
     - The bulk-action bottom toolbar re-appears showing "1 tests selected"
