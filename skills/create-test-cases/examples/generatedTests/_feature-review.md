# Level 1 Cross-Sub-Feature Audit — manual-tests-execution

Generated: 2026-04-20
Scope: cross-cutting analysis only. Per-sub-feature Phase 3 reviews not re-executed.

| Metric | Value |
|---|---|
| Sub-features | 10 |
| Total tests (by `<!-- test` markers) | 361 |
| Baseline ACs | 100 (AC-1..AC-100; AC-97..AC-100 flagged UNCLEAR in baseline) |
| Delta ACs | 171 (across 10 sub-feature delta files) |
| Total ACs | 271 |

---

## 1. AC Coverage Rollup

### 1.1 Baseline AC coverage (1-100)

Method: regex `AC-\d+` in every `source:` line of every test under `{sub}/*.md`.

**Covered:** 97 / 100 baseline ACs.
**Missing:** 3 ACs (see below).

| AC | Status | Covering sub(s) | Notes |
|---|---|---|---|
| AC-16 | ❌ MISSING | — | "Mixed Run CI/local options." Only AC-15/17/18 referenced; no test cites AC-16. Partially covered conceptually by `run-creation/entry-points-and-extras.md` (`Mixed Run` arrow item), but the CI Profile vs CLI bifurcation is not exercised. |
| AC-44 | ❌ MISSING | — | "Settings → Environments seed list." Explicitly excluded in `environment-configuration-ac-delta.md` as precondition. Expected — not a violation. |
| AC-97 | ❌ MISSING | — | UNCLEAR in baseline (Fast Forward vs Auto-Track). Expected — gate-excluded. |
| AC-1..AC-15, AC-17..AC-18 | ✅ covered | run-creation | |
| AC-19..AC-22 | ✅ covered | run-creation, archive-and-purge (AC-22) | |
| AC-23..AC-28, AC-58..AC-67 | ✅ covered | run-lifecycle | |
| AC-29..AC-36 | ✅ covered | test-execution-runner (+ bulk-status for 29/30/31) | |
| AC-37..AC-43 | ✅ covered | tester-assignment (+ run-creation for 37/38) | |
| AC-45..AC-50 | ✅ covered | environment-configuration (+ run-lifecycle for 48/49/50) | |
| AC-51..AC-57 | ✅ covered | run-groups, archive-and-purge (56/57) | |
| AC-68..AC-74 | ✅ covered | runs-list-management | |
| AC-75..AC-81 | ✅ covered | archive-and-purge | |
| AC-82..AC-92 | ✅ covered | run-detail-and-report (+ runs-list for 87/88/92) | |
| AC-93..AC-95 | ✅ covered | bulk-status-actions | |
| AC-96 | ✅ covered | run-creation, test-execution-runner | |
| AC-98..AC-100 | ✅ cited (deferred tests with `@unclear`) | run-detail-and-report, archive-and-purge, run-lifecycle, tester-assignment | |

### 1.2 Under-covered baseline ACs (single reference only)

The following baseline ACs are cited by exactly 1 test. Acceptable for narrow ACs but flag for regression risk on core flows:

| AC | Refs | Covering test |
|---|---|---|
| AC-3 | 1 | run-creation/scope-selection.md (default All tests scope) |
| AC-6 | 1 | run-creation/scope-selection.md (Without tests) |
| AC-9 | 1 | run-creation/launch-and-save.md (require-RunGroup validation) |
| AC-10 | 1 | run-creation/form-fields.md (Run Automated as Manual toggle) |
| AC-11 | 1 | run-creation/entry-points-and-extras.md (Tests page single-test Add to Run) |
| AC-15 | 1 | run-creation/entry-points-and-extras.md (Mixed Run arrow) |
| AC-17 | 1 | run-creation/entry-points-and-extras.md (Report Automated Tests) |
| AC-18 | 1 | run-creation/entry-points-and-extras.md (Launch from CLI) |
| AC-26 | 1 | run-lifecycle/finish-run.md (Pending → Skipped) |
| AC-33 | 1 | test-execution-runner/attachments.md (Fit to width / Full screen) |
| AC-55 | 1 | run-groups/detail-and-reports.md (RunGroup Custom view auto-save) |
| AC-64 | 1 | run-lifecycle/advanced-relaunch.md (Create new run OFF) |
| AC-65 | 1 | run-lifecycle/advanced-relaunch.md (Keep values ON) |
| AC-93 | 1 | bulk-status-actions (AC-93 overall "bulk menu entries") |
| AC-99 | 1 | run-detail-and-report (Copy Link — UNCLEAR) |

