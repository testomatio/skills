# Validation Log: run-groups

Aggregated from 3 section file(s). Written by ui-validator subagent during Step 3 Phase 3b.

## Section: archive-and-purge

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-19T16:42:00Z
**Tests walked:** "Archive a RunGroup cascades to all nested runs @smoke"
**Mismatches fixed:** 2
- Step 1 Expected (archive-source test): archive dialog text `"You are going to archive"` → corrected to `"You are going to archive this group"` (verified in live UI)
- Step 2 Expected (cancel-archive test): same dialog text fix applied
**Toast verified:** `"Rungroup has been archived!"` — exact match with MD and catalog
**Gaps:** 0

## Section: group-lifecycle

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-19T16:42:00Z
**Tests walked:** "Create a new RunGroup via the New group dialog @smoke"
**Mismatches fixed:** 2
- Step 1 Expected: dropdown entry `New group` → corrected to `New Group` (capital G, verified in live UI)
- Step 2 action text: `Click New group` → corrected to `Click New Group`
**Gaps:** 0

## Section: menu-actions

**Validated by:** ui-validator (subagent)
**Validated at:** 2026-04-19T16:42:00Z
**Tests walked:** "RunGroup extra menu action set is state-aware — ${group_state} @smoke" (active row, observed via live UI extra menu)
**Mismatches fixed:** 1
- Example table row for `active` expected_items was missing `Add Automated Run`, `Mixed Run`, and `Add Subgroup`; corrected to match live UI order: Edit, Copy, Add Existing Run, Add Automated Run, Mixed Run, Pin, Move, Add Subgroup, Move to Archive, Purge
**Gaps:** 0

