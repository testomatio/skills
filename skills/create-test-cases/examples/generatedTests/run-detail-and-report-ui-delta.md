---
feature: manual-tests-execution
suite: run-detail-and-report
scope: sub-feature-delta
mode: sub-feature-delta
references: _shared-ui.md
entry_url: https://app.testomat.io/projects/project-for-testing/runs/5cff086c
explored_at: 2026-04-20T08:30:00Z
explored_by: ui-explorer
delta_elements: 74
verified_flows: 7
gaps: 2
---

# UI Element Catalog Delta: Run Detail and Report

**Last updated:** 2026-04-20
**Env:** beta (project-for-testing)
**Collected by:** Playwright MCP
**References:** _shared-ui.md (do not duplicate elements from shared catalog)

---

## Screen: Run Detail Panel (extended depth — delta only)

**URL:** /projects/project-for-testing/runs/{id}/
**Entry points:** Runs List → click any run row
**Note:** _shared-ui.md catalogs the high-level panel shape; this delta catalogs every interactive element and nested behavior not listed there.

### Run Identity Row (delta)

- **Run short-id copy link** — `a.copy-id`, text `"Run {8-char-hex}"`, `href: "#"`, copies run ID on click; `aria-describedby: ember235-popper` (tooltip = short ID)
- **Status icon** — `svg.run-status.{failed|passed|skipped}`, `md-icon-circle-medium`, color reflects run status
- **Run type badge** — `span.badge.badge-type.manual` — text `"manual"` (or `"automated"` / `"mixed"`); always displayed next to short ID

### Run Detail Panel Header Buttons (delta)

- **Copy Settings** — `button.third-btn.btn-only-icon.btn-md`, `aria-describedby: ember236-popper` → tooltip `"Copy Settings"`; icon `md-icon-content-copy`
- **Run Summary (AI)** — `button.ai-btn.btn-lg.btn-text-and-icon.btn-dropdown`, text `"Run Summary"`, enabled only on finished runs (disabled tooltip: `"Can't analyze run summary, run is ongoing"`); clicking opens AI Assistant panel overlay; has a separate `div.ai-btn.btn-only-icon.btn-dropdown-icon` chevron (dots-horizontal icon) for expanded options
- **Report** — `a.primary-btn.btn-text-and-icon.btn-lg` (`id: ember237`), text `"Report"`, `href: /runs/{id}/report`; icon `md-icon-chart-bar`
- **Context menu (dots-horizontal)** — `div.ember-basic-dropdown-trigger.third-btn.btn-only-icon.btn-lg` (`id: ember240`), icon `md-icon-dots-horizontal`; expands to dropdown list:
  - `"Relaunch"` — button
  - `"Advanced Relaunch"` — link → `/runs/{id}/advanced`
  - `"Launch a Copy"` — button
  - `"Pin"` — button
  - `"Export as PDF"` — button
  - `"Move"` — button
  - _(separator)_
  - `"Labels"` — link → `/runs/{id}/labels`
  - `"Details"` — link → `/runs/{id}/detail`
  - _(separator)_
  - `"Move to Archive"` — button
  - `"Purge"` — button
- **Close panel button** — `button.third-btn.btn-only-icon.btn-lg.btn-split-right`, icon `md-icon-close`; dismisses the right panel and returns to runs list URL

### Run Summary Metadata (delta — not repeated from shared)

- **Run title heading** — `h3.text-primary` — e.g. `"Manual tests at 17 Apr 2026 13:18"`, cursor-pointer (click navigates to edit title inline)
- **Set labels link** — `a.baseLink.secondary.text-sm` (`id: ember244`), text `"Set labels"`, `href: /runs/{id}/labels`
- **Doughnut chart** — `img` with embedded SVG inside `img.run-donut`, shows Passed/Failed/Skipped/Pending arcs; legend labels are clickable (filter test list by status: `"Passed"`, `"Failed"`, `"Skipped"`, `"Pending"` all cursor-pointer)
- **Status definition** — `<term>Status</term><definition>failed|passed|finished|skipped</definition>` inside `dl`; value is styled `.run-summary-status.{failed|passed}` with class `run-status`
- **Duration definition** — `<term>Duration</term><definition>` e.g. `"1m 56s"`
- **Tests definition** — `<term>Tests</term><definition>` e.g. `"3"`
- **Test plan definition** — `<term>Test plan</term><definition>` contains link `a.baseLink.secondary` → `/plans/{id}`
- **Executed definition** — `<term>Executed</term><definition>` contains two `button.focus:outline-none` time buttons (start timestamp, end timestamp) and a duration separator icon
- **Executed by definition** — `<term>Executed by</term><definition>` contains avatar `img` + username text
- **Created by definition** — `<term>Created by</term><definition>` contains avatar `img` + username + `button.focus:outline-none` creation timestamp

