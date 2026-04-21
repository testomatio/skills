# UC-11: View a Run detail and Report — QA Creator

<!-- use-case
id: UC-11
primary-actor: QA Creator
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** QA Creator (also performed by Manager / Owner / Tester; Readonly has view-only access).
**Stakeholders:** Tester (consumes Defects tab links, Description / Code template sub-tabs); stakeholders outside the project (consume Share-by-Email / Share-Publicly exports); downstream Archive / Purge ([UC-12](./UC-12-archive-unarchive-purge.md)).
**Goal:** Inspect a Run's results — overall summary, per-test outcomes, grouped overviews, Flaky Tests analytics (when applicable), Defects, Statistics — then Share, Compare, Export PDF, or Download as XLSX.
**Trigger:** Actor clicks a Run row on the Runs list ([UC-10](./UC-10-manage-runs-list.md)), deep-links to `/projects/{p}/runs/{id}`, or completes Finish in [UC-04](./UC-04-finish-run.md) and is navigated to the Report.
**Scope:** `run-detail-and-report` (owner). Touches `runs-list-management` (entry point from the list; Compare destination — [UC-10](./UC-10-manage-runs-list.md)), `run-lifecycle` (entered after Finish — [UC-04](./UC-04-finish-run.md)), `test-execution-runner` (the runner is the write-side counterpart — the Report is read-only), `archive-and-purge` (Extra menu exposes Archive / Purge — [UC-12](./UC-12-archive-unarchive-purge.md)).

## Preconditions

