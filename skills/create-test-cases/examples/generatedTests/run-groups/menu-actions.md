<!-- suite -->
# Menu Actions

Covers the state-aware RunGroup extra menu, pinning / unpinning a group, and the Copy RunGroup dialog with its copy-scope toggles. Does NOT cover Archive / Unarchive / Purge flows (owned by Archive and Purge) or the Edit flow (owned by Group Lifecycle).

<!-- test
type: manual
priority: normal
source: ac-delta-12
automation: candidate
-->
## RunGroup extra menu action set is state-aware — ${group_state} @smoke

Walks through opening the extra menu on a RunGroup in each of its visible states and verifies that the surfaced actions match the state's allowed operations.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup exists in the `${group_state}` state with the name convention `run-groups menu-${group_state}`
  - For `active`: group is in the active Runs list and unpinned
  - For `archived`: group is in the Groups Archive

## Steps
- Navigate to `${entry_page}`
  - _Expected_: the list shows the `run-groups menu-${group_state}` group
- Open the extra menu on the group's row
  - _Expected_:
  - The menu items surfaced match `${expected_items}` exactly (no extras, no missing)
  - Items in `${blocked_items}` are NOT visible in the menu

<!-- example -->
| group_state | entry_page | expected_items | blocked_items |
| --- | --- | --- | --- |
| active | Runs page | Edit, Copy, Add Existing Run, Add Automated Run, Mixed Run, Pin, Move, Add Subgroup, Move to Archive, Purge | Unarchive |
| archived | Groups Archive page | Unarchive, Purge | Edit, Copy, Pin, Add Existing Run, Move, Move to Archive |

<!-- test
type: manual
priority: normal
source: AC-70, ac-delta-16
automation: candidate
-->
## ${pin_action} a RunGroup via the extra menu moves it to ${destination_region}

Verifies Pin places the group in the pinned region at the top of the Runs list and Unpin restores it to its natural sort order. Exact visual styling of the pinned-region badge is noted as `@partial` pending a seeded pinned group — the ordering behaviour is the primary assertion.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups pin baseline` exists in the `${preconditioned_state}` state
- The Runs page shows the group

## Steps
- Open the extra menu on `run-groups pin baseline`
  - _Expected_: the menu shows `${pin_action}` (and does NOT show the opposite label)
- Click `${pin_action}`
  - _Expected_: the menu closes
- Observe the Runs list
  - _Expected_:
  - `run-groups pin baseline` is now positioned in the `${destination_region}` region
  - Re-opening its extra menu now shows the opposite label `${opposite_action}` (Pin ↔ Unpin)

<!-- example -->
| pin_action | preconditioned_state | destination_region | opposite_action |
| --- | --- | --- | --- |
| Pin | unpinned | pinned (top of list) | Unpin |
| Unpin | pinned | its natural sort (chronological / default order) | Pin |

<!-- test
type: manual
priority: normal
source: AC-53, ac-delta-15
automation: candidate
-->
## Copy RunGroup with default toggle selection creates a duplicate with Nested structure and Labels only @smoke

Exercises the default state of the Copy RunGroup dialog — Nested structure and Labels checked, Assignee / Issues / Environments unchecked — and verifies the created copy reflects only the selected slices.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups copy-default-source` exists with at least one child run, at least one label attached, at least one assignee on a child run, at least one issue linked to the group, and an environment value set on a child run

## Steps
- Open the extra menu on `run-groups copy-default-source` and click `Copy`
  - _Expected_: the Copy dialog opens with the heading `Choose copy settings`
- Observe the default toggle states
  - _Expected_:
  - `Nested structure` is checked
  - `Labels` is checked
  - `Assignee` is unchecked
  - `Issues` is unchecked
  - `Environments` is unchecked
- Click the `Copy` primary button
  - _Expected_: the dialog closes and a new group appears on the Runs list whose Name is derived from the source (for example `run-groups copy-default-source (copy)`)
- Open the new copy and observe its contents
  - _Expected_:
  - The child run structure from the source is present (Nested structure carried)
  - Labels from the source are present on the copy (Labels carried)
  - No assignee from the source is carried onto the copy's runs
  - No issues from the source are linked to the copy
  - No environment values from the source are carried onto the copy's runs
- Return to `run-groups copy-default-source`
  - _Expected_: the source group's labels / assignees / issues / environments / nested runs are unchanged (source untouched)

<!-- test
type: manual
priority: normal
source: ac-delta-15
automation: candidate
-->
## Copy RunGroup with custom toggle selection (Assignee, Issues, Environments enabled) propagates the selected slices

Verifies a non-default copy configuration — enabling Assignee, Issues, and Environments alongside the defaults — causes those slices to propagate to the new group.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups copy-custom-source` exists with at least one child run assigned to a user, at least one issue linked to the group, at least one label attached, and an environment value set on a child run

## Steps
- Open the Copy RunGroup dialog from the group's extra menu
  - _Expected_: the dialog opens with the default toggles described in the companion test
- Check `Assignee`
  - _Expected_: the checkbox renders as selected
- Check `Issues`
  - _Expected_: the checkbox renders as selected
- Check `Environments`
  - _Expected_: the checkbox renders as selected
- Click `Copy`
  - _Expected_: the dialog closes and a new group appears on the Runs list
- Open the new copy and observe its contents
  - _Expected_:
  - Child runs carry the source assignee
  - Linked issues from the source are attached to the copy
  - Labels from the source are present on the copy (default on)
  - Environment value(s) from the source are carried onto the copy's runs
  - Nested run structure is carried (default on)

<!-- test
type: manual
priority: normal
source: ac-delta-15
automation: candidate
-->
## Cancel Copy RunGroup dialog does not create a new group @negative

Verifies the Cancel affordance on the Copy dialog abandons the copy and does not produce any side effect.

## Preconditions
- Signed in as a user with access to a project
- A RunGroup named `run-groups copy-cancel-source` exists
- The Runs page shows the group

## Steps
- Note the current number of RunGroups visible on the Runs list
  - _Expected_: a baseline group count is observable
- Open the Copy dialog from the group's extra menu
  - _Expected_: the dialog opens with the heading `Choose copy settings`
- Toggle `Assignee` on and `Nested structure` off
  - _Expected_: the checkbox states update accordingly
- Click `Cancel`
  - _Expected_: the dialog closes
- Observe the Runs list
  - _Expected_:
  - The group count matches the baseline noted before opening the dialog
  - No new group with a copy-like name appears
  - `run-groups copy-cancel-source` is unchanged