### Tests Tab — Status Filter Bar (delta)

- **Passed N filter** — `button.secondary-btn` text `"Passed"` + count badge; toggles list to show only passed tests
- **Failed N filter** — `button.secondary-btn` text `"Failed"` + count badge
- **Skipped N filter** — `button.secondary-btn` text `"Skipped"` + count badge
- **Pending N filter** — `button.secondary-btn` text `"Pending"` + count badge
- **Filter icon** — `img[cursor-pointer]` next to status buttons; expands/collapses advanced filter chips row (not fully opened in this run; behavior noted)

### Tests Tab — Search + Sort + View (delta)

- **Search input** — `combobox` (`role="combobox"`), placeholder `"Search by title/message"`, filters test list in real time by title or result message; `class: filterbar-search`
- **Sort button** — `button.secondary-btn`, text `"Sort"` (or shows active sort label e.g. `"Suite"`), with caret icon; opens dropdown with options:
  - `"Suite"` — sort by suite name
  - `"Test"` — sort by test name
  - `"Failure"` — sort failures first
  After selection, button label updates to the chosen sort dimension (e.g. `"Suite"`); sort persists within session
- **Sort order toggle** — `button.secondary-btn` icon-only, appears next to sort label button after sort is chosen; toggles ASC/DESC
- **Custom view toggle** — `button.secondary-btn`, text `"Custom"` (active) / `"Default"` (inactive) with view icon; toggles between list view and table view; `aria-describedby: ember336-popper` → tooltip `"Custom view table"` / `"Default view table"`
- **Custom view settings icon** — `button.secondary-btn.btn-only-icon` next to Custom toggle; disabled when Default view is active; opens "Runs list settings" dialog when Custom view is active

### Custom View Settings Dialog (delta)

**Trigger:** Custom view toggle active → click settings icon button
**Title:** `h4` `"Runs list settings"`

- **Hyphenation toggle** — `checkbox` label `"Hyphenation (tags, envs)"`, default unchecked
- **Column visibility checkboxes** — each with a width spinbutton (px):
  - `Suite` (checked, default 100px)
  - `Tags & Envs` (checked, 100px)
  - `Meta` (checked, 100px)
  - `Example` (checked, 100px)
  - `Substatus` (checked, 100px)
  - `Message` (checked, 100px)
  - `Runtime` (checked, 100px)
  - `Issues` (checked, 100px)
  - `Retries` (checked, 100px)
  - `Assigned to` (checked, 50px)
  - `Actions` (checked, 100px)
- **Save button** — `button`, saves column config
- **Cancel button** — `button`, discards changes; width persists per-project per-user

### Tests Tab — Test Row (delta)

Each row in default (list) view:
- **Status icon** — `img.run-status.{passed|failed|skipped|pending}` (`md-icon-circle-medium`)
- **Suite path** — `div` with folder icon + suite name text
- **Test title** — link text `"{test title}"`, `href: /runs/{id}/report/test/{testRunTestId}`
- **Tag** — `span` text e.g. `"@smoke"`, `"@negative"` (when present)

Each row in Custom (table) view additionally shows columns: Suite, Tags & Envs, Meta, Example, Substatus, Message, Runtime, Issues, Retries, Assigned to, Actions

### Test Sub-Panel (delta — right panel when test row clicked)

**URL pattern:** /runs/{id}/report/test/{testRunTestId}
**Note:** shared catalog has high-level shape; this documents every element

