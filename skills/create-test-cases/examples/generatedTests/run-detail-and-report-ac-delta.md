---
feature: manual-tests-execution
suite: run-detail-and-report
references: _ac-baseline.md
baseline_acs_applicable: [AC-82, AC-83, AC-84, AC-85, AC-86, AC-87, AC-88, AC-89, AC-90, AC-91, AC-92, AC-98, AC-99]
delta_ac_count: 22
source: mixed
---

## Baseline ACs applicable to run-detail-and-report

- AC-82 (baseline) — Clicking a Run opens the Basic Run Report with tests list, statuses (Passed, Failed, Skipped, Pending, Custom), and overall Run summary.
- AC-83 (baseline) — Run Report exposes tabs/sections: Tests, Statistics, Defects.
- AC-84 (baseline) — Test sub-panel (inside Run Report) exposes tabs: Summary, Description, Code Template, Runs.
- AC-85 (baseline) — Tests can be sorted by suite/name/failure status and filtered by status, type, messages, custom statuses, assignees.
- AC-86 (baseline) — Extended Run Report shows grouped overview (suites/tags/labels/assignees/priorities), Run Report Summary, Flaky Tests Analytics (when applicable); ↑/↓ keyboard navigation between tests.
- AC-87 (baseline) — Download run(s) as Spreadsheet (XLSX) via Extra menu → Download (owned here for the report-level entry point; runs-list multi-run Download is entry-pointed from #8 runs-list-management).
- AC-88 (baseline) — Export run as PDF via Extra menu → Export as PDF (report-level entry point).
- AC-89 (baseline) — Share Report by Email from Extended view; comma-separated emails supported.
- AC-90 (baseline) — Share Report Publicly from Extended view (requires Company + Project "Sharing" enabled); dialog has Expiration (default 7 days) and "Protect by passcode" toggle (ON by default).
- AC-91 (baseline) — Public Share generates a URL and Passcode (shown once); "Stop Sharing" revokes access at any time.
- AC-92 (baseline) — Compare multiple selected runs via Multi-select → Compare (destination page owned here; entry point is also exposed from #8 runs-list-management).
- AC-98 (baseline/UNCLEAR) — Defects tab behaviour inside run detail; this sub-feature exercises the tab and captures real behaviour (resolve UNCLEAR).
- AC-99 (baseline/UNCLEAR) — "Copy Link" / non-public share action on Run Report extra menu; this sub-feature verifies presence or absence (resolve UNCLEAR).

## Delta ACs (sub-feature-specific)

ac-delta-1: The Run Detail page header shows the run title, status chip (In-Progress / Finished / Terminated), created-by + created-at, environment chips (one per env when multi-env), and quick counters for Passed / Failed / Skipped / Pending / Custom.
ac-delta-2: The Tests tab lists tests grouped by suite; each row shows status icon, test title, duration, assignee avatar (when assigned), and any custom-status badge.
ac-delta-3: Clicking a test row opens the test sub-panel on the right; the panel persists across tests until explicitly closed, and the selected row stays visually highlighted.
ac-delta-4: The Summary sub-tab shows last result status, message (when present), attachments thumbnails (when present), and step-by-step results (when recorded); empty states render with neutral placeholder text, not an error.
ac-delta-5: The Description sub-tab renders the test description markdown; read-only inside the Run Report.
ac-delta-6: The Code Template sub-tab shows the test's automation template/code (when the test has a code template attached); empty state for manual-only tests.
ac-delta-7: The Runs sub-tab lists all prior runs of this test, each row clickable to navigate to that run's report for the same test.
ac-delta-8: The Statistics tab shows aggregate counts and percentage split of statuses for the run, plus duration totals; re-renders when filters are applied from the Tests tab.
ac-delta-9: The Defects tab lists tests that have linked issues/defects; each row links to the defect tracker (Jira/GitHub) when a link is configured; empty state renders when no defects are linked.
ac-delta-10: The Extended Run Report "Grouped overview" mode offers multiple grouping dimensions (Suites / Tags / Labels / Assignees / Priorities); switching dimensions re-renders the list without reloading the page.
ac-delta-11: Flaky Tests Analytics section appears in Extended Run Report only when the run contains tests with flaky history (≥ 2 prior runs with status changes); otherwise the section is hidden.
ac-delta-12: The Tests tab supports a free-text search over test title and result message; the search input filters the list in real time and persists until cleared.
ac-delta-13: Filter chips (status / type / messages / custom-status / assignee) combine with AND semantics; the chip count badge on the filter button reflects active filters.
ac-delta-14: Keyboard navigation ↑ / ↓ moves selection between tests in the list; Enter opens the focused test's sub-panel; Esc closes the sub-panel.
ac-delta-15: Sort order controls expose ASC/DESC toggles for Suite, Name, and Failure-first; sort state persists within the session.
ac-delta-16: Download as Spreadsheet produces an XLSX file named after the run (e.g., `Run-{id}.xlsx`); file contains one row per test with status, duration, message, assignee columns.
ac-delta-17: Export as PDF produces a PDF that mirrors the current view (Basic or Extended) including the Run Report Summary and the currently applied filters.
ac-delta-18: Share Report by Email accepts a comma-separated list; invalid email formats are rejected with an inline error; a success toast confirms send.
ac-delta-19: Share Report Publicly dialog shows Expiration selector (values e.g., 1 day / 7 days / 30 days / custom) with default 7 days, and "Protect by passcode" toggle defaulting to ON; generated URL + passcode are shown once and can be copied to clipboard.
ac-delta-20: "Stop Sharing" action immediately revokes the public URL; subsequent attempts to load the public URL return a revoked/expired state instead of the report.
ac-delta-21: Compare view (entered via Multi-select → Compare on the Runs list or via the report's Compare button) shows a side-by-side matrix of test statuses across selected runs; rows where statuses differ are highlighted.
ac-delta-22: Custom view Settings on the report (separate from runs-list Custom view) lets the user toggle columns (Duration, Assignee, Labels, Tags, Envs, Custom Status, etc.); width / visibility persists per-project per-user.

## Cross-cutting ACs (from destructuring.md)

- Concern A (Multi-environment): run report shows per-environment breakdown — when the run was created with ≥ 2 environment groups, the report surfaces an Environment column/filter, and the Statistics tab rolls up per-environment counts. Must-test: a multi-env run rendered in the report.
- Concern B (Multi-user assignment): the Tests tab filter/group by Assignee + Extended Report "Grouped overview: Assignees" surface multi-user runs correctly. Must-test: filter + group by assignee on a run with ≥ 2 testers.
- Concern E (Custom statuses): a test with a custom status set during execution must be visible/filterable via the custom-status filter chip in the Tests tab; Extended Report reflects the custom status in its grouping/summary. Must-test: filter by custom status shows only matching tests.

## UNCLEAR (to resolve during UI exploration in 2.2)

- AC-98 — Defects tab: verify whether it lists linked issues, whether it supports adding/removing a defect link here or only read-only, and what the empty state looks like.
- AC-99 — Copy Link: verify whether a non-public "Copy Link" action exists on the Run Report extra menu; capture behaviour (copies app URL to clipboard?).
- AC-100 — Permission matrix for Share Publicly (which role can enable it, whether Company-level "Sharing" feature gate actually blocks the action in UI when disabled). Optional — defer to out-of-scope unless surfaced during exploration.
