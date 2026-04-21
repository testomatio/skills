---
feature: manual-tests-execution
suite: run-detail-and-report
ac_delta_ref: run-detail-and-report-ac-delta.md
ui_delta_ref: run-detail-and-report-ui-delta.md
coverage_shape: regression
---

# Scope: Run Detail and Report

## Baseline ACs applicable

AC-82, AC-83, AC-84, AC-85, AC-86, AC-87, AC-88, AC-89, AC-90, AC-91, AC-92, AC-98, AC-99

## Delta ACs

ac-delta-1 … ac-delta-22 (see `run-detail-and-report-ac-delta.md`)

## Unclear ACs

- **AC-98 Defects tab** — resolved during exploration: tab is read-only in run context; shows linked defects (empty state links to settings for configuring an issue tracker). Defect linking is NOT performed from this tab.
- **AC-99 Copy Link** — resolved: a standalone `Copy Link` button is present in the report header (not in extra menu). Always visible.
- **AC-100 Permission matrix for Public Share** — deferred out-of-scope (requires multi-role fixtures; Sharing gate is a Company + Project setting toggled outside this flow).

## In Scope (tests to generate)

Organized by natural section (7 logical sections, each ≥ 3 tests → NESTED required by Rule 8).

### Section A — Basic Run Detail navigation & header
1. Open Run Detail by clicking a finished run from the Runs list → lands on `/runs/{id}` with Tests tab active (AC-82, ac-delta-1).
2. Header surfaces: title, status chip, created-by/at meta, counters (Passed/Failed/Skipped/Pending), environment chips when multi-env (ac-delta-1, Concern A).
3. Tabs Tests / Statistics / Defects are visible and clickable; active tab underline reflects current selection (AC-83).
4. Switching between Tests → Statistics → Defects → Tests preserves previously-selected test and filters (AC-83).
5. Navigate back to Runs list via breadcrumb returns to the prior filter state (URL round-trip).
6. Open Run Detail from an Unfinished run — Continue / Finish affordances visible per run-lifecycle (scope check: we do NOT assert their behaviour — only that they coexist with the Detail panel).

### Section B — Tests tab: list, sort, search, filter
1. Tests list groups rows by suite; row shows status icon, title, duration (ac-delta-2).
2. Sort by Suite / Name / Failure — ASC/DESC toggle works; order updates in place (ac-delta-15).
3. Search input filters the list in real-time by title or message (ac-delta-12).
4. Filter chip button opens filter panel; applying a status filter reduces the list; multiple chips combine with AND (ac-delta-13).
5. Clear a single filter chip restores its slice; Clear all restores the full list.
6. Keyboard ↑/↓ moves test selection; Enter opens sub-panel; Esc closes (ac-delta-14).
7. Empty search ("no match") renders neutral empty-state message (not an error).
8. Filter by Assignee on a multi-assignee run → only tests for that assignee remain (Concern B).
9. Filter by Custom Status → only tests with that custom status remain (Concern E).

### Section C — Test sub-panel (right pane)
1. Click a test row → sub-panel opens on the right, row is highlighted, URL updates to include the test id (ac-delta-3).
2. Sub-panel shows tabs Summary / Description / Code Template / Runs (AC-84).
3. Summary tab shows status, message, attachments (when present), step-by-step results (when present) (ac-delta-4).
4. Description tab renders the test description markdown, read-only (ac-delta-5).
5. Code Template tab shows attached code template (with copy button); empty state for manual-only test (ac-delta-6).
6. Runs tab lists this test's prior runs; each row links to that run's report for the same test (ac-delta-7).
7. Selecting another test swaps the sub-panel content but keeps the panel open (ac-delta-3).
8. Close sub-panel via Esc returns to full-width Tests list (ac-delta-14).

### Section D — Statistics & Defects tabs
1. Statistics tab shows per-status counts and percentages that sum to total tests (ac-delta-8).
2. Applying a Tests-tab filter, then opening Statistics — counts reflect the filtered subset (ac-delta-8).
3. Statistics tab on a multi-environment run shows per-environment breakdown (Concern A).
4. Defects tab empty state: "No defects found…" with a link to Settings to configure issue tracker (ac-delta-9, AC-98).
5. Defects tab with a linked defect: row shows defect title + external link to tracker (ac-delta-9, AC-98).

### Section E — Report page Overview, grouping, analytics (the "Extended" view)
1. Report page `/runs/{id}/report/` shows Summary + Overview panel alongside the test list (ac-delta-10 reality — single combined view).
2. Overview grouping selectors Suites / Tags / Labels / Assignees / Priorities switch dimension and re-render grouped list without page reload (ac-delta-10).
3. Grouping by Assignees on a multi-assignee run buckets tests under each assignee (Concern B).
4. Analytics / Flaky Tests section hidden when no flaky data; appears when run contains tests with ≥ 2 prior runs of differing status (ac-delta-11).
5. Keyboard ↑/↓ / Enter / Esc works on the Report page as on Run Detail (ac-delta-14, AC-86).

