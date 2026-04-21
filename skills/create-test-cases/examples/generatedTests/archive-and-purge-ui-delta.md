---
feature: manual-tests-execution
suite: archive-and-purge
scope: sub-feature-delta
mode: sub-feature-delta
references: _shared-ui.md
entry_url: https://app.testomat.io/projects/project-for-testing/runs
explored_at: 2026-04-20T00:00:00Z
explored_by: ui-explorer
delta_elements: 48
verified_flows: 4
gaps: 3
---

# UI Element Catalog: Archive and Purge (Delta)

**Last updated:** 2026-04-20
**Env:** beta
**Collected by:** Playwright MCP

> Shared chrome (nav, breadcrumbs, filter tabs, "Manual Run" button, run row links, run detail panel) is in `_shared-ui.md`. This file catalogs ONLY archive/purge-specific elements.

---

## Screen: Runs List — Archive/Purge Entry Points

**URL:** /projects/project-for-testing/runs/
**Entry points:** Runs List page (shared surface extended by archive/purge-specific actions)

### Row Extra Menu — Archive/Purge Items (delta subset)

> The full row extra menu is in `_shared-ui.md § Runs List Page → Run List rows`. This delta catalogs ONLY the archive/purge menu items and their dialogs.

- **'Move to Archive'** — button in row extra menu (`btn`), separator above it; icon `img`; triggers Archive confirmation dialog
- **'Purge'** — button in row extra menu (`btn`), grouped below 'Move to Archive'; icon `img`; triggers Purge confirmation dialog

### Archive Confirmation Dialog (single run)

Triggered by: row extra menu → "Move to Archive"

- **Dialog type:** SweetAlert2 (`swal2-popup swal2-modal swal2-icon-warning`) — yellow warning icon
- **Body text:** `"You are going to archive 1 run"`
- **'Confirm'** button — primary, performs archive
- **'Cancel'** button — secondary, aborts with no state change

### Purge Confirmation Dialog (single run)

Triggered by: row extra menu → "Purge"

- **Dialog type:** SweetAlert2 (`swal2-popup swal2-modal swal2-icon-error`) — red error icon (distinct from Archive warning icon)
- **Body text:** `"This run will be purged and moved to Archive. To delete it permanently visit Runs Archive page."`
- **'Purge'** button — danger confirm, executes purge
- **'Cancel'** button — secondary, aborts

### Multi-Select Bulk Action Bar (Runs List)

Triggered by: Multi-select icon button (`aria-describedby: ember50-popper`, tooltip `"Multi-select"`) → select ≥1 run checkboxes

- **Selection counter** — `"N runs"` label showing how many runs are selected
- **'Select all'** link — selects all runs on current page; `href: "#"`
- **'Archive'** button — bulk archive action; triggers Bulk Archive confirmation dialog
- **'Labels'** button — bulk label assignment (not archive-specific; shared)
- **'Compare'** link — compare selected runs; `href: /runs/compare?ids=[...]`
- **'Delete'** button — IMPORTANT: despite label "Delete", this is actually bulk **Purge** (confirmed by dialog text); triggers Bulk Purge confirmation dialog
- **Close (×) button** — icon-only, dismisses multi-select mode; `aria-describedby` not observed, icon-only

> Note: RunGroup checkboxes appear in the list during multi-select but RunGroups may behave differently from individual runs (AC-delta-2 gap — could not verify exclusion within scope).

### Bulk Archive Confirmation Dialog

Triggered by: Multi-select → select runs → 'Archive' button

- **Dialog type:** SweetAlert2 (`swal2-icon-warning`) — yellow warning icon
- **Body text:** `"You are going to archive N runs"` (N = count of selected runs)
- **'Confirm'** button — executes bulk archive
- **'Cancel'** button — aborts

### Bulk Purge Confirmation Dialog (mislabeled "Delete" in toolbar)

Triggered by: Multi-select → select runs → 'Delete' button

- **Dialog type:** SweetAlert2 (`swal2-icon-error`) — red error icon
- **Body text:** `"These N runs will be purged and moved to Archive. To delete them permanently visit Runs Archive page."`
- **'Purge'** button — executes bulk purge
- **'Cancel'** button — aborts

### Footer Archive Entry Points

