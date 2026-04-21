---
audience: qa-team, dev-team, sre, product
feature: manual-tests-execution
last-reviewed: 2026-04-21
owner: "@gololdf1sh"
---

# 12 — Non-Functional Requirements

Constraints that shape the feature's behaviour without being expressible as a single acceptance criterion: limits, retention, concurrency, permissions, and performance characteristics observed or implied by the current UI. Items flagged **UNCLEAR** map to [13-open-questions.md](./13-open-questions.md).

---

## NFR-1. Capacity & limits

### NFR-1.1 Purge ceiling — 20,000 test results

- **Source.** UC-08 A10 / UC-12 A5; governed by [BR-12](./07-business-rules.md#br-12).
- **Behaviour.** Purging a RunGroup whose child Runs aggregate > 20 000 test results is blocked (or partitioned — UI mode UNCLEAR, [OQ-17](./13-open-questions.md#oq-17)).
- **Rationale.** Database-level safeguard against a single destructive action exceeding the storage engine's bulk-delete budget.
- **User-visible signal.** Inline validation / toast copy expected on the confirm dialog (exact copy UNCLEAR).

### NFR-1.2 Title length — 255 characters

- **Source.** New Manual Run sidebar `Title` input (observed `maxlength="255"`).
- **Applies to.** Run title, RunGroup title. Description textareas appear unbounded at the UI layer.

### NFR-1.3 RunGroup + Run fan-out

- **Observed ceilings.** Not surfaced in the UI during Phase 1/2 exploration. No visible cap on Runs per RunGroup, child Runs per Launch-All, or plans per Run.
- **Flagged as.** UNCLEAR — see [OQ-18](./13-open-questions.md#oq-18) (if present) or future phase.

### NFR-1.4 AI-generated Run Status Report

- **Gate.** Requires ≥ 5 finished Runs in the filtered view (ac-delta-4 of runs-list-management).
- **Payload / prompt structure.** UNCLEAR — see [OQ-19](./13-open-questions.md#oq-19).

---

## NFR-2. Retention & lifecycle

### NFR-2.1 Auto-purge windows

- **Source.** UC-12 A6.
- **Behaviour.** Archived Runs become Purged after a project-configured retention window; Purged Runs may be permanently deleted after a second retention window.
- **Effect of Purge.** Run row remains with a `Purged` badge; stack traces are dropped; **statuses, attachments, and Run ID are preserved** (ac-delta-16 of archive-and-purge, BR-12).
- **Effect of Permanent Delete.** Row is removed entirely; a `"Deleted Run"` entry is emitted to Pulse (AC-81).
- **UNCLEAR.** Exact default retention values, per-project configurability UI, and whether retention runs on a fixed cadence or continuous sweep — see [OQ-15](./13-open-questions.md#oq-15).

### NFR-2.2 Unarchive preserves prior state

- **Source.** [BR-8](./07-business-rules.md#br-8), AC-80.
- **Behaviour.** Unarchive restores an item to its state at the moment of Archive — Terminated stays Terminated (cannot be resumed), Finished stays Finished. Archive is **not** a re-entry path into In-Progress.

### NFR-2.3 Cascade atomicity on RunGroup Archive

- **Source.** [BR-9](./07-business-rules.md#br-9).
- **Behaviour.** The parent group and every child Run transition together. No observable intermediate state where the group is Archived but children are not (or vice versa). Error handling for partial failure is server-side and not user-visible.

---

## NFR-3. Concurrency

### NFR-3.1 Sequential child activation (Launch in Sequence)

- **Source.** UC-07 A1; ac-delta-9 of environment-configuration.
- **Invariant.** At most one child Run is In-Progress at a time under Launch in Sequence. Next child transitions to In-Progress only when the previous child reaches Finished.

### NFR-3.2 Parallel child activation (Launch All)

- **Source.** UC-07 A2; ac-delta-10.
- **Invariant.** All children transition to In-Progress simultaneously on Launch All.

### NFR-3.3 Multi-tester concurrency on a single Run

- **Observed.** Two or more testers can operate the same Runner URL simultaneously. Last-write-wins on the Result / status field; no optimistic-locking conflict dialog was observed.
- **Governed by.** None (no BR authored at this phase). Risk: silent overwrite of mid-flight edits. Flagged for future coverage.

### NFR-3.4 Idempotency of `Finish Run`

- **Source.** BR-7 + ac-delta-10 of run-lifecycle.
- **Invariant.** Cancelling the native confirm is a no-op; a double-confirm after Finish is not re-enterable because the Run's state has left In-Progress.

---

## NFR-4. Permissions model (summary)

Full permission matrix lives in [02-actors-and-permissions.md](./02-actors-and-permissions.md). Non-functional view:

| Capability | Owner | Admin | QA Creator | Manager | Tester | Readonly |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Create / Edit Run | ● | ● | ● | ● | | |
| Launch / Finish Run | ● | ● | ● | ● | ● (if assigned) | |
| Execute tests in Runner | ● | ● | ● | ● | ● (if assigned) | |
| Bulk status in Runner | ● | ● | ● | ● | ● | |
| Archive / Purge Run | ● | ● | ● | | | |
| Permanent Delete (from Purged) | ● | ● | | | | |
| Manage CI Profile | ● | ● | | | | |
| Configure Multi-Env | ● | ● | ● | ● | | |
| Assign testers | ● | ● | ● | ● | | |
| View Run / Report | ● | ● | ● | ● | ● | ● |
| Share Publicly | ● | ● | ● | ● | | |

### Key NFRs from this matrix

- **NFR-4.1** Tester role is excluded from assignee-distribution targets when `Randomly distribute` is used (ac-delta-11 of tester-assignment) — manager-role users are excluded by design.
- **NFR-4.2** Readonly cannot surface destructive affordances (ac-delta-20 of archive-and-purge): Archive / Purge / Unarchive / Permanent Delete are hidden, not disabled.
- **NFR-4.3** Edit Run page is blocked once the Run is Finished ([BR-10](./07-business-rules.md#br-10)); UI demotes Edit entry points but does not show an explicit error.
- **NFR-4.4** Permanent Delete admin-gating specifics — UNCLEAR ([OQ-13](./13-open-questions.md#oq-13)).
- **NFR-4.5** Shared-link access bypasses project-role checks (BR-13, I-7 in [11-integrations.md](./11-integrations.md)); revocation is the only control.

---

## NFR-5. Performance & responsiveness

### NFR-5.1 Runner interactivity targets (observed, not SLA-backed)

- **Single-test mark (PASSED / FAILED / SKIPPED).** Sub-second UI acknowledgement (counter increments + tree icon swap) under normal load. No loading spinner surfaces.
- **Bulk status apply (Multi-Select).** UI acknowledges synchronously for typical selections; server-side completion implied by header counter update (AC-95).
- **UNCLEAR.** No formal P95/P99 targets exposed to product; tier-1 SLAs are SRE-owned and not documented in this feature scope.

### NFR-5.2 Runs-list chart rendering

- **Observed.** Chart renders client-side from a precomputed aggregate; no visible degradation up to the exploration dataset size (~20 runs). Behaviour on 1 000+ run projects is UNCLEAR.

### NFR-5.3 TQL query evaluation

- **Observed.** Sub-second for simple filters; complex `and/or` chains unbenchmarked. Autocomplete is client-side.

### NFR-5.4 Report generation (PDF / XLSX)

- **Mechanism.** Server-rendered download (pull model — I-8 in [11-integrations.md](./11-integrations.md)).
- **Observed latency.** Acceptable for single-Run exports; Combined Report latency at RunGroup scale is UNCLEAR.

---

## NFR-6. Reliability

### NFR-6.1 Launch atomicity

- **Source.** UC-01 ac-delta-18.
- **Invariant.** Either the Run is created and the Runner opens, or it is not — partial creation is never observable to the user.

### NFR-6.2 Terminal-state finality

- **Source.** BR-7 (Finished is terminal), BR-8 (Terminated is terminal).
- **Invariant.** No transition out of Finished or Terminated back to In-Progress exists. The only re-entry path is Relaunch, which creates a **new** execution — either reusing the Run ID (AC-64) or minting a new one (AC-63).

### NFR-6.3 Cancel paths preserve selection state where safe

- **Runner Multi-Select × Clear-Selection.** Clears selection **but keeps Multi-Select ON** (ac-delta-11 of bulk-status-actions) — a safety-for-iteration trade-off.
- **Runner Multi-Select → dismiss Result modal.** **Clears selection** (ac-delta-7 of bulk-status-actions) — dismiss-as-cancel treats the whole action as undone.

---

## NFR-7. Accessibility & usability

### NFR-7.1 Keyboard shortcuts in Runner

- PASSED = `Cmd+Enter`
- FAILED = `Cmd+U`
- SKIPPED = `Cmd+I`
- Hotkey hint is always visible in the execution panel.

### NFR-7.2 Navigation shortcuts (global)

- Left sidebar items bound to `Shift+1..9` (Tests, Requirements, Runs, Plans, Steps, Pulse, Imports, Analytics, Branches) — surface-level global chrome.

### NFR-7.3 Screen-reader affordances

- All icon-only buttons carry `aria-describedby` tooltips (Multi-Select, Query Language Editor, Fast Forward, Auto-Track, Create notes, priority filters, etc.). WCAG compliance level not formally attested — out of scope.

### NFR-7.4 Destructive-action copy

- Finish Run uses a native browser `confirm` with wording that **names the pending count** (ac-delta-9 of run-lifecycle) so the user cannot dismiss without reading the impact.
- Archive / Purge / Unarchive / Permanent Delete use app-level modals with cascade wording where applicable.

---

## NFR-8. Security

### NFR-8.1 Shared public links

- **Defaults.** 7-day expiry + passcode **ON** (ac-delta-19 of run-detail-and-report).
- **Rationale.** Safe-by-default — expiry bounds exposure; passcode gates even short-lived leakage.
- **Owner.** Share Publicly dialog.

### NFR-8.2 API token scope

- **Observed.** Reporter CLI (I-2) uses project-scoped API tokens. Scope beyond project (user-level) not surfaced in this feature's UI.

### NFR-8.3 CSRF / session

- **Out of scope.** Platform-level; not surfaced in Manual Run flows.

---

## NFR-9. Internationalisation

- **Observed.** All UI strings are English-only at the time of this capture. No language-switcher surfaces in project context.
- **Impact on this feature.** Confirmation dialog copy (Finish Run pending-count message, cascade-archive wording) is English — tests should expect English substrings.

---

## NFR-10. Observability

### NFR-10.1 Pulse coverage

- **Observed.** Only **"Deleted Run"** events from this feature are emitted to Pulse. No Archive, Purge, Finish, Relaunch events.
- **Gap.** Limits audit for ongoing compliance scenarios. Not a product requirement at this phase.

### NFR-10.2 Client-side error surfacing

- **Observed.** Toasts for success paths (create, archive, pin). Error toast for `"Title can't be blank"` — other failure modes (network drop, server 5xx) were not reproduced during exploration.

---

## Summary — NFR × BR × UC

| NFR | Related BR | Primary UC |
|---|---|---|
| NFR-1.1 (20k cap) | BR-12 | UC-08, UC-12 |
| NFR-2.1 (auto-purge) | BR-12 | UC-12 |
| NFR-2.2 (Unarchive preserves) | BR-8 | UC-12 |
| NFR-2.3 (cascade atomicity) | BR-9 | UC-08, UC-12 |
| NFR-3.1 / 3.2 (child activation) | — | UC-07 |
| NFR-3.4 (Finish idempotency) | BR-7 | UC-04 |
| NFR-4.1 (manager exclusion) | BR-6a | UC-06 |
| NFR-4.2 (readonly gating) | — | UC-10, UC-12 |
| NFR-4.3 (Edit blocked on Finished) | BR-10 | UC-04, UC-06 |
| NFR-6.1 (Launch atomicity) | — | UC-01 |
| NFR-6.2 (terminal finality) | BR-7, BR-8 | UC-04, UC-05, UC-12 |
| NFR-6.3 (cancel preserves) | BR-5 | UC-09 |
| NFR-8.1 (public link defaults) | BR-13 | UC-11 |
