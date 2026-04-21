# Phase 3 Self-Review Report

**Reviewed at:** 2026-04-18T00:00:00Z
**Reviewed by:** test-case-reviewer (subagent)
**Suite:** run-lifecycle
**Test count:** 31
**Coverage depth:** regression
**Auto-fixes applied:** 7

---

## Blocking violations (must fix before publish)

### Check 4 — Step Quality (min 3 steps)

- **basic-relaunch.md, "Relaunch menu items appear only on finished runs — not on unfinished runs @negative"** — this test has only 2 steps (even after the compound-step split auto-fix that added a third intermediate step). After the auto-fix the test now has 4 steps — violation resolved by auto-fix. See Auto-fixes section.

### Check 4 — Compound steps (not all auto-fixable)

All compound steps have been split via auto-fix. See Auto-fixes section below. No remaining compound-step violations.

---

## Advisory violations (acceptable depending on context)

### Check 3 — UI element coverage (~76%, below 80% target)

The following delta catalog elements are not referenced in any test step:

- **'Search'** combobox in the Advanced Relaunch sidebar — no test exercises search-by-title filtering within the Advanced Relaunch test list. The filter-by-status tests (t6) cover the status filter buttons but not the free-text search.
- **'Sort'** button and **'Sort direction toggle'** (Advanced Relaunch sidebar) — no test exercises sort ordering of the test list.
- **'None'** (deselect-all in the 'Select' dropdown, Advanced Relaunch sidebar) — the 'Cancel' path test (t7) implicitly covers abandonment but does not exercise the 'None' deselect control explicitly.
- **Back arrow** icon button in Edit Run form — no test navigates back via the back arrow (all tests use 'Cancel').
- **'Select All'** assign-users button (Edit Run form) — no test clicks 'Select All' in the assignees control.
- **'Remove assign users'** button (Edit Run form shared) — the tester-removal test (t2) removes via the chip's remove control, not via the 'Remove assign users' bulk button.
- **Manager chip** (read-only display in Edit Run form) — no test explicitly verifies the manager chip renders in the Edit Run header.
- **Keep values help icon** (tooltip `?` adjacent to 'Keep values') — not exercised; tooltip-only, acceptable.
- **Loading spinner** (Advanced Relaunch sidebar) — not exercised; transient loading state, acceptable.

Approximate coverage: 33/42 delta elements exercised (79%) — marginally below the 80% threshold. Combined with shared UI elements, overall coverage is acceptable. Human judgment: if regression depth requires 80%+ strict coverage, add one test for the 'Search' combobox in Advanced Relaunch and one for the 'Remove assign users' bulk button.

### Check 6 — E2E title style (noun-first titles)

Three tests have titles that describe a system state rather than a user action. Steps ARE E2E flows; only the title framing needs adjustment:

- **advanced-relaunch.md, "'Keep values' toggle is disabled while 'Create new run' is OFF @negative @boundary"** — describes the observed state. Suggested title: "Toggling 'Create new run' OFF disables the 'Keep values' toggle regardless of its prior state @negative @boundary"
- **cross-cutting.md, "Row extra-menu on ${run_state} runs exposes only ${available_items} lifecycle actions @boundary"** — describes the menu contents as a noun. Suggested: "Inspecting the row extra-menu on a ${run_state} run shows only ${available_items} lifecycle actions @boundary"
- **edit-ongoing-run.md, "Edit is not available on a finished run @negative"** — describes absence as a noun. Suggested: "Attempting to edit a finished run finds no Edit affordance in the menu or detail panel @negative"

These are stylistic; the coverage and test quality are not impacted.

### Check 8 — Non-deterministic expected result

- **edit-ongoing-run.md, "Edit is not available on a finished run @negative"**, last step expected result: `"Either the Edit form redirects back to the run's detail page OR the form loads in a read-only/disabled state with Save unavailable — record the deterministic form so automation can assert the gate"` — this OR-branch expected result cannot be mechanically asserted by automation. The exploratory note is appropriate for a manual tester but the test should carry `@unclear` to signal to the automation engineer that the exact redirect behavior is unconfirmed. The test currently sources `AC-27, ac-delta-8` with no `@unclear` tag, while equivalent tests for ac-delta-6 save-toast uncertainty are flagged in scope.md as `@unclear`. Suggested fix: append `@unclear` to this test's title, or split the two possible outcomes into deterministic alternatives once the redirect behavior is confirmed in product.

---

## Auto-fixes applied

1. **advanced-relaunch.md, t2 ("Advanced Relaunch with 'Create new run' ON creates a new Run ID")** — split compound step "Toggle 'Create new run' to ON, leave Title blank, leave 'Keep values' OFF" into two atomic steps: (1) "Toggle 'Create new run' to ON" + Expected; (2) "Leave the Title blank and leave 'Keep values' OFF" + Expected.

2. **advanced-relaunch.md, t5 ("Advanced Relaunch with a custom Title and per-test selection")** — split compound step "Fill the Title field with..., toggle 'Create new run' ON, leave 'Keep values' OFF" into two atomic steps: (1) "Fill the Title field with..." + Expected; (2) "Toggle 'Create new run' ON and leave 'Keep values' OFF" + Expected.

3. **advanced-relaunch.md, t6 ("'Select all' inside Advanced Relaunch respects an active status filter")** — split compound step "Toggle 'Create new run' ON, then click 'Relaunch'" into two atomic steps: (1) "Toggle 'Create new run' ON" + Expected; (2) "Click 'Relaunch'" + Expected.

4. **edit-ongoing-run.md, t2 ("Adding and removing testers on an ongoing run")** — split compound step "Reopen Edit Run and remove one of the testers via their chip's remove control, then click 'Save'" into two atomic steps: (1) "Reopen Edit Run and remove one of the testers via their chip's remove control" + Expected; (2) "Click 'Save'" + Expected.

