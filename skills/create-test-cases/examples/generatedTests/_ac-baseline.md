---
feature: manual-tests-execution
source: docs
sources:
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/project/runs/running-tests-manually.md
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/project/runs/managing-runs.md
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/project/runs/rungroups.md
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/project/runs/environments.md
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/project/runs/reports.md
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/project/runs/archive-runs-and-groups.md
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/project/runs/custom-statuses.md
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/project/runs/running-manual-and-automated-tests.md
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/project/runs/merge-strategies.md
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/project/runs/temporary-tests-notes.md
  - https://github.com/testomatio/docs/blob/docs/src/content/docs/advanced/tql/index.md
  - UI exploration of https://app.testomat.io/projects/project-for-testing
ac_count: 96
generated_at: 2026-04-17T00:00:00Z
---

## Run Creation — New Manual Run dialog

AC-1: User can open the "New Manual Run" dialog from the Runs page by clicking the "Manual Run" button.
AC-2: The New Manual Run dialog exposes mutually exclusive scope selectors: All tests, Test plan, Select tests, Without tests.
AC-3: "All tests" is the default scope and includes all manual tests in the project.
AC-4: The "Test plan" scope supports selecting multiple plans and provides a "create new plan" action.
AC-5: The "Select tests" scope supports browsing the test tree, searching, and filter-based selection; multi-select is supported.
AC-6: The "Without tests" scope creates a run structure that can be populated later.
AC-7: The New Manual Run dialog exposes a Title field (optional), RunGroup selector, environment selector, Description (optional), and a "Run as checklist" toggle.
AC-8: The dialog exposes actions "Launch" (start run immediately), "Save" (store without launching), and "Cancel" (discard changes).
AC-9: When "Require RunGroup for new runs" is enabled in Project Settings and no RunGroup is selected, the RunGroup field is highlighted and a warning appears; launch is blocked.
AC-10: User can enable "Run Automated as Manual" toggle in the Select tests tab to include automated tests for manual re-execution.
AC-11: User can launch a single manual run from the Tests page via a test's extra menu → "Add to Run" and choosing an unfinished run.
AC-12: User can launch manual runs for one or more suites from the Tests page via suite extra menu or Multi-select → "Run Tests" → "Launch".

## Run Creation — Additional variants (header extras menu)

AC-13: User can create a new RunGroup via the Runs page → arrow next to Manual Run → "New group".
AC-14: The New Group dialog requires a Name and Merge Strategy; Group Type and Description are optional.
AC-15: User can launch a Mixed Run (manual + automated) via the arrow next to Manual Run → "Mixed Run".
AC-16: Mixed Run supports execution on CI (choose CI Profile) or without CI (local CLI via `@testomatio/reporter`).
AC-17: User can report automated test results via the arrow next to Manual Run → "Report Automated Tests" (CLI-driven).
AC-18: User can access a CLI launch helper via "Launch from CLI" option.

## Test Scope — Select Tests / Plan / Without

AC-19: In the Select tests tab, user can expand/collapse suites, toggle individual tests, and use search to filter the tree.
AC-20: Selected tests count is displayed and updates in real time as selections change.
AC-21: In the Test plan tab, selecting plans adds the plan's test set to the run.
AC-22: "Without tests" mode creates a run with zero tests that can be populated via edit or "+ Tests" / "+ Plans" later.

## Run Lifecycle

AC-23: Clicking "Launch" creates the run and transitions it to an active (in-progress) state.
AC-24: An ongoing/unfinished run can be resumed via "Continue" action from the Runs list.
AC-25: "Finish Run" transitions an ongoing run to a Finished state and presents a confirmation dialog.
AC-26: Finishing a run with Pending tests marks those tests as Skipped (or leaves Pending per configuration).
AC-27: User can edit an unfinished run's Assign to, Title, Environment, Description, current tests (trash delete), and add tests/plans.
AC-28: "Finish Run" is gated by a confirmation dialog before terminal transition.

## Test Result Entry (PASSED / FAILED / SKIPPED)

