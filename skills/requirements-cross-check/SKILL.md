---
name: requirements-cross-check
description: >-
  Compares what different sources say the product does: code (actual behavior), issue tracker and requirements (intended behavior), user docs (user expected behavior), and any other synced source (test cases, release notes etc.).
  Maps every source onto one feature map and records gaps: differs between sources, not implemented, unspecified, undocumented.
  Use when the user asks to compare, cross-check, align, validate requirements, specs, wiki, tickets, issues, user docs, or code, codebase against each other, to find mismatches, contradictions, or outdated docs or requirements, or to find what is not implemented, not documented, or not specified.
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Requirements cross-check

Lines up every source's claims about the product and records each disagreement as a gap.

Works from local snapshots: code from `wiki-from-code`, every other source as a catalog from `catalog-features`. Catalogs hold only key, title, and link; item content and dates are read at the source through that link. Any two or more sources work, with or without code.

## Sources

| Source        | Snapshot                                             | Role              | Silent where it should speak →                 |
| ------------- | ---------------------------------------------------- | ----------------- | ---------------------------------------------- |
| Code          | `catalog/`, `capabilities/` (`wiki-from-code` skill) | Actual            | Not implemented (per claim, gap page)          |
| Requirements  | `sources/{name}/`                                    | Intended          | Unspecified (per feature, README list)         |
| Issue tracker | `sources/{name}/`                                    | Intended          | Unspecified (per feature, README list)         |
| User docs     | `sources/{name}/`                                    | Expected          | Undocumented (per feature, README list)        |
| Other         | `sources/{name}/`                                    | content-dependent | Missing in {source} (per feature, README list) |

- Code must hold every intended and expected claim.
- Non-code sources must speak only when their catalog README says `Coverage: complete`, only at feature level, and only for features inside their scope. Silence on a detail is not a gap.
- Several intended sources: a feature is specified when any of them has an item for it.
- `History: yes` (issue tracker by default): the newest item wins; older contradicting items are superseded, not gaps.

Default root: `wiki/` (or the user’s path).

**Update**: `cross-check/` exists → re-compare only what changed since its check date: catalog items added or removed, items changed at the source, code changed since the compared baseline.

## Steps

```
- [ ] 1. Sources
- [ ] 2. Areas and item assignment
- [ ] 3. Compare each area (one subagent each)
- [ ] 4. Cross-area: unmatched, duplicates, coverage
- [ ] 5. Validate
- [ ] 6. Report
```

Read [references/layout.md](references/layout.md) and [references/behaviors.md](references/behaviors.md) before writing files.

## Rules

- **Never edit snapshots**: catalogs (`catalog/`, `sources/{name}/`), `capabilities/`, `mismatches/`. A snapshot error goes in the report (→ re-sync).
- **Report, don't decide.** A gap shows what each source says; `Likely cause` is a hint, not a verdict.
- Compare claims, not wording. Same behavior in other words agrees; a coarse claim consistent with a detailed one agrees. Different values, conditions, roles, or labels differ.
- Catalogs hold only key, title, and link: read each item at its link and state its behaviors as [references/behaviors.md](references/behaviors.md) describes.
- Unread is not silence: content that cannot be read (images, restricted pages) gives no Missing gap. List it as an open question.
- Write only paths, keys, and URLs that exist in the snapshots, the sources, or the repo.

## 1. Sources

1. List snapshots: `wiki/sources/README.md` and `wiki/catalog/`. Ask the user which to compare, unless given. A wanted source has no catalog → run `catalog-features` with output folder `wiki/sources/{name}/` and add it to `wiki/sources/README.md` (code: run `wiki-from-code`) first.
2. Freshness: code baseline (`wiki/README.md`) far behind HEAD, or one snapshot synced long before the others → suggest an update first. Stale snapshots produce false gaps.
3. One product version: ask which release (or HEAD) to compare. Claims about other versions are not gaps (open issues, future phases, docs for `next`).

## 2. Areas and item assignment

Areas are the shared axis. Take them from the first source available, in this order: code catalog, requirements tree, docs nav, tracker epics. `update`: keep existing area names.

Main agent assigns every item of every compared snapshot to an area (or several) by group and title; unsure → read the item at its link (links to other sources there help). Items that fit no area go on the unmatched list (step 4).

`update`: assign only items added to or removed from the catalogs since the last check, items changed at the source after it (query by date where the source allows: JQL `updated >=`, page versions, `git log`), and code features whose feature YAML `sources` changed since the compared baseline.

## 3. Compare each area

One subagent per area (`update`: affected areas only). Each gets: the area, its items from every source (read-only), the source table and rules above, [references/layout.md](references/layout.md), [references/behaviors.md](references/behaviors.md).

Subagent:

1. Writes the area map: features (backbone names first, then features only other sources know), aliases, items of each feature.
2. Per feature, reads its items at their links, states their behaviors, and aligns claims about the same behavior across sources.
3. Code silent → check the code at the feature's catalog paths before calling it missing. Behavior behind an off flag or config is a Differs claim.
4. Writes one gap page per disagreement, with `Likely cause` (below).

Subagent returns: map path, gap pages, unmatched items, open questions (vague or unread claims), snapshot errors.

Likely cause, from dates read at the source: issue resolved date (else last update), page last version, docs "last updated" (else `git log -1 --format=%cs -- {path}`); code: `git log -1 --format=%cs -- {sources}` from the feature YAML. The same dates decide the newest item for `History: yes`.

- Code differs from the newest intended claim, and nothing newer explains it → Bug.
- Requirement older than the issue or code change that set the current behavior → Stale requirement.
- User docs older than that change → Stale docs.
- Otherwise → Decide (product owner).

## 4. Cross-area

1. **Unmatched items.** Search the other areas' maps and, with code in scope, the whole code. Found → add to that map and compare. Not found → new feature in the closest area's map (or a new area) and its gap: Not implemented with code in scope, else Missing in the silent sources.
2. **Duplicates.** Same disagreement from several areas or sources → one gap page per behavior, every disagreeing source on it.
3. **Coverage.** Features per area × source; silent sources by the source table.
4. Write `cross-check/README.md`. Add `cross-check/` to `wiki/README.md`.

## 5. Validate

```markdown
Structure
- [ ] cross-check/README.md states compared snapshots (synced date or baseline), version, check date; coverage; every gap indexed by kind
- [ ] Every item of the compared snapshots is in a map or listed as an open question
- [ ] Every path in maps and gap pages exists
- [ ] Catalogs, capabilities/, mismatches/ unchanged
- [ ] No invented paths, keys, or URLs

Content
- [ ] Each gap page has one row per compared source; silent sources marked silent
- [ ] Every claim on gap pages passes the check in [references/behaviors.md](references/behaviors.md)
- [ ] Superseded items and claims about other versions are not gaps
- [ ] update: resolved gaps removed
```

## 6. Report

Where to start. Gaps by likely cause (Bug, Stale requirement, Stale docs, Decide), highest user impact first. Coverage holes. Snapshot errors (→ re-sync). Huge projects: those only.

## Next actions

- Re-sync a source → `catalog-features`; update the code wiki → `wiki-from-code`
- User stories for not-implemented behavior → `write-user-story`
- Review contradicting requirements → `qa-requirement-reviewer`
- Test cases for differing behavior → `qa-write-test-cases`
