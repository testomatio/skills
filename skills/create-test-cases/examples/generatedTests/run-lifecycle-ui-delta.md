---
feature: manual-tests-execution
suite: run-lifecycle
scope: sub-feature-delta
mode: sub-feature-delta
references: _shared-ui.md
entry_url: https://app.testomat.io/projects/project-for-testing/runs/
explored_at: 2026-04-18T11:30:00Z
explored_by: ui-explorer
delta_elements: 42
verified_flows: 4
gaps: 1
---

# UI Element Catalog: run-lifecycle (Delta)

**Last updated:** 2026-04-18
**Env:** beta
**Collected by:** Playwright MCP
**References shared surfaces:** `_shared-ui.md` — do NOT re-catalog elements defined there.

---

## Screen: Runs List – Row Context Menu (Lifecycle variant for FINISHED run)

**URL:** /projects/project-for-testing/runs/
**Entry points:** Finished run row → context menu button (⋯)

### Buttons / Menu items (FINISHED run — manual)

- **'Relaunch'** — button, `btn-only-icon btn-md` parent; navigates directly to `/runs/launch/{id}?entry={firstTestId}`; reuses original Run ID, resets pending tests. Visible on FINISHED manual runs. (AC-58, ac-delta-8)
- **'Advanced Relaunch'** — link, `/runs/{id}/advanced`; opens Advanced Relaunch sidebar/modal. Visible on FINISHED runs. (AC-62)
- **'Launch a Copy'** — button; creates a new duplicate run and navigates to its runner. Visible on FINISHED manual runs. (AC-67)

**Separator** (between Move and Labels — unchanged from shared baseline context menu)

Note: **'Relaunch Failed on CI'**, **'Relaunch All on CI'**, **'Relaunch Manually'** are NOT present on pure manual runs. These CI-routing variants appear only on runs that contain automated tests (automated or mixed run type). No automated/mixed runs existed in `project-for-testing` during exploration.

### Buttons / Menu items (UNFINISHED/IN-PROGRESS run)

- **'Launch'** — link, `/runs/launch/{id}`; re-enters the runner for an ongoing run. Equivalent of "Continue". Visible on UNFINISHED runs only. (AC-24, ac-delta-7)
- **'Advanced Relaunch'** — link, `/runs/{id}/advanced`; opens Advanced Relaunch modal even for unfinished runs.
- **'Edit'** — link, `/runs/edit/{id}`; opens Edit Run form for the run. Visible on UNFINISHED runs only.
- **'Finish'** — button; triggers the Finish Run confirmation dialog from the list row directly. Visible on UNFINISHED runs only.

**Separator** (between Move and Labels)

**Mutual exclusivity:** FINISHED runs show `Relaunch / Launch a Copy`. UNFINISHED runs show `Launch / Edit / Finish`. These menus are mutually exclusive by run state.

---

## Screen: Run Detail Panel – Lifecycle Actions (UNFINISHED run)

**URL:** /projects/project-for-testing/runs/{id}/ (panel)
**Entry points:** Run list → click unfinished run row

### Buttons / Links (UNFINISHED run — delta from shared panel)

- **'Continue'** — link, `href: /projects/{project}/runs/launch/{id}/`; visible ONLY on unfinished/running runs. NOT present on finished runs. Navigates to Manual Runner. (AC-24, ac-delta-7)
- **'Edit'** — link, icon-only (`md-icon-pencil`), `href: /runs/edit/{id}`; visible on unfinished runs in detail panel header. (AC-27)

Note: The shared `_shared-ui.md` § Run Detail Panel already catalogs Copy Settings, Run Summary, Report, Edit icon, Close. The `Continue` link and unfinished-state-specific placement is the delta.

---

## Screen: Run Report Page – Extra Menu (FINISHED run)

**URL:** /projects/project-for-testing/runs/{id}/report/
**Entry points:** Run detail panel → Report link

### Extra Menu (lifecycle-relevant items only)

- **'Relaunch'** — button; same behavior as row-level Relaunch — opens runner for same run ID. (AC-58)
- **'Advanced Relaunch'** — link, `/runs/{id}/advanced`. (AC-62)
- **'Launch a Copy'** — button; duplicates run and opens runner. (AC-67)

Additional items in report extra menu (not lifecycle-owned, but present): **Share report by Email**, **Download as Spreadsheet**, **Share Report Publicly** — owned by run-detail-and-report sub-feature.

---

## Screen: Advanced Relaunch Modal/Sidebar

**URL:** /projects/project-for-testing/runs/{id}/advanced
**Entry points:** Row extra menu → Advanced Relaunch; Run Report extra menu → Advanced Relaunch

### Header

- **'Advanced Relaunch'** — modal/sidebar heading (string in page header bar)
- **Run title** — `h3` inside modal, shows source run title e.g., "Manual tests at 15 Apr 2026 11:19"
- **Close (×)** — icon button (`md-icon-close`); dismisses modal, returns to Runs list

### Inputs

