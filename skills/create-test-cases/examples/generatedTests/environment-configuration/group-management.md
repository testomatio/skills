<!-- suite -->
# Group Management

Covers managing environment groups inside the Multi-Environment Configuration modal — adding, removing, editing groups, and the quick-fill shortcuts for the environment checklist. Does NOT cover modal open/dismiss (owned by Modal Lifecycle) or the downstream launch behaviour driven by group count (owned by Launch Variants).

<!-- test
type: manual
priority: normal
source: AC-45, AC-46
automation: candidate
-->
## Select multiple environments in a single group and commit them

Verifies that one env group can contain several individually checked environments and that all of them surface as badge chips in the sidebar after save.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- The Multi-Environment Configuration modal is open with one empty group labeled `1`

## Steps
- Check two distinct environment options inside group `1` (for example `Windows` and `MacOS`)
  - _Expected_: both checkboxes render as selected
- Click the `Save` button
  - _Expected_: the modal closes
- Observe the environment row in the New Manual Run sidebar
  - _Expected_: both selected environment values are rendered as separate badge chips (e.g. `Windows`, `MacOS`)
- Observe the primary action footer of the sidebar
  - _Expected_: a single `Launch` button is shown

<!-- test
type: manual
priority: normal
source: ac-delta-13
automation: candidate
-->
## `All` master checkbox toggles every environment in the current group

Verifies the group-local `All` checkbox both selects every option and, when clicked again, deselects every option.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- The Multi-Environment Configuration modal is open with one empty group labeled `1` expanded

## Steps
- Click the `All` master checkbox at the top of the environment checklist
  - _Expected_: every environment option in the checklist becomes selected
- Click the `All` master checkbox again
  - _Expected_: every environment option becomes unselected
- Check one individual environment option
  - _Expected_:
  - The individual option is selected
  - The `All` master checkbox renders in an indeterminate or unchecked state (reflecting a partial selection)

<!-- test
type: manual
priority: normal
source: ac-delta-14
automation: candidate
-->
## `Add all envs` footer link populates the currently expanded group

Uses the modal footer `Add all envs` shortcut to select every environment option in one click.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- The Multi-Environment Configuration modal is open with one empty group labeled `1` expanded

## Steps
- Observe the environment checklist in group `1`
  - _Expected_: no environment options are selected
- Click the `Add all envs` link in the modal footer
  - _Expected_: every environment option in group `1` is selected
- Click the `Save` button
  - _Expected_: the modal closes
- Observe the environment row in the sidebar
  - _Expected_: a badge chip is shown for every environment that was selected

<!-- test
type: manual
priority: high
source: AC-47, ac-delta-7
automation: candidate
-->
## Add a second env group via `Add Environment` @smoke

Verifies the `Add Environment` action appends a new collapsible group slot and that the sidebar footer immediately exposes the multi-env launch variants.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- The Multi-Environment Configuration modal is open, group `1` already has at least one environment selected and is currently collapsed or expanded

## Steps
- Click the `Add Environment` button in the modal footer
  - _Expected_:
  - A new group slot labeled `2` is appended below group `1`
  - Group `2` is initially collapsed and has no environment selected
- Expand group `2`
  - _Expected_: the environment checklist is visible
- Check at least one environment option inside group `2`
  - _Expected_: the selected checkbox is shown in the slot header preview (e.g. `2 Chrome`)
- Click the `Save` button
  - _Expected_: the modal closes
- Observe the primary action footer of the sidebar
  - _Expected_:
  - The single `Launch` button is no longer shown
  - Two separate buttons `Launch in Sequence` and `Launch All` are shown side by side

<!-- test
type: manual
priority: normal
source: ac-delta-3
automation: candidate
-->
## Remove one env group via the per-group minus button

Verifies a configured group can be deleted from the modal and that the sidebar launch footer adapts to the remaining group count.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- Two env groups have been saved (group `1` with one env, group `2` with one env) — the sidebar shows `Launch in Sequence` and `Launch All`

