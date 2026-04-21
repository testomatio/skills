---
audience: qa-team, dev-team
feature: manual-tests-execution
last-reviewed: 2026-04-21
owner: "@gololdf1sh"
---

# Manual Tests Execution — internal docs

Internal BA-style documentation for Testomat.io's **Manual Tests Execution** feature. Single source of truth for QA + Dev covering feature context, actors, state, use cases, business rules, and invariants — not just *what to test*, but *what the product must do and why*.

> **Audience:** QA + Dev only. Not for Support / PM / CTO in this POC.
> **Language:** English throughout.
> **Status:** Phase 2 (Scale) — drafted. UC-01..UC-12 + BR-1..BR-13 authored; cross-cutting artefacts (`04-data-model`, `08-functional-requirements`, `09-process-flows`, `10-ui-catalog`, `11-integrations`, `12-non-functional`) complete; traceability regenerated. Awaiting Phase 2 review gate.

## Feature scope at a glance

- **Entry point under test:** https://app.testomat.io/projects/project-for-testing/runs/new
- **Covers 10 sub-features:** run-creation, test-execution-runner, tester-assignment, environment-configuration, run-groups, run-lifecycle, runs-list-management, run-detail-and-report, archive-and-purge, bulk-status-actions.
- **Full sub-feature map:** see [destructuring.md](../../../test-cases/manual-tests-execution/destructuring.md).

## QA — start here

Read in this order:

1. [01-feature-context.md](./01-feature-context.md) — what the feature is and what's out of scope.
2. [02-actors-and-permissions.md](./02-actors-and-permissions.md) — role × action matrix (who can Launch, Finish, Archive, Purge, Assign…).
3. [05-state-diagrams.md](./05-state-diagrams.md) — Run / RunGroup / Test-in-Run state transitions.
4. [03-glossary.md](./03-glossary.md) — domain vocabulary.
5. **Phase 1+:** [07-business-rules.md](./07-business-rules.md) — invariants you should use as an edge-case generator during exploratory testing.
6. **Phase 1+:** [13-open-questions.md](./13-open-questions.md) — every `@unclear` and behavioural ambiguity tracked in one place.
7. **Phase 1+:** [_generated/traceability-matrix.md](./_generated/traceability-matrix.md) — AC → UC → Test mapping. Answers "which tests cover BR-N?"

## Dev — start here

Read in this order:

1. [01-feature-context.md](./01-feature-context.md) — business goal + decomposition reasoning.
2. [05-state-diagrams.md](./05-state-diagrams.md) — state machines you'll be implementing guards against.
3. **Phase 2:** [04-data-model.md](./04-data-model.md) — ER diagram of Run / RunGroup / Test / Tester / Environment / Plan / Label / CustomStatus.
4. **Phase 1+:** [06-use-cases/README.md](./06-use-cases/README.md) — UC index + dependency graph.
5. **Phase 1+:** [07-business-rules.md](./07-business-rules.md) — invariants the UI must enforce.
6. **Phase 2:** [09-process-flows.md](./09-process-flows.md) — sequence diagrams for Launch → Execute → Finish → Relaunch, Archive cascade, Multi-env Launch-in-Sequence.
7. **Phase 2:** [11-integrations.md](./11-integrations.md) — CI Profile payload, `@testomatio/reporter` CLI, TQL grammar.
8. [decisions/](./decisions/) — ADRs for non-obvious design decisions.

## Directory map

```
docs/product/manual-tests-execution/
├── README.md                          # this file
├── CONTRIBUTING.md                    # how to add UC/BR/ADR + mermaid conventions
├── 01-feature-context.md              # goal, scope, out-of-scope
├── 02-actors-and-permissions.md       # role × action matrix
├── 03-glossary.md                     # domain terms with AC anchor refs
├── 04-data-model.md                   # ER diagram + entity cards       [Phase 2]
├── 05-state-diagrams.md               # Run / RunGroup / Test states
├── 06-use-cases/                                                         [Phase 1+]
│   ├── README.md                      # UC index + dependency graph
│   └── UC-NN-*.md
├── 07-business-rules.md               # BR-N invariants                  [Phase 1+]
├── 08-functional-requirements.md      # FRs regrouped from ACs           [Phase 2]
├── 09-process-flows.md                # sequence diagrams                [Phase 2]
├── 10-ui-catalog.md                   # navigation + purpose map         [Phase 2]
├── 11-integrations.md                 # CI Profile, CLI reporter, TQL    [Phase 2]
├── 12-non-functional.md               # limits, retention, permissions   [Phase 2]
├── 13-open-questions.md               # compiled from @unclear + review  [Phase 1]
├── decisions/                         # ADR-light
├── _generated/traceability-matrix.md  # FR ↔ UC ↔ Test (auto)            [Phase 1]
├── scripts/gen-traceability.ts        # parser + generator               [Phase 1]
└── templates/
    ├── use-case-template.md
    ├── business-rule-template.md
    └── adr-template.md
```

## Source materials (authoritative behaviour spec)

Docs in this tree never duplicate the source materials — they reference them:

- [_ac-baseline.md](../../../test-cases/manual-tests-execution/_ac-baseline.md) — 100 baseline ACs.
- [destructuring.md](../../../test-cases/manual-tests-execution/destructuring.md) — 10 sub-features + cross-cutting concerns A–H.
- [_shared-ui.md](../../../test-cases/manual-tests-execution/_shared-ui.md) + per-sub `*-ui-delta.md` — UI element catalogs.
- [_feature-review.md](../../../test-cases/manual-tests-execution/_feature-review.md) — cross-sub audit (source for open questions).
- Per-sub `*-ac-delta.md` — 171 additional sub-feature-specific ACs.
- Per-sub test files under `test-cases/manual-tests-execution/*/` — 361 tests with `<!-- test ... -->` frontmatter.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for file conventions, Mermaid style, and how to add a UC / BR / ADR.
