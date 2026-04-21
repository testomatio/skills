---
feature: manual-tests-execution
suite: bulk-status-actions
scope: sub-feature-delta
mode: sub-feature-delta
references: _shared-ui.md
entry_url: https://app.testomat.io/projects/project-for-testing/runs/launch/e022f5f3/?entry=453004798
explored_at: 2026-04-19T18:30:00Z
explored_by: ui-explorer
delta_elements: 22
verified_flows: 5
gaps: 1
---

# UI Element Catalog Delta: bulk-status-actions

**Last updated:** 2026-04-19
**Env:** beta
**Collected by:** Playwright MCP
**Run used for exploration:** `e022f5f3` ("Manual tests at 18 Apr 2026 12:38", 2508 tests, 0% start)

> Elements in `_shared-ui.md` (sidebar nav, header, breadcrumbs, Finish Run, per-test result panel, status counter bar) are NOT repeated here.

---

## Screen: Manual Runner — Filter Toolbar (Multi-Select Zone)

**URL:** /projects/project-for-testing/runs/launch/{id}/
**Entry point:** existing unfinished run → Continue

### Buttons (filter toolbar row — delta elements only)

- **'Multi-Select'** — icon-only (`third-btn btn-only-icon btn-md`, icon `md-icon-checkbox-multiple-marked-outline`, `aria-describedby` → tooltip `"Multi-select"`); toggles multi-select mode ON/OFF. Active state adds class `btn-selected` to the button.
- **'Collapse all'** — icon-only (`third-btn btn-only-icon btn-md`, icon `md-icon-collapse`, `aria-describedby` → tooltip `"Collapse all"`); collapses suite rows. (In _shared-ui.md but confirming it coexists with Multi-Select button in the same toolbar row.)

### Multi-Select Mode State

- When active: Multi-Select button has class `btn-selected`; per-test and per-suite checkboxes appear in the test tree
- When inactive (toggled off): `btn-selected` removed from button; all checkboxes disappear; any current selection is cleared
- Toggling Multi-Select off while tests are selected clears the selection and hides the bulk-action toolbar

---

## Screen: Manual Runner — Test Tree (Multi-Select Active)

**URL:** /projects/project-for-testing/runs/launch/{id}/ (after Multi-Select activated)

### Per-Suite Checkbox (Suite-Level Select All)

- **Suite-level checkbox** — `input[type="checkbox"]`, `name="select-"`, contained in `div[id="suite-{suiteId}"]` (`class="p-1 items-center space-x-2 mt-1 flex ml-0 ..."`)
- Clicking a suite checkbox selects all tests within that suite (test-level checkboxes for the suite become checked)
- If a status filter is active (e.g., "Passed"), clicking the suite checkbox selects only the filtered tests visible in that suite

### Per-Test Checkbox

- **Test checkbox** — `input[type="checkbox"]`, `name="select {testRunTestId}"`, contained in `div.cursor-pointer.mt-1.ml-4`
- Checked state: parent `div` gains class `bg-indigo-50` (blue background highlight)
- Unchecked state: no highlight on row
- Tests can be checked/unchecked individually; each selection updates the bulk toolbar counter immediately

### Selection Counter (in bulk toolbar)

- Counter text: `"{N} tests selected"` — exact pattern, shown inside a `<span>` in the bulk-action bottom toolbar
- Counter is visible only when ≥1 test is selected (toolbar hidden when 0 selected)

### Status Icons in Tree (after bulk apply)

- After bulk apply: affected test rows show `md-icon-check-circle run-status passed` SVG (green check-circle) replacing the previous `md-icon-circle-outline normal` (gray circle)
- Icon classes: passed = `run-status passed`, pending = `normal` (outline circle)

---

## Screen: Manual Runner — Bulk-Action Bottom Toolbar

**URL:** /projects/project-for-testing/runs/launch/{id}/ (appears when ≥1 test selected in Multi-Select mode)

**Locator:** `div.bg-indigo-50.py-4.px-6.rounded-t-lg.fixed.bottom-0.left-1/2.z-50.dark:bg-dark-800` — fixed-positioned, centered, width 600px, appears at bottom of viewport

**Toolbar is hidden when 0 tests are selected** — it only renders when selection count ≥ 1.

### Selection Counter

- **"{N} tests selected"** — `<span>` at left edge of toolbar; N = count of checked test-level checkboxes

### Quick-Set Status Buttons (with native confirm dialog)

