# Validation Log: tester-assignment

Aggregated from 3 section file(s). Written by ui-validator subagent during Step 3 Phase 3b.

## Section: creation-dialog-assignment

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-18T00:00:00Z
**Tests walked:** "Adding the first user reveals Auto-Assign selector and propagates the assignee on Launch @smoke"
**Mismatches fixed:** 3
**Gaps:** 0

Fixes applied:
- T1 step 4 _Expected_: `"Assign users"` → `"Assign Users"` (actual UI label has capital U)
- T2 step 2 _Expected_: `"Assign users"` → `"Assign Users"`
- T2 step 3 action: `'Assign users'` → `'Assign Users'`

All other T2 steps verified as MATCH: Auto-Assign button label "Auto-Assign: none" is correct; toast "Run has been started" is correct; runner URL pattern `/projects/{project}/runs/launch/{id}/` is correct; Runs list avatar stack with tooltips confirmed present.

## Section: edit-run-assignment

Validated by ui-validator at 2026-04-18T00:00:00Z: 1 test walked, all _Expected_ lines verified.

Test walked: "Adding a user on Edit Run propagates to the ongoing runner Assign to dropdowns @smoke"

Confirmed: Edit page navigates to `/projects/{project}/runs/edit/{id}/`; manager chip rendered above Assign Users multi-select with no remove control; Save navigates to run detail view (matches "Runs list or run detail view"); suite-level Assign to dropdown in runner immediately shows newly added user without requiring page reload. All steps MATCH.

## Section: runner-assignment-paths

Validated by ui-validator at 2026-04-18T00:00:00Z: 1 test walked, all _Expected_ lines verified.

Test walked: "Multi-Select bulk Assign to applies to every selected test after OK on the native confirm @smoke"

Confirmed: native confirm dialog exact text is "Are you sure you want to assign {display name} to all selected tests?" — matches MD template. No toast shown after OK. Per-test assignee chips update correctly. All steps MATCH.

