<!-- suite -->
# Cross-cutting Scenarios

Creation-side coverage of the four cross-cutting concerns from the destructuring map that list `run-creation` in their "Affects" section: Multi-environment (A), Multi-user assignment (B), RunGroup membership (C), "Run as checklist" mode (D).

<!-- test
type: manual
priority: high
source: AC-45, ac-delta-7
automation: deferred
automation-note: multi-environment modal content is owned by #4 environment-configuration; automating the full multi-env flow requires coordination between suites
-->
## Create a run with two environment groups configured at creation time

The creation UI must reflect multi-environment configuration — a second environment group configured in the modal must appear in the sidebar after Save.

## Preconditions

- The project has available environment categories with at least two values each (e.g. `Browser:Chrome`, `Browser:Firefox`; `OS:Windows`, `OS:MacOS`).

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the environment selector (labeled "Set environment for execution")
  - _Expected_: Multi-Environment Configuration modal opens with an initial slot "1"
- Tick environments "Chrome" and "Windows" in slot "1"
  - _Expected_: Slot "1" shows the two ticked environments
- Click the 'Add Environment' button inside the modal
  - _Expected_: A second slot "2" appears
- Tick environments "Firefox" and "MacOS" in slot "2"
  - _Expected_: Slot "2" shows its two ticked environments
- Click the 'Save' button inside the modal
  - _Expected_:
  - Modal closes
  - Environment selector in the sidebar now shows two grouped chips (slot 1 and slot 2 summaries)
- Fill the Title with "Two env groups"
  - _Expected_: Title input shows the value
- Click 'Launch' in the sidebar
  - _Expected_:
  - Manual Runner opens
  - The created run(s) reflect the two environment groups (exact run-count behaviour is owned by #4 environment-configuration; this test only verifies that both groups were persisted at creation time — visible in the Run detail panel)

<!-- test
type: manual
priority: normal
source: AC-38, ac-delta-5
automation: deferred
automation-note: requires ≥2 project members enrolled for selection; deep Assign-to strategies are owned by #3 tester-assignment
-->
## Create a run with multiple testers assigned via "Assign more users"

The creation sidebar must allow picking additional assignees beyond the creator at dialog time (the deep Auto-Assign strategy UX is owned by #3 tester-assignment — this test only verifies the creation-side multi-assignee acceptance).

## Preconditions

- Project has at least two members other than the creator: `${userA}` and `${userB}`.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens; creator chip is visible with "as manager" label
- Click the 'Assign more users' link in the Assignee section
  - _Expected_: Tester-assignment panel opens exposing a user picker
- Select `${userA}` and `${userB}` from the user picker
  - _Expected_: Both users appear as added chips in the Assignee section
- Close / confirm the tester-assignment panel so the creation sidebar is re-focused
  - _Expected_:
  - Assignee section in the creation sidebar lists the creator + `${userA}` + `${userB}`
- Fill the Title with "Multi assignee creation" and click 'Launch'
  - _Expected_:
  - Success toast "Run has been started" is shown
  - Manual Runner opens
  - Returning to the Runs list and opening the run's detail panel shows all three assignees under "Assigned to"

<!-- test
type: manual
priority: high
source: AC-51, ac-delta-6
automation: candidate
-->
## Opening creation from a RunGroup page pre-populates the RunGroup field

When the user triggers creation from a specific RunGroup context, the RunGroup selector must arrive pre-filled but still editable.

## Preconditions

- At least one existing RunGroup exists in the project with title "${group_title}".

## Steps

- Navigate to the Runs list → click the 'Groups' filter tab
  - _Expected_: Groups tab becomes active; the list of RunGroups is displayed
- Click the "${group_title}" RunGroup row
  - _Expected_: RunGroup page opens (URL contains `/runs/groups/…`) with a chart + per-run summary
- Click the 'Add Manual Run' (or equivalent "Manual Run" entry) inside the RunGroup page
  - _Expected_:
  - New Manual Run sidebar opens
  - RunGroup selector is pre-populated with "${group_title}"
  - The RunGroup selector is still editable (clicking it opens the dropdown with "Without rungroup" plus other groups)
- Fill the Title with "Run inside existing group"
  - _Expected_: Title input shows the value
- Click 'Launch'
  - _Expected_:
  - Success toast "Run has been started" is shown
  - Manual Runner opens
  - The resulting run is associated with "${group_title}" (visible in the Run detail panel and under the RunGroup page listing)

<!-- test
type: manual
priority: normal
source: AC-96, ac-delta-14
automation: candidate
-->
## "Run as checklist" ON at creation time persists on the created run

The creation-side toggle determines whether the run launches in checklist mode; the state must be durable on the persisted run.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens; "Run as checklist" switch is OFF by default
- Toggle "Run as checklist" ON
  - _Expected_: Switch transitions to the ON state with visible state change
- Fill the Title with "Checklist mode on creation"
  - _Expected_: Title input shows the value
- Click 'Launch'
  - _Expected_:
  - Success toast "Run has been started" is shown
  - Manual Runner opens
  - Runner header shows "Manual Run (Checklist)" label (runtime behavior around description hiding is owned by #2 test-execution-runner; here we only verify that the checklist flag was persisted)
- Navigate back to the Runs list and open the run's detail panel
  - _Expected_: Run detail confirms checklist-mode indicator / label (badge, tag, or equivalent) on the run, matching the creation-time toggle

<!-- test
type: manual
priority: normal
source: AC-38, ac-delta-5
automation: deferred
automation-note: deep Assign-to panel content is owned by #3 tester-assignment
-->
## Cancelling the Assign more users panel reverts the assignee section to creator-only @negative

Adding assignees then cancelling must not partially persist the additions.

## Preconditions

- Project has at least two members other than the creator.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens; Assignee section shows the creator chip with "as manager" label
- Click the 'Assign more users' link
  - _Expected_: Tester-assignment panel opens exposing a user picker
- Tick two additional users in the picker
  - _Expected_: Both users show a selected state inside the panel
- Click the 'Cancel' (or equivalent dismiss) action in the panel
  - _Expected_:
  - Panel closes
  - Assignee section in the creation sidebar reverts to show only the creator chip (no added chips)
- Fill the Title with "Cancelled assignee additions" and click 'Save'
  - _Expected_:
  - Success toast "Run has been created" is shown
  - Created run's detail panel shows only the creator under "Assigned to" (additions were discarded)

<!-- test
type: manual
priority: normal
source: AC-45, AC-47, ac-delta-7
automation: candidate
-->
## Adding and removing an environment slot leaves only the initial slot @boundary

Slot management in the Multi-Environment modal must support symmetric add/remove operations — after parity operations, only the initial slot "1" remains.

## Preconditions

- Project has available environments.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the environment selector
  - _Expected_: Multi-Environment Configuration modal opens with slot "1" visible
- Click the 'Add Environment' button inside the modal
  - _Expected_: Slot "2" appears below slot "1"
- Remove slot "2" via its delete/remove affordance
  - _Expected_:
  - Slot "2" is removed
  - Only slot "1" remains visible
- Click the 'Cancel' button to dismiss the modal without saving
  - _Expected_:
  - Modal closes
  - Environment selector in the sidebar shows its placeholder (no env assigned; removing slots did not persist any choice because Cancel was used)
