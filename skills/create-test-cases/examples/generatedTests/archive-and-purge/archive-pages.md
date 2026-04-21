<!-- suite -->
# Archive Pages — Browsing Runs Archive and Groups Archive

Covers navigation, filters, toggles, and badge rendering on the Runs Archive and Groups Archive pages. Does NOT cover the Archive / Purge / Unarchive actions themselves (owned by `run-actions.md`, `restore-and-delete.md`, and `rungroup-cascade.md`), the retention setting (owned by `retention-settings.md`), or the Runs list TQL query editor beyond its presence (owned by `#7 runs-list-management`).

<!-- test
type: manual
priority: high
source: AC-77, ac-delta-5
automation: candidate
-->
## Navigate to Runs Archive via ${entry_point}

Verifies each documented entry point opens the Runs Archive page correctly.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs page has at least one archived run so the `Runs Archive` footer link shows a non-zero count

## Steps
- Navigate to the active `Runs` page
  - _Expected_: the Runs list loads and the footer area shows a `Runs Archive` link with a count badge
- Use the `${entry_point}` to open the archive
  - _Expected_:
  - The URL changes to `/projects/{project}/runs/archive/`
  - The page header / breadcrumb shows `Runs Archive`
  - The archived-runs count badge in the breadcrumb matches the footer badge count

<!-- example -->
| entry_point |
|---|
| Runs page footer `Runs Archive` link |
| Runs list extra-menu / sidebar `Runs Archive` entry |

<!-- test
type: manual
priority: normal
source: ac-delta-6
automation: candidate
-->
## Filter archived runs by ${run_type}

Verifies the Manual / Automated / Mixed filter tabs on the Runs Archive page.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs Archive contains at least one run of each type: `manual-archived-src`, `automated-archived-src`, `mixed-archived-src`

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: the page loads with all archived runs visible and filter tabs `Manual`, `Automated`, `Mixed` present
- Click the `${run_type}` filter tab
  - _Expected_:
  - The tab becomes the active tab (visual selected state)
  - Only runs of type `${run_type}` are listed
  - The count badge reflects the filtered count
- Click the active `${run_type}` tab again (or clear to default)
  - _Expected_: the archive returns to the unfiltered list with all runs visible

<!-- example -->
| run_type |
|---|
| Manual |
| Automated |
| Mixed |

<!-- test
type: manual
priority: normal
source: ac-delta-7
automation: candidate
-->
## Rungroup Structure toggle switches between hierarchical and flat list

Verifies the Rungroup Structure toggle on the Runs Archive page reorganises archived runs between a hierarchy grouped by parent RunGroup and a flat list with inline group references.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs Archive contains at least 2 runs belonging to a RunGroup named `archive-toggle-group` and 1 orphan archived run (no group)

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: the toolbar shows a `Rungroup Structure` toggle button
- Enable the toggle (set state to ON, tooltip `"Rungroup structure is enabled"`)
  - _Expected_:
  - Runs belonging to `archive-toggle-group` are nested under a single group row named `archive-toggle-group`
  - The orphan run is listed outside of any group
- Disable the toggle (set state to OFF, tooltip `"Rungroup structure is disabled"`)
  - _Expected_:
  - The list becomes flat
  - Runs that previously nested under `archive-toggle-group` now show `[ archive-toggle-group ]` as an inline label after the run title
  - Clicking the inline `archive-toggle-group` label navigates to the group detail

<!-- test
type: manual
priority: normal
source: ac-delta-16
automation: candidate
-->
## Runs Archive row displays ${badge} for ${state} @unclear

Verifies archived rows show the correct visible badge depending on how the run got to the Archive. Marked `@unclear` because in the current UI dataset only the `purged` badge was reliably observable; the `archived` and `terminated` badges must be exercised via the preconditions below.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs Archive contains three runs prepared by the preconditions:
  - `badge-archived-src` — a finished run that was manually archived (should show `archived`)
  - `badge-purged-src` — a finished run that was purged (should show `purged`)
  - `badge-terminated-src` — a run that was archived while in-progress (should show `terminated` state indicator)

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: all three sample runs are visible on the archive list
- Locate the row for `${row_name}`
  - _Expected_:
  - The row displays the `${badge}` badge or state indicator inline with the run title
  - The badge text / indicator matches the expected wording `${badge_text}`
  - No other of the three state indicators (from the matrix) is shown on the same row

<!-- example -->
| state | row_name | badge | badge_text |
|---|---|---|---|
| manually archived | badge-archived-src | archived | archived |
| purged | badge-purged-src | purged | purged |
| terminated | badge-terminated-src | terminated | terminated |

<!-- test
type: manual
priority: normal
source: ac-delta-6
automation: candidate
-->
## Runs Archive search with no matching title shows an empty result @negative