### Section F — Exports, Share, Copy Link
1. Extra menu → Download as Spreadsheet triggers an XLSX download (verify download event is triggered; filename contains run id) (AC-87, ac-delta-16).
2. Extra menu → Export as PDF triggers a PDF download (AC-88, ac-delta-17).
3. Extra menu → Share Report by Email — dialog requires at least one email; comma-separated accepted; invalid format inline error; valid send shows success toast (AC-89, ac-delta-18).
4. Extra menu → Share Report Publicly → Make Public Report dialog shows Expiration (default +7 days) and "Protect by passcode" ON by default; Share creates URL + Passcode shown once (AC-90, AC-91, ac-delta-19).
5. Stop Sharing revokes the public URL; revoked URL does NOT load the report (AC-91, ac-delta-20).
6. Copy Link button in report header copies the report URL to clipboard; toast confirmation (AC-99).
7. Custom view Settings toggles Duration / Assignee / Labels / Tags / Envs columns on the report; selection persists on reload (ac-delta-22).

### Section G — Compare runs
1. From Runs list select ≥ 2 finished runs → Multi-select → Compare → navigates to `/runs/compare?ids=…` (AC-92).
2. Compare matrix shows per-run columns and per-test status cells (ac-delta-21).
3. Rows where statuses differ across runs are visually highlighted (ac-delta-21).
4. Compare with only 1 run selected — Compare action is disabled in the Multi-select toolbar (negative case; entry-point validation only — owner is #8 runs-list-management).
5. Compare with 3 runs across different environments / assignees renders correctly (Concern A + B cross-check on the comparison view).

## Out of Scope (with justification)

- **Creating / finishing / archiving runs** — owned by run-creation, run-lifecycle, archive-and-purge. Precondition only (use existing finished run from earlier suites).
- **Runs list filters, chart, TQL, Pin, Custom view on the list** — owned by runs-list-management. We only traverse the list to reach a run.
- **Relaunch / Continue / Finish / Advanced Relaunch / Launch a Copy** — owned by run-lifecycle.
- **Assigning users to runs / tests** — owned by tester-assignment. We only consume an already-assigned run for Concern B tests.
- **Custom status CONFIGURATION** (Settings → Statuses) — owned elsewhere. We only consume a pre-configured custom status.
- **Multi-run Download from Runs list** — entry point owned by runs-list-management; the download destination behaviour is here but AC-87 multi-run case is exercised by that sub-feature.
- **Pulse "Deleted Run" tracking** — owned by archive-and-purge.
- **AC-100 full permission matrix** — deferred; requires multi-role fixtures and Company-level Sharing toggle; out of scope for this suite.

## Cross-cutting coverage

- **Concern A (Multi-environment):** Section A test 2 (env chips in header), Section D test 3 (Statistics per-env), Section G test 5 (Compare across envs).
- **Concern B (Multi-user assignment):** Section B test 8 (Assignee filter), Section E test 3 (Group by Assignees), Section G test 5 (Compare across assignees).
- **Concern E (Custom statuses):** Section B test 9 (Custom status filter). Additional: a Section D or E test can surface custom-status count in Statistics (will be folded into B-9 via assertion or added as an E-3 companion during generation).

## Coverage shape (Q2 = regression)

- Happy paths (viewing, filtering, exporting) present across all sections.
- Negatives: invalid email format (F-3), revoked public URL (F-5), Compare with 1 run (G-4), empty-search empty-state (B-7).
- Boundary: Expiration default (F-4), Passcode default ON (F-4), 0 defects empty state (D-4).
- State transitions: Unfinished-run Detail (A-6), public share lifecycle (F-4 → F-5), grouping re-render (E-2).
- Role combos: deferred (AC-100 out of scope).

## Test structure

**NESTED** (Rule 8 — 7 natural sections, each ≥ 3 tests):

```
run-detail-and-report/
  navigation-and-header.md       # Section A (6 tests)
  tests-tab.md                   # Section B (9 tests)
  test-sub-panel.md              # Section C (8 tests)
  statistics-and-defects.md      # Section D (5 tests)
  report-overview.md             # Section E (5 tests)
  exports-and-sharing.md         # Section F (7 tests)
  compare-runs.md                # Section G (5 tests)
```

Estimated total: **45 tests** (driven by AC coverage + balance, not a cap).

## Sources Used

- `_ac-baseline.md` (96 baseline ACs; 13 applicable)
- `run-detail-and-report-ac-delta.md` (22 delta ACs)
- `_shared-ui.md` (shared navigation, toasts, dialogs)
- `run-detail-and-report-ui-delta.md` (74 delta elements, 7 verified flows, 2 documented gaps)
- `destructuring.md` sub-feature #8 row + cross-cutting concerns A, B, E
