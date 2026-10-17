---
name: detect-product-mismatches
description: >-
  Compares what different sources say the product does: code (actual behavior), issue tracker and requirements (intended behavior), user docs (expected behavior), and any other source (test cases, release notes etc.).
  Checks every feature in every source and records mismatches: contradictions and differences, not implemented, unspecified, undocumented.
  Use when the user asks to compare, cross-check, align, validate requirements, specs, wiki, tickets, issues, user docs, or code, codebase against each other, to find mismatches, contradictions, differences, or outdated docs or requirements, or to find what is not implemented, not documented, or not specified.
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Detect product mismatches

Checks each feature in every source and records where the sources disagree.

Every source needs a catalog from `catalog-features` skill (key, title, link); step 2 creates the missing ones. The catalog is for finding a feature; its behaviors are read at the source. Any number of sources.

Output folder: given by the calling skill or the user. Not given → ask; suggest a folder that already holds catalogs (`catalog/`, `sources/`). Paths below are relative to it.
 ,.÷

## Modes
| Mode     | When                                                                     |
| -------- | ------------------------------------------------------------------------ |
| `build`  | No Cross-check section exists, or the user asks to re-check all          |
| `update` | Cross-check section exists: check only what changed since its check date |

## Sources

| Source        | Role     | Silent on a feature → |
| ------------- | -------- | --------------------- |
| Code          | Actual   | Not implemented       |
| Requirements  | Intended | Unspecified           |
| Issue tracker | Intended | Unspecified           |
| User docs     | Expected | Undocumented          |
| Other         | Ask      | Missing in {source}   |

Per feature, each source's items are rewritten as behaviors in one shape ([features.md](references/features.md) › Behaviors), so sources compare line by line:

- Two sources say different things about the same behavior → Differs. Jira: `Customer can save up to 5 cards.` Code: `Customer can save up to 10 cards.`
- Another source has a behavior the code lacks → Not implemented. Code is the product: it must do what the other sources say.
- A source has nothing on the whole feature → silent (table above), only with `Coverage: complete` in its catalog README, only within its scope. A non-code source missing one behavior is not a mismatch: docs and requirements do not repeat every detail.
- Several intended sources: a feature is specified when any of them has it.
- `History: yes` (issue tracker by default): the newest item wins; older contradicting items are superseded, not mismatches.

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

1. List the sources to compare: given by the user, else ask; offer the ones already cataloged (`sources/README.md`; code also `catalog/`). One line per source: name, type, catalog (or `none`).
2. Source with a catalog: type, role, coverage, history, access, scope come from its catalog README. Without one: ask its type, access, and scope in the same message (`catalog-features` takes them).
3. One product version: ask which release (or HEAD). Behaviors of other versions are not mismatches (open issues, future phases, docs for `next`).
4. Check access: one real read per source (MCP tool, `gh`, git, URL, file). No access → stop and ask for an MCP connection or an export. A catalog alone is not enough: behaviors are read at the source.

## 2. Catalogs

Every listed source needs a catalog. Create the missing ones, update the stale ones, before any check:

- Code: `catalog/` (from `wiki-from-code`), when present, is its catalog. Otherwise code is one of the sources below.
- Source without a catalog → run `catalog-features`, output folder `sources/{name}/`; add it to `sources/README.md`.
- Stale catalog (code baseline far behind HEAD, or synced long before the others) → run `catalog-features` on it (`update`). Stale catalogs produce false mismatches.

## 3. Check each feature

Features: every item of the first compared catalog in this order: code, requirements, user docs, issue tracker, other.

`update`: only features whose catalog items were added, removed, or changed since the check date, items changed at the source after it (JQL `updated >=`, page versions, `git log --since`), code changed since the compared baseline, and features of existing cross-check pages.

One subagent per feature, in parallel. Each gets: the feature (title, catalog item), the compared sources (name, type, role, coverage, history, catalog path, access), the version, the Domain from the catalog READMEs, the source table and rules above, [references/features.md](references/features.md), [references/layout.md](references/layout.md).

Subagent:

1. Per source: finds the feature in the catalog, else searches the source ([features.md](references/features.md) › Find).
2. Reads every matching item at its link and states its behaviors ([features.md](references/features.md) › Read, Behaviors).
3. Aligns the same behavior across sources. Code silent → checks the code at and around the feature's catalog paths before calling it missing. Behavior behind an off flag or config is Differs.
4. Writes one mismatch page per disagreement, with `Likely cause` (below).

Subagent returns: matched items per source (or `not found` + where searched), pages written, sources silent on the whole feature, open questions, catalog errors.

Catalog items no subagent matched → features only those sources know → one subagent each, the same way.

Likely cause, from dates read at the source: issue resolved date (else last update), page last version, docs "last updated" (else `git log -1 --format=%cs -- {path}`); code: `git log -1 --format=%cs -- {paths}` for the feature's code paths. The same dates decide the newest item for `History: yes`.

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
- [ ] Every item of the compared catalogs was checked under a feature, or listed as an open question
- [ ] Cross-check section states compared sources (synced date or baseline), version, check date; indexes every page and missing feature

Content
- [ ] Each page has one row per compared source; silent sources marked silent with where searched
- [ ] Every behavior on the pages passes the check in [references/features.md](references/features.md)
- [ ] Superseded items and behaviors of other versions are not mismatches
- [ ] update: resolved pages removed
```

## 6. Report

Where to start. Mismatches by likely cause (Bug, Stale requirement, Stale docs, Decide), highest user impact first. Missing features per source. Catalog errors (→ `catalog-features`). Huge projects: those only.

## Next actions

- Update a catalog → `catalog-features`; feature pages from code → `wiki-from-code`
- User stories for not-implemented behavior → `write-user-story`
- Review contradicting requirements → `qa-requirement-reviewer`
- Test cases for differing behavior → `qa-write-test-cases`
