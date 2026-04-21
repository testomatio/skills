<!-- suite -->
# Compare Runs

Covers the Compare Runs page `/runs/compare?ids=[...]` — the matrix of per-run status cells, diff highlighting, the Overview/Summary panel, and entry-point enablement from the Runs list. Does NOT cover the Runs-list Multi-select toolbar mechanics (entry point only — owned by #7 runs-list-management) or per-test drill-down pages (destination for row clicks; only the link is asserted here).

<!-- test
type: manual
priority: critical
source: AC-92
automation: candidate
-->
## Compare at least two finished runs from the Runs list navigates to the Compare matrix @smoke

Verifies selecting two or more finished runs via Multi-select → Compare navigates to `/runs/compare?ids=[...]` and renders the comparison matrix.

## Preconditions
- Signed in as a user with access to the project
- At least two finished runs exist in the project
- The `Runs` page is open

## Steps
- Enable Multi-select mode on the Runs list
  - _Expected_: per-row checkboxes appear and the bulk-action toolbar is displayed at the bottom of the list
- Check the first two finished-run rows
  - _Expected_: two rows are marked as selected and the toolbar reflects a count of `2`
- Click the `Compare` action in the bulk-action toolbar
  - _Expected_:
  - The URL updates to `/projects/{project}/runs/compare?ids=["{id1}","{id2}"]`
  - A page titled `"Compare runs"` is displayed
  - The matrix shows two per-run columns corresponding to the selected runs

<!-- test
type: manual
priority: high
source: AC-92, ac-delta-21
automation: candidate
-->
## Compare matrix renders per-run status cells with test titles as row links @smoke

Confirms the Compare page displays a matrix with test titles on the left and status cells for each compared run in columns.

## Preconditions
- Signed in as a user with access to the project
- The Compare page is open for two finished runs that share at least three common tests

## Steps
- Observe the matrix layout
  - _Expected_:
  - A left column lists test titles as clickable links (href pattern `/runs/compare/test/{testId}?ids=...`)
  - Each subsequent column corresponds to one of the compared runs
  - Each matrix cell for a test × run pair shows a status icon (passed / failed / skipped / pending)
- Click a test title in the left column
  - _Expected_: the URL updates to `/runs/compare/test/{testId}?ids=...` and the per-test compare view is displayed
- Navigate back to the Compare page
  - _Expected_: the matrix is restored

<!-- test
type: manual
priority: normal
source: ac-delta-21
automation: candidate
-->
## Rows where statuses differ across runs are visually highlighted

Verifies tests whose status differs across compared runs are rendered distinctly from rows where statuses match.

## Preconditions
- Signed in as a user with access to the project
- Two finished runs exist that share at least one common test where the status differs between the two runs (e.g. Passed in run A, Failed in run B)
- The Compare page is open for those two runs

## Steps
- Locate the test row where the two runs recorded different statuses
  - _Expected_:
  - The status cells in the row show two different status icons (e.g. `● passed` in one column and `● failed` in the other)
  - The row is visually distinct from rows where statuses match (different background, highlight, or marker)
- Locate a test row where both runs recorded the same status
  - _Expected_: the row uses the default (unhighlighted) styling

<!-- test
type: manual
priority: normal
source: AC-92
automation: candidate
-->
## Compare action requires at least two runs to be selected @negative

Verifies that selecting a single run in the Runs list does not expose Compare as a usable action in the bulk-action toolbar.

## Preconditions
- Signed in as a user with access to the project
- The `Runs` page is open with Multi-select mode enabled
- No rows are currently selected

## Steps
- Check a single run row in the list
  - _Expected_: the bulk-action toolbar reflects a selection count of `1`
- Observe the `Compare` action in the toolbar
  - _Expected_: the `Compare` action is either disabled, hidden, or produces no navigation when clicked
- Check a second run row
  - _Expected_:
  - The selection count updates to `2`
  - The `Compare` action becomes enabled
- Click `Compare`
  - _Expected_: the browser navigates to the Compare page with both selected run ids in the URL

<!-- test
type: manual
priority: normal
source: ac-delta-21
automation: deferred
automation-note: requires three finished runs where at least one was created with multiple environment groups and at least one had distinct assignees — fixtures depend on #3 tester-assignment and #5 environment-configuration outputs
-->
## Compare view renders correctly across runs with different environments and assignees

Confirms the Compare matrix and Overview panel surface multi-environment and multi-assignee metadata across the compared runs.

## Preconditions
- Signed in as a user with access to the project
- Three finished runs exist where:
  - Run A was created with a single environment group
  - Run B was created with two environment groups
  - Run C has ≥ 2 distinct testers assigned across its tests
- The Compare page is open for all three runs

## Steps
- Observe the header and Overview panel of the Compare page
  - _Expected_:
  - The header shows the `Compare runs` heading and three per-run columns in the matrix
  - The Overview panel shows summary metrics `"Total Tests:"`, `"Tests in all runs:"`, `"Total Passed"`, `"Total Failed"`, `"Flaky"`, `"Degraded"`, `"Skipped"`
- Observe the matrix rows for tests executed against different environments in run B
  - _Expected_: each environment's outcome is represented either as a separate column, a grouped cell, or an environment label inside the cell (consistent with how run B was created)
- Observe the matrix rows for tests assigned to different testers in run C
  - _Expected_: the assignee information is surfaced in the test row (via a filter, assignee column, or drill-down) and does not break matrix rendering

<!-- test
type: manual
priority: low
source: AC-92, ac-delta-21
automation: candidate
-->
## Compare matrix renders with four runs selected at the supported maximum @boundary

Verifies the Compare matrix continues to render correctly when the maximum practical number of runs is compared at once (four columns).

## Preconditions
- Signed in as a user with access to the project
- At least four finished runs exist in the project
- The `Runs` page is open with Multi-select mode enabled

## Steps
- Check exactly four finished-run rows in the list
  - _Expected_: the bulk-action toolbar reflects a selection count of `4`
- Click the `Compare` action in the bulk-action toolbar
  - _Expected_:
  - The URL updates to `/projects/{project}/runs/compare?ids=["{id1}","{id2}","{id3}","{id4}"]`
  - The Compare page loads without an error banner or timeout
- Observe the matrix layout
  - _Expected_:
  - The matrix shows four per-run columns corresponding to the four selected runs
  - All column headers are visible without overlapping or truncating headings
  - Horizontal scrolling (if needed) is supported within the matrix container

<!-- test
type: manual
priority: low
source: AC-92
automation: candidate
-->
## Manually entering the Compare URL with a single run id renders a neutral empty or fallback state @negative

Verifies that navigating directly to the Compare URL with only one run id (malformed entry) does not crash the page and renders a neutral state.

## Preconditions
- Signed in as a user with access to the project
- At least one finished run exists in the project (run id is known)

## Steps
- Navigate directly to `/projects/{project}/runs/compare?ids=["{runId}"]` in the browser
  - _Expected_:
  - The Compare page loads without an unhandled error banner or white-screen crash
  - Either a neutral message is displayed stating at least two runs are required, OR the matrix renders a single-run column without failure
- Observe the page controls
  - _Expected_: a navigation affordance back to the Runs list (breadcrumb, back link, or Cancel) is available