> Present in `_shared-ui.md § Runs List Page → Archive Links`. Referenced here for cross-linking only.
> - **'Runs Archive'** link (`/runs/archive`) — count badge shows total archived runs
> - **'Groups Archive'** link (`/runs/group-archive`) — count badge shows total archived groups

---

## Screen: Runs Archive Page

**URL:** /projects/project-for-testing/runs/archive/
**Entry points:** Runs List footer → "Runs Archive" link; also reachable via "Runs Archive" entry in the extra menu on Runs list page per ac-delta-5

### Breadcrumbs (delta)

- **'Runs'** link — `href: /projects/{project}/runs`; back-nav to Runs List; with Runs icon
- **'Project for testing'** → **'Runs Archive'** — standard breadcrumb chain
- **Count badge** — `"N"` archived runs count (e.g., `"16"`)

### Toolbar

- **Search** — `searchbox`, placeholder `"Search [Cmd + K]"`, `name: search`; searches archived run titles
- **Query Language Editor** icon button — `aria-describedby: ember44-popper`, tooltip `"Query Language Editor"`; same QLE as Runs List
- **Multi-select** icon button — `aria-describedby: ember50-popper`, tooltip `"Multi-select"`; activates row checkboxes; shows 16 checkboxes when all rows loaded
- **'Rungroup Structure'** toggle button — `aria-describedby: ember51-popper`; two states:
  - ON: `btn-selected`, tooltip `"Rungroup structure is enabled"` — groups archived runs under their parent RunGroup hierarchy
  - OFF: `active`, tooltip `"Rungroup structure is disabled"` — shows flat list; orphan runs from groups show group membership in brackets, e.g., `[ E2E MultiEnv Test ]`

### Filter Tabs

- **Manual** — link tab (`href: "#"`), filters to manual runs
- **Automated** — link tab (`href: "#"`), filters to automated runs
- **Mixed** — link tab (`href: "#"`), filters to mixed runs

> Note: No "All" tab observed — unfiltered state is the default. No "Terminated", "Purged", or other badge-based filter tabs visible (ac-delta-6 partial gap — badge filter may not exist as a separate tab; badges are inline on rows).

### Info Banner

- **Archive notice** — `div.quiet.truncate`; text: `"We've archived old runs before Jan 19, 2026. To manage your run history, go to Project Settings."` — links to `/projects/{project}/settings/project`
- **Dismiss button** — icon button (`e107`), closes the notice banner

### Runs Archive List — Row Structure

Each archived run row contains:
- **Run title link** — navigates to `/runs/archive/{id}`; shows run name
- **'purged' badge** — `div.badge.deleted`, text `"purged"` — displayed inline in run title area when the run was purged (compressed); visible for all runs currently in this project's archive
- **Group membership indicator** (flat view only) — when "Rungroup Structure" is OFF and a run belongs to a group, shows `[ {GroupName} ]` inline after run title; group name is a link to the active group page
- **Environment tag** — `img` + text (e.g., `Chrome`, `Windows`, `Firefox`) — shown when run had an environment set
- **Passed/Failed/Skipped counts** — three numeric columns (same layout as Runs List)
- **Finished at timestamp button** — `button[time]`, shows date/time
- **Row context menu button** — `btn-only-icon`, icon `img`; expands to run archive row menu

### Archived Run Row Extra Menu

- **'Unarchive'** — button; triggers Unarchive Run confirmation dialog
- **'Download as CSV'** — button; downloads run data as CSV (not archive-specific but present)
- (separator)
- **'Delete'** — button; triggers Permanent-Delete confirmation dialog (irreversible)

### Unarchive Run Confirmation Dialog

Triggered by: archived run row extra menu → "Unarchive"

- **Dialog type:** SweetAlert2 (`swal2-icon-warning`) — yellow warning icon
- **Body text:** `"You are going to restore 1 run"`
- **'Confirm'** button — executes unarchive; run moves back to active Runs List
- **'Cancel'** button — aborts

### Permanent-Delete Confirmation Dialog (from Archive)

Triggered by: archived run row extra menu → "Delete"

- **Dialog type:** SweetAlert2 (`swal2-icon-error`) — red error icon; DISTINCT from the archive warning icon
- **Body text:** `"You want to delete "{run name}". This action cannot be undone."`
- **'Delete'** button — executes permanent deletion; run removed from Archive
- **'Cancel'** button — aborts

### Multi-Select Bulk Action Bar (Runs Archive)

Triggered by: Multi-select → select ≥1 archived run checkboxes

