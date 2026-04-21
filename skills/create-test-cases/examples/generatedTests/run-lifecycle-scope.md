---
feature: manual-tests-execution
suite: run-lifecycle
references:
  - _ac-baseline.md
  - _shared-ui.md
  - run-lifecycle-ac-delta.md
  - run-lifecycle-ui-delta.md
approved_at: 2026-04-18
---

# Scope Contract: run-lifecycle

## In Scope

### Launch & Continue
- **AC-23** — "Launch" transitions run to active (in-progress) state
- **AC-24** — "Continue" resumes unfinished run from Runs list / Run Detail panel
- **ac-delta-7** — "Continue" visible only on unfinished runs (state gate)

### Finish Run
- **AC-25, AC-28** — Finish Run triggers browser native `confirm()` dialog
- **ac-delta-9** — Dialog message states pending test count with fixed text: `"{N} tests were not run. Pending tests that are not linked to any other test result will be marked as skipped."`
- **AC-26** — OK → run Finished; Pending tests become Skipped
- **ac-delta-10** — Cancel → run stays ongoing, runner remains open

### Edit Ongoing Run
- **AC-27** — Edit form: Title / Assign users / Environment / Description
- **ac-delta-3** — `+ Tests` tab appends tests (appear as Pending)
- **ac-delta-4** — `+ Plans` tab appends plan's tests (appear as Pending)
- **ac-delta-5** — Row-level Trash icon removes a test from the run
- **ac-delta-6** — Save persists edits; Cancel discards
- **Concern B** — Adding/removing assignees on an in-progress run

### Relaunch variants (manual runs)
- **AC-58** — "Relaunch" re-opens same Run ID in Manual Runner
- **AC-67** — "Launch a Copy" creates a duplicate run with a new ID

### Advanced Relaunch
- **AC-62** — Sidebar exposes: custom Title, "Create new run" toggle, "Keep values" toggle, per-test selection, "Relaunch" action
- **AC-63** — "Create new run": ON → new Run ID; selected tests reset unless Keep values ON
- **AC-64** — "Create new run": OFF → reuses original Run ID; only selected tests reset to Pending
- **AC-65** — Keep values ON preserves selected/unselected statuses; OFF resets to Pending
- **ac-delta-11** — Keep values disabled while Create new run is OFF
- **AC-66, ac-delta-12** — With filter applied, "Select All (N)" and per-test checkboxes operate on the filtered set only (Concern F)
- **ac-delta-2** — "Relaunch" button closes sidebar and navigates to the target runner
- **ac-delta-13** — Blank custom title → new run inherits source run's title (with relaunch indicator)

### State gating (Concern G — ongoing vs finished)
- **ac-delta-8** — Row menu on FINISHED runs shows `Relaunch / Advanced Relaunch / Launch a Copy`; on UNFINISHED runs shows `Launch / Edit / Finish`. Menus are mutually exclusive.

### Multi-environment lifecycle (Concern A)
- ≥1 test covering lifecycle of a multi-env run (Finish / Relaunch behaviour). If no multi-env run can be created in test data, fall back to verifying the multi-env parent's child-run listing + Finish independence.

## Out of Scope

- **AC-59** "Relaunch Failed on CI" — menu item does not appear on purely manual runs; no automated/mixed run exists in `project-for-testing`. Covered as `@unclear` deferred test citing doc-level expected behaviour.
- **AC-60** "Relaunch All on CI" — same as AC-59.
- **AC-61** "Relaunch Manually" — same as AC-59.
- **ac-delta-1** "Launch a Copy Manually" — variant not visible in project UI for manual runs; covered as `@unclear` deferred test.
- **ac-delta-14** Mixed-run relaunch CI/UI routing — no mixed runs exist in project; covered as `@unclear` deferred test.
- **AC-100** Full permission matrix (role-based gating on Start/Finish/Relaunch) — UNCLEAR in baseline; one `@unclear` placeholder test documenting the uncertainty.

## Unclear ACs

- AC-59, AC-60, AC-61 — UI surface unverifiable in `project-for-testing`; tests carry `@unclear` tag + `automation: deferred` + `automation-note: "No automated/mixed run fixture in project-for-testing; surface to be confirmed when fixture data exists."`
- ac-delta-1 — "Launch a Copy Manually" label/placement unverified.
- ac-delta-14 — Mixed-run routing unverified.
- ac-delta-6 — Edit Run save toast text presumed `"Run has been updated"`; `@unclear` until confirmed.
- AC-100 — Full role permission matrix for lifecycle actions.

## Sources Used

- `_ac-baseline.md` — AC-23..28, AC-58..67, AC-100
- `run-lifecycle-ac-delta.md` — ac-delta-1..14 (14 delta ACs on top of 17 applicable baseline ACs)
- `_shared-ui.md` — Runs list row menu, Manual Runner Finish button, Edit Run Page base, Run Detail panel
- `run-lifecycle-ui-delta.md` — 42 delta UI elements, 4 verified flows (Finish cancel, Relaunch finished, Advanced Relaunch gating, Continue from panel)
- `destructuring.md` §6 (ownership) + Cross-cutting concerns A (multi-env), B (multi-user assign), F (filter applied), G (ongoing vs finished)

## Cross-cutting coverage requirements

- **Concern A (Multi-environment):** ≥1 lifecycle test on a multi-env parent run.
- **Concern B (Multi-user assignment):** ≥1 Edit-run test adding/removing assignees on an ongoing run.
- **Concern F (Filter applied):** ≥1 Advanced Relaunch test with a filter active, verifying Select All respects it.
- **Concern G (Ongoing vs Finished):** ≥1 test each for state-gated menu items (ongoing-only Edit/Finish/Launch; finished-only Relaunch variants).
