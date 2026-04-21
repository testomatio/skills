# UC-02: Create a Mixed Run — QA Creator

<!-- use-case
id: UC-02
primary-actor: QA Creator
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** QA Creator
**Stakeholders:** Tester (executes the manual portion); CI orchestrator (executes the automated portion via a [CI Profile](../03-glossary.md#ci-profile) or via the local CLI); Project (consumes CI Profile configuration).
**Goal:** Launch a [Mixed Run](../03-glossary.md#mixed-run) that contains both manual and automated tests, routing automated execution to CI (or to a local `@testomatio/reporter` CLI invocation) while manual tests are available for human execution in the Manual Runner.
**Trigger:** QA Creator opens the arrow-dropdown next to the **Manual Run** split-button on the Runs page and chooses **Mixed Run** (AC-15, `run-creation-ac-delta.md` ac-delta-1).
**Scope:** `run-creation` (owner of entry-points and dropdown presence). Touches `run-lifecycle` (Mixed Run is a lifecycle variant; Relaunch-on-CI variants in UC-05 assume a Mixed-Run execution source). CI Profile internals are out of scope.

## Preconditions

- Actor has Create-Run permission (see [02-actors-and-permissions.md](../02-actors-and-permissions.md)).
- Target project contains at least one automated test registered with a code identifier.
- **Either** a CI Profile is configured in the project (for the on-CI path), **or** the actor has the `@testomatio/reporter` CLI installed locally with credentials (for the off-CI path).

## Main success scenario — Mixed Run on CI

1. QA Creator navigates to the Runs page.
2. QA Creator clicks the chevron (right part) of the **Manual Run** split-button.
3. System opens the arrow dropdown containing the items: *New group*, *Mixed Run*, *Report Automated Tests*, *Launch from CLI* (AC-13, AC-15, AC-17, AC-18, ac-delta-1). The creation sidebar does **not** open (ac-delta-1).
4. QA Creator clicks **Mixed Run**.
5. System opens the Mixed Run configuration surface (reuses the New Manual Run sidebar with a *Mixed* context indicator) and exposes a CI-source choice:
   - **Run on CI** — select a configured [CI Profile](../03-glossary.md#ci-profile).
   - **Run without CI (local CLI)** — display the CLI invocation to run locally with `@testomatio/reporter`.
     (AC-16)
6. QA Creator picks **Run on CI** and selects a CI Profile.
7. QA Creator confirms the Run's Title / RunGroup / Environment / Description / scope using the same fields documented in [UC-01](./UC-01-create-manual-run.md) (AC-7).
8. QA Creator clicks **Launch**.
9. System creates the Mixed Run, triggers the selected CI Profile for the automated portion, and opens the Manual Runner for the manual portion. The Run appears in the Runs list under the *Mixed* filter tab (AC-68).

## Alternate flows

### A1: Mixed Run without CI (local CLI)
**Branches at step 6.**
1. QA Creator picks **Run without CI (local CLI)** (AC-16).
2. System surfaces a copyable CLI command referencing the `@testomatio/reporter` package.
3. QA Creator runs the command locally; the reporter pushes automated results to the newly created Run.
4. Manual tests remain executable in the Manual Runner as in the main flow.

### A2: Report Automated Tests (push-only, no orchestration)
**Replaces step 4.**
1. QA Creator clicks **Report Automated Tests** in the arrow dropdown instead of **Mixed Run** (AC-17).
2. System surfaces the CLI flow for pushing automated results to an existing or newly created Run — no manual portion is launched.
3. Flow ends at push. Strictly, this is not a *Mixed* Run — retained here because it shares the same entry point and CLI surface.

### A3: Launch from CLI
**Replaces step 4.**
1. QA Creator clicks **Launch from CLI** in the arrow dropdown (AC-18).
2. System surfaces the CLI helper to launch a Run entirely from the command line.
3. Flow ends at helper display — creation happens off-UI.

### A4: RunGroup pre-populated / Require-RunGroup validation
Identical to [UC-01 A5](./UC-01-create-manual-run.md#a5-rungroup-pre-populated-from-context) and [UC-01 E1](./UC-01-create-manual-run.md#e1-require-rungroup-validation-blocks-launch). Mixed Run is subject to the same [Require RunGroup](../03-glossary.md#require-rungroup) gating ([**BR-1**](../07-business-rules.md#br-1)).

## Exception flows

### E1: No CI Profile configured
1. QA Creator opens the Mixed Run form.
2. System shows the CI-source choice with the CI Profile picker empty or disabled, and surfaces guidance to configure a profile (or to use the local CLI path).
3. QA Creator either sets up a CI Profile (out of scope for this flow) or switches to the local-CLI path (A1).

> **Note:** exact UI copy for this state is unverified in the POC window — see [13-open-questions.md § OQ-02](../13-open-questions.md#oq-02). Tracked by the feature-review HIGH item ([ref § 7 #4](../../../test-cases/manual-tests-execution/_feature-review.md)).

### E2: CI trigger fails at Launch
1. System creates the Run record but the CI Profile call fails.
2. Behaviour is unverified in the POC window — see [13-open-questions.md § OQ-02](../13-open-questions.md#oq-02).

### E3: Require-RunGroup violation
See [UC-01 E1](./UC-01-create-manual-run.md#e1-require-rungroup-validation-blocks-launch) — applies identically.

## Postconditions

- **Success:** A Mixed Run exists, visible under the Runs list *Mixed* filter (AC-68). Automated tests are queued on CI (or awaiting local CLI push); manual tests are executable in the Manual Runner. Mixed Run participates in the standard Run lifecycle — Finish, Archive, Purge, Relaunch variants apply, including the CI-aware Relaunch forms (AC-59, AC-60).
- **Failure:** No Mixed Run is created, or a Run exists but its automated leg failed to trigger (see E2 caveat).

## Business rules referenced

- [**BR-1**](../07-business-rules.md#br-1) — Require-RunGroup gating (shared with UC-01).
- [**BR-3**](../07-business-rules.md#br-3) — A Mixed Run requires either a configured CI Profile (on-CI path) or a local `@testomatio/reporter` CLI invocation (off-CI path).

## Functional requirements covered

- AC-13 (dropdown item presence — *New group*, touched as sibling), AC-15 (Mixed Run item), AC-16 (CI vs local CLI), AC-17 (Report Automated Tests item), AC-18 (Launch from CLI item).
- `run-creation-ac-delta.md` ac-delta-1 (split-button chevron behaviour).

## Related use cases

- **[UC-01](./UC-01-create-manual-run.md)** — the purely-manual sibling reached from the same split-button (left part).
- **[UC-05](./UC-05-relaunch-run.md)** *(Phase 2)* — owns Relaunch-on-CI variants that assume a Mixed or Automated Run source (AC-59, AC-60).
- **[UC-08](./UC-08-manage-rungroup.md)** *(Phase 2)* — the *New group* item in the same dropdown.

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-02 -->
<!-- sources: AC-13, AC-15, AC-16, AC-17, AC-18, AC-68, run-creation/ac-delta-1 -->
<!-- sub-feature: run-creation -->

_11 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | normal | run-creation | [Arrow-dropdown closes on outside click without selecting any item @negative](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | AC-13, run-creation/ac-delta-1 |
| 2 | normal | run-creation | [Arrow-dropdown item ${menu_item} opens ${target} without opening the creation sidebar](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | AC-13, AC-15, AC-17, AC-18, run-creation/ac-delta-1 |
| 3 | high | run-creation | [Clicking the Manual Run split-button left part navigates to the creation URL](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | run-creation/ac-delta-1 |
| 4 | critical | run-creation | [Open New Manual Run sidebar and verify form chrome renders @smoke](../../../../test-cases/manual-tests-execution/run-creation/dialog-lifecycle.md) | run-creation/ac-delta-1 |
| 5 | high | run-groups | [Create a new RunGroup via the New group dialog @smoke](../../../../test-cases/manual-tests-execution/run-groups/group-lifecycle.md) | AC-13 |
| 6 | normal | run-groups | [Dismissing the New RunGroup panel via ${dismiss_method} does not create a group @negative](../../../../test-cases/manual-tests-execution/run-groups/group-lifecycle.md) | AC-13 |
| 7 | normal | runs-list-management | [Multi-environment runs render with environment indicators in the Runs list](../../../../test-cases/manual-tests-execution/runs-list-management/cross-cutting.md) | AC-68 |
| 8 | high | runs-list-management | [RunGroup in the Groups tab expands in place to reveal child runs @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/cross-cutting.md) | AC-68 |
| 9 | critical | runs-list-management | [Switch to the ${tab} filter tab scopes the list to matching runs @smoke](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-68 |
| 10 | low | runs-list-management | [Switching to the Groups tab in a project with no RunGroups shows an empty state @negative](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-68 |
| 11 | normal | runs-list-management | [Switching to the Unfinished tab in a project with no unfinished runs shows an empty state @negative](../../../../test-cases/manual-tests-execution/runs-list-management/filter-tabs-and-view.md) | AC-68 |
<!-- end-trace -->