- **Selection counter** — `"N runs"` label
- **'Select all'** link — selects all archived runs; `href: "#"`
- **'Unarchive'** button — bulk unarchive; moves selected back to active Runs List
- **'Delete'** button — bulk permanent-delete from Archive (irreversible)

### Table Column Headers

- **Rungroups, runs** | **Status** | **Assigned to** | **Finished at**

### Pagination

> Same «/» pagination as Runs List; reused from shared surface.

---

## Screen: Project Settings — Purge Old Runs

**URL:** /projects/project-for-testing/settings/project/
**Entry points:** Runs Archive info banner → "Project Settings" link; or sidebar → Settings → Project

### Retention Input (delta)

- **'Purge Old Runs'** section — within Project Settings general section
- **Retention input** — `input[type="number"]` (`spinbutton`), `placeholder: "Purge Old Runs"`, currently empty (no saved value in this project)
- **Help text:** `"How many days to keep runs. Old runs will be automatically purged on daily basis."` and `"90 days by default. Learn how to save runs data."` — "runs data" links to external docs
- **'Save'** button — saves the retention value

> Note: No minimum/maximum attributes observed on the input (`min: ""`, `max: ""`). The automated freeze timeout field uses `placeholder: "Min: 30"` as a pattern; Purge Old Runs does not show explicit min/max in DOM.

---

## Screen: Groups Archive Page

**URL:** /projects/project-for-testing/runs/group-archive/
**Entry points:** Runs List footer → "Groups Archive" link

### Breadcrumbs (delta)

- **'Runs'** link — `href: /projects/{project}/runs`
- **'Project for testing'** → **'Groups Archive'** — breadcrumb chain
- **Count badge** — `"N"` archived groups count (e.g., `"1"`)

### Toolbar

- **Search** — `searchbox`, placeholder `"Search"`, `name: search`; searches archived group names
- **Sort dropdown** button — icon button (`btn`), expands sort menu; four options:
  - **'ASC by Name'** — sorts A→Z by group name
  - **'DESC by Name'** — sorts Z→A by group name
  - **'ASC by Date'** — sorts oldest first by date
  - **'DESC by Date'** — sorts newest first by date

> Note: No "Group type" filter or "Finish Range" date-range picker observed with the current 1-group dataset (ac-delta-10 partial gap, ac-delta-11 gap — these filters may only appear when more data exists or may not be implemented). Filter tabs navigation element present but empty (no tab options rendered).

### Groups Archive List — Row Structure

Each archived group row contains:
- **Group name link** — navigates to `/runs/group-archive/groups/{id}`; shows group name
- **'archived' badge** — `div.badge.badge-query`, text `"archived"` — displayed inline after group name; distinct CSS from run 'purged' badge (`badge-query` vs `deleted`)
- **Passed/Failed/Skipped counts** — three numeric columns
- **Finished at timestamp button** — `button[time]`, shows date/time
- **Expand/Collapse button** — icon button (`aria-describedby: ember63-popper`, tooltip `"Expand"`); disabled when no child runs; expands nested runs under the group
- **Row context menu button** — `btn-only-icon`; expands to group archive row menu

### Archived Group Row Extra Menu

- **'Unarchive'** — button; triggers Unarchive Group confirmation dialog
- **'Purge'** — button; triggers Group Purge confirmation dialog (DISTINCT from run purge — deletes the group, moves nested runs to Archive)

### Unarchive Group Confirmation Dialog

Triggered by: archived group row extra menu → "Unarchive"

- **Dialog type:** SweetAlert2 (`swal2-icon-warning`) — yellow warning icon
- **Body text:** `"You are going to restore this group"`
- **'Confirm'** button — executes unarchive; group and nested runs return to active Runs List
- **'Cancel'** button — aborts

### Group Purge Confirmation Dialog

Triggered by: archived group row extra menu → "Purge"

- **Dialog type:** SweetAlert2 (`swal2-icon-error`) — red error icon
- **Body text:** `"This action will delete the group and the nested runs will be moved to the Archive."`
- **'Purge'** button — executes purge; group is deleted, nested runs moved to Runs Archive
- **'Cancel'** button — aborts

### Table Column Headers

- **Rungroups, runs** | **Status** | **Finished at**

---

## Badge Reference (Archive/Purge Specific)

