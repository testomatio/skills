---
name: requirements-from-expected
description: >-
  Builds product requirements from a source that says what was intended to be built: issue tracker, requirements, user docs, or similar. Or updates them after the source changed.
  Records mismatches inside that source: items that contradict each other.
  Use when the user asks to build or update the requirements/wiki/feature pages from issues, tickets, requirements, specs, PRDs, or user docs.
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Requirements from expected

Requirements of **what the source says the product does**: one page per feature, listing its behaviors, and mismatches between items of the source.

One feature is often described by many items (an epic, its stories and sub-tasks, bugs, later issues that change it). The feature page states its **current state**: every item in scope merged, the newest one winning ([references/merge.md](references/merge.md)).

Output folder: `requirements/expected/{source-name}/`
  - `expected` is a strict name: the requirements are always a `{source-name}` folder inside `requirements/expected/`, never anywhere else
  - `requirements/` is in the repo root, or given by the calling skill or the user; `{source-name}` as `catalog-features` names it, or given the same way
  - all paths are relative inside the output folder

**Mismatch** is a contradiction inside this source: two current items say different things about the same behavior. Mismatches with other sources → `detect-product-mismatches`.

## Modes

| Mode     | When                                                                     |
| -------- | ------------------------------------------------------------------------ |
| `build`  | No `features/` in the output folder, or the user asks to rebuild         |
| `update` | `features/` exists: change only what the source changed since last sync |

`update`: a changed item → rebuild the current state of every feature it touches from all of that feature's items, not only the changed one.

## Steps

```
- [ ] 1. Catalog
- [ ] 2. Indexes
- [ ] 3. Feature pages (one subagent per area)
- [ ] 4. Verify (fresh subagents)
- [ ] 5. Merge
- [ ] 6. Validate
- [ ] 7. Report
```

Read [references/behaviors.md](references/behaviors.md), [references/merge.md](references/merge.md) and [references/layout.md](references/layout.md) before writing files.

## Rules

- **Read-only on the source.** Never edit issues, pages, or documents.
- Behaviors come only from source items in scope (`catalog-features` › Status): built issues, current pages. Never from unresolved issues, drafts, deprecated pages.
- A feature page states the current state, never the history of changes: merge every item of the feature ([merge.md](references/merge.md)).
- `History: Yes` (issue tracker): the newest item wins (resolution date, else last update, else creation date). An older contradicting item is superseded: not a behavior, not a mismatch. Same date → mismatch.
- Write only keys and URLs that exist in the source. Never guess or build them.
- Name areas and features from the product and user's perspective. Domain terms (prefer the user docs' terms), one term per concept across the requirements.

## 1. Catalog

Run `catalog-features` skill on the source: same mode, role Expected, source folder = this output folder. The catalog goes to `features/.catalog/`, the source items to `.source/`.

## 2. Indexes

Write the `features/` indexes before any feature page ([layout.md](references/layout.md)).

## 3. Feature pages

One subagent per area, in parallel (`update`: affected areas only). Each subagent gets: the area, its subareas and catalog features (feature YAMLs), the source items in `.source/`, the source's type and history, the Domain from `features/.catalog/README.md`, the rules above, [references/behaviors.md](references/behaviors.md), [references/merge.md](references/merge.md), [references/layout.md](references/layout.md). `update` also: the area's existing pages and mismatches, and its changed source items.

Subagent, per feature, starting from its catalog links:

1. Collects every item of the feature, reads each one whole, and applies them in date order ([merge.md](references/merge.md)). Fixes the area's catalog when items belong to another feature or features must be merged or split.
2. Writes the feature page ([layout.md](references/layout.md) › Feature page): Description, Behaviors in their current state ([behaviors.md](references/behaviors.md)), each linked to the item that set it; History.
3. Returns one mismatch per contradiction: every section of a mismatch page ([layout.md](references/layout.md) › Mismatch page).

Subagent writes only inside its area, in `features/` and `features/.catalog/`. Anything outside the area → return it.

Subagent returns: files added, changed, and removed; mismatches (`update`: also resolved ones); open questions; catalog errors; terms the Domain lacks.

## 4. Verify

One fresh subagent per batch of features made from two or more items (`update`: changed ones), with the same inputs as step 3. It rebuilds each feature's current state from `.source/` on its own ([merge.md](references/merge.md)), compares it with the page, and fixes the page: missing or extra items, superseded behaviors still listed, changes not applied, wrong links. Returns what it fixed and what it can't decide (→ open question).

## 5. Merge

1. Apply the changes subagents returned outside their areas. Terms the Domain lacks → add to the Domain in `features/.catalog/README.md`.
2. Update every `README.md` in `features/` to list the feature pages that now exist. Write the output `README.md`: source name, scope, date, a link and purpose for each folder (not `.catalog/`), open questions.
3. Write the mismatch pages. Same contradiction from several areas → one page. `update`: remove resolved mismatches.
4. In `mismatches/README.md`, write the mismatches list ([layout.md](references/layout.md)).
5. Add a link and purpose for these requirements to the index `requirements/README.md`, when missing.

## 6. Validate

```markdown
Structure
- [ ] Output folder is `requirements/expected/{source-name}/`
- [ ] Output README.md is a summary and sitemap with source, scope, date
- [ ] Every catalog feature has a feature page; `features/` mirrors the catalog's areas and subareas

Content
- [ ] Every feature page has a Description and at least one behavior under Behaviors; every behavior passes the check in [references/behaviors.md](references/behaviors.md) and links its source items
- [ ] No behavior from an item out of scope or superseded
- [ ] Every feature passes the check in [references/merge.md](references/merge.md): every item in History, one behavior per point, the newest item wins
- [ ] Every item in scope with behaviors is in some feature's History; `.source/README.md` maps it to that feature
- [ ] Every contradiction between current items has a mismatch page
- [ ] update: resolved mismatches removed; nothing left for items gone from scope
```

## 7. Report

Where to start. Results (`update`: features added, changed, removed). Features merged from the most items. Fixes made in Verify. Mismatches, highest user impact first. Catalog errors. Open questions.

## Next actions

- Compare with code and other sources → `detect-product-mismatches`
- Review contradicting requirements → `epic-requirement-reviewer`
- Test cases for a feature → `qa-write-test-cases`
