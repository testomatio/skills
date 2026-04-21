---
audience: qa-team, dev-team, integrations
feature: manual-tests-execution
last-reviewed: 2026-04-21
owner: "@gololdf1sh"
---

# 11 — Integrations & External Contracts

External surfaces that a Manual Run touches or is touched by. For each integration: what it is, what crosses the boundary, where it appears in the UI, and which UCs / BRs depend on it. Items flagged **UNCLEAR** point to [13-open-questions.md](./13-open-questions.md).

---

## I-1. CI Profile (Mixed Run — automated leg)

- **What it is.** A server-side record that tells Testomat.io how to trigger an external CI job (GitHub Actions, Jenkins, GitLab, etc.) and where to listen for results.
- **Where configured.** Project → Settings → CI Profiles (out of scope for this feature's docs).
- **Where consumed.** [UC-02 Mixed Run](./06-use-cases/UC-02-create-mixed-run.md) sidebar `Run on CI` picker; referenced from Advanced Relaunch (UC-05 A4 / A5 — Failed-on-CI, All-on-CI).
- **Payload boundaries.**
  - **Testomat → CI** — trigger call carrying at least: `run_id`, `project_id`, test selection (tag / plan / manual flag), environment matrix. **Exact shape is UNCLEAR** ([OQ-02](./13-open-questions.md#oq-02)).
  - **CI → Testomat** — streamed test results via the **@testomatio/reporter** CLI (see I-2) or the public REST API. Results append to the same Run that the trigger created.
- **UI feedback.** The Mixed Run's automated leg appears alongside manual tests on the Runs list and Report after results arrive; no polling indicator is surfaced in the current UI (observed during Playwright walk).
- **Governed by.** [BR-3](./07-business-rules.md#br-3) (Mixed Run without any execution channel — CI Profile or local CLI — orphans the automated portion; exact UI enforcement UNCLEAR, [OQ-02](./13-open-questions.md#oq-02)).
- **Related UCs.** UC-02 main, UC-05 A4 + A5, UC-11 (consolidated report).

---

## I-2. `@testomatio/reporter` CLI (automated leg — local run variant)

- **What it is.** An npm-published reporter package that runs alongside local / CI-launched test suites (Codecept, Playwright, Mocha, Cypress, JUnit XML ingest) and posts results to Testomat.io.
- **Where consumed.**
  - From a Mixed Run launched with `Launch from CLI` (dropdown on Runs list split button) — the user runs `npx @testomatio/reporter` locally.
  - From any CI environment that doesn't use a CI Profile.
- **Configuration.** Typically via env vars: `TESTOMATIO` (API token), `TESTOMATIO_RUN` (existing Run ID to append to), `TESTOMATIO_TITLE`, `TESTOMATIO_ENV`, `TESTOMATIO_RUNGROUP`.
- **Boundary.** Reporter authenticates with a project API token and PATCHes testrun records on the server; arrivals are merged into the target Run via the same path as CI Profile deliveries.
- **UI feedback.** None during stream — reflected by test-count increment on the Runs list row and on the Report as results land.
- **Governed by.** BR-3.
- **Related UCs.** UC-02 main (A1 "Launch from CLI"), UC-11.

---

## I-3. Test Query Language (TQL)

- **What it is.** A Testomat.io-specific DSL for expressing run-level filters, powering both the URL-shareable filter state on the Runs list and the `Save` → Named Query workflow.
- **Editor.** Runs list → `Query Language Editor` modal (§ 3.4 of [10-ui-catalog.md](./10-ui-catalog.md)).
- **Grammar summary (observed).**
  - **Operators.** `and`, `or`, `not`, `==`, `!=`, `<`, `>`, `>=`, `<=`, `in [ … ]`, `%` (wildcard / contains).
  - **Variables (non-exhaustive).** `title`, `plan`, `rungroup`, `env`, `tag`, `label`, `jira`, `duration`, `passed_count`, `failed_count`, `skipped_count`, `automated`, `manual`, `mixed`, `finished`, `unfinished`, `passed`, `failed`, `terminated`, `published`, `private`, `archived`, `unarchived`, `with_defect`, `has_defect`, `has_test`, `has_test_tag`, `has_test_label`, `has_suite`, `has_message`, `has_custom_status`, `has_assigned_to`, `has_retries`, `has_test_duration`, `has_priority`, `created_at`, `updated_at`, `launched_at`, `finished_at`.
  - **Boolean variables** are used as bare tokens (`terminated`, `archived`); string/numeric comparisons use the operator suite above.
- **Examples tab.** The modal ships 3 preset queries; parsing + syntax help is one click away via **Read Docs** → `https://docs.testomat.io/usage/query-language`.
- **Saved Queries.** Persisted per-user; the **Custom view / Default view** toggle has no direct TQL binding — TQL survives the view switch.
- **Related UCs.** UC-10 A4, UC-10 A6 (URL share), UC-12 A10 (Archive filters accept TQL).
- **Owned AC.** ac-delta-15 of runs-list-management.

---

## I-4. Defect / issue trackers (Jira, GitHub, …)

- **What it is.** Bi-directional link between a Testomat.io test result and an external ticket.
- **Where it appears.**
  - Run Detail panel → **Defects** tab (UC-11 A3).
  - Run Report → Defects column + per-test issue list.
  - TQL variable `jira`, `with_defect`, `has_defect`.
- **Linkage mechanism.** Observed as free-text + URL references in the report panes; dedicated dialog behavior for AC-98 (`Defects` affordance on Report header) is **UNCLEAR** ([OQ-04](./13-open-questions.md#oq-04)).
- **Governance.** No BR authored at this phase — integration-layer concern (out of scope for Manual Tests Execution feature docs).
- **Related UCs.** UC-11 A3.

---

## I-5. Pulse (audit feed)

- **What it is.** A project-wide chronological activity stream (left sidebar → `Pulse`).
- **Where it intersects this feature.** Emits a **"Deleted Run"** event after a Permanent Delete from the Runs Archive (AC-81, ac-delta-18 of archive-and-purge). No other Manual Run lifecycle events are surfaced (no "Archived", no "Purged", no "Finished" Pulse entries observed).
- **Boundary.** Read-only for QA; write-side is internal to the server.
- **Related UCs.** UC-12 A12. Governed by [BR-12](./07-business-rules.md#br-12).

---

## I-6. Email delivery (Share Email)

- **What it is.** Transactional email channel used to distribute a Run Report.
- **Where invoked.** Run Report → Extra ▾ → `Share Email` (UC-11 A7).
- **Boundary.** User supplies recipient list + optional message; server renders the Report and dispatches. No in-app delivery status surfaces in the current UI.
- **Governed by.** [BR-13](./07-business-rules.md#br-13) (access rules for shared content).
- **Related UCs.** UC-11 A7.

---

## I-7. Public share links (Share Publicly)

- **What it is.** Signed, optionally passcode-protected URL for unauthenticated read access to a Run Report.
- **Where invoked.** Run Report → Extra ▾ → `Share Publicly` (UC-11 A8).
- **Contract.**
  - **Defaults.** 7-day expiry **ON**, passcode **ON** (ac-delta-19 of run-detail-and-report).
  - **Revocation.** Regenerating or disabling the link invalidates outstanding URLs (observed on toggle).
  - **Scope.** One link per Run. Cross-group / Combined-Report sharing cadence is **UNCLEAR** ([OQ-16](./13-open-questions.md#oq-16)).
- **Governed by.** BR-13.
- **Related UCs.** UC-11 A8.

---

## I-8. Downloadable artefacts

| Artefact | Surface | Notes |
|---|---|---|
| **PDF** | Run Report → Extra ▾ → Export as PDF **or** Runs list row ⋯ → Export as PDF | Server-side render; includes summary + per-test results (UC-11 A6). |
| **XLSX** | Run Report → Extra ▾ → Download XLSX | Flat test rows with status/duration/assignee (UC-11 A5). |
| **Combined Report (PDF/HTML)** | RunGroup detail → Combined Report | Multi-run consolidated view (UC-08 A4), governed by BR-10. |

All three are pull-only (user-initiated). No push/email of artefacts outside I-6.

---

## I-9. Attachments & binaries

- **What it is.** Per-test uploaded files (screenshots, logs) attached during execution.
- **Where invoked.** Manual Runner → test execution panel → attachment slot (UC-03 main + A1 + A3).
- **Boundary.** Uploaded via browser; persisted server-side; rendered inline on the Report test sub-panel.
- **Retention on Purge.** Attachments are **preserved** (UC-12 A4 / [BR-12](./07-business-rules.md#br-12)); only stack traces are dropped. Exact size/retention caps are **UNCLEAR** ([OQ-12](./13-open-questions.md#oq-12)).

---

## I-10. Webhooks / outbound notifications

- **Status.** Not observed as a first-class surface within the Manual Run feature during Phase 1/2 exploration. Webhook configuration lives in Project Settings (out of scope).
- **Flagged as.** Gap for future phase — see [OQ-22](./13-open-questions.md#oq-22) (if present) or raise during Phase 3. No BR authored.

---

## Integration × UC matrix

| Integration | UC-01 | UC-02 | UC-03 | UC-04 | UC-05 | UC-06 | UC-07 | UC-08 | UC-09 | UC-10 | UC-11 | UC-12 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| I-1 CI Profile | | ● | | | ● | | | | | | ● | |
| I-2 Reporter CLI | | ● | | | ● | | | | | | ● | |
| I-3 TQL | | | | | | | | | | ● | | ● |
| I-4 Defects | | | | | | | | | | | ● | |
| I-5 Pulse | | | | | | | | | | | | ● |
| I-6 Email | | | | | | | | | | | ● | |
| I-7 Public share | | | | | | | | | | | ● | |
| I-8 PDF/XLSX | | | | | | | | ● | | ● | ● | |
| I-9 Attachments | | | ● | | | | | | | | ● | ● |

---

## Summary of unresolved integration questions

| OQ | Subject |
|---|---|
| [OQ-02](./13-open-questions.md#oq-02) | Mixed Run BR-3 UI enforcement + exact CI trigger payload |
| [OQ-04](./13-open-questions.md#oq-04) | AC-98 Defects affordance behavior |
| [OQ-12](./13-open-questions.md#oq-12) | Attachment retention / size caps |
| [OQ-16](./13-open-questions.md#oq-16) | Public share on Combined Report / cross-group |
| [OQ-20](./13-open-questions.md#oq-20) | AC-99 Copy Link target format |
