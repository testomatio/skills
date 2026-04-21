---
feature: manual-tests-execution
suite: tester-assignment
scope: sub-feature-delta
mode: sub-feature-delta
references: _shared-ui.md
entry_url: https://app.testomat.io/projects/project-for-testing/runs/new
explored_at: 2026-04-18T13:10:00Z
explored_by: ui-explorer
delta_elements: 28
verified_flows: 4
gaps: 2
---

# UI Element Catalog: Tester Assignment (delta)

**Last updated:** 2026-04-18
**Env:** beta
**Collected by:** Playwright MCP
**References:** `_shared-ui.md` — elements already cataloged there are NOT repeated here.

---

## Screen: New Manual Run Sidebar — Assignee Panel (expanded)

**URL:** /projects/project-for-testing/runs/new (panel expands within sidebar when "Assign more users" is clicked)
**Entry points:** New Manual Run Sidebar → "Assign more users" link (cataloged in `_shared-ui.md`)
**Note:** "Current user chip" (gololdf1sh) and "as manager" label and "Assign more users" link are in `_shared-ui.md`. Cataloged here: the expanded Assignee panel contents only.

### Panel — Creator Chip (non-removable)

The creator chip renders ABOVE the multi-select trigger as a separate row, NOT inside the multi-select. It is NOT removable from this panel.

- **Creator avatar chip** — `span.user.small` inside `div.ember-basic-dropdown.assign-to` (no `assign-to-list`); shows avatar + username; `as manager` label (`span.text-sm.text-grayNeutral-400.mr-6`) appears inline after the chip; this is a clickable power-select trigger but selecting is blocked for the manager slot during creation

### Inputs — Assign Users Multi-select

- **'Assign users'** multi-select — `div.ember-basic-dropdown.power-select-custom.power-select-as-input-multiple.user-option`, `data-ebd-id: ember235-trigger` (dynamic); power-select-multiple; type-to-filter project members; chips appear inline inside the trigger after selection
  - Each selected chip: `li.ember-power-select-multiple-option` with `span[role="button"][aria-label="remove element"]` (the `×` character) — individual chip removal
  - Options list: `ul.ember-power-select-options` rendered outside DOM as `ember-basic-dropdown-content-*`; option items are project members with avatar + name

### Dropdowns — Auto-Assign Users Selector

- **'Auto-Assign: none'** button — `button.secondary-btn.btn-sm.btn-icon-after`; **appears ONLY when ≥1 user is added to the Assign users multi-select**; label changes to reflect current strategy (e.g., `"Auto-Assign: randomly"`)
  - Dropdown options list: `ul.render-in-body` (rendered in `<body>`, not inside sidebar DOM)
  - **'None'** option — `li` button; description: `"No auto-assignment will be done"`; sets strategy to None; default
  - **'Prefer test assignee'** option — `li` button; description: `"Tests will be assigned to user, which is set as test assignee. Other tests won't be auto assigned."`
  - **'Randomly distribute tests between team members'** option — `li` button; description: `"Tests will be evenly distributed across assigned testers."`; label abbreviates to `"Auto-Assign: randomly"` in the button

### Toasts / State Changes (Assignee Panel)

- No toast on adding/removing users from the Assign users multi-select in this panel — changes are unsaved until Launch or Save is clicked

---

## Screen: Edit Run Page — Assignment-specific elements

**URL:** /projects/project-for-testing/runs/edit/{id}/
**Entry points:** Run detail panel → Edit button; or direct URL
**Note:** Title, Assign users multi-select, Environment, Description, Save, Cancel, Remove assign users are cataloged in `_shared-ui.md`. Cataloged here: delta-specific controls and behaviors.

### Buttons (delta)

- **'Select All'** — `button.third-btn.btn-md.whitespace-nowrap`; adds ALL project members to the Assign users multi-select in a single click; no confirmation; no toast; appears alongside "Remove assign users"
- **Per-chip `×` remove button** — `span[role="button"][aria-label="remove element"]`; inside each `li.ember-power-select-multiple-option` chip in the Assign users multi-select; removes that one user immediately from the chip list (unsaved until Save is clicked)

### Buttons — Remove assign users (behavior detail)

- **'Remove assign users'** (from `_shared-ui.md`) — behavior detail: removes ALL non-manager users from the Assign users multi-select simultaneously; **no confirmation dialog**; **no toast**; takes effect immediately in the UI (unsaved until Save is clicked)

### Manager Chip (non-removable, delta detail)

- **Manager chip** — rendered above the Assign users multi-select as a separate non-form element; structure: `div.ember-basic-dropdown.assign-to` with `span.user.small` avatar + username + `span.text-sm.text-grayNeutral-400` "as manager" label; no `×` remove button on this chip; cannot be removed from this page

