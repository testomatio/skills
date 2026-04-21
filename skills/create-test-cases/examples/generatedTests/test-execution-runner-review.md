# Phase 3 Self-Review Report

**Reviewed at:** 2026-04-18T00:00:00Z
**Reviewed by:** test-case-reviewer (subagent)
**Suite:** test-execution-runner
**Test count:** 36
**Coverage depth:** regression
**Auto-fixes applied:** 6

---

## Blocking violations (must fix before publish)

None.

---

## Advisory violations (acceptable depending on context)

### Semantic balance

**A1 — time-tracking.md: "Set Time manual entry replaces the auto-tracked duration"**
Previously tagged `@boundary`. The test exercises a happy-path override: enter 00:05:00, confirm it replaces the existing auto-tracked value. The value 00:05:00 is not a boundary value (no 0, max, max+1, or empty input is tested). The `@boundary` tag was misleading.
**Auto-fixed:** `@boundary` tag removed from title.

### Compound steps

**A2 — result-entry.md, "Result message persists after navigating to another test and back", step 1**
"Open the first pending test and click the 'FAILED' button" combined two actions in one step (navigate to test + click status button), violating the one-verb-per-step rule.
**Auto-fixed:** split into two atomic steps.

**A3 — step-by-step-markings.md, "Step markings persist after closing and re-opening the test", step 1**
"Open the test and mark step 1 as Passed ... and step 2 as Failed ..." — multiple actions in one step.
**Auto-fixed:** split into three atomic steps (open, mark step 1, mark step 2).

**A4 — step-by-step-markings.md, "Step left unmarked remains Pending ...", step 2**
"Mark step 1 as Passed (single click) and step 3 as Skipped (triple click)" — two distinct gestures on two distinct rows in one step.
**Auto-fixed:** split into two atomic steps (mark step 1 Passed, mark step 3 Skipped).

### Automation classification

**A5 — result-entry.md, "Applied custom sub-status is reflected on the test row indicator in the tree (cross-cut E)"**
`automation: candidate` was present alongside an `automation-note:` field. Per _style.md, `automation-note:` is only valid when `automation: deferred`. The note itself was correct (project-level custom-status fixture required), so the `automation:` value was wrong.
**Auto-fixed:** `automation: candidate` → `automation: deferred`.

**A6 — cross-cutting.md, "Custom sub-status counter impact is visible in the runner header (cross-cut E)"**
Same issue: `automation: candidate` with an `automation-note:` explaining a deferred blocker. Logically deferred.
**Auto-fixed:** `automation: candidate` → `automation: deferred`.

### Step expectation precision

**A7 — detail-pane-and-tree.md, "Resize handle between the tree and the detail pane changes pane widths", step 3**
`_Expected_:` reads "Panels return to approximately their original proportions." The word "approximately" is technically correct (drag precision is not pixel-perfect) but leaves the pass/fail criterion ambiguous for a manual tester. Consider rephrasing to: "Both panels are visible at widths visually close to their original proportions; no content is clipped." Not auto-fixed — this is a borderline wording judgment.

### UI element coverage

**A8 — 'Add test to suite' button (delta catalog)**
This button is referenced only as what disappears when 'Hide Creation Buttons' is active (detail-pane test 3). It is never directly clicked in any test. The AC backing it (ac-delta-16) covers the toggle behavior, not direct use. Advisory only — directly testing 'Add test to suite' would duplicate scope owned by #1 run-creation.

**A9 — Per-test 'Track' / Stop timer icon (delta catalog)**
The time-tracking tests exercise Auto-Track (header-level toggle) and Set Time. The separate per-test Track icon (md-icon-timer, starts/stops the per-test stopwatch independently of Auto-Track) is cataloged but has no dedicated test. The distinction between Auto-Track and per-test Track is noted in the catalog but no AC directly mandates a standalone per-test-Track test. Advisory — if the per-test Track behaves identically to Auto-Track, coverage is adequate; if it is a distinct control, a dedicated test is needed.

**A10 — Note pane Timer button, Note pane Extra options menu (delta catalog)**
The note detail pane has a Timer button and a dots-horizontal extra menu. Neither is exercised in any notes test. The notes tests cover note creation, suite-scoped notes, convert-to-test, and validation. The note pane Timer and its extra-menu options (not fully explored during UI exploration) are uncharted territory. Advisory — these were not exercised because their options were not confirmed during exploration.

**A11 — Note creation Cancel button (delta catalog)**
The Cancel action on the inline note-creation form is cataloged but never tested. A negative test verifying that Cancel dismisses the form without creating a note row would be a minor gap. Advisory.

### Step content note

**A12 — detail-pane-and-tree.md priority filter test: "Important" vs "Critical" priority discrepancy**
The delta catalog's Priority Filter section lists "Important priority" as a filter button alongside Low / Normal / High / Critical. The parameterized test uses "Critical" in its example table row. If the UI label is "Important" (not "Critical"), the test's example table row value would be incorrect. The catalog entry is ambiguous (may reflect the UI priority scale: Normal / Low / High / Important / Critical with "Important" equivalent to what the test labels "Critical"). Confirm the exact button labels during test execution.

---

## Auto-fixes applied

1. **result-entry.md, "Result message persists after navigating to another test and back", step 1** — split compound step "Open the first pending test and click the 'FAILED' button" into two atomic steps: (1) Open the first pending test with expected: detail pane loads; (2) Click the 'FAILED' button with expected: test row shows Failed indicator.

