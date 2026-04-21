<!-- suite -->
# Filter Tabs and View

Covers the Runs list top-level tabs (Manual / Automated / Mixed / Unfinished / Groups), the Default ↔ Custom view toggle, the column Settings panel, column visibility and width persistence, and URL share of the active filter state. Does NOT cover filter composition via TQL (owned by TQL Query Editor) or runs-archive pages (owned by #9 archive-and-purge — only the entry link navigation is exercised under Chart and Toolbar).

<!-- test
type: manual
priority: critical
source: AC-68, ac-delta-3
automation: candidate
-->
## Switch to the ${tab} filter tab scopes the list to matching runs @smoke

Verifies each top-level filter tab narrows the Runs list to the appropriate run/type, and that the run count badge updates to reflect the filtered list.

## Preconditions
- Signed in as a user with access to a project
- The Runs page of the project is open
- At least one run of each represented type exists in the project (Manual, Automated, Mixed) plus at least one unfinished run and one RunGroup

## Steps
- Note the current run count badge value near the `Runs` breadcrumb
  - _Expected_: a numeric badge is visible next to the `Runs` breadcrumb
- Click the `${tab}` filter tab above the Runs list
  - _Expected_:
  - The `${tab}` tab becomes the active tab
  - The list refreshes to show only rows matching `${expected_scope}`
- Observe the `${count_label}` indicator for the active tab
  - _Expected_: the indicator reflects the number of rows visible under the `${tab}` tab

<!-- example -->
| tab | expected_scope | count_label |
| --- | --- | --- |
| Manual | Manual-type runs only | Runs count badge |
| Automated | Automated-type runs only | Runs count badge |
| Mixed | Mixed-type runs only | Runs count badge |
| Unfinished | Runs whose status is not Finished | Runs count badge |
| Groups | RunGroup rows only, individual run rows hidden | `"{N} rungroups found"` text |

<!-- test
type: manual
priority: high
source: AC-74, ac-delta-11
automation: candidate
-->
## Toggle Default view and Custom view switches list layout and button label @smoke

Confirms the view toggle flips between the card list (Default) and the full-column table (Custom), and that the button text changes to reflect the current mode.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Default view
- At least one finished run is visible in the list

## Steps
- Observe the toggle button in the Runs list toolbar
  - _Expected_: the button label reads `Custom view`
- Click the `Custom view` button
  - _Expected_:
  - The list re-renders as a table with the headers `Title`, `Plan`, `Labels`, `Tags & Envs`, `Tests Count`, `Defects Count`, `Status`, `Assigned to`, `Finished at`, `Actions`
  - The toggle button label now reads `Default view`
- Click the `Default view` button
  - _Expected_:
  - The list re-renders as the card view
  - The toggle button label returns to `Custom view`

<!-- test
type: manual
priority: high
source: AC-74, ac-delta-10
automation: candidate
-->
## Settings gear is enabled only in Custom view @negative

Verifies the column Settings affordance is gated on Custom view mode and has no effect when in Default view.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Default view

## Steps
- Hover the Settings gear icon next to the view toggle
  - _Expected_: the Settings gear is present but visibly disabled in Default view
- Click the Settings gear in Default view
  - _Expected_: no panel opens and the Runs list is unchanged
- Click `Custom view` to switch to table mode
  - _Expected_: the Settings gear becomes enabled
- Click the Settings gear
  - _Expected_: the `Runs list settings` panel opens with column checkboxes and width inputs

<!-- test
type: manual
priority: normal
source: AC-74, ac-delta-10
automation: deferred
automation-note: persistence assertion requires a full reload inside the automated session — verify the chosen column/width survives navigation away and back
-->
## Hiding a column in Custom view Settings persists across reload

Confirms a column visibility change saved in the Runs list settings panel survives a page reload for the same user.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Custom view with all columns visible by default

## Steps
- Open the Settings gear
  - _Expected_: the `Runs list settings` panel shows every column checkbox checked
- Uncheck the `Plan` column checkbox
  - _Expected_: the `Plan` checkbox becomes unchecked
- Click `Save`
  - _Expected_:
  - The panel closes
  - The `Plan` column is no longer rendered in the Custom view table
- Reload the Runs page
  - _Expected_:
  - Custom view mode is preserved
  - The `Plan` column remains hidden
- Open the Settings gear
  - _Expected_: the `Plan` checkbox is still unchecked, confirming persistence

<!-- test
type: manual
priority: normal
source: AC-74, ac-delta-10
automation: deferred
automation-note: requires drag-resize or programmatic width change; current UI exposes the width only via a spinbutton, which is automatable but environment-flaky — deferred to stabilize
-->
## Changing a column width in Custom view Settings persists across reload

Confirms that an explicit column width change set in the settings panel is preserved for the same user across reloads.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open in Custom view

## Steps
- Open the Settings gear
  - _Expected_: the `Runs list settings` panel exposes a width `spinbutton` next to each visible column
- Change the `Tests count` column width from its default to `160`
  - _Expected_: the spinbutton shows the new value `160`
- Click `Save`
  - _Expected_:
  - The panel closes
  - The `Tests count` column renders with a visibly wider width
- Reload the Runs page
  - _Expected_: the `Tests count` column retains the updated width
- Open the Settings gear
  - _Expected_: the `Tests count` width spinbutton still reads `160`

<!-- test
type: manual
priority: high
source: AC-73, ac-delta-16
automation: candidate
-->
## Copying the Runs URL reproduces the active filter in a new session

Confirms the filter state is encoded in the URL as `filterParam` and is honored by another session opening the same link.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open with no filter active
- A TQL filter that produces a non-empty result set is known (for example `failed == true`)

## Steps
- Apply a TQL filter that yields at least one matching run
  - _Expected_:
  - The Runs list shows only the matching runs
  - The page URL contains a `filterParam=` query parameter
  - A `"{N} runs found"` indicator is visible with a `Reset` button
- Copy the current page URL
  - _Expected_: the URL contains the same `filterParam` value
- Open the copied URL in a new browser tab signed in as the same user
  - _Expected_:
  - The Runs page opens with the same filter applied
  - The same filtered result set is rendered
  - The `"{N} runs found"` indicator matches the source tab

<!-- test
type: manual
priority: normal
source: AC-68, ac-delta-3
automation: candidate
-->
## Switching to the Unfinished tab in a project with no unfinished runs shows an empty state @negative

Verifies the Unfinished filter tab degrades gracefully when the project currently contains zero runs in a non-finished state — no rows are rendered and no filtered indicator is misleading.

## Preconditions
- Signed in as a user with access to a project in which every existing run is Finished (no in-progress or pending runs)
- The Runs page is open on the `Manual` tab

## Steps
- Note the run count badge on the `Manual` tab
  - _Expected_: a non-zero badge value is observable (there is at least one finished run)
- Click the `Unfinished` filter tab
  - _Expected_:
  - The `Unfinished` tab becomes the active tab
  - The run list area shows no run rows
  - The run count indicator for the Unfinished tab reads zero
- Click the `Manual` tab again
  - _Expected_: the list is repopulated with the finished runs previously visible

<!-- test
type: manual
priority: normal
source: AC-73, ac-delta-16
automation: candidate
-->
## Opening the Runs page with a malformed filterParam falls back to the unfiltered list @negative

Verifies that a Runs URL carrying an unparseable `filterParam` value does not break the page — the list renders as unfiltered and no filter-active indicator is shown.

## Preconditions
- Signed in as a user with access to a project
- A URL of the form `/projects/{project}/runs?filterParam=search%3D%25%25INVALID%25%25` is available

## Steps
- Navigate to the Runs URL with the malformed `filterParam`
  - _Expected_: the Runs page loads without an error banner or page crash
- Observe the Runs list
  - _Expected_:
  - The list renders as if no filter were applied
  - No `"{N} runs found"` indicator is shown
  - No `Reset` button is shown
- Observe the address bar
  - _Expected_: the URL may retain the malformed `filterParam` token but it has no effect on the rendered list

<!-- test
type: manual
priority: low
source: AC-68
automation: candidate
-->
## Switching to the Groups tab in a project with no RunGroups shows an empty state @negative

Verifies the Groups filter tab degrades gracefully when the project contains zero RunGroups — the list renders empty and the counter reflects zero.

## Preconditions
- Signed in as a user with access to a project that contains at least one individual run but zero RunGroups
- The Runs page is open on the `Manual` tab

## Steps
- Click the `Groups` filter tab
  - _Expected_:
  - The `Groups` tab becomes the active tab
  - The URL includes `filterParam=groups%3Dtrue`
- Observe the list area
  - _Expected_:
  - No RunGroup rows are rendered
  - No individual run rows are rendered (individual runs are hidden on the Groups tab)
  - A `"0 rungroups found"` indicator or equivalent empty-state message is visible
- Click the `Manual` tab again
  - _Expected_: the Manual list is restored with individual run rows