- **Close button** — `button.third-btn.btn-only-icon.btn-lg` at top-left of sub-panel; closes panel, URL reverts to `/report`
- **Suite breadcrumb** — link `a[href: /projects/{p}/suite/{suiteId}]` → suite name; `›` separator; then test link `a[href: "#"]` showing test ID tag (e.g. `"Test @Td9afbe76"`)
- **Open in new window / link icon** — `button.third-btn` next to test breadcrumb; icon `md-icon-open-in-new` (opens test detail page)
- **Edit metafields button** — `button.third-btn.btn-only-icon` icon-only in sub-panel header
- **Status icon** — `svg.run-status.{passed|failed|skipped}` before test title heading
- **"Explain Failure" AI button** — `button.ai-btn`, text `"Explain Failure"`, disabled state on non-failed tests; only enabled on failed test results
- **Test title heading** — `h3` containing link `a[href: /projects/{p}/test/{testId}]`
- **Test tag** — `span` text e.g. `"@smoke"`

#### Sub-panel Tabs (delta)

- **Summary tab** — `tab` with icon `md-icon-information`, text `"Summary"`; selected by default
- **Description tab** — `tab` with icon, text `"Description"`; has a nested `button` with edit icon (opens edit flow)
- **Code template tab** — `tab` with icon, text `"Code template"`
- **Runs tab** — `tab` with icon, text `"Runs"`

#### Summary Tab Body (delta)

- **Result status** — `span` `"● {passed|failed|skipped|pending}"` — shows last execution result
- **Result message** — text area rendered if message was recorded during execution; empty state renders neutral placeholder
- **Step results** — list of steps with per-step status icon (● passed/failed), step text, expected result when recorded (rendered as `<strong>Expected Result</strong>: {text}`)
- **Attachments** — thumbnail grid (when attachments present); empty state = no element shown

#### Description Tab Body (delta)

- **Steps heading** — `h3 "Steps"`
- **Steps list** — `ol/ul` with list items; each step has: step text, bold `Expected Result:` label, expected outcome text; per-step status icon `img ●` (passed/failed/skipped)
- **Read-only** — no edit controls visible inside Run Report context

#### Code Template Tab Body (delta)

- **Code block** — `code` element containing the test's automation template (e.g. Playwright/CodeceptJS snippet)
- **Copy button** — icon-only button next to code block; copies code to clipboard
- **Empty state** — for manual-only tests with no code template, tab body is blank (no placeholder text observed; tab is still shown)

#### Runs Tab Body (delta)

- **Runs count** — `span` `"Runs"` label + `span` count badge (e.g. `"3"`)
- **Filter button** — `button`, text `"Filter"` with filter icon; filters the run history list
- **Run history list** — `ul/ol` of prior executions:
  - Run title link — `a[href: /runs/{runId}/report/test/{testRunTestId}]` with status icon ● + run title text
  - Duration field — `span` `"~"` (approximation token; exact value shown when available)
  - Executed timestamp — `button.focus:outline-none` wrapping `time` element (e.g. `"Executed Apr 17, 2026 1:19 PM"`)

---

## Screen: Statistics Tab (in Run Detail Panel)

**URL:** /projects/project-for-testing/runs/{id}/ (Statistics tab selected)
**Entry points:** Run Detail Panel → Statistics tab

The Statistics tab renders 5 grouped sections, each with the same layout:

### Sections (delta)

- **Suites** — `h4 "Suites"` heading; shows suite list with pass/fail counts per suite
- **Tags** — `h4 "Tags"` heading; shows tag list with counts
- **Labels** — `h4 "Labels"` heading; shows label list with counts
- **Assignees** — `h4 "Assignees"` heading; shows assignee list; empty when no testers assigned
- **Priorities** — `h4 "Priorities"` heading; shows priority (normal, high, etc.) with pass/fail counts
- **Custom Statuses** — `h4 "Custom Statuses"` heading; empty state text `"No custom statuses found"` when none set

### Per-Section Controls (delta)

- **Sort by name link** — `a.link[href: "#"]` text `"name"`, sort label row; changes list sort to alphabetical
- **Sort by failed link** — `a.link[href: "#"]` text `"failed"` with descending caret icon; sorts by failure count
- **Sort direction icon** — `img[cursor-pointer]` between sort links indicating current direction
- **Status filter icons** — 3 `img[cursor-pointer] ●` icons (passed / failed / skipped) next to sort row; click toggles visibility of that status in list
- **Folders toggle** (Suites section only) — `switch[cursor-pointer]` + label `"Folders"`; collapses/expands folder-level nesting in suite list

