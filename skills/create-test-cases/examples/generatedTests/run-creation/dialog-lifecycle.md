<!-- suite -->
# Dialog Lifecycle

Opening, dismissing, and the split-button / arrow-dropdown behaviour of the New Manual Run entry point on the Runs page.

<!-- test
type: manual
priority: critical
source: AC-1, AC-7, ac-delta-1
automation: candidate
-->
## Open New Manual Run sidebar and verify form chrome renders @smoke

A QA user with creator permissions can open the New Manual Run sidebar from the Runs page and see all expected sections of the form.

## Steps

- Navigate to the 'Runs' page
  - _Expected_: Runs list is displayed; 'Manual Run' primary button is visible in the toolbar
- Click the 'Manual Run' button (left part of the split button)
  - _Expected_:
  - Right-side sidebar opens with the heading "New Manual Run"
  - URL becomes `/projects/{project}/runs/new`
  - Badge "manual" is shown next to the heading
- Inspect the sidebar content
  - _Expected_:
  - Assignee section shows the current user with an "as manager" label and an "Assign more users" link
  - Title input is visible with placeholder "Title (optional)"
  - RunGroup selector shows "Select RunGroup"
  - Environment selector shows placeholder "Set environment for execution"
  - Description textarea is visible
  - "Run as checklist" toggle is visible and OFF
  - Scope tabs visible in order: "All tests", "Test plan", "Select tests", "Without tests" — with "All tests" selected by default
  - "Run Automated as Manual" toggle is visible and OFF
  - Action buttons visible: "Launch", "Save", "Cancel"
- Click the 'Cancel' button
  - _Expected_: Sidebar closes; URL returns to `/projects/{project}/runs/`; no new run appears in the list

<!-- test
type: manual
priority: normal
source: ac-delta-2
automation: candidate
-->
## Dismiss the New Manual Run sidebar via ${dismiss_method} restores runs list

Dismiss paths must discard unsaved input without creating a run.

## Steps

- Navigate to the 'Runs' page
  - _Expected_: Runs list is displayed
- Click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens; URL becomes `/runs/new`
- Type "Temporary draft" into the Title input
  - _Expected_: Title input shows the typed value
- Dismiss the sidebar via ${dismiss_method}
  - _Expected_:
  - Sidebar closes
  - URL returns to `/projects/{project}/runs/`
  - No toast indicates run creation
  - Re-opening the sidebar shows an empty Title input (the discarded draft is not restored)
- Verify the Runs list
  - _Expected_: Run count is unchanged; no new "Temporary draft" run is present

<!-- example -->

| dismiss_method |
| --- |
| the 'Cancel' button |
| the close (×) button in the sidebar header |
| the Back-arrow button in the sidebar header |

<!-- test
type: manual
priority: normal
source: AC-13, AC-15, AC-17, AC-18, ac-delta-1
automation: candidate
-->
## Arrow-dropdown item ${menu_item} opens ${target} without opening the creation sidebar

The chevron next to the 'Manual Run' split button exposes launcher variants. Selecting an item must navigate to its own target without opening the regular New Manual Run sidebar.

## Steps

- Navigate to the 'Runs' page
  - _Expected_: 'Manual Run' split button is visible with a chevron on its right side
- Click the chevron dropdown next to the 'Manual Run' button
  - _Expected_:
  - Dropdown menu opens below the button
  - Menu lists: "New Group", "Mixed Run", "Launch from CLI", "Report Automated Tests"
  - The New Manual Run sidebar remains closed
- Click the '${menu_item}' menu item
  - _Expected_:
  - ${target} opens
  - The New Manual Run sidebar is NOT opened
  - URL reflects the new target (not `/runs/new`)
- Dismiss the opened target
  - _Expected_: User returns to the Runs list; no new run has been created

<!-- example -->

| menu_item | target |
| --- | --- |
| New Group | the New Group dialog |
| Mixed Run | the Mixed Run launcher (with CI Profile / CLI options) |
| Launch from CLI | the "Launch from CLI" helper dialog |
| Report Automated Tests | the Report Automated Tests helper |

<!-- test
type: manual
priority: high
source: AC-1, ac-delta-1
automation: candidate
-->
## Clicking the Manual Run split-button left part navigates to the creation URL

The split-button has two halves — the left part opens the creation sidebar and the right chevron opens the launcher menu. They must not overlap in behaviour.

## Steps

- Navigate to the 'Runs' page
  - _Expected_: 'Manual Run' split button is visible with a chevron on its right side
- Click the 'Manual Run' button on its LEFT part (the primary label)
  - _Expected_:
  - New Manual Run sidebar opens
  - URL becomes `/projects/{project}/runs/new`
  - Chevron dropdown does NOT open
- Close the sidebar via the 'Cancel' button
  - _Expected_: Sidebar closes; URL returns to `/runs/`
- Click the chevron dropdown on the RIGHT part of the split button
  - _Expected_:
  - Dropdown menu opens
  - The sidebar does NOT open
  - URL remains `/runs/`

<!-- test
type: manual
priority: normal
source: ac-delta-2
automation: candidate
-->
## Pressing ESC key closes the sidebar without creating a run @negative

ESC is a standard dismiss affordance on modal drawers; it must behave like Cancel.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens; URL becomes `/runs/new`
- Fill the Title with "ESC dismiss draft"
  - _Expected_: Title input shows the typed value
- Click outside the Title input to remove focus, then press the ESC key
  - _Expected_:
  - Sidebar closes
  - URL returns to `/projects/{project}/runs`
  - No success toast is shown
- Inspect the Runs list
  - _Expected_: No "ESC dismiss draft" run appears in the list (no run was created)

<!-- test
type: manual
priority: normal
source: AC-13, ac-delta-1
automation: candidate
-->
## Arrow-dropdown closes on outside click without selecting any item @negative

Clicking outside the opened arrow-dropdown must dismiss the menu without navigating or opening the creation sidebar.

## Steps

- Navigate to the 'Runs' page
  - _Expected_: 'Manual Run' split button is visible with a chevron on its right side
- Click the chevron dropdown next to the 'Manual Run' button
  - _Expected_: Dropdown menu opens with four items visible
- Click an empty area of the Runs list outside both the dropdown and the split button
  - _Expected_:
  - Dropdown menu closes
  - New Manual Run sidebar does NOT open
  - URL remains `/projects/{project}/runs/`
- Re-open the dropdown by clicking the chevron again
  - _Expected_: Dropdown re-opens fresh with no prior selection state persisted
