<!-- suite -->
# Creation Dialog Assignment

The Assignee section of the New Manual Run sidebar — the creator-as-manager default, the "Assign more users" panel, and how uncommitted assignee edits behave when the sidebar is dismissed before Launch. Strategy selection UX is owned by the sibling suite `auto-assign-strategies`; this section only covers the multi-select and chip affordances on creation.

<!-- test
type: manual
priority: critical
source: AC-37, ac-delta-1, ac-delta-2
automation: candidate
-->
## Opening the New Manual Run sidebar shows the creator as manager with the Assign more users entry point @smoke

Opening the New Manual Run sidebar always shows the current user pre-assigned with an "as manager" label and the "Assign more users" link that expands the Assignee panel.

## Steps

- Navigate to the 'Runs' page
  - _Expected_: Runs list is displayed; 'Manual Run' primary button is visible in the toolbar
- Click the 'Manual Run' button
  - _Expected_:
  - Right-side sidebar opens with heading "New Manual Run"
  - URL becomes `/projects/{project}/runs/new`
- Inspect the Assignee section at the top of the sidebar
  - _Expected_:
  - Current user chip is rendered with the avatar + username
  - "as manager" label is shown inline next to the chip
  - No "×" remove control is visible on the creator chip
  - "Assign more users" link is visible directly below the chip
- Click the 'Assign more users' link
  - _Expected_:
  - Assignee panel expands inline below the creator chip
  - "Assign Users" multi-select trigger becomes visible (with placeholder indicating users can be added)
  - No "Auto-Assign: none" button is visible yet (it is revealed only after the first user is added)

<!-- test
type: manual
priority: high
source: AC-38, ac-delta-2, ac-delta-3, ac-delta-12
automation: candidate
-->
## Adding the first user reveals Auto-Assign selector and propagates the assignee on Launch @smoke

Adding one non-manager user to the Assign users multi-select must reveal the Auto-Assign strategy button and, after Launch, the resulting run must show both the manager and the added user in the Runs list "Assigned to" column.

## Preconditions

- At least two users are members of the project: the current user (manager role) and one non-manager user (e.g., qa role)

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens; creator chip shows "as manager"
- Click the 'Assign more users' link
  - _Expected_: Assignee panel expands with the "Assign Users" multi-select trigger visible
- Click the 'Assign Users' multi-select trigger and select one non-manager project member from the dropdown
  - _Expected_:
  - Selected user's chip appears inside the multi-select trigger
  - Each chip exposes a "×" remove control
  - A button labelled "Auto-Assign: none" becomes visible below the multi-select (it was NOT visible before the first user was added)
- Click the 'Launch' button
  - _Expected_:
  - Toast "Run has been started" is displayed
  - Page navigates to `/projects/{project}/runs/launch/{id}/`
- Navigate back to the 'Runs' page
  - _Expected_:
  - New run appears at the top of the list
  - "Assigned to" column for that row shows an avatar stack with both the manager chip and the newly added user's chip, each with a tooltip showing their username

<!-- test
type: manual
priority: normal
source: AC-38, ac-delta-2
automation: candidate
-->
## Add a user via ${add_method} to the Assign users multi-select

The multi-select must accept additions through both direct option click and type-to-filter keyboard selection so assignees can be added efficiently regardless of project-member list size.

## Preconditions

- Project has at least three non-manager members

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Assign more users' link
  - _Expected_: Assignee panel expands
- Open the 'Assign users' multi-select via ${add_method}
  - _Expected_:
  - Project member dropdown opens
  - Expected member appears in the options list (or is matched by the typed query, if applicable)
- Select the expected member from the list
  - _Expected_:
  - Chip for the selected member is inserted into the multi-select trigger
  - Dropdown remains open for additional selection (does not auto-dismiss)
  - "Auto-Assign: none" button appears below the multi-select once the chip is present

<!-- example -->

| add_method |
| --- |
| clicking the trigger and picking an option from the list |
| typing part of the username to filter the list then clicking the matching option |

<!-- test
type: manual
priority: normal
source: ac-delta-2, ac-delta-12
automation: candidate
-->
## Remove an added user via the chip × before Launch keeps them off the new run @negative

A user removed from the multi-select before Launch must not be attached to the resulting run, even though the chip was briefly present.

## Preconditions

- Project has at least one non-manager member available to add

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Assign more users' link and add one non-manager user to the 'Assign users' multi-select
  - _Expected_: User chip appears in the trigger; "Auto-Assign: none" button is visible
- Click the "×" remove control on the user chip
  - _Expected_:
  - Chip is removed from the multi-select trigger immediately
  - No toast is shown (changes are unsaved until Launch)
  - "Auto-Assign: none" button disappears because the multi-select is now empty again
- Click the 'Launch' button
  - _Expected_:
  - Toast "Run has been started" is displayed
  - Runner opens
- Navigate back to the 'Runs' page
  - _Expected_:
  - The new run's "Assigned to" column shows ONLY the manager chip
  - The removed user is NOT present on that row

<!-- test
type: manual
priority: normal
source: ac-delta-2, ac-delta-3
automation: candidate
-->
## Dismiss the sidebar via ${dismiss_method} after editing assignees discards the pending state @negative

Dismiss paths must drop any unsaved assignee and strategy selections without creating a run.

## Preconditions

- Project has at least one non-manager member available to add

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Assign more users' link
  - _Expected_: Assignee panel expands
- Add one non-manager user to the 'Assign users' multi-select
  - _Expected_: User chip appears; "Auto-Assign: none" button is visible
- Click the "Auto-Assign: none" button and choose "Randomly distribute tests between team members"
  - _Expected_: Button label updates to "Auto-Assign: randomly"
- Dismiss the sidebar via ${dismiss_method}
  - _Expected_:
  - Sidebar closes
  - URL returns to `/projects/{project}/runs/`
  - No "Run has been started" or "Run has been created" toast appears
  - No new run is added to the Runs list
- Re-open the sidebar by clicking the 'Manual Run' button
  - _Expected_:
  - Creator chip shows "as manager"
  - "Assign users" multi-select is empty (previously added user is NOT restored)
  - "Auto-Assign: none" button is NOT visible (because the multi-select is empty)

<!-- example -->

| dismiss_method |
| --- |
| the 'Cancel' button |
| the close (×) button in the sidebar header |
| the Back-arrow button in the sidebar header |

<!-- test
type: manual
priority: low
source: AC-37, ac-delta-1
automation: candidate
-->
## Creator manager chip has no remove control and cannot be cleared from the sidebar @negative

The creator chip is structural, not a regular assignee — it lives outside the Assign users multi-select and must not expose a remove affordance during creation.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Inspect the creator chip in the Assignee section
  - _Expected_:
  - Chip shows the current user's avatar + username + "as manager" label
  - No "×" remove control is rendered on the chip
- Click the 'Assign more users' link and inspect the creator chip again after the panel expands
  - _Expected_:
  - Creator chip is still rendered above the "Assign users" multi-select
  - Creator chip is NOT duplicated inside the multi-select trigger
  - No remove control is rendered on the creator chip even after panel expansion
