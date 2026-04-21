<!-- suite -->
# Navigation and Header

Covers entry into the Run Detail panel from the Runs list, the identity row and metadata in the right panel header, the `Tests`/`Statistics`/`Defects` tab switch, closing and navigating back, and coexistence of lifecycle affordances for unfinished runs. Does NOT cover the `Relaunch` / `Continue` / `Finish` / `Advanced Relaunch` / `Launch a Copy` actions themselves (owned by #6 run-lifecycle — here we only assert their presence alongside the Detail panel) or Runs-list filter/search behaviour (owned by #7 runs-list-management).

<!-- test
type: manual
priority: critical
source: AC-82, ac-delta-1
automation: candidate
-->
## Open a finished run from the Runs list lands on Run Detail with Tests tab active @smoke

Verifies the core entry point — clicking any finished run in the list navigates to the Run Detail panel at `/runs/{id}/` with the `Tests` tab selected and the header populated.

## Preconditions
- Signed in as a user with access to the project
- At least one finished run exists in the Runs list

## Steps
- Navigate to the `Runs` page of the project
  - _Expected_: the Runs list is displayed with at least one finished run row
- Click a finished run row in the list
  - _Expected_:
  - The URL updates to `/projects/{project}/runs/{id}/`
  - The Run Detail panel is displayed on the right side of the page
  - The `Tests` tab is the active tab in the panel
- Observe the header of the Run Detail panel
  - _Expected_:
  - The run title is shown as an `h3` heading
  - The run status chip (e.g. `"finished"`, `"passed"`, `"failed"`) is visible with a colored status icon
  - The run short-id is visible as a copy link (e.g. `"Run {8-char-hex}"`) alongside a run-type badge (`"manual"`, `"automated"`, or `"mixed"`)

<!-- test
type: manual
priority: high
source: ac-delta-1
automation: candidate
-->
## Run Detail header surfaces run metadata summary @smoke

Confirms the header region of the Run Detail panel displays the expected metadata fields — Status, Duration, Tests count, Executed, Executed by, Created by — and counter breakdown for Passed / Failed / Skipped / Pending results.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists in the project with at least one Passed, one Failed, and one Skipped test result

## Steps
- Navigate to the `Runs` page and open the prepared finished run
  - _Expected_: the Run Detail panel is displayed with the `Tests` tab active
- Locate the metadata definition list in the panel
  - _Expected_:
  - The list shows rows `Status`, `Duration`, `Tests`, `Executed`, `Executed by`, `Created by`
  - Each metadata row shows a non-empty value (e.g. `Status: finished`, `Duration: 1m 56s`)
- Observe the run summary doughnut chart and legend
  - _Expected_:
  - The chart shows arcs for each recorded status
  - Legend entries `"Passed"`, `"Failed"`, `"Skipped"`, `"Pending"` each show the count of tests in that bucket

<!-- test
type: manual
priority: high
source: AC-83, ac-delta-1
automation: candidate
-->
## Switch to the ${tab} tab reveals its dedicated content area @smoke

Verifies each of the three top-level tabs `Tests`, `Statistics`, `Defects` in the Run Detail panel is clickable and switches the main content area to the correct section.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Tests` tab

## Steps
- Click the `${tab}` tab in the Run Detail panel
  - _Expected_:
  - The `${tab}` tab becomes the active tab (visually highlighted)
  - The content area switches to show `${expected_content}`
- Click the `Tests` tab again
  - _Expected_: the test list view returns to the panel

<!-- example -->
| tab | expected_content |
| --- | --- |
| Tests | the grouped test list with status filter bar and search |
| Statistics | section headings `"Suites"`, `"Tags"`, `"Labels"`, `"Assignees"`, `"Priorities"`, `"Custom Statuses"` |
| Defects | the defects list or empty-state text `"No defects found. You can link some jira-issue to test or other issues ."` |

<!-- test
type: manual
priority: high
source: AC-83, ac-delta-3
automation: candidate
-->
## Switching tabs preserves the active test selection and applied filters

Confirms that selecting a test row, applying a filter, and switching tabs does not reset selection state when returning to the `Tests` tab.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Tests` tab
- The run contains at least one failed test

## Steps
- Click the `Failed` status filter button above the test list
  - _Expected_:
  - The list is filtered to failed tests only
  - The `Failed` button is in active state
- Click the first failed test row in the list
  - _Expected_:
  - The test sub-panel opens on the right
  - The selected row is visually highlighted
  - The URL updates to include the test id
- Click the `Statistics` tab
  - _Expected_: the Statistics content area is displayed
- Click the `Tests` tab again
  - _Expected_:
  - The list is still filtered to failed tests
  - The previously selected test row remains highlighted
  - The test sub-panel is still open

<!-- test
type: manual
priority: normal
source: AC-82
automation: candidate
-->
## Close the Run Detail panel returns to the Runs list

Verifies the close control on the Run Detail panel dismisses the right panel and returns the URL to the Runs list route.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel

## Steps
- Note the URL contains `/runs/{id}/`
  - _Expected_: the Run Detail panel is displayed
- Click the close button in the top-right of the Run Detail panel
  - _Expected_:
  - The Run Detail panel is dismissed
  - The URL reverts to `/projects/{project}/runs`
  - The Runs list is shown with the previously opened run row highlighted or scrolled into view

<!-- test
type: manual
priority: normal
source: ac-delta-1
automation: deferred
automation-note: precondition run requires multi-environment configuration at creation time (owned by #5 environment-configuration) — multi-env fixture must exist before automation can consume it
-->
## Multi-environment run shows per-environment chips in the Detail header

Confirms that a run created with two or more environment groups surfaces each environment as a chip or tag in the Run Detail header metadata.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists that was created with two environment groups (e.g. `Browser:Chrome` and `Browser:Firefox`)

## Steps
- Navigate to the `Runs` page of the project
  - _Expected_: the Runs list is displayed with the prepared multi-environment run visible
- Click the prepared multi-environment run row in the list
  - _Expected_:
  - The URL updates to `/projects/{project}/runs/{id}/`
  - The Run Detail panel opens with the `Tests` tab active
- Locate the metadata area of the panel
  - _Expected_:
  - The environment values from both groups are surfaced in the header (either as chips in the metadata row or inside the `Tags & Envs` area)
  - Each configured environment value is displayed exactly as entered (e.g. `"Browser:Chrome"`, `"Browser:Firefox"`)

<!-- test
type: manual
priority: normal
source: AC-82
automation: candidate
-->
## Navigate to a non-existent run id shows a not-found state @negative

Verifies that navigating directly to `/runs/{id}/` with a run identifier that does not exist in the project renders a not-found or error state rather than an unhandled exception.

## Preconditions
- Signed in as a user with access to the project

## Steps
- Note a valid project URL structure for runs (e.g. open any existing run and record the URL format)
  - _Expected_: the Runs list or the Run Detail panel loads correctly for a valid run
- Manually edit the browser URL to `/projects/{project}/runs/deadbeefdeadbeef` (a 16-char hex id that does not correspond to any existing run) and press Enter
  - _Expected_:
  - A not-found / error state is displayed in place of the Run Detail panel
  - No JavaScript console error surface (no red error banner for the generic app)
- Click the `Runs` breadcrumb or use the back control
  - _Expected_: the browser returns to the Runs list with its default filter state
