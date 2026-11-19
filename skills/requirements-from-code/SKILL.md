---
name: requirements-from-code
description: >-
  Builds product requirements from the application source code or updates them after large code changes (release, refactor, many merged PRs).
  Records mismatches between code and claims about it (comments, docstrings, developer docs, API specs, configs).
  Use when the user asks to build or update the requirements/wiki/specification/docs from code.
metadata:
  author: Testomat.io
  version: 2.0.0
---

# Requirements from code

Requirements of **how the product works now**: one page per feature, listing its behaviors, and mismatches between the code and other repo claims.

Output folder: `requirements/actual/{source-name}/`
  - `actual` is a strict name: the requirements are always a `{source-name}` folder inside `requirements/actual/`, never anywhere else
  - `requirements/` is in the repo root, or given by calling skill or the user; `{source-name}` is the repository name, or given the same way
  - all paths are relative inside the output folder
  - if there is `wiki/` dir (the old default) → move it to the output folder
  - if there is `features-catalog/` dir → move it to `features/.catalog/`

**Mismatch** is a disagreement between code and a claim about it (comment, docstring, developer docs, API spec, config, infra, test). They could differ, be not implemented, not used, etc.

## Modes

| Mode     | When                                                                                      |
| -------- | ----------------------------------------------------------------------------------------- |
| `build`  | No `features/` or baseline in the output `README.md`, no git, or the user asks to rebuild |
| `update` | `features/` and baseline exist: change only what the code changed since the baseline      |

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
- **Current-state code wins** over claims (comments, docstrings, developer docs, API specs, configs, tests, etc.). What they claim that the code lacks or does differently goes in `mismatches/` only, never as a "should" on a feature page.
- Write only paths that exist in the repo. Never guess or build them.
- Name areas and features from the product and user's perspective, NOT from the code/stack/files/classes/etc.
- Domain terms (prefer the docs' terms), one term per concept across the requirements.
- Update catalog file names and content as you get more info about the features.
- Treat and describe features as end-to-end flows or use cases, not just "actions" from code.

## 1. Catalog

Run `catalog-features` skill on the repo: same mode, role Actual, source folder = this output folder (the catalog goes to `features/.catalog/`).

`update`: get the baseline commit > `git diff --name-status -M {baseline}..HEAD` > process updated/removed files accordingly.

## 2. Indexes

Write the `features/` indexes before any feature page.

[layout.md](references/layout.md)

## 3. Feature pages

One subagent per area, in parallel (`update`: affected areas only). Each subagent gets: the area, its subareas and catalog features (feature YAMLs), allowed code paths, the Domain from `features/.catalog/README.md`, the rules above, [references/behaviors.md](references/behaviors.md), [references/layout.md](references/layout.md). `update` also: the area's existing pages and mismatches, and its changed features.

Subagent, per feature, starting from its catalog links:

1. In its catalog feature YAML: adds implementation files to `code`, and adds `tests`.
2. Writes the feature page ([layout.md](references/layout.md) › Feature page): Description, then Behaviors ([behaviors.md](references/behaviors.md)).
3. Returns one mismatch per disagreement: its kind and every section of a mismatch page ([layout.md](references/layout.md) › Mismatches).

Subagent writes only inside its area, in `features/` and `features/.catalog/`. Catalog features found missing, misnamed, or misplaced → fix them in the area's catalog files. Anything outside the area (mismatch pages, catalog README, other areas) → return it.

Subagent returns: files added, changed, and removed; mismatches (`update`: also resolved ones); changes outside its area; open questions; catalog errors; terms the Domain lacks.

## 4. Merge

1. Apply the changes subagents returned outside their areas, including links to renamed or moved pages. Terms the Domain lacks → add to the Domain in `features/.catalog/README.md`.
2. Update every `README.md` in `features/` to list the feature pages that now exist. Write the output `README.md`: a summary of the repo, a link and purpose for each folder (not `.catalog/`), plus the baseline commit.
3. Write the mismatch pages subagents returned. Same disagreement from several areas → one mismatch page.
4. Two terms for one concept → keep one, fix the pages that use the other.
5. `update`: remove resolved mismatches.
6. In `mismatches/README.md`, write the mismatches list ([layout.md](references/layout.md) › Mismatches).
7. Add a link and purpose for these requirements to the index `requirements/README.md`, when missing.

## 5. Validate

```markdown
Structure
- [ ] Output folder is `requirements/actual/{source-name}/`
- [ ] Output README.md is a summary and sitemap with the baseline commit
- [ ] Every catalog feature has a feature page, and its feature YAML lists the rest of its implementation files in `code` and its tests in `tests`; `features/` mirrors the catalog's areas and subareas
- [ ] Every `links`, `code`, and `tests` path exists in the repo

Content
- [ ] Every feature page has a Description and at least one behavior under Behaviors; every behavior passes the check in [references/behaviors.md](references/behaviors.md)
- [ ] Every disagreement between code and claims has a mismatch page
- [ ] update: resolved mismatches removed; nothing left for deleted code
```

## 6. Report

Where to start. Results (`update`: features added, changed, removed). Mismatches by kind, highest user impact first. Catalog errors. Open questions.

## Next actions

- Compare with issues, requirements, user docs → `detect-product-mismatches`
- Explain a feature in QA language → `qa-explain-behavior`
- Test cases for a feature → `qa-write-test-cases`
