<!-- suite -->
# Retention Settings — Purge Old Runs

Covers the `Purge Old Runs` retention input in Project Settings — configuration, validation, the default retention, and the daily automatic-purge contract. Does NOT cover manual Purge actions (owned by `run-actions.md`), the Runs Archive browsing (owned by `archive-pages.md`), or the broader Project Settings page (outside this sub-feature).

<!-- test
type: manual
priority: high
source: AC-79, ac-delta-8
automation: candidate
-->
## Configure retention to a positive number of days persists across reloads @smoke

Sets `Purge Old Runs` retention to 30 days, saves, and verifies the value is persisted.

## Preconditions
- Signed in as a user with `Manager` or `Owner` role
- The Project Settings page is accessible
- The `Purge Old Runs` retention input is currently empty or at a different value

## Steps
- Navigate to `Settings` → `Project`
  - _Expected_: the Project Settings page loads and a `Purge Old Runs` section is visible with a retention input (type number) and a `Save` button
- Clear the retention input and type `30`
  - _Expected_: the input shows `30`
- Click `Save`
  - _Expected_:
  - A success toast is shown indicating settings saved
  - The retention input still shows `30`
- Reload the page
  - _Expected_: the retention input still shows `30` — the value is persisted on the server

<!-- test
type: manual
priority: high
source: ac-delta-9
automation: candidate
-->
## Retention input rejects ${invalid_value} @negative

Verifies invalid inputs do not persist and surface validation feedback.

## Preconditions
- Signed in as a user with `Manager` role
- The Project Settings page is open with the `Purge Old Runs` input visible
- The current saved retention value is `30`

## Steps
- Clear the retention input
  - _Expected_: the input becomes empty
- Type `${invalid_value}` into the retention input
  - _Expected_:
  - The input either rejects the characters (for non-numeric) OR accepts and marks the value as invalid (for negative / zero)
- Click `Save`
  - _Expected_:
  - No success toast is shown indicating a successful save of `${invalid_value}`
  - Either a validation message appears OR the request is rejected with an error toast
- Reload the page
  - _Expected_: the previously-saved retention value (`30`) is still shown — the invalid attempt did not overwrite it

<!-- example -->
| invalid_value |
|---|
| abc |
| -5 |
| 0 |

<!-- test
type: manual
priority: normal
source: AC-79, ac-delta-9
automation: candidate
-->
## Default retention is 90 days when the project has no saved value

Verifies that an unset retention defaults to 90 days, per the inline help text `"90 days by default"`.

## Preconditions
- Signed in as a user with `Owner` role on a project that has NO `Purge Old Runs` value saved
- The Project Settings page is accessible

## Steps
- Navigate to `Settings` → `Project`
  - _Expected_: the `Purge Old Runs` section is visible
- Observe the retention input and surrounding help text
  - _Expected_:
  - The retention input shows placeholder text `"Purge Old Runs"` or an empty value
  - The help text reads `"How many days to keep runs. Old runs will be automatically purged on daily basis."`
  - The help text also shows `"90 days by default."` — confirming the implicit default
- Observe the Runs Archive behavior for runs older than 90 days
  - _Expected_: runs whose `Finished at` timestamp is older than 90 days eventually appear in the Runs Archive with a `purged` badge (no manual action required)

<!-- test
type: manual
priority: low
source: AC-79
automation: manual-only
automation-note: the automatic-purge job runs on a daily cadence server-side; simulating time passing or waiting 24 h is not feasible for an automated UI test.
-->
## Automatic purge runs on a daily cadence after the retention period @unclear

Verifies that a configured retention triggers server-side purge on a daily schedule — runs older than the retention threshold are auto-purged without manual action. Marked `@unclear` because the exact trigger time and scheduling window cannot be observed directly from the UI.

## Preconditions
- Signed in as a user with `Owner` role
- `Purge Old Runs` retention is saved as `1` (1 day)
- At least one finished run (`auto-purge-src`) has a `Finished at` timestamp older than 1 day

## Steps
- Navigate to the active `Runs` page and verify `auto-purge-src` is NOT on the active list
  - _Expected_: `auto-purge-src` is absent; its retention window has elapsed
- Navigate to the `Runs Archive` page
  - _Expected_:
  - `auto-purge-src` is visible in the Runs Archive list
  - A `purged` badge is shown on the row
  - The run was moved without any user-initiated purge action
- Open `auto-purge-src` detail
  - _Expected_: recorded test statuses and artifacts remain (per AC-79 contract — purge preserves statuses, removes stack traces)

<!-- test
type: manual
priority: low
source: ac-delta-9
automation: candidate
-->
## Configure retention at boundary value ${boundary_value} persists @boundary

Covers the lower and upper reasonable boundaries of the retention input.

## Preconditions
- Signed in as a user with `Manager` role
- The Project Settings page is open with the `Purge Old Runs` input visible

## Steps
- Clear the retention input and type `${boundary_value}`
  - _Expected_: the input shows `${boundary_value}`
- Click `Save`
  - _Expected_:
  - A success toast is shown
  - The retention input still shows `${boundary_value}`
- Reload the page
  - _Expected_: the retention input still shows `${boundary_value}`

<!-- example -->
| boundary_value |
|---|
| 1 |
| 365 |
