---
feature: manual-tests-execution
suite: bulk-status-actions
references:
  - _ac-baseline.md
  - _shared-ui.md
  - bulk-status-actions-ac-delta.md
  - bulk-status-actions-ui-delta.md
coverage_shape: regression
approved_at: 2026-04-19
---

# Scope — bulk-status-actions

Bulk actions inside the Manual Runner: Multi-Select mode, per-test / per-suite selection, quick-set status buttons, "Result message" modal flow, filter-scoped selection, Clear Selection, counter propagation.

## In Scope

Each numbered item maps to ≥1 AC and has supporting UI catalogued in `bulk-status-actions-ui-delta.md`.

1. **Enter Multi-Select mode** — clicking the Multi-Select toolbar toggle reveals per-test and per-suite checkboxes; button gains `btn-selected` state. (`ac-delta-1`)
2. **Exit Multi-Select clears selection + hides bulk toolbar** — toggling Multi-Select off removes checkboxes and clears any current selection. (`ac-delta-2`)
3. **Per-test checkbox selection** — each check highlights the row (`bg-indigo-50`) and increments the `"{N} tests selected"` counter. (`ac-delta-4`)
4. **Suite-level checkbox selects all tests under the suite** — default behaviour with no filter. (`ac-delta-3`)
5. **Zero selection → bulk toolbar not rendered** — toolbar is absent when 0 tests are selected; no empty-state variant. (`ac-delta-5`)
6. **Clear Selection (×) keeps Multi-Select active** — toolbar disappears and selection count returns to 0; checkboxes stay visible for further selection. (`ac-delta-11`)
7. **"Result message" modal — Apply requires a status, message optional** — Apply stays disabled until a status button is active; textarea is optional. (`AC-30`, `AC-94`, `ac-delta-6`)
8. **Bulk apply updates every selected test's status and (optional) message** — tree status icons update; no toast. (`AC-29`, `ac-delta-8`)
9. **Header counters update immediately after bulk apply** — Passed/Failed/Skipped incremented, Pending decremented by the exact count. (`AC-95`, `ac-delta-9`)
10. **Modal cancel (× / Escape) clears selection without applying status** — documented deliberate behaviour — cancellation also hides the bulk toolbar. (`ac-delta-7`)
11. **Quick-set toolbar buttons with native confirm** — clicking PASSED / FAILED / SKIPPED in the toolbar opens a browser-native confirm; Accept applies, Cancel leaves state unchanged. (`AC-29`, `ac-delta-10`)
12. **Filter-scoped selection (cross-cutting F)** — with a status or priority filter active in the runner, Suite checkbox selects only the filter-matching tests and bulk apply only affects those. (`AC-66`)
13. **Cross-cutting H — bulk multi-select mode end-to-end** — one canonical bulk Result message scenario (select → modal → status → message → Apply → verify tree + counters). (`AC-93`)
14. **Custom status in bulk modal — carry-through `@unclear`** — one test verifying whether custom statuses configured in Project Settings appear in the bulk "Result message" dialog; to be tagged `@unclear @needs-project-setting` because `project-for-testing` has none configured. (`AC-31`)

## Out of Scope

- **Bulk "Assign to"** — owned by #3 tester-assignment (explicit `Does NOT own` in destructuring). Icon is visible in the bulk toolbar but its dialog flow lives in sub-feature #3.
- **Bulk Delete (red icon in toolbar)** — not owned by #10 per destructuring; destructive affordance belongs elsewhere (likely run-lifecycle / runner tree actions).
- **Multi-select on the Runs list** — owned by #7 runs-list-management.
- **Single-test result entry (non-bulk), attachments, custom status on a single test** — owned by #2 test-execution-runner.
- **Error / network-failure paths on bulk apply** — not explored; no observable error surface discovered in UI.
- **Persistence of selection across page reload / navigation** — toggling Multi-Select off already clears; full reload behaviour is orthogonal to bulk-action contract.

## Unclear ACs

### AC-31 — Custom status dropdown in bulk "Result message" modal
- **UI finding:** the `<div class="flex space-x-3 pr-1 mb-4">` placeholder after the standard status buttons renders empty (`<!---->`) in `project-for-testing`.
- **Likely cause:** no custom statuses are configured in the project; feature may still work in a project that has them.
- **Test strategy:** keep one test for this AC, tagged `@unclear @needs-project-setting`, described so that the execution step becomes a verify-or-skip depending on whether the project under test has custom statuses configured. Do NOT delete — capture the uncertainty.

## Sources Used

- `_ac-baseline.md` — 7 applicable baseline ACs (29, 30, 31, 66, 93, 94, 95)
- `bulk-status-actions-ac-delta.md` — 11 delta ACs
- `_shared-ui.md` — runner chrome, header status counters (shared, not re-tested)
- `bulk-status-actions-ui-delta.md` — 22 delta elements, 5 verified flows, 1 recorded gap (AC-31)
- `destructuring.md` — sub-feature #10 ownership row + cross-cutting F (filter scope) and H (bulk multi-select)

## Coverage shape

`regression` per intake Q2: happy ≤ 50%, negative ≥ 20%, boundary ≥ 10%. Test count is driven by AC coverage + balance thresholds, not by a target number — roughly in line with destructuring's 10–15 estimate.
