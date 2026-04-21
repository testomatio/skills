<!-- suite -->
# Auto-Assign Strategies

The Auto-Assign Users strategy selector inside the New Manual Run Assignee panel — defaults, the three strategies (None / Prefer test assignee / Randomly distribute), manager-role exclusion, determinism after Launch, and discard-on-cancel semantics. Multi-select chip management is owned by the sibling suite `creation-dialog-assignment`.

<!-- test
type: manual
priority: high
source: AC-39, ac-delta-3
automation: candidate
-->
## Auto-Assign defaults to None and leaves all tests unassigned after Launch @smoke

The default Auto-Assign strategy must be "None" and launching with it must not distribute tests to any user.

## Preconditions

- Project has at least one non-manager member (e.g., qa role) in addition to the current manager

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Assign more users' link and add one non-manager user to the 'Assign users' multi-select
  - _Expected_: User chip appears; "Auto-Assign: none" button becomes visible below the multi-select
- Inspect the "Auto-Assign: none" button label
  - _Expected_: Button label reads "Auto-Assign: none" (no further click is required to confirm the default)
- Click the 'Launch' button
  - _Expected_:
  - Toast "Run has been started" is displayed
  - Runner opens at `/projects/{project}/runs/launch/{id}/`
- In the runner, inspect the tree-row assignee indicator for several tests across different suites
  - _Expected_:
  - No per-test assignee chip is rendered on any inspected tree row
  - The run header avatar stack shows only the manager and the added user (none of them attached to individual tests)

<!-- test
type: manual
priority: high
source: AC-39, AC-40, ac-delta-4, ac-delta-5, ac-delta-11
automation: deferred
automation-note: deferred — requires seeded test fixtures with pre-set assignees to exercise the "Prefer test assignee" path deterministically; multi-user coordination beyond single-session scope
-->
## Auto-Assign strategy ${strategy} produces ${expected_distribution} after Launch

Switching the Auto-Assign selector to a non-None strategy must change how tests are attached to users on Launch. The distribution must exclude the manager for "Randomly distribute" and follow the test's pre-set assignee for "Prefer test assignee".

## Preconditions

- Project has at least two non-manager members seeded
- At least two tests in the project have a pre-set assignee equal to one of the two non-manager users (required for the "Prefer test assignee" row)

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Assign more users' link and add the two non-manager users to the 'Assign users' multi-select
  - _Expected_: Two user chips appear; "Auto-Assign: none" button is visible
- Click the "Auto-Assign: none" button and select the option ${strategy}
  - _Expected_: Button label updates to reflect ${strategy} (e.g., "Auto-Assign: randomly" or "Auto-Assign: prefer test assignee")
- Click the 'Launch' button
  - _Expected_:
  - Toast "Run has been started" is displayed
  - Runner opens
- Inspect per-test assignee chips across several suites in the runner
  - _Expected_: ${expected_distribution}
- Navigate to the 'Runs' page and confirm the new run's "Assigned to" column
  - _Expected_: Avatar stack shows the manager plus any non-manager user who now owns ≥1 test

<!-- example -->

| strategy | expected_distribution |
| --- | --- |
| Randomly distribute tests between team members | Every non-manager user has ≥1 test attached; no test shows the manager as its assignee; across all inspected tests the two non-manager users' share is roughly balanced |
| Prefer test assignee | Tests with a pre-set assignee that matches one of the added users show that user's chip; tests without a pre-set assignee are either left without a chip or fall back to the manager (exact fallback is `@unclear` — record actual behaviour observed) |

<!-- test
type: manual
priority: normal
source: AC-39, ac-delta-4
automation: deferred
automation-note: deferred — @unclear behaviour; confirm with product before automating
-->
## Prefer test assignee fallback for tests without a pre-set assignee is recorded @unclear @boundary

When "Prefer test assignee" is selected but some tests in the run have no pre-set assignee, the observable fallback must be documented so it can either be confirmed as intentional or reported as a bug.

## Preconditions

- Project has two non-manager users seeded
- At least one test in the run has a pre-set assignee; at least one test has NO pre-set assignee

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Assign more users' link and add both non-manager users to the 'Assign users' multi-select
  - _Expected_: Two user chips appear; "Auto-Assign: none" button is visible
- Click the "Auto-Assign: none" button and choose "Prefer test assignee"
  - _Expected_: Button label updates to reflect the "Prefer test assignee" selection
- Click the 'Launch' button
  - _Expected_: Runner opens
- Record the per-test assignee chip for a test with a pre-set assignee matching one of the added users
  - _Expected_: That user's chip appears on the test row
