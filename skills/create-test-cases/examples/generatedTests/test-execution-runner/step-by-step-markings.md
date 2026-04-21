<!-- suite -->
# Step-by-step Markings

Per-step pass/fail/skip markings via click-count gestures on a test that has defined steps, and the persistence of those markings across navigation. Requires a test fixture with at least two defined steps — the `project-for-testing` project does not currently include such a test, so these cases are tagged `@unclear` until a steps fixture is added.

<!-- test
type: manual
priority: high
source: AC-35, ac-delta-8
automation: deferred
automation-note: deferred — relies on a test fixture with ≥2 defined steps that does not exist in project-for-testing; also timing-sensitive (double/triple click gestures) which is fragile in Playwright
-->
## Step-by-step click gesture ${click_count} sets the step to ${target_status} @unclear

Step rows in a test with defined steps must react to single / double / triple click and cycle to the corresponding status. The cycle is documented as: 1 click = Passed, 2 clicks = Failed, 3 clicks = Skipped.

## Preconditions

- An ongoing manual run containing at least one test with ≥ 2 defined steps (requires a fixture test; mark test `@unclear` if no such fixture exists yet)
- The test is currently Pending and has not had any step marked

## Steps

- Open the test in the Manual Runner
  - _Expected_: Detail pane shows the test; a Steps section renders one row per defined step; each step row has a clickable status indicator in its Pending default state
- Perform a ${click_count} on the first step's status indicator
  - _Expected_:
  - Step indicator transitions to the '${target_status}' state (with the colour / label documented in the UI)
  - No modal or overlay appears
  - Other step rows are unchanged
- Click away from the Steps section (for example on the Result message area)
  - _Expected_: First step indicator still shows '${target_status}'

<!-- example -->

| click_count   | target_status |
| ---           | ---           |
| single click  | Passed        |
| double click  | Failed        |
| triple click  | Skipped       |

<!-- test
type: manual
priority: normal
source: AC-36, ac-delta-9
automation: deferred
automation-note: deferred — depends on the same steps fixture as the step-cycle test; persistence verification requires at least one page navigation round-trip
-->
## Step markings persist after closing and re-opening the test @unclear

Step results must be saved to the backend, not held in local UI state.

## Preconditions

- An ongoing manual run containing a test with ≥ 2 defined steps

## Steps

- Open the test in the Manual Runner
  - _Expected_: Detail pane shows the test; step indicators are in the Pending default state
- Single-click the step 1 indicator to mark it as Passed
  - _Expected_: Step 1 shows the Passed state; other step indicators are unchanged
- Double-click the step 2 indicator to mark it as Failed
  - _Expected_: Step 2 shows the Failed state; step 1 is still Passed
- Click a different test in the tree
  - _Expected_: Detail pane switches to the other test; previous test row in the tree still shows its current test-level status
- Click the original test in the tree
  - _Expected_:
  - Original test re-opens in the detail pane
  - Step 1 still shows Passed
  - Step 2 still shows Failed
  - No step has been reset to Pending

<!-- test
type: manual
priority: normal
source: AC-35, AC-36
automation: deferred
automation-note: deferred — depends on the same steps fixture
-->
## Step left unmarked remains Pending when other steps of the same test are marked @negative @unclear

Not every step in a test has to be marked. An unmarked step must stay Pending even when sibling steps are marked.

## Preconditions

- An ongoing manual run with a test that has exactly 3 defined steps

## Steps

- Open the test in the Manual Runner
  - _Expected_: All 3 step indicators are in the Pending default state
- Single-click the step 1 indicator to mark it as Passed
  - _Expected_: Step 1 shows the Passed state; step 2 and step 3 remain Pending
- Triple-click the step 3 indicator to mark it as Skipped; leave step 2 untouched
  - _Expected_:
  - Step 1 shows Passed
  - Step 2 is still Pending
  - Step 3 shows Skipped
- Click a different test in the tree, then re-open the original test
  - _Expected_:
  - Step 2 is still Pending on return
  - Step 1 and step 3 are preserved as previously marked
