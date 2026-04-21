---
audience: qa-team, dev-team
feature: manual-tests-execution
last-reviewed: 2026-04-21
owner: "@gololdf1sh"
---

# 08 — Functional Requirements

Regrouping of the 100 baseline ACs and every `*-ac-delta.md` into functional requirement clusters (FR-1..FR-14). Each FR points back to the ACs it spans and the UCs that exercise it. This page is a **cluster index** — the authoritative source of individual ACs remains [_ac-baseline.md](../../../test-cases/manual-tests-execution/_ac-baseline.md) and the per-sub-feature delta files.

> **How to read.** Each FR block lists: covering ACs + AC-deltas, owning UC(s), and any relevant BR. FRs are organised by user-visible capability rather than by sub-feature (sub-features are the decomposition axis in [destructuring.md](../../../test-cases/manual-tests-execution/destructuring.md); FRs are the read-through axis for stakeholders).

---

## FR-1: Run creation (entry points, scope, form fields, Save vs Launch)

**Covers:** AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9, AC-10, AC-11, AC-12, AC-19, AC-20, AC-21, AC-22, AC-23, AC-96; `run-creation-ac-delta.md` ac-delta-1..18.
**Owner UC:** [UC-01](./06-use-cases/UC-01-create-manual-run.md).
**Business rules:** [BR-1](./07-business-rules.md#br-1), [BR-2](./07-business-rules.md#br-2), [BR-4](./07-business-rules.md#br-4).

Split-button + arrow dropdown on Runs page; New Manual Run sidebar with Title / RunGroup / Environment / Description / Scope tabs / Run-as-checklist / Run-Automated-as-Manual / Launch · Save · Cancel. Scope tabs: All tests (default) / Test plan / Select tests / Without tests — mutually exclusive ([BR-4](./07-business-rules.md#br-4)). Entry points from Tests page (Add to Run, Run Tests from suite / Multi-select). Require-RunGroup gating on Launch ([BR-1](./07-business-rules.md#br-1)). Zero-test Runs are legal ([BR-2](./07-business-rules.md#br-2)).

---

## FR-2: Mixed-Run creation and CI / CLI variants

**Covers:** AC-13, AC-15, AC-16, AC-17, AC-18, AC-68; `run-creation-ac-delta.md` ac-delta-1 (shared).
**Owner UC:** [UC-02](./06-use-cases/UC-02-create-mixed-run.md).
**Business rules:** [BR-3](./07-business-rules.md#br-3).

Arrow-dropdown items: *New group*, *Mixed Run*, *Report Automated Tests*, *Launch from CLI*. Mixed Run sidebar exposes CI-source choice — CI Profile vs local `@testomatio/reporter` CLI ([BR-3](./07-business-rules.md#br-3)). Mixed filter tab on the Runs list (AC-68).

---

## FR-3: Manual Runner — single-test execution

**Covers:** AC-29, AC-30, AC-31, AC-32, AC-33, AC-34, AC-35, AC-36, AC-96, AC-97 (UNCLEAR); `test-execution-runner-ac-delta.md` ac-delta-1..22.
**Owner UC:** [UC-03](./06-use-cases/UC-03-execute-test-in-runner.md).
**Business rules:** [BR-5](./07-business-rules.md#br-5).

Runner layout (tree / detail / header counters), standard + custom status, result message, attachments (browse + drag-drop, views, preview, delete-with-confirm), step-by-step click cadence, notes (test / suite / bulk / convert-to-test), Priority filter, Extra options toggles (Refresh structure / Creation buttons / Labels / Tags), detail-pane resize, Auto-Track / Set Time, checklist-mode description hide, per-test assignee badge. Runner is gated on In-Progress state; Finished / Terminated Runs open the Report.

---

## FR-4: Bulk status application in the runner

**Covers:** AC-29, AC-30, AC-31 (UNCLEAR for bulk), AC-66, AC-93, AC-94, AC-95; `bulk-status-actions-ac-delta.md` ac-delta-1..11.
**Owner UC:** [UC-09](./06-use-cases/UC-09-bulk-status-in-runner.md).
**Business rules:** [BR-5](./07-business-rules.md#br-5) analogue.

Multi-Select mode toggling; bottom bulk-action toolbar (Result message modal + PASSED/FAILED/SKIPPED quick-set with native confirm + Clear-Selection × + Create notes); selection-scope honours active filter (concern F). Dismiss of Result message modal clears selection (ac-delta-7).

---

## FR-5: Run lifecycle — Finish, Edit, Continue

**Covers:** AC-23, AC-24, AC-25, AC-26, AC-27, AC-28; `run-lifecycle-ac-delta.md` ac-delta-3..7, ac-delta-9, ac-delta-10.
**Owner UC:** [UC-04](./06-use-cases/UC-04-finish-run.md).
**Business rules:** [BR-7](./07-business-rules.md#br-7), [BR-8](./07-business-rules.md#br-8).

Launch → In-Progress (AC-23); Continue resumes Pending / unfinished (AC-24); Finish Run confirms Pending→Skipped and transitions to Finished (AC-25/26/28, [BR-7](./07-business-rules.md#br-7)). Edit unfinished run: Assign to / Title / Env / Description / Trash-delete test / +Tests / +Plans / Save · Cancel (AC-27, ac-delta-3..6).

---

## FR-6: Relaunch variants

**Covers:** AC-58, AC-59, AC-60, AC-61, AC-62, AC-63, AC-64, AC-65, AC-66, AC-67; `run-lifecycle-ac-delta.md` ac-delta-1, ac-delta-2, ac-delta-8, ac-delta-11..14.
**Owner UC:** [UC-05](./06-use-cases/UC-05-relaunch-run.md).
**Business rules:** [BR-3](./07-business-rules.md#br-3), [BR-8](./07-business-rules.md#br-8).

Relaunch / Launch a Copy / Advanced Relaunch / Relaunch Failed on CI / Relaunch All on CI / Relaunch Manually (+ Launch a Copy Manually delta). Advanced Relaunch matrix (Create-new-run × Keep-values). Per-test selection; filter-aware Select all (AC-66). Source Run inherits Title / assignees / env / RunGroup. Mixed Runs honour CI/UI routing (ac-delta-14).

---

## FR-7: Tester assignment (run / suite / test / bulk / Auto-Assign)

**Covers:** AC-37, AC-38, AC-39, AC-40, AC-41, AC-42, AC-43; `tester-assignment-ac-delta.md` ac-delta-1..13.
**Owner UC:** [UC-06](./06-use-cases/UC-06-assign-testers.md).
**Business rules:** [BR-6](./07-business-rules.md#br-6), [BR-6a](./07-business-rules.md#br-6a).

Creator manager chip; Assign more users panel + Auto-Assign strategies (None / Prefer test assignee / Randomly distribute — manager-excluded per [BR-6a](./07-business-rules.md#br-6a)); per-suite Assign to; Multi-Select bulk Assign to (with confirmation); per-test detail-pane reassignment (no confirmation); Edit-run Remove assign users (with confirmation when results exist). Per-suite / per-test prerequisite [BR-6](./07-business-rules.md#br-6).

---

## FR-8: Environment configuration

**Covers:** AC-45, AC-46, AC-47, AC-48 (UNCLEAR), AC-49, AC-50; `environment-configuration-ac-delta.md` ac-delta-1..15.
**Owner UC:** [UC-07](./06-use-cases/UC-07-configure-environments.md).

Multi-Environment Configuration modal; Add Environment; Save / Cancel; All / Add-all-envs shortcuts; single-group Launch vs 2+ groups Launch-in-Sequence + Launch-All; round-trip edit preserves selection. AC-48 "One Run" mode unobservable in current UI (ac-delta-8).

---

## FR-9: RunGroup management

**Covers:** AC-13, AC-14, AC-51, AC-52, AC-53, AC-54, AC-55, AC-56, AC-57, AC-70; `run-groups-ac-delta.md` ac-delta-1..17.
**Owner UC:** [UC-08](./06-use-cases/UC-08-manage-rungroup.md).
**Business rules:** [BR-1](./07-business-rules.md#br-1), [BR-9](./07-business-rules.md#br-9), [BR-10](./07-business-rules.md#br-10).

New Group dialog (Name / Merge Strategy / Group Type / Description); RunGroup page (header, chart, per-run list, Combined Report, Add Manual Run); Edit, Copy (with scope toggles), Pin / Unpin, Add Existing Run; column customisation per group; Archive / Unarchive / Purge cascade ([BR-9](./07-business-rules.md#br-9), [BR-10](./07-business-rules.md#br-10)).

---

## FR-10: Runs list — tabs, pins, Multi-Select, TQL, Custom view, URL share

**Covers:** AC-52, AC-68, AC-69, AC-70, AC-71, AC-72, AC-73, AC-74, AC-77, AC-87, AC-88, AC-92; `runs-list-management-ac-delta.md` ac-delta-1..17.
**Owner UC:** [UC-10](./06-use-cases/UC-10-manage-runs-list.md).
**Business rules:** [BR-11](./07-business-rules.md#br-11).

Filter tabs (Manual / Automated / Mixed / Unfinished / Groups); chart toggle + legend filters; run-count badge; state-aware row extra menu (Continue vs Relaunch ▾); Pin; Multi-Select bulk (Archive / Labels / Compare / Move / Merge / Download / Link / Purge); TQL editor (Apply / Save / Cancel, Saved Queries, Examples, autocomplete, Operators + Variables sidebar); URL-share; Custom view Settings (columns + widths, per-user per-project); pagination (« page »); Runs Status Report (AI) gating ≥ 5 finished; Groups tab expand; Runs / Groups Archive footer links.

---

## FR-11: Run detail and Report

**Covers:** AC-82, AC-83, AC-84, AC-85, AC-86, AC-87, AC-88, AC-89, AC-90, AC-91, AC-92, AC-98 (UNCLEAR), AC-99 (UNCLEAR); `run-detail-and-report-ac-delta.md` ac-delta-1..22.
**Owner UC:** [UC-11](./06-use-cases/UC-11-view-run-report.md).
**Business rules:** [BR-13](./07-business-rules.md#br-13).

Basic Report (header / tabs Tests · Statistics · Defects); test sub-panel (Summary / Description / Code Template / Runs); filter + sort + search + keyboard nav on Tests tab; Extended Report grouped overview (Suites / Tags / Labels / Assignees / Priorities); Flaky Tests Analytics (conditional); Statistics aggregate counts; Defects tab (UNCLEAR add/remove). Share by Email (validated), Share Publicly (Expiration default 7d + passcode default ON — [BR-13](./07-business-rules.md#br-13)); Compare side-by-side matrix; Download XLSX; Export PDF; Custom view Settings (per-user per-project); Copy Link (UNCLEAR).

---

## FR-12: Archive, Unarchive, Purge, Permanent delete, retention

**Covers:** AC-56, AC-57, AC-69 (archive/purge portion), AC-71 (archive/purge portion), AC-75, AC-76, AC-77, AC-78, AC-79, AC-80, AC-81, AC-100 (partially resolved); `archive-and-purge-ac-delta.md` ac-delta-1..20.
**Owner UC:** [UC-12](./06-use-cases/UC-12-archive-unarchive-purge.md).
**Business rules:** [BR-8](./07-business-rules.md#br-8), [BR-9](./07-business-rules.md#br-9), [BR-10](./07-business-rules.md#br-10), [BR-11](./07-business-rules.md#br-11), [BR-12](./07-business-rules.md#br-12).

Archive (finished) / Archive-ongoing → Terminated + Pending→Skipped; Purge (compress + preserve results / attachments / custom statuses / Run ID / title, drop stack traces); Bulk Archive / Bulk Purge; Unarchive (single + bulk + group cascade); Runs Archive (filter tabs + Archived/Purged/Terminated badges + Rungroup Structure toggle + retention input); Groups Archive (Search + type + Finish Range + sort); Permanent delete with irreversibility dialog + Pulse "Deleted Run" audit; Readonly gating [BR-11](./07-business-rules.md#br-11); auto-purge retention default 90 days [BR-12](./07-business-rules.md#br-12).

---

## FR-13: Permissions model

**Covers:** AC-100 (UNCLEAR across several sub-features; partially resolved for archive scope).
**Owner artefact:** [02-actors-and-permissions.md](./02-actors-and-permissions.md).
**Business rules:** [BR-11](./07-business-rules.md#br-11).

Roles: Owner, Manager, QA Creator, Tester, Readonly. Role × Action matrix in [02-actors-and-permissions.md § Role × Action matrix](./02-actors-and-permissions.md#role--action-matrix). Several cells remain UNCLEAR in POC window (Share Publicly gating, Assign permissions edge cases — [13-open-questions.md § OQ-06](./13-open-questions.md#oq-06)).

---

## FR-14: Notifications, toasts, and inline feedback

**Covers:** Transverse across UCs — Pin toast (ac-delta-6 of runs-list), Run created / started toasts (ac-delta-10 of run-creation), server error inline feedback (ac-delta-18 of run-creation), validation feedback (Name empty — ac-delta-4 of run-groups; retention — ac-delta-9 of archive-and-purge).
**Owner artefact:** Shared UI convention (no dedicated UC). Captured per-UC as inline or exception flows.

---

## Cross-reference quick-find

| Want to find... | Go to |
|---|---|
| A specific AC number | [_ac-baseline.md](../../../test-cases/manual-tests-execution/_ac-baseline.md) |
| All ACs for a sub-feature | [`test-cases/manual-tests-execution/{sub}-ac-delta.md`](../../../test-cases/manual-tests-execution/) |
| Which UC covers an AC | Traceability matrix — [_generated/traceability-matrix.md](./_generated/traceability-matrix.md) |
| Which manual tests exercise an AC | Same matrix — `AC ↔ Tests` section |
| Which BR derives from an AC | [07-business-rules.md](./07-business-rules.md) — grep by AC in *Derived from:* fields |
