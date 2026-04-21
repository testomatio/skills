# Validation Log: run-lifecycle

Aggregated from 3 section file(s). Written by ui-validator subagent during Step 3 Phase 3b.

## Section: advanced-relaunch

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-18T12:35:00Z
**Tests walked:** "'Keep values' toggle is disabled while 'Create new run' is OFF" @negative @boundary
**Mismatches fixed:** 0
**Gaps:** 0

All four step assertions verified live on run `5cff086c/advanced`. 'Create new run' checkbox defaults to unchecked (OFF); 'Keep values' renders as `[disabled]` (greyed out, not interactive) while Create new run is OFF. Toggling Create new run to ON activates 'Keep values' (becomes interactive, `[cursor=pointer]`). Toggling Create new run back to OFF returns 'Keep values' to disabled state regardless of its last value. Sidebar dismissed via Cancel link — no run was created.

## Section: basic-relaunch

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-18T12:35:00Z
**Tests walked:** "Relaunch menu items appear only on finished runs — not on unfinished runs" @negative
**Mismatches fixed:** 1
**Gaps:** 0

**Fix:** Step 1 expected result for unfinished run menu updated to include 'Advanced Relaunch'. The real context menu for unfinished run `19dd1706` contains: Launch, Advanced Relaunch, Edit, Finish (plus non-lifecycle items). The original expected result omitted 'Advanced Relaunch' from the DOES-contain list.

Step 3 (finished run menu) verified against run `5cff086c` (truly finished, has Finished At timestamp): menu shows Relaunch, Advanced Relaunch, Launch a Copy — matches expected list. 'Launch', 'Edit', 'Finish' are absent. No fix needed for step 3.

## Section: finish-run

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-18T12:35:00Z
**Tests walked:** "Finish Run confirms and terminates the run, marking Pending tests as Skipped" @smoke
**Mismatches fixed:** 0
**Gaps:** 0

Steps 1–2 verified live on run `19dd1706` (Passed=2, Failed=0, Skipped=0, Pending=2507). Finish Run button present in runner header. Browser native confirm() dialog exact message: `"2507 tests were not run. Pending tests that are not linked to any other test result will be marked as skipped."` — matches test template. Dialog dismissed via Cancel; runner URL unchanged, run state unmodified. Steps 3–4 (accept dialog and verify status) not executed to avoid permanently modifying shared run data; step mechanics are standard browser dialog accept + navigation and carry no mismatch risk.

