---
feature: manual-tests-execution
suite: environment-configuration
scope: sub-feature-delta
mode: sub-feature-delta
references: _shared-ui.md
entry_url: https://app.testomat.io/projects/project-for-testing/runs/new
explored_at: 2026-04-18T14:45:00Z
explored_by: ui-explorer
delta_elements: 28
verified_flows: 5
gaps: 1
ac_refs:
  - ac-delta-1
  - ac-delta-2
  - ac-delta-3
  - ac-delta-4
  - ac-delta-5
  - ac-delta-6
  - ac-delta-7
  - ac-delta-8
  - ac-delta-9
  - ac-delta-10
  - ac-delta-11
  - ac-delta-12
---

# UI Element Catalog (Delta): Environment Configuration

**Last updated:** 2026-04-18
**Env:** beta
**Collected by:** Playwright MCP

> Shared chrome (nav, breadcrumbs, sidebar drawer header, Launch/Save/Cancel in sidebar footer) is cataloged in `_shared-ui.md`. This file catalogs ONLY environment-configuration-specific elements.

---

## Screen: New Manual Run Sidebar — Environment Section

**URL:** /projects/project-for-testing/runs/new/
**Entry points:** Runs List → Manual Run button

### Buttons
- **'+' (Add/Open env config)** — `secondary-btn btn-only-icon btn-lg`, icon `md-icon-plus`; no tooltip (no `aria-describedby`); located to the right of the environment selector `ul.environment`; opens the Multi-Environment Configuration modal. Present at all times in sidebar env row.

### Inputs / Selectors
- **Environment selector** — `ul.environment` (plain `<ul>` with `min-height: 37px`); before config: shows `"Set environment for execution"` placeholder span (`text-gray-400 text-sm`); after single group saved with selections: shows env value badges (`span.badge.env m-1`), e.g. `"Windows"`, `"Chrome"`.
- **'N environments configured' button** — `secondary-btn btn-text-and-icon btn-lg`; appears when 2+ env groups exist (replaces individual env chip display); text pattern `"N environments configured"`; clicking this button re-opens the Multi-Environment Configuration modal for editing.

### Launch Section (env-driven state)

**State: no env configured OR 1 env group configured**
- **'Launch'** button — `primary-btn btn-text-and-icon btn-lg`, icon `md-icon-play`; single launch, no multi-env variants.

**State: 2+ env groups configured**
- **'Launch in Sequence'** button — `primary-btn btn-text-and-icon btn-lg`, icon `md-icon-play`; replaces single "Launch"; executes env groups one after another.
- **'Launch All'** button — `primary-btn btn-text-and-icon btn-lg`, icon `md-icon-play`; starts all env groups simultaneously; requires test scope with tests (does NOT work with "Without tests" scope — shows validation error).

> Note: there is NO plain "Launch" button when ≥ 2 groups are configured. The two multi-env buttons fully replace it. There is no split-button or dropdown wrapping — they are two separate explicit buttons side by side.

> `GAP: ac-delta-8` — "One Run" / "single run with grouped env results" mode was not observed in the current UI. With 1 group the sidebar shows only "Launch"; with 2+ groups the sidebar shows "Launch in Sequence" and "Launch All". No third "Launch (One Run)" variant was discovered. AC-48 (baseline) and ac-delta-8 may describe a behaviour that does not exist separately in this UI — confirmed ambiguous, logged as gap.

---

## Screen: Multi-Environment Configuration Modal

**URL:** /projects/project-for-testing/runs/new/ (modal overlay)
**Entry points:** New Manual Run sidebar → '+' button OR 'N environments configured' button

### Header
- **'Multi-Environment Configuration'** heading — `h3`
- **Close (×) button** — `third-btn btn-only-icon btn-lg`, icon `md-icon-close`; dismisses modal without saving (Cancel behavior).

### Env Slot / Group Panel (`.cp-Panel`)

Each group is a collapsible panel (`div.cp-Panel`); open state: `cp-is-open`; closed state: `cp-is-closed`.

