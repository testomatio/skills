<!-- suite -->
# Restore and Permanently Delete from Archive

Covers Unarchive (restore back to active list) and Permanent Delete (irreversible removal from Archive) flows for individual runs and bulk multi-select, plus verification that permanent deletions appear in project Pulse. Does NOT cover RunGroup Unarchive cascade (owned by `rungroup-cascade.md`), the archive action itself (owned by `run-actions.md`), or the full Pulse feature beyond verifying the `Deleted Run` event is recorded.

<!-- test
type: manual
priority: high
source: ac-delta-13
automation: candidate
-->
## Unarchive a single run from Runs Archive @smoke

Restores one archived run to the active Runs list and verifies the dialog wording, state, and counts.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs Archive contains an archived run named `restore-single-source`
- The Runs Archive footer count is known: `M` archived, active runs `K`

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: `restore-single-source` is visible with an archive-state indicator
- Open the extra menu on `restore-single-source` and click `Unarchive`
  - _Expected_:
  - The unarchive confirmation dialog opens
  - Body text reads `"You are going to restore 1 run"`
  - Confirm and Cancel buttons are present
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - `restore-single-source` disappears from the Runs Archive list
  - The Runs Archive count badge becomes `M - 1`
- Navigate to the active `Runs` page
  - _Expected_:
  - `restore-single-source` appears on the active list
  - No archived-state indicator is attached to the run

<!-- test
type: manual
priority: normal
source: ac-delta-14
automation: candidate
-->
## Bulk unarchive multiple runs from Runs Archive

Restores three archived runs at once via the Multi-select toolbar on the Runs Archive page.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs Archive contains three archived runs: `bulk-restore-1`, `bulk-restore-2`, `bulk-restore-3`

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: all three runs are visible
- Click the `Multi-select` toolbar icon button
  - _Expected_: selection checkboxes appear on every row and the bulk action bar is visible
- Tick the checkboxes for `bulk-restore-1`, `bulk-restore-2`, and `bulk-restore-3`
  - _Expected_:
  - The bulk action bar shows `3 runs`
  - The `Unarchive` button is enabled
- Click `Unarchive` in the bulk action bar
  - _Expected_:
  - A bulk unarchive confirmation dialog opens referencing `3 runs`
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - All three runs leave the Runs Archive list
- Navigate to the active `Runs` page
  - _Expected_: all three runs appear on the active list

<!-- test
type: manual
priority: normal
source: ac-delta-13
automation: candidate
-->
## Cancelling the unarchive confirmation keeps the run in the Archive @negative

Safety check — Cancel aborts the restore with no state change.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs Archive contains an archived run named `restore-cancel-source`

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: `restore-cancel-source` is visible in the archive list
- Open the extra menu on `restore-cancel-source`
  - _Expected_: the menu exposes `Unarchive` and `Delete` items
- Click `Unarchive`
  - _Expected_: the unarchive confirmation dialog opens with body text `"You are going to restore 1 run"`
- Click `Cancel`
  - _Expected_:
  - The dialog closes with no toast
  - `restore-cancel-source` remains in the Runs Archive list
  - No change to the active Runs list count

<!-- test
type: manual
priority: critical
source: AC-81, ac-delta-17
automation: candidate
-->
## Permanently delete a single run from the Archive via irreversible confirmation

Verifies the permanent-delete action uses the irreversible-wording dialog and removes the run from the Archive.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs Archive contains a purged run named `perm-delete-source`

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: `perm-delete-source` is visible in the archive list
- Open the extra menu on `perm-delete-source`
  - _Expected_: the menu exposes `Unarchive`, `Download as CSV`, and `Delete` items
- Click `Delete`
  - _Expected_:
  - A confirmation dialog opens with a red error icon
  - Body text reads `"You want to delete "perm-delete-source". This action cannot be undone."`
  - The confirm button is labelled `Delete`
