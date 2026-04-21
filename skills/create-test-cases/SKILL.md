---
name: create-test-cases
description: Create manual test cases as local MD files (does not publish). MUST USE when asked to "create test cases", "cover feature with tests", "write test cases", generate checklist, or expand test coverage. Two-phase flow: feature phase runs once (gathers shared UI + AC baseline + destructuring map), sub-feature phase runs per suite (generates deep-coverage test cases). After generation, user publishes with a separate skill (e.g. `sync-cases`, or the local `/publish-test-cases-batch`).
license: MIT
metadata:
  author: Testomat.io
allowed-tools: Read Grep Glob Write Bash Agent ToolSearch mcp__playwright__* mcp__testomatio__* mcp__github__*
effort: max
---

# CREATE-TEST-CASES SKILL

Creates manual test cases as local MD files. **Does not publish** — publishing is a separate skill (`/publish-test-cases-batch` — local for now, not yet part of this repo; alternatively use [`sync-cases`](../sync-cases/SKILL.md)) invoked after MD is approved.

## Flow at a glance

Main flow on the left, subagents block on the right. The `═══▶` arrows show which step spawns which subagent; the subagent runs in **its own isolated context** and returns a **1-line summary** to the parent conversation.

```
┌──────────────────────────────────────────────────────────────────┐
│  PRE-STEP — Resume Detector                                      │
│  Runs BEFORE every step. Scans disk without reading file bodies. │
│  Derives $RESUME_FROM from 7 states: empty / feature-partial /   │
│  feature-done / sub-feature-partial / sub-feature-ready /        │
│  sub-feature-done / all-features-done.                           │
└──────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────────┐      ╔══════════════════════════════════╗
│  FEATURE PHASE  (ONE conversation — ends with HARD STOP)         │      ║  SUBAGENTS (isolated contexts)   ║
│  Produces shared baselines consumed by every sub-feature.        │      ║                                  ║
│                                                                  │      ║  ┌────────────────────────────┐  ║
│    Step 0  Intake questionnaire (5 questions, one at a time)     │      ║  │ 🧭 ui-explorer             │  ║
│            → intake.md                                           │      ║  │   mode: feature-baseline   │  ║
│                                                                  │      ║  │   — Playwright walkthrough │  ║
│    Step 1  Gather feature data (in parallel)                     │      ║  │   — browser_snapshot ×N    │  ║
│       1.1  UI exploration of the whole feature ══════════════════╪══════╪═▶│   — write _shared-ui.md    │  ║
│            → _shared-ui.md + sub-feature candidates              │      ║  │   ← "Cataloged 8 surfaces" │  ║
│       1.2  Extract ACs from docs (MCP / WebFetch / paste)        │      ║  └────────────────────────────┘  ║
│            → _ac-baseline.md                                     │      ║                                  ║
│       1.3  Existing-steps library (optional)                     │      ║  ┌────────────────────────────┐  ║
│            → _existing-steps.md                                  │      ║  │ 🧭 ui-explorer             │  ║
│       1.4  Destructuring + cross-cutting concerns                │      ║  │   mode: sub-feature-delta  │  ║
│            → destructuring.md                                    │      ║  │   — reads _shared-ui.md    │  ║
│       1.5  Single user-approval gate                ⛔ HARD STOP │      ║  │   — catalog ONLY delta     │  ║
└──────────────────────────────────────────────────────────────────┘      ║  │   — write {S}-ui-delta.md  │  ║
                        │                                                 ║  │   ← "4 delta surfaces"     │  ║
                        ▼   (new conversation per sub-feature)            ║  └────────────────────────────┘  ║
┌──────────────────────────────────────────────────────────────────┐      ║                                  ║
│  SUB-FEATURE PHASE  (ONE conversation per sub-feature, ×N)       │      ║  ┌────────────────────────────┐  ║
│                                                                  │      ║  │ ✅ test-case-reviewer      │  ║
│    Step 2  Thin slice                                            │      ║  │   ONLY if tests ≥ 15       │  ║
│       2.1  AC delta for the sub-feature   → {S}-ac-delta.md      │      ║  │   — 12 Bash gates          │  ║
│       2.2  UI delta                       → {S}-ui-delta.md ═════╪══════╪═▶│   — 11 semantic checks     │  ║
│       2.3  AC↔UI cross-validation         (no file)              │      ║  │   — auto-fix safe items    │  ║
│       2.4  Scope contract + user gate     → {S}-scope.md         │      ║  │   — violations report      │  ║
│                                                                  │      ║  │   ← "Found 4, fixed 3,     │  ║
│    Step 3  Generate                                              │      ║  │      escalated 1"          │  ║
│       Phase 0  Feed cross-cutting concerns from destructuring.md │      ║  └────────────────────────────┘  ║
│       Phase 1  Checklist + flat-vs-nested decision               │      ║                                  ║
│       Phase 2  Full test cases                                   │      ║  ┌────────────────────────────┐  ║
│               (reads _style.md if present)                       │      ║  │ 🔍 ui-validator            │  ║
│       Phase 3a Mechanical checks  ═══════════════════════════════╪══════╪═▶│   — Playwright walkthrough │  ║
│               < 15 tests: inline                                 │      ║  │   — pick 2-3 repr. tests   │  ║
│               ≥ 15 tests: test-case-reviewer subagent            │      ║  │   — verify vs. real UI     │  ║
│       Phase 3b UI reality check  ════════════════════════════════╪══════╪═▶│   — edit MD inline on fix  │  ║
│               (mandatory)                                        │      ║  │   — separate audit log     │  ║
│       Phase 4  Single user-approval gate                         │      ║  │   ← "Walked 3, fixed 2"    │  ║
│                                                                  │      ║  └────────────────────────────┘  ║
│    Step 4  Report + update tracker in destructuring.md           │      ║                                  ║
│            + write _style.md (ONLY on 1st approval) ⛔ HARD STOP │      ║  Principle:                      ║
└──────────────────────────────────────────────────────────────────┘      ║  • parent spawns via Agent()     ║
                        │                                                 ║  • Playwright / heavy dumps      ║
                        ▼   (when ALL sub-features in destructuring.md [x])║    live inside the subagent      ║
┌──────────────────────────────────────────────────────────────────┐      ║  • parent sees 1 summary line    ║
│  HANDOFF                                                         │      ║    — context stays clean         ║
│    /publish-test-cases-batch test-cases/{F}/                     │      ╚══════════════════════════════════╝
│    (separate skill — one branch per sub-feature: tc/{F}/{S})     │
└──────────────────────────────────────────────────────────────────┘
```

