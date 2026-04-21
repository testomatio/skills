<!-- suite -->
# Bulk Status Application

This nested suite covers the two bulk-apply surfaces inside the Manual Runner — the "Result message" modal (status + optional message + Apply) and the quick-set toolbar buttons that wrap each status in a browser-native confirm dialog — plus their validation states and custom-status behaviour. It does NOT cover Multi-Select mode lifecycle (owned by `multi-select-mode.md`), selection mechanics (owned by `selection-mechanics.md`), or filter-scoped bulk apply (owned by `cross-cutting.md`).

<!-- test
type: manual
priority: critical
source: AC-29, AC-94, AC-95, ac-delta-6, ac-delta-8, ac-delta-9
automation: candidate
-->
## Bulk apply ${status} via the Result Message modal updates every selected test and header counters @smoke

The Result Message modal is the canonical bulk-apply surface: pick a status, optionally add a message, click Apply — the selection collapses into per-test status icons in the tree and the runner header counters move in lockstep.

## Preconditions
- Unfinished Manual Run with at least 3 tests currently in Pending state
- Manual Runner open with Multi-Select mode active
- No filter applied
- 3 Pending tests selected; the bulk-action bottom toolbar shows "3 tests selected"
- The runner header status counter bar values are captured as the baseline

## Steps
- Click the "Result message" icon button in the bulk-action bottom toolbar
  - _Expected_: The "Result message" modal opens with heading "Result message"; the Apply button is disabled
- Click the "${status}" status button in the modal
  - _Expected_:
     - The "${status}" button adopts its filled / selected visual state
     - The Apply button becomes enabled
- Click the Apply button
  - _Expected_:
     - The modal closes
     - The bulk-action bottom toolbar disappears
     - Multi-Select mode stays active (checkboxes remain visible in the tree)
- Observe the runner test tree
  - _Expected_: Each of the 3 previously selected tests shows the ${status} status icon in its row
- Observe the runner header status counters
  - _Expected_:
     - The "${counter_label}" counter has increased by 3 relative to the captured baseline
     - The "Pending" counter has decreased by 3 relative to the captured baseline

<!-- example -->

| status  | counter_label |
|---------|---------------|
| PASSED  | Passed        |
| FAILED  | Failed        |
| SKIPPED | Skipped       |

<!-- test
type: manual
priority: high
source: ac-delta-6
automation: candidate
-->
## Result Message modal Apply button stays disabled until a status is selected @negative

The Result Message modal enforces a required status even if the user fills the optional message first; Apply only enables once a standard status is chosen.

## Preconditions
- Unfinished Manual Run
- Manual Runner open with Multi-Select mode active
- 2 tests selected; the bulk-action bottom toolbar visible

## Steps
- Click the "Result message" icon in the bulk-action bottom toolbar
  - _Expected_: The "Result message" modal opens; the Apply button is disabled
- Type the text "try message first" into the "Result message" textarea
  - _Expected_:
     - The entered text is visible in the textarea
     - The Apply button remains disabled (message alone does not satisfy the required status)
- Click the "Passed" status button
  - _Expected_:
     - The "Passed" button adopts its selected visual state
     - The Apply button is now enabled

<!-- test
type: manual
priority: normal
source: ac-delta-7
automation: candidate
-->
## Dismissing the Result Message modal via ${dismiss_method} clears the selection without applying a status @negative

The modal's cancel paths are destructive to the selection: closing the modal without Apply drops every currently selected test back to an unselected state and hides the bulk toolbar, so the user has to re-select from scratch.

## Preconditions
- Unfinished Manual Run
- Manual Runner open with Multi-Select mode active
- 2 Pending tests selected; runner header counters captured as baseline

## Steps
- Click the "Result message" icon in the bulk-action bottom toolbar
  - _Expected_: The "Result message" modal opens
- Click the "Passed" status button
  - _Expected_: The "Passed" button adopts its selected state; Apply becomes enabled
- Dismiss the modal using ${dismiss_method}
  - _Expected_:
     - The modal closes without applying the PASSED status
     - The bulk-action bottom toolbar disappears — the current selection is cleared
- Observe the runner header status counters
  - _Expected_: Counters remain unchanged from the captured baseline — no test transitioned to PASSED
- Observe the previously selected test rows in the tree
  - _Expected_: Each row still shows its original Pending status icon

<!-- example -->

| dismiss_method                           |
|------------------------------------------|
| clicking the Close (×) icon in the modal |
| pressing the Escape key                  |

<!-- test
type: manual
priority: high
source: AC-29, ac-delta-10, ac-delta-9
automation: deferred
automation-note: bulk quick-set uses a browser-native confirm dialog; automation must register a dialog handler before clicking the status button
-->
## Bulk quick-set ${status} via the toolbar with native confirm Accept applies the status @smoke

