---
feature: manual-tests-execution
suite: runs-list-management
scope: sub-feature-delta
mode: sub-feature-delta
references: _shared-ui.md
entry_url: https://app.testomat.io/projects/project-for-testing/runs/
explored_at: 2026-04-19T19:45:00Z
explored_by: ui-explorer
delta_elements: 52
verified_flows: 7
gaps: 0
---

# UI Element Catalog: Runs List Management (Delta)

**Last updated:** 2026-04-19
**Env:** beta
**Collected by:** Playwright MCP

> Delta only — elements already in `_shared-ui.md` (breadcrumb, top nav, shared toolbar icons, filter tab strip skeleton, chart legend, run-row status indicators, archive links, TQL modal shell, context menu skeleton) are NOT repeated here.

---

## Screen: Runs List Page — Row Context Menu (State-Aware Detail)

**URL:** /projects/project-for-testing/runs/
**Entry points:** any run row → `⋯` button (`btn-only-icon btn-md`)

### Finished / Passed run (status = passed/failed/terminated, all tests run)

Menu items (in order):
- **'Relaunch'** — button; creates a new run with same config; available for finished runs
- **'Advanced Relaunch'** — link → `/runs/{id}/advanced`; available for finished runs
- **'Launch a Copy'** — button; creates duplicate run; available for finished runs
- **'Edit'** — link → `/runs/edit/{id}`; available for finished runs (also appears on in-progress)
- **'Finish'** — button; force-finishes run; available on both finished and in-progress runs
- **'Pin'** → changes to **'Unpin'** after pin action; button; see Pin section below
- **'Export as PDF'** — button; triggers PDF export (downstream owned by #8)
- **'Move'** — button; opens Move dialog; see Move Modal section below
- *(separator)*
- **'Labels'** — link → `/runs/{id}/labels`; opens Labels page
- *(separator)*
- **'Move to Archive'** — button; archives the run; toast: `"Run has been archived"`
- **'Purge'** — button; permanently deletes run; toast: `"Run has been deleted"`

### In-progress / Running run (status = running, tests still pending)

Menu items (in order):
- **'Launch'** — link → `/runs/launch/{id}`; resumes/continues run
- **'Advanced Relaunch'** — link → `/runs/{id}/advanced`
- **'Edit'** — link → `/runs/edit/{id}`
- **'Finish'** — button; force-finishes run
- **'Pin'** — button (same behavior)
- **'Export as PDF'** — button
- **'Move'** — button
- *(separator)*
- **'Labels'** — link
- *(separator)*
- **'Move to Archive'** — button
- **'Purge'** — button

**State difference vs finished run:** `Launch a Copy` absent; `Launch` replaces `Relaunch`.

### RunGroup row context menu

Menu items (in order):
- **'Edit'** — link → `/runs/groups/edit/{id}`
- **'Copy'** — button; duplicates the group
- **'Add Automated Run'** — button; adds automated run into group
- **'Mixed Run'** — link → `/runs/new-mixed?groupId={id}`; creates mixed run inside group
- **'Pin'** → **'Unpin'** — button; see Pin section
- **'Move'** — button; opens Move dialog
- *(separator)*
- **'Move to Archive'** — button; **disabled** when group has active runs
- **'Purge'** — button; permanently deletes group

**Key difference from run row:** no Relaunch/Launch/Labels; has Copy, Add Automated Run, Mixed Run instead.

---

## Screen: Runs List Page — Pin / Unpin

**URL:** /projects/project-for-testing/runs/
**Entry points:** row context menu → Pin

### Pin behavior
- **'Pin'** button — available in context menu for both runs and RunGroups; after click, item moves to top of list
- **Pin indicator** — custom SVG icon (`btn-open opacity-100 scale-100 delay-50` wrapper) appears at leading edge of the pinned row's title area; icon path represents a thumbtack shape
- **'Unpin'** button — replaces 'Pin' in context menu for already-pinned items; after click, item returns to chronological position
- **Toast (Pin):** `"Run has been pinned"` (shared catalog entry; confirmed here)
- **Toast (Unpin):** no toast observed on unpin — row repositioned silently

---

## Screen: Runs List Page — Move to RunGroup Modal

**URL:** /projects/project-for-testing/runs/ (modal overlay)
**Entry points:** row context menu → Move

### Buttons
- **'Move'** — primary; disabled until destination is selected; triggers move action
- **'Cancel'** — closes modal without change

### Inputs
- **Search** — `searchbox "Search rungroup by title"` — filters the rungroup list

### RunGroup list
- **'Root'** — button; moves run to top-level (no group)
- **'{group name}'** — button per group (e.g., `"E2E MultiEnv Test"`, `"UI Explorer Test Group"`); selecting enables the Move button

---

## Screen: Runs List Page — Multi-Select Bulk Toolbar

**URL:** /projects/project-for-testing/runs/
**Entry points:** Runs List toolbar → Multi-select icon button (`btn-only-icon btn-md mr-3.5`, `aria-describedby` → `"Multi-select"`)

### Toggle behavior
- Multi-select mode **on**: per-row checkboxes appear; bottom bulk toolbar rendered
- Multi-select mode **off**: checkboxes disappear; bottom toolbar removed; Close button (`third-btn`) in toolbar dismisses toolbar without deselecting

### Bulk toolbar (0 selected — toolbar absent; 1+ selected — toolbar appears)

Selection counter:
- **"{N} run"** / **"{N} runs"** — plain text; shows selected count

Bulk action buttons (always present after first selection):
- **'Select all'** — link; selects all visible run rows
- **'Archive'** — button (`Archive`); bulk-archives selected runs
- **'Labels'** — button (`Labels`); bulk-applies labels to selected runs (see Labels section)
- **'Delete'** — button (`Delete`); bulk-deletes (purges) selected runs

Conditional button (appears at 2+ selected runs):
- **'Compare'** — link → `/runs/compare?ids=["{id1}","{id2}"]`; navigates to comparison view; **enabled only when ≥ 2 runs selected** (destination owned by #8)

Extra dropdown button (always present after 1+ selection):
- Icon-only button (no tooltip via aria-describedby; last button in toolbar) — opens dropdown:
  - **1 run selected:** Link, Download, Move
  - **2+ runs selected:** Link, Download, **Merge**, Move
  - **'Link'** — button; links issue to selected runs
  - **'Download'** — button; downloads as XLSX spreadsheet (entry point only; file download owned by #8)
  - **'Merge'** — button; merges runs (only with 2+ selected)
  - **'Move'** — button; opens Move to RunGroup modal for bulk move

---

## Screen: Runs List Page — Custom View / Settings

**URL:** /projects/project-for-testing/runs/
**Entry points:** Runs List → 'Custom view' button

### View toggle
- **'Custom view'** button (`secondary-btn btn-sm`) — switches list to table view; button text changes to **'Default view'** when active
- **Settings gear** button (`btn-only-icon btn-sm`) — only clickable in Custom view mode; disabled in Default view

### Custom view table columns (all visible by default)
**Column headers:** Title | Plan | Labels | Tags & Envs | Tests Count | Defects Count | Status | Assigned to | Finished at | Actions

### Runs list settings panel (opened by Settings gear)

**Panel heading:** `"Runs list settings"` (`h4`)

Checkboxes + Width inputs (each column is independently toggleable):
- **'Hyphenation (tags, labels, envs)'** checkbox — global wrapping option; default unchecked
- **'Plan'** checkbox + width `spinbutton` (default 200px)
- **'Labels'** checkbox + width `spinbutton` (default 100px)
- **'Tags & Envs'** checkbox + width `spinbutton` (default 100px)
- **'Tests count'** checkbox + width `spinbutton` (default 100px)
- **'Defects count'** checkbox + width `spinbutton` (default 130px)
- **'Status'** checkbox + width `spinbutton` (default 150px)
- **'Assigned to'** checkbox + width `spinbutton` (default 100px)
- **'Finished at'** checkbox + width `spinbutton` (default 100px)
- **'Actions'** checkbox + width `spinbutton` (default 100px)

**Buttons:**
- **'Save'** — saves column config; persists per user/project across reloads
- **'Cancel'** — closes panel without saving

---

## Screen: Query Language Editor Modal (Delta Detail)

**URL:** /projects/project-for-testing/runs/ (modal overlay)
**Entry points:** Runs List toolbar → QLE icon button (`btn-only-icon btn-lg`, `aria-describedby` → `"Query Language Editor"`)

> Shell already in `_shared-ui.md`. Delta covers: button enablement state, AI text hint, tab content, error/apply behavior.

### Button states
- **'Apply'** — always enabled; applies query, dismisses modal, filters list, appends `filterParam=search%3D{encoded}` to URL
- **'Save'** — **disabled** until a non-empty query is entered in editor; once text is present but query is not yet applied, Save remains disabled (Save requires a valid named query trigger that differs from Apply)
- **'Cancel'** — always enabled; dismisses modal without filtering

### AI text hint
- Text near Save/Apply: `"Enter your request as a text and AI will generate the query."` — plain text hint below the buttons area

### Tabs content

**Saved Queries tab** — lists user-saved named queries (empty in project-for-testing)

**Examples (3) tab** — 3 preset example queries:
1. `has_suite == 'bcaf11af' and has_message == 'Blocked'`
2. `finished_at == today() and (label == 'Severity:High' or label == 'Severity:Critical')`
3. `plan % 'release' and jira == 'TMS-1' and not (priority == 'low')`

### Operators sidebar (full list)
- `and, or, not` — logical operators
- `==` — equals, `!=` — not equals
- `<, >, >=, <=` — works for `finish_at`, `created_at`...
- `in [...]` — value is in the list
- `%` — string inclusion, works for title

### Variables sidebar (clickable — inserts into editor)
`title`, `plan`, `rungroup`, `env`, `tag`, `label`, `jira`, `duration`, `passed_count`, `failed_count`, `skipped_count`, `automated`, `manual`, `mixed`, `finished`, `unfinished`, `passed`, `failed`, `terminated`, `published`, `private`, `archived`, `unarchived`, `with_defect`, `has_defect`, `has_test`, `has_test_tag`, `has_test_label`, `has_suite`, `has_message`, `has_custom_status`, `has_assigned_to`, `has_retries`, `has_test_duration`, `has_priority`, `created_at`, `updated_at`, `launched_at`, `finished_at`

### Links
- **'Read Docs'** — external link → `https://docs.testomat.io/usage/query-language`

---

## Screen: Runs List Page — Active Filter State

**URL:** /projects/project-for-testing/runs?filterParam={encoded}
**Entry points:** QLE modal → Apply; or filter tab click

### Filter active indicator (appears when any filter is applied)
- **"{N} runs found" / "{N} rungroups found"** — plain text counter showing filtered count
- **Filter icon** button — icon-only; adjacent to the count text
- **'Reset'** button — `secondary-btn` with reset icon; clears filter and returns URL to `/runs`; filter count disappears

### URL share behavior
- Filter state is encoded in URL as `filterParam={encoded}` query parameter
- Shareable: pasting URL reproduces the filter
- All links on the page (archive links, group links) inherit `filterParam` while filter is active

### Groups tab filter
- URL: `?filterParam=groups%3Dtrue` when Groups tab active
- Count shows `"{N} rungroups found"`
- Only RunGroup rows shown; individual run rows hidden

---

## Screen: Runs List Page — Chart Toggle

**URL:** /projects/project-for-testing/runs/
**Entry points:** chart area visible

### Chart toggle control
- **Chart toggler div** (`.chart-toggler-wrapper > .chart-toggler`) — clickable div rendered above the chart; not a `<button>` element
- **Icon when chart visible:** `md-icon-eye-off` SVG — click to hide chart
- **Icon when chart hidden:** `md-icon-eye` SVG — click to show chart
- **Chart hidden state:** chart SVG/canvas removed from DOM; toggler remains; list header row shifts up
- **No toast** on toggle — purely visual state change

### Legend toggle (chart visible state)
- **'Skipped'** legend item — `cursor-pointer`; clicking toggles Skipped dataset visibility in chart
- **'Passed'** legend item — `cursor-pointer`; clicking toggles Passed dataset visibility
- **'Failed'** legend item — `cursor-pointer`; clicking toggles Failed dataset visibility
- Visual feedback: toggled-off legend items typically appear faded (visual only, not cataloged via DOM due to canvas rendering)

---

## Screen: Runs List Page — RunGroup Expand/Collapse (In-place)

**URL:** /projects/project-for-testing/runs/
**Entry points:** list view → RunGroup row → expand chevron button

### RunGroup row controls
- **Expand chevron button** — `btn-only-icon btn-md expand-btn` class; `aria-describedby` → `"Expand"`; toggles inline child runs
- **Child run rows** (after expand) — rendered as `<li>` under parent group `<li>` in the same `<ul>`; each shows:
  - Run title + environment label (e.g., `"E2E MultiEnv Test Firefox"`, `"E2E MultiEnv Test Chrome"`)
  - Environment tag (e.g., `Firefox`, `Chrome` with env indicator image)
  - Status percentage (`0%`, `100%`, etc.)
  - Own `⋯` context menu button

### Toolbar 'Expand' button
- **'Expand'** icon button — in main toolbar nav area (`btn-only-icon btn-md expand-btn`); `aria-describedby` → `"Expand"`; expands/collapses ALL RunGroup rows simultaneously
- Two instances observed in popper list: one in nav (all-group expand) and one per group row

---

## Screen: Runs List Page — Runs Status Report (AI) Button States

**URL:** /projects/project-for-testing/runs/
**Entry points:** persistent in Runs List toolbar

### States
- **Disabled state** — `disabled` attribute set; `ai-btn btn-text-and-icon btn-lg`; `aria-describedby: ember49-popper` → tooltip: `"More than 5 runs are needed to generate a report."`
- **Enabled state** — disabled attribute removed; button becomes clickable when ≥ 5 finished runs exist in project (not reached in current project-for-testing state — all runs are in-progress/pending)

---

## Happy-path sequence

1. Navigate to `/projects/project-for-testing/runs/`
2. Observe runs list in Default view; chart visible with Passed/Failed/Skipped legend
3. Click `⋯` on a finished run → context menu shows Relaunch, Advanced Relaunch, Launch a Copy, Pin, Export as PDF, Move, Labels, Move to Archive, Purge
4. Click **Pin** → run moves to top; pin SVG icon appears in row title area
5. Click `⋯` on pinned run → menu shows **Unpin** instead of Pin
6. Click **Unpin** → run returns to chronological position
7. Click **Multi-select** toolbar button → per-row checkboxes appear
8. Select 1 run → bottom toolbar appears with: count, Select all, Archive, Labels, Delete, Extra dropdown
9. Select 2nd run → **Compare** link appears between Labels and Delete
10. Click Extra dropdown → shows Link, Download, Merge, Move
11. Click Extra dropdown → Escape to close
12. Click close (`×`) button in bottom toolbar → checkboxes hidden, toolbar removed
13. Click **Custom view** → table view with all 10 columns; button text becomes "Default view"
14. Click Settings gear → Runs list settings panel: column checkboxes + width spinbuttons; click Cancel
15. Click **Default view** → card view restored; Settings gear disabled
16. Click QLE icon button → Runs Query Editor modal opens
17. Type query in editor → Apply button enabled; Save remains disabled
18. Click **Apply** → modal closes, list filtered, URL gets `?filterParam=...`, counter shows "N runs found", Reset button appears
19. Click **Reset** → filter cleared, URL returns to `/runs`, all runs shown
20. Click **Groups** tab → URL `?filterParam=groups%3Dtrue`, only RunGroup rows shown
21. Click expand chevron on RunGroup → child runs render inline below parent
22. Click Reset → all runs shown

---

## Verified Flows

### Flow 1: Pin and Unpin a Run
1. Open `⋯` menu on finished run → **Pin** button present
2. Click **Pin** → run moves to top of list; pin SVG icon appears in row
3. Open `⋯` menu on now-pinned run → **Unpin** button present
4. Click **Unpin** → run returns to chronological order; pin icon disappears
- **Toast on Pin:** `"Run has been pinned"` (from shared catalog, confirmed)
- **Toast on Unpin:** none observed

### Flow 2: Multi-select bulk archive
1. Click **Multi-select** → checkboxes appear per row
2. Select 1 row → bottom toolbar shows "1 run | Select all | Archive | Labels | Delete | Extra"
3. Select 2nd row → "2 runs" counter; **Compare** link appears
4. Extra dropdown with 2 selected → Link, Download, Merge, Move
5. Close toolbar via close button → toolbar hidden, checkboxes remain; click Multi-select again to deactivate

### Flow 3: Apply TQL filter and verify URL share
1. Click QLE button → modal opens
2. Switch to **Examples (3)** tab → 3 example queries shown
3. Type in editor field → Save remains disabled
4. Click **Apply** → modal closes, URL becomes `?filterParam=search%3D{encoded}`, list filtered, "N runs found" + Reset button appear
5. Click **Reset** → URL returns to `/runs`, full list restored

### Flow 4: Custom view column settings
1. Click **Custom view** → table view renders with 10 columns; button text becomes "Default view"
2. Click Settings gear → Runs list settings panel opens with column checkboxes + width inputs
3. Uncheck a column (e.g., Plan) → column would hide in preview
4. Click **Cancel** → panel closes, settings unchanged
5. Click **Default view** → card view restored; gear disabled

### Flow 5: RunGroup expand in-place
1. Click **Groups** filter tab → only RunGroup rows shown (`?filterParam=groups%3Dtrue`)
2. Click expand chevron on RunGroup row → child runs appear inline below parent
3. Child runs show environment label (e.g., "Firefox", "Chrome")
4. Click expand chevron again → child runs collapse

### Flow 6: Chart toggle
1. Chart visible with Skipped/Passed/Failed legend
2. Click `.chart-toggler` (eye-off icon) → chart collapses; icon changes to eye
3. Click `.chart-toggler` again (eye icon) → chart reappears; icon returns to eye-off

### Flow 7: Move to RunGroup dialog
1. Open `⋯` menu → **Move** button
2. Click **Move** → "Move to..." modal opens with search box + group list
3. Click destination group button → **Move** action button becomes enabled
4. Click **Cancel** → modal closes, run unchanged

---

## Open Questions / Gaps

None — all delta ACs from `runs-list-management-ac-delta.md` have ≥1 supporting element cataloged.
