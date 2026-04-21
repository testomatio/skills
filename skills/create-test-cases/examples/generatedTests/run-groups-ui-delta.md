---
feature: manual-tests-execution
suite: run-groups
scope: sub-feature-delta
mode: sub-feature-delta
references: _shared-ui.md
entry_url: https://app.testomat.io/projects/project-for-testing/runs
explored_at: 2026-04-18T21:30:00Z
explored_by: ui-explorer
delta_elements: 52
verified_flows: 5
gaps: 4
---

## New RunGroup Dialog

Panel opens at route `/runs/groups/new/` (right-side overlay on Runs list).

**"New RunGroup" heading** — h2, panel title.

**Group Type combobox** — `ember-power-select` typeahead, `id="ember-power-select-typeahead-input-ember231"`; options: **Build**, **Release**, **Sprint**; optional (no selection required to save). Default: empty/no type.

**Name input** — `input#new-group-title`, `placeholder="Name"`, `required=true`; Save button disabled until this field has a value.

**Merge Strategy radio group** — `name="privacy-setting"`, 3 options (one must be selected):
- **Realistic** (default checked) — `value="realistic"`: "Prefer test results from the last executed run (excluding skipped tests)"
- **Optimistic** — `value="optimistic"`: "Prefer passed tests over failed tests"
- **Pessimistic** — `value="pessimistic"`: "Prefer failed tests over passed tests"

**Description textarea** — `textarea#ember238`; optional; no placeholder.

**Save button** — `class="primary-btn btn-text-and-icon btn-lg"`, text "Save"; disabled while Name empty, enabled once Name filled; submits form and redirects to new group URL.

**Cancel link** — `<a href="/projects/project-for-testing/runs">Cancel</a>`; navigates back to Runs list without saving.

**Close (×) button** — `class="third-btn btn-only-icon btn-lg"`; closes panel without saving.

---

## Edit RunGroup Page

Full page at `/projects/{slug}/runs/groups/edit/{id}`.

**"Edit RunGroup" heading** — h2.

**Group Type combobox** — same `ember-power-select` as New dialog; pre-populated with current type.

**Name input** — `input#new-group-title`; pre-filled with current name; required.

**Merge Strategy radio group** — same `name="privacy-setting"` radio set; pre-selected with saved strategy.

**Description textarea** — pre-filled with current description.

**Save button** — `class="primary-btn btn-text-and-icon btn-lg"`; enabled (valid form pre-populated); commits edits to existing group.

**Cancel button** — discards changes, navigates back.

---

## RunGroup Row on Runs List

Each RunGroup row in the Runs list (Groups tab or main list):

**Group name link** — `<a href="/projects/{slug}/runs/groups/{id}">` — opens RunGroup detail panel.

**Group type icon** — `<img>` icon representing type (Build / Release / Sprint / default).

**Group type badge** — text label (e.g., "New RunGroup", "Build", "Release"); rendered as badge inside row.

**Pass / Fail / Skip counters** — numeric counters for aggregated results across child runs; shows 0/0/0 when group is empty.

**Timestamp button** — relative time of last activity; same pattern as run rows in `_shared-ui.md` § Runs List but scoped to group.

**Extra menu button (row)** — `class="third-btn btn-only-icon btn-sm"`; opens RunGroup extra menu (see § RunGroup Extra Menu below).

---

## RunGroup Detail Panel

Right-side sliding panel; visible when navigating to `/projects/{slug}/runs/groups/{id}` or clicking a group row. Overlays the Runs list; does NOT replace full page.

**RunGroup ID badge link** — `href="#"`, text `RunGroup #{short-id}`; click copies the ID to clipboard.

**Rungroup Statistic Report button** — `class="ai-btn"`, icon-only; disabled when fewer than 2 child runs present; `aria-describedby` tooltip: `"More than 1 runs inside rungroup is needed to generate a report."`.