### 1.3 Delta AC coverage

Every sub-feature has ≥ 98% delta coverage. Two ac-deltas are not cited:

| Sub-feature | Missing delta | Notes |
|---|---|---|
| run-groups | ac-delta-18, ac-delta-19 | Need spot-check in that file to confirm these aren't deliberately unreachable. ⚠️ |

All other sub-features: 100% delta coverage.

---

## 2. Destructuring Alignment — Cross-Cutting Concerns A–H

Method: for each concern, I found tests whose title or intro paragraph names the concern or the trigger scenario; sampled 2 per concern to confirm real exercise.

| Concern | Required sub-feature(s) | Found test(s)? | Sampled & Confirmed? | Verdict |
|---|---|---|---|---|
| A Multi-environment | #1 creation, #4 env (owner), #6 lifecycle, #7 list, #8 report | ✅ #1 `run-creation/cross-cutting.md` (Create with 2 env groups), ✅ #4 full suite, ✅ #6 `run-lifecycle/cross-cutting.md` (Finish on multi-env), ✅ #7 `runs-list-management/cross-cutting.md` (Multi-env indicators), ✅ #8 referenced in compare-runs.md | Yes (#4, #6, #7) | ✅ PASS |
| B Multi-user | #2 runner, #8 report | ✅ #2 `test-execution-runner/cross-cutting.md` (Per-test assignee badge), ⚠️ #8 no dedicated multi-assignee cross-cut test — assignee filter is exercised in `tests-tab.md` (AC-85) but a pure multi-user scenario is not isolated | Partial | ⚠️ PARTIAL — flagged in tester-assignment-review advisory (ADV-4) |
| C RunGroup membership | #7 list, #9 archive | ✅ #7 `runs-list-management/cross-cutting.md` (Groups tab expand), ✅ #9 `archive-and-purge/rungroup-cascade.md` (entire file) | Yes | ✅ PASS |
| D Run as checklist | #2 runner | ✅ #2 `test-execution-runner/cross-cutting.md` (Checklist-mode description hidden + Toggle Description) | Yes | ✅ PASS |
| E Custom statuses | #2 runner, #7 list, #8 report | ✅ #2 `test-execution-runner/cross-cutting.md` (Custom sub-status counter), ✅ #7 `runs-list-management/cross-cutting.md` (TQL has_custom_status), ✅ #8 `run-detail-and-report/tests-tab.md` (custom status filter) | Yes | ✅ PASS |
| F Filter-scoped selection | #6 Advanced Relaunch, #10 bulk | ✅ #6 `run-lifecycle/advanced-relaunch.md` ("Select all inside Advanced Relaunch respects active status filter"), ✅ #10 `bulk-status-actions/cross-cutting.md` (Suite-level checkbox + Bulk Result Message with filter) | Yes | ✅ PASS |
| G Ongoing vs Finished | #6 lifecycle, #9 archive | ✅ #6 `run-lifecycle/cross-cutting.md` (Row extra-menu state-aware), ✅ #9 `archive-and-purge/run-state-behavior.md` (archive ongoing vs finished) | Yes | ✅ PASS |
| H Bulk multi-select | #3 bulk assign, #10 bulk result, #7 list multi-select | ✅ #3 `tester-assignment/runner-assignment-paths.md` + `cross-cutting.md` (Concern H×F), ✅ #10 `bulk-status-actions/bulk-status-application.md` + `cross-cutting.md`, ✅ #7 `runs-list-management/multi-select.md` + `cross-cutting.md` (Bulk archive) | Yes | ✅ PASS |

