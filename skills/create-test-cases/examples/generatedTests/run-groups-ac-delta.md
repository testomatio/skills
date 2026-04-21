---
feature: manual-tests-execution
suite: run-groups
references: _ac-baseline.md
baseline_acs_applicable: [AC-13, AC-14, AC-51, AC-52, AC-53, AC-54, AC-55, AC-56, AC-57, AC-70]
delta_ac_count: 17
source: mixed
generated_at: 2026-04-18T21:00:00Z
---

## Baseline ACs applicable to run-groups

Pulled from `_ac-baseline.md`; kept only those inside #6's ownership per `destructuring.md` § 5.

- **AC-13** (baseline) — User can create a new RunGroup via the Runs page → arrow next to Manual Run → "New group".
- **AC-14** (baseline) — The New Group dialog requires a Name and Merge Strategy; Group Type and Description are optional.
- **AC-51** (baseline) — A Run can be created inside an existing RunGroup; the RunGroup field is pre-populated but editable.
- **AC-52** (baseline) — User can move an existing Run into a RunGroup via the run's extra menu → "Move" → select destination → "Move".
- **AC-53** (baseline) — User can add existing runs to a RunGroup via the RunGroup's extra menu → "Add Existing Run".
- **AC-54** (baseline) — Opening a RunGroup shows a basic view with a chart, per-run summary, and Combined Report option.
- **AC-55** (baseline) — User can customize the Runs list view (columns, widths) per RunGroup; widths auto-save.
- **AC-56** (baseline) — Archiving a RunGroup archives all nested runs; unarchiving restores them all.
- **AC-57** (baseline) — Purging a RunGroup moves all nested Runs to Archive with a Purged badge; limit 20 000 runs per purge.
- **AC-70** (baseline) — User can Pin a Run or RunGroup; pinned items appear at the top of the list. (Group-pin slice only — run-pin lives in #7.)

### Cross-cutting concern C (RunGroup membership) — owner

#6 is the OWNER of concern C. The "must-test scenarios" obligation from C applies to #7 (Groups filter / Move to group) and #9 (archive/purge cascade), NOT to #6. This suite does not need to duplicate those scenarios — they belong to the downstream sub-features.

### Explicitly excluded (per A2 "Does NOT own")

- Run-level archive / purge outside of a group — owned by #9.
- Runs list "Groups" filter tab / column behaviour on the Runs list — owned by #7.
- AC-9 "Require RunGroup for new runs" validation — creation-form validation lives in #1.
- Per-run lifecycle (Launch / Continue / Finish / Relaunch) inside a group — owned by #6 run-lifecycle; we only verify that a launched run lands inside the correct group.

---

## Delta ACs (sub-feature-specific)

Derived from A2 Owns + Key elements list and from areas the baseline only describes in aggregate. Each will be confirmed or adjusted after 2.2 UI exploration.

### New Group dialog

- **ac-delta-1** — The "New Group" dialog is opened via the arrow / split-button next to the primary "Manual Run" CTA on the Runs page (same entry as AC-13), and the dialog presents fields in this order: Group Type (optional), Name (required), Merge Strategy (required), Description (optional), primary "Save" action, and a Cancel / dismiss affordance.
- **ac-delta-2** — "Group Type" is a selector (dropdown or chips) with at least the default / empty option plus one or more predefined types; user can create a group without picking a type.
- **ac-delta-3** — "Merge Strategy" is a selector listing multiple strategies (the exact list is observed in 2.2; typical set includes "Merge all" / "Best of all" / "Fresh run" / "Last run" semantics). A strategy MUST be chosen before Save becomes active.
- **ac-delta-4** — Attempting to save the New Group dialog with an empty "Name" is blocked: the primary action either stays disabled or the field gets an inline validation error, and the group is not created.
- **ac-delta-5** — Successfully saving the New Group dialog closes the dialog and surfaces the new group in the Runs list under the "Groups" tab scope OR in the top-level tree, visible without a page refresh.

### RunGroup page (basic view)

- **ac-delta-6** — The RunGroup page (opened by clicking the group row/link) displays, at minimum: a group header with Name + meta (type / strategy), a chart / summary visual, a per-run list, a "Combined Report" action (button or link), and an "Add Manual Run" entry point scoped to this group.
- **ac-delta-7** — Clicking "Add Manual Run" inside a RunGroup opens the New Manual Run dialog with the RunGroup field pre-populated to the current group (satisfies AC-51 in a group-context path) and editable to another group or cleared.
- **ac-delta-8** — The per-run summary inside a RunGroup surfaces each child run's title, status, and aggregate counters (Passed / Failed / Skipped / Pending or equivalent) so the user can gauge group progress at a glance.
- **ac-delta-9** — Column customisation on the RunGroup page (AC-55) persists independently of the global Runs list customisation: changing widths in a group does not affect the global Runs list, and vice versa.

### Combined Report

- **ac-delta-10** — The "Combined Report" view opens from the RunGroup page and exposes (a) a main run anchor selector, (b) a "Compare To" selector or toggle that picks one or more peer runs to diff against the anchor, (c) status / type / assignee filters over the combined set, and (d) aggregated totals (counts / percentages) across the selected runs.
- **ac-delta-11** — Changing the main run anchor in the Combined Report re-bases the comparison without leaving the view; totals and diff indicators refresh.

### Extra menu actions on a RunGroup

- **ac-delta-12** — A RunGroup's extra ("…") menu, from either the Runs list or the RunGroup page header, exposes at least: Copy, Pin / Unpin, Edit, Add Existing Run, Archive, Purge. Items gated by state (e.g. Unarchive shown only for already-archived groups) appear conditionally.
- **ac-delta-13** — The "Edit" action on a RunGroup re-opens the group editor pre-populated with current Name / Type / Merge Strategy / Description; Save commits changes to the existing group without creating a new one; Cancel discards.
- **ac-delta-14** — "Add Existing Run" (AC-53) opens a picker listing runs eligible to be moved into the group (excludes runs already in the group), supports multi-select, and returns to the group view with newly added runs present after confirming.
- **ac-delta-15** — The "Copy Group" dialog exposes toggles / checkboxes for the copy scope: Assignees, Issues, Labels, Environments, and Nested Structure (child runs); Copy creates a new RunGroup with the selected slices duplicated while leaving the source group untouched.
- **ac-delta-16** — Pinning a RunGroup (AC-70 in group context) moves it to a "pinned" region at the top of the Runs list (and/or the Groups tab), and a matching "Unpin" affordance replaces "Pin" for already-pinned groups.

### Archive / Unarchive / Purge cascade

- **ac-delta-17** — Archiving a RunGroup (AC-56) presents a confirmation dialog before commit; on confirm the group + all nested runs move to the Groups / Runs Archive, nested runs carry an "Archived" badge, and the group disappears from the active Runs list. Unarchive (from the Groups Archive extra menu) restores the group and all nested runs to the active state, preserving their prior statuses.

### Observed after 2.2 UI exploration

_(to be populated in 2.2 after ui-explorer runs)_

### Remaining UNCLEAR

- **ac-delta-U1** — UNCLEAR — whether the 20 000-run purge limit (AC-57) is surfaced to the user as a pre-check banner / disabled button or is enforced silently server-side; cannot be exercised manually at that scale without seeded data. To be flagged in 2.4 scope as @unclear / @not-manually-testable.
- **ac-delta-U2** — UNCLEAR — whether "Compare To" in Combined Report supports peer runs from OTHER groups or only within the current group.

---

## Sources

- `_ac-baseline.md` (AC-13, AC-14, AC-51–AC-57, AC-70)
- A2 `destructuring.md` § 5 run-groups (Owns / Does NOT own / Key elements)
- A2 cross-cutting concern C (RunGroup membership) — #6 is owner
- Feature docs (see baseline frontmatter) — primarily `rungroups.md`, `managing-runs.md`, `archive-runs-and-groups.md`, `merge-strategies.md`
