<!-- suite -->
# Scope Selection

Behaviour of the four mutually-exclusive scope tabs (All tests / Test plan / Select tests / Without tests) inside the New Manual Run sidebar.

<!-- test
type: manual
priority: critical
source: AC-2, AC-3, AC-23
automation: candidate
-->
## "All tests" is the default scope and Launch creates a run with every manual test @smoke

The default scope must cover every manual test in the project; this is the most common launch path.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Inspect the scope tabs row
  - _Expected_:
  - Tabs listed in order: "All tests", "Test plan", "Select tests", "Without tests"
  - "All tests" is the active (selected) tab by default
- Note the project's total manual tests count shown elsewhere (e.g. Tests page sidebar) or recorded as ${manual_test_count}
  - _Expected_: A non-zero number of manual tests exists in the project
- Fill the Title with "All tests default scope"
  - _Expected_: Title input shows the value
- Click 'Launch'
  - _Expected_:
  - Success toast "Run has been started" is shown
  - URL becomes `/projects/{project}/runs/launch/{id}/?entry={testId}`
  - Manual Runner opens with the left-side test tree showing every manual test in the project
  - Runner header counter shows `0/${manual_test_count} tests (0% completed)` (or equivalent)

<!-- test
type: manual
priority: high
source: AC-5, AC-19, AC-20, ac-delta-9
automation: candidate
-->
## Select tests — browse tree, search, toggle tests, and Launch creates run with the picked subset

The Select tests tab supports fine-grained picking; the selected-count must update in real time and only chosen tests must be included.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Select tests' scope tab
  - _Expected_:
  - "Select tests" tab becomes active
  - Test tree checkboxes become enabled
  - Search input is visible above the tree
  - A selected-tests counter is visible (starting at 0)
- Expand one suite by clicking its expand chevron
  - _Expected_: Child tests become visible under the suite
- Type a query in the search input that matches only a subset of tests (e.g. "login")
  - _Expected_: Tree filters to show only tests whose title contains the query; counter remains 0
- Tick the checkbox next to two test rows (one at a time)
  - _Expected_:
  - After each tick, the selected-tests counter increments by 1 (0 → 1 → 2)
  - Both test rows show checked-state
- Clear the search input
  - _Expected_: Tree shows all tests again; the two selected tests remain checked; counter still shows 2
- Fill the Title with "Select tests happy path"
  - _Expected_: Title input shows the value
- Click 'Launch'
  - _Expected_:
  - Success toast "Run has been started" is shown
  - Manual Runner opens with exactly the two chosen tests in the left-side tree (not more, not fewer)

<!-- test
type: manual
priority: high
source: AC-4, AC-21
automation: candidate
-->
## Test plan — selecting multiple plans unions their tests into the run

Multiple plans can be selected; the resulting run must include the union of tests from all selected plans.

## Preconditions

- At least two existing Test plans in the project, each with a known non-zero number of tests (e.g. plan A with `${planA_count}` tests and plan B with `${planB_count}` tests).

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Test plan' scope tab
  - _Expected_: "Test plan" tab becomes active; a plan selector with a list/dropdown of existing plans is visible
- Select two existing plans (plan A and plan B)
  - _Expected_:
  - Both plans show a selected state
  - The selected-tests counter reflects the union of tests from plan A and plan B
- Fill the Title with "Test plan union"
  - _Expected_: Title input shows the value
- Click 'Launch'
  - _Expected_:
  - Success toast "Run has been started" is shown
  - Manual Runner opens with the union of tests from both plans visible in the tree
  - Runner header test count matches the counter shown in the sidebar before Launch

<!-- test
type: manual
priority: high
source: AC-6, AC-22, ac-delta-11
automation: candidate
-->
## Without tests — Launch creates an empty run and navigates to the runner shell

An empty run must be launchable for later population via Edit / +Tests.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Without tests' scope tab
  - _Expected_:
  - "Without tests" tab becomes active
  - Test tree area shows an empty state (no selectable checkboxes)
  - Selected-tests counter shows 0 or the counter is hidden
- Fill the Title with "Empty run"
  - _Expected_: Title input shows the value
- Click 'Launch'
  - _Expected_:
  - Success toast "Run has been started" is shown
  - URL becomes `/projects/{project}/runs/launch/{id}/` (no `?entry={testId}` fragment)
  - Manual Runner opens with an empty left-side tree and an empty execution panel
  - Runner header shows 0 tests total

<!-- test
type: manual
priority: normal
source: AC-2, ac-delta-8
automation: candidate
-->
## Scope tabs are mutually exclusive — switching clears previously selected tests @boundary

Scope tabs behave as a single-select radio group; switching must not silently carry selection across tabs.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens with "All tests" active
- Click the 'Select tests' scope tab and select 2 tests from the tree
  - _Expected_: "Select tests" tab is active; selected-tests counter shows 2
