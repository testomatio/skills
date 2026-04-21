---
feature: manual-tests-execution
suite: runs-list-management
references:
  - _ac-baseline.md
  - _shared-ui.md
  - runs-list-management-ac-delta.md
  - runs-list-management-ui-delta.md
coverage_depth: regression
approved_at: 2026-04-19
---

# Scope Contract — runs-list-management

## In Scope

### Baseline AC coverage (list-level entry-point + list-level semantics)
- **AC-52** — Move a run into a RunGroup via row extra menu → "Move" → destination → "Move" (list-level entry; destination container owned by #5).
- **AC-68** — Filter tabs: Manual, Automated, Mixed, Unfinished, Groups.
- **AC-69** — Row "…" extra menu items presence (Relaunch, Launch a Copy, Advanced Relaunch, Copy, Pin, Move, Labels, Archive, Purge, Export as PDF, Download) — entry-point presence; downstream action flows owned elsewhere.
- **AC-70** — Pin a Run or RunGroup; pinned rows sort to top.
- **AC-71** — Multi-select bulk actions: Select all, Archive, Labels, Compare, Extra (Link, Download, Merge, Move), Purge.
- **AC-72** — TQL Query Language Editor: variables, operators, examples.
- **AC-73** — URL share of filter state (Runs page).
- **AC-74** — Custom view Settings — columns and widths.
- **AC-77** — Archive entry links at bottom of Runs page.
- **AC-87** — Download as Spreadsheet (XLSX) entry points: row menu + multi-select Extra (destination owned by #8).
- **AC-88** — Export as PDF entry point on row menu (destination owned by #8).
- **AC-92** — Compare entry via Multi-select (destination owned by #8).

### Delta ACs (all 17)
- ac-delta-1: Chart Hide/Show toggle.
- ac-delta-2: Chart legend Passed/Failed/Skipped toggle.
- ac-delta-3: Breadcrumb run-count badge.
- ac-delta-4: Runs Status Report AI enabled/disabled threshold.
- ac-delta-5: State-aware row extra menu (finished/in-progress/archived/RunGroup).
- ac-delta-6: Pin indicator + reposition + unpin reverses; toast "Run has been pinned".
- ac-delta-7: Multi-select toggle lifecycle (checkboxes + bottom toolbar).
- ac-delta-8: Compare enabled only with ≥ 2 selected.
- ac-delta-9: Bulk Labels applies across selection.
- ac-delta-10: Custom view column visibility + widths persist across reload.
- ac-delta-11: Default view ↔ Custom view toggle + label flip.
- ac-delta-12: Pagination («, »).
- ac-delta-13: Groups tab in-place expansion.
- ac-delta-14: Toolbar Expand button toggles all groups.
- ac-delta-15: TQL Apply / Save / Cancel; Save disabled until typed; Saved Queries + Examples; autocomplete checkbox; Operators + Variables sidebar.
- ac-delta-16: Invalid TQL error vs valid TQL filter + URL reflection.
- ac-delta-17: "Runs Archive" / "Groups Archive" entry links with counts.

### Cross-cutting must-tests (destructuring.md)
- **Concern A (Multi-environment):** list rendering of multi-env runs (Tags & Envs column in Custom view; separate rows for Launch in Sequence / Launch All modes).
- **Concern C (RunGroup membership):** Move-to-group (AC-52) + Groups tab listing + nested-run display.
- **Concern E (Custom statuses):** TQL `has_custom_status` filtering.
- **Concern H (Bulk multi-select):** end-to-end bulk Archive (or Labels) via runs-list multi-select.

## Out of Scope

- End-to-end Relaunch / Advanced Relaunch / Launch a Copy behaviour (#6 run-lifecycle) — verify list-entry navigation only.
- Archive / Purge downstream semantics (#9 archive-and-purge) — verify entry + toast only.
- Download XLSX file contents, PDF rendering, Compare-view contents (#8 run-detail-and-report) — verify entry + navigation only.
- RunGroup creation via chevron (#1 run-creation / #5 run-groups).
- RunGroup / Combined reports (#5 run-groups).
- Creating a new run via Manual Run button (#1 run-creation).
- Archive pages themselves (#9 archive-and-purge) — verify the entry-link navigation only.

## Unclear ACs

- AC-99 baseline "Copy Link" on row extra menu — not clearly surfaced in the delta UI catalog; tag `@unclear` if touched during generation, and document in-body.
- "Merge" action in Multi-select Extra menu — list-level action present; destination / merge semantics ambiguous → tag `@unclear` for scenarios that depend on outcome.
- Pagination page-size configurability — control presence confirmed, boundary behaviour TBD.
- AC-100 baseline (permission matrix) — not exercised here; permission-specific tests deferred.

## Sources Used

- `_ac-baseline.md` (AC-1 … AC-100)
- `_shared-ui.md` (Runs List Page, TQL Modal, Row Detail panel — shared surfaces)
- `runs-list-management-ac-delta.md` (delta + applicable baseline)
- `runs-list-management-ui-delta.md` (52 delta elements, 7 verified flows)
- `destructuring.md` sub-feature row for runs-list-management + cross-cutting concerns A, C, E, H
- `intake.md` Q2 = regression

## Suite shape hint (non-binding — finalized in Step 3 Phase 1)

- filter-tabs-and-view
- row-extra-menu
- multi-select
- tql-query-editor
- chart-and-toolbar
- cross-cutting
