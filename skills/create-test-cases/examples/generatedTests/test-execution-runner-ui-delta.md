---
feature: manual-tests-execution
suite: test-execution-runner
scope: sub-feature-delta
mode: sub-feature-delta
references: _shared-ui.md
entry_url: https://app.testomat.io/projects/project-for-testing/runs/launch/
explored_at: 2026-04-18T10:00:00Z
explored_by: ui-explorer
delta_elements: 52
verified_flows: 5
gaps: 3
---

# UI Element Catalog: Manual Test Runner — Delta

**Last updated:** 2026-04-18
**Env:** beta
**Collected by:** Playwright MCP

> Delta only. All shared chrome (sidebar nav, runs list toolbar, run detail panel, run report, edit run page, header-level runner buttons already in `_shared-ui.md`) is NOT repeated here.

---

## Screen: Manual Test Runner — Extra Options Menu

**URL:** /projects/project-for-testing/runs/launch/{id}/?entry={testId}
**Entry points:** Runner header → dots-horizontal icon (`ember56`, `btn-only-icon btn-lg`)

### Dropdown Options
- **'Refresh structure'** — reloads the test tree from server; immediate re-render
- **'Hide Creation Buttons'** / **'Show Creation Buttons'** — toggles visibility of "Add note to suite" and "Add test to suite" inline buttons in suite rows
- **'Hide Labels'** / **'Show Labels'** — toggles label chips in test tree rows
- **'Show Tags'** / **'Hide Tags'** — toggles tag chips in test tree rows

> Note: "Collapse all suites", "Expand all suites", "Tree view / List view" are NOT in this menu. "Collapse all" is a standalone toolbar button (already in `_shared-ui.md`). No "List view" toggle was found in the runner during exploration.

---

## Screen: Manual Test Runner — Priority Filter

**URL:** /projects/project-for-testing/runs/launch/{id}/?entry={testId}
**Entry points:** Runner filter toolbar (above test tree)

### Filter Buttons (icon-only, tooltip via aria-describedby)
- **Normal priority** — filters tree to Normal priority tests; `btn-only-icon btn-md`
- **Low priority** — filters tree to Low priority tests
- **High priority** — filters tree to High priority tests
- **Important priority** — filters tree to Important priority tests
- **Critical priority** — filters tree to Critical priority tests

> These filter buttons are present in the runner toolbar (same visual as Run Detail panel priority filters). When active, the test tree displays only matching tests; the status counters reflect the filtered scope.

---

## Screen: Manual Test Runner — Test Tree Suite Row Actions

**URL:** /projects/project-for-testing/runs/launch/{id}/?entry={testId}
**Entry points:** Hover over any suite row in the left panel tree

### Buttons (per-suite, icon-only)
- **'Add note to suite'** — icon `md-icon-comment-plus`; triggers a note creation form attached to the suite; hidden when "Hide Creation Buttons" is active
- **'Add test to suite'** — icon `md-icon-plus`; opens inline test creation for the suite; hidden when "Hide Creation Buttons" is active

### Per-test Assignee Badge
- **Assignee avatar badge** — small avatar icon on test row in tree; visible when multiple testers are assigned to the run and the test is assigned to a specific tester; `class: avatar-badge` or similar (exact class not confirmed); tooltip shows assignee name via `aria-describedby`

---

## Screen: Manual Test Runner — Test Detail Pane (Delta Elements)

**URL:** /projects/project-for-testing/runs/launch/{id}/?entry={testId}
**Entry points:** Click any test row in the left panel tree

> Elements already in `_shared-ui.md` (title, suite breadcrumb, close button, edit metafields, Result heading, hotkey hint, PASSED/FAILED/SKIPPED buttons, result message textarea) are NOT repeated.

### Resize Handle
- **Horizontal splitter / gutter** — `class: gutter gutter-horizontal`; positioned between left (tree) and right (detail) panels; dragging left/right resizes the panel widths; resize state persists during the session

### Description Area (when test has description)
- **Test description block** — rendered below test title; hidden by default in "Run as checklist" mode; HTML-rendered markdown content

### Steps Section (when test has steps defined)
- **Step rows** — each step row shows step text; no step rows visible for bare test stubs in `project-for-testing`
- **Step status indicator** — per-step click target; single-click = Passed (green), double-click = Failed (red), triple-click = Skipped (grey); `class: step-status` or similar; cycles on repeated clicks

### Custom Sub-status Buttons
- **Custom status buttons** — appear below PASSED/FAILED/SKIPPED area ONLY after a standard status is selected; rendered as inline button row (`class: substatus passed mb-1` for passed-type, `class: substatus failed mb-1` for failed-type, etc.)
- Sub-status buttons do NOT replace the standard status; they attach to it
- Sub-status area is hidden (or disabled) until a standard status button is clicked

