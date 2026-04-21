# UC-08: Create and manage a RunGroup — QA Creator

<!-- use-case
id: UC-08
primary-actor: QA Creator
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** QA Creator
**Stakeholders:** Tester (opens group pages to pick Runs); Project (supplies merge-strategy enum, group types); Runs list consumers (render Groups tab and pin region — [UC-10](./UC-10-manage-runs-list.md)); Archive / Purge cascade consumers ([UC-12](./UC-12-archive-unarchive-purge.md)).
**Goal:** Organise Runs into a named [RunGroup](../03-glossary.md#rungroup) — create it with a merge strategy, populate it with existing or new Runs, inspect the basic group view + [Combined Report](../03-glossary.md#combined-report), copy it, pin it, edit it, and optionally archive / purge with cascade semantics.
**Trigger:** Actor opens the arrow-dropdown next to the **Manual Run** split-button → **New group** (AC-13), or opens an existing RunGroup and acts on its extra menu.
**Scope:** `run-groups` (owner of concern C — RunGroup membership). Touches `run-creation` (dropdown entry point, RunGroup field pre-populate — [UC-01](./UC-01-create-manual-run.md)), `runs-list-management` (Groups tab, Move-to-group from the Runs list, pinned region render — [UC-10](./UC-10-manage-runs-list.md)), `archive-and-purge` (cascade semantics are verified here but owned by [UC-12](./UC-12-archive-unarchive-purge.md)).

## Preconditions

- Actor holds Create-RunGroup permission (see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix)).
- Project exists with ≥ 0 prior RunGroups (a no-group project is a valid starting point; the Groups tab empty state is owned by [UC-10](./UC-10-manage-runs-list.md)).

## Main success scenario — create a RunGroup, then open it

1. Actor opens the Runs page and clicks the arrow next to **Manual Run** → **New group** (AC-13, `run-groups-ac-delta.md` ac-delta-1).
2. System opens the **New Group** dialog with fields in order:
   - **Group Type** (optional selector; ≥ 1 predefined types — ac-delta-2).
   - **Name** (required).
   - **Merge Strategy** (required selector; typical set includes *Merge all* / *Best of all* / *Fresh run* / *Last run* — ac-delta-3).
   - **Description** (optional).
   - Primary **Save**; Cancel / dismiss.
   (AC-14, ac-delta-1)
3. Actor enters a Name, picks a Merge Strategy, optionally picks a Type and Description.
4. Actor clicks **Save** — System creates the RunGroup, closes the dialog, and surfaces the new group in the Runs list under the **Groups** tab (or top-level tree) without a page refresh (ac-delta-5).
5. Actor clicks the group row — System opens the **RunGroup page** (ac-delta-6) with:
   - Header (Name + meta: type / strategy).
   - Chart / summary visual.
   - Per-run list with each child's title, status, and aggregate counters (AC-54, ac-delta-8).
   - **Combined Report** action.
   - **Add Manual Run** entry point (scoped to this group).

## Alternate flows

