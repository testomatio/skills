# Validation Log: test-execution-runner

Aggregated from 3 section file(s). Written by ui-validator subagent during Step 3 Phase 3b.

## Section: detail-pane-and-tree

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-18T23:11:00Z
**Tests walked:** "Priority filter ${priority_level} restricts the tree to matching tests" (High row)
**Mismatches fixed:** 3
**Gaps:** 1 — "Important priority" label: confirmed that the 5th priority level in the runner filter toolbar is "Important" (tooltip: "Important"), not a secondary "Critical". The example table only listed 4 levels; "Important" was missing. Added to table and preconditions.

Fixes applied:
- Priority filter example table: added "Important" row between "High" and "Critical"; reordered to match toolbar order (Normal, Low, High, Important, Critical)
- Preconditions updated: "at least one Critical" → "at least one Important, one Critical"
- Counter claim corrected: status counters show run-wide totals during filtering (not filtered-subset counts); same correction applied to the empty-tree boundary test

## Section: notes

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-18T23:11:00Z
**Tests walked:** "Create a note via the runner header 'Create notes +' action" (test 1); "Saving a note with an empty title is rejected @negative" (test 5)
**Mismatches fixed:** 5
**Gaps:** 0

Fixes applied:
- Header button label: tooltip is "Create notes" (not "Create notes +"); button is icon-only with no "+" appended
- Inline form heading is "Create note" (singular, not "Create notes +")
- Save button label is "Save note" (not "Save")
- Form body area is a textarea with placeholder "Result message" (not labeled "body text area"); also includes a "Bulk" checkbox
- Note badge class is `badge-type note` with an icon (text "note" is visually hidden via `hidden-type` class); no text badge rendered visibly
- No toast on note creation confirmed (matches catalog)

## Section: result-entry

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-18T23:11:00Z
**Tests walked:** "Apply standard status ${status} to a pending test @smoke" (Passed row)
**Mismatches fixed:** 10
**Gaps:** 1 — test 2 ("Result message is editable only after a standard status is selected @negative"): the Result message textarea is always rendered and editable on pending tests (not disabled/hidden before status selection); the test premise is incorrect. The drop zone (attachment area) is what appears only after status is applied, not the Result message textarea. Test body updated with gap notice.

Fixes applied:
- All "PASSED / FAILED / SKIPPED" button labels updated to "Passed / Failed / Skipped" (title case) across all 8 tests — UI confirmed buttons render in title case
- Parameterized example table rows updated: PASSED→Passed, FAILED→Failed, SKIPPED→Skipped, and standard_status table PASSED/FAILED→Passed/Failed
- Test 1 step 2: removed claim that "Result message text area becomes visible after status click" — textarea is always visible; replaced with correct description (custom sub-status buttons and attachment drop zone appear after status click)
- Test 7 step: removed "Attachments area (drop zone or existing attachments) is present" from pre-status expected; moved to post-status expected since drop zone appears only after status is applied

