---
name: wiki-cross-check
description: >-
  Compares what different sources say the product does: code (actual behavior), issue tracker and requirements (intended behavior), user docs (user expected behavior), and any other synced source (test cases, release notes etc.).
  Maps every source onto one feature map and records gaps: differs between sources, not implemented, unspecified, undocumented.
  Use when the user asks to compare, cross-check, align, validate requirements, specs, wiki, tickets, issues, user docs, or code, codebase against each other, to find mismatches, contradictions, or outdated docs or requirements, or to find what is not implemented, not documented, or not specified.
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Wiki cross-check

Lines up every source's claims about the product and records each disagreement as a gap.

Reads local catalogs only, built by `catalog-features`: code in `catalog/`, every other source in `sources/{name}/`. Any two or more sources work, with or without code.

## Sources

| Source        | Catalog           | Role     | Coverage                          | History | Silent where it should speak →                 |
| ------------- | ----------------- | -------- | --------------------------------- | ------- | ---------------------------------------------- |
| Code          | `catalog/`        | Actual   | Complete                          | No      | Not implemented (per claim, gap page)          |
| Requirements  | `sources/{name}/` | Intended | Complete within scope             | No      | Unspecified (per feature, README list)         |
| Issue tracker | `sources/{name}/` | Intended | Partial                           | Yes     | Unspecified (per feature, README list)         |
| User docs     | `sources/{name}/` | Expected | Complete for user-facing features | No      | Undocumented (per feature, README list)        |
| Other         | `sources/{name}/` | Ask      | Ask                               | Ask     | Missing in {source} (per feature, README list) |

- Role, coverage, and history: defaults above; ask only when a source's convention differs (e.g. Jira used as the full spec → coverage complete). Record them per source in `cross-check/README.md`.
- Code must hold every intended and expected claim.
- Non-code sources must speak only when their coverage is complete, only at feature level, and only for features inside their scope. Silence on a detail is not a gap.
- Several intended sources: a feature is specified when any of them has an item for it.
- History yes: the newest item wins; older contradicting items are superseded, not gaps.

Default root: `wiki/` (or the user’s path).

**`update`**: `cross-check/` exists and a catalog changed since its check date (catalog date, code baseline) → re-compare only what changed.

## Steps

```
- [ ] 1. Sources
- [ ] 2. Areas and item assignment
- [ ] 3. Compare each area (one subagent each)
- [ ] 4. Cross-area: unmatched, duplicates, coverage
- [ ] 5. Validate
- [ ] 6. Report
```

Read [references/layout.md](references/layout.md) before writing files.

## Rules

- **Never edit catalogs or the code wiki**: `sources/` and `catalog/` change only through `catalog-features`; `capabilities/` and `mismatches/` never. A catalog error goes in the report (→ re-sync).
- **Report, don't decide.** A gap shows what each source says; `Likely cause` is a hint, not a verdict.
- Compare claims, not wording. Same behavior in other words agrees; a coarse claim consistent with a detailed one agrees. Different values, conditions, roles, or labels differ.
- `unread` is not silence: no Missing gap for a source whose item holds the behavior in `unread`. List it as an open question.
- Write only paths, keys, and URLs that exist in the catalogs or the repo.

## 1. Sources

1. List catalogs: `wiki/sources/README.md` and `wiki/catalog/`. Ask the user which to compare, unless given.
2. A wanted source has no catalog → run `catalog-features` with output folder `wiki/sources/{name}/` (code: `wiki/catalog/`). `{name}`: kebab-case system name (`jira`, `confluence`, `user-docs`), with a suffix when two sources share a system (`confluence-prd`). Non-code: list it in `wiki/sources/README.md` (link, type, date). Add any new root folder to `wiki/README.md` (create if missing).
3. Freshness: code baseline (`catalog/README.md`) far behind HEAD, or one catalog dated long before the others → suggest a re-sync first. Stale catalogs produce false gaps.
4. One product version: ask which release (or HEAD) to compare. Claims about other versions are not gaps (open issues, future phases, docs for `next`).

## 2. Areas and item assignment

Areas are the shared axis. Take them from the first source available, in this order: code catalog, requirements tree, docs nav, tracker epics. `update`: keep existing area names.

Main agent assigns every item of every compared catalog to an area (or several) by `refs`, group, title, and catalog terms. Items that fit no area go on the unmatched list (step 4).

`update`: assign only items added, changed (`updated` after the last check), or removed since the last check.

## 3. Compare each area

One subagent per area (`update`: affected areas only). Each gets: the area, its items from every source (read-only), the source table and rules above, [references/layout.md](references/layout.md).

Subagent:

1. Writes the area map: features (backbone names first, then features only other sources know), aliases, items of each feature.
2. Per feature, aligns claims about the same behavior across sources.
3. Code silent in the catalog → check the feature's `sources` before calling it missing. Behavior behind an off flag or config is a Differs claim.
4. Writes one gap page per disagreement, with `Likely cause` (below).

Subagent returns: map path, gap pages, unmatched items, open questions (vague or unread claims), catalog errors.

Likely cause, from dates (item `updated` / `resolved`):

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
- [ ] cross-check/README.md states compared catalogs (role, coverage, history, date or baseline), version, check date; coverage; every gap indexed by kind
- [ ] Every item of the compared catalogs is in a map or listed as an open question
- [ ] Every path in maps and gap pages exists
- [ ] capabilities/ and mismatches/ unchanged; sources/ and catalog/ changed only by catalog-features
- [ ] No invented paths, keys, or URLs

Content
- [ ] Each gap page has one row per compared source; silent sources marked silent
- [ ] Superseded items and claims about other versions are not gaps
- [ ] update: resolved gaps removed
```

## 6. Report

Where to start. Gaps by likely cause (Bug, Stale requirement, Stale docs, Decide), highest user impact first. Coverage holes. Catalog errors (→ re-sync). Huge projects: those only.

## Next actions

- Re-sync a source → `catalog-features`; update the code wiki → `wiki-from-code`
- User stories for not-implemented behavior → `write-user-story`
- Review contradicting requirements → `qa-requirement-reviewer`
- Test cases for differing behavior → `qa-write-test-cases`