- **Title** — `textbox`, `id: ember237` (dynamic), placeholder `"Title (optional)"`; if blank, relaunch inherits source run title. (AC-62, ac-delta-13)

### Toggles

- **'Create new run'** — `checkbox`, `id: ember238` (dynamic); default OFF; when ON creates a new Run ID; when OFF reuses original Run ID and only resets selected tests to Pending. (AC-63, AC-64)
- **'Keep values'** — `checkbox`, `id: ember239` (dynamic); default OFF; **DISABLED** (greyed out) while Create new run is OFF; becomes enabled when Create new run is ON. When enabled, preserves selected test statuses instead of resetting to Pending. (AC-65, ac-delta-11)
- **Keep values help icon** — `?` icon adjacent to 'Keep values' label; tooltip accessed via `aria-describedby` (not captured — popper not triggered in exploration).

### Status Filter Buttons (in Advanced Relaunch modal)

- **Passed N** / **Failed N** / **Skipped N** / **Pending N** — filter buttons (`secondary-btn btn-md`); filter the test list to a specific status. Applied filter narrows which tests are visible and selectable. (AC-66, ac-delta-12)
- **Loading spinner** — `md-icon-loading` icon button adjacent to status buttons; visible while data loads

### Test Selection Area

- **'Select'** — split button (`secondary-btn btn-md btn-icon-after`); opens dropdown with:
  - **'Select All (N)'** — button; selects all tests matching current filter. N is the filtered test count.
  - **'None'** — button; deselects all tests.
  (ac-delta-12, AC-66)
- **Search** — combobox, placeholder `"Search by title/message"`; filters test list by title/message.
- **Sort** — button (`secondary-btn btn-md btn-icon-after`) with dropdown; sorts test list.
- **Sort direction toggle** — icon button (↓); toggles ascending/descending sort.
- **Per-test checkboxes** — `checkbox`, `id: select-test-checkbox-{testId}` pattern; each test row has its own checkbox for individual selection. (AC-62, ac-delta-12)

### Buttons (modal actions)

- **'Relaunch'** — primary button (`primary-btn btn-lg`); confirms relaunch with current settings. When Create new run is ON → navigates to new run's runner. When Create new run is OFF → navigates to original run's runner at reset pending tests. (ac-delta-2)
- **'Cancel'** — secondary button; dismisses modal without action.

### Visibility/Gating

- Advanced Relaunch is accessible from BOTH finished and unfinished runs.
- Create-new-run OFF + Keep-values disabled: relaunch resets only selected tests to Pending in ORIGINAL run.
- Create-new-run ON + Keep-values OFF: new run created, selected tests reset to Pending.
- Create-new-run ON + Keep-values ON: new run created, selected test statuses preserved.

---

## Screen: Finish Run Confirmation (Browser Native Dialog)

**Entry points:** Manual Runner → 'Finish Run' button click

### Dialog

- **Type:** Browser native `confirm()` dialog (NOT an in-page modal)
- **Message:** `"{N} tests were not run. Pending tests that are not linked to any other test result will be marked as skipped."` where `{N}` is the actual count of pending/unrun tests at the time of clicking.
- **'OK'** button — browser default; accepts, finishes the run, navigates to run detail. Pending tests become Skipped. (AC-25, AC-26, AC-28)
- **'Cancel'** button — browser default; dismisses dialog, run remains in ongoing state, runner stays open. (ac-delta-10)

### Verified exact message text

From exploration (run with 2507 pending tests): `"2507 tests were not run. Pending tests that are not linked to any other test result will be marked as skipped."`

---

## Screen: Edit Run Form (Lifecycle-specific deltas)

**URL:** /projects/project-for-testing/runs/edit/{id}/
**Entry points:** Row context menu → Edit; Run Detail panel → Edit link

Note: `_shared-ui.md` § Edit Run Page catalogs base form fields (Title, Assign users, Environment, Description, Save, Cancel, Remove assign users, Test search). The following are DELTA elements not in the shared baseline.

### Form Header

- **'Edit manual run'** — `h3` form heading; includes `manual` type badge
- **Back arrow** — icon button (`md-icon-arrow-left`); navigates back to run detail panel
- **Manager chip** — shows current user avatar + username + `"as manager"` label (read-only)

### Test Selection Tabs

- **'Current tests N'** — `li[role="tab"]`, `data-tab="current"`, selected by default; shows existing tests in the run with their current status indicators (●). Test count badge shown.
- **'+ Tests 0'** (tab text: "Tests" with `data-tab="add tests"`) — `li[role="tab"]`; switch to this tab to search and add individual tests or suites to the run. Added tests appear as Pending. (AC-27, ac-delta-3)
- **'+ Plans 0'** (tab text: "Plans" with `data-tab="add plans"`) — `li[role="tab"]`; switch to select test plans to append to run. Tests from plan appear as Pending. (AC-27, ac-delta-4)

### Test Row Controls (in Current tests tab)

