<!-- suite -->
# Detail Pane and Tree

Runner entry gating, detail-pane resize handle, runner-header Extra options menu toggles, priority filtering, and filter-scoped navigation. Does NOT cover shared chrome already documented in `_shared-ui.md` (sidebar, breadcrumbs, Collapse-all toolbar button).

<!-- test
type: manual
priority: normal
source: ac-delta-1
automation: candidate
-->
## Opening a finished run does not present the Manual Runner @negative

The Manual Runner is a live execution surface. Once a run has transitioned to Finished, reopening it must route to the Run Report rather than the runner.

## Preconditions

- At least one run exists in the project in the Finished state

## Steps

- Navigate to the 'Runs' page
  - _Expected_: Runs list shows both ongoing and finished runs
- Click the title of the Finished run
  - _Expected_:
  - URL resembles `/projects/{project}/runs/{run_id}/` (not `/runs/launch/{run_id}/`)
  - The Run Report is displayed (with Tests / Statistics / Defects tabs and summary widgets)
  - No runner-specific affordances such as 'Create notes +' or 'Finish Run' are visible
- Return to the Runs list and click the title of an ongoing run
  - _Expected_: URL becomes `/projects/{project}/runs/launch/{run_id}/`; the Manual Runner loads with the test tree and detail pane

<!-- test
type: manual
priority: low
source: ac-delta-14
automation: deferred
automation-note: deferred — drag-based splitter resize is automation-fragile and the exact drag offset needs tolerance; not a high-value candidate for automation
-->
## Resize handle between the tree and the detail pane changes pane widths

A horizontal splitter between the left tree panel and the right detail pane lets the user rebalance screen real estate.

## Preconditions

- An ongoing manual run is open in the Manual Runner

## Steps

- Note the current widths of the tests tree panel and the detail pane
  - _Expected_: Both panels are visible side-by-side with a visible splitter (vertical gutter) between them
- Drag the splitter leftwards by roughly 100 pixels
  - _Expected_:
  - Tests tree panel becomes narrower
  - Detail pane becomes correspondingly wider
  - Content inside both panels reflows; no content is clipped or cut off
- Drag the splitter back toward the right by roughly 100 pixels
  - _Expected_: Panels return to approximately their original proportions
- Click a different test in the tree, then click back to the original test
  - _Expected_: Panel widths remain at their last-dragged positions (session-level persistence)

<!-- test
type: manual
priority: normal
source: ac-delta-16
automation: candidate
-->
## Extra-options menu toggle ${toggle_label} hides the matching chrome in the tree

The runner's Extra-options menu contains four toggles that change the tree rendering immediately.

## Preconditions

- An ongoing manual run with at least one suite whose tests have labels and tags applied

## Steps

- Open the Extra-options menu from the runner header
  - _Expected_: Menu opens with the options Refresh structure, Hide / Show Creation Buttons, Hide / Show Labels, Hide / Show Tags
- Click the '${toggle_label}' option
  - _Expected_:
  - Menu closes
  - The corresponding chrome (${hidden_chrome}) disappears from the tests tree immediately
- Re-open the Extra-options menu
  - _Expected_: The toggle now shows its inverse label (for example "Show ..." where it previously said "Hide ...")
- Click the inverse option
  - _Expected_:
  - Menu closes
  - The chrome (${hidden_chrome}) re-appears in the tree

<!-- example -->

| toggle_label           | hidden_chrome                                         |
| ---                    | ---                                                   |
| Hide Creation Buttons  | per-suite 'Add test to suite' and 'Add note to suite' |
| Hide Labels            | label chips on test rows                              |
| Hide Tags              | tag chips on test rows                                |

<!-- test
type: manual
priority: high
source: ac-delta-17
automation: candidate
-->
## Priority filter ${priority_level} restricts the tree to matching tests

The runner exposes a priority filter toolbar above the tree. Selecting a priority must narrow the visible tests and reflect the narrower scope in the counters.

