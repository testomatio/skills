# Validation Log: run-creation

Aggregated from 3 section file(s). Written by ui-validator subagent during Step 3 Phase 3b.

## Section: dialog-lifecycle

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-18T00:00:00Z
**Tests walked:** "Pressing ESC key closes the sidebar without creating a run"
**Mismatches fixed:** 1
**Gaps:** 0

Fix applied: Step 3 of the ESC dismiss test originally read "Press the ESC key". In practice, ESC only dismisses the sidebar when focus is NOT inside a text input. After typing in the Title field, one ESC press does not close the sidebar — it requires blurring the input first (click outside or Tab away), then pressing ESC. Step updated to "Click outside the Title input to remove focus, then press the ESC key". URL pattern updated from `/runs/` to `/runs` (no trailing slash matches actual browser URL).

## Section: launch-and-save

Validated by ui-validator at 2026-04-18T00:00:00Z: 1 test walked ("Launch creates a run and navigates to the Manual Runner with the first test pre-opened"), all _Expected_ lines verified.

## Section: scope-selection

Validated by ui-validator at 2026-04-18T00:00:00Z: 1 test walked ("All tests is the default scope and Launch creates a run with every manual test"), all _Expected_ lines verified.