- Record the per-test assignee chip for a test with NO pre-set assignee
  - _Expected_:
  - Observe one of the following and capture in the test notes: (a) no chip (test is unassigned); (b) manager chip; (c) other user's chip (report as defect)
  - Behaviour is `@unclear` — exact expectation to be confirmed with product

<!-- test
type: manual
priority: normal
source: AC-39, ac-delta-5
automation: candidate
-->
## Randomly distribute with a single non-manager user assigns every test to that user @boundary

The lower boundary of the "Randomly distribute" strategy — when only one non-manager user is in scope — must result in that user receiving every test.

## Preconditions

- Project has at least one non-manager user in addition to the manager

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Assign more users' link and add exactly one non-manager user to the 'Assign users' multi-select
  - _Expected_: Exactly one user chip appears; "Auto-Assign: none" button is visible
- Click the "Auto-Assign: none" button and choose "Randomly distribute tests between team members"
  - _Expected_: Button label updates to "Auto-Assign: randomly"
- Click the 'Launch' button
  - _Expected_: Runner opens
- Inspect tree-row assignee chips across several suites in the runner
  - _Expected_:
  - Every inspected test shows the non-manager user's chip as its assignee
  - No test shows the manager as its assignee

<!-- test
type: manual
priority: high
source: AC-40, ac-delta-5, ac-delta-11
automation: candidate
-->
## Randomly distribute with only a manager attached leaves every test unassigned @boundary @negative

When the manager is the only run assignee and the strategy is "Randomly distribute", the manager must be skipped and no tests must be auto-assigned, without producing an error.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Assign more users' link
  - _Expected_: Assignee panel expands; "Assign users" multi-select is empty; "Auto-Assign: none" button is NOT visible yet
- Add a non-manager user to the multi-select to reveal the Auto-Assign button
  - _Expected_: "Auto-Assign: none" button becomes visible
- Choose "Randomly distribute tests between team members"
  - _Expected_: Button label updates to "Auto-Assign: randomly"
- Remove the non-manager user via the chip "×" control so the multi-select is empty again
  - _Expected_:
  - User chip is cleared from the multi-select
  - "Auto-Assign: randomly" button remains visible (the strategy selection is retained even though no non-manager users are attached)
- Click the 'Launch' button
  - _Expected_:
  - Toast "Run has been started" is displayed (no error toast)
  - Runner opens
- Inspect tree-row assignee chips across several suites in the runner
  - _Expected_: No per-test assignee chip is rendered on any inspected row (the manager is skipped and no one else was available to receive tests)

<!-- test
type: manual
priority: normal
source: ac-delta-5
automation: candidate
-->
## Randomly distribute outcome is deterministic after Launch

After a run is launched with "Randomly distribute", refreshing the runner must NOT re-shuffle test-to-user attachments — each test keeps the assignee it received at Launch time.

## Preconditions

- Project has two non-manager users seeded

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Assign more users' link and add both non-manager users
  - _Expected_: Two user chips appear; "Auto-Assign: none" button is visible
- Choose "Randomly distribute tests between team members"
  - _Expected_: Button label updates to "Auto-Assign: randomly"
- Click the 'Launch' button
  - _Expected_: Runner opens
- Record the assignee chip for each of the first five test tree rows (note user per row)
  - _Expected_: Recorded assignments include both non-manager users; no manager chip appears
- Refresh the runner page in the browser
  - _Expected_: Same five rows show the SAME assignee as recorded above (no re-shuffle)
- Navigate to the Runs list and return to the runner via the run row
  - _Expected_: Same five rows still show the previously recorded assignees (deterministic across navigation)

<!-- test
type: manual
priority: normal
source: ac-delta-3
automation: candidate
-->
## Switching strategy then dismissing the sidebar discards the selection @negative

An Auto-Assign strategy chosen in the sidebar is not committed until Launch; dismissing the sidebar must reset the selector to the default state on the next open.

## Preconditions

- Project has one non-manager user available

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Assign more users' link and add one non-manager user
  - _Expected_: User chip appears; "Auto-Assign: none" button becomes visible
- Click the "Auto-Assign: none" button and choose "Prefer test assignee"
  - _Expected_: Button label updates accordingly
- Click the 'Cancel' button
  - _Expected_:
  - Sidebar closes
  - URL returns to `/projects/{project}/runs/`
- Re-open the sidebar by clicking the 'Manual Run' button
  - _Expected_:
  - Creator chip shows "as manager"
  - "Assign users" multi-select is empty
  - "Auto-Assign: none" button is NOT visible (because the multi-select is empty again)