## Preconditions

- An ongoing manual run that contains tests of different priority levels (at least one Low, one Normal, one High, one Important, one Critical)

## Steps

- Note the total number of tests in the tree and the Pending counter in the header
  - _Expected_: Both values are visible
- Click the priority-filter button '${priority_level}' in the runner toolbar
  - _Expected_:
  - The '${priority_level}' filter button enters an active visual state
  - The tests tree re-renders to include only tests of ${priority_level} priority
  - Status counters in the header show the run-wide totals (not scoped to the filtered subset)
  > UI check gap (2026-04-18): Counters do NOT reflect the filtered subset — they continue showing the run-total counts regardless of which priority filter is active. The tests tree narrows, but the header counter bar (Passed N / Failed N / Skipped N / Pending N) remains unchanged during priority filtering.
- Click the '${priority_level}' filter button again to deactivate it
  - _Expected_:
  - Filter button returns to inactive state
  - Tests tree re-renders to include all tests again

<!-- example -->

| priority_level |
| ---            |
| Normal         |
| Low            |
| High           |
| Important      |
| Critical       |

<!-- test
type: manual
priority: normal
source: ac-delta-18
automation: candidate
-->
## Keyboard navigation between tests respects the active priority filter (cross-cut F)

When a filter narrows the tree, keyboard traversal between tests (↑ / ↓ or next-test action) must skip tests outside the filter. This is the cross-cutting F contract — selection scope depends on active filter.

## Preconditions

- An ongoing manual run with tests of at least two priority levels (High and Normal)

## Steps

- Open a test of High priority and activate the 'High' priority filter
  - _Expected_: Only High-priority tests are visible in the tree
- Press the ↓ (down arrow) key
  - _Expected_:
  - Focus moves to the next HIGH-priority test in the tree
  - Normal-priority tests are NOT visited during traversal
- Press ↓ repeatedly until the end of the filtered list
  - _Expected_: Traversal wraps or stops at the last High-priority test; it never exposes a Normal-priority test while the filter is active
- Deactivate the 'High' filter
  - _Expected_: Full tree is restored; arrow keys now traverse all priorities

<!-- test
type: manual
priority: low
source: ac-delta-16
automation: candidate
-->
## 'Refresh structure' reloads the tests tree from the server

Refresh must reconcile the runner tree with server state after a background change (for example a test added via another tab or via API).

## Preconditions

- An ongoing manual run is open in the Manual Runner
- In a separate tab (or via API) a new test has been added to one of the suites belonging to this run, but the runner tree still shows the pre-change view

## Steps

- Open the Extra-options menu from the runner header
  - _Expected_: Menu opens
- Click 'Refresh structure'
  - _Expected_:
  - Menu closes
  - Tree re-renders; the newly added test now appears in its suite
  - No page reload; URL is unchanged
- Collapse and re-expand the affected suite
  - _Expected_: Newly added test remains visible in the suite

<!-- test
type: manual
priority: normal
source: ac-delta-17
automation: candidate
-->
## Priority filter with no matching tests renders an empty tree @negative @boundary

When a priority filter is active and no tests match it, the tree must render an empty state rather than show unrelated tests or crash.

## Preconditions

- An ongoing manual run where at least one priority level has zero tests (for example no Critical tests exist in the run)

## Steps

- Open the runner
  - _Expected_: Tree shows the full list of tests across all priorities
- Activate the priority filter for a level that has no tests (for example 'Critical' where no Critical tests exist in this run)
  - _Expected_:
  - Filter button enters the active state
  - Tests tree becomes empty (shows an empty-state message such as "No tests match the current filter" or is visually empty)
  - No error toast appears
  - Status counters in the header continue to show run-wide totals (counters are not scoped to the filter)
- Deactivate the 'Critical' filter
  - _Expected_: Full tree reappears with all tests; counters remain at the same run-wide values