- **Row-level Trash / Delete button** — icon-only (`third-btn btn-only-icon btn-sm`, icon class `md-icon-delete-outline`); removes that specific test from the run. Removal takes effect after 'Save'. (AC-27, ac-delta-5)
- **Test status indicator** — colored circle ● (green = passed, red = failed, gray = skipped, orange = pending) next to each test row. Read-only in edit form context.

### Assignee Section Controls

- **'Select All'** — button; assigns all project members as testers. (AC-27)
- **'Remove assign users'** — button; removes all current tester assignments. (AC-27)

### Toasts

- Success: `"Run has been updated"` (after Save) — exact text to be confirmed; not captured during exploration due to cleanup constraint. (ac-delta-6)
- No toast on Cancel; form closes without saving.

---

## Happy-path sequence

1. Navigate to Runs list (`/runs/`)
2. Open context menu (⋯) on an in-progress run → click **'Launch'** → opens runner at `/runs/launch/{id}/`
3. Mark 1-2 tests with PASSED, FAILED, or SKIPPED
4. Click **'Finish Run'** → browser confirm dialog appears with `"{N} tests were not run. Pending tests that are not linked to any other test result will be marked as skipped."`
5. Click **'OK'** → run finishes, navigate to run detail
6. Verify run status changed to finished (green ● or red ●)
7. Open context menu on finished run → verify menu shows **'Relaunch'**, **'Advanced Relaunch'**, **'Launch a Copy'** (not 'Launch', 'Edit', 'Finish')
8. Click **'Relaunch'** → runner opens for same run ID

---

## Verified Flows

### Flow 1: Finish Run dialog cancel (AC-28, ac-delta-10)
1. Navigate to runner for in-progress run (`/runs/launch/{id}`)
2. Click **'Finish Run'** button
3. Verify browser confirm dialog appears: `"N tests were not run. Pending tests that are not linked to any other test result will be marked as skipped."`
4. Click **'Cancel'** (browser dialog)
5. Verify: runner remains open, run status unchanged, no navigation occurs.

### Flow 2: Relaunch finished manual run (AC-58, ac-delta-8)
1. Navigate to Runs list
2. Open context menu (⋯) on finished run → click **'Relaunch'**
3. Verify: browser navigates immediately to `/runs/launch/{id}?entry={testId}` (same run ID)
4. Verify: runner opens, original tests visible with their previous statuses.
(Observed: run `62b4b24b` relaunched — URL remained same `/runs/launch/62b4b24b`, tests showed Skipped 3 from prior execution)

### Flow 3: Advanced Relaunch — Create new run OFF (AC-64, ac-delta-11 state check)
1. Navigate to Runs list → open context menu on finished run → **Advanced Relaunch**
2. Verify modal opens with title input and toggles
3. Verify: **'Create new run'** toggle is unchecked (OFF) by default
4. Verify: **'Keep values'** toggle is disabled (grayed out) while Create new run is OFF
5. Check "Select All (N)" dropdown has N = total test count
6. Click **'Cancel'** → no changes.

### Flow 4: Continue unfinished run from Run Detail panel (AC-24, ac-delta-7)
1. Navigate to Runs list → click unfinished run row → detail panel opens
2. Verify: **'Continue'** link is visible in panel header (not present on finished runs)
3. Click **'Continue'** → navigates to `/runs/launch/{id}/`
4. Verify: runner opens at the last active/next pending test entry.

---

## Open Questions / Gaps

**Gap 1 (ac-delta-1):** "Launch a Copy Manually" variant — **NOT FOUND** in the UI. Only "Launch a Copy" (generic) exists in the row context menu and Run Report extra menu for manual runs. The AC specifies a "Launch a Copy Manually" variant distinct from "Launch a Copy", but this option does not appear in `project-for-testing` for manual runs. May only appear on automated or mixed runs (none exist in project). Cannot verify without an automated or mixed run to inspect.
- AC-delta-1 is partially unverifiable without automated/mixed run data.
- AC-59, AC-60, AC-61 (Relaunch Failed on CI / Relaunch All on CI / Relaunch Manually) also unverifiable — no automated/mixed runs exist in the project.

**Gap 2 (ac-delta-6 toast):** Exact "Save" toast text for Edit Run form not captured due to cleanup constraint (editing would have permanently altered shared test data). Expected: `"Run has been updated"` — unconfirmed.

---

## Conventions (run-lifecycle specific)

- **State gate:** UNFINISHED runs show `Launch / Edit / Finish / Advanced Relaunch` in row menu. FINISHED runs show `Relaunch / Advanced Relaunch / Launch a Copy`. These are mutually exclusive.
- **'Relaunch' = re-enter runner for same run ID** (no new run created by default). "Launch a Copy" creates a new separate run.
- **Advanced Relaunch is the ONLY action that creates a new run** (when "Create new run" toggle is ON).
- **Finish Run is always a browser native `confirm()` dialog** — not an in-page modal. Test automation must handle with `page.on('dialog', ...)` or equivalent.
- **'Continue' (in Run Detail panel) = 'Launch' (in row context menu)** — same target URL `/runs/launch/{id}/`; different label based on placement.
- **Keep values is gated by Create new run:** only enabled when Create new run is ON.
