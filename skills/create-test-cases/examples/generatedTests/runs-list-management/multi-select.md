<!-- suite -->
# Multi-Select

Covers the Multi-select mode on the Runs list — toggling the mode, the bottom bulk-action toolbar behavior, conditional enablement of Compare, the Extra dropdown content at 1 vs 2+ selections, Select all, and bulk Archive / Labels. Downstream destinations such as the Compare view and the Download file content are owned by #8 run-detail-and-report; the in-runner multi-select (owned by #10 bulk-status-actions) is distinct and not exercised here.

<!-- test
type: manual
priority: critical
source: AC-71, ac-delta-7
automation: candidate
-->
## Toggling Multi-select on and off shows and hides the row checkboxes and bottom toolbar @smoke

Verifies the full on/off cycle of Multi-select mode — the toolbar button shows per-row checkboxes plus a bottom bulk-action toolbar when active, and both disappear when deactivated.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Default view
- At least two finished runs are visible

## Steps
- Observe the Runs list in its default state
  - _Expected_: no per-row checkboxes are visible and no bottom bulk-action toolbar is rendered
- Click the `Multi-select` icon button in the Runs list toolbar
  - _Expected_:
  - A checkbox appears at the leading edge of every run row
  - The bottom bulk-action toolbar is NOT yet rendered (it appears only after the first selection)
- Select one run by clicking its row checkbox
  - _Expected_:
  - The bottom toolbar slides in with the selection counter `1 run` and the actions `Select all`, `Archive`, `Labels`, `Delete`, plus an Extra dropdown button
- Click the `Multi-select` icon button again
  - _Expected_:
  - All per-row checkboxes are removed
  - The bottom bulk-action toolbar is removed

<!-- test
type: manual
priority: high
source: AC-71, ac-delta-7
automation: candidate
-->
## Closing the bulk toolbar via the close button keeps selection hidden

Verifies that the close control on the bulk toolbar dismisses the toolbar without leaving phantom bulk actions on the page.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is in Multi-select mode with one run selected

## Steps
- Observe the bottom bulk-action toolbar
  - _Expected_: the toolbar is rendered with a close (`×`) control
- Click the close (`×`) control on the bottom toolbar
  - _Expected_:
  - The bottom toolbar is removed
  - Per-row checkboxes are no longer actionable (Multi-select mode returns to its off-state)
  - The list is rendered in the Default state

<!-- test
type: manual
priority: critical
source: AC-71, AC-92, ac-delta-8
automation: candidate
-->
## Compare enables only at two or more selected runs and navigates to the comparison view @boundary

Verifies the Compare affordance is gated on a minimum of two selected runs — at 0 or 1 selected the link is absent or disabled; at 2+ selected it becomes a working entry to the comparison view owned by #8.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Multi-select mode with no selection yet
- At least three finished runs are visible

## Steps
- Observe the bottom bulk-action toolbar with no rows selected
  - _Expected_: the toolbar is not yet rendered (0 selected)
- Select the first run row
  - _Expected_:
  - The bottom toolbar appears with `1 run` selected
  - A `Compare` link is NOT present (or is disabled)
- Select a second run row
  - _Expected_:
  - The selection counter reads `2 runs`
  - A `Compare` link appears between `Labels` and `Delete`