**Manual Run button** — `class="primary-btn btn-text-and-icon"`; link to `/runs/new?groupId={id}`; opens New Manual Run sidebar with RunGroup pre-filled to this group.

**Combined Report button** — `class="primary-btn btn-text-and-icon"`; disabled when no first-level runs; tooltip via `aria-describedby`: `"There are no runs on the first level"`; enabled when ≥1 child run exists; navigates to `/runs/compare?ids=[...]&rungroupId={id}`.

**Panel extra menu button** — `class="third-btn btn-only-icon"`; opens the same RunGroup extra menu as the row extra button.

**Close (×) button** — `class="third-btn btn-only-icon"`; closes panel and returns to `/runs`.

**Group name heading** — h3; inline-editable on click.

**Group type indicator** — img icon + badge text (e.g., "New RunGroup").

**Empty state message** — shown when no child runs: `"Empty RunGroup. Create a new manual run or attach a report for automated tests to this RunGroup."`.

**Custom view button** — enables view customisation; paired with a disabled **column-settings button** (disabled when empty).

**Column headers** — Rungroups/runs | Status | Defects | Assigned to | Finished at.

**Child run list** — each child run row inside the panel follows same counters/status pattern as top-level run rows.

---

## RunGroup Extra Menu

Opened from either the row extra button or the panel extra button. Items:

**Edit** — link to `/runs/groups/edit/{id}`; opens Edit RunGroup page.

**Copy** — opens Copy RunGroup dialog inline (see § Copy RunGroup Dialog).

**Add Existing Run** — opens Add Existing Run picker modal (see § Add Existing Run Picker).

**Add Automated Run** — button; adds automated run scoped to this group.

**Mixed Run** — link to `/runs/new-mixed?groupId={id}`; creates mixed run inside the group.

**Pin** — button; pins the group (moves to top of list); replaced by **Unpin** for already-pinned groups.

**Move** — button; opens Move Run / Group destination picker (see § Move Picker).

**Add Subgroup** — button; adds a sub-group nested within this RunGroup.

**[separator]**

**Move to Archive** — button; triggers Archive confirmation dialog (see § Archive Confirmation Dialog).

**Purge** — button; triggers purge action (limit 20,000 runs; limit surfacing unclear — see Gaps).

---

## Copy RunGroup Dialog

Inline overlay, opened via Extra menu → Copy.

**Heading** — h4: "Choose copy settings".

**Nested structure checkbox** — checked by default; copies child runs structure.

**Labels checkbox** — checked by default; copies labels.

**Assignee checkbox** — unchecked by default.

**Issues checkbox** — unchecked by default.

**Environments checkbox** — unchecked by default.

**Copy button** — primary; creates copy with selected slices, leaves source group untouched.

**Cancel button** — closes dialog without copying.

---

## Add Existing Run Picker

Modal overlay, opened via Extra menu → Add Existing Run.

**Heading** — h4: "Select run".

**Search input** — `role="searchbox"`, `aria-label="Search run by title"`; filters run list.

**Run list** — scrollable; each item is a button with run title + test count.

**Move Runs to Group button** — primary action; disabled until ≥1 run selected; adds selected runs to the group.

**Cancel button** — closes picker without changes.

---

## Move Picker

Modal overlay, opened via run row Extra menu → Move (moves a run into a group).

**Heading** — h3 with icon: "Move to...".

**Search input** — `role="searchbox"`, `aria-label="Search rungroup by title"`; filters destination list.

**Root option** — special list item representing the top-level (no group); removes run from any group.

**Group list** — each item is a group name (e.g., "UI Explorer Test Group", "E2E MultiEnv Test").

**Move button** — `class="primary-btn"`; disabled until destination selected; commits move.

**Cancel button** — closes picker without moving.

---

## Combined Report Page

Full page at `/projects/{slug}/runs/compare?ids=[...]&rungroupId={id}`.

**Breadcrumb** — `RunGroup #{id}` link navigates back to the parent group panel.

