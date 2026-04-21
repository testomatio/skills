# Validation Log: runs-list-management

Aggregated from 3 section file(s). Written by ui-validator subagent during Step 3 Phase 3b.

## Section: multi-select

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-19T20:45:00Z
**Tests walked:** "Toggling Multi-select on and off shows and hides the row checkboxes and bottom toolbar" (multi-select.md)
**Mismatches fixed:** 0
**Gaps:** 0

Validated by ui-validator at 2026-04-19T20:45:00Z: 1 test walked, all _Expected_ lines verified. Multi-select toggle confirmed: checkboxes appear on activation (20 per page), bottom toolbar absent at 0 selections, appears at 1 selection with `Select all`, `Archive`, `Labels`, `Delete`, Extra dropdown; `Compare` link appears between `Labels` and `Delete` at 2+ selections; all controls disappear on Multi-select toggle off.

## Section: row-extra-menu

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-19T20:45:00Z
**Tests walked:** "Pin then Unpin a run cycles the indicator and repositions the row" (row-extra-menu.md)
**Mismatches fixed:** 0
**Gaps:** 0

Validated by ui-validator at 2026-04-19T20:45:00Z: 1 test walked, all _Expected_ lines verified. Pin toast `"Run has been pinned"` confirmed; Unpin produces no toast (confirmed); pin SVG indicator (`svg.md-icon-pin`) renders in row title area on pin; row repositions to top on pin and returns to chronological position on unpin.

## Section: tql-query-editor

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-19T20:45:00Z
**Tests walked:** "Applying a valid query filters the list and reflects the filter in the URL" (tql-query-editor.md)
**Mismatches fixed:** 4
**Gaps:** 0

Fixes applied:
- Lines 47, 67, 73, 217: replaced `failed == true` with `failed` — the variable `failed` is a zero-argument boolean flag in TQL; the syntax `failed == true` is rejected by the server with `"Error: Query Error: Require 0 arguments to failed"`. Correct TQL for filtering failed runs is the standalone keyword `failed`.
- Line 76: updated description from "runs whose failed-count criterion matches the query" to "runs with a failed status" to reflect that `failed` is a status flag, not a count comparison.