### Toasts

- Success (after Save on Edit Run page): no toast text confirmed — page navigates to `/runs/{id}` (run detail/list) immediately after clicking Save; toast may appear but was not captured before navigation

---

## Screen: Manual Runner — Run Header Assignees

**URL:** /projects/project-for-testing/runs/launch/{id}/
**Entry points:** From Run creation → Launch; from Runs list → Continue link
**Note:** Runner header general elements are in `_shared-ui.md`. Cataloged here: assignee display in header only.

### Assignee Stack (header)

- **Run assignee avatars** — `span.user.-ml-5.medium` (each subsequent avatar uses `-ml-5` negative margin for overlap/stack effect); located in header area between icon toolbar and "Finish Run" button; tooltips via `aria-describedby`; tooltip format: username only (e.g., `"gololdf1sh"`)
- Multi-assignee: first avatar `span.user.medium`, subsequent avatars `span.user.-ml-5.medium` (stacked with overlap)

---

## Screen: Manual Runner — Suite Rows (tester-assignment elements)

**URL:** /projects/project-for-testing/runs/launch/{id}/
**Entry points:** Manual Runner page → suite row in test tree
**Note:** "Add note to suite" and "Add test to suite" icons on suite rows are in `_shared-ui.md`. Cataloged here: suite-level Assign to dropdown only.

### Suite-level Assign To Dropdown

- **Suite "Assign to" trigger** — `div.ember-basic-dropdown.flex-none.text-gray-500.assign-to-list.assign-to.options-right`; shows `span.user.small` avatar chip with tooltip `"Assigned to {name}"` when a user is assigned; the avatar sits in a `div.flex.items-center.-space-x-4.-mr-1` container (for potential multi-avatar stacking); trigger is `[role="button"]` with `ember-power-select-status-icon` dropdown chevron
  - Unassigned state: no `span.user` rendered; only the chevron icon (unconfirmed icon class — this state was not directly observed as all suites had an assigned user)
  - Dropdown options (when opened): `Unassigned`, then run-assigned users only; non-run users are NOT listed (AC-41 constraint)
  - No confirmation required for suite assignment change; change takes effect immediately

---

## Screen: Manual Runner — Multi-Select Bottom Toolbar (tester-assignment elements)

**URL:** /projects/project-for-testing/runs/launch/{id}/
**Entry points:** Manual Runner → Multi-Select icon button → checkboxes appear → select ≥1 test
**Note:** Multi-select mode toggle is in `_shared-ui.md`. Cataloged here: "Assign to" control in the bottom toolbar only.

### Multi-select "Assign to" Button

- **'Assign to'** icon button — `div.ember-basic-dropdown.assign-to.options-right.flex-none.text-gray-500` in the multi-select bottom toolbar; SVG icon class: `md-icon-account-check`; tooltip: `"Assign to"` via `aria-describedby` popper
  - Dropdown options (when opened): `Unassigned`, then run-assigned users only; options rendered as `li` items in an Ember power-select dropdown
  - Selecting a user triggers a **browser native confirm dialog** (not a UI modal)
    - **Exact dialog text:** `"Are you sure you want to assign {userName} to all selected tests?"`
    - Browser default OK / Cancel buttons
    - On OK: assignment applied to all selected tests; no toast follows
    - On Cancel: assignment cancelled; no change
  - Assignee update reflects in per-test row indicators immediately after OK

---

## Screen: Manual Runner — Per-Test Assignee Indicators

**URL:** /projects/project-for-testing/runs/launch/{id}/
**Entry points:** Manual Runner test tree rows; Manual Runner test detail panel

### Per-test Assignee in Tree Row (left panel)

- **Assignee indicator chip** — `span.user.small.flex-none`; rendered inline in the test row inside `div.flex.items-center.space-x-2.truncate`; shows avatar; tooltip via `aria-describedby`: username only (e.g., `"Yevhenii Vlasenko"`)
- Unassigned state: no `span.user` rendered in the test row

### Per-test Assignee in Detail Panel (right panel)

- **Assignee clickable chip** — `div.ember-basic-dropdown.assign-to.options-right` (WITHOUT the `assign-to-list` class; this distinguishes it from the suite-level trigger); contains `span.user` (no size modifier) with tooltip `"Assigned to {name}"`; clicking opens same run-assigned-users dropdown
  - Dropdown: `Unassigned` option + run-assigned users only
  - No confirmation required; single click assigns immediately

---

## Screen: Runs List — "Assigned to" Column

**URL:** /projects/project-for-testing/runs/
**Entry points:** Runs list page (Default view or Custom view)
**Note:** Runs list general columns and controls are in `_shared-ui.md`.

