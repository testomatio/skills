<!-- suite -->
# Role-gated Destructive Actions

Covers permission gating on Archive, Purge, Unarchive, and Permanent Delete — read-only users cannot perform any of them; Manager / Owner can. Does NOT cover the full project permission matrix (owned by project-level roles configuration) or permissions on non-destructive archive actions such as viewing. The scope resolves the AC-100 unclear for the four destructive operations.

<!-- test
type: manual
priority: critical
source: AC-100, ac-delta-20
automation: candidate
-->
## Read-only user cannot ${destructive_action} @negative

Verifies each destructive action is hidden or disabled for a read-only user — neither the trigger nor the API call must succeed.

## Preconditions
- Signed in as a user with `Read-only` role on the project
- The Runs list contains a finished run named `perm-ro-source`
- The Runs Archive contains a purged run named `perm-ro-archive-source`

## Steps
- Navigate to the `${navigation_target}`
  - _Expected_: the page loads for the read-only user (viewing is allowed)
- Open the row extra menu on `${target_row}`
  - _Expected_: the `${destructive_action}` item is either:
  - NOT present in the menu, or
  - Present but disabled / non-interactive, or
  - Present but clicking produces a permission error and no state change
- If the action item is present and clickable, click `${destructive_action}`
  - _Expected_:
  - Either a permission-denied error toast appears, or
  - A confirmation dialog opens; on `Confirm` the server rejects with an error and the row remains unchanged

<!-- example -->
| destructive_action | navigation_target | target_row |
|---|---|---|
| Move to Archive | Runs page | perm-ro-source |
| Purge | Runs page | perm-ro-source |
| Unarchive | Runs Archive page | perm-ro-archive-source |
| Delete | Runs Archive page | perm-ro-archive-source |

<!-- test
type: manual
priority: high
source: AC-100, ac-delta-20
automation: candidate
-->
## Manager can perform ${destructive_action} on a run

Mirror of the read-only check — confirms the same actions are available and succeed for a `Manager` user.

## Preconditions
- Signed in as a user with `Manager` role
- The Runs list contains a finished run named `perm-mgr-source`
- The Runs Archive contains a purged run named `perm-mgr-archive-source`

## Steps
- Navigate to the `${navigation_target}`
  - _Expected_: the page loads and shows `${target_row}`
- Open the row extra menu on `${target_row}`
  - _Expected_: the `${destructive_action}` item is present and enabled
- Click `${destructive_action}`
  - _Expected_: the matching confirmation dialog opens (archive / purge / unarchive / delete wording per action)
- Click the primary confirm button in the dialog
  - _Expected_:
  - The dialog closes
  - The action completes successfully (toast or list-state change consistent with the action)
  - `${target_row}` either leaves the page (for all four actions) or moves to the destination list

<!-- example -->
| destructive_action | navigation_target | target_row |
|---|---|---|
| Move to Archive | Runs page | perm-mgr-source |
| Purge | Runs page | perm-mgr-source |
| Unarchive | Runs Archive page | perm-mgr-archive-source |
| Delete | Runs Archive page | perm-mgr-archive-source |

<!-- test
type: manual
priority: normal
source: AC-100, ac-delta-20
automation: candidate
-->
## Read-only user can browse Runs Archive and Groups Archive pages

Verifies that the read-only role is NOT locked out of the archive surfaces — viewing archived data is permitted even though destructive actions are blocked.

## Preconditions
- Signed in as a user with `Read-only` role on the project
- Both archives contain at least one archived item (Runs Archive has `ro-view-run`, Groups Archive has `ro-view-group`)

## Steps
- Navigate to the `Runs Archive` page
  - _Expected_:
  - The page loads without permission errors
  - `ro-view-run` is visible with its archive-state indicator
  - The search input and filter tabs are present and usable
- Use the Runs Archive search box to search for `ro-view-run`
  - _Expected_: the list filters to show only `ro-view-run`
- Navigate to the `Groups Archive` page
  - _Expected_:
  - The page loads without permission errors
  - `ro-view-group` is visible with an `archived` badge
  - The Sort dropdown is usable
