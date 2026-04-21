<!-- suite -->
# Row Extra Menu

Covers the `...` (extra) menu exposed per row in the Runs list, including state-awareness between Finished / In-progress / RunGroup rows, the Pin/Unpin cycle, and the Move-to-RunGroup and Purge/Archive entry points. Downstream flows are owned by other sub-features: Relaunch / Launch a Copy / Advanced Relaunch live in #6 run-lifecycle, Labels and Export behaviors live in #8 run-detail-and-report, and Archive/Purge semantics live in #9 archive-and-purge. This suite verifies entry points, visibility, and immediate list-level reaction.

<!-- test
type: manual
priority: high
source: AC-69, AC-88, ac-delta-5
automation: candidate
-->
## Row extra menu exposes the ${state}-specific action set @smoke

Verifies the `...` menu content is state-aware — the option list differs for a finished run, an in-progress run, and a RunGroup row, with list-level actions that match what each state supports.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open
- The project contains at least one finished run, one in-progress run, and one RunGroup row

## Steps
- Locate the `${state}` row in the Runs list
  - _Expected_: the `${state}` row is visible
- Click the `...` extra menu button on the `${state}` row
  - _Expected_: a dropdown menu opens anchored to the row
- Inspect the menu items
  - _Expected_:
  - The menu exposes `${expected_items}`
  - Items not relevant to `${state}` (`${forbidden_items}`) are absent

<!-- example -->
| state | expected_items | forbidden_items |
| --- | --- | --- |
| Finished run | Relaunch, Advanced Relaunch, Launch a Copy, Edit, Finish, Pin, Export as PDF, Move, Labels, Move to Archive, Purge | Launch (in-progress), Add Automated Run, Mixed Run, Copy group |
| In-progress run | Launch, Advanced Relaunch, Edit, Finish, Pin, Export as PDF, Move, Labels, Move to Archive, Purge | Relaunch, Launch a Copy |
| RunGroup | Edit, Copy, Add Automated Run, Mixed Run, Pin, Move, Move to Archive, Purge | Relaunch, Launch a Copy, Launch, Labels |

<!-- test
type: manual
priority: critical
source: AC-70, ac-delta-6
automation: candidate
-->
## Pin then Unpin a run cycles the indicator and repositions the row @smoke

Exercises the full Pin/Unpin cycle on a run — confirms the pin indicator appears, the row moves to the top of the list, a confirmation toast is shown on Pin, and Unpin reverses the change silently.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Default view
- At least two finished runs exist and none are currently pinned

## Steps
- Note the title of the second run in the list (a run that is NOT currently at the top)
  - _Expected_: a baseline second-row title is observable
- Click the `...` menu on that run
  - _Expected_: the dropdown menu opens anchored to the row with `Pin` visible
- Click `Pin`
  - _Expected_:
  - A toast `"Run has been pinned"` appears
  - The pinned run is now the first row in the list
  - A pin indicator icon is rendered in the pinned row's title area
- Click the `...` menu on the now-pinned run
  - _Expected_: the menu exposes `Unpin` in place of `Pin`
- Click `Unpin`
  - _Expected_:
  - The pin indicator disappears from the row
  - The run returns to its chronological position in the list
  - No toast is shown on Unpin

<!-- test
type: manual
priority: normal
source: AC-70, ac-delta-6
automation: candidate
-->
## Pinning a RunGroup repositions the group to the top of the Groups tab

Confirms Pin applies equally to RunGroup rows and that the pinned group surfaces at the top of the Groups tab.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open and the `Groups` filter tab is active
- At least two RunGroups exist and none are currently pinned

## Steps
- Click the `...` menu on a RunGroup that is NOT currently at the top
  - _Expected_: the RunGroup menu exposes `Pin`
- Click `Pin`
  - _Expected_:
  - The pinned RunGroup becomes the first row in the Groups tab list
  - A pin indicator icon is rendered in the RunGroup title area

<!-- test
type: manual
priority: high
source: AC-52, ac-delta-5
automation: candidate
-->
## Moving a run to ${destination} via the Move dialog relocates the row

