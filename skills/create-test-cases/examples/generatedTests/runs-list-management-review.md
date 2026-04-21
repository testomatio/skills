# Phase 3 Self-Review Report

**Reviewed at:** 2026-04-19T00:00:00Z
**Reviewed by:** test-case-reviewer (subagent)
**Suite:** runs-list-management
**Test count:** 36
**Coverage depth:** regression
**Auto-fixes applied:** 8

---

## Summary

| Check | Status | Violations | Blocking |
|-------|--------|-----------|---------|
| 1. AC coverage | FAIL | 3 ACs uncovered | Yes |
| 2. Cross-cutting concerns | PASS | 0 | — |
| 3. UI element coverage | PASS (94%) | 3 minor elements uncovered (advisory) | No |
| 4. Scope compliance | PASS | 0 | — |
| 5. Scenario balance | FAIL | negative 11% < 20%, boundary 5.6% < 10%, happy 83% > 50% | Yes |
| 6. Semantic balance | FIXED | 2 mis-tagged @negative tests (auto-fixed) | — |
| 7. Priority pyramid | FIXED | High was 41.7% > 35% (3 downgrades auto-applied) | — |
| 8. Step quality | FIXED | 2 compound steps (auto-split) | — |
| 9. E2E + parameterization | PASS | 0 | — |
| 10. Automation classification | FIXED | 1 candidate with deferred-worthy note (auto-corrected) | — |
| 11. Forbidden metadata | PASS | 0 | — |
| 12. Style conformance | PASS | 0 | — |
| 13. Sub-suite distribution | PASS | 0 | — |

**Total violations found:** 9 (3 blocking AC gaps + 1 blocking balance + 5 auto-fixed)
**Auto-fixes applied:** 8 edits across 5 files
**Blocking violations remaining:** 4

---

## Blocking violations (must fix before publish)

### Check 1 — AC coverage gaps

Three ACs in the combined pool have zero linked tests. These are in scope per A5 and the AC-delta.

**AC-87 (baseline) — Download as Spreadsheet (XLSX) entry points**
- Scope contract (A5 § In Scope): "AC-87 — Download as Spreadsheet (XLSX) entry points: row extra menu + multi-select Extra (destination owned by #8)."
- The row-extra-menu suite omits a `Download` entry-point test; the multi-select Extra dropdown does list `Download` in the parameterized Extra dropdown test (t.4) but its `source:` field cites only `AC-71, AC-87` is missing from source there.
- Action required: add a dedicated test for the Download XLSX entry point (row menu + multi-select Extra dropdown), or at minimum add `AC-87` to the `source:` of the multi-select Extra dropdown test (t.4 in `multi-select.md`) if that test is considered sufficient coverage.

**AC-88 (baseline) — Export as PDF entry point**
- Scope contract (A5 § In Scope): "AC-88 — Export as PDF entry point on row menu (destination owned by #8)."
- The row-extra-menu t.1 (state-aware menu) lists `Export as PDF` inside the expected items table for finished/in-progress rows but cites only `AC-69, ac-delta-5` in its `source:` field. AC-88 has no dedicated or linked test.
- Action required: add `AC-88` to the `source:` field of `row-extra-menu.md` t.1 (if that is sufficient entry-point coverage), OR add a dedicated entry-point test.

**ac-delta-12 — Pagination (« first / » last)**
- AC delta text: "Pagination uses first («) and last (») link controls; the current page number is shown as plain text between them; pagination appears only when total rows exceed the page size."
- No test cites `ac-delta-12` and no test exercises the pagination controls.
- Action required: add at least one test (can be a boundary or normal test). The precondition is a project with more runs than the page size. Example title: "Pagination controls appear when run count exceeds page size and navigate to first and last pages".

### Check 5 — Scenario balance (regression depth)

After auto-fixes (2 @negative tags removed), the balance is:

| Tag | Count | % | Threshold | Status |
|-----|-------|---|-----------|--------|
| @negative | 3 | 8.3% | ≥ 20% | FAIL |
| @boundary | 2 | 5.6% | ≥ 10% | FAIL |
| happy/positive (no tag) | 31 | 86.1% | ≤ 50% | FAIL |

Before the semantic-balance fixes, negative was 5/36 = 13.9% and still below threshold; after removing 2 mis-tagged @negative tests it dropped further to 3/36 = 8.3%.

Missing negative scenarios to consider adding:
- Opening the row extra menu on a run that has already been archived (menu items differ or are disabled).
- Attempting Multi-select bulk Archive when the selection contains no finished runs (only in-progress) — verifying the Archive button's conditional state.
- Applying a TQL filter that yields zero results — the "0 runs found" indicator should be verified (no list shown, Reset visible).
- Attempting to Move a run when no RunGroups exist in the project (only Root is available as a destination).

Missing boundary scenarios to consider adding:
- Select all + then deselect all to get back to 0 — verifies the boundary at which the bulk toolbar disappears.
- Pagination boundary: page 1 (« disabled) vs. last page (» disabled).

---

## Advisory violations

### Check 3 — UI element coverage (3 elements uncovered, coverage 94%)

Coverage is above the 80% threshold, so these are advisory only.

1. **`Enable autocomplete` checkbox** in the TQL Query Language Editor modal — no test verifies its on/off state or its effect on suggestions. Low priority since it is a UX convenience, not a filter gate.
2. **`Hyphenation (tags, labels, envs)` checkbox** in the Runs list settings panel — no test verifies it. Low priority; cosmetic column-wrapping option.
3. **Pagination controls** (`«`, current page text, `»`) — not exercised by any test. This is also a blocking AC-coverage gap (ac-delta-12) catalogued above.

