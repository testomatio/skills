# Destructuring: Manual Tests Execution

**Feature slug:** `manual-tests-execution`
**Entry point:** https://app.testomat.io/projects/project-for-testing/runs/new (exploration not limited to this page)
**Coverage depth (Q2):** regression
**Generated:** 2026-04-17

---

## Sub-feature map

### 1. **run-creation**
One-line: New Manual Run dialog — scope modes (All/Plan/Select/Without), fields, launch/save/cancel, validation.
- **Owns:** opening the dialog, scope selector (All tests / Test plan / Select tests / Without tests), Title, Description, "Run as checklist" toggle, "Run Automated as Manual" toggle, Launch/Save/Cancel; additional variants exposed from header (New Group, Mixed Run, Launch from CLI, Report Automated Tests). Entry points from Tests page (single test, suite, multi-select).
- **Does NOT own:** actual test execution inside the runner, relaunch flows, tester assignment UX (only field presence), environment configuration UX (only field presence), run group creation (lives in #5).
- **Key elements:** "Manual Run" button, New Manual Run sidebar (Title / RunGroup / Environment / Assign to / Description / Run as checklist / Run Automated as Manual), scope tabs, Launch / Save / Cancel buttons, arrow dropdown with New Group / Mixed Run / Launch from CLI / Report Automated Tests.
- **Estimated tests:** 25–35
- **Criteria met:** 1 (form with 3+ fields), 4 (own entry point), 5 (interacts with RunGroups, Environments, Tests, Plans).

### 2. **test-execution-runner**
One-line: Manual Runner UI — marking PASSED/FAILED/SKIPPED, result message, attachments, custom statuses, step-by-step, description toggle.
- **Owns:** per-test PASSED/FAILED/SKIPPED, Result message, Custom status selection on a test, attachments (add / thumbnails / grid / list / fit-to-width / full-screen / delete-with-confirm), step-by-step markings (single/double/triple click), Notes (create / bulk / convert to test), resizing description block, Toggle Description, Extra options menu (Collapse/Expand, Tree/List view, Refresh, Show/Hide Creation/Labels/Tags), priority filter, tracking time (Auto-Track, manual Set Time).
- **Does NOT own:** bulk status actions (lives in #10), run lifecycle transitions (Finish lives in #6), assigning users (#3), environment selection (#4), list management (#7), run report/detail pages (#8).
- **Key elements:** test tree, status buttons, result message textarea, attachment zone, custom status dropdown, stopwatch / Track / Set Time / Auto-Track, Create notes + / Add note to suite, Extra options menu, Finish Run button.
- **Estimated tests:** 30–45
- **Criteria met:** 1, 3 (pending/in-progress/with-result states), 4, 5.

### 3. **tester-assignment**
One-line: Assigning testers to a run / suite / test + Auto-Assign strategies.
- **Owns:** "Assign to" in creation dialog, Auto-Assign Users strategy selector (None / Prefer test assignee / Randomly distribute), adding testers via Edit-run, assigning a user to a suite inside the runner, bulk assign to tests via Multi-Select + "Assign to" + OK confirmation, removing assigned users, manager-role exclusion from random distribution.
- **Does NOT own:** the list of users, project-level roles (managed elsewhere), the run's metadata edit form as a whole (Edit-run is referenced but owned by the lifecycle sub-feature).
- **Key elements:** Assign to dropdown (creation + edit), Auto-Assign strategy selector, per-suite "Assign to" icon, Multi-Select "Assign to" bottom button, "Are you sure you want to assign …" confirmation.
- **Estimated tests:** 12–18
- **Criteria met:** 1, 3 (unassigned / assigned / removed), 4, 5.

### 4. **environment-configuration**
One-line: Multi-environment configuration modal + run modes (One Run / Launch in Sequence / Launch All).
- **Owns:** "+" in environment section in creation form, environment groups (add / remove / edit), environment checkbox selection per group, Save in modal, multi-env run mode switches (Launch / Launch in Sequence / Launch All), behaviour of resulting run(s).
- **Does NOT own:** Settings → Environments configuration (site-wide config, out of scope), TQL env filter (lives in #7).
- **Key elements:** environment field / "+" button, environment group configurator, environment dropdown (with categories like `Browser:Chrome`, `OS:Windows`), Add Environment button, Save, Launch / Launch in Sequence / Launch All actions in run header.
- **Estimated tests:** 15–22
- **Criteria met:** 1, 3 (single / sequence / parallel modes), 4, 5.

### 5. **run-groups**
One-line: Creating / managing RunGroups and launching runs inside them, RunGroup report, Combined Report, Copy Group.
- **Owns:** "New group" dialog (Group Type / Name / Merge Strategy / Description / Save), creating Run inside Group (RunGroup field pre-populated), Move existing runs into a group, Add Existing Run to a group, RunGroup Report (basic view, chart, per-run summary), Combined Report (main run anchor, Compare To, filters, totals), Copy RunGroup dialog (Assignee / Issues / Labels / Environments / Nested Structure), Edit Group, Pin Group, Archive Group, Unarchive Group, Purge Group (incl. 20 000-run limit).
- **Does NOT own:** run-level archive/purge outside a group (#9), runs list filters for the "Groups" tab (#7).
- **Key elements:** arrow next to Manual Run → "New group"; RunGroup page with chart + summary + Combined Report button + Add Manual Run; Extra menu with Copy / Pin / Archive / Purge / Edit / Add Existing Run; Copy configuration dialog.
- **Estimated tests:** 25–35
- **Criteria met:** 1, 2 (CRUD on group), 3, 4, 5.

### 6. **run-lifecycle**
One-line: Start → Continue → Finish Run → Relaunch variants (Basic / Failed-on-CI / All-on-CI / Manually / Advanced) + Launch a Copy + Edit unfinished run.
- **Owns:** Launch action behaviour (new run → in-progress), Continue resumes unfinished run, Finish Run confirmation dialog, Finish with Pending tests (→ Skipped), Relaunch variants (Basic, Relaunch Failed on CI, Relaunch All on CI, Relaunch Manually, Launch a Copy, Launch a Copy Manually), Advanced Relaunch sidebar (custom title / Create new run toggle / Keep values toggle / per-test selection / Relaunch button + matrix of behaviour), Edit ongoing run (Assign to / Title / Environment / Description / +Tests / +Plans / Trash delete).
- **Does NOT own:** execution semantics inside runner (#2), bulk in-runner actions (#10), the detailed Run Report (#8), archive and purge of a run (#9).
- **Key elements:** Launch / Save / Cancel, Continue, Finish Run + confirmation, Relaunch ▾ menu, Advanced Relaunch sidebar, Edit panel, Launch a Copy.
- **Estimated tests:** 25–35
- **Criteria met:** 2 (full run lifecycle), 3 (Pending/In-Progress/Finished/Terminated), 4, 5.

### 7. **runs-list-management**
One-line: Runs Dashboard — filter tabs, row actions, multi-select, Pin, Custom View, TQL filter, URL share.
- **Owns:** filter tabs (Manual / Automated / Mixed / Unfinished / Groups), row "..." extra menu (Relaunch / Launch a Copy / Advanced Relaunch / Copy / Pin / Labels / Move / Archive / Purge / Export as PDF / Download), Pin + unpin (Run and Group), Multi-select (Select all / Archive / Labels / Compare / Link / Download / Merge / Move / Purge), Custom view column settings (show/hide, widths), TQL Query Language Editor (variables, operators), URL share of filter state, chart area.
- **Does NOT own:** creating a run (#1), detailed report / downloads per single run (#8 owns the download path from report), archive section pages (#9), group reports (#5).
- **Key elements:** top tabs, Custom view + Settings icon, Query Language Editor, chart, per-row extra menu, Multi-select panel with bottom toolbar.
- **Estimated tests:** 25–40
- **Criteria met:** 1, 2 (filter / sort / customise), 4, 5.

### 8. **run-detail-and-report**
One-line: Run Detail + Run Report (Basic + Extended) + test sub-panel + downloads + sharing.
- **Owns:** Run Detail panel (Tests / Statistics / Defects tabs), test sub-panel (Summary / Description / Code Template / Runs), Basic Run Report, Extended Run Report, custom-view columns per report, sort (suite/name/failure), filter (status/type/messages/custom-status/assignee), search by title/message, grouped overview (suites/tags/labels/assignees/priorities), Flaky Tests Analytics section, Download as Spreadsheet (XLSX), Export as PDF, Share Report by Email, Share Report Publicly (expiration / passcode / Stop Sharing / URL copy), Compare runs, keyboard navigation (↑/↓), Copy Link / public-report view.
- **Does NOT own:** the Runs list filters (#7), relaunch / lifecycle actions (#6), assignment flows (#3).
- **Key elements:** Run detail right pane, Report button, Custom view Settings, Download / Export / Share Report buttons, Public Share dialog (Expiration, passcode), Compare button.
- **Estimated tests:** 25–40
- **Criteria met:** 1, 2, 3 (basic/extended/public), 4, 5.

### 9. **archive-and-purge**
One-line: Archive runs/groups + Purge + Runs/Groups Archive pages + retention + unarchive.
- **Owns:** Archive single run / group via Extra menu + confirmation, Multi-select archive (runs only), Runs Archive page (filter, purge badge, "Rungroup Structure" toggle, retention, Purge Old Runs config), Groups Archive page (Search / filter by Group type / Finish Range / sort ASC/DESC by Name or Date), Unarchive (single + multi-select runs, single RunGroup), Automatic Purge (retention setting, badge), Permanent deletion from Archive (irreversible), badges (Archived / Purged / Terminated), Pulse tracking under "Deleted Run".
- **Does NOT own:** active run / group management (#5, #6, #7).
- **Key elements:** Extra menu → Archive / Unarchive / Purge, Runs Archive page, Groups Archive page, Purge Old Runs setting, retention input, confirmation dialogs.
- **Estimated tests:** 15–22
- **Criteria met:** 2 (lifecycle of archival state), 3, 4, 5.

### 10. **bulk-status-actions**
One-line: Bulk actions inside Manual Runner — multi-select tests + bulk Result message / Status, status-counter updates.
- **Owns:** entering Multi-Select mode in the runner, selecting multiple tests (range / all / current filter), "Result message" bottom action + status picker + optional message + Apply, bulk outcome propagation (counters Passed/Failed/Skipped update), bulk Clear selection, bulk selection scope rules when a filter is applied.
- **Does NOT own:** single-test result entry (#2), bulk Assign to (#3), multi-select on Runs list (#7).
- **Key elements:** Multi-Select toggle, per-test checkboxes, bulk-action bottom toolbar, Result message button, status dropdown, Apply button, status counters header.
- **Estimated tests:** 10–15
- **Criteria met:** 1, 3 (selection / applying / applied), 4, 5.

---

## Cross-cutting concerns

A. **Multi-environment configuration** — selecting 2+ environment groups creates parallel/sequential/single-run variants.
   - **Trigger:** configuring ≥2 environment groups in the New Manual Run dialog (owned by #4).
   - **Affects:** #1 (creation UI reflects groups), #4 (owner), #6 (each group spawns its own lifecycle in Sequence/Launch All), #7 (runs list shows grouped result), #8 (report shows per-environment breakdown).
   - **Must-test scenarios:** each affected sub-feature must include at least 1 test that exercises a multi-environment scenario (e.g., verifying list rendering of multi-env runs in #7, verifying environment column in #8).

B. **Multi-user assignment** — assigning multiple testers changes visibility/ownership of test portions.
   - **Trigger:** selecting 2+ testers in Assign to + choosing Auto-Assign strategy (#3).
   - **Affects:** #1 (creation supports multiple assignees), #2 (runner shows per-test assignee), #3 (owner), #6 (Edit-run lets adding/removing assignees), #8 (report shows assignee filter + grouping).
   - **Must-test scenarios:** #2 and #8 each need at least 1 multi-assignee test.

C. **RunGroup membership** — a Run can belong to a RunGroup; group context modifies list/archive behaviour.
   - **Trigger:** selecting or pre-populating a RunGroup during creation (#1 / #5).
   - **Affects:** #1 (required-RunGroup validation), #5 (owner), #7 (filter by Groups, Move to group, unarchive cascade), #9 (archive/purge cascade).
   - **Must-test scenarios:** #7 and #9 each need at least 1 RunGroup-context test.

D. **"Run as checklist" mode** — hides descriptions during execution.
   - **Trigger:** toggling "Run as checklist" in creation dialog (#1).
   - **Affects:** #1 (owner of toggle), #2 (execution UX differs — description hidden, Toggle Description present).
   - **Must-test scenarios:** #2 needs at least 1 checklist-mode test.

E. **Custom statuses** — custom sub-statuses attached to PASSED/FAILED/SKIPPED affect filters and reports.
   - **Trigger:** configured custom statuses in Settings → applied during result entry.
   - **Affects:** #2 (runner shows dropdown after status chosen), #7 (TQL `has_custom_status`), #8 (reports filter by custom status).
   - **Must-test scenarios:** #2 test for applying a custom status; #7 test for filtering runs by custom status; #8 test for custom-status column in report.

F. **Filter applied vs not (selection scope)** — when a filter is active, selection methods include only matching tests.
   - **Trigger:** applying a search / filter in the runner or relaunch sidebar.
   - **Affects:** #2 (runner), #6 (Advanced Relaunch), #10 (bulk actions).
   - **Must-test scenarios:** #6 needs an Advanced Relaunch test with filter applied; #10 needs a bulk-apply test with filter applied.

G. **Ongoing vs Finished state** — many actions are gated on the run state.
   - **Trigger:** run transitions Pending → In-Progress → Finished / Terminated.
   - **Affects:** #2 (runner only on ongoing), #6 (Continue/Finish/Relaunch gated by state), #7 (Unfinished tab), #8 (reports for finished), #9 (archive/purge behaviour differs for ongoing).
   - **Must-test scenarios:** #6 must cover ongoing-edit vs finished read-only; #9 must cover archive-ongoing vs archive-finished behaviours.

H. **Bulk multi-select mode** — turns on a batch-action toolbar that changes affordances.
   - **Trigger:** activating Multi-select in the Runs list (#7) or Manual Runner (#10).
   - **Affects:** #7 (Runs list multi-select), #10 (runner multi-select), #3 (bulk assign to tests).
   - **Must-test scenarios:** #3 needs a bulk assign test; #10 needs a bulk result-message test; #7 needs a multi-select bulk action test.

---

## Recommended execution order

1. **run-creation** — establishes patterns for creating a run; other sub-features depend on "an existing run".
2. **test-execution-runner** — core execution; many later sub-features build on an in-progress run.
3. **run-lifecycle** — Finish / Continue / Relaunch variants; unlocks stable runs for later flows.
4. **tester-assignment** — uses created + in-progress runs; natural next step after lifecycle is stable.
5. **environment-configuration** — variant of creation; tested after #1 stabilises.
6. **run-groups** — uses created runs and introduces a container abstraction.
7. **bulk-status-actions** — depends on runner being well understood (#2) and usually tested alongside multi-select.
8. **runs-list-management** — needs historical runs (from earlier suites) to populate filters/actions.
9. **run-detail-and-report** — consumes finished runs from earlier suites to exercise report variants.
10. **archive-and-purge** — edge / terminal states; best last.

---

## Progress tracker

- [x] #1 run-creation
- [x] #2 test-execution-runner — 36 tests, nested (7 files), 2026-04-18
- [x] #3 run-lifecycle — 31 tests, nested (6 files), 2026-04-18
- [x] #4 tester-assignment — 34 tests, nested (5 files), 2026-04-18
- [x] #5 environment-configuration — 22 tests, nested (4 files), 2026-04-18
- [x] #6 run-groups — 29 tests, nested (5 files), 2026-04-19
- [x] #7 bulk-status-actions — 15 tests, nested (4 files), 2026-04-19
- [x] #8 runs-list-management — 47 tests, nested (6 files), 2026-04-19
- [x] #9 run-detail-and-report — 60 tests, nested (7 files), 2026-04-20
- [x] #10 archive-and-purge — 43 tests, nested (7 files), 2026-04-20
