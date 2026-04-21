# Phase 3 Self-Review Report

**Reviewed at:** 2026-04-18T00:00:00Z
**Reviewed by:** test-case-reviewer (subagent)
**Suite:** environment-configuration
**Test count:** 19
**Coverage depth:** regression
**Auto-fixes applied:** 2

---

## Blocking violations (must fix before publish)

### Gate 2 — Priority pyramid skew

The suite has 5 critical tests (26.3%) against a ≤15% ceiling, and 5 normal tests (26.3%) against a ≥35% floor. High is 7 tests (36.8%), marginally above the ≤35% ceiling by one test.

Current distribution: critical 5 (26.3%), high 7 (36.8%), normal 5 (26.3%), low 2 (10.5%)
Required: critical ≤15% (≤3 tests), high ≤35% (≤7 tests), normal ≥35% (≥7 tests), low ≥5% (≥1 test)

Tests currently marked `critical` that are candidates for downgrade:
- `modal-lifecycle.md` — "Open Multi-Environment Configuration modal from the sidebar" (t1): Opens the modal and confirms initial state. This is a foundational smoke test but not a critical-impact failure path; consider `high`.
- `modal-lifecycle.md` — "Save one-group env selection commits it to the sidebar" (t3): Core happy-path save; important but not uniquely critical vs. "Launch in Sequence" and "Launch All" creating RunGroups. Consider `high`.
- `group-management.md` — "Add a second env group via Add Environment" (t4): Smoke test for adding a second group; parallel to t3 in modal-lifecycle. Consider `high`.

If those 3 are moved to `high` (bringing critical to 2, high to 10), high would then be 52.6% — too high. The real fix is to move several `high` tests to `normal` as well. Recommend: keep `launch-variants` t3 and t4 (Launch in Sequence, Launch All) at critical; downgrade the three above to high; then move group-management t1 ("Select multiple envs"), t2 ("All checkbox"), launch-variants t2 ("Two env groups replace"), and validation-and-edge t2 ("Launch All + Without tests") from high to normal. Result would be: critical 2 (10.5%), high 3 (15.8%), normal 12 (63.2%), low 2 (10.5%) — within pyramid.

**Not auto-fixed** — priority changes require human judgment on business impact.

---

### Gate 3 — Scenario balance skew

Regression coverage depth requires: negative ≥20%, boundary ≥10%, happy ≤50%.

Current distribution (19 tests):
- happy/smoke (untagged + @smoke): 13 tests = 68.4% — **exceeds ≤50%**
- @negative: 2 tests = 10.5% — **below ≥20% (requires ≥4 tests)**
- @boundary: 2 tests = 10.5% — meets ≥10%
- @unclear + @needs-project-setting: 2 tests (deferred — excluded from live balance)

Even excluding the 2 deferred tests (17 evaluable tests): happy = 13/17 = 76.5%, negative = 2/17 = 11.8% — both still out of bounds.

Missing negative scenarios to consider adding:
- Attempt to launch ("Launch in Sequence" or "Launch All") with all env groups empty — verifies scope-level or run-level error state.
- Dismiss the modal via outside click (if supported) — or explicit verification that outside-click does NOT dismiss (if not supported).
- Attempt to add more than N env groups (if there is a limit) — documents the ceiling behavior.
- Re-open modal after "Launch All" succeeds and sidebar is closed — negative state: modal should not be re-accessible from a completed sidebar.

**Not auto-fixed** — requires new test creation.

---

## Advisory violations (acceptable depending on context)

### Gate 6 — E2E title pattern

- `validation-and-edge.md` t2: "`Launch All` with `Without tests` scope shows a scope validation banner" — the title uses the "X shows Y" pattern (subject performs show/display action), which is flagged in self-review-checks.md § 6. However the test content IS genuinely E2E (user clicks Launch All, receives a banner error, then re-attempts with a corrected scope). Suggested rewrite: "Clicking `Launch All` with `Without tests` scope surfaces the `Select a plan or select all` validation banner and no run is created."

### Gate 4 — Scope boundary on Purge steps

- `launch-variants.md` t3 and t4, `validation-and-edge.md` t2: These tests include a "Post-condition cleanup" step that exercises `Purge` on the created RunGroup. The scope contract lists "Purge / Archive of multi-env RunGroups" as Out of Scope (owned by #9 archive-and-purge). Using Purge as a cleanup step is pragmatically acceptable because:
  (a) the step's purpose is test isolation, not coverage of Purge behavior, and
  (b) the `_Expected_:` for that step asserts only the cleanup success banner, not Purge semantics.
  No change required; noted here for the reviewer's awareness.

### Gate 2 — high threshold

High is 7 tests (36.8%) — exceeds the ≤35% ceiling by 0.3 percentage points (one test). This resolves automatically if any one high-priority test is moved to normal as part of the Gate 2 pyramid fix above.

---

## Auto-fixes applied

1. `validation-and-edge.md` line 59 — **compound step split**: "Dismiss the banner and switch the scope to `All tests`" was a single step combining two distinct user actions. Split into: (a) "Click the `Dismiss` button on the validation banner" with its own `_Expected_:`, and (b) "Switch the scope to `All tests`" with its own `_Expected_:`.

2. `validation-and-edge.md` line 112 — **inline AC ref removed** (Gate 11): The test description body contained the inline text "AC-48" (`"Documents the ongoing investigation of AC-48 (single-run multi-env mode)."`). Per test-case-format.md, AC traceability belongs exclusively in the `source:` frontmatter field. Replaced with semantic description: "the single-run multi-environment mode (see `source:` for AC traceability)."

---

## Distributions

- Scenario balance: happy/smoke 68.4% (13), negative 10.5% (2), boundary 10.5% (2), unclear/deferred 10.5% (2)
- Priority pyramid: critical 26.3% (5), high 36.8% (7), normal 26.3% (5), low 10.5% (2)
- Automation: candidate 89.5% (17), deferred 10.5% (2), manual-only 0%
- AC coverage: 21/21 ACs (100%)
- UI element coverage: all named UI elements from the combined catalog (shared + delta) referenced in steps — no orphaned catalog elements identified
- Cross-cutting concern A: covered by launch-variants.md t3 (Launch in Sequence) and t4 (Launch All)

---

## Suggestions

1. **Priority pyramid (blocking):** Downgrade 3 critical tests (modal-lifecycle t1, modal-lifecycle t3, group-management t4) to `high`; downgrade 4 high tests (group-management t1, t2, launch-variants t2, validation-and-edge t2) to `normal`. Verify resulting pyramid: critical 2/19 (10.5%), high 3/19 (15.8%), normal 12/19 (63.2%), low 2/19 (10.5%).

2. **Negative balance (blocking):** Add ≥2 negative tests to bring @negative count to ≥4 (≥21% of 19). Strongest candidates: "Launch in Sequence with all empty env groups" and "Attempt to dismiss the modal via outside-click / Escape key verifies behavior."

3. **E2E title (advisory):** Rewrite validation-and-edge.md t2 title to start with the user action verb rather than the subject element.

4. **Deferred tests:** The two deferred tests (@unclear and @needs-project-setting) are correctly tagged and have `automation-note:`. No action needed until product clarification arrives (AC-48) or seed data is available (ac-delta-4).