**Slot toggle (`.cp-Panel-toggle`):**
- **Slot number link** — `a.cp-Panel-toggle`; numbered sequentially `"1"`, `"2"`, etc.; clicking toggles expand/collapse.
- **Slot label** — shows slot number + selected env names inline when env(s) are selected, e.g. `"1 Windows"`, `"2 Chrome"`.
- **Selected envs chip list** — `ul` inside toggle header; `<li>` per selected env value, e.g. `<span>Windows</span>`.
- **Remove (−) button** — `secondary-btn btn-only-icon btn-lg`, icon `md-icon-minus`; no `aria-describedby`; located right side of slot header; removes this env group. NOTE: removing a group when only 1 group remains is also allowed — the "1" group persists but with nothing selected until user saves.

**Slot body (`.cp-Panel-body`) — env checklist:**
- **'All' checkbox** — `input#select-all.ember-checkbox`; label `"All"`; styled bold; selects/deselects all options at once.
- **'Windows' checkbox** — `data-test-input-type="boolean"`, `data-test-input-name="isWindows"`, `id="ember...Input"`, `name="isWindows"`.
- **'MacOS' checkbox** — `data-test-input-name="isMacOS"`, `name="isMacOS"`.
- **'Linux' checkbox** — `data-test-input-name="isLinux"`, `name="isLinux"`.
- **'Android' checkbox** — `data-test-input-name="isAndroid"`, `name="isAndroid"`.
- **'iOS' checkbox** — `data-test-input-name="isiOS"`, `name="isiOS"`.
- **'Chrome' checkbox** — `data-test-input-name="isChrome"`, `name="isChrome"`.
- **'Firefox' checkbox** — `data-test-input-name="isFirefox"`, `name="isFirefox"`.
- **'Safari' checkbox** — `data-test-input-name="isSafari"`, `name="isSafari"`.

> `GAP: ac-delta-4` — The env checklist only shows predefined OS/browser names (flat list). No `Category:Value` grouping (e.g. `Browser:Chrome`, `OS:Windows`) was observed — the project "project-for-testing" does not use custom env names. This feature may require project-level environment seed configuration in Settings. AC-delta-4 cannot be fully verified without custom env labels set up.

**Checklist container:** `div.max-h-80.vertical.rounded-md.px-2.pt-2.bg-gray-100`; scrollable when list grows.

### Footer
- **'Save' button** — `primary-btn btn-text-and-icon btn-md`; commits selection and closes modal. Saving with 0 envs selected across all groups is allowed — modal closes without validation error; empty groups are silently accepted.
- **'Cancel' button** — `secondary-btn btn-text-and-icon btn-md`; dismisses modal without saving.
- **'Add all envs' link** — `a.link.text-xs.whitespace-nowrap`, `href="#"`; populates all env checkboxes in the currently expanded group in one click.
- **'Add Environment' button** — `secondary-btn btn-text-and-icon btn-md`, icon `md-icon-plus`; adds a new env group (new `.cp-Panel`) numbered sequentially; new group starts collapsed; adding a second group immediately updates the sidebar footer to show "Launch in Sequence" and "Launch All".

---

## Screen: Runs List — Multi-Env Run Group Row

**Entry points:** After launching with "Launch in Sequence" or "Launch All"

### Run Group Row (multi-env)
- **Group title** — auto-generated as `"Multi-environment tests at {date time}"` (no user-defined title in current flow); `N runs` badge.
- **'New RunGroup' label** — inline tag next to group title; appears immediately post-creation.
- **Context menu for run group** — `⋯ button`; options: `Edit` (link to `/runs/groups/edit/{id}`), `Copy`, `Add Automated Run`, `Mixed Run` (link), `Pin`, `Move`, separator, `Move to Archive` (disabled for groups), `Purge`.
- **Purge confirmation dialog** — text `"This action will delete the group and the nested runs will be moved to the Archive."` — two buttons: `Purge` (confirm), `Cancel`. Post-confirm info banner: `"This rungroup was deleted and the nested runs were moved to the Archive!"`.