### Suite / Tag / Label Row Items (delta)

- **Item icon** — `img` folder/tag/label icon
- **Item name** — `span` text
- **Passed count** — `span` numeric
- **Failed count** — `span` numeric (shown when > 0)

---

## Screen: Defects Tab (in Run Detail Panel)

**URL:** /projects/project-for-testing/runs/{id}/ (Defects tab selected)
**Entry points:** Run Detail Panel → Defects tab

### Empty State (delta — resolved AC-98)

- **Empty state text** — `div.empty.my-4` text: `"No defects found. You can link some jira-issue to test or other issues ."`
- **Jira-issue link** — `a.link[href: /projects/{p}/settings/jira]` text `"jira-issue"`; navigates to JIRA integration settings
- **Other issues link** — `a.link[href: /projects/{p}/settings/issue]` text `"other issues"`; navigates to Issues management settings
- **Resolved AC-98:** Defects tab is read-only in run context; no add/remove defect link is present on the tab itself. Defect creation is via test detail settings. The tab shows linked issues when they exist; empty state renders with the navigation hint above.

---

## Screen: Run Report Page (Basic)

**URL:** /projects/project-for-testing/runs/{id}/report/
**Entry points:** Run Detail Panel → 'Report' link; or direct navigation

### Report Page Header (delta)

- **Back link** — `a.secondary-btn` (`id: ember...`), text `"Run #{short-id}"`, `href: /runs/{id}`; with left-arrow icon `md-icon-arrow-left`; navigates back to run detail
- **Run title heading** — `h2` containing status icon `img ●` + run title text
- **Copy Link button** — `button.secondary-btn`, text `"Copy Link"`, icon `md-icon-link`; copies report URL to clipboard; **standalone button** (NOT inside the extra menu) — resolved AC-99: Copy Link is always visible on the report page header
- **Extra menu button** — `button.btn-open` (not `.btn-only-icon`), icon `md-icon-dots-horizontal` or kebab; expands dropdown with full action list (see below)

### Report Page Extra Menu (delta)

Opened via the extra menu button. Full option list:
- `"Relaunch"` — button; icon `md-icon-restart`
- `"Advanced Relaunch"` — link → `/runs/{id}/advanced`
- `"Launch a Copy"` — button
- `"Pin"` — button
- `"Export as PDF"` — button; triggers PDF download of current report view
- `"Move"` — button; moves run to a run group
- _(separator)_
- `"Labels"` — link → `/runs/{id}/labels`
- `"Share report by Email"` — button; opens Share by Email dialog
- `"Download as Spreadsheet"` — button; triggers XLSX download
- `"Share Report Publicly"` — button; opens Make Public Report dialog

**Note:** Relaunch, Advanced Relaunch, Launch a Copy, Pin, Move are owned by run-lifecycle sub-feature; cataloged here for completeness as entry points visible from the report page.

### Report Page Filter Bar (delta)

- **Passed N filter** — `button.secondary-btn` text `"Passed"` + count; filters test list
- **Failed N filter** — `button.secondary-btn` text `"Failed"` + count
- **Skipped N filter** — `button.secondary-btn` text `"Skipped"` + count
- **Filter-all icon** — `img[cursor-pointer]` next to status buttons; collapses/expands the filter bar
- **Search input** — `combobox`, placeholder `"Search"`, filters test list
- **Tree View button** — `button.secondary-btn`, text `"Tree View"`, icon `md-icon-file-tree`; toggles between flat list and tree-grouped view

### Report Test List (delta)

- **Suite group row** — `div[cursor-pointer]` containing folder icon + suite name + pass/fail/skip counts (e.g. `"2 1 0"` icons inline)
- **Test row link** — `a[href: /runs/{id}/report/test/{testRunTestId}]`; each row: status icon ● + test title text + tag text
- **Active test row** — `a[active]` (attribute set) when test sub-panel open for that test; highlighted state

### Report Summary Panel (right side) (delta)

