<!-- suite -->
# Runner Assignment Paths

The three per-entity assignment paths inside the Manual Runner — the per-suite "Assign to" dropdown, the Multi-Select bulk "Assign to" button with its native browser confirmation dialog, and the per-test detail-panel Assignee chip (single-click path). Covers the constraint that only run-assigned users are offered to suite / test / bulk Assign controls. Bulk result-message actions in the runner are owned by `#10 bulk-status-actions`.

<!-- test
type: manual
priority: critical
source: AC-41, AC-42, ac-delta-8
automation: candidate
-->
## Suite Assign to dropdown lists Unassigned and run-assigned users only @smoke

Clicking the per-suite "Assign to" dropdown inside the runner must list the "Unassigned" option plus every user attached to the run and must not list any other project member.

## Preconditions

- An ongoing manual run exists with the manager + exactly one non-manager user ("UserA") as its assignees
- The project has at least one other non-manager user ("UserB") who is NOT attached to the run

## Steps

- Navigate to the runner (`/projects/{project}/runs/launch/{id}/`)
  - _Expected_:
  - Test tree is shown on the left
  - Run header avatar stack shows the manager and UserA
- Click the "Assign to" dropdown on any suite row in the tree
  - _Expected_: A dropdown opens with an "Unassigned" option + user options
- Inspect the option list of the suite "Assign to" dropdown
  - _Expected_:
  - Dropdown contains exactly three options: "Unassigned", manager, UserA
  - UserB (and any other non-run member) is NOT present in the list
- Select UserA from the dropdown
  - _Expected_:
  - Dropdown closes
  - Suite row shows UserA's chip as the suite-level assignee (tooltip "Assigned to UserA")
  - No confirmation dialog was shown

<!-- test
type: manual
priority: high
source: AC-41, ac-delta-8
automation: candidate
-->
## Suite Assign to dropdown excludes non-run project members @negative

A user who is a member of the project but NOT attached to the run must never appear in the runner's per-suite "Assign to" dropdown, enforcing the constraint that users must be added to the run before they can be assigned to a suite or test.

## Preconditions

- An ongoing manual run exists with the manager as the ONLY assignee
- Project has at least two non-manager members not attached to the run

## Steps

- Navigate to the runner
  - _Expected_: Run header avatar stack shows the manager only
- Click the "Assign to" dropdown on any suite row in the tree
  - _Expected_: Dropdown opens
- Inspect the dropdown's option list
  - _Expected_:
  - Exactly two options are listed: "Unassigned" and the manager
  - None of the other project members are listed even if they exist in the project
- Close the dropdown without making a selection
  - _Expected_:
  - Dropdown dismisses
  - Suite row's assignee state is unchanged

<!-- test
type: manual
priority: critical
source: AC-43, ac-delta-9, ac-delta-10
automation: candidate
-->
## Multi-Select bulk Assign to applies to every selected test after OK on the native confirm @smoke

In the runner, selecting multiple tests in Multi-Select mode and choosing a user from the bulk "Assign to" button must show a native browser confirmation dialog with the user's name and, after OK, attach that user to every selected test in a single operation.

## Preconditions

- An ongoing manual run exists with the manager + one non-manager user ("UserA") assigned
- At least five tests are visible in the runner (across one or more suites)

## Steps

- Navigate to the runner
  - _Expected_: Test tree is shown; run header avatar stack shows the manager and UserA
- Click the Multi-Select toggle in the runner toolbar
  - _Expected_:
  - Checkboxes appear next to each test row in the tree
  - Bottom toolbar (the Multi-Select action bar) becomes visible
- Check the checkbox for five distinct test rows (spread across ≥ 1 suite)
  - _Expected_: Each checked row shows a selected state (e.g., checkmark / highlight)
- Click the "Assign to" button in the bottom toolbar
  - _Expected_: A dropdown opens with "Unassigned" + manager + UserA options