- Click the 'Test plan' scope tab
  - _Expected_:
  - "Test plan" tab becomes active
  - "Select tests" tab is deselected
  - The previously-selected 2 tests no longer count towards the run
- Click the 'Select tests' scope tab again
  - _Expected_:
  - "Select tests" tab becomes active
  - Selected-tests counter is 0 (previous selection was discarded)
  - Test tree checkboxes are all unchecked
- Fill the Title with "Scope exclusivity check"
  - _Expected_: Title input shows the value
- Click 'Launch'
  - _Expected_:
  - Launch proceeds with whatever is currently selected (zero tests) or falls back to the "no tests" path — UI does not silently include tests selected in the earlier pass

<!-- test
type: manual
priority: normal
source: ac-delta-9
automation: candidate
-->
## Test tree checkboxes are disabled outside the Select tests tab @negative

Checkboxes on the tree must not be clickable when the active scope is All tests / Test plan / Without tests.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens with "All tests" active
- Attempt to tick a suite-row checkbox in the tree while "All tests" is active
  - _Expected_: Checkbox is rendered disabled/inactive; clicking has no effect (no tick appears)
- Click the 'Test plan' scope tab and inspect any tree-area checkboxes
  - _Expected_: Tree-area checkboxes are hidden or disabled; no per-test selection is possible in this tab
- Click the 'Without tests' scope tab
  - _Expected_: Tree area shows empty state; no checkboxes are present
- Click the 'Select tests' scope tab
  - _Expected_: Tree checkboxes become enabled and clickable; ticking a checkbox marks it as selected

<!-- test
type: manual
priority: low
source: AC-5, ac-delta-11
automation: candidate
-->
## Launching Select tests scope with zero tests selected @boundary @negative

Zero-selection is an edge case; the UI must either block Launch or fall through to a zero-tests run consistent with the Without-tests scope.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Select tests' scope tab
  - _Expected_: "Select tests" tab is active; selected-tests counter shows 0
- Do NOT tick any test
  - _Expected_: Counter still shows 0
- Fill the Title with "Select tests zero selection"
  - _Expected_: Title value is typed; counter still shows 0
- Click the 'Launch' button
  - _Expected_:
  - Either: Launch is blocked with a field-highlight / warning communicating that at least one test must be selected, AND the sidebar stays open
  - Or: Launch proceeds and creates an empty run equivalent to the Without-tests scope (navigates to the runner shell with 0 tests)
  - In either case, no run is created with a non-zero test count

<!-- test
type: manual
priority: normal
source: AC-5, AC-19, ac-delta-9
automation: candidate
-->
## Select tests search with a zero-match query shows empty state @negative @boundary

Empty-result searches in the test tree must surface a clear empty state, not a silent blank tree.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Select tests' scope tab
  - _Expected_: "Select tests" tab becomes active; test tree is visible; selected-tests counter shows 0
- Type a query into the search input that cannot match any existing test (e.g. "zzzzzzzzz-nomatch-xyz")
  - _Expected_:
  - Tree displays a "No matched tests" (or "0 tests matched") empty-state indicator
  - No suite or test rows are shown
  - Selected-tests counter remains 0
- Clear the search input
  - _Expected_:
  - Tree reverts to showing all suites/tests
  - Counter remains 0
  - Empty-state indicator is gone

<!-- test
type: manual
priority: normal
source: AC-5, AC-20, ac-delta-9
automation: candidate
-->
## Selected-tests counter decrements back to 0 when a selected test is unticked @boundary

The counter must react to both ticking and unticking — a round-trip to zero verifies state-transition correctness.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Select tests' scope tab
  - _Expected_: "Select tests" tab is active; counter shows 0
- Expand a suite and tick the checkbox next to one test
  - _Expected_: Counter increments from 0 to 1; the test row shows checked-state
- Tick a second test
  - _Expected_: Counter shows 2
- Untick the first test
  - _Expected_:
  - Counter decrements from 2 to 1
  - The unticked test row shows unchecked-state
- Untick the second test
  - _Expected_:
  - Counter decrements back to 0
  - No test rows remain in a checked state

<!-- test
type: manual
priority: normal
source: AC-4, AC-21
automation: deferred
automation-note: requires a project fixture with zero Test plans — not the default test project state
-->
## Test plan tab empty state shows "No test plans found" when none exist @negative

Empty-state behaviour of the Test plan tab must be functional — the user must understand why no plans are listed and have a path forward.

## Preconditions

- The project has zero existing Test plans (fresh project or all plans deleted/archived).

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Test plan' scope tab
  - _Expected_: "Test plan" tab becomes active
- Inspect the plan-selector area
  - _Expected_:
  - An empty-state message is visible (e.g. "No test plans found." or similar)
  - No selectable plan rows are shown
  - A "create new plan" action/link is visible as the recommended next step
- Click the 'Launch' button without selecting any plan
  - _Expected_:
  - Launch is blocked, or proceeds as an empty-tests run — the UI does not silently create a broken run with zero valid scope
