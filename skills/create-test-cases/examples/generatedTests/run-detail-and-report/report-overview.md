<!-- suite -->
# Report Overview

Covers the `/runs/{id}/report/` page — the combined report view that pairs the test list with the Summary/Overview panel on the right. Includes grouping dimensions (`Suites` / `Tags` / `Labels` / `Assignees` / `Priorities`), the Analytics / Flaky Tests section, keyboard navigation on the report page, and multi-assignee grouping (Concern B). Does NOT cover the Run Detail panel (owned by Navigation and Header suite), the exports/share actions in the extra menu (owned by Exports and Sharing suite), or the test sub-panel body (owned by Test Sub-Panel suite).

**Reality note:** there is no separate "Extended" mode or URL. The full report page at `/runs/{id}/report/` IS the combined view — the Summary/Overview panel and the test list render together. Tests below assert against that observed layout.

<!-- test
type: manual
priority: critical
source: AC-82, AC-86
automation: candidate
-->
## Open the Report page shows the test list alongside the Summary and Overview panel @smoke

Verifies navigation from the Run Detail panel to `/runs/{id}/report/` renders the combined report view with the test list on the left and Summary/Overview on the right.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel

## Steps
- Click the `Report` button in the Run Detail panel header
  - _Expected_:
  - The URL updates to `/projects/{project}/runs/{id}/report/`
  - The test list is rendered on the left side of the page with status filter bar and search
  - A right-side panel is displayed with a `Summary` heading and the run metadata list
  - An `Overview` section below Summary exposes tabs `Suites`, `Tags`, `Labels`, `Assignees`, `Priorities`

<!-- test
type: manual
priority: normal
source: AC-86, ac-delta-10
automation: candidate
-->
## Switch the Overview grouping to ${grouping} rebuckets the list without reloading @smoke

Verifies the `Overview` tab row switches the grouped summary between dimensions `Suites`, `Tags`, `Labels`, `Assignees`, `Priorities` and that switching does not trigger a page reload.

## Preconditions
- Signed in as a user with access to the project
- The report page `/runs/{id}/report/` is open for a finished run
- The run contains tests with at least one tag, one label, one assignee, and one priority set

## Steps
- Note the currently active Overview tab
  - _Expected_: one tab in the Overview tab row is in active state (default is typically `Suites`)
- Click the `${grouping}` tab in the Overview row
  - _Expected_:
  - The `${grouping}` tab becomes active
  - The grouped list below the tabs re-renders to show buckets by `${grouping}` with `${expected_bucket_kind}`
  - No full page reload is triggered (browser URL and scroll position remain the same)

<!-- example -->
| grouping | expected_bucket_kind |
| --- | --- |
| Suites | one row per suite with passed/failed counts |
| Tags | one row per tag present in the run |
| Labels | one row per label attached to tests in the run |
| Assignees | one row per assignee (empty when no testers assigned) |
| Priorities | one row per priority value present (e.g. normal, high) |

<!-- test
type: manual
priority: normal
source: ac-delta-11
automation: candidate
-->
## Analytics section is hidden when the run has no flaky-test history @boundary

Verifies the Analytics / Flaky Tests Analytics section renders empty or hidden when the run contains no tests with a flaky history (fewer than 2 prior runs of differing status). Represents the 0-flaky-tests boundary state.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists where tests do not have ≥ 2 prior runs with status changes (typically a fresh run or run of new tests)

## Steps
- Navigate to the Runs page and open the prepared run
  - _Expected_: the Run Detail panel opens with the `Tests` tab active
- Click the `Report` button to navigate to the full report page
  - _Expected_: the URL updates to `/projects/{project}/runs/{id}/report/` and the Summary/Overview panel is displayed on the right
- Scroll to the bottom of the Overview panel
  - _Expected_:
  - No flaky-tests chart is rendered
  - The `Analytics` section heading is either hidden or renders with zero-height content
  - No error banner or loading spinner appears in place of the hidden section

