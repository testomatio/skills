<!-- suite -->
# Run Actions — Archive and Purge

Covers Archive and Purge operations initiated from the active Runs list — single-run extra menu, bulk multi-select, and their confirmation dialogs. Does NOT cover RunGroup cascade (owned by `rungroup-cascade.md`), state-dependent behavior such as archiving an ongoing run (owned by `run-state-behavior.md`), Unarchive (owned by `restore-and-delete.md`), or automatic retention-based purge (owned by `retention-settings.md`).

<!-- test
type: manual
priority: critical
source: AC-69, AC-75, ac-delta-1, ac-delta-16
automation: candidate
-->
## Archive a single run from the row extra menu @smoke

Archives one finished run from the Runs list and verifies the run leaves the active list, appears in the Runs Archive, and the footer count is updated.

## Preconditions
- Signed in as a user with `Manager` or `Owner` role on the project
- A finished run named `archive-single-source` is visible on the Runs list
- The Runs Archive currently contains a known count `N` of archived runs

## Steps
- Open the extra menu on the `archive-single-source` run row
  - _Expected_: the row's extra menu opens showing `Move to Archive` and `Purge` items
- Click `Move to Archive`
  - _Expected_:
  - The archive confirmation dialog opens with a warning icon
  - The body text reads `"You are going to archive 1 run"`
  - The dialog has `Confirm` and `Cancel` buttons
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - The `archive-single-source` row is no longer on the active Runs list
  - The `Runs Archive` footer link count becomes `N + 1`
- Navigate to the `Runs Archive` page
  - _Expected_: the `archive-single-source` run is present on the first page of the archive list with an `archived` badge visible inline after its title

<!-- test
type: manual
priority: normal
source: AC-75, ac-delta-1
automation: candidate
-->
## Cancelling the archive confirmation keeps the run active @negative

Verifies the archive dialog can be dismissed without affecting run state — a safety check for a potentially disruptive action.

## Preconditions
- Signed in as a user with `Manager` role
- A finished run named `archive-cancel-source` is on the Runs list

## Steps
- Open the extra menu on the `archive-cancel-source` run row
  - _Expected_: the row extra menu opens showing `Move to Archive` and `Purge` items
- Click `Move to Archive`
  - _Expected_: the archive confirmation dialog opens with body text `"You are going to archive 1 run"`
- Click `Cancel`
  - _Expected_:
  - The dialog closes
  - No toast is shown
  - `archive-cancel-source` remains on the active Runs list in its original position
- Navigate to the `Runs Archive` page
  - _Expected_: `archive-cancel-source` does NOT appear on the Runs Archive list

<!-- test
type: manual
priority: critical
source: AC-69, AC-78, ac-delta-3, ac-delta-16
automation: candidate
-->
## Purge a single run from the row extra menu @smoke

Purges one finished run and verifies it moves to the Runs Archive with a `purged` badge and distinct dialog wording/icon vs Archive.

## Preconditions
- Signed in as a user with `Manager` role
- A finished run named `purge-single-source` is on the Runs list

## Steps
- Open the extra menu on the `purge-single-source` run row and click `Purge`
  - _Expected_:
  - The purge confirmation dialog opens with a red error icon (distinct from the Archive warning icon)
  - The body text reads `"This run will be purged and moved to Archive. To delete it permanently visit Runs Archive page."`
  - The confirm button is labelled `Purge`
- Click `Purge`
  - _Expected_:
  - The dialog closes
  - `purge-single-source` leaves the active Runs list
- Navigate to the `Runs Archive` page
  - _Expected_:
  - `purge-single-source` appears on the list
  - A `purged` badge is visible inline after the run title

<!-- test
type: manual
priority: normal
source: AC-78, ac-delta-3
automation: candidate
-->
## Cancelling the purge confirmation keeps the run active @negative

Verifies the purge dialog can be cancelled with no side effects — mirrors the archive-cancel safety check but for a more destructive action.

## Preconditions
- Signed in as a user with `Manager` role
- A finished run named `purge-cancel-source` is on the Runs list

## Steps
- Open the extra menu on the `purge-cancel-source` run row
  - _Expected_: the row extra menu opens showing `Move to Archive` and `Purge` items
- Click `Purge`
  - _Expected_: the purge confirmation dialog opens with body text starting with `"This run will be purged"`
- Click `Cancel`
  - _Expected_:
  - The dialog closes
  - `purge-cancel-source` remains on the active Runs list
- Navigate to the `Runs Archive` page
  - _Expected_: `purge-cancel-source` does NOT appear on the archive list