This IS the "Extended Run Report" view — the full report page combines Basic (test list) on the left with the Summary panel on the right. There is no separate "Extended Report" URL.

- **Summary heading** — `h4 "Summary"`
- **Run metadata** — same DL structure as Run Detail Panel (Status, Duration, Tests, Test plan, Executed, Executed by, Created by)
- **Overview heading** — generic `"Overview"` label above tabs
- **Overview tabs** — `tablist` containing: `Suites`, `Tags`, `Labels`, `Assignees`, `Priorities`
- **Sort by name/failed controls** — same as Statistics Tab (per-tab; present in each overview tab)
- **Folders toggle** — `switch` + `"Folders"` label; in Suites tab only
- **Status filter icons** — 3 `img ●` (passed/failed/skipped clickable) in each tab header
- **Analytics section** — `h4 "Analytics"` heading; renders Flaky Tests Analytics charts when flaky data exists; section is empty (zero height visually) when no flaky history — **resolved ac-delta-11**: section is hidden/empty rather than absent; `h4.hide-title-when-empty` class suppresses heading when empty
- **Keyboard shortcuts icon** — `img.md-icon.md-icon-apple-keyboard-command[cursor-pointer]` floating bottom-right of page; opens global keyboard shortcuts modal (not unique to this sub-feature but only visible on report page)

---

## Screen: Share Report by Email Dialog (delta)

**URL:** /runs/{id}/report/ (modal overlay)
**Entry points:** Report page extra menu → `"Share report by Email"`

- **Dialog heading** — `h3 "Send Report to Email"`
- **Email input** — `input#ember91.ember-text-field`, type `text`, label `"Email"`, hint text `"Separate multiple emails with comma"`; accepts comma-separated emails
- **Send button** — `button.primary-btn.btn-text-and-icon.btn-lg`, text `"Send"`; no Cancel button — close via clicking overlay or Escape
- **Info note** — `div` text `"This action also creates public report for external access"`
- **Close behavior** — clicking `.ember-modal-overlay` closes dialog; no explicit Cancel button

---

## Screen: Make Public Report Dialog (delta)

**URL:** /runs/{id}/report/ (modal overlay)
**Entry points:** Report page extra menu → `"Share Report Publicly"`

### Pre-share State

- **Dialog heading** — `h4 "Make Public Report"` + inline `button.third-btn.btn-only-icon` close button (icon `md-icon-close`)
- **Run preview** — `span` with status icon ● + run title text
- **Expiration Date input** — `input.ember-flatpickr-input.flatpickr-input`, placeholder `"Select Date"`, pre-filled with default date (7 days from today, e.g. `"2026-04-27"`); date picker powered by flatpickr
- **Protect by passcode checkbox** — `checkbox[checked]`, default ON; label `"Protect by passcode"`
- **Share button** — `button`, text `"Share"`; submits and generates URL + passcode

### Post-share State (after clicking Share)

- **Link row** — label `"Link:"` + `code` element showing full public URL (e.g. `https://app.testomat.io/report/{id}/{uuid}`) + `button` copy icon
- **Passcode row** — label `"Passcode:"` + `code` element showing 5-digit numeric passcode + `button` copy icon
- **Expiration Date row** — label `"Expiration Date:"` + `code` element showing expiration (e.g. `"Apr 27, 2026 12:00 AM"`) + `button` copy icon
- **Open Link button** — `button`, text `"Open Link"`, icon; navigates to the public URL in new tab
- **Stop Sharing button** — `button`, text `"Stop Sharing"`, icon; revokes public URL

### Stop Sharing Behavior

- Clicking `"Stop Sharing"` revokes the public URL immediately
- Toast: `"Public run report was removed"` — `.custom-notify-body-message` or notification container
- Dialog reverts to pre-share state (expiration + checkbox + Share button)
- The `"Share"` quick-access button that appeared in the report page header after sharing is removed

### Resolved AC-100 (partial)

Share Publicly is accessible to owner role in project-for-testing. Full permission matrix deferred — requires multi-role test data.

---

## Screen: Run Report — Keyboard Shortcuts Modal (delta)

**Entry points:** Report page → floating `md-icon-apple-keyboard-command` icon at bottom-right
**Purpose:** reference-only overlay; not a feature action modal