<!-- test
type: manual
priority: normal
source: ac-delta-11
automation: deferred
automation-note: requires a seeded run where multiple prior runs have executed the same tests with differing outcomes — cross-run fixture setup not available in a standard automation fixture
-->
## Analytics section renders the Flaky Tests chart when flaky history exists

Confirms that when the run contains tests with a flaky history, the Analytics section populates with flaky-test analytics charts.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists where at least two tests have ≥ 2 prior runs with differing status outcomes (qualifying as flaky)
- The report page is open for that run

## Steps
- Scroll to the Analytics section in the Overview panel
  - _Expected_:
  - An `Analytics` heading is visible
  - A flaky-tests chart is rendered below the heading
  - The chart lists flaky tests with their status history summary

<!-- test
type: manual
priority: high
source: AC-86, ac-delta-10
automation: deferred
automation-note: requires a finished run with ≥ 2 distinct testers assigned across different tests — fixture depends on #3 tester-assignment outputs
-->
## Overview grouping by Assignees buckets tests under each tester on a multi-assignee run

Verifies the `Assignees` Overview tab on a multi-tester run surfaces one bucket per assignee with per-assignee counts.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists where at least two distinct testers have been assigned to different tests
- The report page is open for that run

## Steps
- Click the `Assignees` tab in the Overview tab row
  - _Expected_:
  - The `Assignees` tab becomes active
  - The grouped list shows one row per assignee
  - Each row shows the assignee's name/avatar and their passed/failed/skipped counts
- Click a specific assignee row
  - _Expected_: the test list on the left narrows to tests assigned to that user (or an inline drill-down surfaces the same information)

<!-- test
type: manual
priority: low
source: ac-delta-13
automation: candidate
-->
## Tree View toggle on the Report page switches between flat list and tree-grouped layout

Verifies the `Tree View` toggle in the report filter bar switches the test list rendering between a flat list and a tree-grouped layout.

## Preconditions
- Signed in as a user with access to the project
- The report page `/runs/{id}/report/` is open for a finished run
- The run contains tests from at least two distinct suites

## Steps
- Observe the default layout of the test list
  - _Expected_: the `Tree View` button is visible in the filter bar; the list is currently in flat layout
- Click the `Tree View` button
  - _Expected_:
  - The test list re-renders with tests grouped under collapsible suite nodes
  - The button indicates the active state (label change, highlight, or pressed state)
- Click the `Tree View` button again
  - _Expected_: the list reverts to the flat layout

<!-- test
type: manual
priority: low
source: AC-86
automation: candidate
-->
## Keyboard shortcuts reference modal opens from the report page

Verifies the floating keyboard-shortcuts icon on the report page opens a reference modal describing the available shortcuts including `↑`/`↓` navigation.

## Preconditions
- Signed in as a user with access to the project
- The report page `/runs/{id}/report/` is open for a finished run

## Steps
- Locate the floating keyboard icon in the bottom-right of the page
  - _Expected_: an icon is displayed as a floating control
- Click the keyboard shortcuts icon
  - _Expected_:
  - A reference modal is displayed
  - The modal contains a `Run Report` section with arrow-key navigation hints
- Click the modal close control (or press `Escape`)
  - _Expected_: the modal is dismissed and the report page is fully interactive again

<!-- test
type: manual
priority: normal
source: AC-86, ac-delta-10
automation: candidate
-->
## Overview grouping by a dimension with no matching data renders a neutral empty bucket list @negative

Verifies that switching the Overview grouping to a dimension where the run carries no matching data (e.g. `Labels` on a run whose tests have no labels attached) renders a neutral empty state rather than an error.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists whose tests have no labels attached
- The report page `/runs/{id}/report/` is open for that run

## Steps
- Click the `Labels` tab in the Overview row
  - _Expected_: the `Labels` tab becomes active
- Observe the grouped list area below the tabs
  - _Expected_:
  - The list renders zero grouped rows
  - A neutral empty-state message or placeholder is displayed (e.g. `"No labels"` or similar wording)
  - No error banner, loading spinner, or red failure indicator is displayed
- Click back to the `Suites` tab
  - _Expected_: the `Suites` grouping is restored without a page reload
