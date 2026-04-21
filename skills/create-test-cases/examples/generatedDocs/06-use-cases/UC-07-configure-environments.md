# UC-07: Configure environments for a Run — QA Creator

<!-- use-case
id: UC-07
primary-actor: QA Creator
status: draft
last-reviewed: 2026-04-21
-->

**Primary actor:** QA Creator
**Stakeholders:** Tester (executes per-env child runs); Project (supplies the Settings → Environments seed list, AC-44, out of scope here); Runs list / Report readers (consume per-env badges and grouping).
**Goal:** Attach one or more [environment groups](../03-glossary.md#environment-group) to a new Run so that execution is scoped to the chosen environment slice — a single run against one set, a [Launch in Sequence](../03-glossary.md#launch-in-sequence) batch that runs groups one-after-another, or a [Launch All](../03-glossary.md#launch-all) batch that runs groups in parallel.
**Trigger:** Actor clicks **+** in the Environment section of the New Manual Run sidebar ([UC-01](./UC-01-create-manual-run.md) main step 4), opens the **Multi-Environment Configuration** modal, and saves ≥ 1 env group before Launch.
**Scope:** `environment-configuration` (owner of cross-cutting concern A). Touches `run-creation` (field presence, entry point — [UC-01](./UC-01-create-manual-run.md)), `run-lifecycle` (each group spawns its own lifecycle — [UC-04](./UC-04-finish-run.md)), `runs-list-management` (per-env badges and parent/child grouping render in the list — [UC-10](./UC-10-manage-runs-list.md)), `run-detail-and-report` (per-env breakdown in the Report — [UC-11](./UC-11-view-run-report.md)).

## Preconditions

- Actor is in the New Manual Run sidebar (or the Mixed Run equivalent — [UC-02](./UC-02-create-mixed-run.md)).
- Project Settings → Environments seed list contains ≥ 1 environment (AC-44, out of scope here — tracked by project setup).
- Recommended format for environment values: `Category:Value` (e.g., `Browser:Chrome`) — enables category grouping in the modal dropdown (ac-delta-4 — **UNCLEAR** when seed data does not use the format, [13-open-questions.md § OQ-10](../13-open-questions.md#oq-10)).

## Main success scenario — single-group Run

1. Actor opens the Environment section of the New Manual Run sidebar — the primary selector is visible next to a **+** affordance (AC-45, `environment-configuration-ac-delta.md` ac-delta-1).
2. Actor clicks **+** — System opens the **Multi-Environment Configuration** modal (overlay).
3. Actor selects one or more environments inside the current (first) group from the dropdown (AC-46).
4. Actor clicks **Save** — System commits the selection and returns the Actor to the creation sidebar (ac-delta-5).
5. The Environment field now displays the selected env(s); the creation sidebar's primary launch button remains **Launch** (single-group case — ac-delta-6).
6. Actor proceeds with Launch per [UC-01 main step 6](./UC-01-create-manual-run.md#main-success-scenario-happy-path--all-tests-scope) — System creates a single Run scoped to the chosen environment.

## Alternate flows

### A1: Multi-group — **Launch in Sequence**
1. Inside the modal, Actor clicks **Add Environment** (AC-47) to append a second (and further) env group.
2. Each group supports multi-select; `All` master checkbox toggles every option in the group (ac-delta-13); **Add all envs** footer shortcut populates every checkbox of the currently expanded group (ac-delta-14).
3. Actor saves.
4. With **2+ groups** saved, the creation sidebar replaces **Launch** with two side-by-side buttons: **Launch in Sequence** and **Launch All** (ac-delta-7).
5. Actor clicks **Launch in Sequence** (AC-49) — System creates a parent [RunGroup](../03-glossary.md#rungroup) + one child Run per env group; child Runs execute one-after-another — only one is active at a time (ac-delta-9).

### A2: Multi-group — **Launch All** (parallel)
1. Same setup as A1.
2. Actor clicks **Launch All** (AC-50) — System creates a parent RunGroup + one child Run per env group; every child Run starts simultaneously and appears immediately in the Runs list as **In-Progress** (ac-delta-10).

### A3: Edit an already-saved env selection
1. The Environment field shows `N environments configured` when 2+ groups are saved.
2. Actor clicks the field — System re-opens the Multi-Environment Configuration modal with the existing selection preserved for round-trip edit (ac-delta-15).
3. Actor amends / removes groups (ac-delta-2, ac-delta-3) and saves.

### A4: Remove an env group
1. Inside the modal, Actor clicks the delete / remove affordance on a group (ac-delta-3).
2. System removes the group; remaining groups renumber; if only one group remains, the launch button reverts to **Launch** (ac-delta-6).

### A5: Category-prefixed grouping in the dropdown
1. Project's env seed uses the recommended `Category:Value` format (AC-44).
2. Inside the modal, the dropdown groups/prefixes entries by category — e.g., `Browser:Chrome`, `Browser:Firefox`, `OS:Windows` are rendered under collapsible *Browser* / *OS* sections (ac-delta-4).
3. **UNCLEAR** when seed data does not follow the `Category:Value` pattern — see [13-open-questions.md § OQ-10](../13-open-questions.md#oq-10).

### A6: AC-48 "One Run" mode (single-run multi-env)
1. AC-48 describes a "One Run" mode where all selected groups apply to a single Run with results grouped by environment.
2. **UNCLEAR** in the current UI — not observable as a distinct launch action (ac-delta-8). The mode may have been subsumed by single-group Launch, removed, or hidden behind a project setting. Tracked in [13-open-questions.md § OQ-07](../13-open-questions.md#oq-07).

## Exception flows

### E1: Save with a zero-environment group
1. Actor saves a group with no environments selected.
2. System silently accepts the empty group; no validation error surfaces (ac-delta-12).
3. Downstream consequence: at Launch, the empty group still produces a child Run scoped to the seed default — exact behaviour **UNCLEAR** ([13-open-questions.md § OQ-10](../13-open-questions.md#oq-10)).

### E2: **Launch All** with *Without tests* scope
1. Actor selects the *Without tests* scope in [UC-01 A3](./UC-01-create-manual-run.md#a3-without-tests-scope) and configures 2+ env groups.
2. Actor clicks **Launch All** — System blocks with a non-modal banner: *"Select a plan or select all"* (ac-delta-12 note).
3. This is **scope validation**, not environment-group validation — empty env groups are silently accepted per E1.

### E3: Dismiss the modal without saving
1. Actor clicks **Cancel** or the × close — System discards any draft group changes and returns to the creation sidebar with the prior env state intact (ac-delta-5).

## Postconditions

- **Success (single group):** Run is created scoped to one env set. The Runs list row displays the env value as a badge (ac-delta-11, rendering owned by [UC-10](./UC-10-manage-runs-list.md)).
- **Success (multi-group — Launch in Sequence / Launch All):** A parent [RunGroup](../03-glossary.md#rungroup) contains one child Run per env group. Child Runs display env badges; their lifecycles are independent (each Finishes on its own — see [UC-04 A3](./UC-04-finish-run.md#a3-multi-environment-run--finish-one-env-group-at-a-time)).
- **Failure:** No Run is created; the creation sidebar stays open with the env configuration preserved.

## Business rules referenced

- No new business rules surface from this UC beyond those inherited from the creation flow ([BR-1](../07-business-rules.md#br-1) Require-RunGroup continues to apply). A candidate invariant — *"an env group saved with zero environments must not block launch"* — is documented here as observed behaviour (ac-delta-12) and not yet promoted to a BR pending [OQ-10](../13-open-questions.md#oq-10) resolution.

## Functional requirements covered

- AC-45, AC-46, AC-47, AC-48 (tracked as UNCLEAR — ac-delta-8), AC-49, AC-50.
- `environment-configuration-ac-delta.md` ac-delta-1..15.

## Related use cases

- **[UC-01](./UC-01-create-manual-run.md)** / **[UC-02](./UC-02-create-mixed-run.md)** — expose the entry point.
- **[UC-04](./UC-04-finish-run.md)** — per-group Finish semantics (A3).
- **[UC-10](./UC-10-manage-runs-list.md)** — per-env badge rendering + RunGroup-as-parent rendering.
- **[UC-11](./UC-11-view-run-report.md)** — per-env breakdown + filter on the Report (concern A).

## Verifying tests

<!-- auto-generated by traceability script — do not edit by hand -->
<!-- trace-uc: UC-07 -->
<!-- sources: AC-45, AC-46, AC-47, AC-48, AC-49, AC-50, environment-configuration/ac-delta-1, environment-configuration/ac-delta-2, environment-configuration/ac-delta-3, environment-configuration/ac-delta-4, environment-configuration/ac-delta-5, environment-configuration/ac-delta-6, environment-configuration/ac-delta-7, environment-configuration/ac-delta-8, environment-configuration/ac-delta-9, environment-configuration/ac-delta-10, environment-configuration/ac-delta-11, environment-configuration/ac-delta-12, environment-configuration/ac-delta-13, environment-configuration/ac-delta-14, environment-configuration/ac-delta-15 -->
<!-- sub-feature: environment-configuration -->

_26 test(s) match the cited sources._

| # | Priority | Sub-feature | Test | Sources matched |
|---|---|---|---|---|
| 1 | normal | environment-configuration | [`Add all envs` footer link populates the currently expanded group](../../../../test-cases/manual-tests-execution/environment-configuration/group-management.md) | environment-configuration/ac-delta-14 |
| 2 | normal | environment-configuration | [`All` master checkbox toggles every environment in the current group](../../../../test-cases/manual-tests-execution/environment-configuration/group-management.md) | environment-configuration/ac-delta-13 |
| 3 | normal | environment-configuration | [`Cancel` after adding a new env group discards the pending group @negative](../../../../test-cases/manual-tests-execution/environment-configuration/group-management.md) | AC-47, environment-configuration/ac-delta-5 |
| 4 | normal | environment-configuration | [`Cancel` after removing a group via minus restores the removed group @negative](../../../../test-cases/manual-tests-execution/environment-configuration/group-management.md) | environment-configuration/ac-delta-3, environment-configuration/ac-delta-5 |
| 5 | high | environment-configuration | [Add a second env group via `Add Environment` @smoke](../../../../test-cases/manual-tests-execution/environment-configuration/group-management.md) | AC-47, environment-configuration/ac-delta-7 |
| 6 | normal | environment-configuration | [Edit an existing group's env selection via round-trip of the modal](../../../../test-cases/manual-tests-execution/environment-configuration/group-management.md) | environment-configuration/ac-delta-2, environment-configuration/ac-delta-15 |
| 7 | normal | environment-configuration | [Remove one env group via the per-group minus button](../../../../test-cases/manual-tests-execution/environment-configuration/group-management.md) | environment-configuration/ac-delta-3 |
| 8 | normal | environment-configuration | [Select multiple environments in a single group and commit them](../../../../test-cases/manual-tests-execution/environment-configuration/group-management.md) | AC-45, AC-46 |
| 9 | critical | environment-configuration | [Launch All creates a RunGroup with parallel env-labeled child runs @smoke](../../../../test-cases/manual-tests-execution/environment-configuration/launch-variants.md) | AC-50, environment-configuration/ac-delta-10, environment-configuration/ac-delta-11 |
| 10 | critical | environment-configuration | [Launch in Sequence creates a RunGroup with sequential env-labeled child runs @smoke](../../../../test-cases/manual-tests-execution/environment-configuration/launch-variants.md) | AC-49, environment-configuration/ac-delta-9, environment-configuration/ac-delta-11 |
| 11 | normal | environment-configuration | [Single env group configuration keeps a single `Launch` button @boundary](../../../../test-cases/manual-tests-execution/environment-configuration/launch-variants.md) | environment-configuration/ac-delta-6 |
| 12 | normal | environment-configuration | [Two env groups replace `Launch` with `Launch in Sequence` and `Launch All` @boundary](../../../../test-cases/manual-tests-execution/environment-configuration/launch-variants.md) | environment-configuration/ac-delta-7 |
| 13 | normal | environment-configuration | [Close modal via `×` after editing a saved selection discards the edits @negative](../../../../test-cases/manual-tests-execution/environment-configuration/modal-lifecycle.md) | environment-configuration/ac-delta-5, environment-configuration/ac-delta-15 |
| 14 | high | environment-configuration | [Dismiss Multi-Environment Configuration modal via ${dismiss_method} discards pending changes @negative](../../../../test-cases/manual-tests-execution/environment-configuration/modal-lifecycle.md) | environment-configuration/ac-delta-5 |
| 15 | high | environment-configuration | [Open Multi-Environment Configuration modal from the sidebar @smoke](../../../../test-cases/manual-tests-execution/environment-configuration/modal-lifecycle.md) | AC-45, environment-configuration/ac-delta-1 |
| 16 | high | environment-configuration | [Re-open modal via the `N environments configured` button preserves the existing selection](../../../../test-cases/manual-tests-execution/environment-configuration/modal-lifecycle.md) | environment-configuration/ac-delta-15 |
| 17 | high | environment-configuration | [Save one-group env selection commits it to the sidebar @smoke](../../../../test-cases/manual-tests-execution/environment-configuration/modal-lifecycle.md) | AC-45, AC-46, environment-configuration/ac-delta-5 |
| 18 | low | environment-configuration | [`Category:Value` grouping of environments in the checklist @needs-project-setting](../../../../test-cases/manual-tests-execution/environment-configuration/validation-and-edge.md) | environment-configuration/ac-delta-4 |
| 19 | low | environment-configuration | [`One Run` single-run multi-environment mode — documented gap @unclear](../../../../test-cases/manual-tests-execution/environment-configuration/validation-and-edge.md) | AC-48, environment-configuration/ac-delta-8 |
| 20 | normal | environment-configuration | [Clicking `Launch All` with `Without tests` scope surfaces the validation banner and blocks run creation @negative](../../../../test-cases/manual-tests-execution/environment-configuration/validation-and-edge.md) | environment-configuration/ac-delta-12 |
| 21 | normal | environment-configuration | [Remove the last remaining env group clears selection and reverts to the single-`Launch` state @boundary](../../../../test-cases/manual-tests-execution/environment-configuration/validation-and-edge.md) | environment-configuration/ac-delta-3, environment-configuration/ac-delta-6 |
| 22 | normal | environment-configuration | [Save modal with an empty env group is silently accepted @boundary](../../../../test-cases/manual-tests-execution/environment-configuration/validation-and-edge.md) | environment-configuration/ac-delta-12 |
| 23 | normal | run-creation | [Adding and removing an environment slot leaves only the initial slot @boundary](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | AC-45, AC-47 |
| 24 | high | run-creation | [Create a run with two environment groups configured at creation time](../../../../test-cases/manual-tests-execution/run-creation/cross-cutting.md) | AC-45 |
| 25 | normal | run-creation | [Cancelling the Environment modal preserves the sidebar state without assigning env @negative](../../../../test-cases/manual-tests-execution/run-creation/launch-and-save.md) | AC-45 |
| 26 | high | run-lifecycle | [Finish on a multi-environment run terminates the expected scope and leaves other environment runs intact](../../../../test-cases/manual-tests-execution/run-lifecycle/cross-cutting.md) | AC-48, AC-49, AC-50 |
<!-- end-trace -->
