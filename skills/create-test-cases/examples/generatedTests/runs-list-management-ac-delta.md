---
feature: manual-tests-execution
suite: runs-list-management
references: _ac-baseline.md
baseline_acs_applicable: [AC-52, AC-68, AC-69, AC-70, AC-71, AC-72, AC-73, AC-74, AC-77, AC-87, AC-88, AC-92]
delta_ac_count: 17
source: mixed
---

## Baseline ACs applicable to runs-list-management

- AC-52 (baseline) — Move a run into a RunGroup via row extra menu → "Move" → destination → "Move". List-level entry point is owned here; destination container semantics are owned by #5 run-groups.
- AC-68 (baseline) — Filter tabs: Manual, Automated, Mixed, Unfinished, Groups.
- AC-69 (baseline) — Row "…" extra menu: Relaunch / Launch a Copy / Advanced Relaunch / Copy / Pin / Move / Labels / Archive / Purge / Export as PDF / Download. List-level entry-point presence is owned here; the downstream flow for each action is owned by #6 (lifecycle variants), #9 (archive/purge), #8 (download/PDF).
- AC-70 (baseline) — Pin a Run or RunGroup; pinned items appear at top.
- AC-71 (baseline) — Multi-select exposes bulk actions: Select all, Archive, Labels, Compare, Extra (Link, Download, Merge, Move), Purge.
- AC-72 (baseline) — TQL Query Language Editor: variables (rungroup, env, passed_count, finished_at, has_test_label, has_custom_status, etc.), operators, examples.
- AC-73 (baseline) — Filter state is shareable via URL (Runs page + Runs Archive page).
- AC-74 (baseline) — Custom view Settings lets the user customize columns and widths.
- AC-77 (baseline) — Archive access entry point at the bottom of the Runs page ("Runs Archive" / "Groups Archive" links); pages themselves owned by #9.
- AC-87 (baseline) — Download as Spreadsheet (XLSX) entry points: row extra menu + multi-select Extra → Download. Downstream file owned by #8.
- AC-88 (baseline) — Export as PDF entry point on row extra menu. Downstream owned by #8.
- AC-92 (baseline) — Compare via Multi-select → Compare. Destination comparison page owned by #8.

## Delta ACs (sub-feature-specific)

ac-delta-1: The chart area above the Runs list exposes a Hide chart / Show chart toggle; when hidden, the chart container collapses and the toggle label flips.
ac-delta-2: Legend items in the chart (Passed / Failed / Skipped) act as filter toggles — clicking a legend entry toggles its dataset visibility in the chart; state is cursor-pointer cued.
ac-delta-3: The breadcrumb area shows a run count badge reflecting the total number of runs visible given the active tab/filter combination.
ac-delta-4: "Runs Status Report" (AI) button is disabled when fewer than 5 finished runs exist; tooltip reads "More than 5 runs are needed to generate a report." When ≥ 5 finished runs exist, the button becomes enabled.
ac-delta-5: The row extra menu is state-aware — "Relaunch", "Advanced Relaunch", and "Launch a Copy" are available only for finished/terminated runs; for an unfinished run a "Continue" affordance is exposed instead.
ac-delta-6: Pin applies to both Runs and RunGroups; after Pin, the row shows a pin indicator and is repositioned at the top; Unpin reverses and repositions back into chronological order. Pin success toast: "Run has been pinned".
ac-delta-7: Multi-select mode is toggled by the toolbar "Multi-select" icon button; when enabled, per-row checkboxes appear and a bottom bulk-action toolbar is shown; when disabled, checkboxes disappear and the toolbar is removed.
ac-delta-8: Bulk "Compare" in Multi-select becomes enabled only when ≥ 2 rows are selected; the action navigates to a comparison view (destination owned by #8 — here we only verify enablement + entry transition).
ac-delta-9: Bulk "Labels" action applies/removes labels across all selected runs in a single submit; the Labels column (when shown via Custom view) reflects the change on return.
ac-delta-10: Custom view Settings lets the user toggle column visibility and reorder/resize columns; widths and visibility persist across reloads per user/project.
ac-delta-11: The same button toggles between "Default view" (card) and "Custom view" (table); the button's label text updates to reflect the current mode.
ac-delta-12: Pagination uses first ("«") and last ("»") link controls; the current page number is shown as plain text between them; pagination appears only when total rows exceed the page size.
ac-delta-13: The "Groups" filter tab shows RunGroup rows with an expand chevron; expanding reveals nested child runs in-place without navigation.
ac-delta-14: The toolbar "Expand" icon button toggles expand/collapse of all RunGroup rows visible in the current list.
ac-delta-15: The TQL Query Language Editor modal exposes Apply / Save / Cancel buttons; "Save" is disabled until a non-empty query is typed; the modal exposes Saved Queries and Examples tabs, an autocomplete checkbox (checked by default), and an Operators + Variables sidebar.
ac-delta-16: An invalid TQL query yields an error surface in the editor (no list filtering performed); a valid query filters the Runs list and the resulting filter state is reflected in the URL (shareable).
ac-delta-17: "Runs Archive" and "Groups Archive" entry links at the bottom of the list show archived-item counts; clicking navigates to the archive pages (`/runs/archive`, `/runs/group-archive`) — destinations owned by #9.

## Cross-cutting ACs (from destructuring.md)

- Concern A (Multi-environment): the list must render multi-env runs correctly — "Tags & Envs" column (Custom view) shows environment values; a run spawned as multi-env appears as grouped/separate rows per the creation mode (#4 owns creation; this AC verifies list rendering only).
- Concern C (RunGroup membership): the "Groups" tab + Move-to-group (AC-52) must be exercised here; Move preserves the run's history and relocates it under the chosen group.
- Concern E (Custom statuses): TQL `has_custom_status` variable must filter the list; a run with a custom status set during execution must appear/disappear as the TQL filter toggles.
- Concern H (Bulk multi-select): the Runs-list multi-select bulk action (Archive or Labels) must be exercised end-to-end.
