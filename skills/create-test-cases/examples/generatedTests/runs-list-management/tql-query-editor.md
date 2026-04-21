<!-- suite -->
# TQL Query Editor

Covers the Query Language Editor modal and its effect on the Runs list: the Apply / Save / Cancel buttons, Saved Queries and Examples tabs, the Operators and Variables sidebars, autocomplete, invalid query feedback, URL reflection of applied filters, and the `Reset` affordance. Cross-cutting concern E (Custom statuses) is exercised via the `has_custom_status` variable in this suite; concern C (RunGroup membership) filter tests live in the Cross-cutting suite.

<!-- test
type: manual
priority: high
source: AC-72, ac-delta-15
automation: candidate
-->
## Query Language Editor opens with Apply always enabled and Cancel always enabled @smoke

Verifies the editor modal's baseline button state on open — Apply and Cancel are clickable without any typed query; Save is disabled until a non-empty query is present.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open with no TQL filter applied

## Steps
- Click the `Query Language Editor` icon button in the Runs list toolbar
  - _Expected_: the `Runs Query Editor` modal opens with the query editor empty
- Observe the `Apply` button
  - _Expected_: the `Apply` button is enabled
- Observe the `Cancel` button
  - _Expected_: the `Cancel` button is enabled
- Observe the `Save` button with the editor still empty
  - _Expected_: the `Save` button is disabled

<!-- test
type: manual
priority: normal
source: AC-72, ac-delta-15
automation: candidate
-->
## Save button remains disabled until a non-empty query is typed @unclear

Captures the observed Save enablement behavior in the editor — Save activates only after at least one non-whitespace character is entered. Exact final-state UX for Save (named-query save vs. Apply + Save) is to be confirmed with product.

## Preconditions
- Signed in as a user with access to a project
- The Runs Query Editor modal is open with the query editor empty

## Steps
- Observe the editor area
  - _Expected_: the editor is empty and the `Save` button is disabled
- Type the query `failed` into the editor
  - _Expected_: the editor shows the entered text
- Observe the `Save` button
  - _Expected_: the `Save` button becomes interactive (enablement semantics for a named query save to be confirmed with product)
- Clear the editor so no characters remain
  - _Expected_: the `Save` button returns to the disabled state

<!-- test
type: manual
priority: critical
source: AC-72, AC-73, ac-delta-16
automation: candidate
-->
## Applying a valid query filters the list and reflects the filter in the URL @smoke

Verifies the happy-path Apply — a valid TQL query closes the modal, filters the Runs list, and encodes the filter as `filterParam` in the URL so it is shareable.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open with no filter active
- At least one run exists that matches the query `failed`
- At least one run exists that does NOT match the query

## Steps
- Open the Query Language Editor modal
  - _Expected_: the editor opens empty
- Enter the query `failed` in the editor and click `Apply`
  - _Expected_:
  - The modal closes
  - The Runs list shows only runs with a failed status
  - The page URL includes a `filterParam=` query parameter with the encoded query
- Observe the filter-active indicator above the list
  - _Expected_:
  - A `"{N} runs found"` counter is visible
  - A `Reset` button is visible
- Click `Reset`
  - _Expected_:
  - The filter is cleared
  - The page URL returns to `/runs` (no `filterParam`)
  - The full Runs list is restored

<!-- test
type: manual
priority: high
source: AC-72, ac-delta-16
automation: candidate
-->
## Invalid query surfaces an error without filtering the list @negative

Verifies that an unparseable TQL query is rejected by the editor — the list is not filtered and the editor exposes a feedback state for the user.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open with no filter active

## Steps
- Open the Query Language Editor modal
  - _Expected_: the editor opens empty with `Apply` enabled
- Enter the malformed query `failed ===` in the editor
  - _Expected_: the editor shows the typed text
- Click `Apply`
  - _Expected_:
  - The modal does NOT silently close and filter the list on a broken query
  - An error surface appears in the editor indicating the query is invalid (exact wording to be confirmed with product)
- Dismiss the modal and observe the Runs list
  - _Expected_:
  - No filter-active indicator is shown
  - The Runs list is unchanged from its unfiltered state
  - The URL contains no `filterParam`

<!-- test
type: manual
priority: normal
source: AC-72, ac-delta-15
automation: candidate
-->
## Examples tab lists three preset queries that can be inserted into the editor

Verifies the Examples (3) tab exposes the documented preset queries and clicking a preset populates the editor.

## Preconditions
- Signed in as a user with access to a project
- The Query Language Editor modal is open

