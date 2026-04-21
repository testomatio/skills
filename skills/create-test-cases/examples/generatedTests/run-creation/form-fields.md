<!-- suite -->
# Form Fields and Defaults

Title, Description, Assign-to presence, toggles, and RunGroup dropdown behaviour inside the New Manual Run sidebar.

<!-- test
type: manual
priority: low
source: AC-7, ac-delta-3
automation: candidate
-->
## Title input enforces the 255-character maximum @boundary

The Title input has a hard HTML `maxlength` of 255 characters. Input beyond the limit must be silently truncated or rejected.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Paste a 255-character string into the Title input
  - _Expected_: Title input shows the full 255-character value without truncation
- Append additional characters (attempt to type 10 more characters)
  - _Expected_:
  - Title input content remains 255 characters long
  - Extra characters are silently dropped (or rejected) by the browser
  - No error toast is shown for this truncation
- Click the 'Save' button
  - _Expected_:
  - Run is created with the 255-character title
  - Success toast "Run has been created" is shown
  - Run appears in the Runs list with the full 255-character title visible in the row

<!-- test
type: manual
priority: high
source: AC-7, ac-delta-4
automation: candidate
-->
## Blank title auto-generates a default title on Launch

When the Title is left blank, the system provides an auto-generated default title so the run is never saved unnamed.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens with an empty Title input and placeholder "Title (optional)"
- Leave the Title input empty
  - _Expected_: Title input is empty with placeholder "Title (optional)" visible
- Confirm the scope remains at "All tests"
  - _Expected_: "All tests" tab is active (default)
- Click the 'Launch' button
  - _Expected_:
  - Success toast "Run has been started" is shown
  - Manual Runner opens at `/runs/launch/{id}/`
  - Runner header displays an auto-generated run title (non-empty, e.g. based on scope, timestamp, or a sequential index)
- Navigate back to the 'Runs' page
  - _Expected_: The newly-launched run appears in the list with the auto-generated title visible (no "Untitled" placeholder, no empty row)

<!-- test
type: manual
priority: normal
source: AC-7, ac-delta-13
automation: candidate
-->
## Whitespace-only description is stored as blank @negative

Description accepts free text but whitespace-only input must not count as meaningful description.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Fill the Title with "Whitespace description test"
  - _Expected_: Title shows the value
- Fill the Description textarea with 10 space characters only
  - _Expected_: Description shows a visible block of spaces
- Click the 'Save' button
  - _Expected_:
  - Success toast "Run has been created" is shown
  - Run appears in the Runs list
- Open the run detail panel (click the run row)
  - _Expected_: Description area is shown as empty (or explicitly "No description") — whitespace-only input did not populate a visible description

<!-- test
type: manual
priority: normal
source: AC-7, AC-96, ac-delta-14
automation: candidate
-->
## "Run as checklist" toggle is OFF by default and can be enabled

The toggle lives in the creation sidebar; its default is OFF, and enabling it stores the preference on the created run.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens; "Run as checklist" switch is rendered in the OFF state
- Click the "Run as checklist" switch
  - _Expected_: Switch transitions to the ON state with visible state change
- Fill the Title with "Checklist toggle default"
  - _Expected_: Title input shows the value
- Click 'Save'
  - _Expected_:
  - Success toast "Run has been created" is shown
  - Run appears in the Runs list
- Open the Runs list and click the row to open the run detail panel; re-open creation sidebar for a new run to confirm default
  - _Expected_:
  - Opening a new creation sidebar again shows "Run as checklist" in the OFF state (default is not persisted across new sessions)

<!-- test
type: manual
priority: normal
source: AC-10, ac-delta-15
automation: candidate
-->
## "Run Automated as Manual" toggle is actionable only in Select tests tab @negative

This toggle influences automated-test inclusion; it is only meaningful when the user is manually picking a subset in the Select tests tab.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens with "All tests" scope selected by default
- Observe the "Run Automated as Manual" switch while the "All tests" scope is active
  - _Expected_: Switch is either hidden or rendered disabled/greyed-out; clicking it has no effect
- Click the 'Test plan' scope tab
  - _Expected_: "Run Automated as Manual" switch remains hidden or disabled
- Click the 'Without tests' scope tab
  - _Expected_: "Run Automated as Manual" switch remains hidden or disabled
- Click the 'Select tests' scope tab
  - _Expected_:
  - "Run Automated as Manual" switch becomes visible and actionable (OFF by default)
- Toggle "Run Automated as Manual" ON
  - _Expected_: Switch transitions to the ON state; automated tests become selectable in the tree

<!-- test
type: manual
priority: normal
source: AC-37, ac-delta-5
automation: candidate
-->
## Assignee section shows the creator with "as manager" label by default

