<!-- suite -->
# Archive and Purge

Covers the archive / unarchive / purge cascade on a RunGroup — each action propagates to every nested run in the group. Does NOT cover run-level archive or purge outside of a group (owned by #9 archive-and-purge) or the automatic retention setting (`Purge Old Runs`, owned by #9). The AC-57 limit of 20 000 runs per purge is NOT exercised in this suite — it is out of scope as not manually testable at that scale.

<!-- test
type: manual
priority: critical
source: AC-56, ac-delta-17
automation: candidate
-->
## Archive a RunGroup cascades to all nested runs @smoke

Archives a RunGroup that contains child runs and verifies the group and every nested run leave the active list, appear in the Groups / Runs Archive, and carry the `archived` badge.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups archive-source` contains at least two finished child runs
- The Runs page is open

## Steps
- Open the extra menu on the `run-groups archive-source` group and click `Move to Archive`
  - _Expected_: the archive confirmation dialog opens with the text `"You are going to archive this group"`
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - A success toast is shown with the message `"Rungroup has been archived!"`
  - The `run-groups archive-source` row is no longer on the active Runs list
- Navigate to the `Groups Archive` page
  - _Expected_:
  - The `run-groups archive-source` group appears on the list with an `archived` badge
- Navigate to the `Runs Archive` page
  - _Expected_: both previously-nested runs appear with an `archived` badge

<!-- test
type: manual
priority: high
source: AC-56, ac-delta-17
automation: candidate
-->
## Unarchive a RunGroup from Groups Archive restores all nested runs

Restores an archived RunGroup and verifies the group and all nested runs return to the active list with their prior statuses preserved.

## Preconditions
- Signed in as a user with access to a project
- An archived RunGroup named `run-groups unarchive-source` exists in the Groups Archive; it contains two previously-finished nested runs both carrying the `archived` badge

## Steps
- Navigate to the `Groups Archive` page
  - _Expected_: the `run-groups unarchive-source` group is visible with the `archived` badge
- Open the extra menu on `run-groups unarchive-source` and click `Unarchive`
  - _Expected_: an unarchive confirmation dialog opens with the text `"You are going to restore this group"`
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - A success toast is shown with the message `"Rungroup has been restore!"` (note: current UI uses this exact wording)
  - `run-groups unarchive-source` disappears from the Groups Archive page
- Navigate to the active Runs page
  - _Expected_:
  - `run-groups unarchive-source` appears on the active Runs list without an `archived` badge
- Open the group detail panel
  - _Expected_:
  - The two previously-nested runs are present in the child-run list
  - Each nested run's previous status (Passed / Failed / Skipped / Pending) is intact
  - No run carries the `archived` badge any more

<!-- test
type: manual
priority: normal
source: AC-56, ac-delta-17
automation: candidate
-->
## Cancelling the archive confirmation dialog leaves the group untouched @negative

Verifies the archive confirmation dialog can be dismissed without side effects — a safety check for a cascading action that impacts every nested run.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups archive-cancel` contains at least one finished child run
- The Runs page is open

## Steps
- Note the group is present on the active Runs list and record the name of the nested run
  - _Expected_: `run-groups archive-cancel` is visible with its nested run in the detail panel
- Open the group's extra menu and click `Move to Archive`
  - _Expected_: the archive confirmation dialog opens with the text `"You are going to archive this group"`
- Click `Cancel` (or `No`) on the confirmation dialog
  - _Expected_: the dialog closes without a toast
- Observe the Runs list
  - _Expected_:
  - `run-groups archive-cancel` is still on the active Runs list (not moved to the archive)
  - No `archived` badge is present on the group or the nested run
- Navigate to the `Groups Archive` page
  - _Expected_: `run-groups archive-cancel` is NOT present in the archive

<!-- test
type: manual
priority: high
source: AC-57, ac-delta-17
automation: candidate
-->
## Purge a RunGroup cascades with a Purged badge

Purges a RunGroup and verifies the group and every nested run appear in the Archive with the `Purged` badge while preserving test results, artifacts, and custom statuses per AC-78.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups purge-source` contains at least two finished child runs; each child run has at least one Passed result, one Failed result with a result message, and one attachment on a test result

## Steps
- Open the extra menu on the `run-groups purge-source` group and click `Purge`
  - _Expected_: a confirmation dialog opens asking to confirm the purge
- Click the confirm action on the dialog
  - _Expected_:
  - The dialog closes
  - `run-groups purge-source` no longer appears on the active Runs list
- Navigate to the `Groups Archive` page
  - _Expected_: `run-groups purge-source` is listed with the `Purged` badge
- Navigate to the `Runs Archive` page
  - _Expected_: both previously-nested runs are listed with the `Purged` badge
- Open one of the purged nested runs
  - _Expected_:
  - The Passed and Failed result entries are preserved with their statuses
  - The result message on the Failed entry is preserved
  - The attachment on the result is preserved
  - Per AC-78, stack-trace data (if any was present) is removed — other artifacts remain

<!-- test
type: manual
priority: normal
source: AC-57, ac-delta-17
automation: candidate
-->
## Cancelling the purge confirmation leaves the group and nested runs on the active list @negative

Verifies the purge confirmation can be dismissed without side effects — the group stays on the active Runs list and no `Purged` badge is applied.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups purge-cancel` contains at least one finished child run
- The Runs page is open

## Steps
- Note the group is present on the active Runs list with its nested run
  - _Expected_: `run-groups purge-cancel` and its child run are visible on the active list
- Open the group's extra menu and click `Purge`
  - _Expected_: a confirmation dialog opens asking to confirm the purge
- Click the dismiss / cancel control on the dialog (Cancel button or `×` close icon)
  - _Expected_: the dialog closes without a success toast
- Observe the Runs list
  - _Expected_:
  - `run-groups purge-cancel` is still on the active Runs list
  - The nested run still appears inside the group with no `Purged` badge
- Navigate to the `Runs Archive` page
  - _Expected_: neither the group nor its nested run appears with a `Purged` badge