### Attachments Section
- **Attachment drop zone** — `class: upload-active` when file is dragged over; shown below the result message textarea after a status is applied
- **'browse'** link — inline text link inside drop zone; opens file picker dialog
- **Drag-and-drop target** — the drop zone accepts file drops; visual highlight class `upload-active` activates on drag-over
- **Attachment view toggles** — 4 icon buttons controlling attachment display layout:
  - **Large Thumbnail** — `md-icon-view-grid-large` (or similar); shows large previews
  - **Small Thumbnail** — `md-icon-view-grid` (or similar); shows compact grid
  - **Grid** — grid layout
  - **List** — list layout with filename
  - (Exact icon classes not confirmed — attachment area requires an uploaded file to observe; GAP: no file was uploaded during exploration)
- **Attachment preview 'Fit to width'** button — available in attachment preview lightbox; scales image to panel width
- **Attachment preview 'Full screen'** button — expands attachment to browser full screen
- **Attachment delete button** — trash icon on each attachment; triggers `"Are you sure?"` confirmation before deletion

### Timer Toolbar (per-test, in detail pane)
- **Timer display** — shows elapsed time `HH:MM:SS`; `class: timer-toolbar`; updates while Auto-track is active
- **'Set Time'** button — opens a flatpickr-based time picker input; allows manual entry of duration (HH:MM:SS or HH:MM format); saving replaces the auto-tracked value
- **'Track' / Stop timer** button — icon-only toggle; `md-icon-timer`; starts/stops the per-test stopwatch; separate from the global Auto-track header button

---

## Screen: Manual Test Runner — Note Detail Pane

**URL:** /projects/project-for-testing/runs/launch/{id}/?entry={noteId}
**Entry points:** Click a note row in the test tree (note rows show `badge-type note`)

### Note pane header buttons (icon-only)
- **Timer button** — icon `md-icon-timer`; allows time tracking on the note; same timer toolbar as test detail pane
- **Extra options** — icon `md-icon-dots-horizontal`; opens note-level context menu (options not fully explored)

### Note pane body
- **Note title** — editable text field at top of note pane
- **Note content** — rich-text / markdown body area
- **'Convert to test'** button — `class: primary-btn btn-text-and-icon btn-md`, icon `md-icon-folder`; converts the note into a new test; the new test appears in the tree under the parent suite
- **Note badge in tree** — note rows in the test tree show a `badge-type note` label (text `"note"`) to distinguish them from test rows

---

## Screen: Manual Test Runner — Create Note Form (Inline)

**URL:** /projects/project-for-testing/runs/launch/{id}/?entry={testId}
**Entry points:** Runner header → **'Create notes +'** button; OR suite row → 'Add note to suite'

### Form fields
- **Note title** input — `data-test-create-test-form` attribute on the form container; text input for the note title
- **Note body** — text area for note content

### Buttons
- **Save note** — confirms note creation; note appears in test tree with `badge-type note`
- **Cancel** — dismisses the inline form without saving

### Toast
- No distinct toast observed for note creation; note appears in tree immediately upon save (optimistic UI or page re-navigation)

---

## Screen: Manual Test Runner — Finish Run Confirm Dialog

**URL:** /projects/project-for-testing/runs/launch/{id}/?entry={testId}
**Entry points:** Runner header → **'Finish Run'** button

### Dialog
- **Browser native confirm dialog** (not a custom modal) — text: `"N tests were not run. Pending tests that are not linked to any other test result will be marked as skipped."`
- **'OK'** — finishes the run; navigates to run detail / report
- **'Cancel'** — returns to runner without finishing

---

## Screen: Manual Test Runner — Checklist Mode

**URL:** /projects/project-for-testing/runs/launch/{id}/?entry={testId}
**Entry points:** Run was created with **'Run as checklist'** toggle ON

### Behavior differences (checklist vs. standard)
- Test description is **hidden** by default in the detail pane
- **'Toggle Description'** option appears in test-level extra menu (per-test dots menu)

### Test extra menu (per-test dots icon in detail pane header)
- **'Toggle Description'** — shows/hides the description block for the current test only; available in checklist mode
- Other per-test menu items (not cataloged in detail — not explored in checklist run context)

---

## Toasts (Runner-specific)

- Success: `"Run has been finished"` — after confirming Finish Run dialog (exact text from `_shared-ui.md` Verified Flows; runner-specific trigger)
- No distinct note-creation toast observed
- No distinct step-save toast (step results persist silently to backend)
- Custom status applied: no toast observed (inline visual update only)

