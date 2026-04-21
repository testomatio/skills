---
audience: qa-team, dev-team
feature: manual-tests-execution
last-reviewed: 2026-04-21
owner: "@gololdf1sh"
---

# 13 — Open Questions

Ambiguities and unverified behaviours surfaced across Manual Tests Execution. Each entry is a concrete question with: where the uncertainty was introduced, what the current assumption is, and what resolution would look like (how to verify + who to ask).

Sources compiled from:
- `_feature-review.md` § 7 prioritised action list (HIGH and MEDIUM items with behavioural impact).
- `@unclear` tags in per-sub-feature test files (`run-creation`, `run-lifecycle`, `tester-assignment`, `environment-configuration`, `run-groups`, `bulk-status-actions`, `runs-list-management`, `run-detail-and-report`, `archive-and-purge`, `test-execution-runner`).
- Baseline ACs explicitly marked UNCLEAR (AC-97, AC-98, AC-99, AC-100).
- Sub-feature AC-delta files with `UNCLEAR` sections.

Resolve an OQ in situ — update the answer, link to the PR / UI recording that closes it, and move it to the [resolved archive](#resolved) at the bottom. Do not delete.

---

## Role / permission matrix

### OQ-01 — Complete role-gating for Create / Launch / Finish / Edit / Relaunch
<a id="oq-01"></a>

**Question:** For the Tester and Readonly roles, which of the following actions are permitted: Create a Run, Launch, Finish, Edit an unfinished Run, Relaunch (any variant), Share Report (Email / Public)?
**Source:** [AC-100](../../test-cases/manual-tests-execution/_ac-baseline.md) (baseline UNCLEAR); `tester-assignment-ac-delta.md` UNCLEAR note on AC-100.
**Current assumption:** Readonly → ✗ for all write actions; Tester → ✓ for *Execute* and bulk status (for own tests), `?` elsewhere. See [02-actors-and-permissions.md § Role × Action matrix](./02-actors-and-permissions.md#role--action-matrix).
**Resolution path:** Verify in UI with a readonly-role user and with a tester-only user (non-creator) in `project-for-testing`. Record observed behaviour per action; resolve matrix cells marked `?`.

### OQ-03 — Purge retention configuration & permanent-delete permissions
<a id="oq-03"></a>

**Question:** Who may configure *Purge Old Runs* retention and who may permanently delete a Run from Archive? Do QA-role users have these, or are they Owner/Manager-only?
**Source:** `archive-and-purge-ac-delta.md` ac-delta-20 partially resolves Owner/Manager/Readonly but leaves QA-role unresolved; AC-79, AC-81.
**Current assumption:** Owner/Manager ✓, Readonly ✗, QA `?`.
**Resolution path:** UI verification as above.

### OQ-04 — Readonly read-surface scope
<a id="oq-04"></a>

**Question:** Can a Readonly user Download as Spreadsheet (AC-87), Export as PDF (AC-88), or Compare Runs (AC-92)?
**Source:** AC-87, AC-88, AC-92 use role-agnostic wording; not explicitly resolved in `archive-and-purge-ac-delta.md` ac-delta-20.
**Current assumption:** Readonly ✓ for read-only read-surface (Export / Download / Compare do not mutate state).
**Resolution path:** Try each action as Readonly; record.

### OQ-05 — Creator "as manager" label semantics
<a id="oq-05"></a>

**Question:** The `as manager` label attached to the creator chip in the New Manual Run sidebar (ac-delta-1 of `tester-assignment-ac-delta.md`) — is it creator-derived (every creator gets it), or project-role-derived (only project managers get it)?
**Source:** `tester-assignment-ac-delta.md` ac-delta-1 wording; [02-actors-and-permissions.md § Creator-specific semantics](./02-actors-and-permissions.md#creator-specific-semantics).
**Current assumption:** Creator-derived (label is a UI affordance for the creator, not a project-role projection).
**Resolution path:** Log in as a non-Manager role with Create permission, create a Run, inspect the chip label.

---

## Mixed Run / CI

### OQ-02 — Mixed Run CI-Profile vs local-CLI UI behaviour
<a id="oq-02"></a>

**Question:** What exactly does the Mixed Run surface show when (a) a CI Profile exists vs (b) no CI Profile is configured, and what happens when the CI trigger fails at Launch?
**Source:** `_feature-review.md` § 7 #4 (HIGH-ish MEDIUM — AC-16 not exercised in tests); [BR-3](./07-business-rules.md#br-3) enforcement is currently speculative.
**Current assumption:** AC-16 documents the binary dichotomy; the UI is assumed to surface guidance in the no-CI-Profile case and a failure banner on trigger failure.
**Resolution path:** UI walk-through on `project-for-testing` with and without a configured CI Profile; capture the Mixed Run sidebar screenshots (out-of-scope for this POC per [01-feature-context.md](./01-feature-context.md)) and update [UC-02 E1/E2](./06-use-cases/UC-02-create-mixed-run.md#exception-flows).

### OQ-07 — Mixed-run relaunch CI/UI routing
<a id="oq-07"></a>

**Question:** For a Mixed Run, does *Relaunch Failed on CI* re-run only the automated failures or both the automated and manual failures (with manual failures re-opening the Manual Runner)?
**Source:** `run-lifecycle` test-file `@unclear` on `ac-delta-14` — *"No mixed runs exist in project; covered as @unclear deferred test"*.
**Current assumption:** AC-59 is explicit: failed automated tests re-run on CI; failed **manual** tests open in Manual Runner. Unverified in project due to fixture absence.
**Resolution path:** Seed a Mixed Run, let some automated + manual tests fail, invoke *Relaunch Failed on CI*, observe routing.

### OQ-08 — "Launch a Copy Manually" variant
<a id="oq-08"></a>

**Question:** Does a *"Launch a Copy Manually"* variant exist in addition to *Launch a Copy* (AC-67)?
**Source:** `run-lifecycle` test-file `@unclear` on `ac-delta-1` — *"variant not visible in project UI for manual runs"*.
**Current assumption:** If it exists, it is the same as *Launch a Copy* when the source is purely manual. Variant naming may be context-sensitive (only visible for Mixed / Automated sources).
**Resolution path:** Inspect row extra-menu on a Mixed Run.

---

## Assignment

### OQ-09 — "Prefer test assignee" fallback when no pre-set assignee
<a id="oq-09"></a>

**Question:** When the *Prefer test assignee* Auto-Assign strategy encounters a test with no pre-set assignee, does the test fall back to unassigned, to the creator, or to a manager?
**Source:** `tester-assignment-ac-delta.md` ac-delta-4 UNCLEAR; `@unclear` tag on the matching deferred test.
**Current assumption:** Observed state per test — no silent fallback rule documented.
**Resolution path:** Seed a test without a pre-set assignee, launch with *Prefer* strategy, observe outcome.

### OQ-10 — Confirmation dialog wording for removing an assigned user with recorded results
<a id="oq-10"></a>

**Question:** Exact copy of the confirmation dialog when a user being removed from a Run has already recorded test results?
**Source:** `tester-assignment-ac-delta.md` ac-delta-6 UNCLEAR; `@unclear` deferred test.
**Current assumption:** Confirmation exists; wording is non-blocking but should be captured for UX consistency.
**Resolution path:** Trigger the scenario; capture copy verbatim.

---

## State / lifecycle

### OQ-11 — Edit availability on a Finished Run
<a id="oq-11"></a>

**Question:** If a user attempts to edit a Finished Run, what is the exact UI response — is the Edit button hidden, disabled, or does clicking redirect to the Report?
**Source:** `run-lifecycle` test file `@unclear` on t7 ("Edit is not available on a finished run") — advisory from the lifecycle review.
**Current assumption:** Edit is gated on the *Ongoing* state (cross-cutting concern **G**) — most likely hidden or disabled. Redirect is speculative.
**Resolution path:** UI verification.

### OQ-12 — Fast Forward vs Auto-Track
<a id="oq-12"></a>

**Question:** Does a *Fast Forward* control exist in the Manual Runner separately from *Auto-Track*?
**Source:** [AC-97](../../test-cases/manual-tests-execution/_ac-baseline.md) (baseline UNCLEAR).
**Current assumption:** Only *Auto-Track* exists (docs only mention it); *Fast Forward* may be a removed or renamed affordance.
**Resolution path:** Inspect the Runner's time-tracking controls.

### OQ-13 — Defects tab behaviour in Run detail
<a id="oq-13"></a>

**Question:** What exactly is shown in the *Defects* tab inside Run detail (AC-83)?
**Source:** [AC-98](../../test-cases/manual-tests-execution/_ac-baseline.md) (baseline UNCLEAR).
**Current assumption:** Lists linked defects (Jira / GitHub issues) for tests in the Run.
**Resolution path:** Open a Run with failed tests that have linked issues; capture the tab.

### OQ-14 — "Copy Link" affordance on Run Report extra menu
<a id="oq-14"></a>

**Question:** Does a *Copy Link* action exist on the Run Report extra menu for non-public sharing?
**Source:** [AC-99](../../test-cases/manual-tests-execution/_ac-baseline.md) (baseline UNCLEAR); flagged `@unclear` on one `run-detail-and-report` test.
**Current assumption:** Unknown; the internal-share URL may only live in the Share dialog.
**Resolution path:** Inspect the row extra-menu on a Run Report.

### OQ-15 — Edit-Run save toast copy
<a id="oq-15"></a>

**Question:** Exact wording of the toast shown after saving an Edit-Run change?
**Source:** `tester-assignment-ac-delta.md` ac-delta-6 UNCLEAR (*"Run has been updated" presumed*).
**Current assumption:** "Run has been updated".
**Resolution path:** UI capture.

---

## Runs list & reporting

### OQ-16 — "Merge" action in Multi-select Extra menu — destination semantics
<a id="oq-16"></a>

**Question:** What does the *Merge* bulk action do — pick a destination Run and append selected Runs' tests, or produce a combined report equivalent?
**Source:** `runs-list-management` `@unclear` note: *"destination / merge semantics ambiguous"*; AC-71.
**Current assumption:** Merge combines selected Runs into one container; exact output (new Run vs RunGroup promotion) unverified.
**Resolution path:** Try in UI with 2 Runs.

### OQ-17 — Custom-status applicability in bulk status picker
<a id="oq-17"></a>

**Question:** Does the bulk *Result message* dialog in Multi-Select mode expose the Custom Status dropdown after a standard status is chosen (AC-31 applied to bulk)?
**Source:** `bulk-status-actions` `@unclear` note: *"NOT PRESENT in the bulk 'Result message' dialog as of exploration date … may require custom statuses configured in project settings"*.
**Current assumption:** AC-31 applies to single-test result entry only; bulk may or may not carry it through.
**Resolution path:** Configure custom statuses in project; retry bulk picker.

### OQ-18 — "One Run" multi-environment mode observability
<a id="oq-18"></a>

**Question:** Is AC-48's *One Run* multi-environment mode observable as a distinct launch action in the current UI, or is it the implicit behaviour of a single-group Launch?
**Source:** `environment-configuration` `@unclear` on ac-delta-8.
**Current assumption:** *One Run* may have been removed, renamed, or is behind a toggle; the three-way Launch / Launch-in-Sequence / Launch-All picker may only surface with ≥2 env groups.
**Resolution path:** UI walk-through with 1 vs 2 env groups.

### OQ-19 — 20 000-Run Purge limit surfacing
<a id="oq-19"></a>

**Question:** Is the 20 000-Run per-Purge limit surfaced to the user (pre-check banner / disabled button) or enforced silently server-side?
**Source:** `archive-and-purge-ac-delta.md` ac-delta-U1 (UNCLEAR).
**Current assumption:** Server-side validation with an error message on violation; limit is not easily triggerable manually.
**Resolution path:** Requires seeded data (out of scope in POC).

### OQ-20 — "Combined Report Compare To" across different RunGroups
<a id="oq-20"></a>

**Question:** Can Combined Report's *Compare To* selector pick runs from a **different** RunGroup, or is it scoped to within-group only?
**Source:** `run-groups` Phase-3 review; one `@unclear` doc test documenting the observed within-group-only behaviour.
**Current assumption:** Within-group only (observed); full cross-group comparison withheld pending product clarification.
**Resolution path:** Product clarification — is cross-group intended?

---

## Style / doc-process

### OQ-21 — Single quotes vs backticks for UI labels in test-case prose
<a id="oq-21"></a>

**Question:** Should the test-case corpus normalise to single-quoted UI labels (`'Launch'`) or backticked (`` `Launch` ``)? `_style.md` specifies single quotes; sub-features 5, 7, 8, 9, 10 drifted to backticks.
**Source:** `_feature-review.md` § 7 #1 (HIGH).
**Current assumption:** Single quotes are canonical per `_style.md`; drift needs to be either fixed or style guide updated.
**Resolution path:** Decision — pick one; either bulk-fix the minority convention before publish or append a "both acceptable" note to `_style.md`. This affects test-case files, **not** docs in this tree.

### OQ-22 — run-groups ac-delta-18 / ac-delta-19 coverage
<a id="oq-22"></a>

**Question:** Are `run-groups-ac-delta.md` ac-delta-18 and ac-delta-19 rollup/catalog-only deltas, or genuine behavioural gaps that need tests?
**Source:** `_feature-review.md` § 7 #2 (HIGH).
**Current assumption:** Unknown — `_feature-review.md` flags both deltas as uncited.
**Resolution path:** Re-read the two deltas; confirm whether they are behavioural or meta.

### OQ-23 — Concern B dedicated cross-cutting test for run-detail-and-report
<a id="oq-23"></a>

**Question:** run-detail-and-report (#8) lacks a dedicated multi-user (Concern B) test.
**Source:** `_feature-review.md` § 7 #3 (MEDIUM); ADV-4 in `tester-assignment-review.md`.
**Current assumption:** Assignee filter and grouping are exercised via AC-85 tests, but a pure multi-user scenario is not isolated.
**Resolution path:** Add 1 test in `run-detail-and-report/cross-cutting.md` exercising per-assignee grouping on a multi-assignee Run.

### OQ-24 — "Extra menu" step phrasing drift
<a id="oq-24"></a>

**Question:** The registered Testomat.io step phrase is `Click the '...' extra menu`; 30+ test steps in `archive-and-purge` / `run-lifecycle` use `Open the extra menu on the {row} row` instead.
**Source:** `_feature-review.md` § 5 (step drift — LOW).
**Current assumption:** Semantically equivalent; low priority; only matters at publish time if step library reuse is required.
**Resolution path:** Decide at publish whether to rewrite or accept the drift.

---

## Resolved
<a id="resolved"></a>

*(empty — no questions resolved yet in Phase 1)*
