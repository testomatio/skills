<!-- suite -->
# RunGroup Archive/Purge Cascade (Cross-cutting C)

Covers cross-cutting concern C (RunGroup membership) for archive/purge — archiving, unarchiving, or purging a RunGroup cascades to every nested run. Does NOT cover RunGroup creation (owned by `#5 run-groups`), the Combined Report or group detail behavior, or run-level archive outside a group (owned by `run-actions.md`). The 20 000-runs purge limit is exercised here as a boundary case per AC-57.

<!-- test
type: manual
priority: critical
source: AC-56, ac-delta-15
automation: candidate
-->
## Archive a RunGroup cascades to every nested run

Archives a RunGroup with two nested finished runs and verifies both the group and every nested run leave the active list and appear in their respective archives.

## Preconditions
- Signed in as a user with `Manager` role
- A RunGroup named `cascade-archive-source` contains two finished child runs: `cascade-run-a` (Passed/Failed/Skipped) and `cascade-run-b` (all Passed)
- The Runs page shows the group on the active list

## Steps
- Open the extra menu on the `cascade-archive-source` group row and click `Move to Archive`
  - _Expected_: the archive confirmation dialog opens with text indicating the group archive action
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - A success toast is shown with the message `"Rungroup has been archived!"`
  - `cascade-archive-source` is no longer on the active Runs list
- Navigate to the `Groups Archive` page
  - _Expected_: `cascade-archive-source` appears on the list with an `archived` badge
- Navigate to the `Runs Archive` page
  - _Expected_:
  - Both `cascade-run-a` and `cascade-run-b` appear on the archive list
  - Each run row shows the archived-state indicator

<!-- test
type: manual
priority: high
source: AC-56, ac-delta-15
automation: candidate
-->
## Unarchive a RunGroup from Groups Archive restores all nested runs @smoke

Restores an archived RunGroup and verifies the group plus every nested run returns to the active list with prior statuses preserved.

## Preconditions
- Signed in as a user with `Manager` role
- An archived RunGroup named `cascade-unarchive-source` exists in the Groups Archive with two nested runs that each retained their pre-archive statuses

## Steps
- Navigate to the `Groups Archive` page
  - _Expected_: `cascade-unarchive-source` is visible with an `archived` badge
- Open the extra menu on `cascade-unarchive-source`
  - _Expected_: the menu exposes `Unarchive` and `Purge` items
- Click `Unarchive`
  - _Expected_: the unarchive confirmation dialog opens with body text `"You are going to restore this group"`
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - A success toast is shown
  - `cascade-unarchive-source` disappears from the Groups Archive list
- Navigate to the active Runs page
  - _Expected_:
  - `cascade-unarchive-source` appears on the active Runs list without an archived badge
- Expand `cascade-unarchive-source` or open its detail
  - _Expected_:
  - Both previously-nested runs are present
  - Each nested run retains its pre-archive status (Passed / Failed / Skipped counts unchanged)
  - No nested run carries an `archived` badge any more

<!-- test
type: manual
priority: high
source: AC-57, ac-delta-15
automation: candidate
-->
## Purge an archived RunGroup deletes the group and moves nested runs to Runs Archive

Purging a RunGroup from the Groups Archive deletes the group entity; its nested runs remain in the Runs Archive.

## Preconditions
- Signed in as a user with `Manager` role
- An archived RunGroup named `cascade-purge-source` exists in the Groups Archive with two nested runs

## Steps
- Navigate to the `Groups Archive` page and open the extra menu on `cascade-purge-source`
  - _Expected_: the menu exposes `Unarchive` and `Purge` items
- Click `Purge`
  - _Expected_:
  - The group purge confirmation dialog opens with a red error icon
  - Body text reads `"This action will delete the group and the nested runs will be moved to the Archive."`
  - The confirm button is labelled `Purge`
- Click `Purge`
  - _Expected_:
  - The dialog closes
  - `cascade-purge-source` disappears from the Groups Archive list
- Navigate to the `Runs Archive` page
  - _Expected_:
  - Both nested runs from `cascade-purge-source` are visible
  - Each nested run row shows the archived / purged state (no longer linked to the deleted group)

<!-- test
type: manual
priority: high
source: AC-56, ac-delta-1
automation: candidate
-->
## Cancelling the RunGroup archive confirmation leaves the group and nested runs untouched @negative

Safety check for the cascading archive — Cancel aborts without impacting the group or any nested run.

## Preconditions
- Signed in as a user with `Manager` role
- A RunGroup named `cascade-cancel-source` with two finished nested runs exists on the active Runs list

## Steps
- Open the extra menu on `cascade-cancel-source`
  - _Expected_: the menu exposes `Move to Archive` and other items
- Click `Move to Archive`
  - _Expected_: the archive confirmation dialog opens
- Click `Cancel`
  - _Expected_:
  - The dialog closes with no toast
  - `cascade-cancel-source` is still on the active Runs list
- Navigate to the `Groups Archive` page
  - _Expected_: `cascade-cancel-source` does NOT appear on the archive list
- Return to the active Runs list and expand `cascade-cancel-source`
  - _Expected_: both nested runs are still present on the active list, none carries an archived state indicator

<!-- test
type: manual
priority: low
source: AC-57, ac-delta-19
automation: manual-only
automation-note: populating a RunGroup with more than 20 000 runs is not feasible in an automated test fixture; this is a protective / explanatory boundary test best exercised manually by QA or product.
-->
## Purging a RunGroup with more than 20 000 runs is blocked @boundary @unclear

Protects the 20 000-runs-per-purge contract (AC-57) — the UI must block or warn when the limit would be exceeded. The exact wording / mechanism is marked `@unclear` because it could not be observed with the current test data.

## Preconditions
- Signed in as a user with `Manager` role
- A RunGroup named `cascade-20k-source` contains at least 20 001 nested runs (production-scale fixture; coordinate with product/infra if no environment supports this)

## Steps
- Navigate to the `Groups Archive` page or the active Runs page (depending on where a group with this many runs is located)
  - _Expected_: `cascade-20k-source` is visible; total nested-runs count exceeds 20 000
- Open the extra menu on `cascade-20k-source`
  - _Expected_: the menu exposes `Purge` and other items
- Click `Purge`
  - _Expected_: either the purge dialog opens with an explicit capacity warning, OR the action is blocked up-front with an error message referencing the 20 000-run limit (exact wording to be confirmed with product)
- Attempt to confirm the purge (if the dialog allowed it)
  - _Expected_:
  - The purge does NOT complete
  - An error or toast is shown explaining that the run count exceeds the per-purge limit
  - The group remains in its previous location (active or archived) with no runs lost