> Same diagram lives in [`examples/flow-diagram.md`](examples/flow-diagram.md).

**Argument:** $ARGUMENTS — Testomat suite URL or feature name

**References:** [intake-questionnaire.md](intake-questionnaire.md) | [artifacts.md](references/artifacts.md) | [testing-strategy.md](references/testing-strategy.md) | [test-case-format.md](references/test-case-format.md) | [self-review-checks.md](references/self-review-checks.md) | [product-context.md](references/product-context.md) | [destructuring.md](references/destructuring.md) (feature-phase procedure) | [troubleshooting.md](references/troubleshooting.md)

**Step contract template** — every step file declares this block so you can see at a glance what must exist before, what is produced, and whether it's safe to re-run:
- **Precondition:** artifacts that must exist and validate (refers to IDs in [artifacts.md](references/artifacts.md))
- **Input:** values consumed from earlier artifacts / user
- **Output:** artifacts written (with ID)
- **Postcondition:** invariant that must hold after the step completes
- **Idempotent:** yes / no — can this step be re-run safely?
- **Retry policy:** what to do on transient failure; when to escalate

---

## Hierarchy Model — Feature-First

| Concept | Testomat Entity | Example | Branch |
|---------|----------------|---------|--------|
| **Feature** (main functionality) | Folder | Manual Test Execution | — |
| **Sub-feature** (part of feature) | Suite | Environment Configuration | `tc/{feature}/{suite-slug}` |
| **Sub-feature section** (mandatory when 2+ natural sections of ≥3 tests exist) | Nested suite | CRUD Operations (inside Environment Configuration) | same branch |
| **Test case** | Test | Select custom environment for a run | inside suite branch |

**Feature-first architecture:** heavy gather-info runs ONCE per feature (Step 1 Feature Phase) and produces shared artifacts (`_ac-baseline.md`, `_shared-ui.md`, `_existing-steps.md`, `destructuring.md`). Each sub-feature then runs in its own conversation as a thin slice (Step 2) + generation (Step 3) + report (Step 4). This eliminates the AC/UI duplication that previously happened across sub-features.

