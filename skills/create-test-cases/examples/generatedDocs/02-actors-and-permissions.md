---
audience: qa-team, dev-team
feature: manual-tests-execution
last-reviewed: 2026-04-21
owner: "@gololdf1sh"
---

# 02 — Actors and Permissions

This page captures **who can do what** across Manual Tests Execution. Role semantics below are compiled from the AC baseline and sub-feature deltas; rows marked as *unverified* track known ambiguities (AC-100, sub-feature deltas noting `@unclear`). Those will be resolved in Phase 1 via UI verification and migrated out of this doc into [13-open-questions.md](./13-open-questions.md).

## Roles

| Role | Description |
|---|---|
| **Owner** | Highest permission tier on a project; full access to every run-related action and to project-level settings that gate behaviour (Require RunGroup, Purge retention, Sharing). |
| **Manager** | Team manager role. Assigns others and administers runs. **Excluded from random auto-assignment** of tests (see [BR candidate](#manager-auto-assign-exclusion)). |
| **QA Creator** | The role primarily responsible for creating and launching runs. In this POC treated as equivalent to "standard QA user with write access." |
| **Tester** | Executes tests inside a run; records results; may be any user assigned to a run (including the creator). |
| **Readonly** | Project observer; cannot create, mutate, archive, purge, or assign. |

> **Convention.** "Creator" refers to the user who created a specific run (AC-37). Creator is an *assignment* attribute on a run, not a role on the project; any non-readonly user can be a creator.

## Action catalogue

The product surface distils to nine write actions + several read/observe surfaces:

| Action | Definition |
|---|---|
| **Create (Run)** | Fill the New Manual Run dialog and submit Save (not launched yet). |
| **Launch (Run)** | Submit the dialog with Launch — transitions the run to In-Progress. |
| **Finish (Run)** | Transition an in-progress run to Finished via the Finish Run button + confirmation. |
| **Edit (Run)** | Modify an unfinished run's Assign to / Title / Environment / Description / tests. |
| **Relaunch (Run)** | Invoke any Relaunch variant (Basic, Failed-on-CI, All-on-CI, Manually, Advanced, Launch a Copy). |
| **Assign (user → run / suite / test)** | Add or remove testers on the run, on a suite inside the runner, or on tests via Multi-Select. |
| **Bulk Status** | In-runner bulk Result message / status application across selected tests. |
| **Archive / Unarchive** | Move a run or RunGroup to/from the Archive. |
| **Purge** | Compressed irreversible archival; moves the run to Archive with a *Purged* badge. |
| **Permanent delete** | From the Archive — irreversible removal; tracked in Pulse. |

## Role × Action matrix

✓ = permitted · ✗ = not permitted · ? = *unverified — to resolve in Phase 1* (tracked against AC-100 and the sub-feature deltas noting `@unclear`).

| Action | Owner | Manager | QA Creator | Tester | Readonly | Source |
|---|:-:|:-:|:-:|:-:|:-:|---|
| Create a Run | ✓ | ✓ | ✓ | ? | ✗ | AC-1..8, AC-11..12 |
| Launch a Run | ✓ | ✓ | ✓ | ? | ✗ | AC-8, AC-23 |
| Edit an unfinished Run | ✓ | ✓ | ✓ | ? | ✗ | AC-27 |
| Finish a Run | ✓ | ✓ | ✓ | ? | ✗ | AC-25, AC-28 |
| Execute (record result on a test) | ✓ | ✓ | ✓ | ✓ (must be assigned — AC-41) | ✗ | AC-29..36 |
| Relaunch (any variant) | ✓ | ✓ | ✓ | ? | ✗ | AC-58..67 |
| Add/remove testers on a Run | ✓ | ✓ | ✓ | ? | ✗ | AC-38, ac-delta-6, ac-delta-7 |
| Auto-Assign strategy (None / Prefer / Random) | ✓ | ✓ | ✓ | ✗ | ✗ | AC-39, ac-delta-2..5 |
| Assign user to a suite inside Runner | ✓ | ✓ | ✓ | ? | ✗ | AC-42, ac-delta-8 |
| Assign user to a test (Multi-Select) | ✓ | ✓ | ✓ | ? | ✗ | AC-43, ac-delta-9, ac-delta-10 |
| Bulk status action (in Runner) | ✓ | ✓ | ✓ | ✓ (for tests assigned to them) | ✗ | AC-93..95 |
| Archive Run / RunGroup | ✓ | ✓ | ✓ | ✗ | ✗ | AC-75, ac-delta-1, ac-delta-20 |
| Unarchive Run / RunGroup | ✓ | ✓ | ✓ | ✗ | ✗ | AC-56, ac-delta-13..15, ac-delta-20 |
| Purge Run / RunGroup | ✓ | ✓ | ✓ | ✗ | ✗ | AC-57, AC-78, ac-delta-3, ac-delta-20 |
| Configure Purge retention | ✓ | ✓ | ? | ✗ | ✗ | AC-79, ac-delta-8, ac-delta-9 |
| Permanent delete from Archive | ✓ | ✓ | ? | ✗ | ✗ | AC-81, ac-delta-17, ac-delta-18 |
| Share Report (Email / Public) | ✓ | ✓ | ✓ | ? | ? | AC-89..91 (gated also by project Sharing flag) |
| Read Run / Report (basic or extended) | ✓ | ✓ | ✓ | ✓ | ✓ | AC-82..86 |
| Download / Export run | ✓ | ✓ | ✓ | ✓ | ✓ (inferred) | AC-87, AC-88 |

### Notes

- **Create/Launch/Finish/Edit/Assign/Archive/Purge/Relaunch/Bulk status** for Owner/Manager/QA Creator are affirmed by the AC baseline and sub-feature deltas.
- **Tester column** for creation-side actions is marked `?` because the ACs use role-agnostic language ("User can…"); the concrete role-gating for non-creator testers is being verified in Phase 1 per [AC-100](../../../test-cases/manual-tests-execution/_ac-baseline.md) and `ac-delta-20` of `archive-and-purge-ac-delta.md` (which resolves readonly/manager/owner for destructive actions but leaves QA/tester distinctions under `@unclear`).
- **Readonly** cannot perform destructive actions (affirmed by `archive-and-purge-ac-delta.md` ac-delta-20). The read columns assume Readonly can at minimum view reports (to be affirmed in Phase 1).

## Run-level assignment constraint

Independent of project role, a run has its own **assignment** surface:

- **AC-37.** By default only the run creator is assigned to a run.
- **AC-41.** Users must be assigned to the run **before** they can be assigned to individual tests or suites.
- **AC-42 / ac-delta-8.** Suite "Assign to" inside the Runner lists *only* users already assigned to the run.
- **AC-43 / ac-delta-9.** Multi-Select bulk "Assign to" dropdown is also scoped to run-assigned users, and requires OK confirmation ("Are you sure you want to assign …").
- **ac-delta-13.** Individual test reassignment via detail-panel chip applies immediately *without* confirmation (single-user reassign is not destructive).

This is the canonical pattern: **a user is first added to the run; only then does any per-suite or per-test assignment become available to them.**

## Manager auto-assign exclusion

<a id="manager-auto-assign-exclusion"></a>

- **AC-40.** The "Randomly distribute tests between team members" strategy **never** assigns the manager role to any test.
- **ac-delta-11.** If the only assigned user on the run is a manager, random distribution results in an empty ("—") assignee state per test — no tests are auto-assigned and no error is shown.

This will surface as a Business Rule in Phase 1 (candidate: **BR — manager-exclusion-from-random-distribution**).

## Creator-specific semantics

- **ac-delta-1.** The creator's chip in the New Manual Run sidebar shows an `as manager` label and cannot be removed from the creation dialog. (This is a UI affordance referring to the creator's "ownership" of the run — not to project-level Manager role; Phase 1 must verify whether the `as manager` badge is role-derived or creator-derived.) Flagged in [13-open-questions.md](./13-open-questions.md) when that doc opens in Phase 1.

## Unresolved items (to migrate to `13-open-questions.md` in Phase 1)

1. Full Tester-role permission gating for Create / Launch / Finish / Edit / Relaunch / Archive (AC-100).
2. QA Creator vs Manager distinction for Purge-retention configuration, permanent deletion from Archive, and public Sharing (AC-100 + `archive-and-purge-ac-delta.md` ac-delta-20).
3. Readonly read-surface scope — specifically whether Download as Spreadsheet / Export as PDF / Compare Runs are accessible (AC-87, AC-88, AC-92).
4. `ac-delta-1` "as manager" label semantics — creator badge vs project-role derivation.
5. `ac-delta-4` fallback when "Prefer test assignee" strategy encounters a test with no pre-set assignee (unassigned vs creator/manager fallback).
