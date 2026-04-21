<!-- suite -->
# Notes

Creating temporary notes attached to a test or a suite during execution, converting a note into a full test, and bulk-creating notes across multiple selected tests. Notes are surfaced inline in the test tree with a distinct "note" badge.

<!-- test
type: manual
priority: high
source: ac-delta-10
automation: candidate
-->
## Create a note via the runner header 'Create notes' action

The runner must expose a top-level action to drop a note into the current test context. The note must then be visible in the tree with a distinguishing badge.

## Preconditions

- An ongoing manual run is open in the Manual Runner

## Steps

- Locate the 'Create notes' action in the runner header
  - _Expected_: 'Create notes' icon button is visible in the header toolbar (icon-only, tooltip text is "Create notes"); no "+" visible in the tooltip
- Click the 'Create notes' button
  - _Expected_: An inline note-creation form appears with heading "Create note" (singular); a "Note title" text input and a "Result message" textarea body area are present; "Save note" and "Cancel" buttons are present; a "Bulk" checkbox is also present
- Type "Regression reminder — check logout on session expiry" into the note title input
  - _Expected_: Title input displays the typed text
- Click the 'Save note' button on the note form
  - _Expected_:
  - Inline form closes
  - A new row appears in the tests tree labelled "Regression reminder — check logout on session expiry" with a `badge-type note` badge (icon badge, text visually hidden) distinguishing it from test rows
  - No toast notification appears (note creation is silent)
- Click the new note row
  - _Expected_: Note detail pane opens on the right showing the note title and the "Result message" body textarea

<!-- test
type: manual
priority: normal
source: ac-delta-11
automation: candidate
-->
## Add a note to a suite via the suite row affordance

A suite-scoped note must be reachable from the suite row itself and be visible in-context without opening any specific test.

## Preconditions

- An ongoing manual run with at least one suite visible in the tree

## Steps

- Hover the cursor over a suite row in the tree
  - _Expected_: Suite-row affordances appear next to the suite name, including 'Add note to suite'
- Click 'Add note to suite' on the suite row
  - _Expected_: Inline note form opens in the context of the suite; title input is focused
- Type "Suite-level note: re-confirm before running on staging" into the title input and save
  - _Expected_:
  - Form closes
  - A new note row appears under the suite with a "note" badge
  - The note row is nested inside the suite, not at the top level
- Collapse and expand the suite row
  - _Expected_: The note row is hidden on collapse and re-appears on expand, identical to child tests

<!-- test
type: manual
priority: normal
source: ac-delta-12
automation: candidate
-->
## Convert an existing note into a full test

Notes are temporary; converting a note into a full test moves its content into the tests tree as a first-class test entry.

## Preconditions

- An ongoing manual run
- A note row already present in the tree titled "Convert me to a real test"

## Steps

- Click the note row in the tree
  - _Expected_: Note detail pane opens on the right with the note's title and body; a 'Convert to test' action is visible
- Click 'Convert to test'
  - _Expected_:
  - Note pane either closes or transitions into a test detail pane
  - A new row appears in the tree titled "Convert me to a real test" without the "note" badge (it is now a standard test row)
  - The original note row is removed or replaced
- Open the newly converted test in the tree
  - _Expected_: Standard test detail pane is shown; PASSED / FAILED / SKIPPED buttons are available; no note-specific affordances remain

<!-- test
type: manual
priority: normal
source: ac-delta-13
automation: deferred
automation-note: deferred — bulk-notes affordance depends on Multi-select mode inside the runner which was not exercised during UI exploration; exact trigger to be confirmed
-->
## Bulk-create a note across multiple selected tests @unclear

When multiple tests need the same observation recorded, the user must be able to drop a note onto each of them in one action.

## Preconditions

- An ongoing manual run with at least 3 tests under the same suite

## Steps

- Enter Multi-select mode in the runner (exact trigger to be confirmed with product — typically a "Multi-select" button or long-press / shift-click)
  - _Expected_: Each test row in the tree shows a selection checkbox
- Select three tests under the same suite
  - _Expected_: Selected count indicator in the bulk-actions toolbar shows "3 selected"
- Trigger the bulk-notes action (for example a 'Create note' action in the bulk-actions toolbar)
  - _Expected_: Inline note form appears in a bulk context
- Type "Bulk note: rerun on staging environment" as the note title and save
  - _Expected_:
  - Form closes
  - A note row is attached to each of the three selected tests (visible as note children in the tree under each test)
  - No note is attached to unselected sibling tests

<!-- test
type: manual
priority: normal
source: ac-delta-10
automation: candidate
-->
## Saving a note with an empty title is rejected @negative

A note must carry at least a title so it is identifiable in the tree.

## Preconditions

- An ongoing manual run is open

## Steps

- Click the runner header 'Create notes' button
  - _Expected_: Inline note form opens ("Create note" heading) with empty title input; "Save note" button is disabled until title is filled
- Leave the title input empty and click the 'Save note' button
  - _Expected_:
  - Form does not close
  - Either the Save note button remains disabled, or a validation message appears (title field gains an error state)
  - No new note row appears in the tree
- Type a valid title "Minimal note" into the title input and click 'Save note'
  - _Expected_:
  - Validation state clears
  - Form closes
  - A "Minimal note" row appears in the tree with a `badge-type note` badge