AC-29: In the Manual Runner, user can mark each test as PASSED, FAILED, or SKIPPED.
AC-30: After a standard status is chosen, a Result message field becomes editable; message is optional.
AC-31: Custom status dropdown (if configured) is shown only after a standard status is selected; it does not replace the standard status.
AC-32: User can attach files to a result via browse or drag-and-drop; attachments support Large/Small Thumbnail, Grid, and List views.
AC-33: User can open an attachment in "Fit to width" or "Full screen" mode.
AC-34: User can delete an attachment via its trash icon; the system shows "Are you sure?" confirmation before deletion.
AC-35: Test step-by-step markings: single click = Passed, double click = Failed, triple click = Skipped.
AC-36: Step results persist with the test result.

## Tester Assignment

AC-37: By default only the run creator is assigned to a run.
AC-38: User can add testers via the "Assign to" selector in the New Manual Run dialog (before launch) or via the Edit panel on an ongoing run.
AC-39: Auto-Assign Users strategies: None, Prefer test assignee, Randomly distribute tests between team members.
AC-40: The "Randomly distribute" strategy never assigns the manager role to any test.
AC-41: Users must be assigned to the run before they can be assigned to individual tests or suites.
AC-42: User can assign a user to a suite/folder via the suite's "Assign to" icon inside an ongoing run.
AC-43: User can assign a user to individual tests only via Multi-Select + "Assign to" bottom button, confirmed by OK in a "Are you sure…" popup.

## Environments

AC-44: Environments are managed at Settings → Environments; user enters one per line with recommended format `{category}:{value}` (e.g., `Browser:Chrome`).
AC-45: In the New Manual Run dialog, user can click "+" in the environment section to configure one or more environments per run group.
AC-46: Each environment group supports selecting multiple environments from the dropdown.
AC-47: "Add Environment" creates an additional environment group inside the same run.
AC-48: Multi-environment run mode "One Run" — all selected groups apply to a single run; results grouped by environment.
AC-49: Multi-environment "Launch in Sequence" — each group runs sequentially as a separate run, collected under one parent.
AC-50: Multi-environment "Launch All" (parallel) — each group starts simultaneously as a separate run.

## RunGroups (as a container for runs)

AC-51: A Run can be created inside an existing RunGroup; the RunGroup field is pre-populated but editable.
AC-52: User can move an existing Run into a RunGroup via the run's extra menu → "Move" → select destination → "Move".
AC-53: User can add existing runs to a RunGroup via the RunGroup's extra menu → "Add Existing Run".
AC-54: Opening a RunGroup shows a basic view with a chart, per-run summary, and Combined Report option.
AC-55: User can customize the Runs list view (columns, widths) per RunGroup; widths auto-save.
AC-56: Archiving a RunGroup archives all nested runs; unarchiving restores them all.
AC-57: Purging a RunGroup moves all nested Runs to Archive with a Purged badge; limit 20 000 runs per purge.

## Run Lifecycle — Relaunch variants

AC-58: "Relaunch" (manual run) re-opens the same run in Manual Runner to re-check tests; Run status updates after Finish.
AC-59: "Relaunch Failed on CI" (automated/mixed) re-runs only failed automated tests on CI; failed manual tests open in Manual Runner.
AC-60: "Relaunch All on CI" re-runs all automated tests on CI; mixed runs also open Manual Runner.
AC-61: "Relaunch Manually" re-executes all tests manually in UI (no CI or CLI).
AC-62: "Advanced Relaunch" opens a sidebar with: custom run title, "Create new run" toggle, "Keep values" toggle (enabled only with Create new run ON), per-test selection, and Relaunch action.
AC-63: Advanced Relaunch "Create new run: ON" creates a new Run ID; selected tests reset to Pending unless Keep values is ON.
AC-64: Advanced Relaunch "Create new run: OFF" reuses the original Run ID; only selected tests reset to Pending.
AC-65: "Keep values: ON" preserves selected and unselected test statuses in the new run; OFF resets them to Pending.
AC-66: With a filter applied, selection methods (Checkbox vs "Select All") include only tests matching the filter.
AC-67: "Launch a Copy" creates a separate duplicate run; both original and copy appear in Runs list after finishing.

## Runs List — filter tabs / row actions / multi-select

