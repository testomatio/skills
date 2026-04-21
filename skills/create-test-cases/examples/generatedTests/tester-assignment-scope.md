---
feature: manual-tests-execution
suite: tester-assignment
references: [_ac-baseline.md, tester-assignment-ac-delta.md, _shared-ui.md, tester-assignment-ui-delta.md, destructuring.md]
baseline_acs_applicable: [AC-37, AC-38, AC-39, AC-40, AC-41, AC-42, AC-43, AC-100]
delta_acs: [ac-delta-1, ac-delta-2, ac-delta-3, ac-delta-4, ac-delta-5, ac-delta-6, ac-delta-7, ac-delta-8, ac-delta-9, ac-delta-10, ac-delta-11, ac-delta-12, ac-delta-13]
cross_cutting: [B, H]
coverage_depth: regression
structure: nested
approved_at: 2026-04-18
---

## In Scope

### 1. creation-dialog-assignment (Assignee panel in New Manual Run sidebar)
- Creator chip rendered with `as manager` label; chip is non-removable from the sidebar (AC-37, ac-delta-1)
- "Assign more users" link expands the Assignee panel inline below the creator chip (ac-delta-2)
- Adding a project member via the `Assign users` multi-select renders a chip + reveals the `Auto-Assign: none` button (ac-delta-2, ac-delta-3 visibility)
- Removing an added user via the chip `×` before Launch clears it; unsaved until Launch/Save
- Launch propagates the selected assignees to the new run; Runs list `Assigned to` column renders them

### 2. auto-assign-strategies
- Auto-Assign selector ONLY appears after ≥1 user is added to the multi-select (ac-delta-3 visibility)
- `None` is default; launching with `None` assigns nobody to tests (AC-39)
- `Prefer test assignee` — tests with a pre-set assignee go to that user (AC-39, ac-delta-4 happy path); fallback for tests without a pre-set assignee is `@unclear` (ac-delta-4 gap)
- `Randomly distribute tests between team members` — every non-manager assignee receives a share of tests; distribution is deterministic after Launch (does not re-shuffle on refresh) (AC-39, ac-delta-5)
- `Randomly distribute` with a single non-manager user gives all tests to that user (AC-40, ac-delta-11)
- `Randomly distribute` with ONLY a manager assigned → no tests get auto-assigned; no error (AC-40, ac-delta-11)
- Switching strategies before Launch does not commit; nothing is persisted until Launch (ac-delta-3)

### 3. edit-run-assignment (Edit Run page, ongoing run)
- Adding users via the `Assign users` multi-select on `/runs/edit/{id}/`; Save propagates change to the ongoing Manual Runner without a full reload (AC-38, ac-delta-7)
- Per-chip `×` removes a single user immediately; unsaved until Save (ac-delta-7)
- `Select All` convenience button adds every project member at once; no confirmation (ac-delta-13 half)
- `Remove assign users` clears all non-manager chips; no confirmation, no toast when no results recorded (ac-delta-6 no-results branch)
- Removing a user who has recorded results — documented behavior `@unclear` (ac-delta-6 with-results branch)
- Manager chip at top of Edit page is non-removable (AC-37, ac-delta-1)

### 4. runner-assignment-paths (Manual Runner)
- Per-suite `Assign to` dropdown lists ONLY run-assigned users + `Unassigned` (AC-41, AC-42, ac-delta-8); applies on single click, no confirmation
- Multi-Select bulk `Assign to` bottom-toolbar button opens dropdown of run-assigned users; selecting triggers native browser confirm `"Are you sure you want to assign {name} to all selected tests?"` (AC-43, ac-delta-9)
- OK in confirm propagates assignment to every selected test; Cancel leaves them unchanged (AC-43, ac-delta-10)
- Per-test detail-panel Assignee chip applies on single click WITHOUT confirmation — distinct path from AC-43; limited to run-assigned users (ac-delta-13)
- Per-test tree-row assignee indicator reflects current state; cleared row means unassigned
- Run header avatar stack shows all run-assigned users (observational; drives visual verification)

### 5. cross-cutting
- **Concern B (multi-user assignment):** one test verifies the end-to-end write path from multi-user creation → runner per-test chips. Report-side filtering/overview handed off to #8
- **Concern H (bulk multi-select mode):** one test verifies that with a filter applied in the runner, bulk `Assign to` via Multi-Select targets ONLY the filtered tests (cross-ref Concern F in destructuring.md)
- **AC-100 permission probe:** qa-role user can successfully assign (positive); readonly attempts are documented `@unclear` + `@needs-project-setting`

## Out of Scope

- **Project user list management** — owned by project-membership surface, not this suite.
- **Project-level role assignment (manager / qa / readonly)** — owned by Project Settings / membership.
- **Full Edit-run metadata form** (Title, Environment, Description, +Tests / +Plans buttons, trash delete) — owned by `#6 run-lifecycle`.
- **Report-side rendering of assignees:** Extended Run Report "Assignees" overview grouping, filter-by-assignee, per-assignee analytics — owned by `#8 run-detail-and-report`. Only the presence side-effect on Runs list `Assigned to` column is verified here.
- **Bulk result-message / status actions in runner** (everything in the Multi-Select toolbar EXCEPT `Assign to`) — owned by `#10 bulk-status-actions`.
- **Runs list Multi-Select bulk actions** (Archive, Labels, Compare, Move, Purge, etc.) — owned by `#7 runs-list-management`.
- **TQL `has_assigned_to` filter** on the Runs list — owned by `#7 runs-list-management`.

## Unclear ACs

- **AC-100** — complete permission matrix (who may Assign; impact of readonly vs qa vs manager). Only positive qa + implicit manager paths are covered directly; readonly attempt documented as `@unclear`/`@needs-project-setting`.
- **ac-delta-4 fallback** — "Prefer test assignee" behavior when a test has no pre-set assignee (manager pickup vs unassigned). Flagged `@unclear` in test body.
- **ac-delta-6 with-results confirmation** — exact dialog copy when removing a user who has recorded results. Flagged `@unclear` in test body; test still authored so the path is captured once wording is confirmed.

## Sources Used

- `_ac-baseline.md` — 8 applicable baseline ACs (AC-37 through AC-43, AC-100)
- `tester-assignment-ac-delta.md` — 13 delta ACs (ac-delta-1 through ac-delta-13)
- `_shared-ui.md` — Assignee Section, Edit Run Page, Manual Runner chrome already cataloged; referenced (not duplicated)
- `tester-assignment-ui-delta.md` — 28 delta UI elements across 6 screens, 4 verified flows, 2 open gaps
- `destructuring.md` — sub-feature #3 ownership row, cross-cutting concerns B (multi-user assignment, OWNED) and H (bulk multi-select mode, AFFECTS)
- `_style.md` — carryover from run-creation (suite framing, frontmatter, parameterization, step rules)
