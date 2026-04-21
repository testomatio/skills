---
feature: manual-tests-execution
suite: bulk-status-actions
references: _ac-baseline.md
baseline_acs_applicable: [AC-29, AC-30, AC-31, AC-66, AC-93, AC-94, AC-95]
delta_ac_count: 11
source: mixed
---

## Baseline ACs applicable to bulk-status-actions

- AC-29 (baseline) — bulk action picks one of PASSED / FAILED / SKIPPED and applies it to every selected test
- AC-30 (baseline) — Result message is optional during bulk apply (same contract as single-test)
- AC-31 (baseline) — custom status dropdown shown after standard status chosen — applies in the bulk picker too (to verify in UI; if absent mark @unclear and surface to user)
- AC-66 (baseline, cross-cutting F) — when a filter is applied in the runner, bulk selection methods include only tests matching the filter
- AC-93 (baseline, primary) — Manual Runner multi-select exposes bulk actions (Assign to, Result message with status, and others); Assign-to-in-bulk is owned by #3 — here we only own Result message
- AC-94 (baseline, primary) — Bulk "Result message" requires a status choice + optional message → "Apply"; statuses reflect immediately
- AC-95 (baseline, primary) — Status counters (Passed N / Failed N / Skipped N / Pending N) in the Manual Runner header update immediately after a bulk apply

## Cross-cutting concerns that land here

- **F. Filter applied vs not (selection scope)** — must-test: bulk-apply with filter applied covers only matching tests (mapped to AC-66)
- **H. Bulk multi-select mode** — must-test: activating Multi-Select in the runner exposes the bulk-action bottom toolbar, then at least one bulk result-message scenario (mapped to AC-93/AC-94)

## Delta ACs (sub-feature-specific)

ac-delta-1: Entering Multi-Select mode in the Manual Runner reveals per-test checkboxes and a bulk-action bottom toolbar; the test tree stays interactive but selection replaces single-test result entry as the primary affordance.

ac-delta-2: Exiting Multi-Select (toggling the mode off, clicking a dedicated Clear / Cancel affordance, or leaving the runner) clears current selections and hides the bulk-action toolbar.

ac-delta-3: "Select all" in Multi-Select mode selects every test currently visible in the runner tree (= all tests when no filter is applied, or only filter-matching tests when a filter is active).

ac-delta-4: Per-test checkboxes allow selecting tests one by one; selected tests are visibly marked (checkbox + row highlight or equivalent) and the bulk toolbar's selection counter reflects the count.

ac-delta-5: With zero tests selected, the bulk-action bottom toolbar is not rendered at all — there is no empty-state toolbar and no way to launch a bulk apply against an empty set.

ac-delta-6: Result message bulk-apply dialog workflow — user opens the "Result message" modal from the bulk toolbar, selects a standard status (PASSED / FAILED / SKIPPED — Apply stays disabled until a status is picked), optionally types a message in the textarea, and clicks "Apply" to commit; modal closes silently (no toast).

ac-delta-7: Cancelling the "Result message" modal before Apply (Close × button or Escape) does NOT apply any status change AND also clears the current selection — the bulk toolbar disappears together with the modal.

ac-delta-8: A bulk apply updates every selected test's recorded status AND (when supplied) the Result message in a single commit; the runner tree visibly shows the new status per test afterwards (status icon updates without page reload).

ac-delta-9: When a bulk apply commits, the aggregate status counters in the Manual Runner header increment by the number of affected tests and the previous counters (e.g. Pending) decrement accordingly — updates happen immediately without page reload.

ac-delta-10: The bulk-action bottom toolbar additionally exposes quick-set status buttons PASSED / FAILED / SKIPPED that apply the status to the current selection directly (without opening the "Result message" modal). Each quick-set button shows a browser-native confirm dialog ("Are you sure to set status '{status}' for all selected tests?") — Accept applies; Cancel leaves state unchanged.

ac-delta-11: A dedicated Clear-Selection (×) affordance in the bulk toolbar clears every current selection and hides the toolbar while keeping Multi-Select mode active (per-test checkboxes stay visible, selection count becomes 0).

## Notes

- Bulk **Assign to** is explicitly owned by #3 tester-assignment (see destructuring "Does NOT own"); any Assign-specific variants are out of scope here even though they share the bottom toolbar.
- Multi-select on the **Runs list** is owned by #7 runs-list-management — out of scope here.
- Custom-status applicability in bulk (AC-31 carry-over) is listed as applicable but will be marked `@unclear` in the scope if UI exploration cannot confirm the exact affordance.