- **"Run Report" section** — `h5 "Run Report"` heading; row `"Navigation"` with ↑↓ arrow key icons + `"Navigation"` label
- **Close button** — `button`, text `"Close"`, icon `md-icon-close`
- **Additional sections in same modal:** New Suite or Test, Manual Run, Steps, Suites (not owned here; recorded for completeness)

### Keyboard Navigation (verified)

- **↑ key** — moves test selection to previous row; URL updates to previous test's report URL
- **↓ key** — moves test selection to next row; URL updates
- **Escape** — closes the test sub-panel; URL reverts to `/report` (without `/test/{id}`)
- **Enter** — opens test sub-panel for focused row (not explicitly verified, consistent with keyboard shortcuts modal)

---

## Screen: Compare Runs Page (delta)

**URL:** /projects/project-for-testing/runs/compare?ids=["{id1}","{id2}"]
**Entry points:** Runs list → Multi-select 2+ runs → Compare link in bulk action bar

### Header (delta)

- **Runs breadcrumb** — `a[href: /runs]`, text `"Runs"`, icon `md-icon-arrow-left`
- **Compare runs heading** — `h2 "Compare runs"`
- **Filter icon button** — `button`, icon `md-icon-filter`; filters the comparison list
- **Share/link icon** — `img[cursor-pointer]` in header (icon for sharing or copying compare URL)

### Status Filter Bar (delta)

- **Passed N** / **Failed N** / **Skipped N** / **Pending N** — `button.secondary-btn` with counts; filter comparison list
- **Search input** — `combobox`, placeholder `"Search"`, filters test list

### Compare Matrix (delta)

- **Test title column** — left column; each row: `a[href: /runs/compare/test/{testId}?ids=...]` → test title
- **Per-run status columns** — one column per compared run; each cell: `a[href: /runs/compare/testrun/{runId}/{testRunTestId}?ids=...]` with status icon ●
- **Suite group row** — `div` containing folder icon + suite name + counts (e.g. `"(3/3)"`)
- **Highlighted diff rows** — rows where statuses differ across runs are visually distinct (verified via different status icons; highlight class not captured)

### Overview Panel (right side, delta)

- **Overview heading** — `h3 "Overview"`
- **Main Run label** — run title link + `"Main Run"` badge next to first selected run
- **Compare To label** — run title + timestamp for comparison run; `"Compare To"` button to switch which is the baseline
- **Summary heading** — `h3 "Summary"`
- **Summary metrics list:**
  - `"Total Tests:"` — count of unique tests in all runs
  - `"Tests in all runs:"` — tests present in every compared run
  - `"Total Passed"` — link + tooltip; passed in all runs
  - `"Total Failed"` — link + tooltip
  - `"Flaky"` — link + tooltip: `"Unstable tests that passed or failed in different runs"`
  - `"Revieved"` (sic — typo in UI) — link + tooltip: `"Previously failing that passed in next runs"`
  - `"Degraded"` — link + tooltip: `"Previously passed that failed in next runs"`
  - `"Skipped"` — link + tooltip: `"Tests that were skipped in all runs"`
- **Leave compare view** — navigate to `"Runs"` breadcrumb link or browser back

---

## Open Questions / Gaps

1. **Extended Run Report entry button** — The AC list refers to an "Extended Run Report" button distinct from Basic. In the explored UI, the full `/runs/{id}/report/` page already shows the Summary/Overview panel on the right alongside the test list. No separate "Extended" toggle or separate URL was found (`/report/extended` returns 404). **Gap:** If "Extended Run Report" is a distinct mode accessible from somewhere other than the Report page, it was not found during this exploration. The report page as observed IS the full report view. Record as gap: entry point to "Extended" mode vs "Basic" mode not surfaced.

2. **Filter chips advanced behavior** — The filter chips row (status/type/messages/custom-status/assignee) next to the status filter buttons was observed but not fully expanded (the icon button was present but not clicked to reveal all chip types). Gap: filter chip dropdown full option set not cataloged.

---

## Verified Flows

### Flow 1: Run Detail → Tests Tab → Sort → Filter

