<!-- suite -->
# Tests Tab

Covers the `Tests` tab of the Run Detail panel — list grouping, sort controls, search, status filters, filter chips composition, keyboard navigation, and filters that exercise Multi-user Assignment (Concern B) and Custom Statuses (Concern E). Does NOT cover the test sub-panel body (owned by Test Sub-Panel suite), tab switching (owned by Navigation and Header suite), or Statistics re-rendering (owned by Statistics and Defects suite).

<!-- test
type: manual
priority: critical
source: AC-82, ac-delta-2
automation: candidate
-->
## Test rows are grouped by suite with status, title, and duration metadata @smoke

Verifies the `Tests` tab list layout groups rows under their parent suite and that each row renders the status icon, test title link, and duration (when recorded).

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Tests` tab
- The run contains tests from at least two different suites

## Steps
- Observe the test list in the `Tests` tab
  - _Expected_:
  - Tests are grouped under their parent suite with a suite-name header row
  - Each test row shows a colored status icon corresponding to the recorded status (passed / failed / skipped / pending)
  - Each test row shows the test title as a clickable link
- Switch the list to `Custom` view via the view toggle button
  - _Expected_:
  - The list re-renders as a table with columns including `Suite`, `Runtime`, `Assigned to`
  - Each row exposes the runtime duration in the `Runtime` column (e.g. `"1m 15s"`)

<!-- test
type: manual
priority: normal
source: AC-85, ac-delta-15
automation: candidate
-->
## Sort the test list by ${sort_dimension} reorders rows accordingly @smoke

Verifies the `Sort` dropdown exposes the three dimensions `Suite`, `Test`, `Failure` and that selecting each option reorders the list. Also confirms the ASC/DESC toggle flips the ordering direction.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Tests` tab
- The run contains at least five tests with mixed statuses (at least one failed)

## Steps
- Click the `Sort` button in the filter bar
  - _Expected_: a dropdown with options `Suite`, `Test`, `Failure` is displayed
- Click the `${sort_dimension}` option in the dropdown
  - _Expected_:
  - The dropdown closes
  - The test list reorders so that rows follow `${expected_order}`
  - The sort button label updates to show the active dimension
- Click the order-direction toggle button next to the sort label
  - _Expected_: the list order is reversed while the active sort dimension remains `${sort_dimension}`

<!-- example -->
| sort_dimension | expected_order |
| --- | --- |
| Suite | tests grouped alphabetically by suite name |
| Test | tests listed alphabetically by test title regardless of suite |
| Failure | failed tests listed first, then other statuses |

<!-- test
type: manual
priority: normal
source: AC-85, ac-delta-12
automation: candidate
-->
## Search in the Tests tab filters rows by title or result message in real time @smoke

Verifies the search input filters the test list as the user types and that clearing the input restores the full list.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Tests` tab
- The run contains at least two tests whose titles start with different letters

## Steps
- Type the first 3 characters of a known test title into the `Search by title/message` input
  - _Expected_:
  - The test list is filtered to rows whose title or result message contains the typed substring
  - Tests that do not match are hidden
- Clear the search input
  - _Expected_: the full test list is restored

<!-- test
type: manual
priority: normal
source: AC-85, ac-delta-13
automation: candidate
-->
## Status filter button ${status} narrows the list to matching tests @smoke

Verifies the status filter buttons `Passed`, `Failed`, `Skipped`, `Pending` each narrow the list to tests with the selected status when clicked.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Tests` tab
- The run contains at least one test of each status Passed / Failed / Skipped / Pending

## Steps
- Click the `${status}` button in the status filter bar above the list
  - _Expected_:
  - The `${status}` button enters active state
  - The test list is filtered to tests with the `${status}` status only
  - The displayed count matches the button's count badge
- Click the `${status}` button again to deselect it
  - _Expected_: the full test list is restored

<!-- example -->
| status |
| --- |
| Passed |
| Failed |
| Skipped |
| Pending |

<!-- test
type: manual
priority: normal
source: AC-85, ac-delta-13
automation: candidate
-->
## Combining Passed and Failed filters shows tests in either status

Verifies the status filter buttons combine with OR semantics within the same dimension and that the combined result is the union of matching tests.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Tests` tab
- The run contains at least one Passed test and one Failed test

## Steps
- Click the `Passed` status filter button
  - _Expected_: the list is filtered to Passed tests only
- Click the `Failed` status filter button (keeping `Passed` active)
  - _Expected_:
  - Both `Passed` and `Failed` buttons are in active state
  - The list shows the union of Passed and Failed tests
  - Skipped and Pending tests are hidden
- Click the `Passed` button to deselect it
  - _Expected_: only Failed tests remain visible in the list

<!-- test
type: manual
priority: normal
source: ac-delta-12
automation: candidate
-->
## Search with no matches renders the empty-state message @negative

Verifies an empty search result yields a neutral empty-state message rather than an error banner.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Tests` tab

