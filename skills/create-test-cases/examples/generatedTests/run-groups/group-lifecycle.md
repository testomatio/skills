<!-- suite -->
# Group Lifecycle

Covers creating, validating, and editing a RunGroup via the New group dialog and the Edit RunGroup page. Does NOT cover launching runs inside a group (owned by Contents and Runs) or group-level menu actions such as Copy, Pin, Archive (owned by Menu Actions and Archive and Purge).

<!-- test
type: manual
priority: high
source: AC-13, AC-14, ac-delta-1, ac-delta-5
automation: candidate
-->
## Create a new RunGroup via the New group dialog @smoke

Creates a group using the standard arrow-menu entry point, confirms the right-side panel exposes the expected field set, and verifies the saved group appears in the Runs list without a full page refresh.

## Preconditions
- Signed in as a user with access to a project
- The Runs page of the project is open

## Steps
- Click the arrow next to the `Manual Run` button in the Runs page header
  - _Expected_: a dropdown menu opens with `New Group` as one of its entries
- Click `New Group`
  - _Expected_:
  - A right-side panel opens with the heading `New RunGroup`
  - The panel exposes fields in this order: Group Type, Name, Merge Strategy, Description
  - The `Save` button is disabled while Name is empty
- Enter a unique group name in the `Name` field (for example `run-groups AC-13 smoke`)
  - _Expected_:
  - The field shows the entered value
  - The `Save` button becomes enabled
- Click `Save`
  - _Expected_:
  - The panel closes
  - A new group row with the entered name appears on the Runs list under the Groups scope
  - The page does NOT perform a full browser reload

<!-- test
type: manual
priority: normal
source: AC-13, ac-delta-1
automation: candidate
-->
## Dismissing the New RunGroup panel via ${dismiss_method} does not create a group @negative

Verifies both dismiss affordances on the New RunGroup panel — the `Cancel` link and the `×` close icon — abandon the draft and leave the Runs list unchanged.

## Preconditions
- Signed in as a user with access to a project
- The Runs page of the project is open
- The New RunGroup panel is open and a draft Name has been typed in (for example `run-groups-cancel-${dismiss_method}`)

## Steps
- Note the count of groups currently visible in the Runs list
  - _Expected_: a baseline count is observable
- Click the `${dismiss_method}` control on the panel
  - _Expected_: the panel closes and navigation returns to the Runs list
- Observe the Runs list
  - _Expected_:
  - No group with the drafted Name appears on the list
  - The visible group count matches the baseline noted before dismissal

<!-- example -->
| dismiss_method |
| --- |
| Cancel link |
| × close icon |

<!-- test
type: manual
priority: high
source: AC-14, ac-delta-4
automation: candidate
-->
## New RunGroup panel blocks save with an empty Name @negative

Confirms the Name field is enforced as required — the `Save` action stays inert until a non-empty Name is supplied, even when every other field is filled in.

## Preconditions
- Signed in as a user with access to a project
- The Runs page of the project is open
- The New RunGroup panel is open

## Steps
- Leave the `Name` field empty
  - _Expected_: the Name field is visibly empty
- Select a `Group Type` from the combobox (for example `Build`)
  - _Expected_: the combobox shows the selected type
- Select the `Optimistic` Merge Strategy radio
  - _Expected_: the Optimistic radio becomes checked and Realistic unchecked
- Fill the Description textarea with a placeholder sentence
  - _Expected_: the textarea shows the entered text
- Attempt to click the `Save` button
  - _Expected_:
  - The `Save` button is disabled (or the submit is rejected with an inline error on Name)
  - No group is created
  - The panel remains open

<!-- test
type: manual
priority: normal
source: AC-14, ac-delta-3
automation: candidate
-->
## Creating a group with Merge Strategy ${strategy} persists the choice @boundary

Walks through creating a group with each of the three Merge Strategy radio options and verifies the chosen strategy is stored on the saved group.

## Preconditions
- Signed in as a user with access to a project
- The Runs page of the project is open
- The New RunGroup panel is open with a unique Name filled in (for example `run-groups-strategy-${strategy}`)

## Steps
- Select the `${strategy}` Merge Strategy radio
  - _Expected_:
  - The `${strategy}` radio becomes checked
  - Any previously checked strategy radio becomes unchecked
