---
name: wiki-from-code
description: >-
  Builds a product wiki from the application source code or updates it after large code changes (release, refactor, many merged PRs), on top of the code catalog from `catalog-features`.
  Records mismatches between code and repo claims about it (comments, docstrings, developer docs, API specs, configs).
  Use when the user asks to build or update the wiki/requirements/specification/docs from code.
metadata:
  author: Testomat.io
  version: 1.1.0
---

# Wiki from code

Wiki of **how the product works now**: one feature page per code catalog item, listing its behaviors, and mismatches between the code and what the repo says about it.

Output folder: given by the calling skill or the user. Not given → ask; suggest a folder that already holds `catalog/`. Paths below are relative to it.

## Modes

| Mode     | When                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| `build`  | No `features/` yet, or the user asks to rebuild                              |
| `update` | `features/` exists: change only what the code changed since its baseline     |

Before picking the mode: `capabilities/` instead of `features/` (wiki from an older version) → move it to `features/` (`git mv` when tracked), fix every link to it (`README.md` sitemap, `mismatches/`), then `update`.

## Steps

```
- [ ] 1. Catalog
- [ ] 2. Indexes
- [ ] 3. Feature pages (one subagent per area)
- [ ] 4. Merge
- [ ] 5. Validate
- [ ] 6. Report
```

Read [references/behaviors.md](references/behaviors.md) and [references/layout.md](references/layout.md) before writing files.

## Rules

- Source is the repository only.
- **Current-state code wins** over repo claims (comments, docstrings, developer docs, API specs, configs, tests). What they claim that the code lacks or does differently goes in `mismatches/` only, never as a "should" on a feature page.
- **Never edit the catalog.** A catalog error goes back to `catalog-features`.
- Write only paths that exist in the repo. Never guess or build them.

## 1. Catalog

Run `catalog-features` on the repo, output folder `catalog/`.

`update`: no baseline in `README.md` or no git → `build`. Affected areas: catalog items added, changed, or removed, and features whose YAML `sources` or `tests` changed since the baseline (`git diff --name-status -M {baseline}..HEAD`; renamed or moved paths → fix them in the feature YAML). Catalog item gone → delete its page, feature YAML, index lines, and mismatches.

## 2. Indexes

Write the `features/` indexes before any feature page.

Area or feature names unclear (stack terms, catch-all areas, near-duplicates) → show the user the area → feature tree and stop. Renames go back to `catalog-features`. `update`: new names only.

## 3. Feature pages

One subagent per area, in parallel (`update`: affected areas only). Each gets: the area, its catalog items, allowed code paths, the Domain from `catalog/README.md`, the rules above, [references/behaviors.md](references/behaviors.md), [references/layout.md](references/layout.md). `update` also: the area's existing pages and mismatches, and its changed items.

Subagent, per feature, starting from its catalog paths:

1. Writes the feature YAML (`entry`, `sources`, `tests`).
2. Writes the feature page: Requirement, then Acceptance with its behaviors ([behaviors.md](references/behaviors.md)).
3. Writes one mismatch page per disagreement: repo claims that disagree with the code; stubs, flags, or wiring users cannot reach.
4. No behavior users can reach → catalog error, no page.

Writes only inside its area, except the index line the main agent asks for.

Subagent returns: files added, changed, and removed; mismatches; open questions; catalog errors; terms the Domain lacks.

## 4. Merge

1. Indexes and the `README.md` sitemap.
2. Same disagreement from several areas → one mismatch page.
3. Two terms for one concept → keep one, fix the pages that use the other.
4. `update`: remove resolved mismatches.
5. Write the Code vs repo section of `mismatches/README.md` ([layout.md](references/layout.md) › Mismatches).

## 5. Validate

```markdown
Structure
- [ ] README.md is a sitemap with the baseline commit
- [ ] Every catalog item has a feature page and a feature YAML; `features/` mirrors the catalog's folders
- [ ] Every `sources` and `tests` path exists in the repo
- [ ] Code vs repo section indexes every mismatch page

Content
- [ ] Every feature page has at least one behavior under Acceptance; every behavior passes the check in [references/behaviors.md](references/behaviors.md)
- [ ] Every disagreement between code and repo claims has a mismatch page
- [ ] update: resolved mismatches removed; nothing left for deleted code
```

## 6. Report

Where to start. Results (`update`: features added, changed, removed). Mismatches by kind, highest user impact first. Catalog errors (→ `catalog-features`). Huge projects: those only.

## Next actions

- Compare with issues, requirements, user docs → `detect-product-mismatches`
- Explain a feature in QA language → `qa-explain-behavior`
- Risk scenarios for a feature → `qa-thinking`
- Test cases for a feature → `qa-write-test-cases`
