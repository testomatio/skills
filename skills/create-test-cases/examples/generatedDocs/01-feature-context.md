---
audience: qa-team, dev-team
feature: manual-tests-execution
last-reviewed: 2026-04-21
owner: "@gololdf1sh"
---

# 01 — Feature Context

## Goal

**Manual Tests Execution** lets a team run manually-maintained test cases against a product build, record per-test outcomes, and produce reports that feed release decisions. It spans the full lifecycle from creating a Run to archiving and purging it, including variants that mix manual and automated tests and multi-environment orchestration.

The product promise, reduced to one sentence:

> A tester can take a curated set of tests, execute them against a chosen environment (or several), record structured results, and hand off a trustworthy report — without leaving Testomat.io.

## In scope

The POC docs cover ten sub-features (decomposition source: [destructuring.md](../../../test-cases/manual-tests-execution/destructuring.md)):

| # | Sub-feature | One-line purpose |
|---|---|---|
| 1 | **run-creation** | "New Manual Run" dialog — scope modes, fields, Launch/Save/Cancel, validation. |
| 2 | **test-execution-runner** | Manual Runner UI — PASSED/FAILED/SKIPPED, result message, attachments, custom status, step-by-step. |
| 3 | **tester-assignment** | Assigning testers to run / suite / test + Auto-Assign strategies. |
| 4 | **environment-configuration** | Multi-env modal + run modes (One Run / Launch in Sequence / Launch All). |
| 5 | **run-groups** | Creating / managing RunGroups, Combined Report, Copy Group, archive cascade. |
| 6 | **run-lifecycle** | Start → Continue → Finish Run → Relaunch variants + Advanced Relaunch matrix. |
| 7 | **runs-list-management** | Runs Dashboard — filter tabs, row actions, multi-select, Pin, Custom View, TQL. |
| 8 | **run-detail-and-report** | Run Detail + Basic/Extended Report + downloads + sharing + Compare. |
| 9 | **archive-and-purge** | Archive / Unarchive / Purge / retention / Archive pages. |
| 10 | **bulk-status-actions** | Multi-select bulk Result message / Status in the Manual Runner. |

For each sub-feature's owned / not-owned boundaries, cross-cutting concerns (A–H), and recommended execution order, see [destructuring.md § Sub-feature map](../../../test-cases/manual-tests-execution/destructuring.md#sub-feature-map). This document does not re-derive that decomposition; it references it.

## Out of scope (for these docs)

- **Automated-only execution paths** beyond the Manual Runner's Mixed Run surface. CI orchestration internals, reporter library behaviour, and CI integrations are referenced — not documented — and only where they cross into the manual surface (AC-15..18, `run-creation-ac-delta.md`).
- **Settings → Environments** page configuration (site-wide). Consumed by run-creation (AC-44..47), documented there only as a precondition.
- **Project / Workspace / Billing settings** that gate features (Sharing, Require RunGroup, Purge retention) — referenced as preconditions only, not specified end-to-end.
- **Public-docs audience.** No executive summaries, no Support-style FAQ, no user guides.
- **Custom Statuses configuration.** The Runner's *use* of custom statuses is in scope; their *creation* in Settings is not (only referenced as a precondition).
- **TQL grammar full specification.** Referenced as a query surface in #7; grammar lives in [11-integrations.md](./11-integrations.md) at Phase 2.

## Non-goals of this POC (from the execution plan)

- No TL;DR / executive-summary layers — audience is technical.
- No FAQ for Support-style questions.
- No full ADR ceremony — light template only, for non-obvious decisions.
- No attempt to replace public docs at `github.com/testomatio/docs`.
- No screenshots in POC; Mermaid + text only.
- No static-site deploy (MkDocs / Docusaurus / Confluence).

## Decomposition rationale (short)

The ten-sub-feature split in `destructuring.md` optimises for *ownership clarity*, not UI navigation: each sub-feature owns a coherent slice of behaviour that a single UC series can describe without constant cross-references. Cross-cutting concerns (A–H) are the points where sub-features must *coordinate*:

- **A. Multi-environment** — environment-configuration drives, but runs-list-management, run-detail-and-report, and run-lifecycle all have to render grouped results.
- **B. Multi-user assignment** — tester-assignment owns the canonical tests; everyone else consumes pre-assigned state.
- **C. RunGroup membership** — run-groups owns creation, archive cascade cuts into archive-and-purge, list filter cuts into runs-list-management.
- **D. Run-as-checklist** — a one-line creation toggle that cascades into runner UX.
- **E. Custom statuses** — one surface (runner) + two consumers (list filter, report column).
- **F. Filter-applied scope** — a selection-rule constraint shared by runner, Advanced Relaunch, and bulk actions.
- **G. Ongoing vs Finished state** — gates virtually every action; the backbone of the state diagrams.
- **H. Bulk multi-select mode** — a mode, not a feature — two surfaces (Runs list, Runner) with divergent toolbars.

UCs in Phase 1+ will be organised around the sub-feature map, but each will name the cross-cutting concerns it touches so the coordination points stay visible.

## Related documents

- [02-actors-and-permissions.md](./02-actors-and-permissions.md) — who may do what.
- [05-state-diagrams.md](./05-state-diagrams.md) — the state machines this feature operates over.
- [03-glossary.md](./03-glossary.md) — domain vocabulary.
- [destructuring.md](../../../test-cases/manual-tests-execution/destructuring.md) — authoritative decomposition.
- [intake.md](../../../test-cases/manual-tests-execution/intake.md) — depth and source decisions (regression depth; docs + UI sources).
