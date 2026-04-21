<!-- suite -->
# Selection Mechanics

This nested suite covers how tests are added to and removed from a bulk selection inside the Manual Runner — per-test checkboxes, the suite-level checkbox, the live selection counter, and the zero-selection state. It does NOT cover entering / exiting Multi-Select mode (owned by `multi-select-mode.md`), applying a status (owned by `bulk-status-application.md`), or filter-scoped selection behaviour (owned by `cross-cutting.md`).

<!-- test
type: manual
priority: normal
source: ac-delta-4
automation: candidate
-->
## Per-test checkboxes update the selection counter as they toggle

The bulk-action bottom toolbar's "${N} tests selected" counter reacts to every individual check and uncheck, and disappears entirely when the selection returns to zero.

## Preconditions
- Manual Runner open with Multi-Select mode active
- The test tree shows ≥ 3 tests in a single expanded suite
- No tests currently selected

## Steps
- Click the first test checkbox
  - _Expected_:
     - The row gains the selected highlight
     - The bulk-action bottom toolbar appears showing "1 tests selected"
- Click the second test checkbox
  - _Expected_: Toolbar counter updates to "2 tests selected"
- Click the second test checkbox again to uncheck it
  - _Expected_:
     - The second row loses the selected highlight
     - Toolbar counter updates to "1 tests selected"
- Click the first test checkbox again to uncheck it
  - _Expected_:
     - The first row loses the selected highlight
     - The bulk-action bottom toolbar is no longer rendered (selection count is 0)

<!-- test
type: manual
priority: normal
source: ac-delta-3
automation: candidate
-->
## Suite-level checkbox selects every test in the suite

The suite-level checkbox is a convenience select-all for the suite's tests when no filter is applied; toggling it off clears the same selection.

## Preconditions
- Manual Runner open with Multi-Select mode active
- One suite expanded with exactly 6 tests visible; no filter applied
- No tests currently selected

## Steps
- Click the suite-level checkbox at the suite row
  - _Expected_:
     - Every test checkbox under that suite becomes checked
     - The bulk-action bottom toolbar shows "6 tests selected"
- Observe the 6 selected test rows in the tree
  - _Expected_: Each of the 6 rows shows the selected-row highlight consistent with individually-checked rows
- Click the suite-level checkbox again
  - _Expected_:
     - Every test checkbox under the suite becomes unchecked
     - Every row loses its selected highlight
     - The bulk-action bottom toolbar is no longer rendered

<!-- test
type: manual
priority: normal
source: ac-delta-5
automation: candidate
-->
## Bulk-action toolbar is not rendered when no tests are selected @boundary

The bulk-action toolbar has no empty-state variant; it is absent until the first test is checked and disappears the moment the last selection is removed.

## Preconditions
- Manual Runner open with Multi-Select mode active
- No tests currently selected

## Steps
- Observe the bottom of the runner viewport
  - _Expected_: No bulk-action toolbar is rendered — there is no empty-state toolbar with a disabled Apply
- Select a test by clicking its checkbox
  - _Expected_: The bulk-action bottom toolbar appears and shows "1 tests selected"
- Deselect the same test by clicking its checkbox again
  - _Expected_: The bulk-action bottom toolbar is immediately removed from the viewport
