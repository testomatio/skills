---
feature: manual-tests-execution
suite: test-execution-runner
references: _ac-baseline.md
baseline_acs_applicable: [AC-29, AC-30, AC-31, AC-32, AC-33, AC-34, AC-35, AC-36, AC-96, AC-97]
delta_ac_count: 22
source: mixed
---

## Baseline ACs applicable to test-execution-runner

- AC-29 (baseline) — In the Manual Runner, user can mark each test as PASSED, FAILED, or SKIPPED.
- AC-30 (baseline) — After a standard status is chosen, a Result message field becomes editable; message is optional.
- AC-31 (baseline) — Custom status dropdown (if configured) appears only after a standard status is selected; it does not replace the standard status.
- AC-32 (baseline) — User can attach files via browse or drag-and-drop; attachments support Large/Small Thumbnail, Grid, and List views.
- AC-33 (baseline) — User can open an attachment in "Fit to width" or "Full screen" mode.
- AC-34 (baseline) — User can delete an attachment via its trash icon; the system shows "Are you sure?" confirmation before deletion.
- AC-35 (baseline) — Step-by-step markings: single click = Passed, double click = Failed, triple click = Skipped.
- AC-36 (baseline) — Step results persist with the test result.
- AC-96 (baseline) — "Run as checklist" hides test descriptions in the launched run; a test's description can be revealed via extra menu → "Toggle Description". (Creation of toggle owned by #1; runtime hide/show behavior owned here.)
- AC-97 (baseline, UNCLEAR) — Whether a "Fast Forward" control exists separately from "Auto-Track" — verify inside runner UI.

## Delta ACs (sub-feature-specific)

ac-delta-1: The Manual Runner is reachable only for an ongoing run. A finished (Terminated/Finished) run opens the Run Report instead of the runner. (Ownership: lifecycle transitions belong to #6; here we verify runner entry is gated by run state.)

ac-delta-2: In the runner, selecting a test from the tree opens a detail pane on the right showing test Title, Description (unless "Run as checklist" ON), Steps, Attachments, Result message field, and status buttons.

ac-delta-3: Result message supports free-text input; entered text persists after status is applied and is visible on return to the same test.

ac-delta-4: Attachments can be added via "browse" file picker and via drag-and-drop onto the attachment drop zone.

ac-delta-5: Attachment view toggles (Large Thumbnail / Small Thumbnail / Grid / List) change layout in the runner's attachment area. Toggle state persists for the session.

ac-delta-6: Attachment preview supports "Fit to width" and "Full screen" modes; user can close preview back to runner.

ac-delta-7: Attachment deletion requires the "Are you sure?" confirmation; dismissing the confirmation keeps the attachment.

ac-delta-8: Step-by-step marking cycles via click pattern: single-click = Passed (green), double-click = Failed (red), triple-click = Skipped (grey). A per-step indicator reflects the current state.

ac-delta-9: Step results are preserved after closing and re-opening the test (persist to backend).

ac-delta-10: User can create Notes via the "Create notes +" action on a test; a note is attached to the test and visible on next load.

ac-delta-11: User can add a Note to an entire suite via the suite's "Add note to suite" affordance; notes appear in the suite context.

ac-delta-12: User can convert a Note to a new Test via the note's context action; the newly created test appears in the tests tree under the parent suite.

ac-delta-13: Notes creation supports bulk operations — selecting multiple tests + Create notes + attaches a note to each selected test.

ac-delta-14: The test detail pane includes a resize handle (horizontal divider) that lets the user enlarge / shrink the description/result area; the resized height persists during the session.

ac-delta-15: In "Run as checklist" mode the description is hidden by default; the runner exposes a "Toggle Description" action in the test's extra menu that reveals / hides the description per test.

ac-delta-16: Runner's Extra options menu (header dots icon) exposes these four toggles: **Refresh structure** (reloads the tree from server), **Show/Hide Creation Buttons** (hides the per-suite "Add test / Add note to suite" affordances), **Show/Hide Labels** (hides label chips in tree rows), **Show/Hide Tags** (hides tag chips in tree rows). Each toggle updates the tree rendering immediately. (Note: Collapse/Expand-all and Tree/List-view are NOT in this menu; Collapse-all is a separate toolbar button owned by shared chrome.)

ac-delta-17: Runner exposes a Priority filter (Low / Normal / High / Critical or similar) that limits the tests tree to matching tests; counters update accordingly.

ac-delta-18: Applying a filter (priority / search / status) changes the scope of navigation (↑/↓) to matching tests only. (Cross-cutting F — Filter applied vs not.)

ac-delta-19: Time tracking — Auto-Track: toggling "Auto-Track" starts a per-test stopwatch when the test is opened and stops when the user navigates away or applies a status. The elapsed time is recorded on the result.

ac-delta-20: Time tracking — Set Time manual entry: user can open a Set Time dialog and enter an explicit duration (hh:mm:ss or equivalent); saved value replaces the auto-tracked value.

ac-delta-21: Custom statuses become available only AFTER a standard status (Passed / Failed / Skipped) is chosen; the custom status dropdown is disabled until then. A custom status attaches to the chosen standard status and is reflected in status counters and in the report (cross-cutting E).

ac-delta-22: Per-test assignee badge/icon in the tests tree reflects who is assigned when multiple testers are assigned to the run (cross-cutting B — visual rendering only; assignment UX owned by #3).