AC-68: Runs list supports filter tabs: Manual, Automated, Mixed, Unfinished, Groups.
AC-69: Each run row has an extra "..." menu with actions: Relaunch, Launch a Copy, Advanced Relaunch, Copy, Pin, Move, Labels, Archive, Purge, Export as PDF, Download (spreadsheet).
AC-70: User can Pin a Run or RunGroup; pinned items appear at the top of the list.
AC-71: Multi-select on Runs exposes bulk actions: Select all, Archive, Labels, Compare, Extra menu (Link, Download, Merge, Move), Purge.
AC-72: User can filter the Runs list via TQL in the Query Language Editor (variables include rungroup, env, passed_count, finished_at, has_test_label, has_custom_status, etc.).
AC-73: Filter parameters can be shared via URL (Runs page and Runs Archive page).
AC-74: User can customize the Runs list view (columns, widths) via Custom view Settings.

## Archive / Purge

AC-75: User can Archive a single Run or RunGroup from its extra menu → "Archive" → Confirm; item gets an "archived" badge.
AC-76: Archiving a run with Pending tests sets the run status to Terminated and Pending tests to Skipped; other statuses remain.
AC-77: Archive access is via "Runs/Groups Archive" at the bottom of the Runs page or via the Extra menu.
AC-78: "Purge" replaces Delete for Runs — compresses and moves to Archive with a Purged badge; test results, artifacts, custom statuses preserved; stack traces removed.
AC-79: Automatic Purge is controlled by Project Settings → Purge Old Runs; default retention 90 days; auto-purged runs get the Purged badge.
AC-80: Ongoing purged run: run terminated, recorded statuses kept, Pending → Skipped, receives a "terminated" flag; restored terminated runs cannot be resumed.
AC-81: Permanent deletion from Archive is irreversible and tracked in Pulse under "Deleted Run".

## Run Detail / Run Report

AC-82: Clicking a Run opens the Basic Run Report with tests list, statuses (Passed, Failed, Skipped, Pending, Custom), and overall Run summary.
AC-83: Run Report supports tabs/sections: Tests, Statistics, Defects.
AC-84: Test sub-panel (inside Run Report) shows tabs: Summary, Description, Code Template, Runs.
AC-85: User can sort tests by suite/name/failure status and filter by status, type, messages, custom statuses, assignees.
AC-86: Extended Run Report shows grouped overview (suites/tags/labels/assignees/priorities), Run Report Summary, Flaky Tests Analytics (when applicable); keys ↑/↓ navigate tests.
AC-87: User can Download run(s) as Spreadsheet (XLSX) via extra menu → Download (multi-run or single-run).
AC-88: User can Export a run as PDF via extra menu → Export as PDF.
AC-89: User can Share a Report by Email from Extended view → "Share Report by Email"; comma-separated emails supported.
AC-90: User can Share a Report Publicly from Extended view (requires Company + Project "Sharing" enabled); dialog has Expiration (default 7 days) and "Protect by passcode" toggle (ON by default).
AC-91: Public Share generates a URL and Passcode (shown once); user can "Stop Sharing" at any time.
AC-92: User can Compare multiple selected runs via Multi-select → "Compare".

## Bulk Status Actions in Runner

AC-93: In the Manual Runner, user can multi-select tests and apply bulk actions: Assign to, Result message (with status), and others.
AC-94: Bulk "Result message" requires status choice + optional message → "Apply"; statuses reflect immediately.
AC-95: Status counters (Passed N / Failed N / Skipped N / Pending N) update immediately after bulk apply.

## Run as Checklist / Notes / Auto-Track / Time Tracking

AC-96: "Run as checklist" hides test descriptions in the launched run; a test's description can be revealed via extra menu → "Toggle Description".

## UNCLEAR / To be verified in UI

AC-97: UNCLEAR — whether a "Fast Forward" control exists separately from "Auto-Track"; docs only mention Auto-Track.
AC-98: UNCLEAR — exact "Defects" tab behaviour inside the run detail (docs do not describe the tab in depth).
AC-99: UNCLEAR — whether "Copy Link" action exists on Run Report extra menu for non-public sharing.
AC-100: UNCLEAR — complete permission matrix (who may Start, Finish, Assign, Archive, Purge a run; impact of readonly vs qa vs manager roles).
