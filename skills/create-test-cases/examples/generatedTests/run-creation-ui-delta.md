---
feature: manual-tests-execution
suite: run-creation
scope: sub-feature-delta
mode: sub-feature-delta
references: _shared-ui.md
entry_url: https://app.testomat.io/projects/project-for-testing/runs/new
explored_at: 2026-04-17T20:44:00Z
explored_by: ui-explorer
delta_elements: 28
verified_flows: 5
gaps: 1
---

# UI Element Catalog Delta: run-creation

**Last updated:** 2026-04-17
**Env:** beta
**Collected by:** Playwright MCP

> Elements already in `_shared-ui.md` (New Manual Run Sidebar section) are NOT repeated here.
> This delta catalogs only elements specific to the run-creation sub-feature that _shared-ui.md does not cover.

---

## Screen: Runs List Page — Split Button Detail

**URL:** /projects/project-for-testing/runs/
**Entry points:** Runs List toolbar

### Buttons
- **'Manual Run' left part** — `link[href="/projects/{project}/runs/new"]`, class `btn-split-right primary-btn`; clicking navigates to `/runs/new` AND opens the New Manual Run sidebar as a drawer. This is the primary creation entry point.
- **'Manual Run' right chevron** — `button.btn-split-right` (child button inside the link wrapper); opens the arrow dropdown WITHOUT opening the sidebar
- **Arrow dropdown items** (appear on chevron click, not on left-part click):
  - **'New Group'** — link → `/projects/{project}/runs/groups/new`
  - **'Report Automated Tests'** — link → `/projects/{project}/runs/setup`
  - **'Launch from CLI'** — link → `/projects/{project}/runs/new-cli`
  - **'Mixed Run'** — link → `/projects/{project}/runs/new-mixed`

---

## Screen: New Manual Run Sidebar — Delta Elements

**URL:** /projects/project-for-testing/runs/new
**Entry points:** 'Manual Run' left-part click; Tests page "Run" bulk action → "Advanced Settings"

> Core sidebar structure (header, Title input, RunGroup, Environment, Description, scope tabs, Launch/Save/Cancel) is in `_shared-ui.md`. Below are delta-specific details.

### Inputs (delta details)
- **Title input** — `textbox`, placeholder `"Title (optional)"`, HTML `maxlength` is unset (maxLength = -1); 255-char limit is enforced server-side or via JS. If left blank on Save/Launch, auto-generates as `"Manual tests at {DD MMM YYYY} {HH:MM}"` (example: `"Manual tests at 17 Apr 2026 20:44"`).
- **Description textarea** — optional; no enforced client-side character limit; whitespace-only treated as blank.