The toolbar's ${status} quick-set is a one-click bulk path that bypasses the Result Message modal; it gates the apply behind a browser-native confirm with a fixed wording.

## Preconditions
- Unfinished Manual Run with at least 3 Pending tests
- Manual Runner open with Multi-Select mode active
- 3 Pending tests selected; the bulk-action bottom toolbar visible
- Runner header status counters captured as baseline

## Steps
- Click the "${status}" status button in the bulk-action bottom toolbar
  - _Expected_: A browser-native confirm dialog appears with text "Are you sure to set status '${status_lower}' for all selected tests?"
- Accept the confirm dialog
  - _Expected_:
     - The dialog closes
     - The bulk-action bottom toolbar disappears (selection cleared)
- Observe the runner test tree
  - _Expected_: The 3 previously selected tests now display the ${status} status icon
- Observe the runner header status counters
  - _Expected_:
     - The "${counter_label}" counter increased by 3 relative to the captured baseline
     - The "Pending" counter decreased by 3 relative to the captured baseline

<!-- example -->

| status  | status_lower | counter_label |
|---------|--------------|---------------|
| PASSED  | passed       | Passed        |
| FAILED  | failed       | Failed        |
| SKIPPED | skipped      | Skipped       |

<!-- test
type: manual
priority: normal
source: ac-delta-10
automation: deferred
automation-note: bulk quick-set confirm — automation must register a dialog-dismiss handler before clicking the status button
-->
## Dismissing the quick-set native confirm dialog leaves all test statuses unchanged @negative

The quick-set confirm must be accepted to commit; dismissing it is a no-op — statuses, counters, and the current selection all stay intact so the user can retry without re-selecting.

## Preconditions
- Unfinished Manual Run
- Manual Runner open with Multi-Select mode active
- 2 Pending tests selected; runner header status counters captured as baseline

## Steps
- Click the "FAILED" status button in the bulk-action bottom toolbar
  - _Expected_: A browser-native confirm dialog appears with text "Are you sure to set status 'failed' for all selected tests?"
- Dismiss the dialog (Cancel)
  - _Expected_: The dialog closes
- Observe the 2 selected test rows
  - _Expected_: Both rows still show the Pending status icon — neither has transitioned to Failed
- Observe the runner header status counters
  - _Expected_: Counters remain unchanged from the captured baseline
- Observe the bulk-action bottom toolbar
  - _Expected_: The toolbar is still visible and still shows "2 tests selected" — the selection persists after the cancelled confirm

<!-- test
type: manual
priority: low
source: AC-31, ac-delta-6
automation: deferred
automation-note: requires a project that has at least one custom sub-status configured under Settings → Custom statuses; 'project-for-testing' has none
-->
## Custom status dropdown appears in the bulk Result Message modal when custom statuses exist @unclear @needs-project-setting

Custom sub-statuses extend the standard PASSED / FAILED / SKIPPED picker in the single-test detail pane; the same affordance is expected inside the bulk Result Message modal whenever the project has at least one custom status configured. The exact rendering (dropdown vs. chip row) is to be confirmed against product.

## Preconditions
- A project that has at least one custom sub-status configured under Settings → Custom statuses
- An unfinished Manual Run in that project
- Manual Runner open with Multi-Select mode active
- 2 Pending tests selected; the bulk-action bottom toolbar visible

## Steps
- Click the "Result message" icon in the bulk-action bottom toolbar
  - _Expected_: The "Result message" modal opens with standard status buttons (Passed / Failed / Skipped); Apply is disabled
- Click the "Passed" status button
  - _Expected_:
     - "Passed" adopts its selected visual state
     - A custom-status affordance is rendered directly below the standard status buttons, exposing each configured custom sub-status as a selectable option (exact affordance shape to be confirmed with product)
- Select the first available custom sub-status
  - _Expected_: The custom sub-status is visually marked as selected alongside the PASSED status
- Click the Apply button
  - _Expected_:
     - The modal closes; the bulk-action bottom toolbar disappears
     - The 2 previously selected tests show the PASSED status combined with the chosen custom sub-status (visible in the tree row and / or per-test detail pane)

<!--
Validation Log (ui-validator subagent, 2026-04-19):
Tests walked: "Bulk apply ${status} via the Result Message modal...", "Dismissing the Result Message modal via ${dismiss_method}..."
Mismatches fixed: 6 (modal status button labels corrected from all-caps to title case in 6 places).
Toolbar quick-set buttons retain all-caps labels because CSS text-transform:uppercase renders them as PASSED/FAILED/SKIPPED; modal buttons render as Passed/Failed/Skipped.
Gaps: 0.
-->

