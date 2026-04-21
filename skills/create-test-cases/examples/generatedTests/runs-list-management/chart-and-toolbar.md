<!-- suite -->
# Chart and Toolbar

Covers the chart area above the Runs list (show/hide toggle, legend interactions), the supporting toolbar affordances (Runs Status Report AI button, Expand-all, Archive entry links), the run-count badge in the breadcrumb, and pagination. The archive destination pages themselves are owned by #9 archive-and-purge — only the list-level entry and badge counts are verified here.

<!-- test
type: manual
priority: normal
source: ac-delta-1
automation: candidate
-->
## Toggling the chart hides and restores the chart area @smoke

Verifies the Hide / Show affordance above the chart — the chart SVG is removed and restored by the toggle; no toast is shown.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open with the chart visible in its default state

## Steps
- Observe the chart toggler control above the chart
  - _Expected_: the toggler renders the `hide-chart` icon variant
- Click the chart toggler
  - _Expected_:
  - The chart area collapses and no chart SVG is rendered
  - The toggler flips to the `show-chart` icon variant
  - The Runs list shifts up to occupy the freed space
  - No toast is shown
- Click the chart toggler again
  - _Expected_:
  - The chart area is restored to its visible state
  - The toggler returns to the `hide-chart` icon variant

<!-- test
type: manual
priority: normal
source: ac-delta-2
automation: candidate
-->
## Legend click toggles the ${dataset} dataset in the chart

Verifies each chart legend entry acts as a visibility toggle for its dataset.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open with the chart visible and at least one run represented on the chart for each of Passed / Failed / Skipped

## Steps
- Observe the chart legend row
  - _Expected_: the legend exposes `Passed`, `Failed`, and `Skipped` items and each is visibly interactive (cursor pointer)
- Click the `${dataset}` legend entry
  - _Expected_: the `${dataset}` dataset is removed from the chart rendering
- Click the `${dataset}` legend entry again
  - _Expected_: the `${dataset}` dataset returns to the chart rendering

<!-- example -->
| dataset |
| --- |
| Passed |
| Failed |
| Skipped |

<!-- test
type: manual
priority: normal
source: ac-delta-4
automation: candidate
automation-note: the enabled-state case depends on seeding ≥5 finished runs, which is setup-heavy; the disabled-state assertion is stable and worth automating even if the enabled case is skipped
-->
## Runs Status Report AI button is disabled below the 5-finished-runs threshold @boundary

Verifies the AI-generated Runs Status Report button is gated on ≥ 5 finished runs — below the threshold the button is disabled and a tooltip explains the reason.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in a project that contains fewer than 5 finished runs

## Steps
- Observe the `Runs Status Report` button in the Runs list toolbar
  - _Expected_: the button is visually disabled and is not clickable
- Hover the `Runs Status Report` button
  - _Expected_: a tooltip appears reading `"More than 5 runs are needed to generate a report."`
- Attempt to click the `Runs Status Report` button
  - _Expected_: no action is triggered and no modal opens

<!-- test
type: manual
priority: low
source: ac-delta-3
automation: candidate
-->
## Run count badge reflects the number of runs in the active tab

Confirms the numeric badge adjacent to the `Runs` breadcrumb matches the row count in the current tab and updates when the tab changes.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open on the `Manual` tab with at least one run
- The `Automated` tab is known to contain a different number of runs than the `Manual` tab

## Steps
- Note the run count badge value next to the `Runs` breadcrumb on the `Manual` tab
  - _Expected_: a numeric badge is visible; record the value
- Count the visible run rows under the `Manual` tab
  - _Expected_: the count matches the badge value
- Click the `Automated` tab
  - _Expected_: the badge value updates to reflect the number of Automated runs in the project

<!-- test
type: manual
priority: normal
source: ac-delta-14, AC-69
automation: candidate
-->
## Expand-all toolbar button expands and collapses every visible RunGroup row

Verifies the top-level Expand affordance in the Runs list toolbar toggles the expansion of all RunGroup rows at once.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open on the `Groups` tab with at least two RunGroups, each containing at least one child run

## Steps
- Observe the RunGroup rows in their default state
  - _Expected_: all RunGroup rows are rendered collapsed (no child rows visible)
- Click the `Expand` icon button in the Runs list toolbar
  - _Expected_: every RunGroup row expands and its child runs are rendered inline under the parent
- Click the `Expand` icon button again
  - _Expected_: every RunGroup row collapses and its child runs are hidden

<!-- test
type: manual
priority: normal
source: AC-77, ac-delta-17
automation: candidate
-->
## Archive entry links at the bottom of the Runs page navigate to ${archive_page}

Verifies the `Runs Archive` and `Groups Archive` links at the bottom of the Runs page show counts and navigate to the corresponding archive sections. The archive page content is owned by #9 archive-and-purge.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open and scrolled so that the archive entry links at the bottom are visible

## Steps
- Observe the `${archive_label}` link at the bottom of the Runs page
  - _Expected_: the link is visible with an adjacent count indicator
- Click the `${archive_label}` link
  - _Expected_: navigation proceeds to `${archive_url_pattern}`
- Observe the page header
  - _Expected_: the page header reflects the archive destination `${archive_page}`

<!-- example -->
| archive_label | archive_url_pattern | archive_page |
| --- | --- | --- |
| Runs Archive | `/projects/{project}/runs/archive` | Runs Archive |
| Groups Archive | `/projects/{project}/runs/group-archive` | Groups Archive |

<!-- test
type: manual
priority: normal
source: ac-delta-12
automation: candidate
automation-note: seeding requires a project with more runs than one page can hold; usable against a long-lived project but not a clean-slate one
-->
## Pagination first and last controls navigate and disable at boundaries @boundary

Exercises the first (`«`) and last (`»`) pagination controls and verifies they disable at the corresponding boundary pages.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open on a project that has more runs than fit on a single page (so at least two pages of pagination exist)

## Steps
- Observe the pagination controls at the bottom of the Runs list while on page 1
  - _Expected_:
  - The `«` (first page) control is visibly disabled
  - The current page indicator reads `1`
  - The `»` (last page) control is enabled
- Click the `»` (last page) control
  - _Expected_:
  - The list advances to the final page
  - The current page indicator updates to reflect the final page number
  - The `»` control is now visibly disabled
  - The `«` control is enabled
- Click the `«` (first page) control
  - _Expected_:
  - The list returns to page 1
  - The current page indicator returns to `1`
  - The `«` control becomes disabled again

<!-- test
type: manual
priority: low
source: AC-74
automation: candidate
-->
## Hyphenation toggle in Runs list settings wraps long column values

Covers the `Hyphenation (tags, labels, envs)` global wrapping option in the Runs list settings panel — a Custom-view UX option that affects how long multi-value column content is rendered.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Custom view with the `Tags & Envs` column visible
- At least one run is visible whose Tags or Envs list is long enough to exceed the column width without wrapping

## Steps
- Open the Settings gear
  - _Expected_: the `Runs list settings` panel opens with the `Hyphenation (tags, labels, envs)` checkbox unchecked by default
- Check the `Hyphenation (tags, labels, envs)` checkbox
  - _Expected_: the checkbox becomes checked
- Click `Save`
  - _Expected_:
  - The panel closes
  - The long `Tags & Envs` values now wrap to multiple lines instead of truncating
- Reopen the Settings gear and uncheck the Hyphenation checkbox, then Save
  - _Expected_: the Tags & Envs column returns to its default non-wrapping rendering