- Click `Delete`
  - _Expected_:
  - The dialog closes
  - `perm-delete-source` disappears from the Runs Archive
  - The archive count decrements by 1
- Attempt to navigate back or to the active Runs page to locate the run
  - _Expected_: `perm-delete-source` is not present on any active or archive list

<!-- test
type: manual
priority: high
source: AC-81, ac-delta-17
automation: candidate
-->
## Cancelling the permanent-delete confirmation keeps the run in the Archive @negative

Safety check for the irreversible delete dialog — Cancel aborts with no state change.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs Archive contains a purged run named `perm-delete-cancel-source`

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: `perm-delete-cancel-source` is visible in the archive list
- Open the extra menu on `perm-delete-cancel-source`
  - _Expected_: the menu exposes `Delete`
- Click `Delete`
  - _Expected_: the permanent-delete dialog opens with body text starting `"You want to delete "perm-delete-cancel-source". This action cannot be undone."`
- Click `Cancel`
  - _Expected_:
  - The dialog closes
  - `perm-delete-cancel-source` remains in the Runs Archive with its purged badge
  - No toast is shown

<!-- test
type: manual
priority: high
source: AC-81, ac-delta-17
automation: candidate
-->
## Bulk permanent delete from Runs Archive Multi-select

Permanently deletes three runs at once via the Multi-select `Delete` button on the Runs Archive page (distinct from the Runs-list `Delete`, which is a bulk purge).

## Preconditions
- Signed in as a user with `Manager` role
- The Runs Archive contains three purged runs: `bulk-perm-1`, `bulk-perm-2`, `bulk-perm-3`

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: all three purged runs are visible in the archive list
- Click the `Multi-select` toolbar icon button
  - _Expected_: selection checkboxes appear on every row and the bulk action bar is visible
- Tick the checkboxes for `bulk-perm-1`, `bulk-perm-2`, and `bulk-perm-3`
  - _Expected_: the bulk action bar shows `3 runs` with `Unarchive` and `Delete` buttons
- Click `Delete`
  - _Expected_:
  - A confirmation dialog opens with a red error icon and irreversible-action wording referencing `3 runs`
- Click `Delete` (confirm)
  - _Expected_:
  - The dialog closes
  - All three rows are removed from the Runs Archive
  - The archive count decrements by 3

<!-- test
type: manual
priority: high
source: AC-81, ac-delta-18
automation: deferred
automation-note: asserting Pulse content spans two features (this one and Pulse / activity); the exact Pulse locator and event label must be confirmed with product before automation. Verify against project Pulse page.
-->
## Pulse records a Deleted Run event after permanent deletion @unclear

Verifies that the irreversible delete is tracked in the project Pulse with actor, timestamp, and run identifier. Marked `@unclear` because the exact Pulse UI locator for the `Deleted Run` entry is not captured in the UI delta.

## Preconditions
- Signed in as a user with `Manager` role (email `tester@example.com`)
- The Runs Archive contains a purged run named `pulse-delete-source`
- The project Pulse page is accessible from navigation

## Steps
- Navigate to the `Runs Archive` page and note the current date/time
  - _Expected_: `pulse-delete-source` is visible in the list
- Open the extra menu on `pulse-delete-source`
  - _Expected_: the menu exposes `Unarchive`, `Download as CSV`, and `Delete` items
- Click `Delete`
  - _Expected_: the permanent-delete dialog opens with irreversible-action wording
- Click `Delete` (confirm)
  - _Expected_: the dialog closes and `pulse-delete-source` is removed from the Archive
- Navigate to the project `Pulse` page
  - _Expected_: a new activity entry is visible at the top of the feed
- Inspect the newest entry
  - _Expected_:
  - The entry is categorised as `Deleted Run` (or equivalent label)
  - It references the run identifier or name (`pulse-delete-source`)
  - It shows the actor (`tester@example.com` or the user's display name)
  - The timestamp is within one minute of the delete action