2. **result-entry.md, "Applied custom sub-status is reflected on the test row indicator in the tree (cross-cut E)"** — changed `automation: candidate` → `automation: deferred` (automation-note was already present and correct; only the automation field value was wrong).

3. **cross-cutting.md, "Custom sub-status counter impact is visible in the runner header (cross-cut E)"** — changed `automation: candidate` → `automation: deferred` (same pattern as fix 2).

4. **time-tracking.md, "Set Time manual entry replaces the auto-tracked duration"** — removed misleading `@boundary` tag from title. The test verifies that a manually entered duration replaces an auto-tracked one; the inputs are not boundary values.

5. **step-by-step-markings.md, "Step markings persist after closing and re-opening the test", step 1** — split "Open the test and mark step 1 as Passed ... and step 2 as Failed ..." into three atomic steps: open test, single-click step 1 indicator, double-click step 2 indicator.

6. **step-by-step-markings.md, "Step left unmarked remains Pending when other steps of the same test are marked", step 2** — split "Mark step 1 as Passed (single click) and step 3 as Skipped (triple click)" into two atomic steps: single-click step 1, triple-click step 3.

---

## Distributions

- **Scenario balance:** happy ~50%, negative 22%, boundary 11%, unclear 17%
  - Happy (no negative/boundary tag): ~18/36 tests
  - Negative (@negative): 8/36 = 22.2% — meets ≥20% threshold
  - Boundary (@boundary): 4/36 = 11.1% before fix; 3/36 = 8.3% after removing @boundary from "Set Time manual entry". This is marginally below the 10% threshold (3.0 vs 10%). See note below.
  - Unclear (@unclear): 8/36 = 22% — not a balance category but indicates ~6 tests pending fixture confirmation
- **Priority pyramid:** critical 1/36 = 2.8%, high 10/36 = 27.8%, normal 23/36 = 63.9%, low 2/36 = 5.6% — all within thresholds (critical ≤15%, high ≤35%, normal ≥35%, low ≥5%)
- **Automation:** candidate 21/36 = 58%, deferred 15/36 = 42% (after fixes; 13 were deferred before, 2 corrected) — manual-only: 0%
- **AC coverage:** 31/31 ACs cited (9 applicable baseline + 22 delta) = 100% (excluding AC-97 which is intentionally closed)
- **UI coverage:** ~43/50 in-scope delta elements exercised in steps or expected = ~86%

**Boundary ratio note:** After removing the false `@boundary` from "Set Time manual entry", boundary count becomes 3/36 = 8.3%, dropping just below the 10% threshold. The three remaining genuine boundary tests are:
  - "Switching status from PASSED to FAILED updates the header counters" (counter-edge at 0/1)
  - "Deleting the last attachment with 'Confirm' restores the empty drop zone" (count = 1 → 0)
  - "Priority filter with no matching tests renders an empty tree" (0 matching results)
The Bash gate previously confirmed 11.1% with the @boundary tag on "Set Time manual entry" counted. The corrected ratio (8.3%) is technically below threshold. However, the fix was correct (the tag was semantically wrong), and the advisory here is to consider tagging "Set Time saving 00:00:00 is rejected" (time-tracking test 3) as `@boundary` instead — it tests the zero-value boundary of the duration field. That reassignment would restore the ratio to 4/36 = 11.1% and be semantically accurate.

---

## Suggestions

1. **Restore boundary ratio to ≥10%**: Tag time-tracking.md "Saving 'Set Time' with an empty duration is rejected" with `@boundary` (in addition to its existing `@negative`). An empty / all-zeros duration is a genuine boundary value for the Set Time input. This restores boundary coverage to 4/36 = 11.1%.

2. **Clarify "Important" vs "Critical" priority button label (A12)**: During first test execution of the priority filter test, verify that the UI button labels exactly match Low / Normal / High / Critical as used in the test. If the UI shows "Important" instead of one of those values, update the example table. The delta catalog's filter toolbar section lists five buttons including "Important priority" which may represent what the tests call "Critical".

3. **Per-test Track button (A9)**: If the per-test Track/Stop timer icon operates independently of Auto-Track (i.e., it is not just a UI mirror of the header toggle but a separate control), add a dedicated test for it. Verify during the first test execution run whether pressing the per-test Track button while Auto-Track is OFF starts a local timer.

4. **Note pane extra menu coverage (A10)**: During automation of the notes tests, explore the note pane dots-horizontal menu to catalogue its options. If actions beyond "Convert to test" exist, a follow-up test may be warranted.

5. **Cancel action on note creation form (A11)**: Consider adding a minimal negative test: open the note creation form and click Cancel; verify no note row appears. This is low-priority (Cancel on a form is rarely broken) but would close the coverage gap on this cataloged element.

6. **"Set Time" success feedback (catalog GAP)**: The delta catalog notes that Set Time save success feedback (toast or inline) was not confirmed during exploration. When running time-tracking tests manually, capture whether a success toast appears after entering a manual duration and record it in the catalog for the automation pass.

7. **Automation fixtures**: Six deferred tests (2 custom-status, 2 step-by-step, 1 drag-drop, 1 assignee badge) share a common blocker: missing project fixtures. Group these into a single fixture-setup sprint: (a) add a test case with ≥2 defined steps to project-for-testing, (b) add a custom sub-status configuration to the test project, (c) set up a multi-assignee run fixture. Once done, all six tests can be converted from `deferred` to `candidate` in a batch pass.