---

## Auto-fixes applied

The following 8 targeted edits were made in-place. All surrounding content is preserved.

1. **filter-tabs-and-view.md, t.4** (`Hiding a column in Custom view Settings persists across reload`) — `automation: candidate` → `automation: deferred`. The `automation-note:` was already present and substantive (full-reload persistence concern); per the style guide `automation-note:` is only valid when `automation: deferred`. Corrected the classification to match the note rather than silently deleting the note.

2. **filter-tabs-and-view.md, t.4** — `priority: high` → `priority: normal`. Persistence of a column-visibility setting is a UX convenience detail; no workflow is blocked if it does not work. Content clearly contradicts `high` priority.

3. **tql-query-editor.md, t.2** (`Save button remains disabled until a non-empty query is typed @unclear`) — `priority: high` → `priority: normal`. This is an `@unclear` test covering button-enablement detail with unconfirmed product behavior. `high` priority is not supported by the content.

4. **cross-cutting.md, t.1** (`Multi-environment runs render with environment indicators`) — `priority: high` → `priority: normal`. This test is an observational rendering check — verifying that environment chips appear in a column. It does not gate any user workflow. Content contradicts `high`.

5. **multi-select.md, t.2** (`Closing the bulk toolbar via the close button keeps selection hidden`) — removed `@negative` tag. Closing a toolbar via its own close button is a standard happy-path affordance, not an error or negative path. The expected outcomes are all positive (toolbar removed, mode returns to off-state).

6. **row-extra-menu.md, t.7** (`Purge via row extra menu removes the run and shows the deletion toast`) — removed `@negative` tag. Purge completing successfully with a toast and row removal is a positive/happy-path outcome. The negative path would be a failed deletion or a cancelled confirmation.

7. **row-extra-menu.md, t.2** (`Pin then Unpin a run`) — split compound step "Click the `...` menu on that run and click `Pin`" into two atomic steps: (a) open the menu with expected observable; (b) click `Pin` with multi-bullet expected.

8. **cross-cutting.md, t.4** (`Bulk multi-select archive applies across every selected run end to end`) — split compound step "Deactivate Multi-select mode and reload the Runs page" into two atomic steps: (a) deactivate Multi-select mode with its own expected; (b) reload with the multi-bullet outcome expected.

---

## Distributions (post-fix)

**Scenario balance:**

| Tag | Count | % |
|-----|-------|---|
| happy/positive (no tag + @smoke) | 31 | 86.1% |
| @negative | 3 | 8.3% |
| @boundary | 2 | 5.6% |
| @unclear | 1 | 2.8% |
| @smoke (subset of above) | 9 | 25.0% |

**Priority pyramid (post-fix):**

| Priority | Count | % | Threshold |
|----------|-------|---|-----------|
| critical | 5 | 13.9% | ≤ 15% — OK |
| high | 12 | 33.3% | ≤ 35% — OK |
| normal | 17 | 47.2% | ≥ 35% — OK |
| low | 2 | 5.6% | ≥ 5% — OK |

**Automation:**

| Classification | Count | % |
|----------------|-------|---|
| candidate | 33 | 91.7% |
| deferred | 3 | 8.3% |
| manual-only | 0 | 0% |

**AC coverage:** 26/29 ACs covered (89.7%). Gaps: AC-87, AC-88, ac-delta-12.

**UI element coverage:** ~49/52 delta elements exercised in action steps (94.2%). Uncovered: `Enable autocomplete` checkbox, `Hyphenation` checkbox, pagination controls.

---

## Recommendations

1. **Add 3 tests to close AC gaps** (highest priority before publish):
   - One test for `AC-87` / Download XLSX entry point (row extra menu + multi-select Extra `Download` button, entry only; destination owned by #8). Alternatively, augment `multi-select.md` t.4 source field to include `AC-87` and accept that the parameterized Extra dropdown table already lists `Download`.
   - Augment `row-extra-menu.md` t.1 `source:` to include `AC-88` if the Export as PDF entry-point presence in the expected_items table is considered sufficient coverage for the scope contract. If a dedicated test is preferred, title example: "Export as PDF entry point is present in the row extra menu for finished runs".
   - One test for `ac-delta-12` pagination (see blocking section above for a suggested title and precondition).

2. **Improve scenario balance** — the suite is heavily positive (86%). For a regression-depth suite this is a quality risk. Suggested additions are listed in the blocking section above. At minimum, add a "TQL query returns zero results" test (easy to write, exercising the 0-state of the filter indicator) and a "Pagination first/last page controls" test to address the boundary gap simultaneously with the AC-delta-12 gap.

3. **Verify AC-87 source attribution** — the multi-select Extra dropdown test (`multi-select.md` t.4) exercises `Link`, `Download`, `Merge`, `Move` in its expected items table. If the team accepts that as sufficient coverage for the XLSX entry-point check, adding `AC-87` to its `source:` field is a 30-second fix that closes the blocking gap without writing a new test.

4. **Consider tagging "Settings gear is enabled only in Custom view" more precisely** — the test verifies a disabled state (Default view) and an enabled state (Custom view). The disabled-state coverage is genuinely negative; the enabled-state is positive. If the test were split, each half would be more precisely tagged. As written it is acceptable but the mixed-content makes it harder to filter during triage.

5. **automation-note on t.4 filter-tabs-and-view** — the note explains a legitimate automation concern (reload-persistence). After the auto-fix that aligns `automation: deferred` with the note, no further action is needed; the deferral is now correctly classified.