### Assigned to Column — Avatar Stack

- **Single assignee:** `span.user.list-users` — avatar only; tooltip via `aria-describedby`: username only (e.g., `"gololdf1sh"`)
- **Multiple assignees:** first avatar `span.user.list-users`, subsequent avatars `span.user.list-users.-ml-3` (negative margin produces overlap stack); each avatar has independent tooltip with that user's name
- Unassigned run: no `span.user.list-users` rendered in the row (manager-only run shows no avatars in the "Assigned to" column — @unclear: whether manager chip shows or column is empty)

---

## Happy-path sequence

1. Navigate to `/projects/project-for-testing/runs/new` (New Manual Run sidebar)
2. Click **"Assign more users"** link — Assignee panel expands
3. Click the **Assign users** multi-select trigger — dropdown of project members opens
4. Select a non-manager project member — chip appears in trigger; **Auto-Assign: none** button appears
5. Click **"Auto-Assign: none"** button — strategy dropdown opens
6. Select **"Randomly distribute tests between team members"** — button label changes to `"Auto-Assign: randomly"`
7. Click **"Launch"** — run created and runner opens
8. In runner: click **Multi-Select** icon to enable multi-select mode
9. Check ≥1 test checkboxes
10. Click **"Assign to"** icon button in bottom toolbar — dropdown of run-assigned users opens
11. Select a user — browser native confirm dialog: `"Are you sure you want to assign {name} to all selected tests?"`
12. Click OK — bulk assignment applied; per-test assignee chips appear in tree rows
13. Click **"Finish Run"** → confirm → run finishes
14. In Runs list: verify "Assigned to" column shows stacked avatar chips for all assigned users

---

## Verified Flows

### Flow 1: Add user via Assign users multi-select + Auto-Assign strategy selection

- Started at New Manual Run sidebar
- Clicked "Assign more users" — panel expands below creator chip
- Added Yevhenii Vlasenko to Assign users multi-select — chip appeared
- Auto-Assign: none button appeared (was NOT visible before user was added)
- Opened strategy dropdown — 3 options rendered in `ul.render-in-body`
- Selected "Randomly distribute..." — button label updated to `"Auto-Assign: randomly"`
- **Confirmed:** Auto-Assign selector is conditional on ≥1 assigned user

### Flow 2: Edit Run — Remove all users + Select All + Save

- Navigated to `/runs/edit/e022f5f3/`
- One assigned user (Yevhenii Vlasenko) chip visible with `×` remove button
- Clicked **"Remove assign users"** — chip cleared immediately, no dialog, no toast
- Clicked **"Select All"** — both project members added as chips immediately
- Clicked **Save** — page navigated to `/runs/e022f5f3` (runs list view); no toast captured before redirect

### Flow 3: Multi-select bulk "Assign to" with confirmation

- Enabled Multi-Select mode in runner
- Selected 6 test checkboxes
- Clicked "Assign to" icon button in bottom toolbar — dropdown appeared with: Unassigned, Yevhenii Vlasenko, gololdf1sh (me)
- Clicked "Yevhenii Vlasenko" (via full mouse event sequence: mouseenter → mouseover → mousedown → mouseup → click)
- Browser native confirm dialog appeared: `"Are you sure you want to assign Yevhenii Vlasenko to all selected tests?"`
- Clicked OK — 10 tests updated; no success toast; `span.user.small.flex-none` chips appeared in test rows
- **Confirmed:** No toast after bulk assignment; native confirm dialog only

### Flow 4: Runs list "Assigned to" column rendering

- After saving 2 assigned users (gololdf1sh manager + Yevhenii Vlasenko) on Edit Run page
- Runs list showed overlapping avatar stack: `span.user.list-users` + `span.user.list-users.-ml-3`
- Tooltips: `"gololdf1sh"` and `"Yevhenii Vlasenko"` respectively (confirmed via aria-describedby)

---

## Open Questions / Gaps

1. **gap-1 (ac-delta-4):** "Prefer test assignee" fallback behavior — when a test has no pre-set assignee, the product docs are unclear whether the test goes to the manager or stays unassigned. UI exploration did not include a run with pre-set test assignees to observe the strategy in action. Mark related tests `@unclear`.

2. **gap-2 (ac-delta-6 confirmation dialog):** "Remove assigned user who has recorded results" — exact dialog wording could not be captured in this session because Yevhenii Vlasenko had no recorded results in the run at time of removal. The "Remove assign users" button (no-results state) showed no dialog. With recorded results, a confirmation dialog is expected but its exact wording is unconfirmed. Mark related tests `@unclear`.
