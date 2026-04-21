<!-- suite -->
# Cross-Cutting — Tester Assignment

Tests covering the cross-cutting concerns from `destructuring.md` that intersect tester-assignment: Concern B (multi-user assignment — OWNED by this sub-feature) and Concern H (bulk multi-select mode — this sub-feature AFFECTS, combined here with Concern F "filter applied narrows selection scope"). Also includes a partial permission probe for qa and readonly roles — the full permission matrix remains `@unclear` per the baseline.

<!-- test
type: manual
priority: critical
source: AC-38, AC-39, AC-40, ac-delta-5, ac-delta-12
automation: deferred
automation-note: deferred — end-to-end multi-user coordination, requires 3 seeded users, cross-page verification (runner + runs list); concern B canonical scenario
-->
## Concern B — multi-user assignment propagates from creation through runner to runs list @smoke

The canonical Concern B scenario — the write path for multi-user assignment must be coherent across every surface: the creation sidebar, the runner per-test indicators, the run header avatar stack, and the Runs list "Assigned to" column.

## Preconditions

- Project has the manager + two non-manager users seeded (UserA, UserB)
- No other ongoing manual run exists that would obscure the Runs list verification

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens with the creator chip shown as "as manager"
- Click the 'Assign more users' link and add UserA and UserB to the 'Assign users' multi-select
  - _Expected_: Two user chips appear; "Auto-Assign: none" button becomes visible
- Click "Auto-Assign: none" and choose "Randomly distribute tests between team members"
  - _Expected_: Button label updates to "Auto-Assign: randomly"
- Click the 'Launch' button
  - _Expected_:
  - Toast "Run has been started" is displayed
  - Runner opens at `/projects/{project}/runs/launch/{id}/`
- Inspect the run header avatar stack
  - _Expected_: Three avatars are rendered (manager, UserA, UserB) as a stack with tooltips showing each user's display name
- Inspect tree-row assignee chips across several suites in the runner
  - _Expected_:
  - Both UserA and UserB each own ≥ 1 test (chips present on their assigned rows)
  - No test shows the manager as its assignee (the random strategy skips the manager)
- Open any UserA-assigned test's detail panel
  - _Expected_: Detail panel Assignee chip shows UserA
- Click the 'Finish Run' button and confirm the pending-tests dialog
  - _Expected_:
  - Finish-run confirmation dialog appears mentioning pending tests being skipped
  - After confirming, the run transitions to a finished state and navigates to the run detail / report
- Navigate back to the 'Runs' page
  - _Expected_:
  - Finished run row shows "Assigned to" column with three overlapping avatars (manager, UserA, UserB)
  - Hovering each avatar shows the corresponding username as a tooltip

<!-- test
type: manual
priority: high
source: AC-43, ac-delta-10
automation: candidate
-->
## Concern H × F — bulk Assign to in runner respects the active filter @negative @boundary

When a filter is applied in the runner, Multi-Select bulk assignment must target ONLY the tests matching the filter. Tests hidden by the filter must retain their pre-existing assignee state.

## Preconditions

- An ongoing manual run with the manager + UserA assigned
- The run contains ≥ 6 tests, at least 3 of which match a specific filter (e.g., by priority, by tag, or by search keyword) and at least 3 of which do NOT match that filter

## Steps

- Navigate to the runner
  - _Expected_: Test tree is shown with all tests visible
- Record the per-test assignee state of two tests that will NOT match the planned filter (e.g., "pre-filter: unassigned" or "pre-filter: manager")
  - _Expected_: States captured in the test run notes
- Apply a filter that leaves only the matching-subset visible in the tree (e.g., search by keyword, filter by priority)
  - _Expected_:
  - Only the matching tests are visible in the tree
  - The non-matching tests recorded above are no longer visible
- Click the Multi-Select toggle
  - _Expected_: Checkboxes appear on the visible (filtered) test rows
- Use the "Select all" action (or check every visible row) to select every matching test
  - _Expected_: Every visible row shows a selected state
- Click the "Assign to" button in the bottom toolbar and select UserA
  - _Expected_: Native confirm dialog "Are you sure you want to assign UserA to all selected tests?"
