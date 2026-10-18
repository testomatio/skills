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

Every source needs a features catalog from `catalog-features` (one feature YAML per feature: key, title, links, entry); step 2 creates the missing ones. The catalog is for finding a feature; its behaviors are read at the source. Any number of sources.

Output folder: given by the calling skill or the user. Not given → ask; suggest a folder that already holds catalogs (`features-catalog/`, `sources/`). Paths below are relative to it.

## Modes

| Mode     | When                                                                     |
| -------- | ------------------------------------------------------------------------ |
| `build`  | No Cross-check section exists, or the user asks to re-check all          |
| `update` | Cross-check section exists: check only what changed since its check date |

## Sources

Type, role, scope, and history of each source come from its catalog README (`catalog-features` › Source roles, Sources).

| Source        | Role                  | Silent on a feature → |
| ------------- | --------------------- | --------------------- |
| Code          | Actual                | Not implemented       |
| Requirements  | Intended              | Unspecified           |
| Issue tracker | Intended              | Unspecified           |
| User docs     | Documented            | Undocumented          |
| Other         | As its catalog README | Missing in {source}   |

Per feature, what each source says is rewritten as behaviors in one shape ([features.md](references/features.md) › Behaviors), so sources compare line by line:

- Two sources say different things about the same behavior → Differs. Jira: `Customer can save up to 5 cards.` Code: `Customer can save up to 10 cards.`
- Another source has a behavior the code lacks → Not implemented. Code is the product: it must do what the other sources say.
- A source has nothing on the whole feature → silent (table above), only within its catalog Scope. Not sure the Scope covers the feature → open question, not a mismatch. A non-code source missing one behavior is not a mismatch: docs and requirements do not repeat every detail.
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

- **Read-only on sources and catalogs.** Never edit issues, pages, code, catalogs, `features/`, or `wiki-from-code` mismatch pages. A catalog error goes back to `catalog-features`.
- **Report, don't decide.** A mismatch page shows what each source says.
- Compare behaviors, not wording. Same behavior in other words agrees; a coarse behavior consistent with a detailed one agrees. Different values, conditions, roles, labels, or flows differ.
- Unread is not silence: content that cannot be read (images, restricted pages) gives no mismatch. List it as an open question.
- Write only paths, keys, and URLs that exist in the catalogs, the sources, or the repo.

## 1. Sources and access

1. List the sources to compare: given by the user, else ask; offer the ones already cataloged (`sources/README.md`; code also `features-catalog/`). One line per source: name, type, catalog (or `none`).
2. Source with a catalog: type, role, scope, history, access, date, and domain come from its catalog README. Without one: ask its type and access, scope, and domain in the same message (`catalog-features` › 1. Source and domain takes them).
3. One product version: ask which release (or HEAD). Behaviors of other versions are not mismatches (open issues, future phases, docs for `next`).
4. Check access: one real read per source (MCP tool, `gh`, git, URL, file). No access → stop and ask for an MCP connection or an export. A catalog alone is not enough: behaviors are read at the source.

## 2. Catalogs

Every listed source needs a catalog. Create the missing ones, update the stale ones, before any check:

- Code: `features-catalog/` (from `wiki-from-code`), when present, is its catalog. Otherwise code is one of the sources below.
- Source without a catalog → run `catalog-features` (`build`), output folder `sources/{name}/`; add it to `sources/README.md`.
- Stale catalog (its Date: code baseline far behind HEAD, or long before the other catalogs) → run `catalog-features` on it (`update`). Stale catalogs produce false mismatches.

## 3. Check each feature

Features: every feature of the first compared catalog in this order: code, requirements, user docs, issue tracker, other.

`update`: only features that `catalog-features` (`update`) reports added, changed, or removed since the check date, features changed at the source after it (JQL `updated >=`, page versions, `git log --since`), code changed since the compared baseline, and features of existing cross-check pages.

One subagent per feature, in parallel. Each gets: the feature (its feature YAML), the compared sources (name, type, role, scope, history, access, catalog path), the version, the Domain from the catalog READMEs, the source table and rules above, [references/features.md](references/features.md), [references/layout.md](references/layout.md).

Subagent:

1. Per source: finds the feature in the catalog, else searches the source ([features.md](references/features.md) › Find).
2. Reads every matching feature at its links and states its behaviors ([features.md](references/features.md) › Read, Behaviors).
3. Aligns the same behavior across sources. Code silent → checks the code at and around the feature's catalog links before calling it missing. Behavior behind an off flag or config is Differs.
4. Writes one mismatch page per disagreement, with `Likely cause` (below).

Subagent returns: matched catalog features per source (or `not found` + where searched), pages written, sources silent on the whole feature, open questions, catalog errors.

Catalog features no subagent matched → features only those sources know → one subagent each, the same way.

Likely cause, from dates read at the source: issue resolved date (else last update), page last version, docs "last updated" (else `git log -1 --format=%cs -- {path}`); code: `git log -1 --format=%cs -- {paths}` for the feature's code paths. The same dates decide the newest issue for `History: Yes`.

- Code differs from the newest intended behavior, and nothing newer explains it → Bug.
- Requirement older than the issue or code change that set the current behavior → Stale requirement.
- User docs older than that change → Stale docs.
- Otherwise → Decide (product owner).

## 4. Merge

1. Same disagreement from several features → one mismatch page, every disagreeing source on it.
2. `update`: remove resolved cross-check pages.
3. Write the Cross-check section of `mismatches/README.md` ([layout.md](references/layout.md) › README). New `mismatches/` → add it to the output folder's `README.md`, when there is one.

## 5. Validate

```markdown
Structure
- [ ] Every feature of the compared catalogs was checked, or listed as an open question
- [ ] Cross-check section states compared sources (catalog Date or baseline), version, check date; indexes every page and missing feature

Content
- [ ] Each page has one row per compared source; silent sources marked silent with where searched
- [ ] Every behavior on the pages passes the check in [references/features.md](references/features.md)
- [ ] Superseded issues and behaviors of other versions are not mismatches
- [ ] update: resolved pages removed
```

## 6. Report

Where to start. Mismatches by likely cause (Bug, Stale requirement, Stale docs, Decide), highest user impact first. Missing features per source. Catalog errors (→ `catalog-features`). Huge projects: those only.

## Next actions

- Update a catalog → `catalog-features`; feature pages from code → `wiki-from-code`
- User stories for not-implemented behavior → `write-user-story`
- Review contradicting requirements → `qa-requirement-reviewer`
- Test cases for differing behavior → `qa-write-test-cases`
