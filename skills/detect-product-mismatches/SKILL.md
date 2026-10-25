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
  - given by calling skill or the user
  - all paths are relative inside the output folder
  - default: `mismatches/`

> `wiki/mismatches/` is the output of `wiki-from-code`: mismatches inside a single source, the code. Don't use it as the output folder and don't use its results.

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

**Not a mismatch:**

- Same behavior in other words.
- **Silence on a detail.** A coarser source agrees with a finer one unless it contradicts it (`Customer can save a card.` agrees with `Customer can save up to 5 cards.`).
- A behavior only the code has, inside a feature the other sources have.
- Superseded issues; behaviors of another version; content outside a catalog Scope (open issues, drafts, deprecated pages).
- Can't tell (vague behavior, unreadable content) → open question.

## Likely cause

From dates read at the source: issue resolution date (else creation date), page last version, docs "last updated" (else `git log -1 --format=%cs -- {path}`); code: `git log -1 --format=%cs -- {paths}` for the feature's code paths. The same dates decide the newest issue for `History: Yes`.

- Code differs from the newest intended behavior, and nothing newer explains it → Bug.
- Requirement older than the issue or code change that set the current behavior → Stale requirement.
- User docs older than that change → Stale docs.
- Otherwise → Decide (product owner).

## Steps

```
- [ ] 1. Sources and access
- [ ] 2. Catalogs: create missing, update stale
- [ ] 3. Check each feature (one subagent each)
- [ ] 4. Verify (subagents)
- [ ] 5. Merge
- [ ] 6. Validate
- [ ] 7. Report
```

Read [references/features.md](references/features.md) and [references/layout.md](references/layout.md) before writing files.

## Rules

- **Read-only on sources.** Never edit issues, pages, or code.
- Catalogs and `features/` change only by running their skills.
- **Report, don't decide.** A mismatch page shows what each source says; its Solution only suggests a fix.
- Compare behaviors, not wording: different values, conditions, roles, labels, or flows differ.
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
4. Returns one mismatch per disagreement: its kind (Differs or Not implemented) and every section of a mismatch page ([layout.md](references/layout.md) › Page), with code evidence as `path:lines`.

Subagent writes nothing. Returns: matched catalog features per source (or `not found` + where searched), mismatches, sources silent on the whole feature, open questions, catalog errors.

## 4. Verify

One fresh subagent per batch of mismatches, with the same inputs as step 3. It re-reads each mismatch at its Links and returns it as confirmed, corrected, or dropped (with why). Can't confirm → open question.

## 5. Merge

1. Write the confirmed mismatch pages ([layout.md](references/layout.md) › Page). Same disagreement from several features → one mismatch page, every disagreeing source on it.
2. `update`: remove resolved mismatches.
3. In `mismatches/README.md`, write the mismatches list ([layout.md](references/layout.md) › README).
4. New `sources/` or `mismatches/` → add a link and purpose for it to the root `README.md`.

## 6. Validate

```markdown
Structure
- [ ] Every feature of the compared catalogs was checked, or listed as an open question
- [ ] Mismatches list states compared sources (catalog Date or baseline), version, check date; indexes every page and missing feature

Content
- [ ] Each page has every section of [layout.md](references/layout.md) › Page and one row per compared source; silent sources marked silent with where searched
- [ ] Difference opens with a one-sentence summary; each bullet is clear alone: sources, condition, what the user gets; the title doesn't say which side is right
- [ ] Every page was confirmed in Verify; nothing from Not a mismatch is a page
- [ ] Every behavior on the pages passes the check in [references/features.md](references/features.md)
- [ ] update: resolved pages removed
```

## 7. Report

Where to start. Mismatches by highest user impact first. Missing features per source. Catalog errors (→ `catalog-features`; code catalog with `features/` → `wiki-from-code`). Open questions.

## Next actions

- Update a catalog → `catalog-features`; feature pages from code → `wiki-from-code`
- User stories for not-implemented behavior → `write-user-story`
- Review contradicting requirements → `epic-requirement-reviewer`
- Test cases for differing behavior → `qa-write-test-cases`
