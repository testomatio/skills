<!-- suite -->
# Attachments

Adding files to a test result via the file picker and via drag-and-drop, switching the attachment display layout, previewing attachments, and deleting with the "Are you sure?" guard. Does NOT cover project-level attachment size limits or Settings→Attachments configuration.

<!-- test
type: manual
priority: high
source: AC-32, ac-delta-4
automation: candidate
-->
## Add an attachment via the 'browse' file picker

The attachment zone must accept file selection via the native file picker once a standard status is applied.

## Preconditions

- An ongoing manual run with at least 1 pending test
- A local image file (for example `evidence.png`, under 1 MB) available in the test runner's file system

## Steps

- Open a pending test and click the 'PASSED' button
  - _Expected_: Result message area becomes editable; attachment zone with a "Drag and drop or browse" prompt is displayed below
- Click the 'browse' link inside the attachment zone
  - _Expected_: The browser's native file picker dialog opens
- Select `evidence.png` and confirm the picker
  - _Expected_:
  - File picker closes
  - A new attachment thumbnail for `evidence.png` is rendered inside the attachment zone
  - The thumbnail shows the file name "evidence.png"
- Click a different test in the tree, then click the original test again
  - _Expected_: The attachment `evidence.png` is still present in the attachment zone (persisted to the result)

<!-- test
type: manual
priority: normal
source: AC-32, ac-delta-4
automation: candidate
automation-note: deferred — reliable programmatic drag-and-drop in Playwright requires platform-specific workarounds; automation feasible but non-trivial
-->
## Add an attachment via drag-and-drop onto the drop zone

Dragging a file onto the attachment zone must highlight the zone and accept the drop.

## Preconditions

- An ongoing manual run with at least 1 pending test
- A local image file available locally

## Steps

- Open a pending test and click the 'PASSED' button
  - _Expected_: Attachment zone is visible below the Result message area
- Drag an image file from the OS file browser over the attachment zone (do not release)
  - _Expected_: Attachment zone gains a visual "drop target" highlight (colour change, border, or overlay text)
- Release the file onto the highlighted zone
  - _Expected_:
  - Drop zone returns to its normal state
  - Attachment thumbnail for the dropped file appears
  - File name matches the dropped file
- Verify by clicking away and returning
  - _Expected_: The attachment is still listed after navigation

<!-- test
type: manual
priority: normal
source: AC-32, ac-delta-5
automation: deferred
automation-note: deferred — attachment view-toggle buttons render only when ≥1 attachment exists; exact button labels not confirmed during UI exploration — revisit after automation uploads a fixture file
-->
## Change attachment display layout to ${view_mode} @unclear

Attachment view toggles let the user switch between larger previews and compact lists. The toggle state must take effect immediately and hold for the session.

## Preconditions

- An ongoing manual run with a pending test that already has at least 2 attachments applied to its result

## Steps

- Open the test with attachments and select its applied status
  - _Expected_: Attachment zone renders the existing attachments and the 4 view-toggle buttons are visible near it (Large Thumbnail / Small Thumbnail / Grid / List)
- Click the '${view_mode}' toggle
  - _Expected_:
  - The '${view_mode}' toggle enters an active visual state
  - Attachment area re-renders in the ${view_mode} layout
  - Other toggles are no longer active
- Click a different test in the tree, then click the original test again
  - _Expected_: Attachment area is still rendered in ${view_mode} (session-level persistence)

<!-- example -->

| view_mode       |
| ---             |
| Large Thumbnail |
| Small Thumbnail |
| Grid            |
| List            |

<!-- test
type: manual
priority: normal
source: AC-33, ac-delta-6
automation: deferred
automation-note: deferred — attachment preview modes open in a lightbox overlay; full-screen triggers the browser's Fullscreen API which is automation-fragile — exact close affordance to be confirmed
-->
## Open an attachment preview in ${preview_mode} and close back to the runner @unclear

Clicking an attachment should open a preview. Users must be able to both "Fit to width" and "Full screen", and return to the runner when done.

## Preconditions

- An ongoing manual run with a pending test that has at least 1 image attachment applied

## Steps

- Open the test and confirm the attachment is visible in the attachment zone
  - _Expected_: Attachment thumbnail is visible
- Click the attachment thumbnail
  - _Expected_: Preview opens over the runner; preview controls include '${preview_mode}'
- Click '${preview_mode}'
  - _Expected_:
  - Preview enters ${preview_mode} state (either scaled to panel width or expanded to full screen)
  - The image remains visible; no error toast appears
- Close the preview (click the close control or press ESC)
  - _Expected_:
  - Preview closes
  - Runner detail pane is visible again with the same test open
  - The attachment is unchanged

<!-- example -->

| preview_mode  |
| ---           |
| Fit to width  |
| Full screen   |

<!-- test
type: manual
priority: high
source: AC-34, ac-delta-7
automation: candidate
-->
## Deleting the last attachment with 'Confirm' restores the empty drop zone @boundary

Deletion must be guarded by a confirmation dialog, and confirming must permanently remove the attachment from the result.

## Preconditions

- An ongoing manual run with a pending test that has exactly 1 attachment applied to its result

## Steps

- Open the test with the attachment
  - _Expected_: Attachment thumbnail is visible; a trash / delete icon is visible on or next to the attachment
- Click the trash icon on the attachment
  - _Expected_: An "Are you sure?" confirmation dialog appears with Confirm and Cancel actions
- Click the confirm action in the dialog (for example 'Yes' or 'Delete')
  - _Expected_:
  - Confirmation dialog closes
  - Attachment thumbnail is removed from the attachment zone
  - Attachment zone reverts to the empty state prompt ("Drag and drop or browse")
- Click a different test in the tree, then click the original test again
  - _Expected_: Attachment is still absent (deletion was persisted, not just local state)

<!-- test
type: manual
priority: normal
source: AC-34, ac-delta-7
automation: candidate
-->
## Cancelling the 'Are you sure?' dialog keeps the attachment @negative

Dismissing the confirmation dialog must leave the attachment untouched.

## Preconditions

- An ongoing manual run with a pending test that has at least 1 attachment applied to its result

## Steps

- Open the test and click the trash icon on an attachment
  - _Expected_: "Are you sure?" confirmation dialog appears
- Click the cancel action in the dialog (for example 'No', 'Cancel', or the close × button)
  - _Expected_:
  - Confirmation dialog closes
  - Attachment is still present in the attachment zone
  - No "attachment deleted" toast is shown
- Press ESC or click outside to double-check no lingering dialog state
  - _Expected_: Runner is interactive; attachment is still there