### Child Run Row (inside expanded group)
- **Run title** — same as group title, e.g. `"Multi-environment tests at 18 Apr 2026 14:41"`.
- **Environment badge** — inline next to title, shows env value name, e.g. `Chrome`, `Windows`; uses span with classes `inline-block align-middle overflow-hidden whitespace-nowrap space-x-2` + pill badge `px-2 text-xs text-gray-600 bg-gray-200 rounded-full`.
- **'New Run' status label** — appears on child runs immediately after launch (before any manual execution begins).

---

## Validation / Error States

- **"Select a plan or select all" banner** — informational error banner (non-modal); appears when clicking "Launch All" with "Without tests" scope selected; banner has `Dismiss` button; sidebar stays open; does NOT appear for "Launch in Sequence".
- **Saving empty env groups** — no validation; modal closes silently; empty groups carry through to launch.
- **'Move to Archive' disabled** — on run group context menu; only `Purge` is enabled for group deletion.

---

## Happy-path sequence

1. Open New Manual Run sidebar at `/runs/new`
2. Click **'+' button** in env row → Multi-Environment Configuration modal opens
3. Expand group 1 (already expanded by default), check desired env(s) (e.g. Windows)
4. Click **'Add Environment'** → group 2 added (collapsed); sidebar footer changes to "Launch in Sequence" + "Launch All"
5. Click group 2 toggle to expand, check desired env(s) (e.g. Chrome)
6. Click **'Save'** → modal closes; sidebar env area shows `"2 environments configured"` button; footer shows "Launch in Sequence" + "Launch All"
7. Select test scope (e.g. "All tests")
8. Click **'Launch in Sequence'** → navigates to runner for first env's run; a run group is created in Runs list
9. Verify runner header shows the active env (e.g. `Windows` badge)

---

## Verified Flows

### Flow 1: Open env config modal with "+" button
- Click '+' button in sidebar env row → modal opens with heading `"Multi-Environment Configuration"`, 1 group slot (numbered "1") expanded, full env checklist visible. **Verified: pass.**

### Flow 2: Remove env group via minus button
- With 2 groups: click '−' on group 2 → group 2 removed; sidebar footer reverts to single "Launch" button; env selector resets to placeholder `"Set environment for execution"`. **Verified: pass.**

### Flow 3: Save env selection (1 group, 1 env)
- Open modal → check "Windows" in group 1 → click 'Save' → modal closes; env selector shows `badge.env` chip `"Windows"`; sidebar footer shows single "Launch". **Verified: pass.**

### Flow 4: Launch in Sequence (2 groups)
- Configure Windows (group 1) + Chrome (group 2) → click 'Save' → click "Launch in Sequence" → navigates to `/runs/launch/{id}` for first run (Windows); run group appears in Runs list with 2 child runs (Windows + Chrome) each with "New Run" status. **Verified: pass.**

### Flow 5: Launch All (2 groups, All tests scope)
- Configure 2 groups → click 'Save' → select "All tests" → click "Launch All" → sidebar stays open (no navigation to runner); new run group appears at top of Runs list with 2 runs both at "New Run" status simultaneously. **Verified: pass.**

> Note: "Launch All" with "Without tests" scope fails with inline validation banner `"Select a plan or select all"` — sidebar stays open. Switching to "All tests" and clicking "Launch All" again succeeds.

---

## Open Questions / Gaps

1. **GAP: ac-delta-4** — Custom category:value env grouping (e.g. `Browser:Chrome`) not observable in project-for-testing. Requires Settings → Environments seed data to be configured first. This UI branch cannot be verified without seeding project-level environments.

2. **GAP: ac-delta-8** — "One Run" multi-env mode (all groups apply to single run, results grouped by env) was not found in the UI. With 1 group → single "Launch"; with 2+ groups → "Launch in Sequence" / "Launch All". No "One Run" variant exists as a distinct button. Either this mode was removed, is rendered differently, or AC-48 describes the single-group launch behavior. Requires product clarification.