**Key rules:**
- **Folder = feature.** One folder per feature. The folder is created at publish time by your publisher of choice (e.g. local `/publish-test-cases-batch`, or [`sync-cases`](../sync-cases/SKILL.md)) — this skill only lays out the local `test-cases/{feature}/` directory.
- **Suite = sub-feature.** Each suite is a self-contained area of the feature with **full, deep coverage** at the depth chosen by Q2. See § Suite Depth Expectation.
- **Nested suites** are used when a sub-feature has multiple logical sections. Full rule: [self-review-checks.md § 8](references/self-review-checks.md#8-sub-suite-distribution).
- **Two-phase flow (always):** the feature phase (Step 1) runs once and HARD STOPs. Each sub-feature then runs the sub-feature phase (Steps 2-4) in a separate conversation. There is no "single-suite mode" — even a feature with one sub-feature runs the feature phase first, because the `_shared-ui.md` and `_ac-baseline.md` artifacts carry value even for a single suite.
- **MD only — publishing is a separate skill.** This skill never pushes to Testomat. After Step 4 the user runs the publisher (local `/publish-test-cases-batch` — not yet part of this repo; or [`sync-cases`](../sync-cases/SKILL.md)) with the saved path.
- **Whole-feature publish:** when all sub-feature checkboxes in `destructuring.md` flip to `[x]`, the user runs `/publish-test-cases-batch test-cases/{feature}/` (or equivalent) to push everything (one branch per suite: `tc/{feature}/{suite-slug}`).
- **Style carryover.** After the FIRST sub-feature is approved, Step 4 writes `test-cases/{F}/_style.md`. Subsequent sub-features read it FIRST in Step 3 Phase 2 so the whole feature stays stylistically consistent. See [references/artifacts.md § A-style](references/artifacts.md).

### Sub-suite Distribution Rule

Applied at end of Phase 1 Grouping pass — fully automatic, no user prompt. **Full rule, matrix, anti-patterns, and "what counts as a natural section":** [self-review-checks.md § 8](references/self-review-checks.md#8-sub-suite-distribution) (single source of truth).

Short version: if **≥ 2 natural sections of ≥ 3 tests each** exist (after auto-merging undersized sections) → MUST be nested (directory of MD files). Otherwise flat. Total test count is not part of the decision.

### Suite Depth Expectation

Each sub-feature must receive full, deep coverage — not a thin slice. The feature phase (Step 1) provides `_ac-baseline.md` and `_shared-ui.md`. Each sub-feature phase adds its AC delta (Step 2.1), UI delta (Step 2.2), and generates tests (Step 3) that satisfy:

- **AC coverage:** every AC in the combined pool — baseline ACs applicable to this sub-feature ∪ delta ACs — has ≥ 1 test citing it via `source:` (Gate 1, blocking)
- **Cross-cutting coverage:** every concern in destructuring.md that affects this sub-feature has ≥ 1 dedicated test (Gate 1b, blocking)
- **UI element coverage:** ≥ 80% cataloged elements (across shared + delta) appear in action steps (not only preconditions)
- **Scenario balance:** negative ≥ 20%, boundary ≥ 10%, happy ≤ 50% — thresholds are **shapes**, not quotas
- **Q2 shape:** smoke = happy paths only; balanced = + negatives + key edges; regression = + boundaries + state transitions + role combos

**Test count is driven by coverage, not by a range.** Do NOT pad to hit a number. Do NOT cap to stay under a number. If a balanced sub-feature naturally produces 8 tests or 40 tests — both are correct as long as the points above are satisfied. Q2 picks the **shape** of coverage, not the size.

---

## Checklist & Dispatch Table

Every step lives in its own file under `steps/`. SKILL.md is a router: Resume Detector below determines the entry point; then load the step file for the current step only.

| # | Step | File | Key output | Phase |
|---|---|---|---|---|
| ☐ | **Resume Detector** (below) | this file | `$RESUME_FROM` step pointer | — |
| 0 | Intake Questionnaire | [steps/00-intake.md](steps/00-intake.md) | A1 intake.md | feature |
| 1 | Feature Phase (heavy gather once) | [steps/01-feature-phase.md](steps/01-feature-phase.md) | A-shared-ui + A-base + A-steps + A2 | feature |
| 2 | Sub-feature Slice (thin) | [steps/10-sub-feature-slice.md](steps/10-sub-feature-slice.md) | A3 + A4 + A5 | sub-feature |
| 3 | Generate & Approve Test Cases | [steps/20-generate.md](steps/20-generate.md) | A6 test-cases.md | sub-feature |
| 4 | Final Report & Handoff | [steps/40-report.md](steps/40-report.md) | report printed; A2 progress updated; A-style captured on first approval; publish handoff | sub-feature |

**HARD STOPs:** Step 1 ends with HARD STOP (feature phase → new conversation for first sub-feature). Step 4 ends with HARD STOP (sub-feature done → new conversation for next sub-feature).

**Publishing is NOT part of this skill.** After Step 4, run your publisher — local `/publish-test-cases-batch {path}` (separate skill — not yet part of this repo) or [`sync-cases`](../sync-cases/SKILL.md).

**Loading rule:** Read only the step file for the step you're currently executing, plus any referenced `references/*.md` files needed by its contract. Do NOT eagerly Read all step files at start of run.

**Section-map loading (mandatory for large refs):** `references/testing-strategy.md`, `references/self-review-checks.md`, and `references/artifacts.md` each begin with a `## Section map` table listing the **START/END anchor patterns** (regex) for every section. When you need ONE section (e.g. "§ 2.3 balance thresholds" or "Gate 11"):

```bash
awk '/^START_PATTERN/,/^END_PATTERN/' path/to/ref.md
```

Copy the two patterns from the section map, paste into the awk one-liner, run via Bash. This is the primary context-window savings in Step 2. **Never Read the whole file** when one section is enough. Anchors are immune to line-number drift — the section map stays valid as long as section headers keep their text.

---

## Pre-step: Resume Detector

Runs BEFORE Step 0 on every invocation. Single authoritative check replacing scattered "if exists skip" mentions elsewhere.

### Contract
- **Precondition:** none
- **Input:** `$ARGUMENTS` (feature and optionally sub-feature); current working directory has `test-cases/` root
- **Output:** detector table printed to user; `$RESUME_FROM` step pointer in working memory
- **Postcondition:** user has seen which artifacts exist + chosen resume / restart / change path
- **Idempotent:** yes — pure read-only probe
- **Retry policy:** none — read errors bubble up as "artifact unreadable"

### Procedure

1. Derive `F` (feature-slug) and, if known from $ARGUMENTS, `S` (suite-slug from destructuring map)
2. Run the cheap validation commands from [artifacts.md](references/artifacts.md) for each artifact. **Do NOT Read the bodies** — only `head -20` or grep-based checks
3. Compute state via this decision tree (top-down, first match wins):

| State | Trigger | Route |
|---|---|---|
| `empty` | A1 missing | Step 0 intake |
| `feature-partial` | A1 valid but any of A-shared-ui / A-base / A2 missing or invalid | Step 1 (feature phase) — resume at first missing substep |
| `feature-done, no sub-feature picked` | All feature artifacts valid, no `S` given and no unchecked sub-feature selected | Ask user which sub-feature to start (show map) |
| `feature-done, all sub-features [x]` | A2 has all rows `[x]` | Suggest `/publish-test-cases-batch test-cases/{F}/` |
| `sub-feature-partial` | `S` resolved; some of A3 / A4 / A5 missing or invalid | Step 2 — resume at first missing substep |
| `sub-feature-ready` | A3-A5 valid, A6 missing | Step 3 (generate) |
| `sub-feature-done` | A6 exists and valid | Ask: regenerate / next sub-feature / stop |

4. Emit a **two-section** table to the user — feature-level + sub-feature-level:

```
Resume Detector — test-cases/{F} (sub-feature: {S or "—"})

Feature level:
| Artifact                  | Exists | Valid |
|---------------------------|--------|-------|
| A1 intake.md              |   Y    |   Y   |
| A-shared-ui _shared-ui.md |   Y    |   Y   |
| A-base _ac-baseline.md    |   Y    |   Y   |
| A-steps _existing-steps.md|   Y    |   Y   |
| A2 destructuring.md       |   Y    |   Y   |
| A-style _style.md         |   -    |   -   |

Sub-feature level (S={S}):
| Artifact              | Exists | Valid |
|-----------------------|--------|-------|
| A3 {S}-ac-delta.md    |   Y    |   Y   |
| A4 {S}-ui-delta.md    |   Y    |   Y   |
| A5 {S}-scope.md       |   Y    |   Y   |
| A6 {S}-test-cases.md  |   N    |   -   |
| A7 {S}-review.md      |   -    |   -   |

Suggested resume point: Step 3 (generate)
  • feature + sub-feature slice complete — A6 missing
```

5. Ask user (one line):
```
[Y] Resume from Step {N}   [R] Restart from Step 0   [P] Pick a different sub-feature   [B] Abort
```

6. Route:
   - `Y` → Read the step file for Step {N} and continue
   - `R` → DANGEROUS. Ask user what scope of reset:
     - `sub-feature` → delete A3-A7 under `test-cases/{F}/` for the current `S` only (keeps feature artifacts)
     - `feature` → delete everything under `test-cases/{F}/` (asks explicit confirmation naming the path)
     Only run `rm` after explicit confirmation.
   - `P` → ask which sub-feature from A2 map, set new `S`, re-run detector
   - `B` → exit skill

**Auto-advance rule:** if feature is complete, `S` is unambiguously determined (argument matches a sub-feature in A2), and sub-feature-ready state applies → skip confirmation prompt and auto-resume at Step 3. Log: `Auto-resumed at Step 3 — baselines + delta + scope present.`

---

## Error Handling

On any error (Playwright, push, MCP, partial run resume, blocking conditions) → see [troubleshooting.md](references/troubleshooting.md). It consolidates recoverable/blocking error matrix + Playwright browser traps + nested-suite parser gotchas. Load on demand, not eagerly.