**Page heading** — h2: group name.

**Print / share icon button** — icon-only; prints or shares the report.

**Status filter buttons** — secondary-btn btn-text-and-icon btn-md; one per status:
- **Passed N** — filters test list to passed tests.
- **Failed N** — filters to failed.
- **Skipped N** — filters to skipped.
- **Pending N** — filters to pending/not-run.

**Search combobox** — filters test list by name.

**Test list panel** — left panel; shows aggregated tests across selected runs; updates when filters change.

**Overview section** — h3 "Overview"; right panel; lists participating runs:
- Each run: run title link + "Main Run" label (for anchor run) OR "Compare To" button (for additional peer runs); switching anchor re-bases comparison.

**Summary section** — h3 "Summary"; table with rows:
- Total Tests — total unique tests across all runs.
- Tests in all runs — tests present in every selected run.
- Total Passed — aggregate passed count.
- Total Failed — aggregate failed count.
- Flaky — tests that had mixed results across runs.
- Skipped — aggregate skipped count.
Each row has a description column and a count column.

---

## Archive Confirmation Dialog

Triggered by Extra menu → Move to Archive.

**Dialog text** — "You are going to archive this group" with "!" exclamation indicator.

**Confirm button** — primary; commits archive of group + all nested runs.

**No button** — secondary; dismisses without archiving.

**Cancel button** — secondary; dismisses without archiving.

---

## Groups Archive Page

Full page at `/projects/{slug}/runs/group-archive`.

**Breadcrumb** — "Runs" link → "Groups Archive".

**Count badge** — shows number of archived groups in header.

**Archived group rows** — each row shows group name + "archived" badge; same column layout as active Runs list.

**Archive extra menu** — restricted set of actions for archived groups:
- **Unarchive** — triggers Unarchive confirmation dialog.
- **Purge** — triggers purge without unarchiving first.
(No Edit, Copy, Pin, Add Run, Move actions available in archive.)

---

## Unarchive Confirmation Dialog

Triggered from Groups Archive extra menu → Unarchive.

**Dialog text** — "You are going to restore this group" with "!" indicator.

**Confirm button** — primary; restores group and all nested runs to active state.

**Cancel button** — dismisses without restoring.

---

## Toast Messages

**Archive success** — `"Rungroup has been archived!"` (`.custom-notify-body-message`)

**Unarchive success** — `"Rungroup has been restore!"` (`.custom-notify-body-message`) — note: production typo, "restore" instead of "restored".

---

## Happy-path sequence

1. On Runs list, click arrow next to "Manual Run" CTA → select "New group" → panel opens at `/runs/groups/new/`.
2. (Optional) Select Group Type from combobox (Build / Release / Sprint).
3. Fill Name input — Save button becomes enabled.
4. Select Merge Strategy radio (Realistic is default; Optimistic / Pessimistic available).
5. (Optional) Fill Description.
6. Click Save → panel closes → new group row appears in Runs list (Groups tab); panel redirects to `/runs/groups/{new-id}`.
7. Click group row to open detail panel → see group name, type badge, empty state.
8. Click "Manual Run" button → New Manual Run sidebar opens with RunGroup pre-filled to this group.
9. Fill and save run → child run appears inside group panel.
10. Click "Combined Report" button (now enabled) → navigates to `/runs/compare` page.
11. In Combined Report, review Overview and Summary; use status filters and search.
12. Navigate back via breadcrumb.
13. Extra menu → Edit → confirm pre-populated fields → Save or Cancel.
14. Extra menu → Copy → select copy scope checkboxes → Copy.
15. Extra menu → Move to Archive → Confirm → group moves to Groups Archive.
16. Navigate to Groups Archive → Unarchive → Confirm → group restored to active list.

---

## Verified Flows