1. Navigate to `/runs/{id}/` with a finished run
2. Run Detail panel opens on right; Tests tab shown by default
3. Click **Sort** button → dropdown shows Suite / Test / Failure options
4. Click **Suite** → button label changes to "Suite"; list re-sorts by suite
5. Status filter buttons (Passed N / Failed N / Skipped N / Pending N) each filter the list when clicked
6. Verified: sort label persists on button; filter buttons are independent toggles

### Flow 2: Run Detail → Test Sub-Panel (all 4 tabs)

1. Click any test row link in Tests tab
2. Test sub-panel opens on right; URL updates to `/report/test/{testRunTestId}`
3. Summary tab shows result status + step list with per-step result icons
4. Description tab shows Steps heading + step list with Expected Results
5. Code template tab shows `code` block + copy button
6. Runs tab shows run history list with clickable run links, duration `~`, executed timestamps
7. Escape closes panel; URL reverts to `/report` base

### Flow 3: Statistics Tab

1. Click Statistics tab in Run Detail Panel
2. Five sections render: Suites, Tags, Labels, Assignees, Priorities + Custom Statuses
3. Each section has sort-by-name / sort-by-failed links; status filter icons
4. Suites section has Folders toggle

### Flow 4: Defects Tab (empty state)

1. Click Defects tab (programmatic click required due to detail panel overlap)
2. Empty state renders: `"No defects found. You can link some jira-issue to test or other issues ."`
3. Two links visible: "jira-issue" → `/settings/jira`, "other issues" → `/settings/issue`
4. No add-defect button or form is present in the tab; tab is read-only

### Flow 5: Report Page Extra Menu

1. Navigate to `/runs/{id}/report/`
2. Click extra menu button (`btn-open`) in page header
3. Dropdown lists: Relaunch, Advanced Relaunch, Launch a Copy, Pin, Export as PDF, Move, Labels, Share report by Email, Download as Spreadsheet, Share Report Publicly
4. **Copy Link** is a separate standalone button in the header, always visible

### Flow 6: Share Report Publicly (create and revoke)

1. On report page, open extra menu → click **"Share Report Publicly"**
2. Dialog opens: heading "Make Public Report", run title, Expiration Date (flatpickr, default +7 days), Protect by passcode checkbox (default checked), Share button
3. Click **Share** → dialog shows: Link (full URL) + copy, Passcode (5-digit) + copy, Expiration Date + copy, Open Link button, Stop Sharing button
4. A "Share" quick button also appears in the report header
5. Click **Stop Sharing** → toast `"Public run report was removed"` shown; dialog reverts to pre-share state; Share button removed from header

### Flow 7: Compare View

1. Navigate to runs list; click Multi-select icon to enable checkboxes
2. Check 2 runs → bulk action bar shows `"2 runs"` + Compare link
3. Click **Compare** → navigates to `/runs/compare?ids=[...]`
4. Compare page shows: test list (left) with per-run status icons, Overview panel (right) with Main Run / Compare To / Summary metrics
5. Return to runs list via "Runs" breadcrumb link

---

## Happy-path sequence

1. Navigate to `/runs/`
2. Click a finished run row → Run Detail panel opens
3. Verify title, status chip, metadata (Status, Duration, Tests, Executed by, Created by)
4. Click test row → test sub-panel opens; verify 4 tabs (Summary / Description / Code template / Runs)
5. Click Statistics tab → verify 5 sections render with sort/filter controls
6. Click Defects tab → verify empty state renders with jira + issues links
7. Click **Report** link → navigate to `/report/`
8. Verify header: run title heading, Copy Link button, extra menu button
9. Open extra menu → verify full option list
10. Click **Share Report Publicly** → verify dialog, Share action, URL/Passcode display, Stop Sharing
11. Close dialog; navigate to runs list
12. Enable Multi-select; select 2 runs; click Compare → verify compare page layout

---

## AC → Element Map

