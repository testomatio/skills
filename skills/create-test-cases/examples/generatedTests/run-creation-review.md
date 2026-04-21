# Phase 3 Self-Review Report

**Reviewed at:** 2026-04-18T00:00:00Z
**Reviewed by:** test-case-reviewer (subagent)
**Suite:** run-creation
**Test count:** 30
**Coverage depth:** regression
**Auto-fixes applied:** 14

---

## Blocking violations (must fix before publish)

### Check 5 — Scenario balance

- **BLOCKING — happy scenario ratio is ~73% (22/30), exceeds the ≤50% threshold for regression coverage.**
  Current distribution: happy ≈73% (22), negative ≈20% (6), boundary ≈10% (3).
  Negative and boundary are at exact minimums; happy is 23 percentage points over the ceiling.
  The test set has strong positive-path coverage for each field and scope mode but lacks corresponding
  negative/boundary variants for several clearly testable error paths:
  - Title at 0 characters (empty, not just "blank auto-generates") with Save — distinct from t6 which tests Launch
  - RunGroup Escape-closes-sidebar trap (documented in ui-delta as a TRAP — a natural @negative)
  - Environment selector clicked but modal cancelled — sidebar state preserved
  - Description at very large input (no enforced limit — what happens?)
  - "Select tests" Launch/Save disabled state while 0 tests selected (the button disabled state itself — distinct from t18 which tests what happens on click)
  - Test plan tab with no plans existing — "No test plans found." empty state
  - Assign more users panel opened then cancelled — assignee section reverts to creator-only
  Suggested approach: add 6–8 tests with @negative or @boundary tags to bring happy below 50%.
  Alternatively re-evaluate whether any existing "happy" tests can be legitimately re-tagged (they cannot — semantic check passed).

---

## Advisory violations (acceptable depending on context)

### Check 9 — E2E titles (noun/adjective-first)

14 of 30 test titles follow a declarative "X is/does Y" naming pattern rather than the verb-first imperative
convention (e.g., "Launch run with blank title" rather than "Blank title auto-generates a default title on Launch").
All 14 tests contain complete E2E user flows in their steps — this is a naming convention issue only, not a
content deficiency. Affects tests:
- t3: "Arrow-dropdown item ${menu_item} opens ${target} without opening the creation sidebar"
- t5: "Title input enforces the 255-character maximum"
- t6: "Blank title auto-generates a default title on Launch"
- t7: "Whitespace-only description is stored as blank"
- t8: "'Run as checklist' toggle is OFF by default and can be enabled"
- t9: "'Run Automated as Manual' toggle is actionable only in Select tests tab"
- t10: "Assignee section shows the creator with 'as manager' label by default"
- t11: "RunGroup dropdown lists 'Without rungroup' plus existing named groups"
- t12: '"All tests" is the default scope and Launch creates a run with every manual test'
- t16: "Scope tabs are mutually exclusive — switching clears previously selected tests"
- t17: "Test tree checkboxes are disabled outside the Select tests tab"
- t21: "Creation ${action} shows success toast '${toast_text}'"
- t22: "Required-RunGroup setting blocks Launch when the field is empty"
- t23: "Server-side validation error keeps the sidebar open and surfaces inline feedback"
- t30: '"Run as checklist" ON at creation time persists on the created run'
Suggestion: rename on next content revision. Not a publish blocker.

### Check 3 — UI element coverage (4 elements uncovered)

86% coverage (24/28 distinct named elements). Above the 80% threshold, so not blocking.
Uncovered catalog elements:
- **'No matched tests' / 'N tests matched' button** (run-creation-ui-delta.md — "Select tests" tab toolbar)
  No test exercises this button's state transitions (disabled → enabled as selection grows).
- **'Filters' button with badge** (run-creation-ui-delta.md — "Select tests" tab toolbar)
  No test exercises the Filters affordance in the Select tests tree.
- **'New Test Plan' button** (run-creation-ui-delta.md — "Test plan" tab content)
  No test covers creating a new plan inline from the Test plan tab.
- **'Advanced Settings' link** (run-creation-ui-delta.md — Run Tests quick modal)
  Covered by t24/t25 in narrative but the specific element is not referenced by bold name in any step.
Suggestion: add 1 test for "Select tests counter updates as tests are toggled" to cover the first two;
add 1 test for "New Test Plan inline creation from Test plan tab" to cover the third.

### Check 4 — Scope compliance (borderline Continue usage)

- **t20 ("Save creates a pending run that can be resumed via Continue")** clicks the 'Continue' action
  in the Run Detail panel as a verification step that the run was correctly persisted by Save.
  The scope contract's Out-of-Scope list places "Continue / Finish / Relaunch / Edit-run" in #6 run-lifecycle.
  However the scope contract also explicitly states "Save stores run in pending/not-started state;
  appears in list with Continue action" (ac-delta-12), which implies creation-side ownership of the
  pending+Continue observable state. This is borderline: clicking Continue to verify the run opens in
  the runner is marginally in-scope as creation verification. Consider truncating the test at
  "Continue link/button is visible" without actually clicking it.

### Check 10 — Element names not in formal catalog named-element lists

Three element names appear in action steps but are documented only in prose/flow sections of the catalogs,
not in the formal named-element bullet lists:
- **'Continue'** (t20 step 4): used as "click the 'Continue' action in the detail panel".
  Present in _shared-ui.md Verified Flows section but not in Run Detail Panel named-element list.