## Steps
- Click the `Examples (3)` tab
  - _Expected_:
  - The tab content lists three example queries
  - One of them is `has_suite == 'bcaf11af' and has_message == 'Blocked'`
  - One of them uses `finished_at == today()` with a label expression
  - One of them uses `plan % 'release'` with a `jira` and `priority` expression
- Click one of the example entries
  - _Expected_: the chosen example text is inserted into the editor

<!-- test
type: manual
priority: low
source: AC-72, ac-delta-15
automation: candidate
-->
## Operators and Variables sidebars expose the documented TQL vocabulary

Confirms the sidebar reference lists — Operators (logical, comparison, inclusion) and Variables (run/test/custom-status attributes) — match the documented TQL surface.

## Preconditions
- Signed in as a user with access to a project
- The Query Language Editor modal is open

## Steps
- Observe the Operators sidebar
  - _Expected_: the list includes `and`, `or`, `not`, `==`, `!=`, `<`, `>`, `>=`, `<=`, `in [...]`, and `%`
- Observe the Variables sidebar
  - _Expected_:
  - The list includes core run attributes such as `title`, `plan`, `rungroup`, `env`, `label`, `jira`
  - The list includes count variables `passed_count`, `failed_count`, `skipped_count`
  - The list includes state flags `automated`, `manual`, `mixed`, `finished`, `unfinished`, `archived`, `unarchived`
  - The list includes `has_custom_status`, `has_test_label`, `has_assigned_to`, `has_retries`
- Click the `has_custom_status` variable
  - _Expected_: the variable name is inserted into the editor at the cursor position

<!-- test
type: manual
priority: normal
source: AC-72, ac-delta-16
automation: candidate
-->
## Applying a TQL query with no matching runs surfaces a zero-result state @negative

Verifies that a syntactically valid TQL query that yields zero matches presents an explicit empty state rather than rendering the full unfiltered list.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open with no filter active
- A TQL query that is guaranteed to match zero runs exists (for example `title == 'NonexistentRunTitle-xyz-zero-match'`)

## Steps
- Open the Query Language Editor modal
  - _Expected_: the editor opens empty
- Enter the zero-match query in the editor and click `Apply`
  - _Expected_:
  - The modal closes
  - The Runs list shows no run rows
  - A `"0 runs found"` indicator is visible above the list
  - A `Reset` button is visible
  - The URL contains a `filterParam=` parameter encoding the query
- Click `Reset`
  - _Expected_:
  - The filter is cleared
  - The URL returns to `/runs`
  - The full Runs list is restored

<!-- test
type: manual
priority: normal
source: AC-72, ac-delta-15
automation: candidate
-->
## Cancelling the Query Language Editor discards the typed query @negative

Verifies that dismissing the editor via `Cancel` does not apply the typed query and does not affect the current list.

## Preconditions
- Signed in as a user with access to a project
- The Runs page is open with no filter active

## Steps
- Note the current number of rows visible in the Runs list
  - _Expected_: a baseline row count is observable
- Open the Query Language Editor modal
  - _Expected_: the editor opens empty
- Enter the query `failed` in the editor
  - _Expected_: the editor shows the typed text
- Click `Cancel`
  - _Expected_:
  - The modal closes
  - The Runs list is unchanged from its baseline
  - The URL contains no `filterParam`
  - No filter-active indicator is shown

<!-- test
type: manual
priority: low
source: AC-72, ac-delta-15
automation: deferred
automation-note: verifying autocomplete requires interacting with a CodeMirror-hosted suggestion popup — feasible but environment-flaky; deferred for stability
-->
## Toggling the Enable autocomplete checkbox changes suggestion behavior

Covers the Enable autocomplete checkbox in the TQL editor — verifies that autocomplete suggestions appear while typing when the checkbox is checked and do not appear when it is unchecked.

## Preconditions
- Signed in as a user with access to a project
- The Query Language Editor modal is open with the `Enable autocomplete` checkbox in its default checked state

## Steps
- Observe the `Enable autocomplete` checkbox
  - _Expected_: the checkbox is checked by default
- Begin typing `has_` in the editor
  - _Expected_: a suggestion list appears offering variables such as `has_custom_status`, `has_assigned_to`, `has_retries`
- Clear the editor and uncheck the `Enable autocomplete` checkbox
  - _Expected_: the checkbox becomes unchecked
- Begin typing `has_` again in the editor
  - _Expected_: no suggestion list appears while typing