### A1: Add a Run from inside the RunGroup
1. On the RunGroup page, Actor clicks **Add Manual Run** (ac-delta-7).
2. System opens the New Manual Run sidebar ([UC-01](./UC-01-create-manual-run.md) main) with the RunGroup field **pre-populated to the current group** but editable (AC-51, [UC-01 A5](./UC-01-create-manual-run.md#a5-rungroup-pre-populated-from-context)).
3. Actor proceeds per UC-01 Launch / Save.

### A2: Move an existing Run into a RunGroup (from the Runs list)
**Entry point is a Run's extra menu on the Runs list — ownership shared with [UC-10](./UC-10-manage-runs-list.md).**
1. Actor opens a Run row's extra menu → **Move** → selects destination RunGroup → **Move** (AC-52).
2. System moves the Run into the chosen group; the Run leaves its prior group (or the ungrouped set) and appears under the new one.

### A3: Add Existing Run from inside the RunGroup
1. On the RunGroup page, Actor opens the group's extra menu → **Add Existing Run** (AC-53, ac-delta-14).
2. System opens a picker listing runs eligible to be moved in (excludes runs already in this group) with multi-select.
3. Actor confirms — System returns to the group view with the newly added Runs present.

### A4: Combined Report
1. On the RunGroup page, Actor clicks **Combined Report** (AC-54, ac-delta-10).
2. System opens the Combined Report view exposing:
   - **Main run anchor** selector.
   - **Compare To** selector (one or more peer runs to diff against the anchor — cross-group support **UNCLEAR** per [13-open-questions.md § OQ-16](../13-open-questions.md#oq-16)).
   - Filters over the combined set (status / type / assignee).
   - Aggregated totals (counts / percentages).
3. Actor switches the anchor — System re-bases the diff and refreshes totals without leaving the view (ac-delta-11).

### A5: Customise the RunGroup page columns
1. On the RunGroup page, Actor drags column dividers or toggles columns via the view menu.
2. System persists the column / width configuration **per-RunGroup, per-user**, independently of the global Runs list customisation (AC-55, ac-delta-9).

### A6: Edit group metadata
1. Actor opens the group's extra menu → **Edit** (ac-delta-12).
2. System re-opens the editor pre-populated with current Name / Type / Merge Strategy / Description (ac-delta-13).
3. Actor changes a field and clicks **Save** — System commits in-place (no new group is created). Cancel discards.

### A7: Pin / Unpin a RunGroup
1. Actor opens the group's extra menu → **Pin** (AC-70, ac-delta-12, ac-delta-16).
2. System moves the group into the pinned region at the top of the Runs list (and/or Groups tab).
3. Extra menu now shows **Unpin**; clicking it returns the group to its natural position.

### A8: Copy Group
1. Actor opens the group's extra menu → **Copy** (ac-delta-15).
2. System opens the Copy Group dialog with toggles / checkboxes for scope: **Assignees**, **Issues**, **Labels**, **Environments**, **Nested Structure** (child runs).
3. Actor selects slices and confirms — System creates a new RunGroup with the selected slices duplicated; the source group remains untouched.

### A9: Archive the RunGroup (cascade)
**Ownership crosses over to [UC-12](./UC-12-archive-unarchive-purge.md) — noted here for completeness.**
1. Actor opens the group's extra menu → **Archive** (AC-56, ac-delta-12, ac-delta-17).
2. System shows a confirmation dialog.
3. On confirm, the group **and all nested Runs** move to the Groups / Runs Archive; nested Runs carry an "Archived" badge; the group disappears from the active Runs list ([BR-9](../07-business-rules.md#br-9)).
4. **Unarchive** (from the Groups Archive extra menu) restores the group and all nested Runs to their prior statuses.

### A10: Purge the RunGroup (cascade + 20 000-Run ceiling)
1. Actor opens the group's extra menu → **Purge** (AC-57).
2. System cascades the purge across all nested Runs; purged Runs receive a Purged badge and remain in Archive.
3. **Ceiling:** per-purge limit is **20 000 Runs** per group ([BR-10](../07-business-rules.md#br-10)); enforcement mode (pre-check banner vs silent server-side cap) is **UNCLEAR** (ac-delta-U1, [13-open-questions.md § OQ-17](../13-open-questions.md#oq-17)).

## Exception flows

### E1: Save with empty Name
1. Actor attempts to save the New Group dialog without a Name.
2. System blocks — the primary action stays disabled or the field surfaces inline validation; no group is created (ac-delta-4).

### E2: Save without a Merge Strategy
1. Actor tries to save without picking a Merge Strategy.
2. System blocks — Save is not active until a strategy is picked (ac-delta-3).

### E3: Cancel / dismiss the dialog
1. Actor clicks Cancel or the close affordance.
2. System discards the draft and closes the dialog; no group is created (ac-delta-1).

## Postconditions

- **Success — create:** RunGroup exists; appears in Runs list (Groups tab + top-level tree) without page refresh; page is reachable; **Add Manual Run** entry point pre-populates the RunGroup field in creation.
- **Success — populate:** Child Runs appear in the group view with per-run summary and aggregate counters (ac-delta-8).
- **Success — Archive / Purge:** Group + nested Runs cascade per [BR-9](../07-business-rules.md#br-9); Purge is bounded by [BR-10](../07-business-rules.md#br-10).
- **Failure:** No group / state change persists.

## Business rules referenced

- [**BR-1**](../07-business-rules.md#br-1) — Require-RunGroup may demand this UC's output before Launch in UC-01 / UC-02.
- [**BR-9**](../07-business-rules.md#br-9) — RunGroup cascade on Archive / Unarchive / Purge.
- [**BR-10**](../07-business-rules.md#br-10) — 20 000-Run Purge ceiling per RunGroup.

## Functional requirements covered

- AC-13, AC-14, AC-51, AC-52, AC-53, AC-54, AC-55, AC-56, AC-57, AC-70.
- `run-groups-ac-delta.md` ac-delta-1..17.

## Related use cases

- **[UC-01](./UC-01-create-manual-run.md)** — creation entry point reuses the arrow dropdown and pre-populates RunGroup.
- **[UC-10](./UC-10-manage-runs-list.md)** — Groups tab, pinned region, Move-to-group from the list.
- **[UC-12](./UC-12-archive-unarchive-purge.md)** — owns the Archive / Unarchive / Purge action set; cascade semantics verified here.

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-08 -->
<!-- sources: AC-13, AC-14, AC-51, AC-52, AC-53, AC-54, AC-55, AC-56, AC-57, AC-70, run-groups/ac-delta-1, run-groups/ac-delta-2, run-groups/ac-delta-3, run-groups/ac-delta-4, run-groups/ac-delta-5, run-groups/ac-delta-6, run-groups/ac-delta-7, run-groups/ac-delta-8, run-groups/ac-delta-9, run-groups/ac-delta-10, run-groups/ac-delta-11, run-groups/ac-delta-12, run-groups/ac-delta-13, run-groups/ac-delta-14, run-groups/ac-delta-15, run-groups/ac-delta-16, run-groups/ac-delta-17 -->
<!-- sub-feature: run-groups -->

_43 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | critical | archive-and-purge | [Archive a RunGroup cascades to every nested run](../../../../test-cases/manual-tests-execution/archive-and-purge/rungroup-cascade.md) | AC-56 |
| 2 | high | archive-and-purge | [Cancelling the RunGroup archive confirmation leaves the group and nested runs untouched @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/rungroup-cascade.md) | AC-56 |
| 3 | high | archive-and-purge | [Purge an archived RunGroup deletes the group and moves nested runs to Runs Archive](../../../../test-cases/manual-tests-execution/archive-and-purge/rungroup-cascade.md) | AC-57 |
| 4 | low | archive-and-purge | [Purging a RunGroup with more than 20 000 runs is blocked @boundary @unclear](../../../../test-cases/manual-tests-execution/archive-and-purge/rungroup-cascade.md) | AC-57 |
| 5 | high | archive-and-purge | [Unarchive a RunGroup from Groups Archive restores all nested runs @smoke](../../../../test-cases/manual-tests-execution/archive-and-purge/rungroup-cascade.md) | AC-56 |
| 6 | high | run-creation | [Opening creation from a RunGroup page pre-populates the RunGroup field](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | AC-51 |
| 7 | normal | run-creation | [Arrow-dropdown closes on outside click without selecting any item @negative](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | AC-13 |
| 8 | normal | run-creation | [Arrow-dropdown item ${menu_item} opens ${target} without opening the creation sidebar](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | AC-13 |
| 9 | critical | run-groups | [Archive a RunGroup cascades to all nested runs @smoke](../../../../test-cases/manual-tests-execution/run-groups/archive-and-purge.md) | AC-56, run-groups/ac-delta-17 |
| 10 | normal | run-groups | [Cancelling the archive confirmation dialog leaves the group untouched @negative](../../../../test-cases/manual-tests-execution/run-groups/archive-and-purge.md) | AC-56, run-groups/ac-delta-17 |
| 11 | normal | run-groups | [Cancelling the purge confirmation leaves the group and nested runs on the active list @negative](../../../../test-cases/manual-tests-execution/run-groups/archive-and-purge.md) | AC-57, run-groups/ac-delta-17 |
| 12 | high | run-groups | [Purge a RunGroup cascades with a Purged badge](../../../../test-cases/manual-tests-execution/run-groups/archive-and-purge.md) | AC-57, run-groups/ac-delta-17 |
| 13 | high | run-groups | [Unarchive a RunGroup from Groups Archive restores all nested runs](../../../../test-cases/manual-tests-execution/run-groups/archive-and-purge.md) | AC-56, run-groups/ac-delta-17 |
| 14 | normal | run-groups | [Add Existing Run picker excludes runs already in the group @boundary](../../../../test-cases/manual-tests-execution/run-groups/contents-and-runs.md) | run-groups/ac-delta-14 |
| 15 | normal | run-groups | [Add Existing Run picker shows an empty selectable list when every existing run already belongs to the group @boundary](../../../../test-cases/manual-tests-execution/run-groups/contents-and-runs.md) | run-groups/ac-delta-14 |
| 16 | high | run-groups | [Add Existing Run(s) to a RunGroup via the group extra menu @smoke](../../../../test-cases/manual-tests-execution/run-groups/contents-and-runs.md) | AC-53, run-groups/ac-delta-14 |
| 17 | critical | run-groups | [Add Manual Run from inside a RunGroup pre-populates the RunGroup field @smoke](../../../../test-cases/manual-tests-execution/run-groups/contents-and-runs.md) | AC-51, run-groups/ac-delta-7 |
| 18 | high | run-groups | [Move an existing Run into a RunGroup via the row extra menu @smoke](../../../../test-cases/manual-tests-execution/run-groups/contents-and-runs.md) | AC-52 |
| 19 | normal | run-groups | [Combined Report button is disabled on a RunGroup with no first-level runs @negative](../../../../test-cases/manual-tests-execution/run-groups/detail-and-reports.md) | run-groups/ac-delta-6 |
| 20 | low | run-groups | [Combined Report Compare To across different RunGroups @unclear](../../../../test-cases/manual-tests-execution/run-groups/detail-and-reports.md) | run-groups/ac-delta-11 |
| 21 | high | run-groups | [Combined Report shows Overview, Summary totals, and the Main Run anchor with within-group Compare To @smoke](../../../../test-cases/manual-tests-execution/run-groups/detail-and-reports.md) | AC-54, run-groups/ac-delta-10 |
| 22 | low | run-groups | [Per-group Runs list column customisation persists independently of the global list @boundary](../../../../test-cases/manual-tests-execution/run-groups/detail-and-reports.md) | AC-55, run-groups/ac-delta-9 |
| 23 | normal | run-groups | [RunGroup detail panel on an empty group shows header, empty-state, and action buttons @smoke](../../../../test-cases/manual-tests-execution/run-groups/detail-and-reports.md) | AC-54, run-groups/ac-delta-6, run-groups/ac-delta-8 |
| 24 | normal | run-groups | [Rungroup Statistic Report button requires two or more child runs @boundary](../../../../test-cases/manual-tests-execution/run-groups/detail-and-reports.md) | run-groups/ac-delta-6 |
| 25 | normal | run-groups | [Switching the main run anchor in the Combined Report re-bases Summary totals @boundary](../../../../test-cases/manual-tests-execution/run-groups/detail-and-reports.md) | run-groups/ac-delta-11 |
| 26 | normal | run-groups | [Cancel on Edit RunGroup discards pending changes @negative](../../../../test-cases/manual-tests-execution/run-groups/group-lifecycle.md) | run-groups/ac-delta-13 |
| 27 | high | run-groups | [Create a new RunGroup via the New group dialog @smoke](../../../../test-cases/manual-tests-execution/run-groups/group-lifecycle.md) | AC-13, AC-14, run-groups/ac-delta-1, run-groups/ac-delta-5 |
| 28 | normal | run-groups | [Creating a group with Group Type ${type} persists the choice @boundary](../../../../test-cases/manual-tests-execution/run-groups/group-lifecycle.md) | AC-14, run-groups/ac-delta-2 |
| 29 | normal | run-groups | [Creating a group with Merge Strategy ${strategy} persists the choice @boundary](../../../../test-cases/manual-tests-execution/run-groups/group-lifecycle.md) | AC-14, run-groups/ac-delta-3 |
| 30 | normal | run-groups | [Dismissing the New RunGroup panel via ${dismiss_method} does not create a group @negative](../../../../test-cases/manual-tests-execution/run-groups/group-lifecycle.md) | AC-13, run-groups/ac-delta-1 |
| 31 | high | run-groups | [Edit an existing RunGroup commits the changes in place @smoke](../../../../test-cases/manual-tests-execution/run-groups/group-lifecycle.md) | run-groups/ac-delta-13 |
| 32 | high | run-groups | [New RunGroup panel blocks save with an empty Name @negative](../../../../test-cases/manual-tests-execution/run-groups/group-lifecycle.md) | AC-14, run-groups/ac-delta-4 |
| 33 | normal | run-groups | [${pin_action} a RunGroup via the extra menu moves it to ${destination_region}](../../../../test-cases/manual-tests-execution/run-groups/menu-actions.md) | AC-70, run-groups/ac-delta-16 |
| 34 | normal | run-groups | [Cancel Copy RunGroup dialog does not create a new group @negative](../../../../test-cases/manual-tests-execution/run-groups/menu-actions.md) | run-groups/ac-delta-15 |
| 35 | normal | run-groups | [Copy RunGroup with custom toggle selection (Assignee, Issues, Environments enabled) propagates the selected slices](../../../../test-cases/manual-tests-execution/run-groups/menu-actions.md) | run-groups/ac-delta-15 |
| 36 | normal | run-groups | [Copy RunGroup with default toggle selection creates a duplicate with Nested structure and Labels only @smoke](../../../../test-cases/manual-tests-execution/run-groups/menu-actions.md) | AC-53, run-groups/ac-delta-15 |
| 37 | normal | run-groups | [RunGroup extra menu action set is state-aware — ${group_state} @smoke](../../../../test-cases/manual-tests-execution/run-groups/menu-actions.md) | run-groups/ac-delta-12 |
| 38 | high | runs-list-management | [RunGroup in the Groups tab expands in place to reveal child runs @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/cross-cutting.md) | AC-52 |
| 39 | normal | runs-list-management | [Cancelling the Move dialog leaves the run in place @negative](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-52 |
| 40 | normal | runs-list-management | [Move dialog in a project with no RunGroups shows Root as the only destination @negative](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-52 |
| 41 | high | runs-list-management | [Moving a run to ${destination} via the Move dialog relocates the row](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-52 |
| 42 | critical | runs-list-management | [Pin then Unpin a run cycles the indicator and repositions the row @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-70 |
| 43 | normal | runs-list-management | [Pinning a RunGroup repositions the group to the top of the Groups tab](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-70 |
<!-- end-trace -->