## Steps
- Click the `2 environments configured` button in the sidebar
  - _Expected_: the Multi-Environment Configuration modal opens populated with two groups
- Click the minus `−` remove button on the header of group `2`
  - _Expected_: group `2` is no longer rendered in the modal body
- Click the `Save` button
  - _Expected_: the modal closes
- Observe the environment row in the sidebar
  - _Expected_: only the remaining group `1` selection is shown as a badge chip
- Observe the primary action footer of the sidebar
  - _Expected_: a single `Launch` button is shown (no Sequence or All variants)

<!-- test
type: manual
priority: normal
source: ac-delta-2, ac-delta-15
automation: candidate
-->
## Edit an existing group's env selection via round-trip of the modal

Opens the modal on a previously saved configuration, changes the selection, and verifies that the sidebar reflects the updated values.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- One env group has been saved with a single environment selected (the sidebar shows that environment as a badge chip)

## Steps
- Click the `+` button or the environment badge chip in the sidebar to re-open the modal
  - _Expected_: the Multi-Environment Configuration modal opens with group `1` populated with the prior selection
- Expand group `1` if not already expanded
  - _Expected_: the prior selection is visible in the checklist
- Uncheck the previously selected environment
  - _Expected_: the checkbox renders as unselected
- Check a different environment option inside group `1`
  - _Expected_: the new option renders as selected
- Click the `Save` button
  - _Expected_: the modal closes
- Observe the environment row in the sidebar
  - _Expected_:
  - The previous environment value is no longer shown as a badge chip
  - The newly selected environment value is rendered as a badge chip

<!-- test
type: manual
priority: normal
source: AC-47, ac-delta-5
automation: candidate
-->
## `Cancel` after adding a new env group discards the pending group @negative

Adds a new env group inside the modal but dismisses the modal before saving — the pending group must not appear in the committed configuration or change the sidebar.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- One env group has been saved with a single environment selected (the sidebar shows that environment as a badge chip)

## Steps
- Click the `+` button or the environment badge chip in the sidebar to re-open the modal
  - _Expected_: the Multi-Environment Configuration modal opens with one populated group labeled `1`
- Click the `Add Environment` button in the modal footer
  - _Expected_: a new empty group labeled `2` is appended
- Expand group `2` and check one environment option
  - _Expected_: the selected checkbox is shown in the group `2` slot header preview
- Click the `Cancel` button in the modal footer
  - _Expected_: the modal closes
- Observe the environment row in the sidebar
  - _Expected_:
  - The original group `1` selection is still rendered as a badge chip
  - No `2 environments configured` button is shown
- Observe the primary action footer of the sidebar
  - _Expected_: a single `Launch` button is shown (no Sequence or All variants)

<!-- test
type: manual
priority: normal
source: ac-delta-3, ac-delta-5
automation: candidate
-->
## `Cancel` after removing a group via minus restores the removed group @negative

Removes an env group inside the modal but dismisses the modal via `Cancel` — the removal must not persist and both groups must remain on re-open.

## Preconditions
- Signed in as a user with access to a project
- The New Manual Run sidebar is open on the Runs page
- Two env groups have been saved, each with one environment selected (the sidebar shows `2 environments configured` and the primary action footer shows `Launch in Sequence` + `Launch All`)

## Steps
- Click the `2 environments configured` button in the sidebar
  - _Expected_: the Multi-Environment Configuration modal opens with two populated groups
- Click the minus `−` remove button on the header of group `2`
  - _Expected_: group `2` is no longer rendered in the modal body
- Click the `Cancel` button in the modal footer
  - _Expected_: the modal closes
- Click the `2 environments configured` button in the sidebar again
  - _Expected_: the modal re-opens
- Observe the modal body
  - _Expected_:
  - Two group slots are present, labeled `1` and `2`
  - Group `2` still shows its original environment selection in the slot header preview
- Close the modal via the `×` icon
  - _Expected_: the modal closes
- Observe the primary action footer of the sidebar
  - _Expected_: `Launch in Sequence` and `Launch All` buttons are visible (multi-env state preserved)
