<!-- suite -->
# Test Sub-Panel

Covers the right-side test sub-panel that opens from the `Tests` tab — its four tabs `Summary`, `Description`, `Code template`, `Runs`, row highlighting, swapping selection between tests, and the sub-panel close control. Does NOT cover the `Tests` tab list/sort/search controls (owned by Tests Tab suite) or the `Description`/`Code template` edit flows (read-only in run report context; edit is owned by Tests feature).

<!-- test
type: manual
priority: critical
source: AC-84, ac-delta-3
automation: candidate
-->
## Click a test row opens the sub-panel with the row visibly highlighted @smoke

Verifies clicking a test row in the `Tests` tab opens the right sub-panel, highlights the active row, and updates the URL to include the test identifier.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Tests` tab
- The run contains at least two tests

## Steps
- Note the current URL is `/runs/{id}/` with no test identifier
  - _Expected_: no sub-panel is visible on the right
- Click the first test row in the list
  - _Expected_:
  - The test sub-panel opens on the right with the test title heading
  - The selected row is visually highlighted (active state)
  - The URL updates to `/runs/{id}/report/test/{testRunTestId}`

<!-- test
type: manual
priority: high
source: AC-84
automation: candidate
-->
## Sub-panel exposes Summary, Description, Code template, and Runs tabs @smoke

Verifies the sub-panel tab row contains all four expected tabs with `Summary` selected by default.

## Preconditions
- Signed in as a user with access to the project
- A test sub-panel is open for a test in a finished run

## Steps
- Observe the tab row at the top of the sub-panel
  - _Expected_:
  - The tabs `Summary`, `Description`, `Code template`, `Runs` are displayed in order
  - The `Summary` tab is selected by default (active state)
- Click each tab in turn (`Description`, `Code template`, `Runs`, then back to `Summary`)
  - _Expected_:
  - Each tab becomes active when clicked
  - The sub-panel body updates to the content of the selected tab

<!-- test
type: manual
priority: normal
source: AC-84, ac-delta-4
automation: candidate
-->
## Summary tab shows the last execution status, message, and step results

Confirms the Summary tab renders the last result metadata — status, optional message, optional attachments, and step-by-step results when recorded during execution.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists with a Passed test that has a result message recorded and at least one step result
- The run is opened in the Run Detail panel

## Steps
- Click the prepared test row in the `Tests` tab
  - _Expected_: the sub-panel opens with the `Summary` tab active
- Observe the Summary content area
  - _Expected_:
  - The result status is displayed as a status bullet (e.g. `"● passed"`)
  - The recorded result message is displayed in the body
  - The step results are listed with a per-step status icon and step text
- Open the sub-panel for a test without a recorded message and no steps
  - _Expected_: the Summary area renders a neutral empty state (no error or warning indicator)

<!-- test
type: manual
priority: normal
source: AC-84, ac-delta-5
automation: candidate
-->
## Description tab renders the test description and is read-only in run context

Verifies the Description tab surfaces the test's markdown description, `Steps` and `Expected Result` fields, and does not expose edit controls inside the Run Report.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists with a test whose description contains `Steps` and an `Expected Result` (populated in the test definition)
- The run is opened in the Run Detail panel

## Steps
- Click the prepared test row to open the sub-panel
  - _Expected_: the sub-panel opens with the `Summary` tab active
- Click the `Description` tab
  - _Expected_:
  - The tab becomes active
  - A `Steps` heading is displayed followed by the steps list
  - For each step, a bold `Expected Result:` label precedes the expected outcome text
- Hover over the description body
  - _Expected_: no inline edit control becomes visible within this run-report context

<!-- test
type: manual
priority: normal
source: AC-84, ac-delta-6
automation: candidate
-->
## Code template tab shows the test's code template with a copy control

Confirms that a test with an attached automation code template shows the template source in the sub-panel and exposes a copy-to-clipboard control.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists with a test that has a non-empty automation code template attached
- The run is opened in the Run Detail panel

## Steps
- Click the prepared test row in the `Tests` tab
  - _Expected_: the sub-panel opens with the `Summary` tab active
- Click the `Code template` tab
  - _Expected_: the sub-panel body shows the code template as a code block
- Click the copy control next to the code block
  - _Expected_: a confirmation toast or visual cue indicates the code was copied to clipboard
- Open the sub-panel for a manual-only test (no code template)
  - _Expected_: the `Code template` tab is still shown, and its body renders blank or with a neutral empty-state (no error)

<!-- test
type: manual
priority: normal
source: AC-84, ac-delta-7
automation: candidate
-->
## Runs tab lists the test's prior runs and links back to each run's report

Verifies the Runs tab inside the sub-panel lists the test's run history with clickable rows that navigate to that specific run's report for the same test.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists with a test that has been executed at least twice (i.e. at least two prior runs)
- The run is opened in the Run Detail panel

## Steps
- Click the prepared test row in the `Tests` tab
  - _Expected_: the sub-panel opens with the `Summary` tab active
- Click the `Runs` tab
  - _Expected_:
  - The tab body shows a `Runs` count label and a history list
  - Each list row shows a run title link, a status icon, and an execution timestamp
- Click any prior-run row in the list
  - _Expected_:
  - The URL updates to `/runs/{prevRunId}/report/test/{testRunTestId}`
  - The sub-panel refreshes to show that prior run's result for the same test

<!-- test
type: manual
priority: normal
source: ac-delta-3
automation: candidate
-->
## Swapping selection between tests keeps the sub-panel open

Verifies that clicking a different test row while the sub-panel is open replaces the panel content without closing the panel.

## Preconditions
- Signed in as a user with access to the project
- A finished run with at least two tests is opened in the Run Detail panel
- The sub-panel is open for the first test

## Steps
- Note the test title in the open sub-panel heading
  - _Expected_: the sub-panel is displayed with the first test's title
- Click a second test row in the list
  - _Expected_:
  - The sub-panel remains open (not closed and re-opened)
  - The sub-panel heading updates to the second test's title
  - The URL updates to include the second test's id
  - The first row is no longer highlighted; the second row is now active

<!-- test
type: manual
priority: normal
source: ac-delta-14
automation: candidate
-->
## Close the sub-panel via Escape returns the list to full width

Verifies the `Escape` key closes the test sub-panel, removes the test id from the URL, and expands the test list back to full width.

## Preconditions
- Signed in as a user with access to the project
- A test sub-panel is open for a test in a finished run

## Steps
- Note the URL contains `/report/test/{testRunTestId}`
  - _Expected_: the sub-panel is displayed on the right
- Press the `Escape` key
  - _Expected_:
  - The sub-panel is closed
  - The URL reverts to `/runs/{id}/report/` without the test id segment
  - The test list expands to the full width of the content area

<!-- test
type: manual
priority: normal
source: AC-84, ac-delta-7
automation: candidate
-->
## Runs sub-tab for a test without prior runs shows the empty-state message @negative

Verifies the `Runs` tab inside the test sub-panel renders a neutral empty state when the selected test has no prior runs recorded beyond the current one.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists with at least one test that has been executed exactly once (the current run is its first)
- The run is opened in the Run Detail panel on the `Tests` tab

## Steps
- Click the prepared first-execution test row in the list
  - _Expected_: the sub-panel opens with the `Summary` tab active
- Click the `Runs` tab
  - _Expected_:
  - The tab becomes active
  - The `Runs` count label shows a value of `1` (or a neutral zero-prior-runs indicator)
  - The history list either shows only the current run row or renders an empty-state message for prior runs
- Observe the tab for error banners
  - _Expected_: no error banner, spinner that never resolves, or failure toast is displayed