Verifies the Move-to-RunGroup dialog — selecting a destination enables the `Move` button, submitting relocates the run, and moving to `Root` detaches the run from any group.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Default view
- At least one named RunGroup exists (for example `E2E MultiEnv Test`) and at least one finished run currently resides at the project root (not inside a group)

## Steps
- Click the `...` menu on a finished run at the project root and click `Move`
  - _Expected_: a `Move to...` modal opens with a search box `"Search rungroup by title"` and a list of destinations including `Root`
- Observe the `Move` action button state
  - _Expected_: the `Move` button is disabled while no destination is selected
- Click the `${destination}` entry in the destination list
  - _Expected_:
  - The `${destination}` entry becomes the selected destination
  - The `Move` action button becomes enabled
- Click `Move`
  - _Expected_:
  - The modal closes
  - The run row is `${expected_location_change}` in the Runs list
- Return to the Runs list root view
  - _Expected_: the run now appears under `${expected_location_change_verification}`

<!-- example -->
| destination | expected_location_change | expected_location_change_verification |
| --- | --- | --- |
| a named RunGroup (for example `E2E MultiEnv Test`) | moved under that RunGroup | the chosen RunGroup when expanded |
| Root | detached from its current group | the project root list outside any RunGroup |

<!-- test
type: manual
priority: normal
source: AC-52, ac-delta-5
automation: candidate
-->
## Cancelling the Move dialog leaves the run in place @negative

Confirms the Move dialog's `Cancel` affordance abandons the move without relocating the run.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Default view
- A finished run is visible at a known list position

## Steps
- Click the `...` menu on the run and click `Move`
  - _Expected_: the `Move to...` modal opens
- Click a destination in the list
  - _Expected_: the `Move` button becomes enabled
- Click `Cancel`
  - _Expected_:
  - The modal closes without any action
  - The run remains at its original list position
  - No toast is shown

<!-- test
type: manual
priority: high
source: AC-69, ac-delta-5
automation: candidate
automation-note: the Archive flow hides the run from the default list; the assertion reuses the archive-page listing (owned by #9) only to confirm removal from the active list
-->
## Move to Archive via row extra menu removes the run from the active list

Verifies the list-level entry point for archiving — the `Move to Archive` action in the row menu removes the run from the default Runs list and surfaces the expected toast. The archive page itself is owned by #9 archive-and-purge.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Default view
- At least one finished run is visible and not archived

## Steps
- Note the title of the finished run that will be archived
  - _Expected_: a baseline title is observable
- Click the `...` menu on that run and click `Move to Archive`
  - _Expected_:
  - A toast `"Run has been archived"` appears
  - The row is removed from the Default-view list
- Reload the Runs page
  - _Expected_: the archived run is still absent from the default list

<!-- test
type: manual
priority: normal
source: AC-69
automation: candidate
-->
## Purge via row extra menu removes the run and shows the deletion toast

Verifies the Purge entry point on a row extra menu triggers the deletion flow and removes the row from the list; the downstream archive-with-purged-badge behavior is covered by #9.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Default view
- At least one finished run exists that can be purged (not the only remaining run)

## Steps
- Note the title of the finished run that will be purged
  - _Expected_: a baseline title is observable
- Click the `...` menu on that run and click `Purge`
  - _Expected_:
  - A toast `"Run has been deleted"` appears
  - The row is removed from the Default-view list
- Reload the Runs page
  - _Expected_: the purged run is still absent from the default list

<!-- test
type: manual
priority: normal
source: AC-52, ac-delta-5
automation: candidate
-->
## Move dialog in a project with no RunGroups shows Root as the only destination @negative

Verifies the Move dialog degrades gracefully when the project contains no RunGroups — only the `Root` destination is offered, and the dialog remains fully functional.

## Preconditions
- Signed in as a user with access to a project that currently has zero RunGroups defined
- At least one finished run exists in the project
- The Runs page is open

## Steps
- Click the `...` menu on the finished run and click `Move`
  - _Expected_: the `Move to...` modal opens with the search box `"Search rungroup by title"`
- Observe the destination list
  - _Expected_:
  - The `Root` entry is present
  - No named RunGroup entries are listed
- Type any string in the search box
  - _Expected_: the destination list still contains only `Root`
- Click `Cancel`
  - _Expected_: the modal closes without action and the run is unchanged
