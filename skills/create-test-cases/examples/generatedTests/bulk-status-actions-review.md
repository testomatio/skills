# Phase 3 Self-Review Report

**Reviewed at:** 2026-04-19T00:00:00Z
**Reviewed by:** test-case-reviewer (subagent)
**Suite:** bulk-status-actions
**Test count:** 15 (3 parameterized, counted as 1 each for gate calculations)
**Coverage depth:** regression
**Auto-fixes applied:** 1

---

## Blocking violations (must fix before publish)

### Check 8 — Step quality

- **T5 (`selection-mechanics.md`) — "Suite-level checkbox selects every test in the suite"** has only 2 steps. Minimum is 3 for a standalone non-parameterized test. The two steps cover "select all" and "deselect all" but miss a verification of the per-row highlight state in between. Suggested addition: after clicking the suite checkbox (step 1), add an intermediate step asserting that the row highlight is visible on each test row before proceeding to the deselect step. This makes the positive visual state an explicit, observable assertion rather than an implicit side-effect of the counter check.

### Check 9 — Parameterization consistency

- **T5 (`selection-mechanics.md`) — "Suite-level checkbox selects every test in the suite"** uses the token `${M}` inside the Preconditions section (`exactly ${M} tests (M ≥ 3) visible`) but: (a) the test title does not contain a `${col}` token, and (b) there is no `<!-- example -->` table below the test body. Per the style guide, parameterized tests must use `${snake_case}` in the title AND have an `<!-- example -->` table. Resolution options (choose one): **Option A** — make this a concrete non-parameterized test: replace `${M}` with a fixed number (e.g., `6 tests`) throughout and remove the parametric framing. **Option B** — convert to a proper parameterized test: rename the title to include `${suite_test_count}` (or similar), add at least 2 example rows (e.g., M=3, M=6), and wire the token into both steps and expectations.

---

## Advisory violations (acceptable depending on context)

### Check 7 — Priority pyramid

- **high = 40% (6/15), exceeds the 35% ceiling by 1 test.** The `normal` bucket sits at 33.3% (5/15), just below the 35% floor. The imbalance is exactly one misclassified test. Candidates for downgrade to `normal`:
  - **T10** ("Bulk quick-set ${status} via toolbar with native confirm Accept applies the status @smoke") — marked `deferred` automation because of the native dialog; quick-set toolbar is a secondary apply path (the primary is the Result Message modal, T7). `normal` is defensible.
  - **T13** ("Suite-level checkbox with a status filter active selects only filter-matching tests @boundary") — an important correctness gate (AC-66) but exercises a boundary interaction rather than a primary workflow. `normal` is also defensible.
  - Reassigning either one of the above to `normal` brings both buckets into range (high = 33.3%, normal = 40%). This is a judgment call for the test author; the reviewer does not auto-fix priorities.

---

## Auto-fixes applied

1. **T3 (`multi-select-mode.md`) — element name corrected:** "the 'Close' (×) icon" and "the close icon" in the steps were renamed to "the 'Clear Selection' (×) icon". The delta catalog (`bulk-status-actions-ui-delta.md`) names the bulk toolbar affordance **"Clear Selection (×)"** and separately names the Result Message modal's dismiss affordance **"Close (×)"**. Using "Close (×)" for the toolbar button was ambiguous — it matches the modal's close button name and could cause a tester to click the wrong control during execution.

---

## Distributions

- **Scenario balance:** happy ~47% (7/15), negative 20% (3/15), boundary 27% (4/15), unclear/special 7% (1/15)
- **Priority pyramid:** critical 13.3% (2/15), high 40% (6/15), normal 33.3% (5/15), low 6.7% (1/15)
- **Automation:** candidate 80% (12/15), deferred 20% (3/15), manual-only 0%
- **AC coverage:** 18/18 ACs covered (100%) — AC-29, AC-30, AC-31, AC-66, AC-93, AC-94, AC-95, ac-delta-1 through ac-delta-11 each linked by ≥1 test
- **UI element coverage:** ~21/22 delta elements exercised in action steps (~95%) — 'Collapse all' appears only as a spatial landmark in an Expected line (T1), never as a tested action; this is intentional since its behavior is shared/baseline

---

## Suggestions

1. **Fix T5 first** — it has two independent issues (step count and parameterization) and fixing them together is cleaner than separate passes. Option A (make it concrete with 6 tests, add a 3rd step verifying row highlight) is the lower-effort path and aligns with how T6 ("toolbar not rendered") handles a similarly simple boundary case.

2. **Priority pyramid** — if T10 is downgraded to `normal`, its `@smoke` tag should also be reconsidered: a smoke-tagged test at `normal` priority is unusual (smoke is typically `high` or `critical`). Either keep T10 at `high` and accept the advisory, or drop the `@smoke` tag at the same time as the downgrade. The overall smoke count (T1 + T7 + T10) drops from 3 to 2 smoke tests if T10 is de-smoked, which is still within reasonable bounds for a regression suite.

3. **T5 example table if going Option B** — if converting to parameterized, limit to ≤4 rows per the style guide. Two rows (M=3, M=6) are sufficient to demonstrate behavior at a small and medium suite size.

4. **No AC gaps, no scope violations, no role-name leakage, no impl-leakage, no missing automation-notes** — the suite is in good shape overall. Resolve the two blocking items in T5 and this suite is publish-ready.
