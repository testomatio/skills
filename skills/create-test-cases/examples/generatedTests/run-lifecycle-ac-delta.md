---
feature: manual-tests-execution
suite: run-lifecycle
references: _ac-baseline.md
baseline_acs_applicable: [AC-23, AC-24, AC-25, AC-26, AC-27, AC-28, AC-58, AC-59, AC-60, AC-61, AC-62, AC-63, AC-64, AC-65, AC-66, AC-67, AC-100]
delta_ac_count: 14
source: mixed
---

## Baseline ACs applicable to run-lifecycle

Owned outright (from A2 `Owns:`):
- AC-23 (baseline) — "Launch" transitions run to active/in-progress
- AC-24 (baseline) — "Continue" resumes an unfinished run from Runs list
- AC-25 (baseline) — "Finish Run" transitions ongoing run to Finished with a confirmation dialog
- AC-26 (baseline) — Finishing a run with Pending tests marks those Pending as Skipped
- AC-27 (baseline) — Edit unfinished run: Assign to, Title, Environment, Description, Trash-delete tests, +Tests, +Plans
- AC-28 (baseline) — Finish Run is gated by a confirmation dialog (cancellable terminal transition)
- AC-58 (baseline) — "Relaunch" (manual) re-opens the same run in Manual Runner
- AC-59 (baseline) — "Relaunch Failed on CI" — failed automated go to CI, failed manual open in runner
- AC-60 (baseline) — "Relaunch All on CI" re-runs all automated on CI
- AC-61 (baseline) — "Relaunch Manually" re-executes all tests manually in UI
- AC-62 (baseline) — "Advanced Relaunch" sidebar: custom title, Create new run, Keep values, per-test selection, Relaunch action
- AC-63 (baseline) — Advanced Relaunch Create-new-run:ON creates new Run ID; selected tests reset unless Keep values ON
- AC-64 (baseline) — Advanced Relaunch Create-new-run:OFF reuses original Run ID; only selected tests reset to Pending
- AC-65 (baseline) — Keep values:ON preserves selected/unselected statuses; OFF resets to Pending
- AC-67 (baseline) — "Launch a Copy" creates a separate duplicate run; both run and copy appear in Runs list

Baseline ACs applicable via cross-cutting concerns:
- AC-66 (baseline) — Filter-applied scope in Advanced Relaunch (concern F)
- AC-100 (baseline, UNCLEAR) — Permission matrix for Start/Finish/Relaunch; scoped to lifecycle actions only

Cross-cutting concerns this sub-feature must cover (from A2 § Cross-cutting):
- **Concern A (Multi-environment):** each env group spawns its own lifecycle in Sequence / Launch All — ≥1 test covering multi-env-run lifecycle
- **Concern B (Multi-user assignment):** Edit-run lets adding/removing assignees on an ongoing run — ≥1 test covering assignee edit on in-progress
- **Concern F (Filter applied):** Advanced Relaunch with a filter applied respects the filtered selection scope — ≥1 test (AC-66)
- **Concern G (Ongoing vs Finished state):** Continue/Finish/Relaunch gated by state — must cover ongoing-edit vs finished read-only

## Delta ACs (sub-feature-specific)

ac-delta-1: Running "Launch a Copy Manually" creates a new Run with the same scope and opens Manual Runner immediately (not CI). Distinct from AC-67 "Launch a Copy" which is generic duplicate.

ac-delta-2: After Advanced Relaunch "Relaunch" button click, sidebar closes and user is navigated to the Manual Runner of the target run (new Run if Create-new-run:ON, original Run if OFF).

ac-delta-3: Edit unfinished run `+ Tests` action appends the selected tests to the existing run without restarting it — added tests appear as Pending.

ac-delta-4: Edit unfinished run `+ Plans` action appends tests from a selected plan to the existing run — added tests appear as Pending.

ac-delta-5: Edit unfinished run Trash icon on a test row removes that test from the run; removal persists after Save.

ac-delta-6: Edit unfinished run "Save" persists edits; "Cancel" discards them — no implicit save on navigation away.

ac-delta-7: "Continue" action is visible only on ongoing/unfinished runs (not on Finished runs); clicking Continue navigates to `/projects/{project}/runs/launch/{id}/`.

ac-delta-8: Relaunch ▾ menu items (Relaunch / Launch a Copy / Advanced Relaunch / Relaunch Failed on CI / Relaunch All on CI / Relaunch Manually) are exposed on FINISHED runs only, from the row extra-menu on the Runs list and from the Run Report / Run Detail.

ac-delta-9: Finish Run confirmation dialog message states the count of not-run tests and announces they will be marked as Skipped (unless linked to another result).

ac-delta-10: Cancelling the Finish Run confirmation (native browser dialog "Cancel") leaves the run in its current ongoing state — no status change, runner remains open.

ac-delta-11: Advanced Relaunch "Keep values" toggle is enabled only when "Create new run" is ON; toggling Create-new-run OFF disables/hides Keep values.

ac-delta-12: Advanced Relaunch sidebar supports per-test selection (checkboxes) with "Select all" honoring an active filter — selection reflects filtered set only (ties to AC-66).

ac-delta-13: Launched new run inherits source run's Title (with a relaunch indicator), assignees, environment, and RunGroup unless a custom title is supplied in Advanced Relaunch.

ac-delta-14: Running a Relaunch variant on a Mixed run honors the variant's CI/UI routing (CI-variants trigger CI runner for automated tests while manual tests open Manual Runner — UI-variants stay in the Manual Runner for all tests).
