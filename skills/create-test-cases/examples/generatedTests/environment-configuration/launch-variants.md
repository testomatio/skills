<!-- suite -->
# Launch Variants

Covers how the primary launch action in the New Manual Run sidebar adapts to the number of configured env groups, and the resulting RunGroup / child-run structure produced by each multi-env launch mode. These tests are also the dedicated coverage for cross-cutting concern **A. Multi-environment configuration** (this sub-feature is the owner). Does NOT cover the subsequent Manual Runner behaviour inside each child run (owned by #2 test-execution-runner) or the RunGroup list / report UI (owned by #7 runs-list-management and #5 run-groups) — here we only verify creation-time presence.

<!-- test
type: manual
priority: normal
source: ac-delta-6
automation: candidate
-->
## Single env group configuration keeps a single `Launch` button @boundary

Verifies the state where exactly one env group is saved: the sidebar must surface only the plain `Launch` action (no Sequence / All variants).

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page with a test scope selected (e.g. `All tests`)
- Exactly one env group has been saved with at least one environment selected

## Steps
- Observe the environment row in the sidebar
  - _Expected_: the selected environment value is rendered as a badge chip
- Observe the primary action footer of the sidebar
  - _Expected_:
  - A single `Launch` button is visible
  - No `Launch in Sequence` button is visible
  - No `Launch All` button is visible

<!-- test
type: manual
priority: normal
source: ac-delta-7
automation: candidate
-->
## Two env groups replace `Launch` with `Launch in Sequence` and `Launch All` @boundary

Verifies the state where two or more env groups are configured: the plain `Launch` button is no longer shown and is replaced by the two explicit multi-env launch actions side by side.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page with a test scope selected (e.g. `All tests`)
- Two env groups have been saved, each with at least one environment selected

## Steps
- Observe the environment row in the sidebar
  - _Expected_: the `2 environments configured` button is shown in place of individual badge chips
- Observe the primary action footer of the sidebar
  - _Expected_:
  - A `Launch in Sequence` button is visible
  - A `Launch All` button is visible
  - No plain `Launch` button is visible

<!-- test
type: manual
priority: critical
source: AC-49, ac-delta-9, ac-delta-11
automation: candidate
-->
## Launch in Sequence creates a RunGroup with sequential env-labeled child runs @smoke

Launches a multi-env run in sequential mode and verifies the RunGroup structure, child run count, env badges, and that only the first child is active.

## Preconditions
- Signed in as a user with access to a project that contains at least one manual test
- The New Manual Run sidebar is open on the Runs page
- Two env groups have been saved (for example group `1` → `Windows`, group `2` → `Chrome`)
- Test scope `All tests` is selected

## Steps
- Click the `Launch in Sequence` button
  - _Expected_: the browser navigates to the Manual Runner URL for the first child run (URL pattern `/projects/{project}/runs/launch/{runId}/`)
- Observe the Manual Runner header
  - _Expected_: the active environment value of the first group is shown as a badge next to the run title (e.g. `Windows`)
- Navigate back to the Runs page
  - _Expected_: a RunGroup entry titled `"Multi-environment tests at {datetime}"` is shown at the top of the list
- Expand the RunGroup entry
  - _Expected_:
  - Two child runs are listed under the group
  - Each child run shows a distinct environment badge matching a saved group (e.g. `Windows`, `Chrome`)
  - Both child runs are in the `New Run` state immediately after launch (sequential execution order is managed server-side; the UI shows both as `New Run` at creation time)
- Post-condition cleanup: delete the created RunGroup via its extra menu → `Purge` → confirm `Purge`
  - _Expected_: the banner `"This rungroup was deleted and the nested runs were moved to the Archive!"` is shown and the RunGroup is no longer on the list

<!-- test
type: manual
priority: critical
source: AC-50, ac-delta-10, ac-delta-11
automation: candidate
-->
## Launch All creates a RunGroup with parallel env-labeled child runs @smoke

Launches a multi-env run in parallel mode and verifies that every child run is activated simultaneously, each labeled with its environment.

## Preconditions
- Signed in as a user with access to a project that contains at least one manual test
- The New Manual Run sidebar is open on the Runs page
- Two env groups have been saved (for example group `1` → `Windows`, group `2` → `Chrome`)
- Test scope `All tests` is selected

## Steps
- Click the `Launch All` button
  - _Expected_:
  - The New Manual Run sidebar remains open (no automatic navigation into the Manual Runner)
  - No validation error banner is shown
- Dismiss the sidebar and observe the Runs page
  - _Expected_:
  - A RunGroup entry titled `"Multi-environment tests at {datetime}"` is shown at the top of the list
  - A `New RunGroup` label is rendered next to the group title
- Expand the RunGroup entry
  - _Expected_:
  - Two child runs are listed under the group
  - Each child run shows a distinct environment badge matching a saved group
  - Both child runs are simultaneously in a `New Run` / in-progress state
- Post-condition cleanup: delete the created RunGroup via its extra menu → `Purge` → confirm `Purge`
  - _Expected_: the banner `"This rungroup was deleted and the nested runs were moved to the Archive!"` is shown and the RunGroup is no longer on the list
