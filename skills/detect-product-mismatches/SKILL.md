---
name: detect-product-mismatches
description: >-
  Compares what different sources say the product does: code (actual behavior), issue tracker and requirements (intended behavior), user docs (documented behavior), and any other source (test cases, release notes etc.).
  Checks every feature in every source and records mismatches: contradictions and differences, not implemented, unspecified, undocumented.
  Use when the user asks to compare, cross-check, align, validate requirements, specs, wiki, tickets, issues, user docs, or code, codebase against each other, to find mismatches, contradictions, differences, or outdated docs or requirements, or to find what is not implemented, not documented, or not specified.
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Detect product mismatches

Checks each feature in every source and records where the sources disagree.

Output folder:
  - default: `requirements-mismatches/`
  - or given by calling skill or the user
  - all paths are relative inside the output folder

## Modes

`build` (from scratch) or `update` (for changes since the last check).

## Sources

Type, role, scope, and history of each source come from its catalog README (`catalog-features` › Source roles, Sources).

| Source        | Role                  |
| ------------- | --------------------- |
| Code          | Actual                |
| Requirements  | Intended              |
| Issue tracker | Intended              |
| User docs     | Documented            |
| Other         | As its catalog README |

Per feature, what each source says is rewritten as behaviors in one shape ([features.md](references/features.md) › Behaviors), so sources compare line by line:

- Two sources say different things about the same behavior → Differs.
- Another source has a behavior the code lacks → Not implemented. Code is the product: it must do what the other sources say.
- Several intended sources: a feature is specified when any of them has it.
- `History: Yes` (issue tracker by default): the newest issue wins (resolution date, else creation date); older contradicting issues are superseded, not mismatches.

## Steps

```
- [ ] 1. Sources and access
- [ ] 2. Catalogs: create missing, update stale
- [ ] 3. Check each feature (one subagent each)
- [ ] 4. Merge
- [ ] 5. Validate
- [ ] 6. Report
```

Read [references/features.md](references/features.md) and [references/layout.md](references/layout.md) before writing files.

## Rules

- **Read-only on sources.** Never edit issues, pages, or code.
- Catalogs and `features/` change only by running their skills.
- **Report, don't decide.** A mismatch page shows what each source says.
- Compare behaviors, not wording. Same behavior in other words agrees, different values, conditions, roles, labels, or flows differ.
- Write only paths, keys, and URLs that exist in the catalogs, the sources, or the repo. Do not invent them.

## 1. Sources and access

1. List the sources to compare: given by the user, else ask; offer the ones already cataloged.
2. Check access: one real read per source (MCP tool, `gh`, git, URL, file). No access → stop and ask for an MCP connection or an export. A catalog alone is not enough: behaviors are read at the source.

## 2. Catalogs

Every listed source needs a catalog. Create the missing ones, update the stale ones, before any check:

Use `catalog-features` skill to build the catalogs for each source. Use `wiki-from-code` also if **code is the source**.

## 3. Check each feature

Features: every feature from catalogs in this order: code, requirements, user docs, issue tracker, other.

One subagent per feature, in parallel. Each gets: the feature (its feature YAML), the compared sources (name, type, role, scope, history, access, catalog path), the version, the Domain from the catalog READMEs, the source table and rules above, [references/features.md](references/features.md), [references/layout.md](references/layout.md).

Subagent:

1. Per source: finds the feature in the catalog, else searches the source ([features.md](references/features.md) › Find).
2. Reads every matching feature at its links and states its behaviors ([features.md](references/features.md) › Read, Behaviors).
3. Aligns the same behavior across sources.
4. Returns one mismatch per disagreement, with every field of a mismatch page ([layout.md](references/layout.md) › Page).

Subagent writes nothing. Returns: matched catalog features per source (or `not found` + where searched), mismatches, sources silent on the whole feature, open questions, catalog errors.

## 4. Merge

1. Write the mismatch pages subagents returned ([layout.md](references/layout.md) › Page). Same disagreement from several features → one mismatch page, every disagreeing source on it.
2. `update`: remove resolved mismatches.
3. In `mismatches/README.md`, write the mismatches list ([layout.md](references/layout.md) › README).
4. New `sources/` or `mismatches/` → add a link and purpose for it to the root `README.md`.

## 5. Validate

```markdown
Structure
- [ ] Every feature of the compared catalogs was checked, or listed as an open question
- [ ] Mismatches list states compared sources (catalog Date or baseline), version, check date; indexes every page and missing feature

Content
- [ ] Each page has every field of [layout.md](references/layout.md) › Page and one row per compared source; silent sources marked silent with where searched
- [ ] Every behavior on the pages passes the check in [references/features.md](references/features.md)
- [ ] Superseded issues and behaviors of other versions are not mismatches
- [ ] update: resolved pages removed
```

## 6. Report

Where to start. Mismatches by likely cause (Bug, Stale requirement, Stale docs, Decide), highest user impact first. Missing features per source. Catalog errors (→ `catalog-features`; code catalog with `features/` → `wiki-from-code`). Open questions.

## Next actions

- Update a catalog → `catalog-features`; feature pages from code → `wiki-from-code`
- User stories for not-implemented behavior → `write-user-story`
- Review contradicting requirements → `qa-requirement-reviewer`
- Test cases for differing behavior → `qa-write-test-cases`
