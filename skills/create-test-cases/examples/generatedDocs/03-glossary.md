---
audience: qa-team, dev-team
feature: manual-tests-execution
last-reviewed: 2026-04-21
owner: "@gololdf1sh"
---

# 03 — Glossary

Domain vocabulary for Manual Tests Execution. Each term links to the AC section in `_ac-baseline.md` that first introduces it (or to the sub-feature AC-delta that owns the detail). Sub-feature names follow [destructuring.md](../../../test-cases/manual-tests-execution/destructuring.md).

Anchor convention: slug of the H2/H3 — use `[Term](./03-glossary.md#term)` in other docs.

---

## Run
<a id="run"></a>

A single execution pass of a set of tests against a product build. Has a creator (AC-37), an optional RunGroup membership (AC-51..53), zero-or-more environments (AC-45..47), and a lifecycle Pending → In-Progress → Finished / Terminated → Archived → Purged (AC-23..28, AC-75..81). See [05-state-diagrams.md](./05-state-diagrams.md).

**Introduced by:** [AC-1, AC-23](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-creation--new-manual-run-dialog)

---

## RunGroup
<a id="rungroup"></a>

A container that collects one or more Runs and reports on them jointly. Created from Runs page → arrow next to Manual Run → "New group" (AC-13). Required Name + Merge Strategy; Group Type and Description optional (AC-14). Opens a view with chart, per-run summary, and a Combined Report option (AC-54). Archive/Purge cascades to all nested runs (AC-56..57).

**Introduced by:** [AC-13](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-creation--additional-variants-header-extras-menu)

---

## Test (in a Run)
<a id="test"></a>

