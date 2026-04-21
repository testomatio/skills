<!-- suite -->
# Cross-cutting

Sub-feature #2 participates in several cross-cutting concerns documented in `destructuring.md`. This nested suite contains dedicated tests for each concern that impacts the runner's rendering and interaction contract: D (checklist-mode description hiding), E (custom-status reflection), B (multi-assignee badge). Concern F (filter-scoped navigation) is covered in `detail-pane-and-tree.md` because it is inseparable from the priority-filter test surface.

<!-- test
type: manual
priority: high
source: AC-96, ac-delta-15
automation: candidate
-->
## Checklist-mode run hides test descriptions by default (cross-cut D)

When a run is created with 'Run as checklist' ON, the runner must hide test descriptions on load. This shields the tester from the description until they choose to reveal it.

## Preconditions

- A newly created manual run was launched with the 'Run as checklist' toggle set to ON during creation
- The run contains at least 1 test whose description is non-empty

## Steps

- Open the run in the Manual Runner
  - _Expected_:
  - Runner loads with the tests tree on the left and the detail pane on the right
  - 'Run as checklist' state is reflected in the run (for example a badge or indicator denoting checklist mode, if present)
- Click a test with a non-empty description
  - _Expected_:
  - Test detail pane shows the title and the status buttons
  - Description area is NOT visible by default
  - Steps and attachment sections follow their usual rendering rules
- Click a different test with a non-empty description
  - _Expected_: Description is also hidden by default on the new test (applies to every test in checklist-mode runs)

<!-- test
type: manual
priority: normal
source: AC-96, ac-delta-15
automation: candidate
-->
## Per-test 'Toggle Description' in a checklist run reveals and re-hides the description (cross-cut D)

Checklist mode hides descriptions globally, but the user must still be able to reveal a single test's description on demand via the per-test extra menu.

## Preconditions

- An ongoing manual run created with 'Run as checklist' ON
- The run contains a test with a non-empty description

## Steps

- Open the test with a non-empty description
  - _Expected_: Description is hidden by default (checklist mode); a per-test extra menu icon (three dots) is visible in the detail pane header
- Open the per-test extra menu
  - _Expected_: Menu lists a 'Toggle Description' action
- Click 'Toggle Description'
  - _Expected_:
  - Menu closes
  - Description block renders in the detail pane for this single test
- Open the per-test extra menu again and click 'Toggle Description' once more
  - _Expected_:
  - Description block collapses and is hidden again
  - No other test in the run is affected by this per-test toggle

<!-- test
type: manual
priority: normal
source: ac-delta-22
automation: deferred
automation-note: deferred — requires a multi-user fixture (≥ 2 users assigned to the run and explicit per-test assignees); exact badge locator was not visually confirmed during UI exploration
-->
## Per-test assignee badge is visible in the tree on a multi-assignee run (cross-cut B) @unclear

When multiple testers are assigned to a run and individual tests have specific assignees, each test row must surface the assignee at a glance so the tester knows what is theirs.

## Preconditions

- An ongoing manual run with 2 or more testers assigned
- At least 2 tests have explicit per-test assignees (different users)

## Steps

- Open the run in the Manual Runner
  - _Expected_: Tests tree renders on the left
- Locate the tests that have explicit assignees
  - _Expected_:
  - Each such test row shows a compact assignee badge or avatar
  - Hovering the badge reveals a tooltip naming the assigned user
- Compare assignee badges for two tests assigned to different users
  - _Expected_: Badges visually differ (distinct avatar or initials matching the respective users); they are not collapsed into a single shared indicator

<!-- test
type: manual
priority: normal
source: AC-31, ac-delta-21
automation: deferred
automation-note: deferred — requires a project-level custom-status fixture; see result-entry.md for the same prerequisite
-->
## Custom sub-status counter impact is visible in the runner header (cross-cut E)

Applying a custom sub-status on top of a standard status must still increment the standard-status header counter. The custom-status information is additive, not replacement.

## Preconditions

- Project has a custom sub-status "In Review" whose parent type is "Passed"
- An ongoing manual run with at least 1 pending test

## Steps

- Record the header counters (Passed P / Failed F / Skipped S / Pending G)
  - _Expected_: All four counters are visible
- Open a pending test and click 'PASSED'
  - _Expected_: Passed counter increases from P to P+1; Pending decreases from G to G-1
- Click the custom sub-status 'In Review' in the newly revealed sub-status button row
  - _Expected_:
  - 'In Review' sub-status becomes active in the detail pane
  - Passed counter remains at P+1 (the custom status did NOT move the test out of the Passed bucket)
  - Failed, Skipped, and Pending counters are unchanged
- Navigate to a different test and return to confirm persistence
  - _Expected_: Passed + 'In Review' are both still active; counters are stable at Passed P+1, Pending G-1