- Click `Save`
  - _Expected_: the panel closes and the new group row appears on the Runs list
- Open the saved group by clicking its row
  - _Expected_: the RunGroup detail panel opens
- Open the extra menu on the group and click `Edit`
  - _Expected_: the Edit RunGroup page opens with the group's current values pre-filled
- Observe the Merge Strategy radio group on the Edit page
  - _Expected_: the `${strategy}` radio is the one selected

<!-- example -->
| strategy |
| --- |
| Realistic |
| Optimistic |
| Pessimistic |

<!-- test
type: manual
priority: normal
source: AC-14, ac-delta-2
automation: candidate
-->
## Creating a group with Group Type ${type} persists the choice @boundary

Walks through creating a group with each of the three Group Type typeahead options and verifies the chosen type is stored on the saved group.

## Preconditions
- Signed in as a user with access to a project
- The Runs page of the project is open
- The New RunGroup panel is open with a unique Name filled in (for example `run-groups-type-${type}`)

## Steps
- Click the `Group Type` combobox
  - _Expected_: the typeahead dropdown opens listing at least `Build`, `Release`, `Sprint`
- Pick the `${type}` option
  - _Expected_: the combobox shows `${type}` as the current selection
- Click `Save`
  - _Expected_: the panel closes and the new group row appears on the Runs list
- Open the saved group and observe its type indicator
  - _Expected_:
  - The detail panel header shows an icon and a text badge corresponding to `${type}`
- Open the group extra menu and click `Edit`
  - _Expected_: the Edit RunGroup page opens with `${type}` pre-selected in the Group Type combobox

<!-- example -->
| type |
| --- |
| Build |
| Release |
| Sprint |

<!-- test
type: manual
priority: high
source: ac-delta-13
automation: candidate
-->
## Edit an existing RunGroup commits the changes in place @smoke

Opens the Edit RunGroup page on an existing group, changes Name and Merge Strategy, saves, and confirms the same group is updated (no duplicate).

## Preconditions
- Signed in as a user with access to a project
- A RunGroup exists with Name `run-groups edit baseline` and Merge Strategy `Realistic`
- The Runs page shows the existing group

## Steps
- Open the group's extra menu from its row on the Runs list and click `Edit`
  - _Expected_: the Edit RunGroup page opens with the heading `Edit RunGroup`
- Observe the pre-filled fields
  - _Expected_:
  - `Name` = `run-groups edit baseline`
  - Merge Strategy = `Realistic` (selected)
- Change the Name field to `run-groups edit updated`
  - _Expected_: the field shows the new value
- Select the `Pessimistic` Merge Strategy radio
  - _Expected_: the `Pessimistic` radio becomes checked
- Click `Save`
  - _Expected_: the page navigates back to the group context
- Observe the Runs list
  - _Expected_:
  - A group with Name `run-groups edit updated` is present
  - The previous `run-groups edit baseline` name is no longer present (only a rename, not a duplicate)
- Re-open the group's Edit page
  - _Expected_: Name = `run-groups edit updated`, Merge Strategy = `Pessimistic`

<!-- test
type: manual
priority: normal
source: ac-delta-13
automation: candidate
-->
## Cancel on Edit RunGroup discards pending changes @negative

Verifies that leaving the Edit RunGroup page via Cancel does not persist any of the local edits to Name, Merge Strategy, or Description.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup exists with Name `run-groups edit cancel baseline`, Merge Strategy `Realistic`, Description empty

## Steps
- Open the Edit RunGroup page for the existing group
  - _Expected_: the page opens with pre-filled fields matching the baseline
- Change the Name field to `run-groups edit cancel dirty`
  - _Expected_: the field shows the dirty value
- Select the `Optimistic` Merge Strategy radio
  - _Expected_: Optimistic becomes checked
- Fill the Description textarea with `should-not-persist`
  - _Expected_: the textarea shows the entered text
- Click `Cancel`
  - _Expected_: the page navigates back without a save
- Re-open the Edit RunGroup page for the same group
  - _Expected_:
  - Name = `run-groups edit cancel baseline`
  - Merge Strategy = `Realistic`
  - Description = empty