A row inside a Run representing a single test case to be executed. Has a status (PASSED / FAILED / SKIPPED / Pending + optional Custom Status), optional Result message, attachments, assignee, and step-by-step markings. See [05-state-diagrams.md § Test-in-Run](./05-state-diagrams.md#test-in-run).

**Introduced by:** [AC-29..36](../../../test-cases/manual-tests-execution/_ac-baseline.md#test-result-entry-passed--failed--skipped)

---

## Tester
<a id="tester"></a>

A user assigned to a Run (and/or to specific suites/tests within it) for the purpose of recording results. A tester is always a project user first; being a "Tester on Run X" is a per-run assignment, not a project role. See [02-actors-and-permissions.md](./02-actors-and-permissions.md).

**Introduced by:** [AC-37..43](../../../test-cases/manual-tests-execution/_ac-baseline.md#tester-assignment)

---

## Environment
<a id="environment"></a>

A context attribute applied to a Run — typically a `{category}:{value}` pair like `Browser:Chrome` or `OS:Windows` (AC-44). Configured at Settings → Environments (out of scope for these docs) and *selected* at Run creation via "+" in the environment section (AC-45). A Run may carry one or more environment **groups**; see [Environment group](#environment-group).

**Introduced by:** [AC-44](../../../test-cases/manual-tests-execution/_ac-baseline.md#environments)

---

## Environment group
<a id="environment-group"></a>

A multi-select bundle of environments applied to a Run as one unit. A single Run can have multiple environment groups (AC-47); behaviour across groups is controlled by the run-mode selector — [One Run](#one-run-mode) / [Launch in Sequence](#launch-in-sequence) / [Launch All](#launch-all) (AC-48..50).

**Introduced by:** [AC-45..47](../../../test-cases/manual-tests-execution/_ac-baseline.md#environments)

---

## One Run (mode)
<a id="one-run-mode"></a>

Multi-environment mode where all selected environment groups apply to a **single** Run; results are grouped by environment in reports (AC-48).

**Introduced by:** [AC-48](../../../test-cases/manual-tests-execution/_ac-baseline.md#environments)

---

## Launch in Sequence
<a id="launch-in-sequence"></a>

Multi-environment mode where each environment group runs **sequentially as a separate Run**; all child Runs are collected under one parent (AC-49).

**Introduced by:** [AC-49](../../../test-cases/manual-tests-execution/_ac-baseline.md#environments)

---

## Launch All
<a id="launch-all"></a>

Multi-environment mode where each environment group starts **simultaneously as a separate Run** (parallel) (AC-50).

**Introduced by:** [AC-50](../../../test-cases/manual-tests-execution/_ac-baseline.md#environments)

---

## Merge Strategy
<a id="merge-strategy"></a>

A RunGroup-level setting chosen when creating a new Group (AC-14). Determines how results from constituent Runs are merged in the Group's Combined Report. Required field in the New Group dialog.

**Introduced by:** [AC-14](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-creation--additional-variants-header-extras-menu)

---

## Mixed Run
<a id="mixed-run"></a>

A Run that contains both manual and automated tests. Launched from the Runs page via arrow next to Manual Run → "Mixed Run". Execution runs on CI (using a CI Profile) or without CI via local CLI (`@testomatio/reporter`).

**Introduced by:** [AC-15, AC-16](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-creation--additional-variants-header-extras-menu)

---

## CI Profile
<a id="ci-profile"></a>

A configured integration with an external CI system that Testomat.io uses to trigger automated test execution from Mixed Runs or "Relaunch on CI" actions. Internals live outside this feature; it is referenced as a precondition for Mixed Run / Report Automated / Relaunch-on-CI flows.

**Introduced by:** [AC-16, AC-59..60](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-creation--additional-variants-header-extras-menu)

---

## Run as Checklist (mode)
<a id="run-as-checklist"></a>

A toggle on the New Manual Run dialog (AC-7) that hides test descriptions inside the launched Run; any test's description can still be revealed individually via extra menu → "Toggle Description" (AC-96). Cross-cutting concern **D** — the toggle lives in run-creation but cascades into test-execution-runner behaviour.

**Introduced by:** [AC-7, AC-96](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-as-checklist--notes--auto-track--time-tracking)

---

## Auto-Track
<a id="auto-track"></a>

An in-Runner time-tracking mode that records duration on tests without manual stopwatch action. Coexists with a manual **Set Time** affordance. Precise semantics vs a separate "Fast Forward" control are unverified — tracked in [13-open-questions.md § AC-97](./13-open-questions.md) (Phase 1).

**Introduced by:** test-execution-runner scope — see [destructuring.md § #2](../../../test-cases/manual-tests-execution/destructuring.md#2-test-execution-runner)

---

## Custom Status
<a id="custom-status"></a>

A sub-status configurable per project that can be applied to a test **in addition to** a standard status (PASSED / FAILED / SKIPPED). The Custom Status dropdown in the Runner becomes available only after a standard status is chosen — it does not replace it (AC-31). Consumed by TQL `has_custom_status` (AC-72) and by report filters (AC-85). Cross-cutting concern **E**.

**Introduced by:** [AC-31](../../../test-cases/manual-tests-execution/_ac-baseline.md#test-result-entry-passed--failed--skipped)

---

## Multi-Select (mode)
<a id="multi-select"></a>

A UI mode present on two surfaces with similar affordances but divergent toolbars:

- **In the Runs list** — bulk Archive, Labels, Compare, Link, Download, Merge, Move, Purge (AC-71).
- **In the Manual Runner** — bulk Assign to (AC-43, `tester-assignment-ac-delta.md` ac-delta-9..10), bulk Result message / status (AC-93..95).

Cross-cutting concern **H**.

**Introduced by:** [AC-43, AC-71, AC-93](../../../test-cases/manual-tests-execution/_ac-baseline.md#runs-list--filter-tabs--row-actions--multi-select)

---

## Advanced Relaunch
<a id="advanced-relaunch"></a>

A Relaunch sidebar exposing: custom run title, "Create new run" toggle, "Keep values" toggle (enabled only when Create new run is ON), per-test selection, and a Relaunch action. Four behaviour quadrants result from the Create-new-run × Keep-values matrix (AC-62..65). When a filter is active, selection methods include only matching tests (cross-cutting concern **F**, AC-66).

**Introduced by:** [AC-62..66](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-lifecycle--relaunch-variants)

---

## Launch a Copy
<a id="launch-a-copy"></a>

A Relaunch variant that creates a **separate duplicate Run** — both original and copy appear in the Runs list after finishing (AC-67). Contrast with Advanced Relaunch "Create new run: ON", which is a finer-grained control over what gets copied.

**Introduced by:** [AC-67](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-lifecycle--relaunch-variants)

---

## Basic Run Report
<a id="basic-run-report"></a>

The default Report view opened by clicking a Run. Shows the tests list, standard + custom statuses, and overall summary (AC-82). Contains tabs/sections: Tests, Statistics, Defects (AC-83).

**Introduced by:** [AC-82..83](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-detail--run-report)

---

## Extended Run Report
<a id="extended-run-report"></a>

A richer Report view adding grouped overviews (suites / tags / labels / assignees / priorities), Run Report Summary, Flaky Tests Analytics (when applicable), and keyboard navigation (↑/↓) between tests (AC-86). Source of [Share Report by Email](#share-report) and [Share Report Publicly](#share-report-publicly) (AC-89..91).

**Introduced by:** [AC-86](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-detail--run-report)

---

## Share Report (by Email)
<a id="share-report"></a>

From the Extended view, sends the Report to a comma-separated email list (AC-89).

**Introduced by:** [AC-89](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-detail--run-report)

---

## Share Report Publicly
<a id="share-report-publicly"></a>

From the Extended view, generates a public URL (requires Company + Project **Sharing** enabled). Dialog exposes Expiration (default 7 days) and a "Protect by passcode" toggle (ON by default). A passcode is shown once; Stop Sharing ends the public URL (AC-90..91).

**Introduced by:** [AC-90..91](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-detail--run-report)

---

## Compare Runs
<a id="compare-runs"></a>

A multi-select Runs-list action that opens a comparison view across selected Runs (AC-92).

**Introduced by:** [AC-92](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-detail--run-report)

---

## TQL (Testomat Query Language)
<a id="tql"></a>

Filter expression language used in the Runs list Query Language Editor (AC-72). Variables include `rungroup`, `env`, `passed_count`, `finished_at`, `has_test_label`, `has_custom_status`, and others. Filter parameters can be shared via URL (AC-73). Grammar specification lives in [11-integrations.md](./11-integrations.md) at Phase 2.

**Introduced by:** [AC-72..73](../../../test-cases/manual-tests-execution/_ac-baseline.md#runs-list--filter-tabs--row-actions--multi-select)

---

## Pulse
<a id="pulse"></a>

A project activity log where permanent deletions of Runs from Archive are tracked under a "Deleted Run" entry with actor, timestamp, and entity identifier (AC-81; `archive-and-purge-ac-delta.md` ac-delta-18).

**Introduced by:** [AC-81](../../../test-cases/manual-tests-execution/_ac-baseline.md#archive--purge)

---

## Flaky Tests Analytics
<a id="flaky-tests-analytics"></a>

A section surfaced in the Extended Run Report when a Run contains tests flagged as flaky (AC-86).

**Introduced by:** [AC-86](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-detail--run-report)

---

## Purge
<a id="purge"></a>

A destructive archival: compresses a Run and moves it to Archive with a "Purged" badge; preserves test results, attachments, and custom statuses; removes stack traces (AC-78). Distinct from plain [Archive](#archive). Automatic Purge is driven by the `Purge Old Runs` retention setting (default 90 days, AC-79). Purging a RunGroup cascades to all nested Runs (AC-57); limit 20 000 Runs per Purge (AC-57, `archive-and-purge-ac-delta.md` ac-delta-19).

**Introduced by:** [AC-78](../../../test-cases/manual-tests-execution/_ac-baseline.md#archive--purge)

---

## Archive
<a id="archive"></a>

A non-destructive transition to the Runs/Groups Archive page (AC-75). The item keeps an "archived" badge and can be Unarchived (restored to active list) (AC-77; `archive-and-purge-ac-delta.md` ac-delta-13..15). Archiving a Run with Pending tests marks the Run **Terminated** and its Pending tests **Skipped** (AC-76).

**Introduced by:** [AC-75..77](../../../test-cases/manual-tests-execution/_ac-baseline.md#archive--purge)

---

## Unarchive
<a id="unarchive"></a>

The inverse of [Archive](#archive). Restores a single Run or RunGroup from the Archive back to the active list; for a RunGroup, all nested Runs are restored together (AC-56; `archive-and-purge-ac-delta.md` ac-delta-13..15).

**Introduced by:** [AC-56](../../../test-cases/manual-tests-execution/_ac-baseline.md#rungroups-as-a-container-for-runs)

---

## Retention (Purge Old Runs)
<a id="retention"></a>

Project-level numeric setting controlling automatic Purge of old Runs; default is 90 days when unset (AC-79; `archive-and-purge-ac-delta.md` ac-delta-8..9). Non-numeric and negative values are rejected.

**Introduced by:** [AC-79](../../../test-cases/manual-tests-execution/_ac-baseline.md#archive--purge)

---

## Terminated (Run state)
<a id="terminated"></a>

A terminal state distinct from *Finished*. Assigned when a Run is Archived or Purged **while in-progress**; recorded statuses are kept, Pending tests become Skipped, and the Run cannot be resumed after restore (AC-76, AC-80).

**Introduced by:** [AC-76, AC-80](../../../test-cases/manual-tests-execution/_ac-baseline.md#archive--purge)

---

## Auto-Assign Users (strategies)
<a id="auto-assign-users"></a>

Assignment-strategy selector in the New Manual Run dialog Assignee panel. Three options: **None** (default), **Prefer test assignee**, **Randomly distribute tests between team members** (AC-39; `tester-assignment-ac-delta.md` ac-delta-2..5). Randomly distribute excludes managers (AC-40, ac-delta-11).

**Introduced by:** [AC-39..40](../../../test-cases/manual-tests-execution/_ac-baseline.md#tester-assignment)

---

## Require RunGroup (project setting)
<a id="require-rungroup"></a>

A project-level toggle that, when enabled, blocks Launch from the New Manual Run dialog unless a RunGroup is selected; the RunGroup field is highlighted and a warning appears (AC-9). Precondition for the **BR-1** candidate noted in the execution plan.

**Introduced by:** [AC-9](../../../test-cases/manual-tests-execution/_ac-baseline.md#run-creation--new-manual-run-dialog)
