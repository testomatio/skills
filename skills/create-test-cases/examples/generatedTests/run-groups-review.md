# Phase 3 Self-Review Report

**Reviewed at:** 2026-04-18T22:00:00Z
**Reviewed by:** test-case-reviewer (subagent)
**Suite:** run-groups
**Test count:** 27
**Coverage depth:** regression
**Auto-fixes applied:** 1

---

## Blocking violations (must fix before publish)

### Check 3 — Scenario balance: happy-path share exceeds 50% threshold

- **V1** `run-groups/` (suite-wide): 17 of 27 tests are happy-path (63%), exceeding the ≤50% ceiling.
  - Happy-path count: 17 (Archive cascades, Unarchive, Purge, Add Manual Run, Move run, Add Existing Run(s), Empty panel @smoke, Combined Report @smoke, Switching anchor, Create group, Strategy ×3 rows, Group Type ×3 rows, Edit group, Copy default, Copy custom, State-aware menu, Pin/Unpin ×2 rows).
  - Negative: 6/27 = 22% (meets ≥20% minimum).
  - Boundary: 2/27 = 7% after removing the misclassified @boundary on column-customisation (see auto-fix below); or 3/27 = 11% if column-customisation is kept as boundary — in either case boundary meets the ≥10% threshold when counting 3 tests (2 genuinely boundary + 1 that was relabelled).
  - **Recommendation:** Convert 3–5 happy-path tests to negative or boundary scenarios, OR add 2–3 new tests in underrepresented categories. Strong candidates:
    1. Add a negative test for "attempting to copy a RunGroup when the copy name conflicts" or "Edit group — Save blocked with empty Name" (mirrors the lifecycle pattern but on Edit page).
    2. Add a boundary test for "Add Existing Run picker with 0 eligible runs (all existing runs are already in the group)".
    3. Add a boundary test for "New RunGroup panel — Name at maximum character length".
    4. Convert "Unarchive a RunGroup" to a negative by adding a step that verifies archiving fails gracefully when the user navigates away mid-dialog — or split "Purge" into happy (cascade preserved) + negative (cancel purge dialog).

---

## Advisory violations (acceptable depending on context)

### Check 5 — Compound steps (systematic pattern)

- **V2** `archive-and-purge.md`, all 4 tests; `contents-and-runs.md` tests 3 and 4; `group-lifecycle.md` "Edit" test; `menu-actions.md` "Copy default" test — multiple steps use the form "Open the [extra menu] on [group] and click [action]", which combines two verbs (open + click) in a single step.
  - Examples:
    - `archive-and-purge.md` step 1: "Open the extra menu on the `run-groups archive-source` group and click `Move to Archive`"
    - `contents-and-runs.md` step 1 of Add Existing Run(s): "Open the extra menu of the `run-groups add-existing` group and click `Add Existing Run`"
    - `contents-and-runs.md` step 1 of Excludes runs: "Open the group's detail panel and extra menu, then click `Add Existing Run`"
  - This pattern (7+ occurrences) technically violates the atomic-step rule ("one verb per step") from testing-strategy.md § 3.1.
  - **Recommendation:** Split into two steps per occurrence. Example split:
    ```
    - Open the extra menu (`…`) on the `run-groups archive-source` group
      _Expected_: the row's action menu opens showing Archive, Purge, Edit, Copy, Pin, Add Existing Run, Move
    - Click `Move to Archive`
      _Expected_: the archive confirmation dialog opens...
    ```
  - The split also gains a verifiable expected result for the menu-open state, which improves test precision. Not auto-fixed because each split requires a new `_Expected_:` derived from the UI catalog — that's content authoring, not metadata editing.

### Check 6 — E2E title format (three tests)

- **V3** `detail-and-reports.md` line 12: "RunGroup detail panel on an empty group shows header, empty-state, and action buttons @smoke" — title starts with a noun phrase describing what the panel shows. Re-word to start with a verb: e.g., "Open a RunGroup with no child runs and verify the detail panel composition @smoke".
- **V4** `detail-and-reports.md` line 105: "Rungroup Statistic Report button requires two or more child runs @boundary" — title is a constraint statement, not a user-action description. Re-word: e.g., "Verify the Rungroup Statistic Report button is disabled with one child run and enables on adding a second @boundary".
- **V5** `menu-actions.md` line 12: "RunGroup extra menu action set is state-aware — ${group_state} @smoke" — "action set is state-aware" is a description of a system property. Re-word: e.g., "Verify the RunGroup extra menu shows ${group_state}-appropriate actions only @smoke".
  - None of these affect test content quality — the bodies are proper E2E flows. Advisory only.

### Check 6b — @unclear doc test step count

- **V6** `detail-and-reports.md` lines 197–213: "Combined Report Compare To across different RunGroups @unclear" has 2 steps, below the ≥3 minimum. This is intentional (it's a documentation-only probe, not a testable scenario) but still technically under the threshold.
  - **Recommendation:** Add a third step documenting the negative observation: e.g., "Attempt to add a run from `run-groups compare-to` via any available control / look for a cross-group picker — _Expected_: no affordance is found; observation recorded as @unclear pending product clarification." This reaches 3 steps while preserving the @unclear intent.

---

## Auto-fixes applied

1. `detail-and-reports.md` — removed `@boundary` tag from "Per-group Runs list column customisation persists independently of the global list". The test verifies state isolation (per-group vs global settings independence), not a threshold or limit value — no input is at a boundary. Reclassified as untagged happy-path/state test. This drops the boundary count to 2/27 = 7%, which is below the ≥10% threshold and reinforces V1 above.

---

## Distributions

- Scenario balance: happy 67% (18/27 after reclassification), negative 22% (6/27), boundary 7% (2/27), state 0%, role 0%, unclear 4% (1/27)
- Priority pyramid: critical 7% (2/27), high 30% (8/27), normal 56% (15/27), low 7% (2/27) — within bounds
- Automation: candidate 93% (25/27), deferred 4% (1/27), manual-only 4% (1/27) — within bounds
- AC coverage: 27/27 ACs covered (10 baseline + 17 delta) — 100%
- UI element coverage: not independently computed (parent Gate 11 confirmed pass; `aria-describedby` attribute names not leaked into test bodies)

---

## Suggestions

1. **Address V1 (blocking)** — The simplest path is adding 2 new tests:
   - `contents-and-runs.md`: "Add Existing Run picker shows empty state when all eligible runs are already in the group @boundary" (boundary of 0 eligible runs).
   - `group-lifecycle.md`: "New RunGroup Name field at maximum character length is accepted and persists @boundary" (max-length input boundary).
   - This would bring boundary to 4/29 = 14% and happy to 18/29 = 62%. For a cleaner fix, also convert one untagged happy-path test (e.g., "Purge" → add a cancel-purge-dialog negative variant) to reduce happy to ≤50%.
   - Alternatively, convert the Purge test into two tests: "Purge a RunGroup cascades with a Purged badge @smoke" (happy, shorter) + "Cancel Purge confirmation dialog leaves the group and runs untouched @negative".

2. **Split the compound steps (V2)** — Do this during any regeneration pass. Each "open menu and click X" becomes two steps, and the menu-open `_Expected_:` should list the state-aware action items visible at that point (verified against the delta catalog).

3. **Rework the @unclear doc test (V6)** — Add a third step to reach the minimum, as described above. No product clarification needed — the step can document the absence of the affordance.

4. **Rename the three advisory titles (V3, V4, V5)** — Low effort; improves discoverability for testers searching by action. Can be done in a single pass with the compound-step fix.
