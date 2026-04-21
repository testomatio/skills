---
feature: manual-tests-execution
scope: feature-baseline
mode: feature-baseline
entry_url: https://app.testomat.io/projects/project-for-testing/runs/new
explored_at: 2026-04-17T17:45:00Z
explored_by: ui-explorer
shared_surfaces: 8
candidate_sub_features: 9
gaps: 0
---

# UI Element Catalog: Manual Tests Execution

**Last updated:** 2026-04-17
**Env:** beta
**Collected by:** Playwright MCP

---

## Screen: Left Sidebar Navigation (Global)

**URL:** /projects/project-for-testing/* (present on all project pages)
**Entry points:** persistent across all project screens

### Buttons
- **Project logo / collapse toggle** — icon-only, collapses the left icon strip; `btn-only-icon`

### Navigation Links (icon-only, tooltips via aria-describedby)
- **Tests** — `href: /projects/{project}/`, tooltip `"Tests (Shift + 1)"`, `aria-describedby: ember6-popper`
- **Requirements** — `href: /projects/{project}/requirements`, tooltip `"Requirements (Shift + 2)"`
- **Runs** — `href: /projects/{project}/runs`, tooltip `"Runs (Shift + 3)"` — active link on all runs screens
- **Plans** — `href: /projects/{project}/plans`, tooltip `"Plans (Shift + 4)"`
- **Steps** — `href: /projects/{project}/steps`, tooltip `"Steps (Shift + 5)"`
- **Pulse** — `href: /projects/{project}/pulse`, tooltip `"Pulse (Shift + 6)"`
- **Imports** — `href: /projects/{project}/imports`, tooltip `"Imports (Shift + 7)"`
- **Analytics** — `href: /projects/{project}/analytics`, tooltip `"Analytics (Shift + 8)"`
- **Branches** — `href: /projects/{project}/branches`, tooltip `"Branches (Shift + 9)"`
- **Settings** — `href: #`, tooltip `"Settings"`; opens settings sub-nav
- **Help** — `href: #`, tooltip `"Help"`; opens help popover
- **Projects** — `href: /`, tooltip `"Projects"`; returns to dashboard
- **Profile** — icon-only, tooltip `"Profile"`; opens profile menu

---

## Screen: Runs List Page

**URL:** /projects/project-for-testing/runs/
**Entry points:** from Left Sidebar → Runs icon; from breadcrumb; from "Runs" link in runner header

### Breadcrumbs
- **Project for testing** — link to project root (`/projects/project-for-testing/`)
- **Runs** — current page label (plain text, `breadcrumbs-page-second-level`)
- **Count badge** — shows total runs count (e.g., `"18"`), plain text

### Buttons / Toolbar
- **'Manual Run'** — primary split-button (`btn-split-right primary-btn`), navigates to `/runs/new`; left side is the link, right side is the dropdown chevron
- **Dropdown chevron** (next to Manual Run) — expands to: `New Group`, `Report Automated Tests`, `Launch from CLI`, `Mixed Run`
- **'Runs Status Report'** — AI button (`ai-btn`), disabled unless ≥5 finished runs; tooltip `"More than 5 runs are needed to generate a report."`
- **Multi-select** — icon-only (`btn-only-icon btn-md`), tooltip `"Multi-select"`; enables row-level checkboxes
- **Query Language Editor** — icon-only (`btn-only-icon btn-lg`), tooltip `"Query Language Editor"`; opens QLE modal
- **Expand** — icon-only (`btn-only-icon btn-md`), tooltip `"Expand"`; expands run groups in list
- **Custom view / Default view** — toggle button (`secondary-btn btn-sm`); switches between card list and table view
- **Hide chart / Show chart** — icon-only toggle, appears above chart area

### Filter Tabs
- **Manual**, **Automated**, **Mixed**, **Unfinished**, **Groups** — tab links (`filter-tab`), filter run list; all `href: "#"`

### Run List – Card View (default)
**Table headers (Default view):** Rungroups/Runs | Status | Defects | Assigned to | Finished at
**Columns (Custom/Table view):** Title | Plan | Labels | Tags & Envs | Tests Count | Defects Count | Status | Assigned to | Finished at | Actions

Each run card / row contains:
- **Run title link** — navigates to `/runs/{id}` and opens right-side detail panel; shows run name, source plan/selection, tests count, pass/fail/skip counts, progress %
- **Status indicator** — colored circle (●): in-progress = orange, passed = green, failed = red, finished = blue
- **Finished at button** — shows timestamp; opens context with date/time detail
- **Row context menu button** (⋯ icon, `btn-only-icon`) — expands to: `Relaunch`, `Advanced Relaunch`, `Launch a Copy`, `Pin`, `Export as PDF`, `Move`, separator, `Labels`, separator, `Move to Archive`, `Purge`

### Run Group Row (in list)
- **Group row** — shows group name, run count, expand/collapse chevron; links to `/runs/groups/{id}`
- **Expand group** button (triangle) — toggles child runs visible/hidden

### Chart Area (above list)
- **Skipped / Passed / Failed** legend toggles — clicking filters chart; `cursor-pointer`
- Y-axis labels: 0, 500, 1000, 1500, 2000, 2500, 3000
- X-axis: date labels for recent runs

### Pagination
- **«** (first page) and **»** (last page) links; current page shown as plain text

### Archive Links (below list)
- **Runs Archive** — link to `/runs/archive`; shows count of archived runs
- **Groups Archive** — link to `/runs/group-archive`; shows count of archived groups

### Toasts
- Success: `"Run has been archived"` (after Move to Archive)
- Success: `"Run has been deleted"` (after Purge)
- Success: `"Run has been pinned"` (after Pin)

---

## Screen: Query Language Editor (Modal)

**URL:** /projects/project-for-testing/runs/ (modal overlay)
**Entry points:** Runs List → Query Language Editor icon button

### Buttons
- **'Apply'** — primary, runs the query
- **'Save'** — saves query as named query; disabled until query typed
- **'Cancel'** — dismisses modal

### Inputs
- **Query editor** — `CodeMirror` iframe with Monaco-like editor; supports autocomplete (checkbox to enable)

### Tabs
- **Saved Queries** — lists user-saved named queries
- **Examples (3)** — preset example queries

### Toggles
- **Enable autocomplete** — checkbox, checked by default

### Dropdowns (sidebar)
- **Operators:** `and`, `or`, `not`, `==`, `!=`, `<`, `>`, `>=`, `<=`, `in [...]`, `%`
- **Variables:** `title`, `plan`, `rungroup`, `env`, `tag`, `label`, `jira`, `duration`, `passed_count`, `failed_count`, `skipped_count`, `automated`, `manual`, `mixed`, `finished`, `unfinished`, `passed`, `failed`, `terminated`, `published`, `private`, `archived`, `unarchived`, `with_defect`, `has_defect`, `has_test`, `has_test_tag`, `has_test_label`, `has_suite`, `has_message`, `has_custom_status`, `has_assigned_to`, `has_retries`, `has_test_duration`, `has_priority`, `created_at`, `updated_at`, `launched_at`, `finished_at`

### Links
- **Read Docs** — external link to `https://docs.testomat.io/usage/query-language`

---

## Screen: New Manual Run Sidebar

**URL:** /projects/project-for-testing/runs/new (right-side drawer overlay)
**Entry points:** Runs List → 'Manual Run' button (left part of split button)

### Header
- **'New Manual Run'** heading — `h3`; shows badge `manual` (type indicator)
- **Close (×) button** — dismisses sidebar; returns URL to `/runs/`
- **Back arrow button** — alternative dismiss

### Assignee Section
- **Current user chip** (`gololdf1sh`) — shows avatar + username + `as manager` label
- **'Assign more users'** link — `href: "#"`; opens tester-assignment panel (assign additional testers with their portion of tests)

### Inputs
- **Title** — `textbox`, `id: run-title`, placeholder `"Title (optional)"`, `max 255 chars`
- **Rungroup** selector — `button "Select RunGroup"`, expands dropdown with `"Without rungroup"` and named groups (e.g., `"E2E MultiEnv Test"`)
- **Environment** — multi-select list, placeholder `"Set environment for execution"`; clicking opens Multi-Environment Configuration modal
- **Description** — `textarea`, `id: run-description`, optional
- **Run as checklist** toggle — `switch`, default off; hides test descriptions when enabled

### Test Selection Tabs
- **'All tests'** button — includes all tests in the project
- **'Test plan'** button — select from existing test plans
- **'Select tests'** button — choose suites/tests via tree with checkboxes
- **'Without tests'** button — creates empty run

### Toggles
- **'Run Automated as Manual'** — `switch`, default off; allows treating automated tests as manual

### Test Tree (when "All tests" or "Select tests")
- Suite rows: checkbox (disabled until "Select tests" chosen), expand/collapse chevron, suite name, test count, suite tags
- Test rows: listed under expanded suite

### Buttons
- **'Launch'** — primary; launches run immediately and navigates to runner
- **'Save'** — saves run without launching (pending status); navigates to run detail
- **'Cancel'** — dismisses sidebar

### Toasts
- Success: `"Run has been created"` (after Save)
- Success: `"Run has been started"` (after Launch)
- Error: `"Title can't be blank"` (if blank title + custom validation)

---

## Screen: Multi-Environment Configuration Modal

**URL:** /projects/project-for-testing/runs/new (modal overlay from environment selector)
**Entry points:** New Manual Run sidebar → environment list → click

### Header
- **'Multi-Environment Configuration'** — `h3`

### Env Slot
- **Slot "1"** — numbered env slot; each slot represents a separate environment instance
- **Environment checklist** — All, Windows, MacOS, Linux, Android, iOS, Chrome, Firefox, Safari

### Buttons
- **'Save'** — saves environment config
- **'Cancel'** — dismisses modal
- **'Add Environment'** — adds a new environment slot
- **'Add all envs'** link — populates all available environments

---

## Screen: Run Detail Panel (right-side panel)

**URL:** /projects/project-for-testing/runs/{id}/ (panel overlaid on runs list)
**Entry points:** Runs List → click any run row

### Header Buttons
- **Copy Settings** — icon-only (`btn-only-icon btn-md`), tooltip `"Copy Settings"`
- **'Run Summary'** — AI button (`ai-btn`), disabled when run is ongoing; tooltip `"Can't analyze run summary, run is ongoing"`
- **'Report'** link — navigates to `/runs/{id}/report`
- **Edit** icon button — closes panel, navigates to edit form
- **Close (×) button** — dismisses panel

### Run Identity
- **'Run {short-id}'** link — copy-id link; `href: "#"`
- **Status indicator** — colored circle ●
- **Type badge** — e.g., `manual`

### Run Metadata (Summary section)
- **Doughnut chart** — shows Passed / Failed / Skipped / Pending percentages
- **Status** term: `passed`, `failed`, `skipped`, `pending`, `finished`
- **Duration** — e.g., `1m 56s`
- **Tests** count
- **Test plan** link — navigates to linked plan
- **Executed** timestamps — start and end time buttons
- **Executed by** — avatar + username
- **Created by** — avatar + username + creation timestamp
- **'Set labels'** link — navigates to `/runs/{id}/labels`

### Tests Tab Content
- **Passed / Failed / Skipped / Pending** filter buttons with counts
- **Search** combobox — placeholder `"Search by title/message"`
- **Sort** button (`secondary-btn btn-md`) — sorts test list
- **Custom view** button (`secondary-btn btn-md`), tooltip `"Custom view table"`
- **Test rows** — links to `/runs/{id}/report/test/{testId}`, show status icon, suite path, test title, tags
- **Bulk status filter** — priority buttons (Normal / Low / High / Important / Critical), tooltip via `aria-describedby`

### Detail Panel Tabs
- **Tests** (selected by default), **Statistics**, **Defects**

### Test Detail Sub-panel (when test row clicked)
- Breadcrumb: Suite → Test (with suite link to `/suite/{id}`)
- Test title heading (links to test detail page)
- Test tag
- **Tabs:** Summary | Description | Code template | Runs
- **Summary tab:** shows test result status (● passed/failed/skipped)
- **Runs tab:** lists run history for that test — run title links, duration `~`, executed timestamp

---

## Screen: Manual Test Runner

**URL:** /projects/project-for-testing/runs/launch/{id}/?entry={testId}
**Entry points:** Run detail → 'Continue' link; or launching a new run

### Header Area
- **'Runs'** link — `href: /runs/{id}`; navigates back to run detail
- **'Manual Run (Checklist)'** heading — `h2`; shows `N/M tests (X% completed)`
- **Fast forward** — icon-only (`btn-only-icon btn-lg`), tooltip `"Fast forward: automatically select the next test after marking the status"`
- **Auto-track** — icon-only (`btn-only-icon btn-lg`), tooltip `"Auto-track next tests: start timer after opening the next test"`
- **Create notes** — icon-only (`btn-only-icon btn-lg`), tooltip `"Create notes"`
- **'Finish Run'** — primary button (`primary-btn btn-lg`); triggers browser native confirm dialog: `"N tests were not run. Pending tests that are not linked to any other test result will be marked as skipped."`

### Status Counter Bar
- **Passed N** / **Failed N** / **Skipped N** / **Pending N** — filter buttons (`secondary-btn btn-md`); filter test list by status

### Filter Toolbar (test list)
- **Priority filters:** Normal | Low | High | Important | Critical — icon buttons, tooltip via `aria-describedby`
- **Multi-select** — icon-only (`btn-only-icon btn-md`), tooltip `"Multi-select"`
- **Collapse all** — icon-only (`secondary-btn btn-md`), tooltip `"Collapse all"`

### Test Tree (left panel)
- **Suite rows** — suite name, test count, expand/collapse icon; per-suite: `Add note to suite` and `Add test to suite` icon buttons
- **Test rows** — links to test execution; show status icon ●, test title, tags; current test is highlighted/active
- **"Load more"** link — loads remaining tests when count > shown

### Test Execution Panel (right panel — current test)
- **Test title** — `h3`, links to test detail page `/test/{id}`
- **Suite breadcrumb** — suite name + tag (e.g., `@positive`)
- **Close button** — dismisses right panel
- **Edit metafields button** — icon-only in test header
- **Result section heading** — `"Result"` `h3`
- **Hotkey hint** — `"Hotkeys for passed (Cmd + ENTER), failed (Cmd + U) and skipped (Cmd + I)"`
- **'PASSED'** button — marks test passed; full-width, green ring
- **'FAILED'** button — marks test failed; full-width, red ring
- **'SKIPPED'** button — marks test skipped; full-width, gray ring
- **Result message** textarea — `id: testrun-message-{testRunTestId}`, placeholder `"Result message"`; optional comment
- **'Edit metafields'** expandable — reveals: Key/Value table, add-row button, Save + Cancel

---

## Screen: Run Report Page

**URL:** /projects/project-for-testing/runs/{id}/report/
**Entry points:** Run detail panel → 'Report' link

### Header
- **'Run #{id}'** link — `href: /runs/{id}`; navigates back to run list view
- **Run title heading** — `h2`; includes status icon ●
- **'Copy Link'** button — copies report URL to clipboard
- **Extra menu** button — icon-only (options: not yet expanded in this exploration)

### Filter Toolbar
- **Passed N** / **Failed N** / **Skipped N** — filter buttons with counts
- **Filter all** icon — collapses filter bar
- **Search** combobox — placeholder `"Search"`
- **'Tree View'** button — toggles between flat and tree view of tests

### Test Tree / List
- Suite group rows — suite name, pass/fail/skip counts per suite
- Test links — link to `/runs/{id}/report/test/{testId}`, show status icon ●, test title, tags

### Summary Panel (right side)
- **'Summary' heading** — `h4`
- **Run metadata:** Status | Duration | Tests count | Test plan link | Executed timestamps | Executed by | Created by
- **Doughnut chart** — Passed / Failed / Skipped / Pending rings
- **Overview tabs:** Suites | Tags | Labels | Assignees | Priorities
  - **Suites tab:** suite list with pass/fail counts; sort by `name` or `failed`; **Folders** toggle switch
  - Filter icons: Passed/Failed/Skipped clickable in chart

### Toasts
- No specific toasts observed on report page (read-only)

---

## Screen: Edit Run Page (full-page form)

**URL:** /projects/project-for-testing/runs/edit/{id}/
**Entry points:** Run detail panel → Edit button; row context menu → (not directly, navigate via URL)

### Inputs
- **Title** — `textbox`, `id: run-title`, current run title pre-filled
- **Assign users** — multi-select power-select, `id: ember-power-select-trigger-multiple-input-ember207`
- **Environment** — multi-select, `id: ember-power-select-trigger-multiple-input-ember214`, placeholder `"Set environment for execution"`
- **Description** — `textarea`, `id: run-description`
- **Test search** — `id: search`, placeholder `"Search by test title"`, in suite/test selection area

### Buttons
- **'Save'** — saves changes
- **'Cancel'** — discards changes
- **'Remove assign users'** — removes assigned tester(s)

---

## Verified Flows

### Happy-path: Create and Launch a Manual Run

1. Navigate to Runs list (`/projects/{project}/runs/`)
2. Click **'Manual Run'** button
3. Sidebar opens with heading `"New Manual Run"`
4. Current user shown as manager; optionally click **'Assign more users'**
5. Fill **Title** input (optional; auto-generated if left blank)
6. Optionally select **RunGroup** from dropdown
7. Optionally click environment list → Multi-Environment Configuration modal → select env checkboxes → 'Save'
8. Choose test scope: **All tests** / **Test plan** / **Select tests** / **Without tests**
9. Click **'Launch'** → navigates to `/runs/launch/{id}/?entry={firstTestId}`
10. Manual runner opens with test list on left, execution panel on right
11. Click **PASSED / FAILED / SKIPPED** for current test
12. Optionally add text in **Result message** textarea
13. Runner advances to next test (if Fast Forward enabled)
14. Click **'Finish Run'** → confirm dialog: `"N tests were not run. Pending tests..."` → confirm
15. Run finishes, navigates to run detail

### Alternative: Save Run without Launching

1. Steps 1–8 from above
2. Click **'Save'** instead of **'Launch'**
3. Toast: `"Run has been created"` (or similar)
4. Run appears in list with pending/not-started status
5. From run detail panel click **Continue** → opens runner at `/runs/launch/{id}`

### Navigation between run-related screens

- Runs List → run row click → Run Detail panel (right side)
- Run Detail panel → **Report** link → Run Report page
- Run Report → test row click → test execution sub-panel
- Manual Runner → **Runs** link → back to Run Detail panel

---

## Conventions

- **Destructive actions require confirmation:** `Purge` (no confirmation dialog seen but irreversible), `Finish Run` (browser confirm dialog with exact message about pending tests being skipped)
- **Run statuses:** `passed` (all pass), `failed` (≥1 failure), `in-progress` (active runner), `pending` (saved, not launched), `skipped` (marked skipped), `finished`
- **Test execution statuses in runner:** `PASSED`, `FAILED`, `SKIPPED`; pending = not yet marked
- **Status colors:** passed = green ●, failed = red ●, skipped = gray ●, in-progress/pending = orange ●
- **Run type badges:** `manual`, `automated`, `mixed`
- **Keyboard shortcuts in runner:** Passed = `Cmd+Enter`, Failed = `Cmd+U`, Skipped = `Cmd+I`
- **Run count badge** in breadcrumb header shows total runs (including archived)
- **'Custom view'** vs **'Default view'** — the same button toggles between card list and full table; button text changes accordingly
- **Runs archive:** separate page at `/runs/archive`; archived runs do not appear in main list unless queried with `archived` query variable

---

## Candidate sub-features

1. **run-creation** — New Manual Run sidebar (form fields: title, rungroup, environment, test scope selector, "run as checklist" toggle, "run automated as manual" toggle, assignee), plus New Group / Mixed Run / Launch from CLI / Report Automated Tests variants
2. **run-list-management** — Runs List page: filter tabs (Manual/Automated/Mixed/Unfinished/Groups), run row context menu (Relaunch, Launch a Copy, Pin, Export as PDF, Move, Labels, Archive, Purge), Custom view table, Query Language Editor, chart area
3. **test-execution-runner** — Manual Runner UI: test tree navigation, per-test PASSED/FAILED/SKIPPED marking, result message textarea, metafields editing, Fast Forward and Auto-track options, Create notes, priority filter, suite-level note/test add, Finish Run flow
4. **run-detail-and-report** — Run Detail panel (Tests/Statistics/Defects tabs, test sub-panel with Summary/Description/Code Template/Runs tabs) and Run Report full page (tree/flat view, Suites/Tags/Labels/Assignees/Priorities overview, Copy Link, filtering)
5. **run-lifecycle** — Run lifecycle management: Start → Continue (resume) → Finish Run (with confirm dialog about pending tests); Relaunch, Advanced Relaunch, Launch a Copy; run status transitions
6. **tester-assignment** — Assigning testers during run creation/edit: "Assign more users" panel, assigning per-suite portions, removing assigned users, "as manager" role
7. **environment-configuration** — Multi-Environment Configuration modal: adding/removing environment slots, selecting environments (OS/browser checkboxes), multi-env run groups
8. **run-groups** — Run Groups: creating new group (`/runs/groups/new`), grouping runs, Groups tab filter, Groups Archive, E2E MultiEnv-style grouped runs
9. **bulk-status-actions** — Bulk actions in runner: Multi-select mode on runner test list, setting status for multiple tests at once; also run-list Multi-select for bulk archive/delete
