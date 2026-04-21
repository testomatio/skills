---
feature: manual-tests-execution
suite: run-creation
references: _ac-baseline.md
baseline_acs_applicable: [AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9, AC-10, AC-11, AC-12, AC-13, AC-15, AC-17, AC-18, AC-19, AC-20, AC-21, AC-22, AC-23, AC-37, AC-38, AC-45, AC-51, AC-96]
delta_ac_count: 18
source: mixed
generated_at: 2026-04-17T00:00:00Z
---

## Baseline ACs applicable to run-creation

Creation dialog core (owns):
- AC-1 (baseline) — open New Manual Run from Runs page 'Manual Run' button
- AC-2 (baseline) — mutually exclusive scope selectors (All / Plan / Select / Without)
- AC-3 (baseline) — "All tests" default scope
- AC-4 (baseline) — Test plan scope (multi-select plans + create new plan)
- AC-5 (baseline) — Select tests scope (tree, search, filter, multi-select)
- AC-6 (baseline) — Without tests scope creates empty run
- AC-7 (baseline) — dialog exposes Title / RunGroup / Environment / Description / Run as checklist
- AC-8 (baseline) — Launch / Save / Cancel actions exposed
- AC-9 (baseline) — Require RunGroup validation blocks launch when enabled and missing (cross-cutting C)
- AC-10 (baseline) — "Run Automated as Manual" toggle in Select tests
- AC-11 (baseline) — single-test entry point from Tests page ("Add to Run" → unfinished run)
- AC-12 (baseline) — suite / Multi-select entry point from Tests page ("Run Tests" → Launch)
- AC-96 (baseline) — "Run as checklist" toggle presence in creation (toggle side; runtime effect owned by #2)

Arrow dropdown extras (menu presence only — deep flows owned by other sub-features):
- AC-13 (baseline, menu presence only) — "New group" item in arrow dropdown (dialog details owned by #5)
- AC-15 (baseline, menu presence only) — "Mixed Run" item in arrow dropdown
- AC-17 (baseline, menu presence only) — "Report Automated Tests" item
- AC-18 (baseline, menu presence only) — "Launch from CLI" item

Scope tab behaviours:
- AC-19 (baseline) — expand/collapse suites, toggle tests, search
- AC-20 (baseline) — selected-tests counter updates in real time
- AC-21 (baseline) — Test plan tab adds the plan's test set
- AC-22 (baseline) — Without tests mode creates a run with zero tests

Creation-side of other sub-features (field/presence ownership only):
- AC-23 (baseline, creation side) — Launch creates run and transitions to active state (creation moment, lifecycle state transitions owned by #6)
- AC-37 (baseline, creation side) — run creator is default assignee (field default in dialog)
- AC-38 (baseline, creation side) — "Assign to" selector in creation dialog (multi-assignee field; strategies owned by #3)
- AC-45 (baseline, creation side) — "+" in environment section opens env-config modal (modal details owned by #4)
- AC-51 (baseline, creation side) — RunGroup field pre-populated when opening from an existing RunGroup context

## Delta ACs (sub-feature-specific)

Observed from UI catalog (`_shared-ui.md`) or docs but not captured as first-class baseline ACs:

ac-delta-1: "Manual Run" is a split-button — clicking the left part navigates to `/runs/new` and opens the sidebar; the right chevron opens the arrow dropdown (New Group / Mixed Run / Launch from CLI / Report Automated Tests) without opening the sidebar.

ac-delta-2: The New Manual Run sidebar opens as a right-side drawer overlay; it can be dismissed via Close (×) button, Back arrow, or Cancel — all three restore the URL to `/runs/` without creating a run.

ac-delta-3: Title input enforces a maximum of 255 characters (HTML `maxlength`). Entry beyond the limit is truncated or rejected by the field.

ac-delta-4: If Title is left blank, an auto-generated run title is applied on Launch/Save (e.g., plan name, scope summary, or timestamp-based default).

ac-delta-5: The creator appears by default in the assignee section with the `as manager` role label; adding additional testers is done via an "Assign more users" link (owned by #3, but presence in creation sidebar is owned here).

ac-delta-6: RunGroup dropdown always includes a "Without rungroup" option plus all existing named groups; selecting "Without rungroup" leaves the run ungrouped.

ac-delta-7: Clicking the environment field opens the Multi-Environment Configuration modal (modal content details owned by #4; presence of entry-point + first-slot creation owned here).

ac-delta-8: Scope tabs (All tests / Test plan / Select tests / Without tests) behave as a single-select radio group — switching tabs clears any selection made in the previous tab (no cross-tab retention).

ac-delta-9: Test tree checkboxes are disabled until the "Select tests" tab is active; choosing any other tab hides/disables the checkbox controls but keeps the tree visible as a preview.

ac-delta-10: Successful Save shows toast `"Run has been created"`; successful Launch shows toast `"Run has been started"` (or equivalent success feedback).

ac-delta-11: Launch navigates to `/projects/{project}/runs/launch/{id}/?entry={firstTestId}` (runner with first test pre-opened); when scope is "Without tests" Launch navigates to the runner shell with no test pre-opened.

ac-delta-12: Save leaves the run in a pending/not-started state; it appears in the Runs list with a Continue action — without a launched runner session being opened.

ac-delta-13: Description textarea is optional and has no enforced character limit (or an intentionally large one); whitespace-only input is treated as blank.

ac-delta-14: "Run as checklist" toggle is OFF by default in the dialog.

ac-delta-15: "Run Automated as Manual" toggle is OFF by default and only becomes actionable when scope is "Select tests" (ignored in All/Plan/Without scopes).

ac-delta-16: Single-test "Add to Run" from the Tests page lists ONLY unfinished runs as destinations; if no unfinished runs exist, the option offers to create a new one instead.

ac-delta-17: Suite-level "Run Tests" entry point pre-populates the creation dialog with the suite pre-selected in the "Select tests" tab; Multi-select "Run Tests" pre-populates the union of selected tests.

ac-delta-18: When an error occurs on Launch/Save (blocked by validation — e.g., required RunGroup missing, title conflict, or server error), the sidebar remains open and the failure is communicated inline (field highlight or error banner) without navigating away.
