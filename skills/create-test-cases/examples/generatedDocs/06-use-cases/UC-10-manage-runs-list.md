# UC-10: Manage the Runs list — QA Creator

<!-- use-case
id: UC-10
primary-actor: QA Creator
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** QA Creator
**Stakeholders:** Tester (uses Continue / Runner entry from the list); Manager / Owner (shares filter URLs, pins important groups); Project (supplies TQL variables over Runs — `rungroup`, `env`, `finished_at`, labels, custom statuses, counts); downstream UCs — [UC-04](./UC-04-finish-run.md) (Continue / Finish entry points), [UC-05](./UC-05-relaunch-run.md) (Relaunch ▾ row extra menu), [UC-08](./UC-08-manage-rungroup.md) (Move-to-group), [UC-11](./UC-11-view-run-report.md) (click-through), [UC-12](./UC-12-archive-unarchive-purge.md) (Archive / Purge entry points, Archive page links).
**Goal:** Navigate, filter, sort, pin, multi-select, and share the Runs list — scope the visible Runs (by tab, by TQL, by Custom view) and launch row/bulk actions that delegate to downstream UCs.
**Trigger:** Actor opens the Runs page (`/projects/{p}/runs`) and interacts with the filter tabs, the chart toggle, Multi-Select mode, the TQL editor, the Custom view toggle, row extra menus, or the Archive links at the bottom.
**Scope:** `runs-list-management` (owner). Touches `run-groups` (Groups tab + Move-to-group — [UC-08](./UC-08-manage-rungroup.md)), `run-detail-and-report` (row click navigates to Report + some bulk actions dock into Report surfaces — [UC-11](./UC-11-view-run-report.md)), `archive-and-purge` (archive links + row-level Archive / Purge — [UC-12](./UC-12-archive-unarchive-purge.md)), `run-lifecycle` (Continue / Relaunch variants surface from row extra menu — [UC-04](./UC-04-finish-run.md) / [UC-05](./UC-05-relaunch-run.md)).

## Preconditions

