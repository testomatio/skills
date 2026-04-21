<!-- suite -->
# Archive and Purge Behavior by Run State (Cross-cutting G)

Covers cross-cutting concern G (Ongoing vs Finished state) for archive/purge: archiving/purging a finished run preserves statuses, while doing the same on an ongoing run terminates it and cascades `Pending → Skipped`. Also covers the locked state of a restored Terminated run. Does NOT cover RunGroup cascade (owned by `rungroup-cascade.md`), Finish Run transitions (owned by `#6 run-lifecycle`), or runner mechanics (owned by `#2 test-execution-runner`).

<!-- test
type: manual
priority: normal
source: AC-75, AC-76, ac-delta-1
automation: candidate
-->
## Archiving a finished run preserves every test status

Verifies that after archiving a run that was finished with a mix of statuses, every recorded outcome is still visible in the Archive — no status is reset.

## Preconditions
- Signed in as a user with `Manager` role
- A finished run named `state-finished-source` exists with known per-test statuses: 3 `Passed`, 2 `Failed`, 1 `Skipped`
- The run is on the active Runs list

## Steps
- Open the extra menu on `state-finished-source`
  - _Expected_: the row extra menu opens showing `Move to Archive` and `Purge` items
- Click `Move to Archive`
  - _Expected_: the archive confirmation dialog opens with body text `"You are going to archive 1 run"`
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - `state-finished-source` leaves the active Runs list
- Navigate to the `Runs Archive` page and open `state-finished-source`
  - _Expected_:
  - The run detail shows all 6 tests
  - Passed count is `3`, Failed count is `2`, Skipped count is `1`
  - No status was reset to Pending

<!-- test
type: manual
priority: high
source: AC-76, AC-80, ac-delta-16
automation: deferred
automation-note: requires an ongoing run with an exact mix of Pending + recorded tests — timing-sensitive fixture spanning Manual Runner (#2) and state transitions (#6).
-->
## Archiving an ongoing run terminates it and converts Pending tests to Skipped

Covers the state transition triggered by archiving a run that is still in progress: the run becomes `Terminated`, pending tests become `Skipped`, and previously-recorded statuses are preserved.

## Preconditions
- Signed in as a user with `Manager` role
- An ongoing (in-progress) run named `state-ongoing-archive-source` exists with: 2 `Passed`, 1 `Failed`, 3 `Pending` tests
- The run appears on the active Runs list with its in-progress indicator

## Steps
- Open the extra menu on `state-ongoing-archive-source`
  - _Expected_: the row extra menu opens showing `Move to Archive` and `Purge` items
- Click `Move to Archive`
  - _Expected_: the archive confirmation dialog opens
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - The run leaves the active Runs list
- Navigate to the `Runs Archive` page and open `state-ongoing-archive-source`
  - _Expected_:
  - The run carries a `terminated` badge (distinct from `archived` and `purged`) OR the run detail header shows a `Terminated` state indicator
  - Passed count is `2`
  - Failed count is `1`
  - Skipped count is `3` — the previously-Pending tests were converted to `Skipped`
  - No test remains in `Pending` state

<!-- test
type: manual
priority: high
source: AC-80, ac-delta-3
automation: deferred
automation-note: same fixture complexity as the archive-ongoing case — requires an in-progress run.
-->
## Purging an ongoing run terminates it and preserves recorded statuses

Mirrors the ongoing-archive transition for Purge — the ongoing run is terminated in-place, recorded statuses are preserved, Pending → Skipped, and the run moves to Archive with both `purged` and `terminated` indicators.

## Preconditions
- Signed in as a user with `Manager` role
- An ongoing run named `state-ongoing-purge-source` exists with: 1 `Passed`, 2 `Failed`, 2 `Pending` tests

## Steps
- Open the extra menu on `state-ongoing-purge-source`
  - _Expected_: the row extra menu opens showing `Move to Archive` and `Purge` items
- Click `Purge`
  - _Expected_: the purge confirmation dialog opens with the standard purge warning
- Click `Purge`
  - _Expected_:
  - The dialog closes
  - The run leaves the active Runs list
- Navigate to the `Runs Archive` page and open `state-ongoing-purge-source`
  - _Expected_:
  - The run carries a `purged` badge
  - The run also indicates a `terminated` state (badge or header indicator)
  - Passed count is `1`, Failed count is `2`, Skipped count is `2`
  - No test remains `Pending`

<!-- test
type: manual
priority: high
source: AC-80, ac-delta-13
automation: deferred
automation-note: depends on the archive-ongoing-run precondition and asserts negative availability of the Continue action — needs an E2E fixture.
-->
## A restored Terminated run cannot be resumed @negative

Verifies that unarchiving a run that was previously archived while in-progress does NOT restore the ability to continue execution — the `Continue` action must be unavailable, per the AC-80 contract.

## Preconditions
- Signed in as a user with `Manager` role
- In the Runs Archive, a previously-terminated run named `state-terminated-restore-source` exists with a `terminated` indicator
- The archive row extra menu is available on this run

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: `state-terminated-restore-source` is visible with its `terminated` indicator
- Open the extra menu on `state-terminated-restore-source` and click `Unarchive`
  - _Expected_: the unarchive confirmation dialog opens with body text `"You are going to restore 1 run"`
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - The run returns to the active Runs list
- On the active Runs list, inspect the restored run row
  - _Expected_:
  - The `Continue` action is NOT present on the row
  - The run still displays the `terminated` state indicator
- Open the run's extra menu
  - _Expected_: the menu does not offer `Continue`; resuming is impossible

<!-- test
type: manual
priority: normal
source: AC-22, AC-75
automation: candidate
-->
## Archiving a Without-tests run succeeds with zero-test counts @boundary

Edge case: the "Without tests" scope creates a run with 0 tests. Verifies archiving such a run is allowed and produces consistent empty counts in Archive.

## Preconditions
- Signed in as a user with `Manager` role
- A finished run named `state-without-tests-source` was created with the `Without tests` scope (0 tests)
- The run is on the active Runs list

## Steps
- Open the extra menu on `state-without-tests-source`
  - _Expected_: the row extra menu opens showing `Move to Archive` and `Purge` items
- Click `Move to Archive`
  - _Expected_: the archive confirmation dialog opens with body text `"You are going to archive 1 run"`
- Click `Confirm`
  - _Expected_:
  - The dialog closes
  - The run leaves the active Runs list
- Navigate to the `Runs Archive` page and locate the row for `state-without-tests-source`
  - _Expected_:
  - The row is present
  - Passed, Failed, and Skipped counts are all `0`
  - An `archived` badge is shown
  - Opening the run detail shows an empty tests section without errors