- Click the `Compare` link
  - _Expected_: navigation proceeds to a `/runs/compare?ids=[...]` URL containing the two selected run IDs (destination view is owned by #8)

<!-- test
type: manual
priority: normal
source: AC-71, AC-87, ac-delta-8
automation: candidate
-->
## Extra dropdown shows ${extra_items} at ${selection_size} @boundary

Confirms the Extra dropdown on the bulk toolbar exposes a different option set depending on the selection size; the `Merge` action is only surfaced at 2+ selections.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Multi-select mode
- At least two finished runs are visible

## Steps
- Select `${selection_size}` matching runs in the list
  - _Expected_: the bottom toolbar shows the counter `${selection_size}` with the base actions
- Click the Extra dropdown button on the bottom toolbar
  - _Expected_: a popover opens showing `${extra_items}` in that order
- Press `Escape`
  - _Expected_: the Extra dropdown closes and the selection is preserved

<!-- example -->
| selection_size | extra_items |
| --- | --- |
| 1 run | Link, Download, Move |
| 2 runs | Link, Download, Merge, Move |

<!-- test
type: manual
priority: normal
source: AC-71
automation: candidate
-->
## Select all selects every visible run row in Multi-select mode

Confirms the Select all action on the bulk toolbar checks every visible row at once and updates the selection counter accordingly.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Multi-select mode with no rows selected yet
- At least three run rows are visible in the current view

## Steps
- Select a single run row to show the bulk toolbar
  - _Expected_: the toolbar shows `1 run`
- Click the `Select all` link on the bottom toolbar
  - _Expected_:
  - Every visible run row's checkbox becomes checked
  - The counter updates to match the number of visible rows

<!-- test
type: manual
priority: high
source: AC-71, ac-delta-5
automation: candidate
-->
## Bulk Archive moves every selected run off the default list

Exercises the bulk Archive action — selects multiple runs, archives them together, and verifies they leave the default Runs list.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Multi-select mode
- At least two finished runs are visible and not archived

## Steps
- Select two finished runs via their row checkboxes
  - _Expected_: the bottom toolbar reads `2 runs`
- Click the `Archive` button on the bottom toolbar
  - _Expected_:
  - An archive confirmation toast `"Run has been archived"` appears (one per archived run)
  - Both selected runs are removed from the Default-view list
- Reload the Runs page
  - _Expected_: both archived runs remain absent from the default list

<!-- test
type: manual
priority: normal
source: AC-71, ac-delta-9
automation: candidate
-->
## Bulk Labels applies a label to every selected run

Verifies that the bulk Labels action applies one or more labels to all selected runs in a single submission; the Labels column in Custom view reflects the change.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Custom view so that the `Labels` column is visible
- At least one project-level label (for example `regression`) exists and can be applied to runs
- At least two finished runs are visible and unlabeled

## Steps
- Enable Multi-select mode
  - _Expected_: per-row checkboxes appear
- Select two finished runs
  - _Expected_: the bottom toolbar reads `2 runs`
- Click the `Labels` button on the bottom toolbar
  - _Expected_: a label picker opens
- Select the `regression` label in the picker and confirm the change
  - _Expected_: the picker closes
- Observe the `Labels` column for each selected run
  - _Expected_: both runs now display the `regression` label chip in the `Labels` column

<!-- test
type: manual
priority: normal
source: AC-71, ac-delta-7
automation: candidate
-->
## Deselecting the last selected run removes the bulk toolbar @boundary

Verifies the boundary at which the bulk-action toolbar disappears — when the last checked row is unchecked, the toolbar slides out automatically.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is in Multi-select mode with exactly one run currently selected and the bottom toolbar visible

## Steps
- Observe the bottom toolbar
  - _Expected_: the toolbar shows `1 run` and the action buttons are visible
- Uncheck the selected run's checkbox
  - _Expected_:
  - The selection counter drops to zero
  - The bottom toolbar is removed from the page
  - Per-row checkboxes remain visible (Multi-select mode is still on until toggled off)
- Check the same row again
  - _Expected_: the bottom toolbar reappears with `1 run` and the full action set

<!-- test
type: manual
priority: normal
source: AC-71
automation: candidate
-->
## Merge action is absent in the Extra dropdown at a single selection @negative

Confirms the `Merge` action is gated on a minimum of two selected runs — at a single selection the Extra dropdown exposes only Link, Download, and Move.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is in Multi-select mode with the bulk toolbar showing `1 run`

## Steps
- Click the Extra dropdown button on the bottom toolbar
  - _Expected_: the dropdown opens with entries `Link`, `Download`, `Move` only
- Confirm `Merge` is not listed
  - _Expected_: no `Merge` entry is rendered in the dropdown
- Press `Escape` and select a second run row
  - _Expected_:
  - The dropdown closes
  - The selection counter reads `2 runs`
- Click the Extra dropdown button again
  - _Expected_: the dropdown now exposes `Link`, `Download`, `Merge`, `Move`
