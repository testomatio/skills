---
feature: manual-tests-execution
suite: run-creation
references:
  - _ac-baseline.md
  - _shared-ui.md
  - run-creation-ac-delta.md
  - run-creation-ui-delta.md
approved_at: 2026-04-17
coverage_depth: regression
---

# Scope Contract: run-creation

## In Scope

### Dialog open / close / entry points
- Open sidebar by clicking 'Manual Run' (split-button left part) → AC-1, ac-delta-1
- Arrow-dropdown (chevron) opens menu without opening sidebar; menu items present: New Group, Mixed Run, Launch from CLI, Report Automated Tests → AC-13, AC-15, AC-17, AC-18, ac-delta-1
- Dismiss paths — Cancel / Close (×) / Back arrow all restore `/runs/` URL and do not create a run → ac-delta-2
- Entry from Tests page — suite extra menu → Run Tests; Multi-select bulk Run — open sidebar pre-populated → AC-12, ac-delta-17

### Form fields (presence, defaults, constraints)
- Title — optional, maxlength 255, blank auto-generates title → AC-7, ac-delta-3, ac-delta-4
- Description — optional, no enforced limit, whitespace-only treated as blank → AC-7, ac-delta-13
- RunGroup selector — exposes "Without rungroup" + named groups; pre-populated when opening from a RunGroup context → AC-7, AC-51, ac-delta-6
- Environment selector — opens Multi-Env Configuration modal entry (only the entry point; modal internals belong to #4) → AC-7, AC-45, ac-delta-7
- Assign to (presence only — creator default as manager; "Assign more users" link) → AC-37, AC-38, ac-delta-5
- "Run as checklist" toggle — OFF default; presence only → AC-7, AC-96, ac-delta-14
- "Run Automated as Manual" toggle — OFF default; actionable only in Select tests tab → AC-10, ac-delta-15

### Scope tabs (All / Plan / Select / Without)
- Mutually exclusive single-select; switching clears prior selection → AC-2, ac-delta-8
- All tests — default scope → AC-3
- Test plan — multi-select plans + create-new-plan action; plan's tests added to run → AC-4, AC-21
- Select tests — tree expand/collapse + search + filter + multi-select; checkboxes enabled only in this tab; selected-tests counter updates real-time → AC-5, AC-19, AC-20, ac-delta-9
- Without tests — creates empty run; Launch navigates to runner shell with no test pre-opened → AC-6, AC-22, ac-delta-11

### Launch / Save lifecycle (creation side only)
- Launch creates run and navigates to `/runs/launch/{id}/?entry={firstTestId}` → AC-8, AC-23, ac-delta-11
- Save stores run in pending/not-started state; appears in list with Continue action → AC-8, ac-delta-12
- Success toasts: "Run has been created" (Save), "Run has been started" (Launch) → ac-delta-10
- On validation/server error the sidebar stays open and feedback shown inline → ac-delta-18

## Unclear ACs (kept IN SCOPE with `@unclear` marking)

- **AC-9 / ac-delta-18 — Require RunGroup inline validation.** Could not be triggered in this exploration session (project setting not enabled). Test will be written against documented expected behaviour (field highlight + warning + launch blocked) and marked `@needs-project-setting @unclear`.
- **AC-11 — Single-test "Add to Run" from a test row.** Per-test UI affordance not surfaced in exploration; only Multi-select bulk Run observed. A dedicated test is retained, marked `@unclear` — if the button turns out to be the Multi-select-with-1-selection equivalent, the test will be merged into ac-delta-17 coverage later.

## Out of Scope

| Concern | Owner sub-feature | Justification |
|---|---|---|
| Auto-Assign strategies (None / Prefer / Randomly distribute) | #3 tester-assignment | creation-side only covers field presence |
| Multi-Env modal internals (slots, add env, group add/remove, run modes) | #4 environment-configuration | creation-side only covers entry-point click |
| New Group dialog content (Type / Merge / Name / Description) | #5 run-groups | creation-side only covers menu-item navigation |
| Mixed Run CI Profile + CLI internals | Mixed Run flow | creation-side only covers menu-item presence |
| Runner execution (PASSED/FAILED/SKIPPED, Result message, Toggle Description) | #2 test-execution-runner | launch-time navigation only |
| Continue / Finish / Relaunch / Edit-run | #6 run-lifecycle | post-creation lifecycle |
| Runs list filter tabs / row actions / TQL / Custom view | #7 runs-list-management | read-side of existing runs |
| Run detail panel + Run Report (basic/extended/public) | #8 run-detail-and-report | read-side |
| Archive / Purge | #9 archive-and-purge | terminal states |
| Bulk Result message / status counter inside runner | #10 bulk-status-actions | in-runner bulk actions |

## Cross-cutting concerns applicable

- **A. Multi-environment configuration** — creation-side: selecting ≥2 env groups is reflected in the creation UI (entry-point click count); at least 1 test.
- **B. Multi-user assignment** — creation-side: Assign to supports multiple assignees at dialog time; at least 1 test.
- **C. RunGroup membership** — creation-side: RunGroup required-validation (AC-9) + RunGroup pre-populated when opening from a RunGroup page (AC-51); covered by dedicated tests.
- **D. "Run as checklist" mode** — creation-side: toggle presence + default OFF + toggle ON stored on the created run (verified at creation moment, runner effect is #2); at least 1 test.

## Sources Used

- docs: running-tests-manually.md, managing-runs.md, rungroups.md, environments.md, running-manual-and-automated-tests.md
- UI: shared catalog `_shared-ui.md` (feature baseline) + delta catalog `run-creation-ui-delta.md`
- AC pool: 26 applicable baseline ACs + 18 delta ACs = 44 ACs total