| Badge text | CSS class | Context | Meaning |
|---|---|---|---|
| `purged` | `badge deleted` | Runs Archive row | Run was purged (compressed); stack traces removed |
| `archived` | `badge badge-query` | Groups Archive row | Group was manually archived |

> Note: No "terminated" badge (`badge terminated` or similar) was observed in the current dataset. All runs in the archive have `purged` status. An "archived" badge for individual runs (as distinct from "purged") was not found — may appear only if a run was archived without purging, which may require a run that was archived but never purged. This is a gap (ac-delta-16 partial).

---

## Happy-path sequence

### Archiving a single run

1. Navigate to Runs list (`/projects/{project}/runs/`)
2. Click the extra menu (⋯) on any run row
3. Click **'Move to Archive'** — Archive confirmation dialog appears
4. Verify dialog body: `"You are going to archive 1 run"` with warning icon
5. Click **'Confirm'**
6. Verify run disappears from active list
7. Verify "Runs Archive" count at footer increments by 1

### Purging a single run

1. Navigate to Runs list
2. Click the extra menu (⋯) on any run row
3. Click **'Purge'** — Purge confirmation dialog appears
4. Verify dialog body: `"This run will be purged and moved to Archive. To delete it permanently visit Runs Archive page."` with red error icon
5. Click **'Purge'**
6. Verify run disappears from active list; appears in Runs Archive with `purged` badge

### Unarchiving a single run

1. Navigate to Runs Archive (`/runs/archive`)
2. Click the extra menu (⋯) on any archived run row
3. Click **'Unarchive'** — Unarchive confirmation dialog appears
4. Verify dialog body: `"You are going to restore 1 run"` with warning icon
5. Click **'Confirm'**
6. Verify run disappears from archive list; archive count decrements
7. Verify toast: `"Runs have been restore!"` (app-side typo)
8. Verify run reappears in active Runs list

### Permanent deletion from Archive

1. Navigate to Runs Archive (`/runs/archive`)
2. Click the extra menu (⋯) on any archived run row
3. Click **'Delete'** — Permanent-delete confirmation dialog appears
4. Verify dialog body: `"You want to delete "{run name}". This action cannot be undone."` with red error icon
5. Click **'Delete'**
6. Verify run row is removed from Archive permanently

---

## Verified Flows

### Flow 1: Single run Archive dialog (Cancel path)
- Opened extra menu → "Move to Archive" → Archive dialog appeared with text `"You are going to archive 1 run"` and yellow warning icon
- Clicked 'Cancel' — dialog dismissed, run remained in list, no state change
- Status: verified

### Flow 2: Single run Purge dialog (Cancel path)
- Opened extra menu → "Purge" → Purge dialog appeared with text `"This run will be purged and moved to Archive. To delete it permanently visit Runs Archive page."` and red error icon
- Clicked 'Cancel' — dialog dismissed, run remained in list
- Status: verified

### Flow 3: Unarchive single run (Confirm path)
- Opened archived run extra menu → "Unarchive" → Dialog: `"You are going to restore 1 run"`
- Clicked 'Confirm' — toast appeared: `"Runs have been restore!"` — archive count dropped from 16 to 15
- Status: verified

### Flow 4: Permanent delete from Archive (Cancel path)
- Opened archived run extra menu → "Delete" → Dialog: `"You want to delete "{name}". This action cannot be undone."` with red error icon
- Clicked 'Cancel' — dialog dismissed, run remained in archive
- Status: verified

---

## Open Questions / Gaps

1. **ac-delta-6 partial (badge-based filter tabs):** The Runs Archive page shows only Manual/Automated/Mixed filter tabs. No separate "Archived" / "Purged" / "Terminated" badge filter tabs observed. Badge filtering may work differently (inline, QLE) or may not exist as tabs. Needs verification with a dataset containing "archived" (not purged) runs.

2. **ac-delta-10/11 (Groups Archive search/type filter and date-range picker):** With only 1 archived group in the project, the "Group type" filter and "Finish Range" date-range picker mentioned in the ACs were not visible. They may only render with multiple groups or may not be implemented. The sort dropdown (ASC/DESC by Name and Date) is confirmed present.

3. **ac-delta-16 partial (Terminated badge):** Only `purged` badges were observed in the Runs Archive; no "archived" (distinct from purged) or "terminated" badges found. A run archived without purging, or a run archived while in-progress (terminated), would be needed to confirm these badge variants exist.