Only the creator is assigned on initial open; additional testers are added via the "Assign more users" link (owned by tester-assignment sub-feature; this test only verifies the creation-side default).

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Inspect the Assignee section at the top of the sidebar
  - _Expected_:
  - A single user chip shows the current user's avatar and username
  - The chip carries an "as manager" label
  - A "Assign more users" link is visible below the chip
- Fill the Title with "Default assignee test"
  - _Expected_: Title input shows the value
- Click 'Launch'
  - _Expected_:
  - Manual Runner opens
  - Run is created with the creator listed as the sole assignee (visible in the Run detail → Assigned to field)

<!-- test
type: manual
priority: normal
source: AC-7, ac-delta-6
automation: candidate
-->
## RunGroup dropdown lists "Without rungroup" plus existing named groups

The RunGroup selector must always offer a null option ("Without rungroup") in addition to any existing groups, so runs can explicitly be created outside of a group.

## Preconditions

- At least one named RunGroup already exists in the project (created via the arrow-dropdown → New Group flow, or present as fixture data).

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Select RunGroup' button
  - _Expected_:
  - Dropdown opens below the button
  - First option is "Without rungroup"
  - Subsequent options list each existing named group
- Select "Without rungroup"
  - _Expected_: RunGroup selector shows "Without rungroup" as the chosen value
- Fill the Title with "RunGroup = none test"
  - _Expected_: Title input shows the value
- Click 'Save'
  - _Expected_:
  - Success toast "Run has been created" is shown
  - Run appears in the Runs list with no group chip / group column empty

<!-- test
type: manual
priority: low
source: AC-7, ac-delta-3
automation: candidate
-->
## Title input accepts a single character as the minimum valid input @boundary

The minimum-length boundary must be testable — one character is the smallest non-empty title.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Type exactly one character into the Title input (e.g. the letter "A")
  - _Expected_: Title input shows exactly "A"
- Click the 'Save' button
  - _Expected_:
  - Success toast "Run has been created" is shown
  - Sidebar closes
- Navigate to the Runs list
  - _Expected_: A run titled "A" is present in the list — the single-character title is accepted and rendered verbatim

<!-- test
type: manual
priority: normal
source: AC-7, ac-delta-4
automation: candidate
-->
## Title with only whitespace characters is treated as blank @negative

Whitespace-only titles must not bypass the blank-title handling (auto-generation).

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Fill the Title input with a string of 5 space characters
  - _Expected_: Title input shows the whitespace (cursor after spaces)
- Click the 'Launch' button
  - _Expected_:
  - Success toast "Run has been started" is shown
  - Manual Runner opens
  - Runner header displays an auto-generated run title (NOT just whitespace) — the whitespace-only title was treated as blank
- Navigate back to the Runs list
  - _Expected_: The new run appears with a non-empty, non-whitespace auto-generated title

<!-- test
type: manual
priority: low
source: AC-7, ac-delta-13
automation: candidate
-->
## Description accepts very large content without enforced limit @boundary

Per ac-delta-13 the Description has no enforced character limit; a very-large payload must be stored intact.

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Fill the Title with "Large description test"
  - _Expected_: Title input shows the value
- Paste a 10 000-character paragraph into the Description textarea
  - _Expected_: Description textarea shows the full paragraph; no truncation warning; scrollbar appears if needed
- Click the 'Save' button
  - _Expected_:
  - Success toast "Run has been created" is shown (no 413-style error)
  - Sidebar closes
- Open the newly-created run's detail panel
  - _Expected_: Description shown on the run stores the full 10 000-character content (spot-check head and tail substrings)

<!-- test
type: manual
priority: normal
source: AC-7, ac-delta-6
automation: deferred
automation-note: requires a fresh/empty project fixture with zero existing RunGroups
-->
## RunGroup dropdown shows only "Without rungroup" when no groups exist in the project @negative

Empty-state behaviour of the RunGroup selector must still be functional — the null option is always available even when no named groups exist.

## Preconditions

- The project has zero existing RunGroups (fresh project or all groups archived).

## Steps

- Navigate to the 'Runs' page and click the 'Manual Run' button
  - _Expected_: New Manual Run sidebar opens
- Click the 'Select RunGroup' button
  - _Expected_:
  - Dropdown opens below the button
  - Only one option is listed: "Without rungroup"
  - No named groups appear
- Select "Without rungroup"
  - _Expected_: RunGroup selector shows "Without rungroup" as the chosen value
- Fill the Title with "Empty-project run" and click 'Save'
  - _Expected_:
  - Success toast "Run has been created" is shown
  - Run appears in the Runs list without any group association