<!-- test
type: manual
priority: normal
source: AC-78, ac-delta-4
automation: deferred
automation-note: requires a pre-existing run with attachments, custom statuses, and failure stack traces — fixture setup spans Manual Runner (#2) and Settings → Custom Statuses; best verified as a cross-feature flow.
-->
## Purged run preserves statuses, attachments, and custom statuses but removes stack traces

Verifies that after purge, recorded test results and artifacts remain intact while failure stack traces are stripped (storage-compression contract).

## Preconditions
- Signed in as a user with `Manager` role
- A finished run named `purge-preserves-source` has:
  - At least one test marked `Failed` with a stack trace in its Result message
  - At least one test marked `Passed` with an attachment (image)
  - At least one test carrying a configured custom status
- The run is on the active Runs list

## Steps
- Open the extra menu on the `purge-preserves-source` run row
  - _Expected_: the row extra menu opens showing `Move to Archive` and `Purge` items
- Click `Purge`
  - _Expected_: the purge confirmation dialog opens
- Click `Purge`
  - _Expected_: the dialog closes and the run leaves the active list
- Navigate to the `Runs Archive` page and open `purge-preserves-source`
  - _Expected_:
  - All three tests retain their recorded statuses (`Passed`, `Failed`, and the custom-status test)
  - The attachment on the passed test is still accessible
  - The custom-status label is still visible on its test
- Open the previously-failed test detail
  - _Expected_:
  - The Result message is still present
  - The stack trace section that existed before purge is empty or absent
  - The run carries the `purged` badge

<!-- test
type: manual
priority: critical
source: AC-71, ac-delta-2
automation: candidate
-->
## Bulk archive multiple runs via Multi-select @smoke

Archives three runs in a single confirmation via the Multi-select bottom toolbar on the active Runs list.

## Preconditions
- Signed in as a user with `Manager` role
- Three finished runs exist on the Runs list: `bulk-archive-1`, `bulk-archive-2`, `bulk-archive-3`
- Multi-select mode is available in the toolbar

## Steps
- Click the `Multi-select` toolbar icon button (tooltip `Multi-select`)
  - _Expected_: each run row shows a selection checkbox and the bulk action bar appears at the bottom
- Tick the checkboxes for `bulk-archive-1`, `bulk-archive-2`, and `bulk-archive-3`
  - _Expected_:
  - The bulk action bar shows `3 runs`
  - The `Archive` button is enabled
- Click the `Archive` button in the bulk action bar
  - _Expected_:
  - The bulk archive confirmation dialog opens with body text `"You are going to archive 3 runs"`
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - All three rows leave the active Runs list
- Navigate to the `Runs Archive` page
  - _Expected_: all three runs appear in the archive list

<!-- test
type: manual
priority: high
source: AC-71, ac-delta-2
automation: candidate
-->
## Bulk purge multiple runs via Multi-select "Delete" action

Verifies that the bottom-toolbar `Delete` button on the active Runs list is actually a bulk Purge action, per the distinct dialog wording. Covers the mislabelled-action contract.

## Preconditions
- Signed in as a user with `Manager` role
- Three finished runs exist on the Runs list: `bulk-purge-1`, `bulk-purge-2`, `bulk-purge-3`

## Steps
- Click the `Multi-select` toolbar icon button
  - _Expected_: checkboxes appear on each row and the bulk action bar is visible
- Tick the checkboxes for `bulk-purge-1`, `bulk-purge-2`, and `bulk-purge-3`
  - _Expected_: the bulk action bar shows `3 runs`
- Click the `Delete` button in the bulk action bar
  - _Expected_:
  - A confirmation dialog opens with a red error icon
  - Body text reads `"These 3 runs will be purged and moved to Archive. To delete them permanently visit Runs Archive page."`
  - The confirm button is labelled `Purge`
- Click `Purge`
  - _Expected_:
  - The dialog closes
  - All three runs leave the active Runs list
- Navigate to the `Runs Archive` page
  - _Expected_: all three runs appear with the `purged` badge

<!-- test
type: manual
priority: normal
source: AC-71, ac-delta-2
automation: candidate
-->
## Select All link bulk-archives every run on the current page @boundary

Covers the upper bound of a single-page bulk archive — using the `Select all` shortcut in the Multi-select bar.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs list has at least five finished runs visible on the current page
- No other filters are applied

## Steps
- Click the `Multi-select` toolbar icon button
  - _Expected_: checkboxes appear on every row and the bulk action bar is visible
- Click the `Select all` link in the bulk action bar
  - _Expected_:
  - Every checkbox on the current page becomes ticked
  - The bulk action bar shows the total number of runs selected (matches row count)
- Click the `Archive` button in the bulk action bar
  - _Expected_: the bulk archive confirmation dialog opens with body text matching the selected count, e.g. `"You are going to archive 5 runs"`
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - Every previously-selected run leaves the active Runs list
- Navigate to the `Runs Archive` page
  - _Expected_: the same set of runs is present in the archive, each with an `archived` badge

<!-- test
type: manual
priority: normal
source: AC-71, ac-delta-2
automation: candidate
-->
## Bulk Archive button is disabled when no runs are selected @negative

Covers the selection-scope guard: entering Multi-select mode without ticking any row must not allow a destructive bulk action.

## Preconditions
- Signed in as a user with `Manager` role
- At least one finished run is visible on the Runs list

## Steps
- Click the `Multi-select` toolbar icon button
  - _Expected_:
  - Checkboxes appear on every row with no row pre-selected
  - The bulk action bar shows `0 runs`
- Observe the bulk action bar without ticking any checkbox
  - _Expected_:
  - The `Archive` button is disabled or non-interactive
  - The `Delete` (bulk purge) button is disabled or non-interactive
- Click the `Archive` button
  - _Expected_: no confirmation dialog opens; the list remains unchanged