**Failures:** 0 outright. 1 partial (Concern B in #8).

---

## 3. Cross-Sub-Feature Duplication / Overlap

Method: scan titles for overlapping verbs on shared surfaces, cross-check "Does NOT own" clauses in `destructuring.md`.

| # | Pair | Observation | Recommendation |
|---|---|---|---|
| 1 | #7 runs-list `multi-select.md` ↔ #10 bulk-status `multi-select-mode.md` | Both cover "activate Multi-select mode reveals checkboxes". Intent is clearly distinct (list vs runner), and each file's intro paragraph cites the opposing owner for clarity. No duplication. | Keep both. |
| 2 | #7 runs-list `multi-select.md` Extra dropdown Download entry ↔ #8 `exports-and-sharing.md` Download as Spreadsheet | #7 verifies the menu entry presence only ("Link, Download, Merge, Move"); #8 verifies the XLSX file actually downloads. Non-overlapping. | Keep both. |
| 3 | #7 runs-list `row-extra-menu.md` Export as PDF menu entry ↔ #8 `exports-and-sharing.md` Export as PDF | Same as #2 — list verifies entry in menu, detail verifies the actual export. Well-scoped. | Keep both. |
| 4 | #9 archive `run-actions.md` "Bulk archive multiple runs via Multi-select" ↔ #7 `runs-list-management/cross-cutting.md` "Bulk multi-select archive applies across every selected run" | Similar scenario (multi-select → Archive). #7 is framed as Concern H end-to-end; #9 is framed as a bulk archive correctness check. Minor overlap in UI flow but different verification targets (Concern H outcome vs Archive state transition). | Keep both; consider a cross-reference note in #7's cross-cutting test citing #9 ownership. |
| 5 | #5 run-groups `archive-and-purge.md` ↔ #9 `archive-and-purge/rungroup-cascade.md` | #5 owns group-level archive/purge triggers inside the group page; #9 owns run-level cascade + archive-page verification. Both reference AC-56/AC-57. Separation is intentional per destructuring A2. | Keep both. |
| 6 | #6 run-lifecycle `finish-run.md` AC-28 ↔ #1 run-creation launch tests | No overlap — separate verbs (Finish vs Launch). | — |
| 7 | #3 tester-assignment `creation-dialog-assignment.md` ↔ #1 run-creation `cross-cutting.md` (multi-tester) | Both touch Assign to at creation time. #1's test is labeled "partial slice, ownership in #3" (style §Ownership notes inline). | Acceptable per style. |
| 8 | #1 run-creation `scope-selection.md` "Without tests" AC-22 ↔ #9 archive-and-purge AC-22 | AC-22 is cited by two subs: #1 tests scope selection, #9 references it for a state-behavior test (archive on empty-scope run). Different purposes. | Keep. |

**Overall duplication risk: LOW.** Every overlapping pair has a documented ownership split and a verified distinction in verification target.

---

## 4. Style Consistency

Samples: `run-creation/dialog-lifecycle.md` (first), `run-groups/group-lifecycle.md` (middle), `archive-and-purge/run-actions.md` (last).

| Style aspect | run-creation | run-groups | archive-and-purge | `_style.md` requirement |
|---|---|---|---|---|
| `<!-- suite -->` + `#` heading | ✅ | ✅ | ✅ | ✅ |
| Suite intro paragraph naming non-ownership | ✅ | ✅ ("Does NOT cover …") | ✅ ("Does NOT cover …") | ✅ |
| `<!-- test … -->` frontmatter with all required fields | ✅ | ✅ | ✅ | ✅ |
| Parameterized titles use `${snake_case}` | ✅ (`${dismiss_method}`) | ✅ (`${strategy}`, `${type}`) | ✅ (`${entry_point}`, `${badge}`) | ✅ |
| No AC refs in titles | ✅ | ✅ | ✅ | ✅ |
| Scenario tags appended | `@smoke`, `@negative` | `@smoke`, `@negative`, `@boundary` | `@smoke`, `@negative`, `@unclear` | ✅ |
| UI label quoting convention | Single quotes `'Runs'` | **Backticks** `` `Manual Run` `` | **Backticks** `` `Move to Archive` `` | ⚠️ DRIFT — `_style.md` §Language states single quotes (`Click the 'Launch' button`), but run-groups and archive-and-purge switched to backticks. Consistent within each sub-feature but inconsistent across the feature. |
| `_Expected_:` structure (single / multi-bullet) | Mixed (matches guide) | Mixed (matches guide) | Mixed (matches guide) | ✅ |
| Preconditions section | Omitted when none | Present | Present | ✅ |
| Priority distribution | 4 crit / 10 high / 26 normal / 4 low (pyramid) | 2 / 8 / 17 / 2 (pyramid) | 6 / 15 / 17 / 5 (pyramid) | ✅ |

**Key finding — Style drift:** The `'` (single quote) vs `` ` `` (backtick) convention for UI labels diverged starting with run-groups. `_style.md` examples (line 73) specify single quotes: `Click the 'Launch' button`. Sub-features 5 (run-groups), 7 (bulk-status-actions), 8 (runs-list-management), 9 (run-detail-and-report), 10 (archive-and-purge) predominantly use backticks. Sub-features 1 (run-creation), 2 (runner), 3 (lifecycle), 4 (tester-assignment), 5 (environment-configuration) predominantly use single quotes.

Priority pyramids: all ten sub-features show a normal-dominant shape with critical + high ≈ 30–45%. No flat distributions. Matches style guide expectation.

---

## 5. Shared UI / Steps Drift

`_existing-steps.md` lists 14 reusable Testomat.io-registered phrases. Scan results:

| Existing step | Occurrences across test files | Comment |
|---|---|---|
| `Navigate to the 'Runs' page` | many (run-creation × 6, run-lifecycle × 5, tester-assignment × many) | Reused correctly. |
| `Navigate to the 'Tests' page` | multiple | Reused correctly. |
| `Click the 'Save' button` | multiple | Reused correctly. |
| `Click the 'Create' button` | multiple | Reused correctly. |
| `Click the '...' extra menu` | appears as variation "Open the extra menu on the … row" (archive-and-purge) | ⚠️ DRIFT — archive-and-purge writes `Open the extra menu on the {row} row` which is semantically equivalent but not the registered phrase `Click the '...' extra menu`. 30+ instances across archive/lifecycle. |
| `go to Runs` | 0 direct uses; zero hits in test folders | ✅ Tests prefer the canonical phrase. |
| `expant <placeholder> suites` (typo in source) | 0 uses | ✅ Tests ignore the typo-containing phrase. |
| `Select the 'Scope: all'` | 0 exact; scope selection uses "Click the 'All tests' tab" | ⚠️ Minor — test authors re-worded rather than reused. |

**Overall drift: LOW.** The most common drift is the "extra menu" phrasing in archive-and-purge/run-lifecycle, where `Open the extra menu on the {row} row` is used instead of the registered `Click the '...' extra menu`. Not a blocker (the registered phrase places the `...` quoted literal which is less natural when naming a row target), but worth flagging for library reuse at publish time.

---

## 6. Anti-pattern Smoke Check

Scan confined to `{sub}/*.md` test case files (not ui-delta / scope / review docs).

| Pattern | Total occurrences | Sub-features affected | Examples |
|---|---|---|---|
| `.css-<id>` class leak | 0 | — | ✅ clean |
| `class="…"` attribute leak | 0 | — | ✅ clean |
| `icon-*` class leak | 3 | test-execution-runner (2), runs-list-management (1) | `test-execution-runner/notes.md:23,158` say "icon-only" (descriptive, false positive); `runs-list-management/row-extra-menu.md:243` leaks `svg.md-icon-pin` inside a ui-validator footer note (borderline — not a test step). |
| `<script>` raw payload | 0 | — | ✅ clean |
| `onerror=` XSS payload | 0 | — | ✅ clean |
| AC refs in titles | 0 | — | ✅ clean |
| Parameterized title missing `${col}` | 0 | — | All 47 parameterized titles include a `${token}` — verified |

**Anti-pattern exposure: MINIMAL.** Only one real leak (`svg.md-icon-pin` in a validator footer, not a user-visible step). Everything else is either false positive ("icon-only" descriptor) or zero.

---

## 7. Summary & Prioritized Action List

| # | Severity | Sub-feature / File | Issue | Recommendation |
|---|---|---|---|---|
| 1 | HIGH | feature-wide | Quote-style drift: single quotes vs backticks for UI labels across sub-features | Pick one; update `_style.md` to record the normative choice; bulk-fix the minority convention before publish, OR accept drift and add an explicit "either `'…'` or `` `…` `` is acceptable" note in `_style.md`. |
| 2 | HIGH | run-groups — ac-delta-18, ac-delta-19 | Two delta ACs have zero test citations | Confirm whether these are rollup/catalog-only deltas or real behavioral gaps; if the latter, add ≥ 1 test each. |
| 3 | MEDIUM | run-detail-and-report (#8) | Concern B Multi-user has no dedicated cross-cutting test in #8 | Add 1 test in `run-detail-and-report/cross-cutting.md` (or extend `tests-tab.md`) exercising per-assignee grouping on a multi-assignee run. Parent reviewer already flagged as advisory ADV-4. |
| 4 | MEDIUM | run-creation — AC-16 | "Mixed Run CI Profile vs local CLI" not explicitly exercised | Either add a test in `entry-points-and-extras.md` that walks the Mixed Run → CI-Profile vs without-CI branches, or explicitly mark AC-16 out-of-scope in `run-creation-ac-delta.md`. |
| 5 | MEDIUM | runs-list-management — `row-extra-menu.md:243` | ui-validator footer contains implementation selector `svg.md-icon-pin` | Strip the selector or move it to the sub-feature's ui-delta catalog (not a test-case body). |
| 6 | LOW | archive-and-purge / run-lifecycle | "Open the extra menu on the {row} row" diverges from registered step `Click the '...' extra menu` | Low priority — re-word during publish if step library reuse is a priority; otherwise accept. |
| 7 | LOW | feature-wide under-covered baseline ACs | 15 baseline ACs have a single covering test; 9 of them are T3/T4 priority | Low priority — add coverage only if the ACs underpin a business-critical flow (e.g., AC-33 full-screen preview — T4 leaves a gap if full-screen breaks silently). Otherwise accept. |
| 8 | LOW | test-execution-runner — `notes.md:23,158` | "icon-only" descriptor uses hyphen (reads similar to CSS class) | False positive in smoke check; no fix needed, but consider rewording to `button has no text label` to avoid future scans flagging this. |

**BLOCKERS (must-fix before publish):** 0.
**HIGH (should fix before feature-wide publish):** 2 (#1 quote drift, #2 run-groups delta gap).
**MEDIUM:** 3 (concern B for #8, AC-16, selector leak).
**LOW:** 3.

---

## Appendix — per-sub-feature Phase 3 verdict roll-up (from existing review files)

| Sub-feature | Phase 3 verdict (from `{sub}-review.md`) |
|---|---|
| run-creation | PASS with 1 blocking (already fixed), remaining advisories (t20 scope boundary, element name gaps) |
| test-execution-runner | PASS with 1 blocking (compound step splits), 6 deferred tests await fixtures |
| run-lifecycle | PASS, no action required on AC / cross-cutting / pyramid / semantic tagging |
| tester-assignment | PASS, no blocking. ADV-3 @boundary tag on T15; ADV-4 Expected trim on T18 |
| environment-configuration | Blocking: negative balance — add ≥2 negative tests (Launch-in-Sequence empty groups, outside-click dismiss) |
| run-groups | PASS; revise compound steps, rework @unclear doc test, 3 title renames |
| bulk-status-actions | Blocking: T5 parameterization + step count; publish-ready once fixed |
| runs-list-management | PASS (94% UI element coverage); 3 minor uncovered elements advisory; AC-87 attribution suggestion |
| run-detail-and-report | PASS on all gates; 10 deferred tests carry automation-note; Phase 3b ui-validator deferred (500 error) |
| archive-and-purge | Pre-fix advisory (happy count) already over cap; no blocking. 4 compound-step splits in `restore-and-delete.md` pending. |

---

*End of feature review.*
