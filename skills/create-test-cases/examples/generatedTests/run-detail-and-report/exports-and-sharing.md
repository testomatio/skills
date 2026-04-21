<!-- suite -->
# Exports and Sharing

Covers the extra-menu export actions and the header share controls on the `/runs/{id}/report/` page — `Download as Spreadsheet`, `Export as PDF`, `Share report by Email`, `Share Report Publicly` (with Expiration + passcode), `Stop Sharing`, `Copy Link`, and the report-specific Custom view Settings dialog. Does NOT cover `Relaunch` / `Advanced Relaunch` / `Launch a Copy` / `Pin` / `Move` / `Labels` / `Move to Archive` / `Purge` entries that share the same extra menu (owned by #6 run-lifecycle and #9 archive-and-purge respectively — only entry-point presence is asserted here).

<!-- test
type: manual
priority: critical
source: AC-99
automation: candidate
-->
## Copy Link button in the report header copies the report URL to clipboard @smoke

Verifies the standalone `Copy Link` button on the report page header copies the current report URL to the clipboard and surfaces a confirmation (resolves AC-99).

## Preconditions
- Signed in as a user with access to the project
- The report page `/runs/{id}/report/` is open for a finished run

## Steps
- Observe the report header
  - _Expected_: a `Copy Link` button is visible in the header (NOT inside the extra menu)
- Click the `Copy Link` button
  - _Expected_: a confirmation toast or tooltip indicates the link was copied
- Paste the clipboard content into a text field
  - _Expected_: the pasted value equals the current report URL (`/projects/{project}/runs/{id}/report/`)

<!-- test
type: manual
priority: normal
source: AC-87, ac-delta-16
automation: candidate
-->
## Extra menu Download as Spreadsheet triggers an XLSX download @smoke

Verifies the `Download as Spreadsheet` action in the report extra menu triggers an XLSX file download.

## Preconditions
- Signed in as a user with access to the project
- The report page `/runs/{id}/report/` is open for a finished run
- Browser download confirmation is enabled (so the download dialog is observable)

## Steps
- Click the extra menu button in the report header
  - _Expected_: the extra menu dropdown is displayed with the expected action entries
- Click the `Download as Spreadsheet` option
  - _Expected_:
  - The dropdown closes
  - A file download is triggered with an `.xlsx` extension
  - The filename contains the run identifier (e.g. `Run-{id}.xlsx`)

<!-- test
type: manual
priority: high
source: AC-88, ac-delta-17
automation: candidate
-->
## Extra menu Export as PDF triggers a PDF download of the current report view @smoke

Verifies the `Export as PDF` action in the report extra menu triggers a PDF download that reflects the current report filters and grouping.

## Preconditions
- Signed in as a user with access to the project
- The report page `/runs/{id}/report/` is open for a finished run

## Steps
- Apply the `Failed` status filter in the filter bar
  - _Expected_: the test list is filtered to failed tests only
- Click the extra menu button in the report header
  - _Expected_: the extra menu dropdown is displayed
- Click the `Export as PDF` option
  - _Expected_:
  - The dropdown closes
  - A file download is triggered with a `.pdf` extension
- Open the downloaded PDF
  - _Expected_: the PDF content reflects the filtered view (failed tests only) and includes the run summary metadata

<!-- test
type: manual
priority: high
source: AC-89, ac-delta-18
automation: candidate
-->
## Share report by Email accepts comma-separated emails and rejects invalid format @negative

Verifies the `Share report by Email` dialog validates the email input, accepting a comma-separated list of valid addresses and rejecting malformed values.

## Preconditions
- Signed in as a user with access to the project
- The report page `/runs/{id}/report/` is open for a finished run

## Steps
- Click the extra menu and choose `Share report by Email`
  - _Expected_:
  - A modal titled `"Send Report to Email"` is displayed
  - The modal contains an email input with hint `"Separate multiple emails with comma"` and a `Send` button
- Type a malformed address (e.g. `not-an-email`) into the email input and click `Send`
  - _Expected_: an inline validation error indicates the address is invalid and the send is not executed
- Replace the input with two valid addresses separated by a comma (e.g. `alice@example.com, bob@example.com`) and click `Send`
  - _Expected_:
  - The dialog closes
  - A success toast indicates the report was shared (toast message surfaced by the app)

<!-- test
type: manual
priority: high
source: AC-90, AC-91, ac-delta-19
automation: deferred
automation-note: depends on the Company + Project "Sharing" feature being enabled; public-link assertion also needs an incognito/unauthenticated browser context
-->
## Share Report Publicly generates a URL and passcode with default Expiration and Protect-by-passcode ON @smoke

Verifies the `Make Public Report` dialog exposes the default 7-day Expiration date and the `Protect by passcode` checkbox defaulting to ON, and that submitting produces a public URL and a 5-digit passcode.

## Preconditions
- Signed in as a user with access to the project (owner or manager role)
- The project has the `Sharing` feature enabled
- The report page `/runs/{id}/report/` is open for a finished run that is not currently shared publicly

## Steps
- Click the extra menu and choose `Share Report Publicly`
  - _Expected_:
  - A modal titled `"Make Public Report"` is displayed
  - The `Expiration Date` input is pre-filled with a date 7 days from today
  - The `Protect by passcode` checkbox is checked by default
- Click the `Share` button without changing defaults
  - _Expected_:
  - The dialog transitions to the post-share state
  - A `Link:` row shows the full public URL in a code block with a copy button
  - A `Passcode:` row shows a 5-digit numeric passcode in a code block with a copy button
  - An `Expiration Date:` row shows the expiration date with a copy button
  - An `Open Link` and a `Stop Sharing` button are visible
- Copy the generated link and open it in an unauthenticated browser
  - _Expected_: a passcode prompt is displayed; entering the generated passcode unlocks the public report view

<!-- test
type: manual
priority: high
source: AC-91, ac-delta-20
automation: deferred
automation-note: requires the run to be in a "publicly shared" state before the test — depends on the Share Publicly happy-path test producing a stable fixture
-->
## Stop Sharing revokes the public URL and blocks subsequent unauthenticated access @negative

Verifies the `Stop Sharing` action in the post-share state revokes the public URL and that a subsequent load of the revoked URL no longer renders the report.

## Preconditions
- Signed in as a user with access to the project
- The report page `/runs/{id}/report/` is open for a finished run that is currently shared publicly
- The `Make Public Report` dialog is open on its post-share state (Link, Passcode, Stop Sharing visible)

## Steps
- Copy the displayed public link via the `Link:` row copy button
  - _Expected_: the clipboard contains the public URL
- Click the `Stop Sharing` button
  - _Expected_:
  - A toast with the message `"Public run report was removed"` is displayed
  - The dialog reverts to the pre-share state (Expiration input + Protect-by-passcode + `Share` button)
- Open the previously copied public URL in an unauthenticated browser
  - _Expected_: the report does NOT load; a revoked/expired state or access-denied view is displayed instead

<!-- test
type: manual
priority: normal
source: ac-delta-22
automation: candidate
-->
## Report Custom view Settings toggles column visibility on the Tests tab

Verifies the Custom view Settings dialog on the report page lets the user toggle column visibility and that the choice is reflected after closing the dialog.

## Preconditions
- Signed in as a user with access to the project
- The report page (or Run Detail panel `Tests` tab) is open for a finished run
- The `Custom` view toggle is active (list shown as a table)

## Steps
- Click the Custom view Settings icon next to the `Custom` view toggle
  - _Expected_: the `Runs list settings` dialog opens with column checkboxes and width spinbuttons
- Uncheck the `Runtime` column checkbox and click `Save`
  - _Expected_:
  - The dialog closes
  - The `Runtime` column is hidden in the test list table
- Re-open the Settings dialog, re-check `Runtime`, and click `Save`
  - _Expected_: the `Runtime` column is visible again in the table

<!-- test
type: manual
priority: normal
source: AC-90, ac-delta-19
automation: deferred
automation-note: requires Company + Project "Sharing" feature to be enabled and cleanup of generated public reports
-->
## Make Public Report with the minimum 1-day Expiration generates a short-lived URL @boundary

Verifies the `Expiration Date` field in the `Make Public Report` dialog accepts the minimum value (1 day from today) as a valid boundary input and that the generated public URL reflects that expiration.

## Preconditions
- Signed in as a user with access to the project (owner or manager role)
- The project has the `Sharing` feature enabled
- The report page `/runs/{id}/report/` is open for a finished run that is not currently shared publicly

## Steps
- Click the extra menu and choose `Share Report Publicly`
  - _Expected_: the `Make Public Report` dialog is displayed with the Expiration Date pre-filled for 7 days from today
- Clear the `Expiration Date` input and select tomorrow's date (today + 1 day)
  - _Expected_:
  - The input accepts the selected date
  - No validation error is displayed for the boundary value
- Click the `Share` button
  - _Expected_:
  - The dialog transitions to the post-share state
  - The `Expiration Date:` row shows tomorrow's date in the generated display
  - The `Link:` row shows the public URL and the `Passcode:` row shows the 5-digit passcode

<!-- test
type: manual
priority: normal
source: AC-89, ac-delta-18
automation: deferred
automation-note: email sending requires a mail-capture fixture (Mailosaur or equivalent) to assert delivery for each recipient count
-->
## Share by Email with ${email_count} email(s) sends the report to every recipient @boundary

Verifies the email input accepts a single address and a multi-address comma-separated list as boundary conditions of the recipient count.

## Preconditions
- Signed in as a user with access to the project
- The report page `/runs/{id}/report/` is open for a finished run

## Steps
- Click the extra menu and choose `Share report by Email`
  - _Expected_: the `Send Report to Email` dialog is displayed with an email input and a `Send` button
- Type `${email_input}` into the email field
  - _Expected_:
  - The field accepts the value without inline validation error
  - All addresses remain visible in the input in the exact format entered
- Click `Send`
  - _Expected_:
  - The dialog closes
  - A success toast indicates the report has been sent to `${expected_recipients}`

<!-- example -->
| email_count | email_input | expected_recipients |
| --- | --- | --- |
| 1 | `alice@example.com` | one recipient |
| 3 | `alice@example.com, bob@example.com, carol@example.com` | three recipients |

<!-- test
type: manual
priority: normal
source: AC-91, ac-delta-19
automation: deferred
automation-note: requires a public-share state and then verifying the passcode cannot be re-read without a new share
-->
## Passcode is shown only once and cannot be recovered after the dialog is closed @boundary

Verifies the generated passcode in the `Make Public Report` post-share state is displayed once; reopening the dialog for an already-shared run does not re-reveal the original passcode.

## Preconditions
- Signed in as a user with access to the project (owner role)
- The project has the `Sharing` feature enabled
- The report page `/runs/{id}/report/` is open for a finished run that is not currently shared publicly

## Steps
- Share the report publicly with default settings
  - _Expected_: the `Make Public Report` dialog shows the post-share state with a 5-digit numeric passcode displayed in the `Passcode:` row
- Copy the passcode value to the clipboard via the copy control in the `Passcode:` row
  - _Expected_: the clipboard contains the 5-digit passcode
- Close the `Make Public Report` dialog by clicking outside it or pressing `Escape`
  - _Expected_: the dialog is dismissed
- Re-open the `Make Public Report` dialog from the extra menu
  - _Expected_:
  - The dialog shows the existing share (Link, Expiration, Stop Sharing)
  - The passcode is NOT shown again in plain text (it is either masked or absent)

<!-- test
type: manual
priority: normal
source: AC-89, ac-delta-18
automation: candidate
-->
## Share by Email with an empty input surfaces an inline validation error @negative

Verifies clicking `Send` in the `Send Report to Email` dialog without entering any email address surfaces an inline validation error and does not dispatch the email.

## Preconditions
- Signed in as a user with access to the project
- The report page `/runs/{id}/report/` is open for a finished run

## Steps
- Click the extra menu and choose `Share report by Email`
  - _Expected_: the `Send Report to Email` dialog is displayed with an empty email input
- Click the `Send` button without entering any email
  - _Expected_:
  - An inline validation error indicates at least one email is required
  - The dialog remains open
  - No success toast is displayed
- Enter a valid email address and click `Send`
  - _Expected_: the dialog closes and a success toast is displayed

<!-- test
type: manual
priority: normal
source: AC-91
automation: deferred
automation-note: requires a publicly shared report and an unauthenticated browser to test the passcode gate
-->
## Public share URL rejects an incorrect passcode @negative

Verifies that opening the public share URL in an unauthenticated browser and entering an incorrect passcode does not unlock the report.

## Preconditions
- Signed in as a user with access to the project
- The report `/runs/{id}/report/` has been shared publicly with `Protect by passcode` ON; the public URL and correct passcode are recorded

## Steps
- Open the recorded public URL in a fresh unauthenticated browser session
  - _Expected_: a passcode prompt is displayed in place of the report content
- Enter an incorrect 5-digit value in the passcode input and submit
  - _Expected_:
  - An error message indicates the passcode is incorrect
  - The report content is NOT displayed
  - The user remains on the passcode prompt
- Enter the correct passcode and submit
  - _Expected_: the public report content is displayed