### Assignee Section (delta details)
- **Creator default role** — current user appears by default with `as manager` label; no action required for default assignment.
- **'Assign more users' link** — `a.baseLink[href="#"]`; opens tester-assignment panel (sub-feature #6 owns details). Presence in creation sidebar owned here.

### RunGroup Dropdown (delta details)
- **'Select RunGroup' trigger button** — expands combobox with search input; options list includes:
  - `"Without rungroup"` — always present as first option; leaves run ungrouped
  - Named groups (e.g., `"E2E MultiEnv Test"`) — existing run groups
- **TRAP:** Pressing Escape while dropdown is open closes the ENTIRE sidebar (not just dropdown) and navigates to `/runs/`. Do not use Escape to dismiss RunGroup dropdown in tests.

### Scope Tabs (delta details)
- **Active state indicator** — uses CSS class `btn-selected` (NOT `aria-selected`). Default active: `"All tests"` (has `btn-selected` on load).
- **Scope tabs behave as single-select radio group** — switching tabs clears any selection made in the previous tab.

### "All tests" / "Test plan" tab (default state)
- Checkboxes visible in test tree but rendered `[disabled]` — cannot be checked.
- Launch and Save buttons are **enabled** immediately.

### "Select tests" tab content (delta)
- **Search input** — `searchbox`, placeholder `"Search test or suite by title"`; filters the test tree in real time.
- **'Run Automated as Manual' toggle** — rendered in the "Select tests" content area (not only in main sidebar); `switch`, `aria-checked="false"` default.
- **'No matched tests' button** (disabled state) — `button[disabled]`, class `primary-btn btn-text-and-icon btn-sm`; shows when no suites/tests are checked.
- **'N tests matched' button** (enabled state after selection) — same button, updates text to show count (e.g., `"6 tests matched"`); enabled when at least one test is selected.
- **'Filters' button with badge** — `button.secondary-btn`, shows `"Filters"` text + count badge (e.g., `"1"` = 1 filter active).
- **Checkboxes enabled** — suite checkboxes switch from `[disabled]` to enabled when "Select tests" tab is active.
- **Launch and Save** become **disabled** until ≥1 test is selected; re-enable once selection exists.

### "Test plan" tab content (delta)
- **Search input with keyboard shortcut hint** — `[Cmd+K]` hint displayed next to search
- **'New Test Plan' button** — appears in tab to create a plan inline
- **Empty state** — `"No test plans found."` when no test plans exist in project

### "Without tests" tab content (delta)
- **Descriptive paragraph** — static text: `"You can start a Manual Run with no predefined tests and add folders, suites, tests, or notes later as you build out your execution plan. This is useful when you prefer to first create the run structure and populate it afterwards."`
- **Launch and Save** are **immediately enabled** (no test selection required).

### Environment Section (delta detail)
- **Environment list** — `list[cursor=pointer]`, placeholder `"Set environment for execution"`; clicking the list or the **'+'** icon button opens Multi-Environment Configuration modal (modal details owned by sub-feature #7)

---

## Screen: Tests Page — Run Creation Entry Points

**URL:** /projects/project-for-testing/
**Entry points:** Tests page multi-select bar and suite-level bulk "Run" action

### Multi-select Mode
- **'Multi-select' button** — `button.btn-only-icon.btn-md`, `aria-describedby` tooltip `"Multi-select"`; enables checkboxes on all suite and test rows.
- **Suite checkboxes** — appear as `input[type=checkbox]` with `name="select {suiteId}"`, class `nested-item-checkbox over-border checkbox-over`.

### Bulk Action Bar (appears after selecting ≥1 suite/test)
- **Bar container** — `div.list-runs-toolbar-wrapper`, fixed positioned, appears at bottom of viewport when items are selected.
- **'Select suite (N)' button** — `secondary-btn btn-text-and-icon btn-sm`; shows count of selected items; clicking deselects all.
- **'Run' button** — `primary-btn btn-text-and-icon btn-sm`; opens the **Run Tests quick modal** (see below).
- **'Labels' button** — `secondary-btn btn-text-and-icon btn-sm`
- **'Copy' button** — `secondary-btn btn-text-and-icon btn-sm`
- **'Move' button** — `secondary-btn btn-text-and-icon btn-sm`
- **'Share' button** — `secondary-btn btn-text-and-icon btn-sm`
- **'Tags' button** — `secondary-btn btn-text-and-icon btn-sm`
- **'Link' button** — `secondary-btn btn-text-and-icon btn-sm`
- **'Delete' button** — `secondary-btn btn-text-and-icon btn-sm`
- **Close icon button** — `third-btn btn-only-icon btn-sm` (last button); deselects all / closes bar

### Run Tests Quick Modal (opened from bulk bar 'Run' button)
- **Modal class** — `modal-dialog-container run-tests ember-modal-dialog`
- **Title** — `"Run"` heading + `"Run manually"` tab label
- **Tab** — `"Run manually"` (single tab, `aria-selected="true"`)
- **Quantity display** — shows test count (e.g., `"Quantity: 9"`)
- **Environments** — shows `"Environments: none"` or selected envs
- **'Run Automated as Manual' toggle** — `switch` inside modal
- **'Launch' button** — `primary-btn btn-lg btn-text-and-icon`; launches run immediately
- **'Advanced Settings' link** — `a.baseLink.primary`; navigates to `/projects/{project}/runs/new?plan={generatedPlanId}` (opens full New Manual Run sidebar with test plan pre-populated from selection)

---

## Empty States

- **"Test plan" tab, no plans exist:** `"No test plans found."`
- **"Select tests" tab, nothing checked:** 'No matched tests' button (disabled) shown in toolbar

## Loading States
- **Sidebar opens** with test tree populated; no explicit loading spinner observed for tree data on typical load

---

## Happy-path sequence

1. Navigate to **Runs** page (`/projects/{project}/runs/`)
2. Click **'Manual Run'** button (left part of split button)
3. Sidebar opens as right-side drawer with heading `"New Manual Run"`
4. (Optional) Fill **Title** input — leave blank for auto-generated title
5. (Optional) Click **'Select RunGroup'** → select `"Without rungroup"` or named group
6. (Optional) Click **Environment** list → Multi-Environment Configuration modal → select environments → 'Save'
7. Scope is `"All tests"` by default (has `btn-selected` class) — leave as-is or choose different tab
8. Click **'Save'** → URL navigates to `/runs/` (list); auto-title format `"Manual tests at {DD MMM YYYY} {HH:MM}"` applied if title was blank; run appears in list with "New Run" status
9. OR click **'Launch'** → URL navigates to `/runs/launch/{runId}?entry={firstTestId}`

---

## Verified Flows

### Flow 1: Save run with blank title (confirmed)
- Steps: Navigate to `/runs/new` → do not fill Title → click 'Save'
- Outcome: URL changes to `/runs/` list, new run visible with auto-title `"Manual tests at 17 Apr 2026 20:44"` (format confirmed)
- Toast: not captured (toast dismissed before query); run status = "New Run" (pending/not-started)
- Confirms: ac-delta-4, ac-delta-12

### Flow 2: Launch run with blank title (confirmed)
- Steps: Navigate to `/runs/new` → do not fill Title → click 'Launch'
- Outcome: URL navigates to `/projects/{project}/runs/launch/{runId}?entry={firstTestId}` (runner opens with first test pre-opened)
- Confirms: ac-delta-11

### Flow 3: Select tests tab — checkbox enable/disable (confirmed)
- Steps: Open sidebar → observe "All tests" tab active (checkboxes disabled) → click "Select tests" tab
- Outcome: Checkboxes become enabled; Launch/Save become disabled; "No matched tests" button appears disabled
- Steps: Check one suite → "6 tests matched" button appears enabled; Launch/Save become enabled
- Confirms: ac-delta-8, ac-delta-9

### Flow 4: Without tests tab — immediate Launch enabled (confirmed)
- Steps: Open sidebar → click "Without tests" tab
- Outcome: Descriptive paragraph visible; Launch and Save are immediately enabled (not disabled)
- Confirms: ac-delta-22 (Without tests mode creates empty run)

### Flow 5: Multi-select bulk Run → quick modal → Advanced Settings (confirmed)
- Steps: Tests page → click 'Multi-select' button → check 2 suites → bulk bar appears with 'Run' button → click 'Run'
- Outcome: Quick modal opens (`run-tests` class) with "Run manually" tab, Quantity, Launch button, "Advanced Settings" link
- Steps: Click 'Advanced Settings'
- Outcome: URL navigates to `/runs/new?plan={planId}` (full sidebar with selected suites as plan pre-populated)
- Confirms: ac-delta-17

---

## Open Questions / Gaps

1. **ac-delta-18 (validation keeps sidebar open):** Validation error behavior when required RunGroup is enabled + missing, or when a server error occurs on Save/Launch, could not be triggered in this session (no project setting enforcing RunGroup). Gap: exact inline error message / field highlight text not captured. Expected behavior: sidebar remains open with error inline. gaps=1

2. **ac-delta-16 (single-test "Add to Run" from Tests page):** Explored test row hover actions (Create test, Edit test, Link test, Delete test), test detail page extra menu (navigates away), and multi-select bar. No explicit "Add to Run" button found for single tests. The multi-select bulk "Run" → quick modal covers the N-tests path. The single-test "Add to Run" flow (listing only unfinished runs) may be accessed via test detail page extra menu (which navigated away in exploration) or may not exist in current UI. Not a hard gap — ac-delta-16 may map to the same bulk "Run" flow with 1 test selected. Note for Phase 3: if test cases reference a per-test "Add to Run" button, flag as gap.