**Flow A — Create new RunGroup:**
Entry: Runs list → arrow next to Manual Run → New group. Filled Name "UI Explorer Test Group", left Merge Strategy as Realistic (default), skipped Type and Description. Clicked Save. Outcome: panel closed, new group "UI Explorer Test Group" appeared in Runs list. Toast not captured (redirect was immediate; no `.custom-notify-body-message` present post-redirect). Gap noted.

**Flow B — Copy RunGroup dialog:**
Entry: "UI Explorer Test Group" row → extra menu → Copy. Dialog opened with heading "Choose copy settings". Verified checkboxes: Nested structure ✓ (checked), Labels ✓ (checked), Assignee ✗ (unchecked), Issues ✗ (unchecked), Environments ✗ (unchecked). Clicked Cancel — no group created. Verified source group unchanged.

**Flow C — Edit RunGroup:**
Entry: group row → extra menu → Edit → `/runs/groups/edit/{id}`. Pre-populated fields confirmed: Name = "UI Explorer Test Group", Merge Strategy = Realistic selected, Group Type = empty. Clicked Cancel — no changes committed.

**Flow D — Combined Report:**
Entry: "E2E MultiEnv Test" group (had child runs) → detail panel → Combined Report button. Navigated to `/runs/compare` page. Verified: breadcrumb with RunGroup link, status filter buttons (Passed/Failed/Skipped/Pending), Overview section listing runs with "Main Run" / "Compare To" labels, Summary table rows (Total Tests, Tests in all runs, Total Passed, Total Failed, Flaky, Skipped). Navigated back via breadcrumb — returned to group panel correctly.

**Flow E — Move Run destination picker:**
Entry: run row extra menu → Move. Picker opened with heading "Move to...". Verified list contains: "Root" option + "UI Explorer Test Group" + "E2E MultiEnv Test". Search input present. Move button disabled until selection made. Clicked Cancel — no move committed.

---

## Conventions

- RunGroup detail is a **right-side sliding panel**, not a standalone page — it overlays the Runs list. Direct navigation to `/runs/groups/{id}` renders the Runs list with the panel open.
- Edit RunGroup IS a standalone full page at `/runs/groups/edit/{id}`.
- Combined Report IS a standalone full page at `/runs/compare?ids=[...]&rungroupId={id}`.
- Groups Archive IS a standalone full page at `/runs/group-archive`.
- Extra menu on group rows and on the group panel header share the same set of actions.
- Archive extra menu has a restricted action set (Unarchive + Purge only).
- Merge Strategy is a required selection for creating/editing a group (Realistic is the default radio).
- The "Combined Report" button in the detail panel is disabled when there are no first-level child runs; tooltip communicates the reason.
- The "Rungroup Statistic Report" AI button is disabled when fewer than 2 runs exist in the group.

---

## Open Questions / Gaps

**gap-1 (ac-delta-U1):** Purge 20,000-run limit (AC-57) — whether the limit is surfaced to the user as a pre-check banner or enforced silently server-side is unknown. Cannot be verified manually without seeded data at that scale. Flag as `@not-manually-testable` in Step 3.

**gap-2 (ac-delta-U2):** Combined Report "Compare To" — whether peer runs from OTHER groups can be selected as comparison targets is unclear. Only within-group runs were visible in test data. Needs clarification or seeded data.

**gap-3 (ac-delta-16 / AC-70 pin):** Pin badge / visual indicator on the Runs list for pinned groups not verified — no existing pinned group was present in `project-for-testing` during exploration. The "Pin" menu item exists in extra menu; the resulting pinned-region position and Unpin affordance were not observed in the list view.

**gap-4 (ac-delta-9 / AC-55):** Column customisation persistence per-group — "UI Explorer Test Group" was empty during exploration so the column-settings button was disabled. Per-group vs global persistence (ac-delta-9) not verified. Requires a group with runs present.

**gap-5 (Flow A toast):** Create RunGroup success toast was not captured — the save action redirected immediately and no `.custom-notify-body-message` was present post-redirect. Toast string for successful group creation remains unknown; test should assert group appears in list as proxy.
