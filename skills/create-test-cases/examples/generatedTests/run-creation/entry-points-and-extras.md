<!-- suite -->
# Entry Points and Extras

Run creation entered from the Tests page (per-suite, multi-select, per-test). The arrow-dropdown extras (New Group / Mixed Run / Launch from CLI / Report Automated Tests) are covered in `dialog-lifecycle.md`.

<!-- test
type: manual
priority: high
source: AC-12, ac-delta-17
automation: candidate
-->
## From Tests page, suite extra menu → 'Run Tests' pre-populates creation in Select tests tab

Launching a run for a specific suite from the Tests page must open the New Manual Run flow with that suite's tests pre-selected.

## Preconditions

- At least one suite on the Tests page with a known non-zero test count (e.g. suite "${suite_name}" with ${suite_test_count} tests).

## Steps

- Navigate to the 'Tests' page
  - _Expected_: Tests page is displayed with the suite tree on the left
- Locate the suite "${suite_name}" and click its '...' extra menu
  - _Expected_: Extra-menu popover opens near the suite row with a list of actions
- Click the 'Run Tests' action
  - _Expected_:
  - New Manual Run sidebar / modal opens
  - Scope defaults to "Select tests"
  - The "${suite_name}" suite appears expanded in the test tree with its tests pre-selected (checkboxes ticked)
  - Selected-tests counter matches ${suite_test_count}
- Fill the Title with "Run from suite entry" and click 'Launch'
  - _Expected_:
  - Success toast "Run has been started" is shown
  - Manual Runner opens with exactly the suite's tests in the left tree (counter in the runner header matches ${suite_test_count})

<!-- test
type: manual
priority: high
source: AC-12, ac-delta-17
automation: candidate
-->
## From Tests page Multi-select, 'Run Tests' pre-populates creation with the union of selected items

The Multi-select bottom bar on the Tests page must allow batching multiple suites/tests into one creation flow with all selected items pre-chosen.

## Preconditions

- At least two suites available on the Tests page with known distinct test counts (suite A = ${suiteA_count}, suite B = ${suiteB_count}).

## Steps

- Navigate to the 'Tests' page
  - _Expected_: Tests page is displayed
- Enable Multi-select mode (via the Multi-select toggle in the toolbar)
  - _Expected_: Checkboxes appear next to each suite/test row
- Tick the checkbox of suite A and suite B
  - _Expected_:
  - Multi-select bottom bar shows "${suiteA_count + suiteB_count}" items selected
  - 'Run Tests' (or equivalent "Run") action is visible in the bottom bar
- Click the 'Run Tests' action in the bottom bar
  - _Expected_:
  - New Manual Run sidebar / modal opens
  - Scope is set to "Select tests"
  - Both suites are pre-expanded in the tree with their tests pre-selected
  - Selected-tests counter equals the union of tests (${suiteA_count + suiteB_count})
- Fill the Title with "Run from multi-select union" and click 'Launch'
  - _Expected_:
  - Success toast "Run has been started" is shown
  - Manual Runner opens with the union of tests listed in the tree

<!-- test
type: manual
priority: normal
source: AC-11, ac-delta-16
automation: deferred
automation-note: affordance identity is @unclear — may be a dedicated "Add to Run" button or the Multi-select-with-1-selection equivalent; confirm with product before locking automation
-->
## From Tests page, single-test "Add to Run" lists only unfinished runs as destinations @unclear

A single test row must expose an affordance to add the test to an existing unfinished run, and the destination list must be limited to unfinished runs only.

## Preconditions

- At least one unfinished run exists in the project (title = "${unfinished_run_title}", status = in-progress).
- At least one finished run exists in the project (title = "${finished_run_title}", status = passed/failed).

## Steps

- Navigate to the 'Tests' page
  - _Expected_: Tests page is displayed
- Locate a test row and invoke its "Add to Run" affordance (per-test extra menu, detail-page action, or Multi-select-with-1 bottom-bar "Run" — exact locator to be confirmed with product)
  - _Expected_: An "Add to Run" selector (dropdown or dialog) opens
- Inspect the destination list
  - _Expected_:
  - "${unfinished_run_title}" is listed as a selectable destination
  - "${finished_run_title}" is NOT listed (finished runs cannot receive new tests)
  - If no unfinished runs existed, the dialog would instead offer to create a new run
- Select "${unfinished_run_title}" from the destination list and confirm
  - _Expected_:
  - The chosen test is added to the target run
  - Success toast (e.g. "Test added to run") is shown
  - Opening the target run shows the chosen test in its tree

<!-- test
type: manual
priority: normal
source: AC-12, ac-delta-17
automation: candidate
-->
## Multi-select bar 'Run Tests' is disabled when zero items are selected @negative

The bulk "Run Tests" action must not be available until the user has selected at least one suite or test.

## Steps

- Navigate to the 'Tests' page
  - _Expected_: Tests page is displayed with the suite tree
- Enable Multi-select mode via the Multi-select toggle
  - _Expected_:
  - Checkboxes appear next to each suite/test row
  - Multi-select bottom bar is visible
  - 'Run Tests' action in the bottom bar is rendered in a disabled/inactive state
- Verify the bottom bar with zero ticks
  - _Expected_: Bottom bar shows "0 items selected" (or equivalent); 'Run Tests' cannot be activated by click
- Tick one suite checkbox
  - _Expected_:
  - Bottom bar updates to show at least 1 item selected
  - 'Run Tests' action becomes enabled and clickable
- Untick the suite
  - _Expected_: Bottom bar reverts to 0 items; 'Run Tests' returns to disabled state