- Actor holds Read-Run permission on the project (see [02-actors-and-permissions.md](../02-actors-and-permissions.md#role--action-matrix)).
- Target Run exists in any state — the Report renders for In-Progress, Finished, and Terminated Runs; runner reachability is separate (see `test-execution-runner-ac-delta.md` ac-delta-1 — Finished / Terminated Runs open the Report instead of the Runner).
- For **Share Publicly**: Company-level *Sharing* flag **AND** Project-level *Sharing* flag are enabled ([BR-13](../07-business-rules.md#br-13), AC-90).

## Main success scenario — open Basic Report, drill into a test

1. Actor clicks a Run row on the Runs list ([UC-10](./UC-10-manage-runs-list.md) main flow).
2. System opens the **Basic Run Report** with (AC-82, `run-detail-and-report-ac-delta.md` ac-delta-1):
   - **Header** — Run title, status chip (In-Progress / Finished / Terminated), created-by + created-at, environment chips (one per env when multi-env), quick counters (Passed / Failed / Skipped / Pending / Custom).
   - **Tabs** — *Tests · Statistics · Defects* (AC-83).
3. Actor is on the default **Tests** tab (ac-delta-2) — tests grouped by suite; each row shows status icon, title, duration, assignee avatar (when assigned), custom-status badge (when set).
4. Actor clicks a test row — System opens the **test sub-panel** on the right (ac-delta-3); the row stays highlighted; the panel persists across test switches until explicitly closed.
5. Sub-panel exposes tabs (AC-84): **Summary** (default — ac-delta-4) · **Description** (read-only markdown — ac-delta-5) · **Code Template** (automation code, empty state for manual-only — ac-delta-6) · **Runs** (prior runs of this test; each row clickable — ac-delta-7).

## Alternate flows

### A1: Filter / sort / search / keyboard nav on the Tests tab
1. Actor applies filter chips: **status / type / messages / custom-status / assignee** — chips combine with AND semantics; the filter button shows a chip-count badge (AC-85, ac-delta-13).
2. Actor sorts by **Suite / Name / Failure-first** with ASC/DESC toggles; sort persists within the session (ac-delta-15).
3. Actor searches free-text over title + result message; filter persists until cleared (ac-delta-12).
4. Actor uses **↑ / ↓** to move selection between tests; **Enter** opens the sub-panel; **Esc** closes it (AC-86, ac-delta-14).

### A2: Statistics tab
1. Actor clicks **Statistics** (AC-83, ac-delta-8).
2. System renders aggregate counts + percentage split of statuses + duration totals; the tab re-renders when filters from the Tests tab are applied.

### A3: Defects tab
1. Actor clicks **Defects** (AC-83, ac-delta-9).
2. System lists tests that have linked issues / defects; each row links to the defect tracker (Jira / GitHub) when a link is configured.
3. Empty state renders when no defects are linked. **Behaviour details UNCLEAR** — whether add/remove a defect link is supported inside this tab is tracked in [13-open-questions.md § OQ-04](../13-open-questions.md#oq-04) (AC-98 UNCLEAR).

### A4: Extended Run Report (grouped overview)
1. Actor switches to the **Extended** view (AC-86, ac-delta-10).
2. System shows a grouped overview with dimensions **Suites / Tags / Labels / Assignees / Priorities**; switching dimensions re-renders the list without reloading.
3. The **Flaky Tests Analytics** section renders **only** when the Run contains tests with flaky history (≥ 2 prior Runs with status changes — ac-delta-11). Otherwise the section is hidden.
4. Run Report Summary is rendered (AC-86).

### A5: Download as Spreadsheet (XLSX)
1. Actor opens the Report extra menu → **Download as Spreadsheet** (AC-87, ac-delta-16).
2. System generates an XLSX named e.g. `Run-{id}.xlsx` with one row per test (status / duration / message / assignee).

### A6: Export as PDF
1. Actor opens the Report extra menu → **Export as PDF** (AC-88, ac-delta-17).
2. System generates a PDF mirroring the current view (Basic or Extended) including Run Report Summary and active filters.

### A7: Share by Email
1. In the **Extended** view, Actor opens **Share Report by Email** (AC-89, ac-delta-18).
2. Actor enters a comma-separated email list.
3. Invalid email formats — rejected inline with an error; submit is blocked.
4. On Submit, a success toast confirms send.

### A8: Share Publicly (URL + passcode)
**Applies when Company + Project *Sharing* flag are enabled — [BR-13](../07-business-rules.md#br-13), AC-90.**
1. In the **Extended** view, Actor opens **Share Publicly** (AC-90).
2. Dialog shows (ac-delta-19):
   - **Expiration** selector — *1 day / 7 days / 30 days / custom* (default **7 days**).
   - **Protect by passcode** toggle (**default ON**).
3. On confirm, System generates a public **URL** + **Passcode** shown once (both copyable). [BR-13](../07-business-rules.md#br-13) enforces the defaults.
4. **Stop Sharing** — later click immediately revokes the URL (AC-91, ac-delta-20); subsequent attempts to load the URL return a revoked/expired state.

### A9: Compare selected Runs
1. Actor enters Compare either via **Multi-select → Compare** on the Runs list ([UC-10 A3](./UC-10-manage-runs-list.md#a3-multi-select--bulk-action), AC-92) or via the Report's own Compare affordance.
2. System opens a side-by-side matrix of test statuses across selected Runs; rows where statuses differ are highlighted (ac-delta-21).

### A10: Custom Report-view Settings
1. Actor opens the Report's Custom view Settings (distinct from the Runs list's Custom view).
2. Toggles columns (**Duration / Assignee / Labels / Tags / Envs / Custom Status / …**); width + visibility persist per-project, per-user (ac-delta-22).

### A11: Copy Link — UNCLEAR
1. Actor looks for a non-public **Copy Link** action on the Report extra menu (AC-99).
2. **UNCLEAR** — presence and behaviour (copies app URL to clipboard?) are to be verified; tracked in [13-open-questions.md § OQ-20](../13-open-questions.md#oq-20).

### A12: Multi-environment — per-env breakdown
1. When the Run was created with ≥ 2 environment groups ([UC-07 A1 / A2](./UC-07-configure-environments.md#a1-multi-group--launch-in-sequence)), the Report surfaces an **Environment** column / filter; Statistics rolls up per-environment counts (Concern A, ac-delta-1 header env chips).

### A13: Multi-user — filter / group by assignee
1. Tests tab — filter by assignee (AC-85); Extended Report groups by **Assignees** (ac-delta-10). Concern B — consumes the per-test assignment from [UC-06](./UC-06-assign-testers.md).

### A14: Custom status — filter
1. Tests tab — custom-status filter chip restricts the list to tests with the chosen custom status (ac-delta-13, concern E).

## Exception flows

### E1: Share Publicly attempted with Sharing flag disabled
1. Company- or Project-level *Sharing* is disabled.
2. System disables / hides the Share Publicly action (AC-90, [BR-13](../07-business-rules.md#br-13)). Permission surface **UNCLEAR** — see [13-open-questions.md § OQ-06](../13-open-questions.md#oq-06) (AC-100 UNCLEAR).

### E2: Empty sub-panel sections
1. Test has no attachments / no steps / no message / no prior runs / no code template.
2. Each sub-tab renders a neutral empty state, not an error (ac-delta-4, ac-delta-6, ac-delta-7).

### E3: Email share with invalid addresses
1. Actor submits a list with malformed emails.
2. System rejects inline; no send occurs (ac-delta-18).

## Postconditions

- **Success — view:** Actor has observed the Run's outcome at the chosen granularity (Basic / Extended / Statistics / Defects / sub-panel).
- **Success — Share:** Recipient has either an emailed report (A7) or a revocable public URL + passcode (A8, AC-91).
- **Success — Export / Download:** An XLSX or PDF artefact is produced mirroring the current view.
- **Success — Compare:** Multiple Runs are rendered side-by-side with differences highlighted.
- **Failure:** No artefact is produced / no link is generated; the Report view is unchanged.

## Business rules referenced

- [**BR-13**](../07-business-rules.md#br-13) — Public Share preconditions (Company + Project *Sharing* flag; passcode ON by default; 7-day expiration default).

## Functional requirements covered

- AC-82, AC-83, AC-84, AC-85, AC-86, AC-87, AC-88, AC-89, AC-90, AC-91, AC-92, AC-98 (UNCLEAR), AC-99 (UNCLEAR).
- `run-detail-and-report-ac-delta.md` ac-delta-1..22.

## Related use cases

- **[UC-04](./UC-04-finish-run.md)** — Finish navigates here.
- **[UC-10](./UC-10-manage-runs-list.md)** — entry point + Compare entry from Multi-select.
- **[UC-05](./UC-05-relaunch-run.md)** — Relaunch ▾ is an entry point on the Report extra menu.
- **[UC-12](./UC-12-archive-unarchive-purge.md)** — Archive / Purge on the Report extra menu.

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-11 -->
<!-- sources: AC-82, AC-83, AC-84, AC-85, AC-86, AC-87, AC-88, AC-89, AC-90, AC-91, AC-92, AC-98, AC-99, run-detail-and-report/ac-delta-1, run-detail-and-report/ac-delta-2, run-detail-and-report/ac-delta-3, run-detail-and-report/ac-delta-4, run-detail-and-report/ac-delta-5, run-detail-and-report/ac-delta-6, run-detail-and-report/ac-delta-7, run-detail-and-report/ac-delta-8, run-detail-and-report/ac-delta-9, run-detail-and-report/ac-delta-10, run-detail-and-report/ac-delta-11, run-detail-and-report/ac-delta-12, run-detail-and-report/ac-delta-13, run-detail-and-report/ac-delta-14, run-detail-and-report/ac-delta-15, run-detail-and-report/ac-delta-16, run-detail-and-report/ac-delta-17, run-detail-and-report/ac-delta-18, run-detail-and-report/ac-delta-19, run-detail-and-report/ac-delta-20, run-detail-and-report/ac-delta-21, run-detail-and-report/ac-delta-22 -->
<!-- sub-feature: run-detail-and-report -->

_63 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | normal | run-detail-and-report | [Compare action requires at least two runs to be selected @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | AC-92 |
| 2 | critical | run-detail-and-report | [Compare at least two finished runs from the Runs list navigates to the Compare matrix @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | AC-92 |
| 3 | high | run-detail-and-report | [Compare matrix renders per-run status cells with test titles as row links @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | AC-92, run-detail-and-report/ac-delta-21 |
| 4 | low | run-detail-and-report | [Compare matrix renders with four runs selected at the supported maximum @boundary](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | AC-92, run-detail-and-report/ac-delta-21 |
| 5 | normal | run-detail-and-report | [Compare view renders correctly across runs with different environments and assignees](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | run-detail-and-report/ac-delta-21 |
| 6 | low | run-detail-and-report | [Manually entering the Compare URL with a single run id renders a neutral empty or fallback state @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | AC-92 |
| 7 | normal | run-detail-and-report | [Rows where statuses differ across runs are visually highlighted](../../../../test-cases/manual-tests-execution/run-detail-and-report/compare-runs.md) | run-detail-and-report/ac-delta-21 |
| 8 | critical | run-detail-and-report | [Copy Link button in the report header copies the report URL to clipboard @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-99 |
| 9 | normal | run-detail-and-report | [Extra menu Download as Spreadsheet triggers an XLSX download @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-87, run-detail-and-report/ac-delta-16 |
| 10 | high | run-detail-and-report | [Extra menu Export as PDF triggers a PDF download of the current report view @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-88, run-detail-and-report/ac-delta-17 |
| 11 | normal | run-detail-and-report | [Make Public Report with the minimum 1-day Expiration generates a short-lived URL @boundary](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-90, run-detail-and-report/ac-delta-19 |
| 12 | normal | run-detail-and-report | [Passcode is shown only once and cannot be recovered after the dialog is closed @boundary](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-91, run-detail-and-report/ac-delta-19 |
| 13 | normal | run-detail-and-report | [Public share URL rejects an incorrect passcode @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-91 |
| 14 | normal | run-detail-and-report | [Report Custom view Settings toggles column visibility on the Tests tab](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | run-detail-and-report/ac-delta-22 |
| 15 | normal | run-detail-and-report | [Share by Email with ${email_count} email(s) sends the report to every recipient @boundary](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-89, run-detail-and-report/ac-delta-18 |
| 16 | normal | run-detail-and-report | [Share by Email with an empty input surfaces an inline validation error @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-89, run-detail-and-report/ac-delta-18 |
| 17 | high | run-detail-and-report | [Share report by Email accepts comma-separated emails and rejects invalid format @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-89, run-detail-and-report/ac-delta-18 |
| 18 | high | run-detail-and-report | [Share Report Publicly generates a URL and passcode with default Expiration and Protect-by-passcode ON @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-90, AC-91, run-detail-and-report/ac-delta-19 |
| 19 | high | run-detail-and-report | [Stop Sharing revokes the public URL and blocks subsequent unauthenticated access @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/exports-and-sharing.md) | AC-91, run-detail-and-report/ac-delta-20 |
| 20 | normal | run-detail-and-report | [Close the Run Detail panel returns to the Runs list](../../../../test-cases/manual-tests-execution/run-detail-and-report/navigation-and-header.md) | AC-82 |
| 21 | normal | run-detail-and-report | [Multi-environment run shows per-environment chips in the Detail header](../../../../test-cases/manual-tests-execution/run-detail-and-report/navigation-and-header.md) | run-detail-and-report/ac-delta-1 |
| 22 | normal | run-detail-and-report | [Navigate to a non-existent run id shows a not-found state @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/navigation-and-header.md) | AC-82 |
| 23 | critical | run-detail-and-report | [Open a finished run from the Runs list lands on Run Detail with Tests tab active @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/navigation-and-header.md) | AC-82, run-detail-and-report/ac-delta-1 |
| 24 | high | run-detail-and-report | [Run Detail header surfaces run metadata summary @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/navigation-and-header.md) | run-detail-and-report/ac-delta-1 |
| 25 | high | run-detail-and-report | [Switch to the ${tab} tab reveals its dedicated content area @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/navigation-and-header.md) | AC-83, run-detail-and-report/ac-delta-1 |
| 26 | high | run-detail-and-report | [Switching tabs preserves the active test selection and applied filters](../../../../test-cases/manual-tests-execution/run-detail-and-report/navigation-and-header.md) | AC-83, run-detail-and-report/ac-delta-3 |
| 27 | normal | run-detail-and-report | [Analytics section is hidden when the run has no flaky-test history @boundary](../../../../test-cases/manual-tests-execution/run-detail-and-report/report-overview.md) | run-detail-and-report/ac-delta-11 |
| 28 | normal | run-detail-and-report | [Analytics section renders the Flaky Tests chart when flaky history exists](../../../../test-cases/manual-tests-execution/run-detail-and-report/report-overview.md) | run-detail-and-report/ac-delta-11 |
| 29 | low | run-detail-and-report | [Keyboard shortcuts reference modal opens from the report page](../../../../test-cases/manual-tests-execution/run-detail-and-report/report-overview.md) | AC-86 |
| 30 | critical | run-detail-and-report | [Open the Report page shows the test list alongside the Summary and Overview panel @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/report-overview.md) | AC-82, AC-86 |
| 31 | normal | run-detail-and-report | [Overview grouping by a dimension with no matching data renders a neutral empty bucket list @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/report-overview.md) | AC-86, run-detail-and-report/ac-delta-10 |
| 32 | high | run-detail-and-report | [Overview grouping by Assignees buckets tests under each tester on a multi-assignee run](../../../../test-cases/manual-tests-execution/run-detail-and-report/report-overview.md) | AC-86, run-detail-and-report/ac-delta-10 |
| 33 | normal | run-detail-and-report | [Switch the Overview grouping to ${grouping} rebuckets the list without reloading @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/report-overview.md) | AC-86, run-detail-and-report/ac-delta-10 |
| 34 | low | run-detail-and-report | [Tree View toggle on the Report page switches between flat list and tree-grouped layout](../../../../test-cases/manual-tests-execution/run-detail-and-report/report-overview.md) | run-detail-and-report/ac-delta-13 |
| 35 | normal | run-detail-and-report | [Defects tab lists linked defects for tests that have them](../../../../test-cases/manual-tests-execution/run-detail-and-report/statistics-and-defects.md) | AC-98, run-detail-and-report/ac-delta-9 |
| 36 | high | run-detail-and-report | [Defects tab shows empty-state links when the run has no linked defects @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/statistics-and-defects.md) | AC-98, run-detail-and-report/ac-delta-9 |
| 37 | low | run-detail-and-report | [Folders toggle in the Statistics Suites section collapses and expands nested folders](../../../../test-cases/manual-tests-execution/run-detail-and-report/statistics-and-defects.md) | run-detail-and-report/ac-delta-8 |
| 38 | normal | run-detail-and-report | [Sort and status filter icons in a Statistics section reorder its rows](../../../../test-cases/manual-tests-execution/run-detail-and-report/statistics-and-defects.md) | run-detail-and-report/ac-delta-8 |
| 39 | normal | run-detail-and-report | [Statistics tab groups counts under Suites, Tags, Labels, Assignees, Priorities, Custom Statuses @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/statistics-and-defects.md) | AC-83, run-detail-and-report/ac-delta-8 |
| 40 | normal | run-detail-and-report | [Statistics tab surfaces per-environment counts on a multi-environment run](../../../../test-cases/manual-tests-execution/run-detail-and-report/statistics-and-defects.md) | run-detail-and-report/ac-delta-8 |
| 41 | critical | run-detail-and-report | [Click a test row opens the sub-panel with the row visibly highlighted @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/test-sub-panel.md) | AC-84, run-detail-and-report/ac-delta-3 |
| 42 | normal | run-detail-and-report | [Close the sub-panel via Escape returns the list to full width](../../../../test-cases/manual-tests-execution/run-detail-and-report/test-sub-panel.md) | run-detail-and-report/ac-delta-14 |
| 43 | normal | run-detail-and-report | [Code template tab shows the test's code template with a copy control](../../../../test-cases/manual-tests-execution/run-detail-and-report/test-sub-panel.md) | AC-84, run-detail-and-report/ac-delta-6 |
| 44 | normal | run-detail-and-report | [Description tab renders the test description and is read-only in run context](../../../../test-cases/manual-tests-execution/run-detail-and-report/test-sub-panel.md) | AC-84, run-detail-and-report/ac-delta-5 |
| 45 | normal | run-detail-and-report | [Runs sub-tab for a test without prior runs shows the empty-state message @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/test-sub-panel.md) | AC-84, run-detail-and-report/ac-delta-7 |
| 46 | normal | run-detail-and-report | [Runs tab lists the test's prior runs and links back to each run's report](../../../../test-cases/manual-tests-execution/run-detail-and-report/test-sub-panel.md) | AC-84, run-detail-and-report/ac-delta-7 |
| 47 | high | run-detail-and-report | [Sub-panel exposes Summary, Description, Code template, and Runs tabs @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/test-sub-panel.md) | AC-84 |
| 48 | normal | run-detail-and-report | [Summary tab shows the last execution status, message, and step results](../../../../test-cases/manual-tests-execution/run-detail-and-report/test-sub-panel.md) | AC-84, run-detail-and-report/ac-delta-4 |
| 49 | normal | run-detail-and-report | [Swapping selection between tests keeps the sub-panel open](../../../../test-cases/manual-tests-execution/run-detail-and-report/test-sub-panel.md) | run-detail-and-report/ac-delta-3 |
| 50 | normal | run-detail-and-report | [Combining Passed and Failed filters shows tests in either status](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | AC-85, run-detail-and-report/ac-delta-13 |
| 51 | high | run-detail-and-report | [Filter by Assignee on a multi-assignee run shows only tests for that assignee](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | AC-85, run-detail-and-report/ac-delta-13 |
| 52 | normal | run-detail-and-report | [Filter by Assignee with no matching tests renders the empty-state message @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | AC-85, run-detail-and-report/ac-delta-13 |
| 53 | high | run-detail-and-report | [Filter by Custom Status on a run with custom statuses narrows the list to matching tests](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | AC-85, run-detail-and-report/ac-delta-13 |
| 54 | normal | run-detail-and-report | [Keyboard navigation ↑ and ↓ moves selection between test rows and Esc closes the sub-panel](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | AC-86, run-detail-and-report/ac-delta-14 |
| 55 | normal | run-detail-and-report | [Search in the Tests tab filters rows by title or result message in real time @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | AC-85, run-detail-and-report/ac-delta-12 |
| 56 | low | run-detail-and-report | [Search input accepts a query at the 500-character length @boundary](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | run-detail-and-report/ac-delta-12 |
| 57 | normal | run-detail-and-report | [Search with no matches renders the empty-state message @negative](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | run-detail-and-report/ac-delta-12 |
| 58 | normal | run-detail-and-report | [Sort the test list by ${sort_dimension} reorders rows accordingly @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | AC-85, run-detail-and-report/ac-delta-15 |
| 59 | normal | run-detail-and-report | [Status filter button ${status} narrows the list to matching tests @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | AC-85, run-detail-and-report/ac-delta-13 |
| 60 | critical | run-detail-and-report | [Test rows are grouped by suite with status, title, and duration metadata @smoke](../../../../test-cases/manual-tests-execution/run-detail-and-report/tests-tab.md) | AC-82, run-detail-and-report/ac-delta-2 |
| 61 | critical | runs-list-management | [Compare enables only at two or more selected runs and navigates to the comparison view @boundary](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-92 |
| 62 | normal | runs-list-management | [Extra dropdown shows ${extra_items} at ${selection_size} @boundary](../../../../test-cases/manual-tests-execution/runs-list-management/multi-select.md) | AC-87 |
| 63 | high | runs-list-management | [Row extra menu exposes the ${state}-specific action set @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/row-extra-menu.md) | AC-88 |
<!-- end-trace -->