- **'Add Manual Run'** (t29 step 3): used as "click the 'Add Manual Run' (or equivalent 'Manual Run' entry)
  inside the RunGroup page". Not in either catalog's named-element section.
  (RunGroup page elements are owned by #5 run-groups, not yet catalogued for this sub-feature.)
- **'Run Tests'** (t24, t25): used as "click the 'Run Tests' action" from suite extra menu.
  Referenced in run-creation-ui-delta.md verified flows prose but not in a named button/action list.
These do not block publishing but should be resolved when the RunGroup and Tests-page catalogs are
formalized in their respective sub-features.

### Check 9 — Scope boundary: t16 @boundary tag looseness

- **t16 ("Scope tabs are mutually exclusive... @boundary")** uses @boundary for a state-transition
  boundary (switching tabs clears selection) rather than a numeric limit boundary.
  This is a valid interpretation (system boundary, not just numeric limit) but is on the loose end.
  The tag is defensible — no change required.

---

## Auto-fixes applied

14 compound steps split into atomic steps across 5 files:

1. form-fields.md, t8 step 3 — split "Fill the Title with 'Checklist toggle default' **and** click 'Save'" into two steps; added intermediate _Expected_ for Title value
2. form-fields.md, t10 step 3 — split "Fill the Title with 'Default assignee test' **and** click 'Launch'" into two steps; added intermediate _Expected_
3. form-fields.md, t11 step 4 — split "Fill the Title with 'RunGroup = none test' **and** click 'Save'" into two steps; added intermediate _Expected_
4. form-fields.md, t6 step 2 — split "Leave the Title input empty **and** keep the scope at 'All tests'" into two observation steps
5. scope-selection.md, t12 step 4 — split "Fill the Title with 'All tests default scope' **and** click 'Launch'" into two steps; added intermediate _Expected_
6. scope-selection.md, t13 step 7 — split "Fill the Title with 'Select tests happy path' **and** click 'Launch'" into two steps; added intermediate _Expected_
7. scope-selection.md, t14 step 4 — split "Fill the Title with 'Test plan union' **and** click 'Launch'" into two steps; added intermediate _Expected_
8. scope-selection.md, t15 step 3 — split "Fill the Title with 'Empty run' **and** click 'Launch'" into two steps; added intermediate _Expected_
9. scope-selection.md, t16 step 5 — split "Fill the Title with 'Scope exclusivity check' **and** click 'Launch'" into two steps; added intermediate _Expected_
10. scope-selection.md, t18 step 3 — split "Do NOT tick any test; fill the Title..." (semicolon-joined) into two separate steps
11. launch-and-save.md, t19 step 3 — split "Keep scope at 'All tests' **and** click the 'Launch' button" into two steps; added intermediate _Expected_
12. launch-and-save.md, t20 step 3 — split "Keep scope at 'All tests' **and** click the 'Save' button" into two steps; added intermediate _Expected_
13. cross-cutting.md, t27 step 7 — split "Fill the Title with 'Two env groups' **and** click 'Launch' in the sidebar" into two steps; added intermediate _Expected_
14. cross-cutting.md, t29 step 4 — split "Fill the Title with 'Run inside existing group' **and** click 'Launch'" into two steps; added intermediate _Expected_

Note: cross-cutting.md t30 step 3 ("Fill the Title with 'Checklist mode on creation' **and** click 'Launch'") was also fixed (counted as fix #14 above — report shows 14 total).

---

## Distributions

- Scenario balance: happy ~73% (22/30), negative ~20% (6/30), boundary ~10% (3/30)
- Priority pyramid: critical 13.3% (4), high 33.3% (10), normal 46.7% (14), low 6.7% (2)
- Automation: candidate 83.3% (25), deferred 16.7% (5), manual-only 0%
- AC coverage: 44/44 ACs (100%) — all 26 applicable baseline + 18 delta ACs have ≥1 linked test
- UI coverage: ~86% (~24/28 distinct named elements referenced in action steps)
- Cross-cutting: A ✓ B ✓ C ✓ D ✓ — all 4 applicable concerns have dedicated tests

---

## Suggestions

1. **BLOCKING — Add 6–8 negative/boundary tests to bring happy ratio below 50%.** Good candidates:
   - RunGroup Escape-dismisses-sidebar trap (documented in ui-delta — pure @negative)
   - Environment modal opened then cancelled — sidebar state preserved @negative
   - "Test plan" tab empty state: no plans exist → "No test plans found." @negative
   - 'No matched tests' button disabled state → selection added → button enables @boundary (also fixes UI coverage gap)
   - Assign more users panel opened then cancelled without changes @negative
   - Title with exactly 1 character (@boundary complement to the 255-char test)

2. **ADVISORY — Consider renaming 14 noun-first test titles** to verb-first imperative on next revision cycle. No rush, but consistency aids test management tooling sorting.

3. **ADVISORY — t20 scope boundary:** Consider ending the Save test at "Continue link is visible" rather than clicking Continue, to keep clean separation with #6 run-lifecycle.

4. **ADVISORY — 3 element name gaps** ('Continue', 'Add Manual Run', 'Run Tests') will resolve naturally when #5 run-groups and the Tests-page catalogs are formalized in later sub-feature passes.

5. **INFO — 'Advanced Settings' link** (from multi-select Run Tests quick modal → full sidebar) is not explicitly exercised in a named step; t24/t25 test the quick-modal path but not the Advanced Settings → full sidebar path. Consider a dedicated test if that detour path needs regression coverage.
