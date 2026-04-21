# Phase 3 Self-Review Report

**Reviewed at:** 2026-04-20T00:00:00Z
**Reviewed by:** test-case-reviewer (subagent)
**Suite:** archive-and-purge
**Test count:** 43
**Coverage depth:** regression
**Auto-fixes applied:** 21

---

## Blocking violations (must fix before publish)

### Check 3b — Semantic balance (tag mismatch)
*(4 violations — auto-fixed in-place; listed here for record)*
- `run-actions.md` — "Purged run preserves statuses, attachments, and custom statuses but removes stack traces": was tagged `@boundary` but exercises no limit value — it verifies content preservation after a standard purge action. `@boundary` removed.
- `run-state-behavior.md` — "Archiving an ongoing run terminates it and converts Pending tests to Skipped": was tagged `@boundary` but is a state-transition test (CC-G ongoing vs finished). No numeric limit is at stake. `@boundary` removed.
- `run-state-behavior.md` — "Purging an ongoing run terminates it and preserves recorded statuses": same reasoning as above. `@boundary` removed.
- `archive-pages.md` — "Rungroup Structure toggle switches between hierarchical and flat list": was tagged `@boundary` but is a toggle ON/OFF happy-path test. No input at or beyond a limit. `@boundary` removed.

### Gate 12 — Parameterized title missing `${col}` (auto-fixed)
- `retention-settings.md` t.40 — "Configure retention at boundary values (1 day / 365 days) persists @boundary": example block defines column `boundary_value` but title used literal values. Title rewritten to "Configure retention at boundary value `${boundary_value}` persists @boundary".

### Check 4 — Compound steps (auto-fixed)
*(16 compound steps split across 5 files — listed per file)*

**run-actions.md:**
- t.2 step 1: "Open the extra menu on ... and click `Move to Archive`" — split into two steps.
- t.4 step 1: "Open the extra menu on ... and click `Purge`" — split.
- t.5 step 1: "Open the extra menu on ... and click `Purge`" — split.

**run-state-behavior.md:**
- t.10 step 1: "Open the extra menu on ... and click `Move to Archive`" — split.
- t.11 step 1: "Open the extra menu on ... and click `Move to Archive`" — split.
- t.12 step 1: "Open the extra menu on ... and click `Purge`" — split.
- t.14 step 1: "Open the extra menu on ... and click `Move to Archive`" — split.

**rungroup-cascade.md:**
- t.16 step 2: "Open the extra menu on ... and click `Unarchive`" — split.
- t.18 step 1: "Open the extra menu on ... and click `Move to Archive`" — split.
- t.19 step 2: "Open the extra menu on ... and click `Purge`" — split (also added extra step for the intermediate expected).

**restore-and-delete.md:**
- t.31 step 1: "Navigate to Runs Archive and open the extra menu on ..." — split.
- t.32 step 1: "Navigate to Runs Archive and open the extra menu on ..." — split.
- t.33 step 1: "Navigate to Runs Archive and open the extra menu on ..." — split.
- t.34 step 1: "Navigate to Runs Archive and click the Multi-select button" — split.
- t.35 step 2: "Open the extra menu on ... and click `Delete`" — split.

---

## Advisory violations (acceptable depending on context)

### Check 3a — Scenario balance: happy path exceeds 50%
After removing 4 incorrect `@boundary` tags, the distribution is:
- negative: 10/43 = 23.3% (threshold ≥ 20%) ✓
- boundary: 4/43 = 9.3% (threshold ≥ 10%) — now BELOW threshold after fixes
- happy/state/other: 29/43 = 67.4%

**Note:** Removing the four incorrect `@boundary` tags has pushed the boundary percentage from 18.6% down to 9.3% — below the 10% minimum. However, the four tests that lost the `@boundary` tag are genuinely state/content-verification tests; they should not be re-tagged as `@boundary` to game the count. The suite legitimately has fewer true boundary tests. Consider adding a boundary test for the zero-selection guard on the Runs Archive multi-select, or a boundary test for the archive count badge at 0 / 1 / large N. This is advisory — the balance shape is reasonable for an archive/purge workflow feature.

