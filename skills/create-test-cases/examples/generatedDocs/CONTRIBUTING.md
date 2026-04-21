---
audience: qa-team, dev-team
feature: manual-tests-execution
last-reviewed: 2026-04-21
owner: "@gololdf1sh"
---

# Contributing to Manual Tests Execution docs

Short operating rules for adding / editing content in `docs/product/manual-tests-execution/`. Keep this page small — conventions, not prose.

## 1. What goes where

| Content type | Location |
|---|---|
| New Use Case | `06-use-cases/UC-NN-short-verb-object.md` (from `templates/use-case-template.md`) |
| New Business Rule | New H2 `## BR-NN:` section inside `07-business-rules.md` (never a separate file) |
| New Architectural Decision | `decisions/ADR-NNN-kebab-title.md` (from `templates/adr-template.md`) — only when the choice is non-obvious and needs justification |
| New top-level chapter | Numeric-prefixed `NN-kebab-title.md` at feature root |
| Cross-cutting term | Entry in `03-glossary.md` (anchor-linkable) |
| Open question / contradiction | Entry in `13-open-questions.md` |

## 2. File naming

- kebab-case everywhere.
- Top-level chapters use a numeric prefix: `01-…`, `02-…`, `05-…`.
- UC files: `UC-NN-short-verb-object.md` (e.g. `UC-01-create-manual-run.md`).
- ADRs: `ADR-NNN-kebab-title.md` (zero-padded 3 digits).

## 3. Frontmatter (every top-level doc)

```yaml
---
audience: qa-team, dev-team
feature: manual-tests-execution
last-reviewed: YYYY-MM-DD
owner: "@gololdf1sh"
---
```

Update `last-reviewed` whenever the doc is revalidated against source ACs.

## 4. Cross-reference pattern

- First mention of a domain term links to glossary:
  `[RunGroup](./03-glossary.md#rungroup)`
- Link to an AC:
  `[AC-23](../../test-cases/manual-tests-execution/_ac-baseline.md#run-lifecycle)` (use the closest section heading anchor)
- Link between UCs:
  `[UC-03](./UC-03-finish-run.md)`
- Link to a BR:
  `[BR-2](./07-business-rules.md#br-2)`

Links are relative — never absolute `/Users/...` paths.

## 5. Mermaid conventions

- Fence with `` ```mermaid ``.
- One diagram per fenced block.
- Use `stateDiagram-v2` for state machines, `sequenceDiagram` for flows, `erDiagram` for the data model.
- Descriptive node IDs (`InProgress`, not `S2`).
- Label transitions with the triggering action (`Launch`, `Finish`, `Archive`, `Purge`, `Unarchive`, `Relaunch`).
- PlantUML is reserved for diagrams Mermaid cannot render. Prefer Mermaid.

## 6. Style

- Short sections beat walls of text. Prefer tables when structure fits.
- Audience is technical — no executive-summary or FAQ layers.
- No QA-internal tags (`@unclear`, `@boundary`, `@needs-project-setting`) at doc-level headings; OK inside traceability tables or explicit open-question entries.
- No screenshots in POC. Mermaid + text only.
- English throughout, regardless of commit-message language.

## 7. How to add a Use Case

1. Copy `templates/use-case-template.md` to `06-use-cases/UC-NN-...md`.
2. Fill scenario from the governing ACs (`_ac-baseline.md` + relevant `*-ac-delta.md`).
3. Under **Business rules referenced**, list BR-IDs. If a referenced BR does not exist yet, add it to `07-business-rules.md` in the same change.
4. Under **Functional requirements covered**, cite AC IDs verbatim (`AC-9`, `ac-delta-11`).
5. Add the UC to the index in `06-use-cases/README.md` and its dependency graph.
6. Regenerate `_generated/traceability-matrix.md` (Phase 1+: `scripts/gen-traceability.ts`).

## 8. How to add a Business Rule

1. Append a new `## BR-NN: Rule name` section in `07-business-rules.md`.
2. Use the format from `templates/business-rule-template.md`.
3. Cite the AC(s) the rule is derived from under **Derived from:**.
4. Update `Referenced by:` in adjacent BRs if the new rule cross-references them.

## 9. Source-of-truth rules

- Behavioral source of truth: `test-cases/manual-tests-execution/_ac-baseline.md` + per-sub `*-ac-delta.md`.
- Test coverage source of truth: `<!-- test ... -->` frontmatter inside per-sub test files.
- Docs are derivative — never contradict the ACs silently. If a contradiction surfaces, add an entry to `13-open-questions.md` and link the conflicting ACs.

## 10. Review cadence

- `last-reviewed` in frontmatter is updated on every verified pass (not on every typo fix).
- After a sub-feature's test-cases batch changes, re-verify the docs that reference it and bump `last-reviewed`.

## 11. Branching

Branch-per-phase discipline (from the execution plan):
- `docs/manual-runs-phase-0` — foundation (this phase).
- `docs/manual-runs-phase-1` — pilot UCs.
- `docs/manual-runs-phase-2` — scale.

Never commit docs directly to `main`. Never push externally without explicit user approval.

> **Note (POC):** this repo currently git-ignores `docs/` for the POC window, so local-only iteration is expected. When the directory is un-ignored, the branch rules above become binding.
