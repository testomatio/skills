---
feature: manual-tests-execution
suite: environment-configuration
references:
  - _ac-baseline.md
  - _shared-ui.md
  - environment-configuration-ac-delta.md
  - environment-configuration-ui-delta.md
baseline_acs_applicable: [AC-45, AC-46, AC-47, AC-48, AC-49, AC-50]
delta_ac_count: 15
approved_by: user
approved_at: 2026-04-18T15:00:00Z
---

# Scope Contract — environment-configuration

Owner of cross-cutting concern **A. Multi-environment configuration**.

---

## In Scope

Each item cites the AC(s) it covers. Step 3 must produce ≥ 1 test per item.

1. **Open & dismiss Multi-Environment Configuration modal**
   - Open via `+` button from the New Manual Run sidebar env row.
   - Re-open via `N environments configured` button when 2+ groups exist.
   - Dismiss via `Cancel`, `×` close, or outside click (UI-confirmed: Save / Cancel / ×).
   - **Source:** AC-45, ac-delta-1, ac-delta-5, ac-delta-15

2. **Single env group — add, select envs, Save, render in sidebar**
   - Open modal, check one or multiple env checkboxes inside group 1, click Save.
   - Sidebar env row shows selected env values as badge chips.
   - **Source:** AC-45, AC-46, ac-delta-1, ac-delta-5

3. **Add / remove / edit env groups**
   - `Add Environment` creates group 2, 3 etc.; new groups start collapsed.
   - Minus (−) button removes a group; removing last group clears selection.
   - Re-opening modal preserves prior selection; editing updates sidebar chips.
   - **Source:** AC-47, ac-delta-2, ac-delta-3, ac-delta-15

4. **Quick-fill shortcuts inside a group**
   - `All` master checkbox toggles every env in the expanded group.
   - `Add all envs` footer link populates every env of the currently expanded group.
   - **Source:** ac-delta-13, ac-delta-14

5. **Launch button variants driven by group count**
   - 0 or 1 env group → primary "Launch" only.
   - 2+ env groups → "Launch in Sequence" + "Launch All" (no plain Launch).
   - **Source:** ac-delta-6, ac-delta-7

6. **Launch in Sequence behaviour (cross-cutting A must-test)**
   - Click "Launch in Sequence" → creates parent RunGroup titled `"Multi-environment tests at {datetime}"`.
   - Child runs are created for each env group, one per group.
   - First child run opens in Manual Runner; other children remain queued.
   - Each child run displays its env value as a badge on the Runs list.
   - **Source:** AC-49, ac-delta-9, ac-delta-11

7. **Launch All behaviour (cross-cutting A must-test)**
   - Click "Launch All" → creates parent RunGroup + N child runs, all "New Run" status immediately.
   - Sidebar stays open (does NOT navigate into a runner).
   - Each child shows its env badge on the Runs list.
   - **Source:** AC-50, ac-delta-10, ac-delta-11

8. **Empty env group — silent accept (negative / boundary)**
   - Saving the modal with zero envs checked in a group is allowed.
   - Modal closes; sidebar env row may show placeholder "Set environment for execution" if all groups are empty.
   - **Source:** ac-delta-12

9. **Launch All + `Without tests` scope (negative)**
   - With multi-env configured AND `Without tests` scope → "Launch All" surfaces banner `"Select a plan or select all"`.
   - Sidebar stays open; no run is created.
   - **Source:** ac-delta-12 (negative branch)

10. **Interaction with creation-dialog fields (cross-sub-feature smoke)**
    - Env configuration coexists with Title / Description / scope / RunGroup / Assign to — changing env config does not reset the other fields.
    - Presence-only check; the field composition is owned by #1 run-creation.
    - **Source:** AC-45 (contextual), ac-delta-1

---

## Out of Scope

- **AC-44 Settings → Environments seed list** — site-wide configuration; owned elsewhere. Assumed as precondition only.
- **TQL env-based filter on Runs list** — owned by #7 runs-list-management.
- **Purge / Archive of multi-env RunGroups** — owned by #9 archive-and-purge.
- **RunGroup Report / Combined Report for multi-env parents** — owned by #5 run-groups.
- **In-runner behaviour of an active env run** (status entry, attachments, step-by-step) — owned by #2 test-execution-runner.
- **Relaunch of a multi-env run or a single child env run** — owned by #6 run-lifecycle.

---

## Unclear ACs (preserved, but tests tagged)

- **AC-48 / ac-delta-8 — "One Run" single-run multi-env mode**
  - Not observable in current UI. ONE `@unclear` test documenting the search path and the current absence; no concrete happy-path generated. Waiting on product clarification.
- **ac-delta-4 — `Category:Value` prefix grouping of env options**
  - Requires Settings → Environments seed data (not present in `project-for-testing`). ONE `@needs-project-setting` test documenting expected dropdown structure when seeded; skipped in current environment.

---

## Sources Used

- `_ac-baseline.md` — AC-44 through AC-50
- `_shared-ui.md` — shared runs list / sidebar chrome / nav
- `environment-configuration-ac-delta.md` — 15 delta ACs (updated after UI exploration)
- `environment-configuration-ui-delta.md` — 28 delta elements, 5 verified flows, 2 gaps (AC-48 mode absent; Category:Value requires seed)
- A2 destructuring — row #4, cross-cutting concern A, recommended execution order