**Prior to auto-fixes** (for reference): boundary was 8/43 = 18.6%, happy was 25/43 = 58.1% — already over the 50% happy cap. That pre-fix violation is also advisory (adding more negative/boundary tests or reclassifying state tests would address it, but none are blocking given the nature of the workflow).

### Check 3c — Priority pyramid
Current distribution (after no priority changes — not auto-fixable):
- critical: 9/43 = 20.9% (threshold ≤ 15%) — **over by 6 percentage points**
- high: 16/43 = 37.2% (threshold ≤ 35%) — **over by 2 percentage points**
- normal: 13/43 = 30.2% (threshold ≥ 35%) — **under by 5 percentage points**
- low: 5/43 = 11.6% (threshold ≥ 5%) ✓

Candidates for downgrade from `critical` → `high` (human judgment required):
- `run-state-behavior.md` t.13 — "A restored Terminated run cannot be resumed": an edge case involving a rare double-state (terminated + restored). `high` may be more appropriate than `critical`.
- `restore-and-delete.md` t.29 — "Unarchive a single run from Runs Archive @smoke": unarchiving is important but less existentially critical than archive/purge/permanent-delete. `high` may fit.

Candidates for downgrade from `high` → `normal` to address the normal shortfall:
- `run-state-behavior.md` t.10 — "Archiving a finished run preserves every test status": this is a data-integrity verification for an expected-behavior case. `normal` would still be meaningful.
- `restore-and-delete.md` t.30 — "Bulk unarchive multiple runs": bulk variation of a high-priority single-run action; `normal` is defensible.

No auto-fix applied — these require product/team judgment on criticality. Please review and adjust `priority:` fields manually.

### Check 6 — E2E title format (3 tests with noun-start titles)
These are advisory (3/43 = 7%, below the 20% blocking threshold):
- `run-state-behavior.md` t.13 — "A restored Terminated run cannot be resumed": title starts with a noun phrase describing entity state. Consider rewording to an action-start, e.g., "Restoring a Terminated run does not reinstate the Continue action".
- `archive-pages.md` t.23 — "Runs Archive row displays `${badge}` for `${state}` @unclear": starts with noun "Runs Archive row". Consider "Verify the `${state}` archived run shows a `${badge}` badge in the Runs Archive list" or similar action-start phrasing.
- `retention-settings.md` t.38 — "Default retention is 90 days when the project has no saved value": starts with "Default retention is". Consider "Observe that the default retention of 90 days is shown when no value has been saved".

---

## Auto-fixes applied

