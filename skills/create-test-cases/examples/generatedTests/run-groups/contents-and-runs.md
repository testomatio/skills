<!-- suite -->
# Contents and Runs

Covers populating a RunGroup with runs — launching a fresh manual run from inside a group, moving an existing run into a group, and adding multiple existing runs to a group at once. Does NOT cover the runner execution behaviour itself (owned by #2 test-execution-runner) or the New Manual Run dialog field set beyond the pre-populated RunGroup field (owned by #1 run-creation).

<!-- test
type: manual
priority: critical
source: AC-51, ac-delta-7
automation: candidate
-->
## Add Manual Run from inside a RunGroup pre-populates the RunGroup field @smoke

Verifies the `Manual Run` entry point on the RunGroup detail panel opens the New Manual Run sidebar with the current RunGroup already selected, and the launched run lands inside that group.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups add-manual-run` exists and is empty (no child runs)
- The Runs page shows the existing group

## Steps
- Click the `run-groups add-manual-run` row on the Runs list
  - _Expected_: the RunGroup detail panel opens on the right side with the empty-state message `"Empty RunGroup. Create a new manual run or attach a report for automated tests to this RunGroup."`
- Click the `Manual Run` button inside the detail panel
  - _Expected_: the New Manual Run sidebar opens
- Observe the RunGroup field in the sidebar
  - _Expected_: the `RunGroup` field is pre-populated with `run-groups add-manual-run` and is editable (clear / re-pick)
- Pick the `All tests` scope, leave Title empty, and click `Launch`
  - _Expected_: the run is created and the Manual Runner opens
- Return to the Runs page and open the `run-groups add-manual-run` detail panel again
  - _Expected_:
  - The empty-state message is no longer shown
  - The newly launched run appears in the child-run list inside the panel

<!-- test
type: manual
priority: high
source: AC-52
automation: candidate
-->
## Move an existing Run into a RunGroup via the row extra menu @smoke

Walks through moving a top-level run into a destination RunGroup using the run row's extra menu and verifies the run is now nested inside the group.

## Preconditions
- Signed in as a user with access to a project
- A top-level Run named `run-to-move AC-52` exists and is NOT inside any group
- A RunGroup named `run-groups move-destination` exists
- The Runs page shows both

## Steps
- Click the extra menu (`…`) on the `run-to-move AC-52` row
  - _Expected_: the row's action menu opens and `Move` is among the items
- Click `Move`
  - _Expected_: the Move destination picker opens with the heading `Move to...` and a search input labelled `Search rungroup by title`
- Type `run-groups move-destination` into the search input
  - _Expected_: the list filters to show the matching group; a `Root` entry remains visible above group entries
- Click the `run-groups move-destination` entry
  - _Expected_: the entry becomes selected and the `Move` button at the bottom becomes enabled
- Click `Move`
  - _Expected_: the picker closes and the run row disappears from the top-level Runs list
- Open the `run-groups move-destination` detail panel
  - _Expected_: the child run list contains `run-to-move AC-52`

<!-- test
type: manual
priority: high
source: AC-53, ac-delta-14
automation: candidate
-->
## Add Existing Run(s) to a RunGroup via the group extra menu @smoke

Uses the group's extra menu to add two top-level runs to an existing group in a single picker interaction.

## Preconditions
- Signed in as a user with access to a project
- Two top-level Runs exist with Names `run-existing-a AC-53` and `run-existing-b AC-53`, not inside any group
- A RunGroup named `run-groups add-existing` exists

## Steps
- Open the extra menu of the `run-groups add-existing` group and click `Add Existing Run`
  - _Expected_: the Add Existing Run picker opens with the heading `Select run` and a search input labelled `Search run by title`
- Select the row for `run-existing-a AC-53`
  - _Expected_:
  - The row renders as selected
  - The `Move Runs to Group` primary button becomes enabled
- Select the row for `run-existing-b AC-53`
  - _Expected_: both rows render as selected
- Click `Move Runs to Group`
  - _Expected_: the picker closes
- Open the `run-groups add-existing` detail panel
  - _Expected_:
  - The child run list contains both `run-existing-a AC-53` and `run-existing-b AC-53`
  - Neither run still appears on the top-level Runs list

<!-- test
type: manual
priority: normal
source: ac-delta-14
automation: candidate
-->
## Add Existing Run picker excludes runs already in the group @boundary

Verifies the picker surfaces only runs that are NOT already in the current group — preventing duplicate membership.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups add-existing excludes` contains one child run `run-inside AC-53-excl`
- A top-level Run named `run-outside AC-53-excl` exists and is NOT in any group

## Steps
- Open the group's detail panel and extra menu, then click `Add Existing Run`
  - _Expected_: the Add Existing Run picker opens
- Search for `run-inside` in the picker search input
  - _Expected_:
  - The picker does NOT list `run-inside AC-53-excl`
  - An empty / no-match state or an unchanged filtered list is shown
- Clear the search input and search for `run-outside`
  - _Expected_: the picker lists `run-outside AC-53-excl` as selectable
- Click `Cancel`
  - _Expected_: the picker closes and the group's child list is unchanged

<!-- test
type: manual
priority: normal
source: ac-delta-14
automation: candidate
-->
## Add Existing Run picker shows an empty selectable list when every existing run already belongs to the group @boundary

Boundary case where the eligible-run pool is zero: every run in the project is already inside the current group. The picker should open but expose no selectable row.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups add-existing empty-pool` contains every run that currently exists on the project (top-level Runs list has zero ungrouped runs; other groups have been emptied or archived for the scope of this test)

## Steps
- Open the group's detail panel and extra menu, then click `Add Existing Run`
  - _Expected_: the Add Existing Run picker opens with the heading `Select run`
- Observe the body of the picker
  - _Expected_:
  - The run list is empty OR renders an explicit empty-state message
  - The `Move Runs to Group` primary button is disabled
- Type any characters into the search input
  - _Expected_: the list remains empty (no results match because no eligible runs exist)
- Click `Cancel`
  - _Expected_: the picker closes and the group's child list is unchanged
