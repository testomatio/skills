<!-- suite -->
# Result Entry

Applying a standard status (PASSED / FAILED / SKIPPED), entering a result message, layering a custom sub-status on top of the standard one, and observing the consequences in status counters and the test detail pane. Does NOT cover bulk-selection result-message flow (owned by sub-feature #10 bulk-status-actions).

<!-- test
type: manual
priority: critical
source: AC-29, ac-delta-1, ac-delta-2
automation: candidate
-->
## Apply standard status ${status} to a pending test @smoke

Opening a test from the runner tree and applying each of the three standard statuses must record the outcome on the test row and increment the matching counter.

## Preconditions

- An ongoing manual run with at least 1 pending test is open in the Manual Runner

## Steps

- Open the first pending test from the left-side tests tree
  - _Expected_: Test detail pane is displayed on the right; the test row is highlighted; the three status buttons Passed / Failed / Skipped are visible and enabled
- Click the '${status}' button
  - _Expected_:
  - The '${status}' button enters its active visual state
  - The test row in the tree gains a status indicator matching ${status}
  - The status counter "${counter_label}" at the top of the runner increments by 1
  - Custom sub-status buttons appear below the standard status buttons; the Result message text area and the attachment drop zone are present below
- Click the next pending test in the tree
  - _Expected_: Detail pane loads the new test; the previous test still shows its ${status} indicator in the tree

<!-- example -->

| status  | counter_label |
| ---     | ---           |
| Passed  | Passed        |
| Failed  | Failed        |
| Skipped | Skipped       |

<!-- test
type: manual
priority: high
source: AC-30, ac-delta-2
automation: candidate
-->
## Result message is editable only after a standard status is selected @negative

Before any standard status is applied, the Result message area must not be editable. This guards against users saving a "comment without outcome" result.

## Preconditions

- An ongoing manual run with a pending test (no status applied yet) is open

## Steps

- Open a pending test in the Manual Runner
  - _Expected_: Detail pane shows test title, description (if present), and the three status buttons; the Result message text area is rendered and editable even before a status is chosen
  > UI check gap (2026-04-18): The premise of this test is incorrect — the Result message textarea is always rendered and editable on pending tests (not disabled/hidden). The test needs reworking: the distinction to validate is that the attachment drop zone appears only after a status is applied, not the Result message textarea. Leaving the test body below for revision reference.
- Attempt to place the text cursor in the Result message area and type "should not persist"
  - _Expected_:
  - The cursor can be placed and text can be typed even before a status is selected (textarea is always enabled)
  - No status indicator appears on the test row in the tree until a status button is clicked
- Click the 'Passed' button
  - _Expected_: Passed becomes the active standard status; custom sub-status buttons appear below; attachment drop zone becomes visible
- Type "now it works" into the Result message area
  - _Expected_: Result message area displays the typed text "now it works"

<!-- test
type: manual
priority: high
source: AC-30, ac-delta-3
automation: candidate
-->
## Result message persists after navigating to another test and back

Once a result message is entered, leaving the test and returning to it must show the message intact. This verifies the message was saved, not just held in local UI state.

## Preconditions

- An ongoing manual run with at least 2 pending tests is open

## Steps

- Open the first pending test
  - _Expected_: Test detail pane loads; the three status buttons Passed / Failed / Skipped are visible and enabled
- Click the 'Failed' button
  - _Expected_: Test row shows a Failed indicator; Result message area is editable
- Type "step-3 button did not render on reload" into the Result message area
  - _Expected_: Result message area displays the typed text
- Click somewhere outside the Result message area (for example on the test title) to blur the field
  - _Expected_: Result message text remains visible; no validation error appears
- Click a different pending test in the tree
  - _Expected_: Detail pane loads the other test; its own Result message area is empty (or read-only if its status is not yet applied)
- Click the original test again in the tree
  - _Expected_:
  - Detail pane re-opens the first test
  - Failed status is still active
  - The Result message area still shows "step-3 button did not render on reload" exactly as entered

<!-- test
type: manual
priority: high
source: AC-31, ac-delta-21
automation: candidate
-->
## Custom sub-status dropdown is disabled before a standard status is chosen @negative

Custom sub-statuses layer on top of a standard status and must never be selectable on their own. This is the cross-cutting E contract.

## Preconditions

- Project has at least 1 custom status configured (in Settings → Statuses)
- An ongoing manual run with a pending test is open

## Steps

- Open a pending test in the Manual Runner
  - _Expected_: Standard status buttons (Passed / Failed / Skipped) are visible; the custom sub-status area below them is not rendered (absent)
- Attempt to click an element that looks like a custom sub-status trigger
  - _Expected_:
  - The element does not respond, or there is nothing clickable in the sub-status area
  - No custom status indicator appears on the test row
- Click the 'Passed' button
  - _Expected_:
  - Passed becomes the active standard status
  - Custom sub-status buttons appear below the standard status buttons and become clickable

<!-- test
type: manual
priority: high
source: AC-31, ac-delta-21
automation: candidate
-->
## Applying a custom sub-status to ${standard_status} keeps the standard status selected

A custom sub-status attaches to the standard one; it does not replace it. Both pieces of metadata must remain on the test after layering.

## Preconditions

- Project has at least 1 custom sub-status configured whose parent type matches ${standard_status}
- An ongoing manual run with a pending test is open

## Steps

- Open a pending test and click the '${standard_status}' button
  - _Expected_: ${standard_status} becomes the active standard status; custom sub-status buttons for ${standard_status}-type are now visible
- Click one of the visible custom sub-statuses (for example 'Blocked', 'In Review', or any configured option)
  - _Expected_:
  - The chosen custom sub-status enters its active visual state
  - The '${standard_status}' button is still shown as active
  - The test row in the tree shows both indicators or a combined indicator reflecting the standard + custom status
- Click away to a different test in the tree, then click the original test again
  - _Expected_: Both the '${standard_status}' standard status and the custom sub-status are still visible as active on return

<!-- example -->

| standard_status |
| ---             |
| Passed          |
| Failed          |

<!-- test
type: manual
priority: normal
source: AC-29, AC-30
automation: candidate
-->
## Switching status from Passed to Failed updates the header counters accordingly @boundary

Counters are a state transition, not a cumulative log. Re-applying a different status on the same test must decrement the original bucket and increment the new one.

## Preconditions

- An ongoing manual run with at least 1 pending test, and baseline header counters visible (for example "Passed 0 / Failed 0 / Skipped 0 / Pending N")

## Steps

- Record the current header counters (Passed P / Failed F / Pending G)
  - _Expected_: Counter values are visible at the top of the runner
- Open a pending test and click the 'Passed' button
  - _Expected_: Passed counter increases from P to P+1; Pending counter decreases from G to G-1; Failed counter remains F
- Click the 'Failed' button on the same test (without opening a different test in between)
  - _Expected_:
  - Passed counter decreases back to P
  - Failed counter increases from F to F+1
  - Pending counter remains G-1
  - The test row in the tree shows the Failed indicator; the previous Passed indicator is gone
- Click the 'Skipped' button on the same test
  - _Expected_: Failed counter returns to F; Skipped counter increases by 1; Passed and Pending are unchanged from their previous values

<!-- test
type: manual
priority: normal
source: ac-delta-2
automation: candidate
-->
## Test detail pane renders the documented sections for a test with description and steps

The detail pane has a documented composition (title, description, steps, attachments area, result message, status buttons). Verifying the presence of all sections prevents regressions where a whole section disappears silently.

## Preconditions

- An ongoing manual run that contains at least 1 test with a non-empty description AND at least one defined step

## Steps

- Open the test that has description + steps from the tree
  - _Expected_:
  - Detail pane shows the test title at the top
  - Test description block is rendered below the title
  - Steps list is rendered below the description with one row per step
  - Passed / Failed / Skipped buttons are visible
  - Result message textarea is present and editable
- Click the 'Passed' button
  - _Expected_:
  - Custom sub-status buttons appear below the standard status buttons
  - Attachment drop zone becomes visible below the result message area
- Scroll the detail pane to the bottom
  - _Expected_: No section is truncated; all of title, description, steps, status, result message, attachments are reachable

<!-- test
type: manual
priority: normal
source: ac-delta-21
automation: deferred
automation-note: deferred — requires project-level custom-status configuration before automation seeds the run; add a dedicated fixture step
-->
## Applied custom sub-status is reflected on the test row indicator in the tree (cross-cut E)

Custom statuses propagate to the tree indicator so a user can see sub-status at a glance without re-opening the test. This is the rendering side of cross-cutting E.

## Preconditions

- Project has at least 1 custom sub-status whose parent type is "Passed"
- An ongoing manual run with at least 1 pending test is open

## Steps

- Open a pending test and click the 'Passed' button
  - _Expected_: Standard status is applied; custom sub-status buttons appear
- Click a custom sub-status of Passed type (for example 'Reviewed')
  - _Expected_: Custom sub-status becomes active in the detail pane
- Move focus away from the test (click a different test in the tree)
  - _Expected_: Test row for the original test shows a combined or layered indicator reflecting both "Passed" and the custom sub-status name or colour (not only the generic Passed indicator)