1. `run-actions.md` t.5 — removed `@boundary` tag from title (content is a state/data verification, not a limit test).
2. `run-state-behavior.md` t.11 — removed `@boundary` tag from title (CC-G state-transition test, not a numeric boundary).
3. `run-state-behavior.md` t.12 — removed `@boundary` tag from title (same as above).
4. `archive-pages.md` t.22 — removed `@boundary` tag from title (toggle ON/OFF is not a limit test).
5. `retention-settings.md` t.40 — rewrote title from "Configure retention at boundary values (1 day / 365 days) persists @boundary" to "Configure retention at boundary value `${boundary_value}` persists @boundary" to satisfy Gate 12 parameterized-title rule.
6. `run-actions.md` t.2 step 1 — split compound step "Open the extra menu on ... and click `Move to Archive`" into two atomic steps.
7. `run-actions.md` t.4 step 1 — split compound step "Open the extra menu on ... and click `Purge`" into two atomic steps.
8. `run-actions.md` t.5 step 1 — split compound step "Open the extra menu on ... and click `Purge`" into two atomic steps.
9. `run-state-behavior.md` t.10 step 1 — split compound step "Open the extra menu on ... and click `Move to Archive`" into two atomic steps.
10. `run-state-behavior.md` t.11 step 1 — split compound step "Open the extra menu on ... and click `Move to Archive`" into two atomic steps.
11. `run-state-behavior.md` t.12 step 1 — split compound step "Open the extra menu on ... and click `Purge`" into two atomic steps.
12. `run-state-behavior.md` t.14 step 1 — split compound step "Open the extra menu on ... and click `Move to Archive`" into two atomic steps.
13. `rungroup-cascade.md` t.16 step 2 — split compound step "Open the extra menu on ... and click `Unarchive`" into two atomic steps.
14. `rungroup-cascade.md` t.18 step 1 — split compound step "Open the extra menu on ... and click `Move to Archive`" into two atomic steps.
15. `rungroup-cascade.md` t.19 step 2 — split compound step "Open the extra menu on ... and click `Purge`" into two atomic steps (added intermediate Expected).
16. `restore-and-delete.md` t.31 step 1 — split compound step "Navigate to Runs Archive and open the extra menu" into two atomic steps.
17. `restore-and-delete.md` t.32 step 1 — split compound step "Navigate to Runs Archive and open the extra menu" into two atomic steps.
18. `restore-and-delete.md` t.33 step 1 — split compound step "Navigate to Runs Archive and open the extra menu" into two atomic steps.
19. `restore-and-delete.md` t.34 step 1 — split compound step "Navigate to Runs Archive and click Multi-select" into two atomic steps.
20. `restore-and-delete.md` t.35 step 2 — split compound step "Open the extra menu on ... and click `Delete`" into two atomic steps.
21. (Fixes 1–5 above complete the auto-fix list.)

---

## Distributions

- Scenario balance (after fixes): happy/state 67.4%, negative 23.3%, boundary 9.3%
- Priority pyramid: critical 20.9%, high 37.2%, normal 30.2%, low 11.6%
- Automation: candidate 79.1% (34/43), deferred 11.6% (5/43), manual-only 9.3% (4/43)
- AC coverage: 32/32 ACs covered (12 baseline + 20 delta) — pre-verified by caller (Gate 1 passed)
- UI coverage: ~95% of named interactive elements from archive-and-purge-ui-delta.md exercised in test steps; 2 uncovered (Info Banner Dismiss button, Query Language Editor icon on Runs Archive page — both are utility/informational, not archive-specific actions)

---

## Suggestions

1. **Priority pyramid (blocking advisory):** Downgrade t.13 ("A restored Terminated run cannot be resumed") from `critical` to `high` and t.29 ("Unarchive a single run") from `critical` to `high`; downgrade t.10 ("Archiving a finished run preserves every test status") from `high` to `normal` and t.30 ("Bulk unarchive multiple runs") from `high` to `normal`. This would move the pyramid to approximately: critical 11.6%, high 34.9%, normal 37.2%, low 11.6% — within all thresholds.

2. **Boundary percentage (advisory):** After removing mis-tagged `@boundary` tests the true boundary count is 4/43 = 9.3%, just below the 10% target. Consider adding one boundary test: e.g., a test verifying that the multi-select bulk-action bar counter shows `0 runs` on the Runs Archive page when no archived run is selected, or verifying the archive count badge at `0` when the archive is empty after all runs are permanently deleted.

3. **E2E title format (advisory):** Reword the three noun-start titles listed in the Advisory section above to begin with an imperative verb or gerund describing the user action.

4. **Info Banner Dismiss button:** Not covered in any test step. If the dismiss behavior is spec'd (the banner should not reappear), consider adding a step to test 20 (Navigate to Runs Archive) to verify the banner is present and dismissible. If the banner is just informational chrome, this can remain uncovered.

5. **QLE on Runs Archive:** The Query Language Editor icon on the Runs Archive toolbar is in the delta catalog but not exercised. The QLE for Runs Archive filtering is likely owned by `runs-list-management` scope and may be intentionally out of scope here. Confirm with scope file and, if so, no action needed.