5. **edit-ongoing-run.md, t6 ("Cancelling the Edit Run form discards pending changes @negative")** — split compound step "Change the Title to `TEMP-cancel-check` and switch the Environment to a different value" into two atomic steps: (1) "Change the Title to `TEMP-cancel-check`" + Expected; (2) "Switch the Environment to a different value" + Expected.

6. **basic-relaunch.md, t3 ("Relaunch menu items appear only on finished runs — not on unfinished runs @negative")** — split compound step "Close the menu and open the extra menu on the finished run's row" into two atomic steps: (1) "Close the unfinished run's menu" + Expected; (2) "Open the extra menu on the finished run's row" + Expected. This also resolves the 2-step minimum violation — test now has 4 steps.

7. **launch-and-continue.md, t4 ("Continue and Edit are not available on a finished run @negative")** — split compound step "Close the panel and open the extra menu on the finished run's row" into two atomic steps: (1) "Close the Run Detail panel" + Expected; (2) "Open the extra menu on the finished run's row" + Expected.

---

## Distributions

- Scenario balance: happy/smoke 42% (13/31), negative 23% (7/31), boundary 16% (5/31), unclear 19% (6/31) — all within regression thresholds
- Priority pyramid: critical 13% (4/31), high 35% (11/31), normal 39% (12/31), low 13% (4/31) — within thresholds
- Automation: candidate 81% (25/31), deferred 19% (6/31), manual-only 0% — healthy; all deferred have valid automation-notes
- AC coverage: 31/31 ACs covered (100%) — all baseline and delta ACs have at least one linked test
- UI coverage: ~33/42 delta elements exercised (79%) — marginally below 80% target; advisory

---

## Suggestions

1. **Advisory (UI coverage):** Add one test exercising the **'Search'** combobox in the Advanced Relaunch sidebar (e.g., "Searching by title in Advanced Relaunch filters the test list"). This is the most functional of the uncovered elements and would push coverage above 80%.

2. **Advisory (UI coverage):** Add one test for the **'Remove assign users'** bulk button in Edit Run (distinct from removing via individual chip). The existing test t2 covers chip-level removal; a test using the bulk-remove button would close that gap and add a boundary case (removing all assignees at once).

3. **Advisory (E2E title style):** Rename the three noun-first titles listed above to action-first phrasing. All are 1-line edits, no test content changes required.

4. **Advisory (unclear expected result):** Add `@unclear` tag to edit-ongoing-run.md t7 ("Edit is not available on a finished run") to signal the OR-branch redirect behavior is unconfirmed. Alternatively, once the deterministic redirect path is confirmed via UI exploration, update the expected result to the concrete single-path assertion.

5. **No action required on** AC coverage, cross-cutting concerns, priority pyramid, scenario balance, semantic tagging, automation classification, role name hygiene, scope compliance, or parameterization — all pass cleanly.

---

## UI Reality Check

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-18T12:35:00Z
**Tests walked:** 3
1. finish-run.md — "Finish Run confirms and terminates the run, marking Pending tests as Skipped" @smoke
2. basic-relaunch.md — "Relaunch menu items appear only on finished runs — not on unfinished runs" @negative
3. advanced-relaunch.md — "'Keep values' toggle is disabled while 'Create new run' is OFF" @negative @boundary

**Mismatches fixed:** 1
**Gaps:** 0

### Mismatch fixed

**basic-relaunch.md, test "Relaunch menu items appear only on finished runs", step 1 — unfinished run menu**

- Before: `Menu does NOT contain 'Relaunch' or 'Launch a Copy'; it DOES contain 'Launch', 'Edit', and 'Finish'`
- After: `Menu does NOT contain 'Relaunch' or 'Launch a Copy'; it DOES contain 'Launch', 'Advanced Relaunch', 'Edit', and 'Finish'`
- Evidence: Row context menu for unfinished run `19dd1706` showed: Launch, **Advanced Relaunch**, Edit, Finish, Pin, Export as PDF, Move, Labels, Move to Archive, Purge. The delta catalog (run-lifecycle-ui-delta.md § Screen: Runs List – Row Context Menu — UNFINISHED/IN-PROGRESS run) confirms 'Advanced Relaunch' is present on unfinished runs. The original test step was simply missing this item from the "DOES contain" list.

### Observations (no fix needed)

**finish-run.md, step 2 — dialog message text:** Verified via live browser confirm() dialog on run `19dd1706`. Exact message: `"2507 tests were not run. Pending tests that are not linked to any other test result will be marked as skipped."` — matches the template in the test case exactly. Pending count at time of trigger was 2507 (Passed=2, Failed=0, Skipped=0, Pending=2507).

**advanced-relaunch.md, all steps:** 'Create new run' checkbox defaults to unchecked (OFF); 'Keep values' is `[disabled]` while Create new run is OFF; toggling Create new run to ON activates Keep values (no longer disabled); toggling back to OFF re-disables Keep values. All four assertions verified live on run `5cff086c/advanced`.

**Finished run menu contains 'Launch a Copy' (conditional):** Run `5cff086c` (truly finished, has pass/fail results) shows `Relaunch, Advanced Relaunch, Launch a Copy` — matching the test's expected list for finished runs. Run `c02fff9b` (finished, all 2508 tests skipped via Finish button) shows only `Relaunch, Advanced Relaunch` without 'Launch a Copy'. This edge case is not covered by the existing test suite; it is noted here for automation engineers: 'Launch a Copy' absence on all-skipped finished runs may be a product quirk or expected behavior.
