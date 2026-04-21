---
feature: manual-tests-execution
suite: archive-and-purge
references: _ac-baseline.md
baseline_acs_applicable: [AC-56, AC-57, AC-69, AC-71, AC-75, AC-76, AC-77, AC-78, AC-79, AC-80, AC-81, AC-100]
delta_ac_count: 20
source: mixed
cross_cutting: [C, G]
generated_at: 2026-04-20
---

## Baseline ACs applicable to archive-and-purge

- AC-56 (baseline) — Archiving a RunGroup archives all nested runs; unarchiving restores them all.
- AC-57 (baseline) — Purging a RunGroup moves all nested Runs to Archive with a Purged badge; limit 20 000 runs per purge.
- AC-69 (baseline, archive/purge portion only) — Each run row extra "..." menu exposes Archive and Purge actions.
- AC-71 (baseline, archive/purge portion only) — Multi-select on Runs exposes bulk Archive and bulk Purge actions.
- AC-75 (baseline) — User can Archive a single Run or RunGroup from its extra menu → "Archive" → Confirm; item gets an "archived" badge.
- AC-76 (baseline) — Archiving a run with Pending tests sets the run status to Terminated and Pending tests to Skipped; other statuses remain.
- AC-77 (baseline) — Archive access is via "Runs/Groups Archive" at the bottom of the Runs page or via the Extra menu.
- AC-78 (baseline) — "Purge" replaces Delete for Runs — compresses and moves to Archive with a Purged badge; test results, artifacts, custom statuses preserved; stack traces removed.
- AC-79 (baseline) — Automatic Purge is controlled by Project Settings → Purge Old Runs; default retention 90 days; auto-purged runs get the Purged badge.
- AC-80 (baseline) — Ongoing purged run: run terminated, recorded statuses kept, Pending → Skipped, receives a "terminated" flag; restored terminated runs cannot be resumed.
- AC-81 (baseline) — Permanent deletion from Archive is irreversible and tracked in Pulse under "Deleted Run".
- AC-100 (baseline, UNCLEAR) — Complete permission matrix (who may Archive, Purge, Unarchive, Permanently delete). Verify during UI exploration.

## Cross-cutting concerns applied to this sub-feature

- **CC-C (RunGroup membership):** Archive/Purge cascade through RunGroup → all nested runs archived/purged; unarchiving a group restores all nested runs; orphan runs (no group) unaffected.
- **CC-G (Ongoing vs Finished state):** Archive behaviour differs for ongoing runs (terminated, Pending → Skipped) vs finished runs (statuses preserved).

## Delta ACs (sub-feature-specific)

ac-delta-1: The Runs list single-run extra menu "Archive" action opens a confirmation dialog; Cancel aborts the action with no state change, Confirm archives the run.

ac-delta-2: The Runs list Multi-select mode exposes a bulk "Archive" action that archives all selected runs in one confirmation; RunGroups cannot be multi-selected for archive (per scope — Multi-select archive runs only).

ac-delta-3: The Runs list single-run extra menu "Purge" action opens a confirmation dialog distinct from Archive (explicit destructive wording); Cancel aborts, Confirm purges the run and moves it to Archive with a "Purged" badge.

ac-delta-4: After purge, the run entry in Archive retains: recorded test statuses, attachments, custom statuses, Run ID, title; stack traces are removed.

ac-delta-5: The Runs list top-right extra / sidebar exposes a "Runs Archive" entry point, and the Runs page footer area exposes "Runs Archive" and "Groups Archive" links.

ac-delta-6: Runs Archive page lists archived runs and supports filter tabs (Manual / Automated / Mixed) plus a status/badge filter that distinguishes "Archived", "Purged", and "Terminated" items.

ac-delta-7: Runs Archive page has a "Rungroup Structure" toggle that groups archived runs hierarchically under their parent RunGroup when ON and shows a flat list when OFF.

ac-delta-8: Runs Archive page exposes a retention input (Purge Old Runs setting) with a numeric value and a unit (days); value persists per project.

ac-delta-9: Retention input validation — non-numeric or negative values are rejected; empty value disables automatic purge or shows validation feedback; default value is 90 days when the project has no prior setting.

ac-delta-10: Groups Archive page supports Search (by group name) and filter by Group type; clearing filters restores the full list.

ac-delta-11: Groups Archive page supports filter by Finish Range (date-range picker) and excludes groups outside the selected window.

ac-delta-12: Groups Archive page supports sorting by Name and by Date, with ASC/DESC direction selectable; sort indicator is visible on the active column.

ac-delta-13: User can Unarchive a single Run from the Runs Archive via the row extra menu → "Unarchive"; the run returns to the active Runs list with its prior statuses intact.

ac-delta-14: User can Unarchive multiple Runs via Multi-select → bulk "Unarchive" action on the Runs Archive page; all selected runs move back to the active list.

ac-delta-15: User can Unarchive a single RunGroup from the Groups Archive via extra menu → "Unarchive"; all nested runs restore together and reappear in the active Runs list (cascade CC-C).

ac-delta-16: Archived items display distinct visible badges: "Archived" (manual archive of a finished run), "Purged" (compressed/auto-purged), "Terminated" (run archived while in-progress). Badges are visible in the Archive page row and on the run detail header.

ac-delta-17: Archive page exposes a permanent-deletion action (Delete / Remove permanently) guarded by a distinct confirmation with irreversibility wording; action is irreversible and removes the row from Archive.

ac-delta-18: After permanent deletion, the event is recorded in project Pulse with actor (user email/name), timestamp, and entity identifier under a "Deleted Run" entry.

ac-delta-19: Purging a RunGroup with more than 20 000 runs is blocked; user receives an error or guidance and the operation does not proceed.

ac-delta-20: Archive / Unarchive / Purge / Permanent delete permissions follow role rules — read-only users cannot perform destructive actions; manager/owner can; QA-role behaviour verified via UI (resolves AC-100 unclear for this sub-feature scope).