- Click OK
  - _Expected_:
  - Dialog dismisses
  - Every visible (filtered) test row now shows UserA as its assignee
- Clear the filter
  - _Expected_:
  - All tests become visible again
  - The previously filtered-in tests still show UserA (assignment persisted)
  - The previously filtered-out tests still show their pre-filter assignee state (UNCHANGED by the bulk action)

<!-- test
type: manual
priority: normal
source: AC-100, AC-42, AC-43
automation: deferred
automation-note: deferred — requires a qa-role test user fixture; single-user-session scope limitation
-->
## Concern B × permissions — a qa-role run-assignee can use Assign to controls end-to-end

A qa-role user who is attached to a run must be able to use every per-entity Assign to affordance (suite, bulk, detail-panel) within the permission boundary documented for that role.

## Preconditions

- The project's qa-role user is known and has login credentials available
- An ongoing manual run exists where both the manager and the qa-role user are assignees
- Browser is currently logged in as the qa-role user (not the manager)

## Steps

- Navigate to the 'Runs' page as the qa-role user
  - _Expected_: Runs list shows the prepared run in the list (the qa user has visibility because they are an assignee)
- Click the run row and open the runner
  - _Expected_: Runner loads; run header avatar stack shows the manager and the current qa user
- Click a suite "Assign to" dropdown and select the qa user
  - _Expected_:
  - Dropdown lists "Unassigned", manager, qa user only
  - Selecting the qa user updates the suite row's assignee chip to the qa user
- Click the Multi-Select toggle in the runner toolbar
  - _Expected_: Checkboxes appear on each test row; the Multi-Select bottom toolbar becomes visible
- Check the checkboxes for two test rows
  - _Expected_: Both rows show a selected state
- Click the "Assign to" button in the bottom toolbar and select the qa user from the dropdown
  - _Expected_:
  - Native confirm dialog is shown with the qa user's display name
  - After OK, both selected test rows show the qa user as their assignee
- Open one of the assigned tests' detail panel and change its Assignee to "Unassigned"
  - _Expected_:
  - Detail panel Assignee chip clears
  - Tree-row assignee indicator for the same test clears
- Return to the Runs list
  - _Expected_: The run row still shows both the manager and the qa user in the "Assigned to" column

<!-- test
type: manual
priority: normal
source: AC-100
automation: manual-only
automation-note: manual-only — permission matrix for readonly role is @unclear; outcome must be observed and reported, not asserted; requires a readonly-role user fixture and project-setting visibility
-->
## Concern B × permissions — readonly-role user attempt to use Assign to controls is recorded @negative @unclear @needs-project-setting

The observable behaviour when a readonly-role user interacts with assignment controls must be captured so product can confirm the intended restriction. The permission matrix for this role is `@unclear` at baseline; this test documents the observed outcome rather than asserting a specific expectation.

## Preconditions

- The project's readonly-role user is known and has login credentials available
- An ongoing manual run exists that the readonly user can view (readonly role visibility rules apply — record whether the run is visible at all)
- Browser is currently logged in as the readonly-role user

## Steps

- Navigate to the 'Runs' page as the readonly-role user
  - _Expected_:
  - Record whether the prepared run is visible in the list
  - Record whether the 'Manual Run' button is visible (readonly may or may not see it)
- Open the run row if visible
  - _Expected_: Record whether the runner or run detail opens
- From the runner (if reachable), attempt to open a suite "Assign to" dropdown
  - _Expected_:
  - Observe and record one of: (a) dropdown disabled / absent; (b) dropdown opens but selecting a user produces an error toast; (c) dropdown opens and selection succeeds (report as defect if readonly is expected to be blocked)
- Attempt to enter Multi-Select mode and use the bulk "Assign to" button
  - _Expected_: Record observed behaviour (disabled vs error vs allowed)
- Attempt to use the detail-panel Assignee chip on a test
  - _Expected_: Record observed behaviour
- Compile the observed behaviours in the test run notes and flag this test for product review
  - _Expected_: Record is attached to the test execution; status of the test reflects whether readonly behaviour matches the expectation documented elsewhere (if any)