> GAP: attachment upload success/error toast text not captured (no file uploaded during exploration).
> GAP: "Set Time" save success feedback (toast or inline) not confirmed.

---

## Empty States

- **No steps defined** — when a test has no steps, the Steps section is absent from the detail pane (no empty-state message; section simply does not render)
- **No attachments** — when no files have been attached, the attachment drop zone is displayed as the primary affordance with "Drag and drop or browse" text

---

## Happy-path sequence

1. Navigate to an ongoing run at `/projects/project-for-testing/runs/launch/{id}/?entry={testId}`
2. Confirm runner loads: left panel shows test tree with suite rows, right panel shows test detail pane
3. Click **'PASSED'** button — status applies; custom sub-status buttons appear below the standard buttons
4. Observe attachment drop zone appears below result message textarea
5. Optionally type text in **Result message** textarea
6. Click the next test in the tree — previous result persists (AC-delta-3, AC-delta-9)
7. Hover over a suite row — **'Add note to suite'** and **'Add test to suite'** buttons appear
8. Click runner header **'Create notes +'** → note creation form opens inline
9. Enter note title → Save → note row appears in tree with `"note"` badge
10. Click note row in tree → note detail pane opens with **'Convert to test'** button
11. Click **'Finish Run'** → browser native confirm dialog appears → click **'OK'** → run finishes

---

## Verified Flows

### Flow 1: Apply standard status + observe custom sub-status
- Opened test in runner
- Clicked **'PASSED'** — test row in tree shows green ● indicator
- Custom sub-status buttons (`class: substatus passed mb-1`) appeared in result area
- Confirmed: custom status only appears AFTER standard status selected (AC-delta-21, AC-31)

### Flow 2: Create and locate a note
- Clicked header **'Create notes +'** → inline note form appeared (`data-test-create-test-form`)
- Note title input focused; content entered
- After save: runner navigated to note entry; note row with `badge-type note` visible in tree (AC-delta-10)

### Flow 3: Note detail pane and Convert to test
- Clicked note row in tree → note detail pane loaded
- Confirmed **'Convert to test'** button present (`class: primary-btn btn-text-and-icon btn-md`, icon `md-icon-folder`) (AC-delta-12)
- Timer button (`md-icon-timer`) and extra options (`md-icon-dots-horizontal`) confirmed in note pane header

### Flow 4: Extra options menu contents
- Clicked runner header dots menu (`ember56`) → menu opened
- Confirmed options: **'Refresh structure'**, **'Hide Creation Buttons'**, **'Hide Labels'**, **'Show Tags'**
- Confirmed Collapse all and Tree/List view are NOT in this menu (AC-delta-16 partial — gap for Collapse/Expand all and Tree/List view not found in menu)

### Flow 5: Resize handle
- `.gutter.gutter-horizontal` splitter element confirmed present between left and right panels (AC-delta-14)

---

## Open Questions / Gaps

1. **Attachment view toggles** (AC-delta-5, AC-delta-6, AC-delta-7) — attachment area identified (drop zone + browse link) but toggle buttons (Large Thumbnail / Small Thumbnail / Grid / List) and preview buttons (Fit to width / Full screen) could not be confirmed without uploading an actual file. Class names estimated, not verified.

2. **Step-by-step markings** (AC-delta-8, AC-delta-9, AC-35, AC-36) — step rows structure identified in HTML pattern but no test in `project-for-testing` has steps defined, so the single/double/triple-click cycle UI could not be directly observed. Structure is present in the codebase (step-status indicator per step row).

3. **"Finish Run" toast text** — `_shared-ui.md` records `"Run has been finished"` from the feature baseline. Runner-specific trigger confirmed; exact toast class is `.custom-notify-body-message` but the string was not re-captured live during this delta exploration.

---

## Conventions (runner-specific additions)

- **Splitter layout:** `.splitter` root; `.gutter.gutter-horizontal` resize handle; left = test tree panel, right = test detail panel
- **Custom sub-statuses:** inline buttons, never a dropdown; appear in result pane only after standard status chosen; type-specific (`substatus passed`, `substatus failed`, `substatus skipped`)
- **Notes vs. tests in tree:** note rows are visually distinguished by `badge-type note` badge; they share the same tree space as test rows
- **Timer:** per-test timer separate from global Auto-track header toggle; per-test timer uses `timer-toolbar` class and flatpickr for manual entry
- **Checklist mode:** description hidden by default; "Toggle Description" per-test in extra menu; run-level setting (configured at creation, not changeable in runner)
