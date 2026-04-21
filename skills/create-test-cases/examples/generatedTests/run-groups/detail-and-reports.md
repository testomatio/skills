<!-- suite -->
# Detail and Reports

Covers the RunGroup right-side detail panel, the Combined Report page, the per-group Runs list customisation, and the disabled-state affordances of the group-level report buttons. Does NOT cover the Basic / Extended Run Report for individual runs (owned by #8 run-detail-and-report) or the Runs list filter tabs and TQL (owned by #7 runs-list-management).

<!-- test
type: manual
priority: normal
source: AC-54, ac-delta-6, ac-delta-8
automation: candidate
-->
## RunGroup detail panel on an empty group shows header, empty-state, and action buttons @smoke

Verifies the composition of the right-side detail panel for a RunGroup that currently has no child runs — header, empty-state message, and the expected primary actions.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups empty panel` exists and contains no child runs
- The Runs page is open

## Steps
- Click the `run-groups empty panel` row on the Runs list
  - _Expected_: the right-side detail panel opens and does NOT navigate away from the Runs list
- Observe the panel header
  - _Expected_:
  - The group name `run-groups empty panel` is shown as a heading
  - A `RunGroup #{id}` badge / link is present near the header
  - The group type indicator is present
- Observe the body of the panel
  - _Expected_: the empty-state message reads `"Empty RunGroup. Create a new manual run or attach a report for automated tests to this RunGroup."`
- Observe the action buttons inside the panel
  - _Expected_:
  - A `Manual Run` button is visible (enabled)
  - A `Combined Report` button is visible (disabled on empty group — its disabled state is covered by its own test)
  - An extra menu (`…`) button is visible
  - A `×` close button is visible and closes the panel to return to the Runs list

<!-- test
type: manual
priority: high
source: AC-54, ac-delta-10
automation: candidate
-->
## Combined Report shows Overview, Summary totals, and the Main Run anchor with within-group Compare To @smoke

Verifies that opening the Combined Report for a multi-run group renders the Overview list of participating runs, aggregated Summary totals, status filter buttons, and the Main Run / Compare To toggles for within-group peers.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups combined-report` contains at least three finished child runs, each with a mix of passed / failed / skipped / pending results
- The Runs page shows the group

## Steps
- Open the `run-groups combined-report` detail panel
  - _Expected_: the panel renders with the group header and the list of child runs
- Click the `Combined Report` button
  - _Expected_: the page navigates to the Combined Report with a URL containing `/runs/compare`
- Observe the top bar of the Combined Report
  - _Expected_:
  - A breadcrumb `RunGroup #{id}` links back to the group
  - Status filter buttons `Passed N`, `Failed N`, `Skipped N`, `Pending N` are visible with aggregate counts
- Observe the Overview section
  - _Expected_:
  - Each participating run in the group is listed
  - One run is labelled `Main Run`
  - Every other listed run exposes a `Compare To` control
- Observe the Summary section
  - _Expected_: a table lists at least the rows `Total Tests`, `Tests in all runs`, `Total Passed`, `Total Failed`, `Flaky`, `Skipped`, each with a count column
- Click a `Passed N` status filter button
  - _Expected_: the test list on the left updates to show only tests whose aggregated status is passed

<!-- test
type: manual
priority: normal
source: ac-delta-6
automation: candidate
-->
## Combined Report button is disabled on a RunGroup with no first-level runs @negative

Verifies the disabled-state affordance of the Combined Report button when the group has no first-level child runs and that the associated tooltip explains the requirement.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups no-first-level-runs` exists and contains no child runs
- The Runs page shows the group

## Steps
- Open the group detail panel for `run-groups no-first-level-runs`
  - _Expected_: the panel renders with the empty-state message
- Observe the `Combined Report` button
  - _Expected_: the button is visibly disabled (greyed out / non-interactive)
- Hover over the `Combined Report` button
  - _Expected_: a tooltip appears with the text `"There are no runs on the first level"`
- Attempt to click the button
  - _Expected_:
  - No navigation occurs
  - The URL remains on the Runs page

<!-- test
type: manual
priority: normal
source: ac-delta-6
automation: candidate
-->
## Rungroup Statistic Report button requires two or more child runs @boundary

Verifies the Rungroup Statistic Report (AI) button's threshold: disabled while fewer than 2 child runs exist, enabled once the second run is present.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups stat-threshold` contains exactly one finished child run
- The Runs page shows the group

## Steps
- Open the detail panel for `run-groups stat-threshold`
  - _Expected_: the panel renders and shows the one child run in its list
- Observe the `Rungroup Statistic Report` icon button
  - _Expected_: the button is visibly disabled
- Hover over the button
  - _Expected_: a tooltip appears with the text `"More than 1 runs inside rungroup is needed to generate a report."`
- Add a second finished run to the group (via `Manual Run` inside the group or via `Add Existing Run` from its extra menu)
  - _Expected_: the detail panel now lists two child runs
- Refresh the detail panel and re-observe the `Rungroup Statistic Report` button
  - _Expected_:
  - The button is now enabled
  - Hovering no longer shows the threshold tooltip

<!-- test
type: manual
priority: normal
source: ac-delta-11
automation: candidate
-->
## Switching the main run anchor in the Combined Report re-bases Summary totals @boundary

Verifies that picking a different run as the Main Run in the Combined Report updates the Overview label and re-computes the aggregated Summary totals without leaving the page.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups anchor-rebase` contains at least three finished child runs with distinct result profiles
- The Combined Report for the group is open

## Steps
- Observe the Overview section
  - _Expected_:
  - Exactly one run is labelled `Main Run`
  - The other runs expose a `Compare To` control
- Record the current values of the Summary rows `Total Passed`, `Total Failed`, `Flaky`
  - _Expected_: a baseline totals snapshot is noted
- Pick a different run in the Overview as the Main Run (via its anchor selector)
  - _Expected_:
  - The previously anchored run loses the `Main Run` label and regains a `Compare To` control
  - The newly picked run gains the `Main Run` label
- Observe the Summary totals
  - _Expected_:
  - The Summary rows re-compute relative to the new anchor
  - At least one of `Total Passed`, `Total Failed`, or `Flaky` shows a value distinct from the baseline snapshot

<!-- test
type: manual
priority: low
source: AC-55, ac-delta-9
automation: deferred
automation-note: requires a pre-seeded RunGroup with enough child runs + per-session local-storage assertions to compare global vs per-group state; left manual until the data-setup helper lands
-->
## Per-group Runs list column customisation persists independently of the global list @boundary

Verifies column customisation made on a specific RunGroup's Runs list is auto-saved and kept separate from the Runs list global customisation.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups column-customisation` contains at least two finished child runs
- The global Runs list custom-view settings are at their defaults

## Steps
- Open the `run-groups column-customisation` detail panel
  - _Expected_: the child-run list displays the default column headers including `Rungroups/runs`, `Status`, `Defects`, `Assigned to`, `Finished at`
- Open the column-settings button inside the group panel and hide the `Defects` column
  - _Expected_: the `Defects` column disappears from the group's child-run list
- Navigate away (close the panel and open the Runs page root)
  - _Expected_: the top-level Runs list still shows the `Defects` column (global settings unchanged)
- Re-open the `run-groups column-customisation` detail panel
  - _Expected_: the `Defects` column is still hidden on the group's child-run list (per-group setting persisted)
- Open the column-settings on the top-level Runs list and toggle a different column (for example hide `Finished at`)
  - _Expected_: the top-level list hides `Finished at`
- Re-open the `run-groups column-customisation` detail panel
  - _Expected_:
  - `Defects` remains hidden on the group's list
  - `Finished at` remains visible on the group's list (the top-level change did NOT cascade)

<!-- test
type: manual
priority: low
source: ac-delta-11
automation: manual-only
automation-note: behaviour depends on server-side eligibility of cross-group Compare-To targets which has not been confirmed by product; kept as a documentation test until answered
-->
## Combined Report Compare To across different RunGroups @unclear

Documents the current observable scope of the Compare To selector: whether it admits peer runs from OTHER groups or only runs within the current group.

## Preconditions
- Signed in as a user with access to a project
- Two RunGroups exist — `run-groups compare-from` with at least two finished runs and `run-groups compare-to` with at least one finished run
- The Combined Report of `run-groups compare-from` is open

## Steps
- Observe the Overview section of the Combined Report
  - _Expected_: only runs from `run-groups compare-from` are listed; no entries from `run-groups compare-to` are shown
- Look for an affordance to add a peer run from another group (for example an `Add run` or cross-group picker)
  - _Expected_:
  - If no such affordance is exposed: cross-group Compare-To is currently NOT supported — record the observation and close the test as `@unclear`
  - If an affordance is exposed: exact locator and flow to be confirmed with product and captured in a follow-up delta AC
- Record the observation in the test execution note and keep the test tagged `@unclear`
  - _Expected_: the test is closed as an `@unclear` probe pending product clarification; if behaviour changes a follow-up delta AC will replace this test