Verifies the search box on the Runs Archive returns an empty state when no archived run matches the query.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs Archive contains multiple archived runs, none of which has the word `zzzqx` in its title

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_: the search box is visible in the toolbar with placeholder text referring to search
- Type `zzzqx notfound` into the Runs Archive search input
  - _Expected_:
  - The list filters as you type
  - The final state shows no archived-run rows
  - An empty-state indicator (empty list or "No results" hint) is visible
- Clear the search input
  - _Expected_: the archive list returns to its full set of rows

<!-- test
type: manual
priority: normal
source: ac-delta-10
automation: candidate
-->
## Search archived groups by name in Groups Archive

Verifies the Groups Archive search box filters the list to groups whose names match the query.

## Preconditions
- Signed in as a user with `Manager` role
- The Groups Archive contains at least three archived groups: `search-alpha-grp`, `search-beta-grp`, `unrelated-grp`

## Steps
- Navigate to the `Groups Archive` page (`/projects/{project}/runs/group-archive/`)
  - _Expected_: the page shows all three archived groups
- Type `search-` into the Groups Archive search input
  - _Expected_:
  - `search-alpha-grp` and `search-beta-grp` remain visible
  - `unrelated-grp` is hidden
- Clear the search input
  - _Expected_: the list returns to all three archived groups

<!-- test
type: manual
priority: normal
source: ac-delta-12
automation: candidate
-->
## Sort archived groups by ${sort_mode}

Verifies each option of the Groups Archive sort dropdown reorders the list predictably.

## Preconditions
- Signed in as a user with `Manager` role
- The Groups Archive contains at least three archived groups with known distinct names and finish dates:
  - `sort-grp-a` finished 2026-04-10
  - `sort-grp-m` finished 2026-04-15
  - `sort-grp-z` finished 2026-04-18

## Steps
- Navigate to the `Groups Archive` page
  - _Expected_: the toolbar shows a Sort dropdown button
- Open the Sort dropdown
  - _Expected_: the menu exposes options `ASC by Name`, `DESC by Name`, `ASC by Date`, `DESC by Date`
- Click `${sort_mode}`
  - _Expected_:
  - The dropdown closes
  - The list re-orders so the first visible group matches `${first_group}` and the last visible group matches `${last_group}`

<!-- example -->
| sort_mode | first_group | last_group |
|---|---|---|
| ASC by Name | sort-grp-a | sort-grp-z |
| DESC by Name | sort-grp-z | sort-grp-a |
| ASC by Date | sort-grp-a | sort-grp-z |
| DESC by Date | sort-grp-z | sort-grp-a |

<!-- test
type: manual
priority: low
source: ac-delta-10
automation: manual-only
automation-note: the "Group type" filter only renders when the project has multiple archived groups of distinct types; availability is @unclear — locator and trigger need to be confirmed with product before automation.
-->
## Filter archived groups by Group type @unclear

Verifies the "Group type" filter on the Groups Archive page narrows the list to groups of a single type. Marked `@unclear` because with the current project data the Group-type filter was not visible; may only render with multiple groups of differing types.

## Preconditions
- Signed in as a user with `Manager` role
- The Groups Archive contains at least two archived groups of distinct types (e.g., one `Regression`, one `Smoke`)

## Steps
- Navigate to the `Groups Archive` page
  - _Expected_: the toolbar exposes a `Group type` filter control (label / chip / dropdown — exact locator to be confirmed with product)
- Open the Group-type filter and select a single type (e.g., `Regression`)
  - _Expected_:
  - Only groups of the selected type remain visible
  - The count badge in the breadcrumb reflects the filtered count
- Clear the Group-type selection
  - _Expected_: the list returns to all archived groups

<!-- test
type: manual
priority: low
source: ac-delta-11
automation: manual-only
automation-note: the Finish Range date-range picker was not visible with the current single-group dataset; exact locator / range semantics to be confirmed with product.
-->
## Filter archived groups by Finish Range @unclear

Verifies the Finish Range date-range picker on the Groups Archive filters the list by group finish time. Marked `@unclear` because the control was not observable with current UI data.

## Preconditions
- Signed in as a user with `Manager` role
- The Groups Archive contains groups finished on different dates, e.g., `range-grp-oldest` (2026-04-01), `range-grp-middle` (2026-04-10), `range-grp-newest` (2026-04-18)

## Steps
- Navigate to the `Groups Archive` page
  - _Expected_: a Finish Range date-range picker is visible in the toolbar (exact locator to be confirmed)
- Open the Finish Range picker and select a window from 2026-04-05 to 2026-04-15
  - _Expected_:
  - Only `range-grp-middle` remains visible
  - `range-grp-oldest` and `range-grp-newest` are hidden
- Clear the Finish Range selection
  - _Expected_: all three groups are visible again