| AC | Element(s) |
|---|---|
| AC-82 | Report page: test list, status filter bar, Report page header |
| AC-83 | Tests / Statistics / Defects tabs in Run Detail Panel |
| AC-84 | Summary / Description / Code template / Runs sub-tabs in test sub-panel |
| AC-85 | Sort button (Suite/Test/Failure), status filter buttons, Search input, filter icon |
| AC-86 | Overview tabs (Suites/Tags/Labels/Assignees/Priorities), Analytics section (empty = no flaky data), keyboard ↑/↓ navigation |
| AC-87 | Extra menu → "Download as Spreadsheet" button |
| AC-88 | Extra menu → "Export as PDF" button |
| AC-89 | Extra menu → "Share report by Email" → Send Report to Email dialog |
| AC-90 | Extra menu → "Share Report Publicly" → Make Public Report dialog (Expiration Date input, Protect by passcode checkbox) |
| AC-91 | Post-share state: Link + copy, Passcode + copy, Expiration Date + copy, Stop Sharing button; toast `"Public run report was removed"` |
| AC-92 | Compare page (URL `/runs/compare?ids=...`), matrix layout, Overview panel with Summary metrics |
| AC-98 | Defects tab: empty state `"No defects found..."` with jira/issue links; read-only; no add UI surfaced |
| AC-99 | Copy Link: standalone `button.secondary-btn "Copy Link"` in report page header; always visible (not in extra menu) |
| ac-delta-1 | Run title `h3`, status badge `.run-status`, type badge `.badge-type.manual`, metadata DL terms |
| ac-delta-2 | Tests tab row: status icon, suite path, test title link, tag, duration (in custom view) |
| ac-delta-3 | Test row link → sub-panel opens; active row `a[active]` |
| ac-delta-4 | Summary tab: result status `● passed`, step list with per-step icons, empty state (no error) |
| ac-delta-5 | Description tab: Steps heading, step list, Expected Results; read-only |
| ac-delta-6 | Code template tab: `code` block + copy button; empty state = blank tab |
| ac-delta-7 | Runs tab: run history list with run title links → `/runs/{runId}/report/test/{id}` |
| ac-delta-8 | Statistics tab: 5 sections with counts; re-renders on filter (behavior noted) |
| ac-delta-9 | Defects tab: empty state → links to settings; rows when defects present (not tested here) |
| ac-delta-10 | Overview tabs: Suites/Tags/Labels/Assignees/Priorities; switching re-renders list |
| ac-delta-11 | Analytics section: `h4.hide-title-when-empty "Analytics"` — section hidden/empty when no flaky data; no Flaky Tests visible in explored run |
| ac-delta-12 | Search input `combobox "Search by title/message"` in Tests tab |
| ac-delta-13 | Filter icon + status filter buttons; Sort button dropdown |
| ac-delta-14 | ↑/↓ navigation verified: URL changes to adjacent test; Esc closes sub-panel |
| ac-delta-15 | Sort button with dropdown (Suite/Test/Failure); ASC/DESC toggle button |
| ac-delta-16 | Extra menu → "Download as Spreadsheet"; file naming per AC noted as gap (not verified) |
| ac-delta-17 | Extra menu → "Export as PDF"; note: applies to current view |
| ac-delta-18 | Share by Email dialog: email input + `"Separate multiple emails with comma"` hint; no Cancel button |
| ac-delta-19 | Make Public Report dialog: Expiration Date (flatpickr default +7 days), passcode checkbox (default ON), Share button → URL + Passcode shown once |
| ac-delta-20 | Stop Sharing → toast `"Public run report was removed"`; URL revoked |
| ac-delta-21 | Compare page: matrix with per-run status icons, highlighted diff (status icon difference) |
| ac-delta-22 | Custom view settings dialog: column checkboxes + width spinbuttons, Save/Cancel |

---

## Conventions (sub-feature specific)

- **"Extended Run Report"** — there is no separate "Extended" mode or URL. The full `/runs/{id}/report/` page is the combined view with both the test list and the Summary/Overview panel. Share Report by Email and Share Publicly are both accessible from the extra menu on this page.
- **Expiration Date default** — 7 days from generation date (flatpickr date input, not a select dropdown with preset values; the pre-filled value IS 7 days)
- **Passcode** — 5-digit numeric, shown once in post-share state; not recoverable after dialog close without re-sharing
- **Copy Link** — standalone button, always visible, not gated behind feature flags in this project
- **Defects tab** — read-only in run context; defect linking is done via test detail settings, not from this tab
