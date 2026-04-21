# UC-12: Archive, unarchive, and purge a Run or RunGroup — QA Creator

<!-- use-case
id: UC-12
primary-actor: QA Creator
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** QA Creator (Manager / Owner may perform all actions; Readonly is blocked on destructive variants per [BR-11](../07-business-rules.md#br-11)).
**Stakeholders:** Project (supplies **Purge Old Runs** retention setting — [BR-12](../07-business-rules.md#br-12)); [Pulse](../03-glossary.md#pulse) (records permanent-deletion events); RunGroup cascade consumers ([UC-08](./UC-08-manage-rungroup.md)); downstream reporting (archived/purged Runs become invisible on the active list).
**Goal:** Move Runs or RunGroups out of the active list (Archive), optionally compress them with metadata preserved (Purge), bring them back (Unarchive), or remove them irreversibly (Permanent delete). Configure auto-purge retention per project.
**Trigger:** Actor opens a row's extra menu (Runs list / Groups tab / RunGroup page / Report) → **Archive** / **Purge**; or the Archive pages' **Unarchive** / **Delete permanently**; or Project Settings → Purge Old Runs for the retention window.
**Scope:** `archive-and-purge` (owner of concerns C + G — cascade and ongoing-vs-finished semantics). Touches `runs-list-management` (entry points, Archive footer links — [UC-10](./UC-10-manage-runs-list.md)), `run-groups` (cascade; Groups Archive — [UC-08](./UC-08-manage-rungroup.md)), `run-lifecycle` (Archiving an ongoing Run terminates it — owned here; state machine is in [05-state-diagrams.md](../05-state-diagrams.md#run)), `run-detail-and-report` (entry points from the Report extra menu — [UC-11](./UC-11-view-run-report.md)).

## Preconditions

- Actor holds destructive-action permission for the target project (see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix) + [BR-11](../07-business-rules.md#br-11)).
- Target Run or RunGroup exists; for Purge cascade, group nest size ≤ 20 000 ([BR-10](../07-business-rules.md#br-10), AC-57, `archive-and-purge-ac-delta.md` ac-delta-19).

## Main success scenario — Archive a single finished Run

1. Actor opens the Run row's extra menu on the Runs list ([UC-10](./UC-10-manage-runs-list.md)) → **Archive** (AC-75, `archive-and-purge-ac-delta.md` ac-delta-1).
2. System opens a confirmation dialog; Cancel aborts with no state change.
3. Actor confirms.
4. System moves the Run out of the active list into **Runs Archive**, applies an **"Archived"** badge (ac-delta-16), and records no destructive-data loss (results, attachments, custom statuses preserved).
5. The Run is reachable via the footer **Runs Archive** link ([UC-10 A12](./UC-10-manage-runs-list.md#a12-archive-links-footer), AC-77, ac-delta-5).

## Alternate flows

### A1: Archive an ongoing Run — terminates it
1. Actor Archives a Run whose state is [In-Progress](../03-glossary.md#in-progress) (AC-76, concern G).
2. System:
   - Transitions Run to **Terminated** (ac-delta-16 — **"Terminated"** badge).
   - Sets every **Pending** test to **Skipped**.
   - Leaves other statuses (Passed / Failed / Skipped / Custom) unchanged.
   - Moves the Run to Archive.
3. The `Terminated → In-Progress` edge does not exist — restoring a Terminated Run via Unarchive does **not** return it to In-Progress ([BR-8](../07-business-rules.md#br-8), [05-state-diagrams.md § Run](../05-state-diagrams.md#run), AC-80).

### A2: Bulk Archive from Multi-Select
1. Actor enters Multi-Select on the Runs list ([UC-10 A3](./UC-10-manage-runs-list.md#a3-multi-select--bulk-action)), ticks ≥ 1 Runs, clicks **Archive** (AC-71, ac-delta-2).
2. System shows a single confirmation dialog covering all selected Runs.
3. On confirm, every selected Run is archived atomically.
4. **Scope:** Multi-Select archive targets Runs only — RunGroups are not archivable via Multi-Select (ac-delta-2).

### A3: Archive a RunGroup (cascade)
1. Actor opens a RunGroup's extra menu → **Archive** ([UC-08 A9](./UC-08-manage-rungroup.md#a9-archive-the-rungroup-cascade), AC-56).
2. System shows a confirmation dialog.
3. On confirm, the group **and every nested Run** move to Archive ([BR-9](../07-business-rules.md#br-9)); nested Runs carry an Archived badge; the group disappears from the active Runs list.

### A4: Purge a Run (compress, move to Archive with badge)
1. Actor opens a Run's extra menu → **Purge** (AC-78, ac-delta-3).
2. System shows a confirmation dialog with explicit destructive wording (distinct from Archive).
3. On confirm, the Run is compressed and moved to Archive with a **"Purged"** badge (ac-delta-16).
4. Preserved: **recorded test statuses, attachments, custom statuses, Run ID, title** (ac-delta-4).
5. Removed: **stack traces** (ac-delta-4, AC-78).

### A5: Purge a RunGroup (cascade + 20 000 ceiling)
1. Actor opens a RunGroup's extra menu → **Purge** (AC-57, [UC-08 A10](./UC-08-manage-rungroup.md#a10-purge-the-rungroup-cascade--20-000-run-ceiling)).
2. System cascades Purge to every nested Run; all carry Purged badges in Archive.
3. **Ceiling:** groups containing > 20 000 Runs are blocked ([BR-10](../07-business-rules.md#br-10), ac-delta-19). Enforcement mode (pre-check banner vs error-on-submit) is **UNCLEAR** — [13-open-questions.md § OQ-17](../13-open-questions.md#oq-17).

### A6: Automatic Purge — retention window
1. Actor opens Project Settings → **Purge Old Runs** (AC-79).
2. Retention input accepts a numeric value + unit (days); default **90 days** on first use (ac-delta-8, ac-delta-9).
3. Runs finished older than the retention window are auto-purged and carry the Purged badge ([BR-12](../07-business-rules.md#br-12)).
4. **Empty / non-numeric / negative** values are rejected — either disables auto-purge or surfaces validation (ac-delta-9). Exact copy **UNCLEAR**.

### A7: Unarchive a single Run
1. Actor navigates to Runs Archive (AC-77, ac-delta-5) and opens the row extra menu → **Unarchive** (ac-delta-13).
2. System returns the Run to the active Runs list with its prior statuses intact.
3. **Exception — Terminated:** an Archived Run that is Terminated cannot resume ([BR-8](../07-business-rules.md#br-8), AC-80) — it returns to the active list in Terminated state; the Runner remains unreachable.

### A8: Bulk Unarchive
1. On Runs Archive, Actor enters Multi-Select, ticks ≥ 1 Runs, clicks **Unarchive** (ac-delta-14).
2. System restores all selected Runs in one operation.

### A9: Unarchive a RunGroup (cascade restore)
1. Actor opens Groups Archive and unarchives a group (ac-delta-15).
2. System restores the group **and every nested Run** to the active list (cascade CC-C, [BR-9](../07-business-rules.md#br-9)).

### A10: Runs Archive page filters + sort
1. Runs Archive supports filter tabs: **Manual / Automated / Mixed** + status/badge filter distinguishing **Archived / Purged / Terminated** (ac-delta-6).
2. **Rungroup Structure** toggle groups archived Runs hierarchically when ON; flat list when OFF (ac-delta-7).

### A11: Groups Archive search / filter / sort
1. Groups Archive supports Search (by group name) + Group-type filter (ac-delta-10).
2. **Finish Range** date-range filter excludes out-of-window groups (ac-delta-11).
3. Sort by **Name** or **Date** with ASC/DESC; active column shows sort indicator (ac-delta-12).

### A12: Permanent delete (irreversible)
1. Actor opens an Archived item's extra menu → **Delete permanently** (AC-81, ac-delta-17).
2. System shows a distinct confirmation with **irreversibility wording**.
3. On confirm, the item is removed from Archive (irreversible).
4. [Pulse](../03-glossary.md#pulse) records the event under **"Deleted Run"** with actor (email / name), timestamp, and entity identifier (AC-81, ac-delta-18).

## Exception flows

### E1: Readonly attempts a destructive action
1. Readonly user opens a row extra menu or enters Multi-Select.
2. Destructive actions (Archive / Unarchive / Purge / Delete permanently) are hidden or disabled ([BR-11](../07-business-rules.md#br-11), ac-delta-20).

### E2: Cancel confirmation
1. Actor opens Archive / Purge / Delete permanently and dismisses the confirmation (Cancel / Esc / ×).
2. No state change; item stays in its current list (ac-delta-1, ac-delta-3, ac-delta-17).

### E3: Retention input rejected
1. Actor enters a negative or non-numeric retention value.
2. System rejects with inline validation; the prior valid value is retained (ac-delta-9).

### E4: RunGroup Purge exceeds 20 000 Runs
1. Actor attempts to Purge a group over the ceiling (ac-delta-19).
2. System blocks the action and surfaces guidance / an error; the group is not purged ([BR-10](../07-business-rules.md#br-10)).

## Postconditions

- **Success — Archive (finished):** Run exits the active list with the **Archived** badge; data preserved; reachable via Runs Archive.
- **Success — Archive (ongoing):** Run is **Terminated**, Pending → Skipped, badge **Terminated** (A1, AC-76, AC-80); cannot resume ([BR-8](../07-business-rules.md#br-8)).
- **Success — Purge:** Run / group in Archive with **Purged** badge; recorded statuses / attachments / custom statuses / Run ID / title preserved; stack traces removed ([BR-12](../07-business-rules.md#br-12)).
- **Success — Unarchive:** Run / group restored to active list with prior statuses (Terminated remains Terminated).
- **Success — Permanent delete:** Item gone from Archive; Pulse records a **Deleted Run** entry.
- **Failure:** No state change; item remains where it was.

## Business rules referenced

- [**BR-8**](../07-business-rules.md#br-8) — Terminated Runs cannot resume.
- [**BR-9**](../07-business-rules.md#br-9) — RunGroup cascade on Archive / Unarchive / Purge.
- [**BR-10**](../07-business-rules.md#br-10) — 20 000-Run Purge ceiling per RunGroup.
- [**BR-11**](../07-business-rules.md#br-11) — Readonly cannot perform destructive actions.
- [**BR-12**](../07-business-rules.md#br-12) — Automatic Purge retention default (90 days).

## Functional requirements covered

- AC-56, AC-57, AC-69 (archive/purge portion), AC-71 (archive/purge portion), AC-75, AC-76, AC-77, AC-78, AC-79, AC-80, AC-81, AC-100 (resolved for this sub-feature scope per ac-delta-20).
- `archive-and-purge-ac-delta.md` ac-delta-1..20.

## Related use cases

- **[UC-08](./UC-08-manage-rungroup.md)** — group-level Archive / Purge entry points; cascade semantics verified here.
- **[UC-10](./UC-10-manage-runs-list.md)** — Runs list row / Multi-Select entry points + Archive footer links.
- **[UC-11](./UC-11-view-run-report.md)** — Archive / Purge entry from Report extra menu.
- **[UC-04](./UC-04-finish-run.md)** — Archiving an ongoing Run terminates it (A1 here); Finish is the non-destructive alternative.

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-12 -->
<!-- sources: AC-56, AC-57, AC-69, AC-71, AC-75, AC-76, AC-77, AC-78, AC-79, AC-80, AC-81, archive-and-purge/ac-delta-1, archive-and-purge/ac-delta-2, archive-and-purge/ac-delta-3, archive-and-purge/ac-delta-4, archive-and-purge/ac-delta-5, archive-and-purge/ac-delta-6, archive-and-purge/ac-delta-7, archive-and-purge/ac-delta-8, archive-and-purge/ac-delta-9, archive-and-purge/ac-delta-10, archive-and-purge/ac-delta-11, archive-and-purge/ac-delta-12, archive-and-purge/ac-delta-13, archive-and-purge/ac-delta-14, archive-and-purge/ac-delta-15, archive-and-purge/ac-delta-16, archive-and-purge/ac-delta-17, archive-and-purge/ac-delta-18, archive-and-purge/ac-delta-19, archive-and-purge/ac-delta-20 -->
<!-- sub-feature: archive-and-purge -->

_63 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | low | archive-and-purge | [Filter archived groups by Finish Range @unclear](../../../../test-cases/manual-tests-execution/archive-and-purge/archive-pages.md) | archive-and-purge/ac-delta-11 |
| 2 | low | archive-and-purge | [Filter archived groups by Group type @unclear](../../../../test-cases/manual-tests-execution/archive-and-purge/archive-pages.md) | archive-and-purge/ac-delta-10 |
| 3 | normal | archive-and-purge | [Filter archived runs by ${run_type}](../../../../test-cases/manual-tests-execution/archive-and-purge/archive-pages.md) | archive-and-purge/ac-delta-6 |
| 4 | high | archive-and-purge | [Navigate to Runs Archive via ${entry_point}](../../../../test-cases/manual-tests-execution/archive-and-purge/archive-pages.md) | AC-77, archive-and-purge/ac-delta-5 |
| 5 | normal | archive-and-purge | [Rungroup Structure toggle switches between hierarchical and flat list](../../../../test-cases/manual-tests-execution/archive-and-purge/archive-pages.md) | archive-and-purge/ac-delta-7 |
| 6 | normal | archive-and-purge | [Runs Archive row displays ${badge} for ${state} @unclear](../../../../test-cases/manual-tests-execution/archive-and-purge/archive-pages.md) | archive-and-purge/ac-delta-16 |
| 7 | normal | archive-and-purge | [Runs Archive search with no matching title shows an empty result @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/archive-pages.md) | archive-and-purge/ac-delta-6 |
| 8 | normal | archive-and-purge | [Search archived groups by name in Groups Archive](../../../../test-cases/manual-tests-execution/archive-and-purge/archive-pages.md) | archive-and-purge/ac-delta-10 |
| 9 | normal | archive-and-purge | [Sort archived groups by ${sort_mode}](../../../../test-cases/manual-tests-execution/archive-and-purge/archive-pages.md) | archive-and-purge/ac-delta-12 |
| 10 | high | archive-and-purge | [Manager can perform ${destructive_action} on a run](../../../../test-cases/manual-tests-execution/archive-and-purge/permissions.md) | archive-and-purge/ac-delta-20 |
| 11 | normal | archive-and-purge | [Read-only user can browse Runs Archive and Groups Archive pages](../../../../test-cases/manual-tests-execution/archive-and-purge/permissions.md) | archive-and-purge/ac-delta-20 |
| 12 | critical | archive-and-purge | [Read-only user cannot ${destructive_action} @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/permissions.md) | archive-and-purge/ac-delta-20 |
| 13 | high | archive-and-purge | [Bulk permanent delete from Runs Archive Multi-select](../../../../test-cases/manual-tests-execution/archive-and-purge/restore-and-delete.md) | AC-81, archive-and-purge/ac-delta-17 |
| 14 | normal | archive-and-purge | [Bulk unarchive multiple runs from Runs Archive](../../../../test-cases/manual-tests-execution/archive-and-purge/restore-and-delete.md) | archive-and-purge/ac-delta-14 |
| 15 | high | archive-and-purge | [Cancelling the permanent-delete confirmation keeps the run in the Archive @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/restore-and-delete.md) | AC-81, archive-and-purge/ac-delta-17 |
| 16 | normal | archive-and-purge | [Cancelling the unarchive confirmation keeps the run in the Archive @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/restore-and-delete.md) | archive-and-purge/ac-delta-13 |
| 17 | critical | archive-and-purge | [Permanently delete a single run from the Archive via irreversible confirmation](../../../../test-cases/manual-tests-execution/archive-and-purge/restore-and-delete.md) | AC-81, archive-and-purge/ac-delta-17 |
| 18 | high | archive-and-purge | [Pulse records a Deleted Run event after permanent deletion @unclear](../../../../test-cases/manual-tests-execution/archive-and-purge/restore-and-delete.md) | AC-81, archive-and-purge/ac-delta-18 |
| 19 | high | archive-and-purge | [Unarchive a single run from Runs Archive @smoke](../../../../test-cases/manual-tests-execution/archive-and-purge/restore-and-delete.md) | archive-and-purge/ac-delta-13 |
| 20 | low | archive-and-purge | [Automatic purge runs on a daily cadence after the retention period @unclear](../../../../test-cases/manual-tests-execution/archive-and-purge/retention-settings.md) | AC-79 |
| 21 | low | archive-and-purge | [Configure retention at boundary value ${boundary_value} persists @boundary](../../../../test-cases/manual-tests-execution/archive-and-purge/retention-settings.md) | archive-and-purge/ac-delta-9 |
| 22 | high | archive-and-purge | [Configure retention to a positive number of days persists across reloads @smoke](../../../../test-cases/manual-tests-execution/archive-and-purge/retention-settings.md) | AC-79, archive-and-purge/ac-delta-8 |
| 23 | normal | archive-and-purge | [Default retention is 90 days when the project has no saved value](../../../../test-cases/manual-tests-execution/archive-and-purge/retention-settings.md) | AC-79, archive-and-purge/ac-delta-9 |
| 24 | high | archive-and-purge | [Retention input rejects ${invalid_value} @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/retention-settings.md) | archive-and-purge/ac-delta-9 |
| 25 | critical | archive-and-purge | [Archive a single run from the row extra menu @smoke](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-69, AC-75, archive-and-purge/ac-delta-1, archive-and-purge/ac-delta-16 |
| 26 | normal | archive-and-purge | [Bulk Archive button is disabled when no runs are selected @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-71, archive-and-purge/ac-delta-2 |
| 27 | critical | archive-and-purge | [Bulk archive multiple runs via Multi-select @smoke](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-71, archive-and-purge/ac-delta-2 |
| 28 | high | archive-and-purge | [Bulk purge multiple runs via Multi-select "Delete" action](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-71, archive-and-purge/ac-delta-2 |
| 29 | normal | archive-and-purge | [Cancelling the archive confirmation keeps the run active @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-75, archive-and-purge/ac-delta-1 |
| 30 | normal | archive-and-purge | [Cancelling the purge confirmation keeps the run active @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-78, archive-and-purge/ac-delta-3 |
| 31 | critical | archive-and-purge | [Purge a single run from the row extra menu @smoke](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-69, AC-78, archive-and-purge/ac-delta-3, archive-and-purge/ac-delta-16 |
| 32 | normal | archive-and-purge | [Purged run preserves statuses, attachments, and custom statuses but removes stack traces](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-78, archive-and-purge/ac-delta-4 |
| 33 | normal | archive-and-purge | [Select All link bulk-archives every run on the current page @boundary](../../../../test-cases/manual-tests-execution/archive-and-purge/run-actions.md) | AC-71, archive-and-purge/ac-delta-2 |
| 34 | high | archive-and-purge | [A restored Terminated run cannot be resumed @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/run-state-behavior.md) | AC-80, archive-and-purge/ac-delta-13 |
| 35 | normal | archive-and-purge | [Archiving a finished run preserves every test status](../../../../test-cases/manual-tests-execution/archive-and-purge/run-state-behavior.md) | AC-75, AC-76, archive-and-purge/ac-delta-1 |
| 36 | normal | archive-and-purge | [Archiving a Without-tests run succeeds with zero-test counts @boundary](../../../../test-cases/manual-tests-execution/archive-and-purge/run-state-behavior.md) | AC-75 |
| 37 | high | archive-and-purge | [Archiving an ongoing run terminates it and converts Pending tests to Skipped](../../../../test-cases/manual-tests-execution/archive-and-purge/run-state-behavior.md) | AC-76, AC-80, archive-and-purge/ac-delta-16 |
| 38 | high | archive-and-purge | [Purging an ongoing run terminates it and preserves recorded statuses](../../../../test-cases/manual-tests-execution/archive-and-purge/run-state-behavior.md) | AC-80, archive-and-purge/ac-delta-3 |
| 39 | critical | archive-and-purge | [Archive a RunGroup cascades to every nested run](../../../../test-cases/manual-tests-execution/archive-and-purge/rungroup-cascade.md) | AC-56, archive-and-purge/ac-delta-15 |
| 40 | high | archive-and-purge | [Cancelling the RunGroup archive confirmation leaves the group and nested runs untouched @negative](../../../../test-cases/manual-tests-execution/archive-and-purge/rungroup-cascade.md) | AC-56, archive-and-purge/ac-delta-1 |
| 41 | high | archive-and-purge | [Purge an archived RunGroup deletes the group and moves nested runs to Runs Archive](../../../../test-cases/manual-tests-execution/archive-and-purge/rungroup-cascade.md) | AC-57, archive-and-purge/ac-delta-15 |
| 42 | low | archive-and-purge | [Purging a RunGroup with more than 20 000 runs is blocked @boundary @unclear](../../../../test-cases/manual-tests-execution/archive-and-purge/rungroup-cascade.md) | AC-57, archive-and-purge/ac-delta-19 |
| 43 | high | archive-and-purge | [Unarchive a RunGroup from Groups Archive restores all nested runs @smoke](../../../../test-cases/manual-tests-execution/archive-and-purge/rungroup-cascade.md) | AC-56, archive-and-purge/ac-delta-15 |
| 44 | critical | run-groups | [Archive a RunGroup cascades to all nested runs @smoke](../../../../test-cases/manual-tests-execution/run-groups/archive-and-purge.md) | AC-56 |
| 45 | normal | run-groups | [Cancelling the archive confirmation dialog leaves the group untouched @negative](../../../../test-cases/manual-tests-execution/run-groups/archive-and-purge.md) | AC-56 |
| 46 | normal | run-groups | [Cancelling the purge confirmation leaves the group and nested runs on the active list @negative](../../../../test-cases/manual-tests-execution/run-groups/archive-and-purge.md) | AC-57 |
| 47 | high | run-groups | [Purge a RunGroup cascades with a Purged badge](../../../../test-cases/manual-tests-execution/run-groups/archive-and-purge.md) | AC-57 |
| 48 | high | run-groups | [Unarchive a RunGroup from Groups Archive restores all nested runs](../../../../test-cases/manual-tests-execution/run-groups/archive-and-purge.md) | AC-56 |
| 49 | normal | runs-list-management | [Archive entry links at the bottom of the Runs page navigate to ${archive_page}](../../../../test-cases/manual-tests-execution/runs-list-management/chart-and-toolbar.md) | AC-77 |
| 50 | normal | runs-list-management | [Expand-all toolbar button expands and collapses every visible RunGroup row](../../../../test-cases/manual-tests-execution/runs-list-management/chart-and-toolbar.md) | AC-69 |
| 51 | high | runs-list-management | [Bulk multi-select archive applies across every selected run end to end @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/cross-cutting.md) | AC-71 |
| 52 | high | runs-list-management | [Bulk Archive moves every selected run off the default list](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 53 | normal | runs-list-management | [Bulk Labels applies a label to every selected run](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 54 | high | runs-list-management | [Closing the bulk toolbar via the close button keeps selection hidden](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 55 | critical | runs-list-management | [Compare enables only at two or more selected runs and navigates to the comparison view @boundary](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 56 | normal | runs-list-management | [Deselecting the last selected run removes the bulk toolbar @boundary](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 57 | normal | runs-list-management | [Extra dropdown shows ${extra_items} at ${selection_size} @boundary](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 58 | normal | runs-list-management | [Merge action is absent in the Extra dropdown at a single selection @negative](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 59 | normal | runs-list-management | [Select all selects every visible run row in Multi-select mode](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 60 | critical | runs-list-management | [Toggling Multi-select on and off shows and hides the row checkboxes and bottom toolbar @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-71 |
| 61 | high | runs-list-management | [Move to Archive via row extra menu removes the run from the active list](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-69 |
| 62 | normal | runs-list-management | [Purge via row extra menu removes the run and shows the deletion toast](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-69 |
| 63 | high | runs-list-management | [Row extra menu exposes the ${state}-specific action set @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-69 |
<!-- end-trace -->
