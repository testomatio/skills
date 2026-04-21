---
audience: qa-team, dev-team
feature: manual-tests-execution
last-reviewed: 2026-04-21
owner: "@gololdf1sh"
---

# 07 — Business Rules

Invariants the product must preserve across Manual Tests Execution. Each rule is one-sentence-first, derivation-cited, and consumable as an edge-case generator during exploratory testing. Rules are added as they surface from UCs — Phase 1 seeded BR-1..BR-4 from UC-01 / UC-02; Phase 2 added BR-5..BR-13 (with BR-6a) as UC-03..UC-12 were drafted. Further rules will be appended as new UCs or regressions surface.

> **Adding a BR.** Append a new `## BR-NN` section using the block from [`templates/business-rule-template.md`](./templates/business-rule-template.md). Do **not** split BRs into per-file entries — they live here, in one file, for scannability.

---

## BR-1: Require-RunGroup gating on Launch
<a id="br-1"></a>

**Statement:** When the project setting *Require RunGroup for new runs* is enabled and a new Run's [RunGroup](./03-glossary.md#rungroup) field is empty, the system blocks Launch, highlights the RunGroup field, and shows a warning — no Run is created.
**Rationale:** Grouping is a reporting and organisation contract set at the project level. Allowing ungrouped Runs when the project has opted into mandatory grouping undermines downstream analytics (per-group Combined Report, TQL `rungroup` filter, archive cascade).
**Scope:** Applies to every creation entry point that launches a Run — the New Manual Run sidebar, Mixed Run, Launch from CLI (when the CLI path eventually creates a Run), and the Tests-page shortcuts ([UC-01](./06-use-cases/UC-01-create-manual-run.md), [UC-02](./06-use-cases/UC-02-create-mixed-run.md)). Save is **not** blocked by this rule — storing a Pending Run without a group is permitted (to be verified in Phase 1 UI check; tracked in [13-open-questions.md § OQ-06](./13-open-questions.md#oq-06)).
**Violations / enforcement:** Launch action is a no-op; RunGroup field receives error styling; a warning message appears inline; the sidebar stays open so the user can select a group and retry (`run-creation-ac-delta.md` ac-delta-18).
**Derived from:** [AC-9](../../test-cases/manual-tests-execution/_ac-baseline.md#run-creation--new-manual-run-dialog), `run-creation-ac-delta.md` ac-delta-18.
**Referenced by:** [UC-01](./06-use-cases/UC-01-create-manual-run.md) (E1), [UC-02](./06-use-cases/UC-02-create-mixed-run.md) (A4/E3).

---

## BR-2: A Run may be launched with zero tests
<a id="br-2"></a>

**Statement:** The *Without tests* scope legitimately produces a Run containing zero tests at Launch; such a Run exists, is In-Progress (or Pending if Saved), and can be populated later via Edit (`+ Tests` / `+ Plans`).
**Rationale:** *Without tests* is an intentional scoping mode, not an error state — it lets a team stand up a Run container while curation of its contents happens in parallel (common when the test list is being drafted or migrated).
**Scope:** Scope selector step of the creation sidebar. Applies to [UC-01](./06-use-cases/UC-01-create-manual-run.md) (A3). Does **not** apply to UC-02 Mixed Run (which, by definition, intermingles manual + automated tests; empty-test Mixed Runs are not meaningful and are out of scope in the POC window).
**Violations / enforcement:** A test-count-based validation that blocks Launch for *Without tests* would violate this rule. Editing is the supported path to add tests (AC-22, AC-27).
**Derived from:** [AC-6, AC-22, AC-27](../../test-cases/manual-tests-execution/_ac-baseline.md#test-scope--select-tests--plan--without).
**Referenced by:** [UC-01](./06-use-cases/UC-01-create-manual-run.md) (A3, postconditions), UC-04 *(Phase 2)*.

---

## BR-3: Mixed Run requires CI Profile OR local CLI
<a id="br-3"></a>

**Statement:** A [Mixed Run](./03-glossary.md#mixed-run) cannot launch automated execution without a source — either a configured [CI Profile](./03-glossary.md#ci-profile) (on-CI path) or a local invocation of `@testomatio/reporter` (off-CI path). The UI requires the user to pick exactly one.
**Rationale:** Automated test execution happens outside Testomat.io's UI surface; the Mixed Run must point at an executor, otherwise the automated portion is orphaned (a Run record exists, but no results arrive). The dichotomy is binary and deliberate — AC-16 documents both paths.
**Scope:** Mixed Run creation flow ([UC-02](./06-use-cases/UC-02-create-mixed-run.md) main flow + A1). Does not apply to UC-01 (purely manual — no automated leg). *Report Automated Tests* (AC-17) and *Launch from CLI* (AC-18) are CLI-driven variants that share the same CI-or-CLI dichotomy but are **not** UC-02's Mixed Run flow.
**Violations / enforcement:** Attempting to Launch a Mixed Run without choosing a CI source should be blocked or produce a degraded state where automated tests never execute. The exact UI enforcement mode (disabled Launch vs validation message vs silent zero-arrival) is **unverified** in the POC window — see [13-open-questions.md § OQ-02](./13-open-questions.md#oq-02).
**Derived from:** [AC-16](../../test-cases/manual-tests-execution/_ac-baseline.md#run-creation--additional-variants-header-extras-menu).
**Referenced by:** [UC-02](./06-use-cases/UC-02-create-mixed-run.md) (main flow, E1, E2).

---

## BR-4: Creation scope tabs are mutually exclusive
<a id="br-4"></a>

**Statement:** In the New Manual Run sidebar, the four scope tabs — *All tests* / *Test plan* / *Select tests* / *Without tests* — behave as a single-select radio group. Switching tabs discards any selection made in the previously active tab; no cross-tab retention exists.
**Rationale:** The four scopes produce structurally different Run contents (everything / plan-union / hand-picked / empty); mixing them would be ambiguous. Retaining selection across tab switches would create hidden state the user cannot see in the active tab, producing surprising Launch outcomes.
**Scope:** The scope-selector row in the creation sidebar ([UC-01](./06-use-cases/UC-01-create-manual-run.md) main + A1..A3). Applies to UC-02's creation surface by inheritance.
**Violations / enforcement:** Clicking a different tab clears the prior tab's state synchronously — e.g., a plan selected under *Test plan* vanishes the moment *Select tests* becomes active; the test tree checkboxes are disabled outside *Select tests* (`run-creation-ac-delta.md` ac-delta-8, ac-delta-9). A violation would be checkbox state surviving a tab switch, or a plan-selection affecting the *All tests* launch outcome.
**Derived from:** [AC-2](../../test-cases/manual-tests-execution/_ac-baseline.md#run-creation--new-manual-run-dialog), `run-creation-ac-delta.md` ac-delta-8, ac-delta-9.
**Referenced by:** [UC-01](./06-use-cases/UC-01-create-manual-run.md) (Business rules referenced, A1..A3).

---

## BR-5: Custom Status requires a standard status first
<a id="br-5"></a>

**Statement:** In the Manual Runner — both single-test and Multi-Select bulk surfaces — the [Custom Status](./03-glossary.md#custom-status) dropdown is disabled until a **standard** status (PASSED / FAILED / SKIPPED) has been chosen. The custom status attaches to the standard status; it never replaces it.
**Rationale:** Custom statuses are project-defined labels layered on top of the three canonical outcomes so reporting, TQL (`has_custom_status`), and counter aggregation can still aggregate by the standard axis. Letting a custom status stand alone would break every downstream consumer that assumes a standard status exists.
**Scope:** Single-test path in the runner ([UC-03 main + E2](./06-use-cases/UC-03-execute-test-in-runner.md#exception-flows)); Multi-Select bulk "Result message" modal ([UC-09 E2](./06-use-cases/UC-09-bulk-status-in-runner.md#e2-apply-disabled-until-a-status-is-picked)). Applicability of Custom Status inside bulk is **UNCLEAR** — see [13-open-questions.md § OQ-18](./13-open-questions.md#oq-18).
**Violations / enforcement:** Dropdown disabled state; Apply button disabled until a standard status is picked; implicit or default standard inference is prohibited (`test-execution-runner-ac-delta.md` ac-delta-21, AC-31).
**Derived from:** [AC-31](../../test-cases/manual-tests-execution/_ac-baseline.md#manual-runner--status--attachments--steps-details-panel), `test-execution-runner-ac-delta.md` ac-delta-21, `bulk-status-actions-ac-delta.md` ac-delta-6.
**Referenced by:** [UC-03](./06-use-cases/UC-03-execute-test-in-runner.md), [UC-09](./06-use-cases/UC-09-bulk-status-in-runner.md).

---

## BR-6: Run-assignment prerequisite for per-suite and per-test assignment
<a id="br-6"></a>

**Statement:** Before a user can be assigned to a suite or an individual test within a Run, that user must already be assigned to the Run itself. Per-suite / per-test assignment dropdowns surface only Run-assigned users.
**Rationale:** The Run is the unit of responsibility; finer-grained assignments are a refinement of the Run's assignee set. Permitting a non-Run user to take a test creates two conflicting sources of truth (who is on the Run vs. who holds tests) and breaks the *Assigned to* column, Extended Report assignee grouping, and Edit-run removal semantics (removing a user from the Run must atomically drop their per-test assignments).
**Scope:** Per-suite *Assign to* inside the Runner (AC-42); Multi-Select bulk *Assign to* in the Runner (AC-43); per-test detail-pane reassignment (`tester-assignment-ac-delta.md` ac-delta-13). Enforced via UI — non-Run users do not appear in the user dropdowns (ac-delta-8, ac-delta-9).
**Violations / enforcement:** The UI filters dropdowns to Run-assigned users. Removing a user from the Run cascades to drop their per-suite / per-test assignments (ac-delta-6).
**Derived from:** [AC-41](../../test-cases/manual-tests-execution/_ac-baseline.md#assignment--run-assignment-strategies), `tester-assignment-ac-delta.md` ac-delta-8, ac-delta-9.
**Referenced by:** [UC-06](./06-use-cases/UC-06-assign-testers.md), [UC-03](./06-use-cases/UC-03-execute-test-in-runner.md), [UC-09](./06-use-cases/UC-09-bulk-status-in-runner.md).

---

## BR-6a: Manager-role exclusion from random distribution
<a id="br-6a"></a>

**Statement:** The Auto-Assign Users *Randomly distribute tests between team members* strategy skips any assigned user whose project role is **manager**. When the only assigned user is a manager, no tests are auto-assigned — the per-test assignee column shows empty / "—", not an error.
**Rationale:** Managers are observers by convention; auto-distributing execution work to them breaks the separation between oversight and execution. The rule is deliberate product policy, not a bug — the resulting empty-assignment state is treated as legitimate and must not be surfaced as a failure.
**Scope:** Random-distribute strategy only (AC-39). Does not apply to the *Prefer test assignee* or *None* strategies. Manager chip on the creation sidebar is independently unremovable ([UC-01 main flow](./06-use-cases/UC-01-create-manual-run.md), AC-37).
**Violations / enforcement:** Distribution logic excludes manager-role users; empty per-test state is a valid post-launch outcome (`tester-assignment-ac-delta.md` ac-delta-11).
**Derived from:** [AC-40](../../test-cases/manual-tests-execution/_ac-baseline.md#assignment--run-assignment-strategies), `tester-assignment-ac-delta.md` ac-delta-11.
**Referenced by:** [UC-06 A2 / E2](./06-use-cases/UC-06-assign-testers.md#a2-auto-assign--randomly-distribute-tests-between-team-members).

---

## BR-7: Finishing a Run marks Pending tests as Skipped
<a id="br-7"></a>

**Statement:** When a Run transitions from **In-Progress** to **Finished** via the Finish Run action, every test that is still **Pending** at that moment is automatically marked **Skipped**. Already-recorded statuses (Passed / Failed / Skipped / Custom) are preserved.
**Rationale:** A Finished Run is a terminal reporting artefact — every test must have a definitive outcome. *Pending* is an in-flight state that has no meaning post-Finish. Skipped is the least-committal terminal status and matches the user intent of "we decided not to run this one".
**Scope:** Finish Run action only ([UC-04 main / AC-25 / AC-26](./06-use-cases/UC-04-finish-run.md)). Does **not** apply to manual Archive of an ongoing Run — [BR-8](#br-8) covers the Terminated path, which has the same Pending → Skipped outcome but via a different transition (AC-76).
**Violations / enforcement:** The confirmation dialog on Finish Run states the count of not-run tests and announces the Skipped transition (`run-lifecycle-ac-delta.md` ac-delta-9, AC-28); cancel of the dialog preserves the In-Progress state (ac-delta-10).
**Derived from:** [AC-26](../../test-cases/manual-tests-execution/_ac-baseline.md#run-lifecycle--creation--continue--finish--edit), `run-lifecycle-ac-delta.md` ac-delta-9, ac-delta-10.
**Referenced by:** [UC-04](./06-use-cases/UC-04-finish-run.md), [UC-11](./06-use-cases/UC-11-view-run-report.md).

---

## BR-8: Terminated Runs cannot resume
<a id="br-8"></a>

**Statement:** A Run in the [Terminated](./03-glossary.md#terminated) state — reached via Archive of an ongoing Run (AC-76) — cannot transition back to **In-Progress**. Restoring it from Archive via Unarchive keeps the Terminated state; the Manual Runner remains unreachable; [Run Report](./03-glossary.md#run-report) is the only view served.
**Rationale:** Terminated means "we stopped executing this Run and decided the recorded snapshot is final." Allowing resume would introduce ambiguity about the already-applied Pending → Skipped coercion (AC-76) and about any results attributed to a prior snapshot. The state machine enforces finality ([05-state-diagrams.md § Run](./05-state-diagrams.md#run) explicitly omits the `Terminated → InProgress` edge).
**Scope:** Terminated Runs only. **Finished** Runs retain Relaunch variants (AC-58..AC-62, [UC-05](./06-use-cases/UC-05-relaunch-run.md)) and are not subject to this rule. Unarchiving a Terminated Run is permitted; it only returns visibility, not executability ([UC-12 A7](./06-use-cases/UC-12-archive-unarchive-purge.md#a7-unarchive-a-single-run)).
**Violations / enforcement:** Runner entry is gated on run state (`test-execution-runner-ac-delta.md` ac-delta-1); Relaunch ▾ is exposed only for Finished Runs (`run-lifecycle-ac-delta.md` ac-delta-8); the state diagram has no edge that targets In-Progress from Terminated.
**Derived from:** [AC-80](../../test-cases/manual-tests-execution/_ac-baseline.md#archive-and-purge), [05-state-diagrams.md § Run](./05-state-diagrams.md#run), `test-execution-runner-ac-delta.md` ac-delta-1.
**Referenced by:** [UC-03 E1](./06-use-cases/UC-03-execute-test-in-runner.md), [UC-04 E2](./06-use-cases/UC-04-finish-run.md), [UC-05](./06-use-cases/UC-05-relaunch-run.md), [UC-12](./06-use-cases/UC-12-archive-unarchive-purge.md).

---

## BR-9: RunGroup cascade on Archive, Unarchive, and Purge
<a id="br-9"></a>

**Statement:** Group-level destructive actions fan out atomically to every nested Run — Archiving a [RunGroup](./03-glossary.md#rungroup) archives every child Run; Unarchiving restores every child; Purging cascades the Purge to every child (subject to [BR-10](#br-10)). No orphan state can arise where the group and its children disagree on archive state.
**Rationale:** Groups are organisational containers; destructive operations are authored at the group scope precisely to avoid the per-Run tedium. Partial cascades would stranded children in an inconsistent state (visible on the active list under a vanished group) and would break the Groups tab / Archive page invariants.
**Scope:** Archive / Unarchive / Purge actions on a RunGroup ([UC-08 A9, A10](./06-use-cases/UC-08-manage-rungroup.md), [UC-12 A3, A5, A9](./06-use-cases/UC-12-archive-unarchive-purge.md)). Does **not** apply to a Multi-Select on the Runs list — that bulk mode targets Runs only (ac-delta-2). Orphan (ungrouped) Runs are unaffected by any group operation.
**Violations / enforcement:** Confirmation dialog wording on group-level Archive signals the cascade (ac-delta-17); the Groups Archive page shows nested Runs by default via the *Rungroup Structure* toggle (ac-delta-7).
**Derived from:** [AC-56, AC-57](../../test-cases/manual-tests-execution/_ac-baseline.md#archive-and-purge), `archive-and-purge-ac-delta.md` ac-delta-15, ac-delta-17.
**Referenced by:** [UC-08](./06-use-cases/UC-08-manage-rungroup.md), [UC-12](./06-use-cases/UC-12-archive-unarchive-purge.md).

---

## BR-10: 20 000-Run Purge ceiling per RunGroup
<a id="br-10"></a>

**Statement:** A single Purge operation on a [RunGroup](./03-glossary.md#rungroup) covers at most **20 000** nested Runs. Groups over this ceiling are blocked with an error or guidance; the operation does not proceed.
**Rationale:** Purge compresses data and mutates Archive state at bulk scale; the ceiling is a defensive bound against unbounded server-side work. Splitting such groups (or using per-Run purge / auto-purge retention per [BR-12](#br-12)) is the supported workaround.
**Scope:** RunGroup-level **Purge** only. The group-Archive path ([BR-9](#br-9)) has no such ceiling. Automatic Purge ([BR-12](#br-12)) is governed by retention windows, not size, so the ceiling does not apply there either.
**Violations / enforcement:** Enforcement mode is **UNCLEAR** — whether the UI pre-checks and disables/warns, or server returns an error on submit, is tracked in [13-open-questions.md § OQ-17](./13-open-questions.md#oq-17). Manual testing at 20 000+ scale is not practical — this rule is primarily a specification constraint (AC-57, ac-delta-19).
**Derived from:** [AC-57](../../test-cases/manual-tests-execution/_ac-baseline.md#archive-and-purge), `archive-and-purge-ac-delta.md` ac-delta-19.
**Referenced by:** [UC-08 A10](./06-use-cases/UC-08-manage-rungroup.md#a10-purge-the-rungroup-cascade--20-000-run-ceiling), [UC-12 A5](./06-use-cases/UC-12-archive-unarchive-purge.md#a5-purge-a-rungroup-cascade--20-000-ceiling).

---

## BR-11: Readonly cannot perform destructive actions
<a id="br-11"></a>

**Statement:** Users with the Readonly project role cannot perform any destructive action on Runs or RunGroups — Archive, Unarchive, Purge, and Permanent delete are all blocked. Destructive bulk actions (Archive, Purge, Labels edit, Move) are hidden or disabled in the UI for Readonly; the backend also rejects the operation if attempted directly.
**Rationale:** Readonly is an observation role by definition. Destructive actions mutate shared state that downstream consumers (Report, Pulse, Archive pages) depend on; Readonly semantics would be meaningless if bypassable.
**Scope:** Readonly role — every destructive surface, whether from a row extra menu, Multi-Select bottom toolbar, RunGroup page, or Archive page extra menu. Non-destructive read actions (open Report, switch tabs, Custom view) remain available. Partial coverage of AC-100 — exact UI affordance (hidden vs disabled) may vary per surface; resolved for this sub-feature per `archive-and-purge-ac-delta.md` ac-delta-20.
**Violations / enforcement:** UI hides / disables the affected menu items and toolbar buttons; API returns a permission-denied error on direct invocation (expected — not exercised in POC, tracked as [OQ-06](./13-open-questions.md#oq-06) for full matrix).
**Derived from:** [AC-100 (resolved for archive scope)](../../test-cases/manual-tests-execution/_ac-baseline.md#cross-cutting--permissions--unclear), `archive-and-purge-ac-delta.md` ac-delta-20, [02-actors-and-permissions.md § Role × Action matrix](./02-actors-and-permissions.md#role--action-matrix).
**Referenced by:** [UC-10 E2](./06-use-cases/UC-10-manage-runs-list.md#e2-destructive-action-attempted-by-readonly), [UC-12 E1](./06-use-cases/UC-12-archive-unarchive-purge.md#e1-readonly-attempts-a-destructive-action).

---

## BR-12: Automatic Purge retention default is 90 days
<a id="br-12"></a>

**Statement:** The project setting **Purge Old Runs** governs automatic purge retention. Default value on first use is **90 days**. Non-numeric and negative values are rejected; an empty value disables automatic purge. Runs finished older than the retention window are auto-purged and receive the **Purged** badge.
**Rationale:** A predictable default lets teams benefit from data hygiene without explicit configuration. Rejecting malformed input avoids silent misconfiguration where a typo (e.g., `-90`) would otherwise be interpreted unpredictably by the purge scheduler.
**Scope:** Project-level setting only. Applies to Finished Runs older than the window; does not apply to In-Progress or Pending Runs (they have no *finished_at* to compare against). Unaffected by [BR-10](#br-10)'s 20 000-Run ceiling — auto-purge is a per-Run scheduler, not a group-level batch.
**Violations / enforcement:** Input validation on the retention field (`archive-and-purge-ac-delta.md` ac-delta-8, ac-delta-9). Exact validation copy is **UNCLEAR** for malformed / empty values — tracked for UI capture.
**Derived from:** [AC-79](../../test-cases/manual-tests-execution/_ac-baseline.md#archive-and-purge), `archive-and-purge-ac-delta.md` ac-delta-8, ac-delta-9.
**Referenced by:** [UC-12 A6](./06-use-cases/UC-12-archive-unarchive-purge.md#a6-automatic-purge--retention-window).

---

## BR-13: Public Share requires both Company and Project Sharing flags
<a id="br-13"></a>

**Statement:** The **Share Report Publicly** action is permitted only when both the Company-level *Sharing* feature flag and the Project-level *Sharing* setting are enabled. The dialog defaults are: **Expiration 7 days** and **Protect by passcode ON**. Generated URL and passcode are shown **once** and cannot be re-retrieved after dialog close; **Stop Sharing** immediately revokes the URL.
**Rationale:** Public sharing exposes internal test results outside the authenticated boundary; the two-level flag is a deliberate belt-and-braces control (a company can opt out globally even if a project is misconfigured). The 7-day default and passcode-ON default are conservative sharing primitives that must hold unless the user explicitly relaxes them in the dialog.
**Scope:** [UC-11 A8](./06-use-cases/UC-11-view-run-report.md#a8-share-publicly-url--passcode). Does **not** apply to Share by Email (A7) — email recipients receive authenticated content via the app. Does **not** apply to the (UNCLEAR) non-public *Copy Link* action ([A11 / AC-99](./06-use-cases/UC-11-view-run-report.md#a11-copy-link--unclear)).
**Violations / enforcement:** Action is disabled / hidden when either flag is off (AC-90). Defaults are set by the dialog on open (`run-detail-and-report-ac-delta.md` ac-delta-19). Revocation is immediate — subsequent loads of the public URL return a revoked/expired state (ac-delta-20, AC-91).
**Derived from:** [AC-90, AC-91](../../test-cases/manual-tests-execution/_ac-baseline.md#run-detail--report), `run-detail-and-report-ac-delta.md` ac-delta-19, ac-delta-20.
**Referenced by:** [UC-11 A8 / E1](./06-use-cases/UC-11-view-run-report.md#a8-share-publicly-url--passcode).
