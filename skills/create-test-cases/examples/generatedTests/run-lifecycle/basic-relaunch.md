<!-- suite -->
# Basic Relaunch

Covers the one-click Relaunch family available from a finished run's extra menu: 'Relaunch' (re-enter same run ID), 'Launch a Copy' (duplicate run), and the state-gate that hides these items on unfinished runs. The Advanced Relaunch sidebar is owned by the next file; CI-routing variants (Failed on CI / All on CI / Manually / Copy Manually) that only appear on automated or mixed runs are covered in cross-cutting.md under the @unclear umbrella because `project-for-testing` has no automated fixture available at generation time.

<!-- test
type: manual
priority: critical
source: AC-58, ac-delta-8
automation: candidate
-->
## Relaunching a finished manual run re-opens the same Run ID in the Manual Runner @smoke

## Preconditions
- A finished manual run exists in the project (status Finished, all tests resolved)
- User remembers the finished run's short ID and the status of at least two tests inside it

## Steps
- Navigate to the 'Runs' page and open the extra menu on the finished run's row
  - _Expected_: Menu contains 'Relaunch' as the first item
- Click 'Relaunch'
  - _Expected_:
  - Browser navigates to `/projects/{project}/runs/launch/{id}/?entry={testId}` with the SAME run ID (no new ID generated)
  - Manual Runner opens
- Inspect the test tree
  - _Expected_:
  - Test list is identical to the finished run's test list
  - Each test retains the status indicator from the prior finish (Passed/Failed/Skipped)
- Return to the Runs list
  - _Expected_: Only one run with this ID exists — no duplicate entry was created

---

<!-- test
type: manual
priority: normal
source: AC-67, ac-delta-13
automation: candidate
-->
## Launch a Copy of a finished run creates a duplicate run with a new Run ID @smoke

## Preconditions
- A finished manual run exists with a known title (e.g. `Source run for copy`) and at least two tests

## Steps
- Navigate to the 'Runs' page and open the extra menu on the finished source run's row
  - _Expected_: Menu contains 'Launch a Copy'
- Click 'Launch a Copy'
  - _Expected_:
  - A new Run is created with a different short ID from the source
  - Browser navigates to the runner (or run detail) of the NEW run
  - New run's title matches the source's title (optionally with a relaunch indicator)
- Return to the 'Runs' page
  - _Expected_:
  - BOTH the source finished run and the newly copied run appear in the list
  - Copied run's tests all start in the Pending state; source run is unchanged

---

<!-- test
type: manual
priority: normal
source: ac-delta-8
automation: candidate
-->
## Relaunch menu items appear only on finished runs — not on unfinished runs @negative

## Preconditions
- An unfinished manual run exists AND a finished manual run exists in the same project

## Steps
- Navigate to the 'Runs' page and open the extra menu on the unfinished run's row
  - _Expected_: Menu does NOT contain 'Relaunch' or 'Launch a Copy'; it DOES contain 'Launch', 'Advanced Relaunch', 'Edit', and 'Finish'
- Close the unfinished run's menu
  - _Expected_: Menu dismisses with no side effect on the run
- Open the extra menu on the finished run's row
  - _Expected_: Menu CONTAINS 'Relaunch', 'Advanced Relaunch', and 'Launch a Copy'; it does NOT contain 'Launch', 'Edit', or 'Finish'

---

<!-- test
type: manual
priority: low
source: AC-59, AC-60, AC-61, ac-delta-1, ac-delta-14
automation: deferred
automation-note: Requires a finished automated or mixed run in the target project; `project-for-testing` has only manual runs at generation time. Exact locator to be confirmed with an automated/mixed fixture.
-->
## CI-routing Relaunch variants via ${variant} appear on finished ${run_type} runs @unclear

## Preconditions
- A finished ${run_type} run exists in the project
- CI profile for automated tests is configured in project settings

## Steps
- Navigate to the 'Runs' page and open the extra menu on the finished ${run_type} run's row
  - _Expected_: Menu exposes ${variant} in addition to the manual-run items
- Click ${variant}
  - _Expected_:
  - ${expected_routing} routing occurs: automated tests are queued on CI (or kept in Manual Runner per variant), and manual tests open in the Manual Runner as noted in ${expected_routing}
  - A relaunched run is created or the original run is reused per the variant's contract
- Return to the 'Runs' page
  - _Expected_: Relaunched artefact appears with the corresponding status indicator

<!-- example -->
| variant                   | run_type  | expected_routing |
|---------------------------|-----------|------------------|
| Relaunch Failed on CI     | mixed     | Failed automated rerun on CI; failed manual open in Manual Runner |
| Relaunch All on CI        | automated | All automated rerun on CI |
| Relaunch Manually         | mixed     | All tests re-executed manually in the UI (no CI) |
| Launch a Copy Manually    | mixed     | New duplicate run, opens Manual Runner for all tests |

---