- Select UserA from the dropdown
  - _Expected_:
  - A native browser confirm dialog is shown with the exact text "Are you sure you want to assign UserA to all selected tests?" (with UserA's actual display name substituted)
  - The dialog has OK and Cancel buttons (browser-native)
- Click the OK button in the confirm dialog
  - _Expected_:
  - Dialog dismisses
  - Every one of the five selected test rows now shows UserA's chip as the per-test assignee
  - No success toast is shown
- Click any single selected test row to open its detail panel
  - _Expected_: Detail panel's Assignee chip shows UserA

<!-- test
type: manual
priority: high
source: AC-43, ac-delta-9
automation: candidate
-->
## Multi-Select bulk Assign to → Cancel on the native confirm leaves tests unchanged @negative

Clicking Cancel on the native browser confirmation dialog for bulk assignment must leave every selected test's assignee state unchanged.

## Preconditions

- An ongoing manual run with the manager + UserA assigned
- At least three tests are visible in the runner, none of them currently assigned to UserA

## Steps

- Navigate to the runner
  - _Expected_: Test tree is shown
- Click the Multi-Select toggle
  - _Expected_: Checkboxes appear on test rows
- Check the checkbox for three test rows
  - _Expected_: Rows show a selected state
- Click the "Assign to" button in the bottom toolbar and select UserA
  - _Expected_: Native browser confirm dialog appears with the text "Are you sure you want to assign UserA to all selected tests?"
- Click the Cancel button in the confirm dialog
  - _Expected_:
  - Dialog dismisses
  - None of the three selected test rows show UserA's chip
  - Each row's assignee state is identical to its pre-click state (unchanged)

<!-- test
type: manual
priority: normal
source: ac-delta-13
automation: candidate
-->
## Detail-panel Assignee chip single-click assigns a test without a confirmation

The per-test detail panel Assignee chip must be a shortcut that applies the selected user immediately without the native confirm dialog that bulk assignment requires.

## Preconditions

- An ongoing manual run with the manager + UserA assigned
- A specific target test with no per-test assignee yet

## Steps

- Navigate to the runner and open the target test's detail panel by clicking its row
  - _Expected_:
  - Detail panel opens on the right
  - Assignee chip area in the detail panel shows an empty / placeholder state (no user assigned)
- Click the Assignee chip in the detail panel
  - _Expected_: Dropdown opens listing "Unassigned", manager, UserA
- Select UserA from the dropdown
  - _Expected_:
  - Dropdown closes immediately
  - No native confirm dialog is shown
  - Detail panel Assignee chip now shows UserA (tooltip "Assigned to UserA")
  - Test's tree-row assignee indicator on the left panel also shows UserA

<!-- test
type: manual
priority: normal
source: AC-41, ac-delta-13
automation: candidate
-->
## Detail-panel Assignee dropdown lists only run-assigned users plus Unassigned

The detail-panel Assignee dropdown must follow the same constraint as the suite and bulk paths — only users attached to the run may appear.

## Preconditions

- An ongoing manual run with the manager + one non-manager user ("UserA") assigned
- At least one other project member ("UserB") exists but is NOT attached to the run

## Steps

- Navigate to the runner and open any test's detail panel
  - _Expected_: Detail panel opens on the right
- Click the Assignee chip in the detail panel
  - _Expected_: Dropdown opens
- Inspect the option list
  - _Expected_:
  - Options are exactly three: "Unassigned", manager, UserA
  - UserB is NOT present in the list
- Close the dropdown without making a selection
  - _Expected_: Dropdown dismisses; assignee state is unchanged

<!-- test
type: manual
priority: normal
source: ac-delta-13
automation: candidate
-->
## Reassign an assigned test to Unassigned via detail-panel chip clears all indicators @boundary

Setting the Assignee dropdown to "Unassigned" must remove the assignee chip from both the detail panel and the tree row — covering the lower-boundary case where a previously attached user is cleared.

## Preconditions

- An ongoing manual run with the manager + UserA assigned
- A specific test already has UserA as its per-test assignee

## Steps

- Navigate to the runner and open the pre-assigned test's detail panel
  - _Expected_:
  - Detail panel shows UserA on the Assignee chip
  - Tree-row for the same test shows UserA's chip
- Click the Assignee chip in the detail panel and select "Unassigned"
  - _Expected_: Dropdown closes immediately; no confirm dialog shown
- Inspect the detail panel Assignee area
  - _Expected_: No user chip is rendered; the placeholder / empty state is shown instead
- Inspect the tree-row indicator for the same test
  - _Expected_: No user chip is rendered on the tree row for that test

<!-- test
type: manual
priority: normal
source: AC-43, ac-delta-10
automation: candidate
-->
## Multi-Select bulk Assign to with exactly one test selected still applies the assignment @boundary

The lower boundary of Multi-Select bulk assignment — a single selected test — must still pass through the same confirm dialog and still apply the assignment afterwards.

## Preconditions

- An ongoing manual run with the manager + UserA assigned
- At least two tests in the runner, with one of them unassigned

## Steps

- Navigate to the runner
  - _Expected_: Test tree is shown
- Click the Multi-Select toggle
  - _Expected_: Checkboxes appear on test rows
- Check the checkbox for exactly ONE test row (the unassigned one)
  - _Expected_: That row shows a selected state
- Click the "Assign to" button in the bottom toolbar and select UserA
  - _Expected_: Native confirm dialog appears with the text "Are you sure you want to assign UserA to all selected tests?" (wording uses "all selected tests" regardless of selection count)
- Click OK in the confirm dialog
  - _Expected_:
  - Dialog dismisses
  - The one selected test row now shows UserA's chip as its assignee
  - No other test row's assignee state changes

<!-- test
type: manual
priority: low
source: AC-38
automation: candidate
-->
## Run header avatar stack reflects all run-assigned users with tooltips

The runner header must render a stacked avatar for every user currently attached to the run; each avatar must expose a tooltip with the user's display name.

## Preconditions

- An ongoing manual run with exactly three assignees — manager, UserA, UserB

## Steps

- Navigate to the runner
  - _Expected_: Runner page loads with test tree and header
- Inspect the header avatar area between the icon toolbar and the "Finish Run" button
  - _Expected_:
  - Three avatars are rendered as a stack (overlapping with negative margin)
  - The first avatar has no overlap offset; each subsequent avatar is offset to the left of the previous
- Hover over each avatar in turn
  - _Expected_: Each avatar shows a tooltip containing the corresponding user's display name (manager, UserA, UserB respectively)

<!-- test
type: manual
priority: normal
source: AC-43, ac-delta-9
automation: candidate
-->
## Multi-Select bulk Assign to with zero tests selected does not open a confirm @negative @boundary

Opening the bulk "Assign to" dropdown without any test selected must not proceed to a confirmation dialog and must not change any assignee state.

## Preconditions

- An ongoing manual run with the manager + UserA assigned
- Multi-Select mode is not yet entered

## Steps

- Navigate to the runner and click the Multi-Select toggle
  - _Expected_: Checkboxes appear on test rows; bottom toolbar becomes visible
- Do NOT check any test row
  - _Expected_: All test-row checkboxes are unchecked
- Click the "Assign to" button in the bottom toolbar
  - _Expected_:
  - EITHER: the button is disabled while the selection count is zero (no dropdown opens)
  - OR: the dropdown opens but selecting a user does NOT trigger the native confirm dialog and makes no change
  - Record which behaviour is observed in the test run notes for product review
- Inspect several test-row assignee indicators after the attempted action
  - _Expected_: No test-row assignee state has changed as a result of this attempt
