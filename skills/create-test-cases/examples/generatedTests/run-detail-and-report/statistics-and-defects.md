<!-- suite -->
# Statistics and Defects

Covers the `Statistics` and `Defects` tabs in the Run Detail panel — per-section aggregates, filter/sort responses, multi-environment rollup (Concern A), and Defects tab empty state and linked-defect state (resolves AC-98). Does NOT cover linking a defect to a test (owned by Tests feature) or the Tests tab filter behaviour that drives Statistics re-render (owned by Tests Tab suite — cited as dependency only).

<!-- test
type: manual
priority: normal
source: AC-83, ac-delta-8
automation: candidate
-->
## Statistics tab groups counts under Suites, Tags, Labels, Assignees, Priorities, Custom Statuses @smoke

Verifies the Statistics tab renders the six grouping sections with per-item counts.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel
- The run contains tests across multiple suites, with tags, labels, and at least one priority set

## Steps
- Click the `Statistics` tab
  - _Expected_: the tab becomes active and the content area replaces the test list
- Observe the section headings in the Statistics content area
  - _Expected_:
  - Headings `"Suites"`, `"Tags"`, `"Labels"`, `"Assignees"`, `"Priorities"`, `"Custom Statuses"` are visible
  - Each non-empty section shows rows with item name and passed/failed counts
  - The `"Custom Statuses"` section (when empty) shows the text `"No custom statuses found"`

<!-- test
type: manual
priority: normal
source: ac-delta-8
automation: candidate
-->
## Sort and status filter icons in a Statistics section reorder its rows

Verifies that each Statistics section exposes sort links (`name` / `failed`), an ASC/DESC direction indicator, and status filter icons that reorder or filter the rows within that section.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Statistics` tab
- The run contains tests across at least three different suites with mixed passed/failed outcomes

## Steps
- Locate the `Suites` section
  - _Expected_: the section header shows `name` and `failed` sort links with a direction icon
- Click the `failed` sort link
  - _Expected_: suite rows reorder so suites with the highest failure count appear first
- Click the passed-status filter icon in the section header
  - _Expected_: passed counts are hidden or dimmed in the rows; failed counts remain

<!-- test
type: manual
priority: normal
source: ac-delta-8
automation: deferred
automation-note: precondition run must be created with ≥ 2 environment groups (owned by #5 environment-configuration)
-->
## Statistics tab surfaces per-environment counts on a multi-environment run

Confirms the Statistics aggregates reflect per-environment breakdown when the run was created with multiple environment groups.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists that was created with two environment groups (e.g. `Browser:Chrome` and `Browser:Firefox`)
- The run is opened in the Run Detail panel on the `Statistics` tab

## Steps
- Scroll through the Statistics sections
  - _Expected_:
  - At least one section (typically `Tags` or a dedicated Environments subsection) exposes each environment value with its own counts
  - The counts across all environment buckets sum to the run's total test count
- Click a specific environment row in the section
  - _Expected_: the Tests tab (or an inline drill-down) narrows to tests executed against that environment when clicked

<!-- test
type: manual
priority: high
source: AC-98, ac-delta-9
automation: candidate
-->
## Defects tab shows empty-state links when the run has no linked defects @negative

Verifies the Defects tab renders the documented empty-state message with navigation links to JIRA and Issues settings when no defects are linked to any test in the run.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists where no tests have linked defects
- The run is opened in the Run Detail panel

## Steps
- Click the `Defects` tab
  - _Expected_: the tab becomes active
- Observe the content area
  - _Expected_:
  - The empty-state text reads `"No defects found. You can link some jira-issue to test or other issues ."`
  - A `jira-issue` link navigates to `/projects/{project}/settings/jira`
  - An `other issues` link navigates to `/projects/{project}/settings/issue`
- Hover over the content area
  - _Expected_: no `Add defect` or `Link issue` button is displayed on the tab itself (read-only — resolves AC-98)

<!-- test
type: manual
priority: normal
source: AC-98, ac-delta-9
automation: deferred
automation-note: precondition requires at least one test with a linked JIRA/GitHub issue — external issue tracker fixture not in scope for this suite's automation
-->
## Defects tab lists linked defects for tests that have them

Confirms the Defects tab shows one row per test with a linked defect, with the defect title and external link to the issue tracker.

## Preconditions
- Signed in as a user with access to the project
- A finished run exists where at least one test is linked to a defect in the configured issue tracker
- The run is opened in the Run Detail panel

## Steps
- Click the `Defects` tab
  - _Expected_:
  - The empty-state message is NOT displayed
  - A list of rows is shown, one per test with a linked defect
- Observe a defect row
  - _Expected_:
  - The row shows the linked test title
  - The row exposes the defect identifier and an external link to the issue tracker
- Click the external defect link
  - _Expected_: a new browser tab opens and navigates to the defect in the configured issue tracker (JIRA / GitHub / etc.)

<!-- test
type: manual
priority: low
source: ac-delta-8
automation: candidate
-->
## Folders toggle in the Statistics Suites section collapses and expands nested folders

Verifies the `Folders` switch in the `Suites` section of the Statistics tab toggles the grouping between flat suite list and folder-nested layout.

## Preconditions
- Signed in as a user with access to the project
- A finished run is opened in the Run Detail panel on the `Statistics` tab
- The run contains tests organised across at least two parent folders with nested suites

## Steps
- Locate the `Folders` switch inside the `Suites` section header
  - _Expected_: the switch is displayed with its current state (default OFF — flat suite list)
- Click the `Folders` switch to turn it ON
  - _Expected_:
  - The switch enters ON state
  - The `Suites` section rows collapse into a parent-folder hierarchy with expand chevrons per folder
- Click the `Folders` switch again to turn it OFF
  - _Expected_: the section reverts to the flat suite list layout
