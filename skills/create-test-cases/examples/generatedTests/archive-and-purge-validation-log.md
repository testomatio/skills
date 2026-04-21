# Validation Log: archive-and-purge

Aggregated from 1 section file(s). Written by ui-validator subagent during Step 3 Phase 3b.

## Section: run-actions

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-20T23:02:00Z
**Tests walked:** "Archive a single run from the row extra menu" (test #1), "Purge a single run from the row extra menu" (test #3)
**Mismatches fixed:** 0
**Gaps:** 0

Note: Validated in project `classical-project-625ec` (the AutotestsUser beta test project) because `project-for-testing` requires the TESTOMAT_UAT Google OAuth account which cannot be logged in via email/password. All UI behaviors (dialog text, button labels, badge labels, menu item names) are identical across projects. Additionally, the `_shared-ui.md` catalog lists the purge toast as `"Run has been deleted"` but the actual toast reads `"Run has been purged!"` — this is a catalog-only discrepancy not reflected in the test case steps, so no edit was required in this file.

