# Scope: manual-tests-execution / test-execution-runner

**Date:** 2026-04-18

## In Scope

### Result entry (6-7 tests)
- Apply standard status PASSED/FAILED/SKIPPED to a test — covers AC-29
- Result message editability gated by status selection — covers AC-30
- Result message text persists after navigating away and back — covers ac-delta-3
- Custom sub-status gated by standard status (disabled until standard chosen) — covers AC-31, ac-delta-21
- Custom sub-status applied attaches to standard and is reflected in status counters — covers AC-31, ac-delta-21 + cross-cutting E
- Test detail pane composition — title, (description unless checklist), steps, attachments, result message, status buttons — covers ac-delta-2

### Attachments (6 tests — `@unclear` for view/preview)
- Add an attachment via "browse" file picker — covers AC-32, ac-delta-4
- Add an attachment via drag-and-drop onto drop zone — covers AC-32, ac-delta-4
- Attachment view toggles — Large Thumb / Small Thumb / Grid / List (parameterized) — covers AC-32, ac-delta-5 — `@unclear`
- Attachment preview modes — Fit-to-width / Full-screen / close (parameterized) — covers AC-33, ac-delta-6 — `@unclear`
- Attachment delete with "Are you sure?" — confirm path — covers AC-34, ac-delta-7
- Attachment delete with "Are you sure?" — cancel path — covers AC-34, ac-delta-7

### Step-by-step markings (2 tests, `@unclear`)
- Step click cycle — single/double/triple click maps to Passed/Failed/Skipped (parameterized) — covers AC-35, ac-delta-8 — `@unclear` (requires fixture test with ≥ 2 steps)
- Step results persist after re-opening the test — covers AC-36, ac-delta-9 — `@unclear`

### Notes (4 tests)
- Create a note via header "Create notes +" — covers ac-delta-10
- Add a note to a suite via suite-row affordance — covers ac-delta-11
- Convert a note into a new test via note's "Convert to test" — covers ac-delta-12
- Bulk-create notes across multiple selected tests — covers ac-delta-13 — `@unclear`

### Detail pane / tree / filtering (6 tests)
- Runner is reachable only for an ongoing run; finished run opens Run Report — covers ac-delta-1
- Resize handle between tree and detail pane — width changes persist during session — covers ac-delta-14
- Extra options menu toggles (Refresh structure + Creation Buttons / Labels / Tags hide+show) — parameterized — covers ac-delta-16
- Priority filter limits tree to matching priority (parameterized per priority value) — covers ac-delta-17
- Filter-scoped navigation — arrow-key / next-test traversal respects active filter — covers ac-delta-18 + cross-cutting F

### Time tracking (2 tests)
- Auto-Track records elapsed time on the per-test stopwatch — covers ac-delta-19
- Set Time manual entry — user-entered duration replaces auto value — covers ac-delta-20

### Cross-cutting (4 tests)
- Checklist mode — description is hidden by default on run opening — covers AC-96, ac-delta-15 + cross-cutting D
- Checklist mode — "Toggle Description" reveals/hides description for a single test — covers AC-96, ac-delta-15 + cross-cutting D
- Per-test assignee badge visible in tree on a multi-assignee run — covers ac-delta-22 + cross-cutting B — `@unclear`
- Custom status (cross-cutting E) — custom status applied on a test is reflected in the test tree status indicator

**Estimated total:** ~30 tests.

## Out of Scope

- Run creation dialog (Title / RunGroup / Environment / Assign-to / Launch / Save / Cancel etc.) — reason: owned by sub-feature #1 run-creation
- Run lifecycle transitions — Launch, Continue, Finish-Run confirmation dialog behavior, Relaunch variants, Advanced Relaunch sidebar, Launch a Copy, Edit ongoing run — reason: owned by sub-feature #6 run-lifecycle (only Finish Run button presence is referenced here for context)
- Bulk status actions via multi-select bottom toolbar (Result message + status + Apply) — reason: owned by sub-feature #10 bulk-status-actions
- Tester-assignment UX — Assign to dropdown, Auto-Assign strategies, Multi-Select Assign to — reason: owned by sub-feature #3 tester-assignment (only the rendering of the per-test assignee badge is in scope here)
- Environment selection — "+" in env section, env groups, Launch / Launch in Sequence / Launch All — reason: owned by sub-feature #4 environment-configuration
- Runs list filters, TQL, Pin, Custom View, Move, Archive, Purge — reason: owned by #7 runs-list-management and #9 archive-and-purge
- Run Report (Basic / Extended / Defects / Download / Share / Public Share) — reason: owned by #8 run-detail-and-report
- RunGroup creation, Copy Group, Combined Report, etc. — reason: owned by #5 run-groups
- AC-97 "Fast Forward" as a separate control — reason: UI exploration confirmed no separate control exists; Fast Forward = Auto-Track

## Unclear ACs

- **AC-97** — resolved: no separate "Fast Forward" control exists in the runner; the only stopwatch affordance is Auto-Track (header toggle) + per-test Track / Set Time. Closed — not generating a dedicated test.
- **ac-delta-5, ac-delta-6 (attachment view toggles + preview modes)** — kept in scope with `@unclear`; locators will be confirmed during automation once a fixture file is uploaded.
- **ac-delta-8, ac-delta-9 (step-by-step click cycle + persistence)** — kept in scope with `@unclear`; requires a fixture test case with ≥ 2 defined steps in `project-for-testing` (current project's tests have no steps).
- **ac-delta-13 (bulk note creation)** — kept in scope with `@unclear`; depends on multi-select entry path not exercised during exploration.
- **ac-delta-22 (per-test assignee badge)** — kept in scope with `@unclear`; requires a multi-assignee run; badge rendering was inferred from tree structure but not visually confirmed in a fresh exploration.
- **ac-delta-18 (filter-scoped navigation)** — kept in scope; structurally plausible (filter is global to the tree), behavior to be confirmed during test execution.

## Sources Used

- `_ac-baseline.md` — 96 feature ACs; 10 baseline ACs applicable here (AC-29..AC-36, AC-96, AC-97).
- `test-execution-runner-ac-delta.md` — 22 delta ACs (ac-delta-1..22); ac-delta-16 refined to four observed toggles after UI exploration.
- `destructuring.md` — A2 row #2 (Owns / Does-not-own / Key elements) + cross-cutting concerns B/D/E/F.
- `_shared-ui.md` — shared dashboard/runs/chrome UI catalog.
- `test-execution-runner-ui-delta.md` — 52 delta UI elements, 5 verified flows, 3 documented gaps.
- `_style.md` — feature-level style carryover from `run-creation`.
- UI exploration session — `project-for-testing` at `https://app.testomat.io`, 2026-04-18.
