---
feature: manual-tests-execution
suite: tester-assignment
references: _ac-baseline.md
baseline_acs_applicable: [AC-37, AC-38, AC-39, AC-40, AC-41, AC-42, AC-43, AC-100]
delta_ac_count: 13
source: mixed
---

## Baseline ACs applicable to tester-assignment

- AC-37 (baseline) — By default only the run creator is assigned to a run.
- AC-38 (baseline) — User can add testers via the "Assign to" selector in the New Manual Run dialog (before launch) or via the Edit panel on an ongoing run.
- AC-39 (baseline) — Auto-Assign Users strategies: None, Prefer test assignee, Randomly distribute tests between team members.
- AC-40 (baseline) — The "Randomly distribute" strategy never assigns the manager role to any test.
- AC-41 (baseline) — Users must be assigned to the run before they can be assigned to individual tests or suites.
- AC-42 (baseline) — User can assign a user to a suite/folder via the suite's "Assign to" icon inside an ongoing run.
- AC-43 (baseline) — User can assign a user to individual tests only via Multi-Select + "Assign to" bottom button, confirmed by OK in a "Are you sure…" popup.
- AC-100 (baseline, UNCLEAR) — permission matrix (who may Assign; impact of readonly vs qa vs manager roles). Covered only where product wording is explicit; remainder documented as `@unclear`.

## Cross-cutting concerns attached

- **B. Multi-user assignment** — OWNED by tester-assignment. Must-test scenarios (from destructuring.md): ownership means this suite provides the canonical multi-user assignment tests; sibling suites (#2, #8) only consume a pre-assigned state.
- **H. Bulk multi-select mode** — "Affects" tester-assignment. destructuring.md demands: "#3 needs a bulk assign test" (covered in A3 via ac-delta-9 + ac-delta-10).

## Delta ACs (sub-feature-specific)

ac-delta-1: The creator of a run is listed in the Assignee section as a user chip with an `as manager` label before any other user is added; this chip cannot be removed from the creation dialog.

ac-delta-2: The "Assign more users" link in the New Manual Run sidebar opens an Assignee panel showing (a) an `Assign users` multi-select populated from project membership, and (b) an `Auto-Assign Users` strategy selector with options `None`, `Prefer test assignee`, `Randomly distribute tests between team members`.

ac-delta-3: The Auto-Assign Users strategy selector defaults to `None`; switching strategies does not commit users to tests until the run is launched.

ac-delta-4: With strategy `Prefer test assignee`, tests whose pre-set assignee is one of the run's assigned users are given to that user; tests without a pre-set assignee fall back to unassigned (or to the manager, per UI confirmation).

ac-delta-5: With strategy `Randomly distribute tests between team members`, every non-manager assigned user receives a share of the run's tests; the distribution is deterministic-at-launch (no re-shuffle on page refresh).

ac-delta-6: Removing an assigned user from the run (via the Assignee panel or the Edit run page `Remove assign users`) removes the user from all tests/suites they were assigned to within the run; a confirmation is required when the user has already recorded results.

ac-delta-7: The Edit-run page exposes the same `Assign users` multi-select and `Remove assign users` control for an ongoing run; assignment changes are reflected inside the Manual Runner without a full reload.

ac-delta-8: Inside the Manual Runner, a suite row exposes an "Assign to" affordance that lists ONLY users already assigned to the run (AC-41 constraint); attempting to assign a non-run user is not possible from this control.

ac-delta-9: Inside the Manual Runner, the Multi-Select bottom toolbar exposes an "Assign to" button; choosing it opens a user dropdown limited to run-assigned users and an OK confirmation dialog worded "Are you sure you want to assign …".

ac-delta-10: Bulk "Assign to" applies the chosen user to every selected test in a single operation; the per-test assignee column (or tooltip) updates immediately after OK. When a filter is active in the runner, only tests matching the filter are affected (cross-cutting F constraint).

ac-delta-11: The Auto-Assign Users `Randomly distribute` strategy skips any assigned user whose role is manager in the project; when the ONLY assigned user is a manager, no tests are auto-assigned and the run's assignee column shows an empty/"—" state per test (not an error).

ac-delta-12: A run's assignee state is observable from at least two read-only surfaces — the Runs list `Assigned to` column and the Extended Run Report `Assignees` overview; this suite verifies the write path end-to-end, while the report-side rendering is owned by run-detail-and-report (#8).

ac-delta-13: In addition to the Multi-Select bulk path (AC-43), an individual test can be reassigned via the Manual Runner's detail panel Assignee chip — a single click opens a dropdown limited to run-assigned users + `Unassigned`, and selecting a user applies the change immediately WITHOUT a confirmation dialog. The Edit-page `Select All` convenience button (not covered in AC-38) bulk-adds every project member to the run's Assign users multi-select without confirmation.

## UNCLEAR entries

- `ac-delta-4` fallback behavior when a test has no pre-set assignee: docs do not specify whether it falls to the manager or remains unassigned — mark tests for this path with `@unclear` and document to confirm via UI.
- `ac-delta-6` confirmation dialog copy for removing a user with recorded results — exact wording to be captured during UI exploration.
- AC-100 permission matrix — partial coverage only; non-readonly/qa paths covered directly, readonly attempt documented via `@unclear` + `@needs-project-setting` tag.