## Steps
- Type a string of 20 random characters unlikely to match any test title into the `Search by title/message` input
  - _Expected_:
  - The test list renders zero rows
  - A neutral empty-state message is displayed in the list area
  - No error banner, toast, or red indicator appears
- Clear the search input
  - _Expected_: the full test list is restored

<!-- test
type: manual
priority: normal
source: AC-86, ac-delta-14
automation: candidate
-->
## Keyboard navigation ↑ and ↓ moves selection between test rows and Esc closes the sub-panel

Verifies the report-page keyboard shortcuts — `↑` / `↓` arrow keys step through the test list, `Enter` opens the focused test's sub-panel, and `Escape` closes it.

## Preconditions
- Signed in as a user with access to the project
- The `/runs/{id}/report/` page is open for a finished run
- The run contains at least three tests

## Steps
- Click the first test row in the list
  - _Expected_: the test sub-panel opens for the first test
- Press the `↓` arrow key
  - _Expected_:
  - Selection moves to the next test row in the list
  - The URL updates to the next test's `/report/test/{id}` path
  - The sub-panel content updates to the next test
- Press the `↑` arrow key
  - _Expected_: selection and sub-panel revert to the first test
- Press the `Escape` key
  - _Expected_:
  - The sub-panel is closed
  - The URL reverts to `/runs/{id}/report/` without the test id segment

<!-- test
type: manual
priority: high
source: AC-85, ac-delta-13
automation: deferred
automation-note: requires a finished run with ≥ 2 distinct testers assigned across different tests — fixture depends on #3 tester-assignment outputs
-->
## Filter by Assignee on a multi-assignee run shows only tests for that assignee

Verifies the assignee filter on a run with multiple testers scopes the test list to tests owned by the selected user.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists where at least two distinct testers have been assigned to different tests
- The run is opened in the Run Detail panel on the `Tests` tab

## Steps
- Open the advanced filter panel via the filter icon in the filter bar
  - _Expected_: a filter panel with categorised chips (status / type / messages / custom-status / assignee) is displayed
- Select a specific assignee from the `Assignee` filter category
  - _Expected_:
  - The chip enters active state
  - The test list is filtered to tests assigned to the selected user
- Remove the assignee chip
  - _Expected_: the full test list is restored

<!-- test
type: manual
priority: high
source: AC-85, ac-delta-13
automation: deferred
automation-note: requires a finished run with at least one test that carries a configured custom status — fixture depends on Settings → Custom Statuses
-->
## Filter by Custom Status on a run with custom statuses narrows the list to matching tests

Verifies the Custom Status filter scopes the test list to tests carrying the selected custom sub-status.

## Preconditions
- Signed in as a user with access to the project
- Custom statuses are configured in Project Settings (at least one under `Failed` or `Passed`)
- A finished run exists where at least one test has been marked with a specific custom status during execution
- The run is opened in the Run Detail panel on the `Tests` tab

## Steps
- Open the advanced filter panel via the filter icon in the filter bar
  - _Expected_: the filter panel displays a `Custom Status` category with chips for each configured custom status
- Select the specific custom status chip applied to the prepared test
  - _Expected_:
  - The chip enters active state
  - The test list is filtered to tests carrying that custom status
- Remove the custom status chip
  - _Expected_: the full test list is restored

<!-- test
type: manual
priority: low
source: ac-delta-12
automation: candidate
-->
## Search input accepts a query at the 500-character length @boundary

Verifies the search input in the `Tests` tab accepts a very long query string without truncation or layout breakage, and that the list correctly reports zero matches when the string is long enough to be unique.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Tests` tab

## Steps
- Prepare a 500-character-long random string (letters + digits only)
  - _Expected_: the prepared string is ready in the test's clipboard or fixture
- Paste the 500-character string into the `Search by title/message` input
  - _Expected_:
  - The input accepts the full string without rejecting or truncating input (all 500 characters are preserved in the field value)
  - The input renders without overlapping adjacent filter buttons
- Observe the test list after the query is applied
  - _Expected_: the list renders zero rows with a neutral empty-state message (no error banner, no request failure toast)

<!-- test
type: manual
priority: normal
source: AC-85, ac-delta-13
automation: deferred
automation-note: depends on a multi-assignee run fixture and on being able to select an assignee whose test set is empty — coordinated with #3 tester-assignment outputs
-->
## Filter by Assignee with no matching tests renders the empty-state message @negative

Verifies selecting an assignee filter value that does not correspond to any test in the current run produces a neutral empty list without triggering an error.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists with multiple testers assigned, where at least one project member has NO tests assigned to them in this specific run
- The run is opened in the Run Detail panel on the `Tests` tab

## Steps
- Open the advanced filter panel via the filter icon in the filter bar
  - _Expected_: the filter panel is displayed with assignee selection options
- Select the assignee who has no tests in this run
  - _Expected_:
  - The assignee chip enters active state
  - The test list renders zero rows with a neutral empty-state message
  - No error banner or failure toast is displayed
- Remove the assignee chip
  - _Expected_: the full test list is restored
