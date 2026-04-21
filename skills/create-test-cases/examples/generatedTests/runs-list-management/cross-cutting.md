<!-- suite -->
# Cross-cutting

Covers the Runs list behaviors that exercise the four cross-cutting concerns from `destructuring.md` affecting runs-list-management: A (Multi-environment rendering), C (RunGroup membership in the Groups tab), E (Custom statuses via TQL `has_custom_status`), and H (bulk multi-select end-to-end). Each test cites both the applicable baseline AC and the sub-feature delta AC in `source:`.

<!-- test
type: manual
priority: normal
source: AC-68, AC-74, ac-delta-13
automation: candidate
-->
## Multi-environment runs render with environment indicators in the Runs list

Exercises cross-cutting concern A — a run created with two or more environment groups (concern owned by #4 environment-configuration) must appear in the Runs list with per-environment indicators visible in the `Tags & Envs` column when the list is in Custom view.

## Preconditions
- Signed in as a user with access to a project
- At least one finished run exists that was launched with two environment groups (for example `Browser:Chrome` and `Browser:Firefox`); creation of such a run is owned by #4 environment-configuration and is a precondition here
- The Runs page is open in Custom view so that the `Tags & Envs` column is visible

## Steps
- Locate the multi-environment run row in the Runs list
  - _Expected_: a row exists whose title corresponds to the seeded multi-environment run
- Observe the `Tags & Envs` column for that row
  - _Expected_:
  - The column shows both environment values associated with the run (for example `Browser:Chrome` and `Browser:Firefox`)
  - The environment indicators are rendered as distinct chips, not concatenated text
- Open the row's run detail panel
  - _Expected_: the right-side detail panel confirms the run's environment list matches the chips shown in the list row (detail panel content is owned by #8; this step is a corroborating observation only)

<!-- test
type: manual
priority: high
source: AC-68, AC-52, ac-delta-13
automation: candidate
-->
## RunGroup in the Groups tab expands in place to reveal child runs @smoke

Exercises cross-cutting concern C — the RunGroup membership surfaces in the Runs list via the Groups tab; expanding a group shows its child runs inline without navigation.

## Preconditions
- Signed in as a user with access to a project
- At least one RunGroup exists that contains at least two child runs
- The Runs page is open

## Steps
- Click the `Groups` filter tab
  - _Expected_:
  - The list shows only RunGroup rows
  - The URL contains `filterParam=groups%3Dtrue`
  - Individual run rows (outside any RunGroup) are not rendered in this view
- Click the expand chevron on a RunGroup row that contains at least two child runs
  - _Expected_:
  - The child runs are rendered inline directly below the parent RunGroup row
  - Each child run shows its environment label (for example `Firefox`, `Chrome`) when the underlying group is multi-environment
  - Each child run has its own `...` extra menu button
- Click the expand chevron again
  - _Expected_: the child runs collapse back under the parent RunGroup row

<!-- test
type: manual
priority: normal
source: AC-72, ac-delta-16
automation: deferred
automation-note: requires seeding a custom-status definition in project Settings and producing at least one run whose tests carry that custom status — the setup crosses into #2 test-execution-runner ownership and is brittle to automate in isolation
-->
## TQL has_custom_status filters the list to runs that recorded a custom status

Exercises cross-cutting concern E — the TQL `has_custom_status` variable must scope the Runs list to runs whose tests recorded a custom sub-status.

## Preconditions
- Signed in as a user with access to a project
- A custom status (for example `Blocked`) is configured in Project Settings
- At least one finished run exists whose tests recorded the `Blocked` custom status
- At least one finished run exists whose tests did NOT record any custom status
- The Runs page is open

## Steps
- Open the Query Language Editor modal
  - _Expected_: the editor opens empty
- Enter the query `has_custom_status == 'Blocked'` and click `Apply`
  - _Expected_:
  - The modal closes
  - The Runs list is filtered to include only the run(s) whose tests carry the `Blocked` custom status
  - The URL includes a `filterParam=` value encoding the query
  - A `"{N} runs found"` counter and a `Reset` button are visible
- Click `Reset`
  - _Expected_: the filter is cleared, the URL returns to `/runs`, and all runs reappear

<!-- test
type: manual
priority: high
source: AC-71, ac-delta-7, ac-delta-9
automation: candidate
-->
## Bulk multi-select archive applies across every selected run end to end @smoke

Exercises cross-cutting concern H end-to-end on the Runs list — enter Multi-select, select multiple runs, apply a single bulk action (Archive), and verify the result.

## Preconditions
- Signed in as a user with access to a project
- At least three finished, non-archived runs are visible on the Runs page
- The Runs page is open in Default view

## Steps
- Click the `Multi-select` toolbar button
  - _Expected_: per-row checkboxes appear on every run row
- Select the first three finished runs via their row checkboxes
  - _Expected_: the bottom toolbar shows `3 runs` selected with action buttons `Select all`, `Archive`, `Labels`, `Delete`, and an Extra dropdown
- Click the `Archive` button on the bottom toolbar
  - _Expected_:
  - A `"Run has been archived"` toast is shown (one per archived run)
  - All three selected runs are removed from the Default-view list
- Click the `Multi-select` toolbar button again to deactivate Multi-select mode
  - _Expected_: per-row checkboxes are removed and Multi-select mode is off
- Reload the Runs page
  - _Expected_:
  - None of the three archived runs appear in the default list
  - The archive entry link at the bottom of the Runs page reflects an increased `Runs Archive` count (destination page itself owned by #9 archive-and-purge)