- Actor holds Read permission on the project (all roles incl. Readonly can view the list; destructive actions gate per role — see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix) + [BR-11](../07-business-rules.md#br-11)).
- Project contains ≥ 0 Runs — the list renders empty states per tab when no matching Runs exist.

## Main success scenario — filter by tab + pin + click through to report

1. Actor navigates to the Runs page.
2. System renders the Runs list with:
   - Chart area above the list (toggleable — `runs-list-management-ac-delta.md` ac-delta-1) whose legend entries (Passed / Failed / Skipped) act as dataset toggles (ac-delta-2).
   - Breadcrumb area with a **run count badge** reflecting the active tab + filter combination (ac-delta-3).
   - Toolbar: **Manual Run** split-button (entry to [UC-01](./UC-01-create-manual-run.md) / [UC-02](./UC-02-create-mixed-run.md)), Filter tabs, Multi-Select toggle, Expand-all toggle (ac-delta-14), TQL editor entry, Custom-view / Default-view toggle (ac-delta-11), **Runs Status Report** (AI, disabled < 5 finished runs — ac-delta-4).
   - Filter tabs: **Manual · Automated · Mixed · Unfinished · Groups** (AC-68).
   - Rows with state-aware extra menus (AC-69, ac-delta-5).
   - Archive entry links at the bottom (**Runs Archive** + **Groups Archive**, with counts — AC-77, ac-delta-17).
3. Actor clicks the **Mixed** filter tab — System re-renders the list scoped to Mixed Runs; the run-count badge updates (ac-delta-3).
4. Actor pins a Run via row extra menu → **Pin** (AC-70, ac-delta-6).
5. System repositions the Run at the top of the list; the row shows a pin indicator; a toast *"Run has been pinned"* appears.
6. Actor clicks the Run row — System navigates to the Run Detail + Report ([UC-11](./UC-11-view-run-report.md)).

## Alternate flows

### A1: Groups tab — expand in place
1. Actor clicks the **Groups** tab (AC-68).
2. System renders RunGroup rows, each with an expand chevron (ac-delta-13).
3. Actor clicks a group's chevron — System reveals nested child Runs in-place without navigation (ac-delta-13). The toolbar's **Expand** button toggles expand/collapse for every visible RunGroup (ac-delta-14).

### A2: Row extra menu (state-aware)
1. Actor opens a row's extra menu (AC-69, ac-delta-5).
2. System exposes a state-dependent list:
   - On a **Finished / Terminated** Run: *Relaunch / Launch a Copy / Advanced Relaunch / Copy / Pin / Move / Labels / Archive / Purge / Export as PDF / Download*. Each action delegates downstream (Relaunch variants → [UC-05](./UC-05-relaunch-run.md); Move → [UC-08 A2](./UC-08-manage-rungroup.md#a2-move-an-existing-run-into-a-rungroup-from-the-runs-list); Archive / Purge → [UC-12](./UC-12-archive-unarchive-purge.md); Export / Download → [UC-11](./UC-11-view-run-report.md) entry points).
   - On an **Unfinished** Run: *Continue* replaces Relaunch / Launch-a-Copy / Advanced Relaunch (ac-delta-5). Continue → [UC-04 A1](./UC-04-finish-run.md#a1-continue-a-pending-run-then-finish).

### A3: Multi-Select + bulk action
1. Actor toggles the toolbar's **Multi-select** icon (ac-delta-7).
2. System reveals per-row checkboxes and a bottom bulk-action toolbar.
3. Actor ticks ≥ 1 rows; the toolbar exposes: **Select all**, **Archive**, **Labels**, **Compare**, **Extra** (Link, Download, Merge, Move), **Purge** (AC-71).
4. Actor can apply:
   - **Archive** (bulk) — delegates to [UC-12](./UC-12-archive-unarchive-purge.md).
   - **Labels** — applies / removes labels across all selected Runs in one submit (ac-delta-9); the Labels column (when visible in Custom view) reflects on return.
   - **Compare** — enabled only when ≥ 2 rows are selected; navigates to the Compare view (owned by [UC-11](./UC-11-view-run-report.md), ac-delta-8, AC-92).
   - **Move / Merge / Link / Download** — delegate per AC-71.

### A4: TQL Query
1. Actor opens the TQL Query Language Editor (AC-72) — System opens the modal.
2. Modal exposes: **Apply** / **Save** (disabled until non-empty) / **Cancel**; Saved Queries tab + Examples tab; autocomplete checkbox (default ON); Operators + Variables sidebar (ac-delta-15).
3. Actor types e.g. `rungroup == "Release 42" and passed_count >= 10`.
4. Actor clicks **Apply** — System filters the list to matching Runs; the **URL reflects the filter state** making it shareable (AC-73, ac-delta-16).
5. Invalid query — error surface inside the editor; no list filtering performed (ac-delta-16).

### A5: Custom view — columns + widths persist
1. Actor clicks the view-toggle button — System switches from **Default view** (card) to **Custom view** (table); the button label flips (ac-delta-11).
2. Actor opens Custom view Settings (AC-74) — System exposes column visibility toggles (incl. **Tags & Envs**, **Labels**, **Assigned to**, custom-status columns) and drag handles for reorder/resize (ac-delta-10).
3. Widths + visibility **persist per-user, per-project** across reloads (AC-74, ac-delta-10).

### A6: URL share
1. Any filter state (tab + TQL + Custom view selection) is reflected in the URL (AC-73, ac-delta-16).
2. Actor copies the URL and shares it — recipient lands on the same filter scope (sharing pages include the Runs page **and the Runs Archive page** — AC-73).

### A7: Runs Status Report (AI) gating
1. Actor clicks **Runs Status Report** when < 5 finished Runs exist — System keeps the button disabled with tooltip *"More than 5 runs are needed to generate a report."* (ac-delta-4).
2. When ≥ 5 finished Runs exist, the button becomes enabled. Clicking generates the AI-authored report (destination out of POC scope — [13-open-questions.md § OQ-19](../13-open-questions.md#oq-19) for payload details).

### A8: Pagination
1. When row count exceeds the page size, System shows pagination controls: **«** (first) / current page number (plain text) / **»** (last) (ac-delta-12).
2. Under the page-size threshold, pagination is not rendered.

### A9: Chart legend toggles
1. Actor clicks a legend item (Passed / Failed / Skipped) in the chart area (ac-delta-2).
2. System toggles the dataset's visibility in the chart; other datasets remain.

### A10: Hide / Show chart
1. Actor clicks the chart area's **Hide chart** / **Show chart** toggle (ac-delta-1).
2. System collapses / expands the chart container; the toggle label flips.

### A11: Move to RunGroup from the row
1. Actor opens a Run's extra menu → **Move** → picks destination group → **Move** (AC-52).
2. System moves the Run into the chosen group; Run leaves its prior group (or ungrouped set) and appears under the new one (delegates to [UC-08 A2](./UC-08-manage-rungroup.md#a2-move-an-existing-run-into-a-rungroup-from-the-runs-list)).

### A12: Archive links (footer)
1. Actor scrolls to the bottom of the Runs page.
2. **Runs Archive** and **Groups Archive** links display archived-item counts (AC-77, ac-delta-17).
3. Clicking navigates to the archive pages (`/runs/archive`, `/runs/group-archive`) — destinations owned by [UC-12](./UC-12-archive-unarchive-purge.md).

## Exception flows

### E1: Empty state per tab
1. Project has no Runs for the active tab (e.g., a fresh project on **Mixed**).
2. System renders a neutral empty state (no error) — run count badge is zero (ac-delta-3).

### E2: Destructive action attempted by Readonly
1. A Readonly user opens a row extra menu.
2. Destructive actions (Archive / Purge / Labels edit / Move) are hidden or disabled per [BR-11](../07-business-rules.md#br-11) (owned by [UC-12](./UC-12-archive-unarchive-purge.md)'s permission gating).

### E3: Compare with < 2 rows selected
1. Actor enters Multi-Select and ticks only one row.
2. System keeps **Compare** disabled (ac-delta-8). Enabling requires ≥ 2 selections.

### E4: TQL syntax error
1. Actor applies an invalid TQL query (ac-delta-16).
2. System surfaces an inline error inside the editor; the list remains at its prior filter state; no URL update.

## Postconditions

- **Success — navigation / filter:** The list reflects the chosen tab + TQL + Custom view; the URL is shareable (AC-73).
- **Success — pin:** Pinned Runs / RunGroups surface at the top with a pin indicator (AC-70, ac-delta-6); Unpin reverts to chronological order.
- **Success — bulk action:** Targeted Runs receive the applied label set / comparison dock / archive status per the chosen action.
- **Failure:** List stays at prior state; no URL / filter / row mutation persists.

## Business rules referenced

- [**BR-11**](../07-business-rules.md#br-11) — Readonly cannot perform destructive actions (Archive / Unarchive / Purge / Labels / Move) from row or bulk toolbar.

## Functional requirements covered

- AC-52, AC-68, AC-69, AC-70, AC-71, AC-72, AC-73, AC-74, AC-77, AC-87, AC-88, AC-92.
- `runs-list-management-ac-delta.md` ac-delta-1..17.

## Related use cases

- **[UC-01](./UC-01-create-manual-run.md)** / **[UC-02](./UC-02-create-mixed-run.md)** — entry point (Manual Run split-button lives on this page).
- **[UC-04](./UC-04-finish-run.md)** — Continue entry point from unfinished rows.
- **[UC-05](./UC-05-relaunch-run.md)** — Relaunch ▾ variants from finished rows.
- **[UC-08](./UC-08-manage-rungroup.md)** — Groups tab + Move-to-group.
- **[UC-11](./UC-11-view-run-report.md)** — row click navigates to Report; Compare destination.
- **[UC-12](./UC-12-archive-unarchive-purge.md)** — row + bulk Archive / Purge; footer Archive links.

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-10 -->
<!-- sources: AC-52, AC-68, AC-69, AC-70, AC-71, AC-72, AC-73, AC-74, AC-77, AC-87, AC-88, AC-92, runs-list-management/ac-delta-1, runs-list-management/ac-delta-2, runs-list-management/ac-delta-3, runs-list-management/ac-delta-4, runs-list-management/ac-delta-5, runs-list-management/ac-delta-6, runs-list-management/ac-delta-7, runs-list-management/ac-delta-8, runs-list-management/ac-delta-9, runs-list-management/ac-delta-10, runs-list-management/ac-delta-11, runs-list-management/ac-delta-12, runs-list-management/ac-delta-13, runs-list-management/ac-delta-14, runs-list-management/ac-delta-15, runs-list-management/ac-delta-16, runs-list-management/ac-delta-17 -->
<!-- sub-feature: runs-list-management -->

_63 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | high | archive-and-purge | [Navigate to Runs Archive via ${entry_point}](../../../../test-cases/manual-tests-execution/archive-and-purge/archive-pages.md) | AC-77 |
| 2 | critical | archive-and-purge | [Archive a single run from the row extra menu @smoke](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-69 |
| 3 | normal | archive-and-purge | [Bulk Archive button is disabled when no runs are selected @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-71 |
| 4 | critical | archive-and-purge | [Bulk archive multiple runs via Multi-select @smoke](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-71 |
| 5 | high | archive-and-purge | [Bulk purge multiple runs via Multi-select "Delete" action](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-71 |
| 6 | critical | archive-and-purge | [Purge a single run from the row extra menu @smoke](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-69 |
| 7 | normal | archive-and-purge | [Select All link bulk-archives every run on the current page @boundary](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-71 |
| 8 | normal | run-detail-and-report | [Compare action requires at least two runs to be selected @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | AC-92 |
| 9 | critical | run-detail-and-report | [Compare at least two finished runs from the Runs list navigates to the Compare matrix @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | AC-92 |
| 10 | high | run-detail-and-report | [Compare matrix renders per-run status cells with test titles as row links @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | AC-92 |
| 11 | low | run-detail-and-report | [Compare matrix renders with four runs selected at the supported maximum @boundary](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | AC-92 |
| 12 | low | run-detail-and-report | [Manually entering the Compare URL with a single run id renders a neutral empty or fallback state @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | AC-92 |
| 13 | normal | run-detail-and-report | [Extra menu Download as Spreadsheet triggers an XLSX download @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-87 |
| 14 | high | run-detail-and-report | [Extra menu Export as PDF triggers a PDF download of the current report view @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-88 |
| 15 | high | run-groups | [Move an existing Run into a RunGroup via the row extra menu @smoke](../../../../test-cases/manual-tests-execution/run-groups/contents-and-runs.md) | AC-52 |
| 16 | normal | run-groups | [${pin_action} a RunGroup via the extra menu moves it to ${destination_region}](../../../../test-cases/manual-tests-execution/run-groups/menu-actions.md) | AC-70 |
| 17 | normal | runs-list-management | [Archive entry links at the bottom of the Runs page navigate to ${archive_page}](../../../../test-cases/manual-tests-execution/runs-list-management/chart-and-toolbar.md) | AC-77, runs-list-management/ac-delta-17 |
| 18 | normal | runs-list-management | [Expand-all toolbar button expands and collapses every visible RunGroup row](../../../../test-cases/manual-tests-execution/runs-list-management/chart-and-toolbar.md) | runs-list-management/ac-delta-14, AC-69 |
| 19 | low | runs-list-management | [Hyphenation toggle in Runs list settings wraps long column values](../../../../test-cases/manual-tests-execution/runs-list-management/chart-and-toolbar.md) | AC-74 |
| 20 | normal | runs-list-management | [Legend click toggles the ${dataset} dataset in the chart](../../../../test-cases/manual-tests-execution/runs-list-management/chart-and-toolbar.md) | runs-list-management/ac-delta-2 |
| 21 | normal | runs-list-management | [Pagination first and last controls navigate and disable at boundaries @boundary](../../../../test-cases/manual-tests-execution/runs-list-management/chart-and-toolbar.md) | runs-list-management/ac-delta-12 |
| 22 | low | runs-list-management | [Run count badge reflects the number of runs in the active tab](../../../../test-cases/manual-tests-execution/runs-list-management/chart-and-toolbar.md) | runs-list-management/ac-delta-3 |
| 23 | normal | runs-list-management | [Runs Status Report AI button is disabled below the 5-finished-runs threshold @boundary](../../../../test-cases/manual-tests-execution/runs-list-management/chart-and-toolbar.md) | runs-list-management/ac-delta-4 |
| 24 | normal | runs-list-management | [Toggling the chart hides and restores the chart area @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/chart-and-toolbar.md) | runs-list-management/ac-delta-1 |
| 25 | high | runs-list-management | [Bulk multi-select archive applies across every selected run end to end @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/cross-cutting.md) | AC-71, runs-list-management/ac-delta-7, runs-list-management/ac-delta-9 |
| 26 | normal | runs-list-management | [Multi-environment runs render with environment indicators in the Runs list](../../../../test-cases/manual-tests-execution/runs-list-management/cross-cutting.md) | AC-68, AC-74, runs-list-management/ac-delta-13 |
| 27 | high | runs-list-management | [RunGroup in the Groups tab expands in place to reveal child runs @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/cross-cutting.md) | AC-68, AC-52, runs-list-management/ac-delta-13 |
| 28 | normal | runs-list-management | [TQL has_custom_status filters the list to runs that recorded a custom status](../../../../test-cases/manual-tests-execution/runs-list-management/cross-cutting.md) | AC-72, runs-list-management/ac-delta-16 |
| 29 | normal | runs-list-management | [Changing a column width in Custom view Settings persists across reload](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-74, runs-list-management/ac-delta-10 |
| 30 | high | runs-list-management | [Copying the Runs URL reproduces the active filter in a new session](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-73, runs-list-management/ac-delta-16 |
| 31 | normal | runs-list-management | [Hiding a column in Custom view Settings persists across reload](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-74, runs-list-management/ac-delta-10 |
| 32 | normal | runs-list-management | [Opening the Runs page with a malformed filterParam falls back to the unfiltered list @negative](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-73, runs-list-management/ac-delta-16 |
| 33 | high | runs-list-management | [Settings gear is enabled only in Custom view @negative](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-74, runs-list-management/ac-delta-10 |
| 34 | critical | runs-list-management | [Switch to the ${tab} filter tab scopes the list to matching runs @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-68, runs-list-management/ac-delta-3 |
| 35 | low | runs-list-management | [Switching to the Groups tab in a project with no RunGroups shows an empty state @negative](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-68 |
| 36 | normal | runs-list-management | [Switching to the Unfinished tab in a project with no unfinished runs shows an empty state @negative](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-68, runs-list-management/ac-delta-3 |
| 37 | high | runs-list-management | [Toggle Default view and Custom view switches list layout and button label @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-74, runs-list-management/ac-delta-11 |
| 38 | high | runs-list-management | [Bulk Archive moves every selected run off the default list](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71, runs-list-management/ac-delta-5 |
| 39 | normal | runs-list-management | [Bulk Labels applies a label to every selected run](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71, runs-list-management/ac-delta-9 |
| 40 | high | runs-list-management | [Closing the bulk toolbar via the close button keeps selection hidden](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71, runs-list-management/ac-delta-7 |
| 41 | critical | runs-list-management | [Compare enables only at two or more selected runs and navigates to the comparison view @boundary](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71, AC-92, runs-list-management/ac-delta-8 |
| 42 | normal | runs-list-management | [Deselecting the last selected run removes the bulk toolbar @boundary](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71, runs-list-management/ac-delta-7 |
| 43 | normal | runs-list-management | [Extra dropdown shows ${extra_items} at ${selection_size} @boundary](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71, AC-87, runs-list-management/ac-delta-8 |
| 44 | normal | runs-list-management | [Merge action is absent in the Extra dropdown at a single selection @negative](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 45 | normal | runs-list-management | [Select all selects every visible run row in Multi-select mode](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 46 | critical | runs-list-management | [Toggling Multi-select on and off shows and hides the row checkboxes and bottom toolbar @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71, runs-list-management/ac-delta-7 |
| 47 | normal | runs-list-management | [Cancelling the Move dialog leaves the run in place @negative](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-52, runs-list-management/ac-delta-5 |
| 48 | normal | runs-list-management | [Move dialog in a project with no RunGroups shows Root as the only destination @negative](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-52, runs-list-management/ac-delta-5 |
| 49 | high | runs-list-management | [Move to Archive via row extra menu removes the run from the active list](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-69, runs-list-management/ac-delta-5 |
| 50 | high | runs-list-management | [Moving a run to ${destination} via the Move dialog relocates the row](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-52, runs-list-management/ac-delta-5 |
| 51 | critical | runs-list-management | [Pin then Unpin a run cycles the indicator and repositions the row @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-70, runs-list-management/ac-delta-6 |
| 52 | normal | runs-list-management | [Pinning a RunGroup repositions the group to the top of the Groups tab](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-70, runs-list-management/ac-delta-6 |
| 53 | normal | runs-list-management | [Purge via row extra menu removes the run and shows the deletion toast](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-69 |
| 54 | high | runs-list-management | [Row extra menu exposes the ${state}-specific action set @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-69, AC-88, runs-list-management/ac-delta-5 |
| 55 | normal | runs-list-management | [Applying a TQL query with no matching runs surfaces a zero-result state @negative](../../../../test-cases/manual-tests-execution/runs-list-management/tql-query-editor.md) | AC-72, runs-list-management/ac-delta-16 |
| 56 | critical | runs-list-management | [Applying a valid query filters the list and reflects the filter in the URL @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/tql-query-editor.md) | AC-72, AC-73, runs-list-management/ac-delta-16 |
| 57 | normal | runs-list-management | [Cancelling the Query Language Editor discards the typed query @negative](../../../../test-cases/manual-tests-execution/runs-list-management/tql-query-editor.md) | AC-72, runs-list-management/ac-delta-15 |
| 58 | normal | runs-list-management | [Examples tab lists three preset queries that can be inserted into the editor](../../../../test-cases/manual-tests-execution/runs-list-management/tql-query-editor.md) | AC-72, runs-list-management/ac-delta-15 |
| 59 | high | runs-list-management | [Invalid query surfaces an error without filtering the list @negative](../../../../test-cases/manual-tests-execution/runs-list-management/tql-query-editor.md) | AC-72, runs-list-management/ac-delta-16 |
| 60 | low | runs-list-management | [Operators and Variables sidebars expose the documented TQL vocabulary](../../../../test-cases/manual-tests-execution/runs-list-management/tql-query-editor.md) | AC-72, runs-list-management/ac-delta-15 |
| 61 | high | runs-list-management | [Query Language Editor opens with Apply always enabled and Cancel always enabled @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/tql-query-editor.md) | AC-72, runs-list-management/ac-delta-15 |
| 62 | normal | runs-list-management | [Save button remains disabled until a non-empty query is typed @unclear](../../../../test-cases/manual-tests-execution/runs-list-management/tql-query-editor.md) | AC-72, runs-list-management/ac-delta-15 |
| 63 | low | runs-list-management | [Toggling the Enable autocomplete checkbox changes suggestion behavior](../../../../test-cases/manual-tests-execution/runs-list-management/tql-query-editor.md) | AC-72, runs-list-management/ac-delta-15 |
<!-- end-trace -->
