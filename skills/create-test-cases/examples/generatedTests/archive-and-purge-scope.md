---
feature: manual-tests-execution
suite: archive-and-purge
references:
  - _ac-baseline.md
  - _shared-ui.md
  - archive-and-purge-ac-delta.md
  - archive-and-purge-ui-delta.md
approved_at: 2026-04-20
cross_cutting: [C, G]
---

## In Scope

| # | Test area | AC sources |
|---|---|---|
| 1 | Single run Archive — Confirm/Cancel paths, Archived badge appears | AC-75, ac-delta-1, ac-delta-16 |
| 2 | Single run Purge — Confirm/Cancel paths, Purged badge, preserved data | AC-78, ac-delta-3, ac-delta-4, ac-delta-16 |
| 3 | Bulk Archive via multi-select on Runs list | AC-71, ac-delta-2 |
| 4 | Bulk Purge via multi-select on Runs list | AC-71, ac-delta-2 |
| 5 | Archive ongoing run → Terminated status + Pending → Skipped | AC-76, AC-80, CC-G, ac-delta-16 |
| 6 | Archive finished run → statuses preserved | AC-76, CC-G |
| 7 | Archive RunGroup cascade — nested runs archived together | AC-56, CC-C |
| 8 | Unarchive RunGroup cascade — all nested runs restored | AC-56, ac-delta-15, CC-C |
| 9 | Purge RunGroup cascade + 20k runs limit error | AC-57, ac-delta-19 |
| 10 | Runs Archive entry points (footer + top extra) | AC-77, ac-delta-5 |
| 11 | Runs Archive filter tabs (Manual / Automated / Mixed) | ac-delta-6 |
| 12 | Rungroup Structure toggle ON/OFF on Runs Archive | ac-delta-7 |
| 13 | Retention input (Purge Old Runs) happy path | AC-79, ac-delta-8 |
| 14 | Retention input validation (non-numeric / negative / empty) | ac-delta-9 |
| 15 | Unarchive single run | ac-delta-13 |
| 16 | Unarchive multi-select runs | ac-delta-14 |
| 17 | Unarchive single RunGroup | ac-delta-15, CC-C |
| 18 | Permanent delete from Archive — irreversible confirmation | AC-81, ac-delta-17 |
| 19 | Pulse "Deleted Run" tracking after permanent delete | AC-81, ac-delta-18 |
| 20 | Groups Archive sort by Name / Date ASC+DESC | ac-delta-12 |
| 21 | Groups Archive Search / Group-type filter (precondition: ≥ 2 groups) | ac-delta-10 |
| 22 | Groups Archive Finish-Range filter (precondition: ≥ 2 groups) | ac-delta-11 |
| 23 | Permissions — read-only cannot Archive/Purge/Delete; manager can | AC-100, ac-delta-20 |
| 24 | Auto-purge behavior after retention | AC-79 |
| 25 | Purge-from-ongoing-run termination behavior | AC-80 |

## Out of Scope

- Active run/group management (Relaunch, Pin, Move, Labels, Download, Export PDF, Report sharing) — owned by #6 / #7 / #8.
- Run creation flow (New Manual Run dialog, scope selectors, environment configuration) — owned by #1 / #4.
- Test execution inside Manual Runner — owned by #2.
- RunGroup creation dialog and Combined Report — owned by #5.
- Finish Run button, Continue, Relaunch variants — owned by #6.
- Full Pulse page capabilities — only "Deleted Run" event verification is in scope for AC-81.
- Broader permission matrix beyond the four destructive actions (Archive, Purge, Unarchive, Permanent delete).

## Unclear ACs

- `ac-delta-6` badge filter: UI surfaces Manual/Automated/Mixed tabs only. Dedicated Archived/Purged/Terminated filter tabs not observed. Test row 11 covers the present tabs; badge distinction is covered by ac-delta-16 tests separately. If a badge-based filter is not surfaced, no test will require it.
- `ac-delta-10 / ac-delta-11`: Groups Archive filters (Search, Group type, Finish Range) require ≥ 2 archived groups to render. Tests create the precondition and verify both render and filter correctly; if a filter is absent after precondition setup, the test fails with documented expected-vs-actual.
- `ac-delta-16` badges: Only Purged observed in current data. Tests create the required states (archive a finished run → Archived; archive an ongoing run → Terminated) to confirm badge variants exist.
- `AC-100` permissions: resolved for the four destructive actions via tests row 23. Broader permission matrix deferred.

## Sources Used

- Docs:
  - `archive-runs-and-groups.md`
  - `managing-runs.md`
  - `rungroups.md`
  - `reports.md`
- Feature artifacts:
  - `_ac-baseline.md` (AC-56, AC-57, AC-69, AC-71, AC-75–AC-81, AC-100)
  - `_shared-ui.md` (shared chrome, runs list row, filter tabs, multi-select toolbar)
  - `archive-and-purge-ac-delta.md` (20 delta ACs)
  - `archive-and-purge-ui-delta.md` (48 delta elements, 4 verified flows)
- UI exploration: 2026-04-20, ui-explorer subagent on project-for-testing.
- Destructuring map: row #10 (archive-and-purge), cross-cutting concerns C (RunGroup membership) and G (Ongoing vs Finished state).
