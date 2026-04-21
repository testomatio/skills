<!-- suite -->
# Cross-cutting and Unclear Lifecycle Scenarios

Collects tests whose value straddles the lifecycle sub-feature and another concern (multi-environment runs, mutex between ongoing and finished row menus, role-based gating), plus `@unclear` scenarios whose UI surface could not be verified in `project-for-testing` (CI-routing variants, role permission matrix). Each `@unclear` test is kept (not dropped) so coverage is visible; the `automation-note` documents the blocker so the fixture gap is retireable later.

<!-- test
type: manual
priority: high
source: ac-delta-8, AC-58, AC-67
automation: candidate
-->
## Row extra-menu on ${run_state} runs exposes only ${available_items} lifecycle actions @boundary

## Preconditions
- At least one ${run_state} manual run exists in the project

## Steps
- Navigate to the 'Runs' page
- Locate a ${run_state} run and open its extra menu via the row's extra menu button
  - _Expected_: Menu opens within the row context
- Inspect the menu entries against the expected set
  - _Expected_:
  - Menu CONTAINS every item in ${available_items}
  - Menu does NOT contain any item in ${blocked_items}
- Close the menu
  - _Expected_: Menu dismisses with no side effect on the run

<!-- example -->
| run_state   | available_items                                     | blocked_items                          |
|-------------|-----------------------------------------------------|----------------------------------------|
| unfinished  | Launch, Edit, Finish, Advanced Relaunch             | Relaunch, Launch a Copy                |
| finished    | Relaunch, Advanced Relaunch, Launch a Copy          | Launch, Edit, Finish                   |

---

<!-- test
type: manual
priority: high
source: AC-48, AC-49, AC-50, AC-25, ac-delta-8
automation: deferred
automation-note: Requires a multi-environment run fixture (≥2 environment groups in the run). Cross-sub-feature coordination with #4 environment-configuration to provision the parent/child run shape.
-->
## Finish on a multi-environment run terminates the expected scope and leaves other environment runs intact

## Preconditions
- A multi-environment run was launched via 'Launch in Sequence' or 'Launch All' using ≥2 environment groups
- At least one child environment run is still unfinished; at least one other environment run is either unfinished or already finished

## Steps
- Navigate to the 'Runs' page and locate the multi-environment parent/children listing
  - _Expected_: Each environment group appears as a distinct run row (or nested row under a shared parent)
- Open the Manual Runner for ONE unfinished environment run and click 'Finish Run'
  - _Expected_: Browser confirmation dialog shows the `"{N} tests were not run…"` message for THIS environment's Pending count only
- Accept the dialog
  - _Expected_:
  - Only THIS environment run transitions to Finished
  - Other environment runs remain in their prior state (unfinished runs do not flip to Finished; previously finished ones are unchanged)
- Return to the Runs list
  - _Expected_:
  - Per-environment status indicators reflect the expected mix (one more Finished, others unchanged)
  - Parent aggregation (if rendered) reflects the updated per-environment statuses

---

<!-- test
type: manual
priority: low
source: ac-delta-1
automation: deferred
automation-note: Exact locator to be confirmed — 'Launch a Copy Manually' was not observed on manual-only runs in `project-for-testing`. Likely visible only on mixed/automated runs or under a specific project setting.
-->
## 'Launch a Copy Manually' variant on a mixed run opens the duplicate in the Manual Runner @unclear

## Preconditions
- A finished mixed run exists in the project (automated + manual tests)
- Fixture: at least one automated test and one manual test in the source run

## Steps
- Navigate to the 'Runs' page and open the extra menu on the finished mixed run's row
  - _Expected_: Menu exposes 'Launch a Copy Manually' (in addition to the other Launch a Copy / Relaunch variants)
- Click 'Launch a Copy Manually'
  - _Expected_:
  - A NEW run is created with a different Run ID
  - Browser navigates to the Manual Runner of the NEW run
  - Even the automated tests are visible in the Manual Runner as manual-executable entries (CI pipeline is NOT invoked for this variant)
- Return to the 'Runs' list
  - _Expected_: New run appears with `manual` type badge and source run is unchanged

---

<!-- test
type: manual
priority: low
source: ac-delta-14, AC-59, AC-60, AC-61
automation: deferred
automation-note: Requires mixed/automated run fixture and an active CI profile; `project-for-testing` has neither. Exact runtime routing to be confirmed when fixture exists.
-->
## Relaunch ${variant} on a finished ${run_type} run routes ${routing} @unclear

## Preconditions
- A finished ${run_type} run exists with a mix of automated and manual tests where applicable
- CI profile is configured in project settings

## Steps
- Navigate to the 'Runs' page and open the extra menu on the finished ${run_type} run's row
  - _Expected_: Menu exposes ${variant}
- Click ${variant}
  - _Expected_: The relaunched run is created (or original reused) and tests route per ${routing}
- Return to the 'Runs' list and monitor the new/relaunched run
  - _Expected_:
  - Automated tests submitted to CI show an `in-progress` indicator while CI is running
  - Manual tests appear in the Manual Runner if the variant is a UI variant or a mixed routing

<!-- example -->
| variant               | run_type  | routing                                                            |
|-----------------------|-----------|--------------------------------------------------------------------|
| Relaunch Failed on CI | mixed     | Failed automated → CI; failed manual → Manual Runner               |
| Relaunch All on CI    | automated | All automated tests → CI; no Manual Runner involvement             |
| Relaunch Manually     | mixed     | All tests → Manual Runner; CI is NOT invoked                       |

---

<!-- test
type: manual
priority: low
source: AC-100
automation: deferred
automation-note: Full permission matrix for Start/Finish/Relaunch lifecycle actions is UNCLEAR in product documentation. Exact role gating to be confirmed with product; multi-role fixture required.
-->
## Role-based gating on Start / Finish / Relaunch lifecycle actions for ${role} @unclear

## Preconditions
- Project contains users in multiple roles: Owner/Manager, QA Engineer, Readonly
- Fixture: one ongoing manual run and one finished manual run in the project

## Steps
- Log in as ${role} and navigate to the 'Runs' page
  - _Expected_: Runs list loads with both fixture runs visible
- Open the extra menu on the ongoing run's row and on the finished run's row
  - _Expected_: ${expected_ongoing_actions} are available on the ongoing row; ${expected_finished_actions} are available on the finished row
- Attempt to invoke each lifecycle action available to ${role}
  - _Expected_:
  - Authorised actions complete (transition run state / open runner / open Advanced Relaunch)
  - Unauthorised actions are hidden or disabled — no 403/server-error modal is shown

<!-- example -->
| role           | expected_ongoing_actions                  | expected_finished_actions                                  |
|----------------|-------------------------------------------|------------------------------------------------------------|
| Manager/Owner  | Launch, Edit, Finish, Advanced Relaunch   | Relaunch, Advanced Relaunch, Launch a Copy                 |
| QA Engineer    | Launch, Edit, Finish, Advanced Relaunch   | Relaunch, Advanced Relaunch, Launch a Copy                 |
| Readonly       | (none; menu lacks lifecycle actions)      | (none; menu lacks lifecycle actions)                       |
