---
feature: manual-tests-execution
suite: run-groups
references:
  - _ac-baseline.md
  - _shared-ui.md
  - run-groups-ac-delta.md
  - run-groups-ui-delta.md
baseline_acs_applicable: [AC-13, AC-14, AC-51, AC-52, AC-53, AC-54, AC-55, AC-56, AC-57, AC-70]
delta_ac_count: 17
approved_by: user
approved_at: 2026-04-19T00:00:00Z
---

# Scope Contract — run-groups

Owner of cross-cutting concern **C. RunGroup membership** (downstream obligations for #7 and #9 remain with those suites).

---

## In Scope

Each item cites the AC(s) it covers. Step 3 must produce ≥ 1 test per item.

1. **Open & save a new RunGroup (happy path)**
   - Open dialog via arrow / split-button next to the primary "Manual Run" CTA → "New group".
   - Fill Name + Merge Strategy; optionally pick Group Type and Description; Save.
   - Group appears in the active Runs list under the Groups scope without a full page refresh.
   - **Source:** AC-13, AC-14, ac-delta-1, ac-delta-5

2. **New Group — empty Name is blocked (negative)**
   - Leaving Name empty keeps the Save action disabled OR surfaces an inline validation error on blur/submit.
   - Group is NOT created.
   - **Source:** AC-14, ac-delta-4

3. **New Group — Merge Strategy options enumerated**
   - Dialog exposes 3 mutually-exclusive strategies: Realistic (default), Optimistic, Pessimistic.
   - Each strategy persists after Save and is visible on the saved group's metadata.
   - **Source:** AC-14, ac-delta-3

4. **New Group — Group Type options enumerated**
   - Group Type typeahead exposes Build / Release / Sprint; leaving it empty is allowed.
   - Chosen type persists after Save.
   - **Source:** AC-14, ac-delta-2

5. **Create a Run inside a RunGroup (RunGroup field pre-populated)**
   - Open a RunGroup → "Add Manual Run" → New Manual Run dialog opens with the current RunGroup already selected.
   - Field is editable (can switch to another group or clear).
   - Launched run lands in the current group.
   - **Source:** AC-51, ac-delta-7

6. **Move an existing Run into a RunGroup**
   - On a run row → "…" → Move → destination picker lists RunGroups → pick a group → Move.
   - Run now appears under the destination group; source list no longer shows it outside the group context.
   - **Source:** AC-52

7. **Add Existing Run(s) to a group from the group's extra menu**
   - Group extra menu / header → "Add Existing Run" → picker lists eligible runs (excludes runs already in the group) with multi-select + confirm.
   - After confirmation, selected runs appear inside the group.
   - **Source:** AC-53, ac-delta-14

8. **RunGroup page — basic view composition**
   - Header: group name + type + strategy meta.
   - Chart / aggregate visual, per-run summary rows (title / status / counters), "Combined Report" action, "Add Manual Run" entry point.
   - **Source:** AC-54, ac-delta-6, ac-delta-8

9. **Combined Report — open, filters, totals, main run anchor + Compare To**
   - Open Combined Report from the RunGroup page.
   - View exposes: main run anchor selector, "Compare To" peer selector, status / type / assignee filters, aggregated totals.
   - Changing the anchor re-bases the diff without leaving the view.
   - Cross-group peer comparison tagged `@unclear` (see Unclear ACs).
   - **Source:** AC-54, ac-delta-10, ac-delta-11

10. **Per-group Runs list column customisation persists (auto-save)**
    - Precondition: RunGroup with at least one child run.
    - Change column visibility / width on the group's Runs list → navigate away → return → settings persist.
    - Global Runs list customisation is unaffected by this change (and vice versa).
    - **Source:** AC-55, ac-delta-9

11. **Edit Group dialog — fields pre-populated; Save commits in-place**
    - Extra menu → Edit → dialog opens with current Name / Type / Strategy / Description.
    - Change Name and/or Merge Strategy → Save → values persist on the SAME group (no duplicate created).
    - Cancel discards changes.
    - **Source:** ac-delta-13

12. **Copy Group dialog — scoped-copy toggles**
    - Extra menu → Copy → dialog exposes toggles for Assignees / Issues / Labels / Environments / Nested Structure.
    - Copy creates a new RunGroup with only the selected slices duplicated; the source group remains intact.
    - **Source:** ac-delta-15

13. **Pin & Unpin a RunGroup**
    - Extra menu → Pin → group moves to a pinned region at the top of the Runs / Groups list; menu label flips to "Unpin".
    - Unpin → group returns to its natural sort position; menu label flips back to "Pin".
    - Pinned-region VISUAL badge coverage tagged `@partial` (see Unclear ACs / gap-3).
    - **Source:** AC-70, ac-delta-16

14. **Archive a RunGroup — cascade**
    - Extra menu → Archive → confirmation dialog → confirm.
    - Group and all nested runs leave the active list; each nested run carries an "Archived" badge.
    - Group appears in the Groups Archive page.
    - **Source:** AC-56, ac-delta-17

15. **Unarchive a RunGroup — cascade restore**
    - From the Groups Archive → extra menu → Unarchive.
    - Group returns to the active Runs list; all previously-nested runs are restored with prior statuses intact.
    - **Source:** AC-56, ac-delta-17

16. **Purge a RunGroup — cascade**
    - Extra menu → Purge → confirmation → confirm.
    - Group and all nested runs carry a "Purged" badge in the Archive (test results, artifacts, custom statuses preserved per AC-78).
    - 20 000-run limit NOT exercised — out of scope.
    - **Source:** AC-57, ac-delta-17

17. **Extra menu is state-aware**
    - Active group: Copy, Pin/Unpin, Edit, Add Existing Run, Archive, Purge.
    - Archived group: Unarchive visible; Archive hidden; remaining items behave per product rules.
    - Pinned group: "Unpin" replaces "Pin"; everything else unchanged.
    - **Source:** ac-delta-12

---

## Out of Scope

- **AC-9 "Require RunGroup for new runs" validation** — owned by #1 run-creation.
- **Runs-list "Groups" filter tab behaviour + bulk Move-to-group from Runs list** — owned by #7 runs-list-management.
- **Run-level archive / purge outside of a RunGroup** — owned by #9 archive-and-purge.
- **In-runner execution of runs inside a group** (status entry, attachments, step-by-step, custom statuses) — owned by #2 test-execution-runner.
- **Finish / Continue / Relaunch / Advanced Relaunch / Launch a Copy** of runs inside a group — owned by #3 run-lifecycle.
- **20 000-run purge limit (AC-57 tail)** — scale-only, not manually testable without seeded data.
- **Combined Report "Compare To" across DIFFERENT groups** — tagged `@unclear` in item 9; no concrete test path generated.
- **Project Settings → Purge Old Runs retention / auto-purge behaviour** — owned by #9.

---

## Unclear ACs (preserved, but tests tagged)

- **ac-delta-U1 — 20 000-run purge limit (AC-57)**
  - Not manually testable; no test generated. Documented in Out of Scope.
- **ac-delta-U2 — Combined Report "Compare To" cross-group support**
  - ONE `@unclear` doc test in item 9 covering the currently observed within-group-only behaviour; full cross-group test withheld pending product clarification.
- **gap-3 — Pin badge / pinned-region visual layout**
  - Covered partially by item 13 (`@partial`): Pin click + menu flip verified; pinned-row region placement confirmed only as proxy (top-of-list) without a seeded second pinned group for visual ordering tests.

---

## Sources Used

- `_ac-baseline.md` — AC-13, AC-14, AC-51 through AC-57, AC-70
- `_shared-ui.md` — shared Runs list / nav / dialog chrome / toasts
- `run-groups-ac-delta.md` — 17 delta ACs (2 flagged UNCLEAR)
- `run-groups-ui-delta.md` — 52 delta elements, 5 verified flows, 4 gaps (20k limit / cross-group Compare To / Pin badge / per-group columns)
- A2 `destructuring.md` — row #5 run-groups (Owns / Does NOT own / Key elements), cross-cutting concern C (#6 is owner; obligations for #7 and #9 remain with those suites), recommended execution order
