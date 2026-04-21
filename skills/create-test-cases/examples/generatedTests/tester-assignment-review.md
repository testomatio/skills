# Phase 3 Self-Review Report

**Reviewed at:** 2026-04-18T00:00:00Z
**Reviewed by:** test-case-reviewer (subagent)
**Suite:** tester-assignment
**Test count:** 34
**Coverage depth:** regression
**Auto-fixes applied:** 1

---

## Blocking violations (must fix before publish)

None. All blocking checks pass.

---

## Advisory violations (acceptable depending on context)

### Check 6 — E2E format (title style)

**ADV-1 — cross-cutting.md T1 (title):** "Creator is shown as manager with an Assign more users entry point by default @smoke" starts with a noun phrase describing UI state rather than a user action. The test body IS an E2E journey (navigate → click → inspect → click), but the title reads as a snapshot assertion. Consider rewording to: "Opening the New Manual Run sidebar shows the creator as manager with the Assign more users entry point by default." (2/34 = 6%; below the 20% blocking threshold; advisory.)

**ADV-2 — runner-assignment-paths.md T33 (snapshot test):** "Run header avatar stack reflects all run-assigned users with tooltips" — all three steps are observations (navigate, inspect, hover). No user action is the test's subject. This is a snapshot/assertion-only test rather than an E2E journey. The content is covered as sub-verification in T14 (Concern B) and T25 (suite Assign to). Consider merging into a precondition-check step in T25 or T14, or retaining it and accepting the format deviation for this purely-observational coverage slot. (2/34 = 6%; below threshold; advisory.)

### Check 6b — Semantic balance

**ADV-3 — cross-cutting.md T15 @negative tag:** "Concern H × F — bulk Assign to in runner respects the active filter" carries @negative but the primary flow is a success scenario (bulk assignment succeeds; the negative guard is that non-matching tests must NOT be reassigned). The tag is defensible as a negative constraint test, but a tester scanning @negative tests will not expect a happy-path bulk-assign flow as the subject. Recommend adding @boundary to make the dual nature explicit, or documenting the @negative intent in the test's opening paragraph.

### Check 4 — Step quality (deferred assertion)

**ADV-4 — edit-run-assignment.md T18, step 4:** The _Expected_: for "Click the 'Save' button" includes "Added user is reflected on the run (verified in the next step)." This defers the observable result to the following step and does not assert anything observable at the save action itself. The step does also assert "Page navigates back to the Runs list or run detail view" which is observable, but the second bullet is meaningless as a standalone assertion. Recommend removing the deferred-verification note or folding it into the following step's _Expected_: intro.

---

## Auto-fixes applied

1. **cross-cutting.md T16, step 4** — split compound step "Enter Multi-Select mode, select two tests, click the bulk 'Assign to' button and select the qa user" into three atomic steps:
   - "Click the Multi-Select toggle in the runner toolbar" (new step)
   - "Check the checkboxes for two test rows" (new step)
   - "Click the 'Assign to' button in the bottom toolbar and select the qa user from the dropdown" (original step, trimmed)

---

## Distributions

- Scenario balance: happy 50%, negative 35%, boundary 21% (tests may carry multiple tags; percentages of 34-test total)
- Priority pyramid: critical 15% (5/34), high 21% (7/34), normal 59% (20/34), low 6% (2/34)
- Automation: candidate 82% (28/34), deferred 15% (5/34), manual-only 3% (1/34)
- AC coverage: 21/21 ACs covered (100%) — 8 baseline applicable + 13 delta
- UI coverage: ~27/28 delta elements exercised in action steps (96%); 1 element (suite-row unassigned visual state) only noted in catalog as "unconfirmed — not directly observed" and not exercised explicitly; above 80% threshold

---

## Check-by-check summary

| Check | Result | Notes |
|---|---|---|
| 1 — AC coverage | PASS (pre-confirmed) | All 21 ACs have ≥1 linked test |
| 1b — Cross-cutting coverage | PASS | Concern B: T14 (dedicated); Concern H: T15 (dedicated) |
| 2 — Scope compliance | PASS | No test exercises any out-of-scope item |
| 3 — Scenario balance | PASS (pre-confirmed) | happy 50%, neg 35%, boundary 21% |
| 4 — Step quality (atomic) | PASS (1 auto-fix) | T16 compound step split |
| 4 — Step quality (observable expected) | PASS | No banned vague patterns found |
| 4 — Step quality (min 3 steps) | PASS | All 34 tests have ≥3 steps |
| 4 — Precondition role names | PASS | No internal code names (mainUser/qaUser/etc.) found |
| 5 — UI Reality Check | N/A (not in scope for subagent) | Owned by ui-validator |
| 6 — E2E format | ADVISORY (2 tests) | T1 + T33 title/format issues; 6% < 20% threshold |
| 6 — Parameterization | PASS | No ≥3-test groups sharing identical first 2 steps |
| 6b — Implementation leakage | PASS (pre-confirmed) | No CSS class / selector / inline AC ref leakage |
| 7 — Automation classification | PASS | All 5 deferred + 1 manual-only have informative automation-note; no candidate has a spurious automation-note |
| 8 — Sub-suite distribution | PASS | Nested layout; all 5 sections ≥3 tests (6, 7, 4, 7, 10) |
| Priority pyramid | PASS (pre-confirmed) | critical 15% (at limit), high 21%, normal 59%, low 6% |
| Semantic balance | ADVISORY (T15) | @negative on mixed scenario; not a mislabel |

---

## Cross-cutting detail

**Concern B (OWNED — must-test):**
- T14 (cross-cutting.md) — "Concern B — multi-user assignment propagates from creation through runner to runs list @smoke"
- source: AC-38, AC-39, AC-40, ac-delta-5, ac-delta-12
- Covers: multi-user creation → runner per-test chips → runs list "Assigned to" column
- Verdict: PASS — canonical Concern B scenario is present and complete

**Concern H (AFFECTS — needs ≥1 bulk assign test):**
- T15 (cross-cutting.md) — "Concern H × F — bulk Assign to in runner respects the active filter @negative"
- source: AC-43, ac-delta-10
- Covers: filter applied → Multi-Select bulk assign → only filtered tests receive assignment
- Verdict: PASS — Concern H + F combined scenario is present; see ADV-3 for the @negative tag advisory

---

## Suggestions

1. **ADV-1 (T1 title):** Optional wording tweak — change "Creator is shown as manager..." to "Opening the New Manual Run sidebar shows the creator as manager..." to align with the journey-first title convention.

2. **ADV-2 (T33):** Evaluate whether the standalone avatar-stack verification test adds coverage that T14/T25 do not already provide. If the added coverage is intentional (isolated header-avatars check), accept the format deviation. If redundant, merge T33's verification into T25 as a final _Expected_: bullet.

3. **ADV-3 (T15 @negative tag):** Add `@boundary` to T15 (the "filter scope boundary" framing) alongside @negative, so the test's dual nature is explicit when scanning by tag.

4. **ADV-4 (T18 step 4):** Remove "Added user is reflected on the run (verified in the next step)" from the _Expected_: of the Save step — the page-navigation assertion is sufficient there; move the verification intent to the following step's opening.

5. **Concern B sub-feature consumers:** per destructuring.md, sub-features #2 (test-execution-runner) and #8 (run-detail-and-report) each need ≥1 multi-assignee test consuming the state set up by this suite's T14. Verify those suites include a multi-assignee precondition test when they are authored.