- **'PASSED'** — `class="flex-1 w-16 h-6 rounded-md ring-1 ring-green-500 text-green-500"`, no `aria-describedby`; clicking triggers browser-native confirm dialog: `"Are you sure to set status 'passed' for all selected tests?"` — Accept applies; Cancel does not change state
- **'FAILED'** — `class="flex-1 w-16 h-6 rounded-md ring-1 ring-red-400 text-red-400"`, no `aria-describedby`; confirm dialog: `"Are you sure to set status 'failed' for all selected tests?"`
- **'SKIPPED'** — `class="flex-1 w-16 h-6 rounded-md ring-1 ring-yellow-400 text-yellow-400"`, no `aria-describedby`; confirm dialog: `"Are you sure to set status 'skipped' for all selected tests?"`

### Icon-Only Toolbar Buttons

- **'Assign to'** — `secondary-btn btn-only-icon btn-sm`, icon `md-icon-account-check`, `aria-describedby` → tooltip `"Assign to"`; opens the Assign to power-select dropdown (owned by sub-feature #3 — noted here for context, dialog NOT cataloged)
- **'Result message'** — `secondary-btn btn-only-icon btn-sm`, icon `md-icon-message-text-outline`, `aria-describedby` → tooltip `"Result message"`; opens the "Result message" modal dialog
- **Delete (bulk)** — `red-btn btn-only-icon btn-sm`, icon `md-icon-delete`, no `aria-describedby`/tooltip; action not explored (destructive — noted for catalog completeness only)
- **Clear Selection (×)** — `secondary-btn btn-only-icon btn-sm`, icon `md-icon-close`, no `aria-describedby`/tooltip; clears all selections and hides the toolbar — Multi-Select mode stays active (checkboxes remain)

### Behaviour: Zero Selection

- Toolbar is not rendered when no tests are checked
- There is no disabled-state Apply or toolbar with empty counter — the entire toolbar is absent

---

## Screen: "Result message" Modal Dialog

**Entry point:** Bulk-action toolbar → 'Result message' icon button
**Locator:** `.ember-modal-dialog.modal-dialog-container` (center-attached modal via `ember-modal-wrapper`)

### Modal Header

- **Heading** — `h3`, text `"Result message"`
- **Close (×)** — `secondary-btn btn-only-icon btn-sm absolute -top-4 -right-4`, icon `md-icon-close`, no `aria-describedby`; clicking closes modal and clears current selection (same effect as Escape key)

### Status Picker

- **'PASSED'** — `flex-1 rounded-lg p-1 ring-2 ring-green-500 text-green-500`; selected state: `bg-green-500 text-green-800` (filled background)
- **'FAILED'** — `flex-1 rounded-lg p-1 ring-2 ring-red-400 text-red-400`; selected state: `bg-red-400 text-red-800`
- **'SKIPPED'** — `flex-1 rounded-lg p-1 ring-2 ring-yellow-400 text-yellow-400`; selected state: `bg-yellow-400 text-yellow-600`
- A status must be selected before Apply is enabled; initial state: all unselected

### Custom Status Affordance (AC-31)

- **NOT PRESENT** in the bulk "Result message" dialog as of exploration date. The `<div class="flex space-x-3 pr-1 mb-4">` placeholder after the standard status buttons renders empty (`<!---->`). **@unclear** — may be a project-level feature or require custom statuses to be configured in the project settings.

### Message Input

- **Result message textarea** — `textarea`, `placeholder="Result message"`, `cols="50" rows="2"`, `class="focus:ring-1 focus:ring-indigo-500"`; optional; not required for Apply to be enabled (only status selection is required)

### Apply Button

- **'Apply'** — `primary-btn btn-md btn-text-and-icon`; `disabled` attribute present when no status selected; enabled when any status button is selected
- After Apply: modal closes, selection is cleared, bulk toolbar disappears, test statuses update in tree, status counters in runner header update immediately — no toast shown

### Cancellation Behavior

- **Close (×) button** in modal → closes modal AND clears selection (toolbar disappears)
- **Escape key** → closes modal AND clears selection (same as Close ×)
- **Cancel before Apply preserves no changes** (no status change applied)

---

## Screen: Manual Runner — Status Counter Bar (Post-Bulk-Apply)

**URL:** /projects/project-for-testing/runs/launch/{id}/ (same bar as in _shared-ui.md but delta behavior documented)

> The counter bar is shared (in `_shared-ui.md`). The delta behavior is: counters update **immediately** after a bulk apply without page reload.

### Observed Update Pattern

- Before: `Passed 0 / Failed 0 / Skipped 0 / Pending 2508`
- After bulk PASSED apply (3 tests): `Passed 3 / Failed 0 / Skipped 0 / Pending 2505`
- After another bulk PASSED apply (2 more tests): `Passed 5 / Failed 0 / Skipped 0 / Pending 2503`
- Counter format: `{StatusLabel} {N}` — each is a filter button `secondary-btn btn-text-and-icon btn-md`

---

## Screen: Manual Runner — Filter Interaction with Selection (AC-66)

**Context:** Priority filter buttons (Normal / Low / High / Important / Critical) and status filter buttons (Passed / Failed / Skipped / Pending) in the runner header reduce the test tree.

### Observed Behavior

- When "Passed" status filter is active: tree shows only passed-status tests (e.g., 4 checkboxes: 1 suite + 3 tests vs 59 without filter)
- Suite-level checkbox with filter active selects only the visible (filtered) tests — counter shows only filtered count
- Bulk apply with filter active applies to only the visible/selected tests (filter-matching tests only)

---

## Toasts

- **Bulk quick-set via toolbar buttons (PASSED/FAILED/SKIPPED):** no toast observed after successful apply — operation is silent; header counters and tree update silently
- **Bulk apply via "Result message" dialog:** no toast observed after successful apply — silent operation
- **No error toast captured** — error paths not explored (network errors, etc.)

---

## Happy-path sequence

1. Open an unfinished Manual Run via `/runs/launch/{id}/`
2. Click the **'Multi-Select'** toolbar icon button (tooltip: "Multi-select") — per-test and per-suite checkboxes appear in tree
3. Click ≥1 test checkbox (or a suite-level checkbox to select all tests in a suite) — bulk-action bottom toolbar appears: `"{N} tests selected"`
4. Click **'Result message'** icon button (icon: `md-icon-message-text-outline`) in the bottom toolbar
5. "Result message" modal opens: heading `"Result message"`, three status buttons PASSED/FAILED/SKIPPED, optional textarea, disabled Apply
6. Click **'PASSED'** status button — Apply becomes enabled
7. Optionally type a message in the Result message textarea
8. Click **'Apply'** — modal closes, selection clears, toolbar disappears
9. Verify: test tree shows `md-icon-check-circle run-status passed` icons for affected tests
10. Verify: header counter `Passed N` incremented, `Pending N` decremented by the same count

---

## Verified Flows

### Flow 1: Enter and exit Multi-Select mode
- Click Multi-Select → `btn-selected` class added, checkboxes appear (59 with 9 suites + 50 tests in this run)
- Click Multi-Select again → `btn-selected` removed, checkboxes hidden, selection cleared
- **Verified:** mode is a true toggle

### Flow 2: Per-test individual selection + counter
- Click test checkbox → row gets `bg-indigo-50` highlight, toolbar appears with `"1 tests selected"`
- Click same checkbox again → unchecked, no highlight, toolbar disappears
- Click 3 test checkboxes → `"3 tests selected"`
- **Verified:** counter updates per-click

### Flow 3: Suite-level checkbox (Select all in suite)
- In Multi-Select mode, click suite-level checkbox (name="select-") → all 6 tests in suite become checked, toolbar shows `"6 tests selected"`
- With "Passed" filter active, click suite-level checkbox → only 3 filtered tests selected, toolbar shows `"3 tests selected"`
- **Verified:** suite checkbox respects current filter (AC-66)

### Flow 4: Result message dialog — Apply bulk PASSED with message
- Select 3 tests → open Result message dialog → Apply disabled initially → click PASSED (button fills green) → Apply enabled → type "Bulk apply test message" → click Apply
- Result: dialog closes, toolbar disappears, selection clears, header Passed counter increments by 3, Pending decrements by 3
- Tree: affected test rows now show `md-icon-check-circle run-status passed`
- **No toast emitted** — verified by checking `.custom-notify-body-message`
- **Verified:** ac-delta-6, ac-delta-8, ac-delta-9

### Flow 5: Quick-set via toolbar PASSED/FAILED/SKIPPED buttons
- Select tests → click 'FAILED' in toolbar → browser-native confirm dialog: `"Are you sure to set status 'failed' for all selected tests?"` → Cancel → no change
- Select tests → click 'PASSED' → confirm → Accept → header Passed counter increments, toolbar disappears, no toast
- **Verified:** toolbar quick-set buttons use native confirm dialog (distinct from Result message dialog flow)

---

## Open Questions / Gaps

### Gap 1: AC-31 Custom Status in Bulk (gaps=1)

- **AC:** Custom status dropdown shown after standard status chosen — should appear in the bulk "Result message" dialog
- **UI finding:** The `<div class="flex space-x-3 pr-1 mb-4">` placeholder after the standard status buttons in the "Result message" dialog renders empty. No custom status affordance was found.
- **Possible reasons:** project `project-for-testing` may not have any custom statuses configured; or the feature is not yet available in the bulk dialog even when custom statuses exist in the project settings.
- **Marked as:** `@unclear` — requires a project with custom statuses configured to verify

### Noted Behavioral Subtlety (not a gap — for test authors)

- Closing the "Result message" dialog (via X button or Escape) **also clears the current selection** — the selection does NOT persist after dialog cancel. This is the actual behavior for ac-delta-7: cancellation does not apply status AND does not retain selection.
