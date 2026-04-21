<!-- suite -->
# Time Tracking

Per-test stopwatch controls inside the runner — Auto-Track (runs the clock while a test is open) and Set Time (manual entry dialog). The recorded duration is saved onto the test result. Does NOT cover company-level time tracking configuration or reporting in aggregated dashboards.

<!-- test
type: manual
priority: normal
source: ac-delta-19
automation: candidate
-->
## Auto-Track records elapsed time on the test result

With Auto-Track enabled, opening a test starts its timer and applying a status stops it; the elapsed time must then be saved onto the result.

## Preconditions

- An ongoing manual run with at least 1 pending test is open
- Auto-Track is enabled in the runner header (or is enabled at the start of the test)

## Steps

- Open a pending test
  - _Expected_:
  - Timer display in the test detail pane starts at 00:00:00 or begins counting from the moment the test opens
  - Auto-Track indicator in the header is visually ON
- Wait approximately 30 seconds without leaving the test
  - _Expected_: Timer display advances to roughly 00:00:30
- Click the 'PASSED' button
  - _Expected_:
  - Timer stops at a value close to 00:00:30
  - Test row in the tree shows the Passed indicator
  - Saved duration (visible on the test result or via re-opening the test) is approximately the observed stop value
- Navigate away to a different test, then re-open the original
  - _Expected_: The saved duration is still displayed (for example 00:00:30); it does not reset to 0 or continue counting

<!-- test
type: manual
priority: normal
source: ac-delta-20
automation: candidate
-->
## Set Time manual entry replaces the auto-tracked duration

A user who forgets to start the timer or needs to correct a value must be able to enter a duration manually. The manual value must overwrite any Auto-Track value.

## Preconditions

- An ongoing manual run with a pending test that has already accumulated a non-zero Auto-Track value (for example ~00:00:15)

## Steps

- Open the test in the Manual Runner
  - _Expected_: Timer display shows the existing Auto-Track value (approximately 00:00:15); a 'Set Time' action is visible in the timer toolbar
- Click 'Set Time'
  - _Expected_: A duration-entry dialog or picker opens with HH:MM:SS fields
- Enter the duration 00:05:00 and confirm
  - _Expected_:
  - Dialog closes
  - Timer display updates to 00:05:00 (replacing the previous ~00:00:15 value)
  - No concurrent Auto-Track increment is visible while the test remains open; the manually entered value is the new baseline
- Click 'PASSED' to close out the test
  - _Expected_: Saved duration on the result is 00:05:00, not the combination of the auto value and the manual value

<!-- test
type: manual
priority: normal
source: ac-delta-20
automation: deferred
automation-note: deferred — exact validation UX of the Set Time dialog (field-level error, submit-disabled, or modal-level error) was not observed during UI exploration
-->
## Saving 'Set Time' with an empty duration is rejected @negative @boundary @unclear

The manual duration entry must carry a non-empty value; submitting blank fields must not overwrite or corrupt the existing Auto-Track duration.

## Preconditions

- An ongoing manual run with a pending test (Auto-Track duration accumulated or zero — either is acceptable)

## Steps

- Open the test and click 'Set Time' in the timer toolbar
  - _Expected_: Duration-entry dialog opens with HH:MM:SS fields (either empty or pre-populated with the current timer value)
- Clear all three fields so the entry is blank
  - _Expected_: Fields are empty
- Click the dialog's save / confirm action
  - _Expected_:
  - Dialog remains open with a field-level validation error, OR the confirm action is disabled while fields are empty
  - Timer display in the test detail pane does NOT change to 00:00:00 as a side effect
- Close the dialog (cancel action or ESC)
  - _Expected_: Dialog closes; timer continues to display the pre-dialog value
