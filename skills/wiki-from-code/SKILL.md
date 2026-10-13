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

Wiki of **how the product works now**, built from the repository.

We call this "wiki" as the closest term to what we are building. But user may ask for "requirements" or "specification" or "docs" or something similar.

## Audience

| Audience                          | Content                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------- |
| End users (default, preferred)    | Behavior and acceptance only. No file paths, types, stack, or protocol internals. |
| Callers (API, job, contract etc.) | Technical entry could be treated as requirements.                                 |

## Modes

| Mode     | When                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| `build`  | No wiki yet, or the user asks to rebuild                                                 |
| `update` | Wiki exists; code changed a lot since its baseline commit (release, refactor, many PRs) |

Default root: `wiki/` (or the user’s path).

## Steps

```
- [ ] 1. Catalog
- [ ] 2. Overview tree (indexes)
- [ ] 3. Dive each area (one subagent each)
- [ ] 4. Validate
- [ ] 5. Report
```

Read [references/layout.md](references/layout.md) before writing files.

## Rules

- Source is the repository only.
- **Current-state code wins** over repo claims (tests, docs, comments, examples, etc.). Behavior they describe that the code lacks (or does differently) goes in `mismatches/` only, never as a "should" on a feature page.
- Write only paths that exist in the repo. Never guess or build them.

## 1. Catalog

Run `catalog-features` on the codebase with output folder `wiki/catalog/`. It names areas and features and records each feature's `entry`, `sources`, `tests`, and behaviors.

`update`: affected areas hold items that `catalog-features` added, changed, or removed, or whose `updated` is after the baseline in `wiki/README.md`. Leave other areas untouched. A page whose catalog item is gone → delete it, its index lines, and its mismatches.

## 2. Overview tree

Move from **overview** to **details**: write the `capabilities/` indexes before any feature page ([references/layout.md](references/layout.md)).

Shared rules live on one page; others link.

## 3. Dive each area

For each feature: the feature page (Requirement / Acceptance) from its catalog item and the code, then mismatches: comments, docstrings, developer docs, API specs, or config that disagree with the code; stubs, flags, or wiring users cannot reach.

One subagent per area (`update`: affected areas only) keeps the main agent on the helicopter view and each subagent on the details of one area.

Each subagent gets: area name, its catalog items, allowed code paths, audience, [references/layout.md](references/layout.md), "code wins". In `update` mode also: the area's existing pages and mismatches, and its changed items. Do not rewrite sibling areas except to add the one index line the main agent asked for.

Subagent returns: files added, changed, and removed; mismatches; open questions; catalog errors.

Main agent merges indexes and the sitemap. Same disagreement reported from two areas → one mismatch page. Catalog errors → re-run `catalog-features`; never edit catalog YAML here.

## 4. Validate

```markdown
Structure
- [ ] wiki/README.md is a sitemap with the baseline commit; every listed link exists
- [ ] Every catalog item has a feature page at the same relative path
- [ ] Feature pages use the layout heading order (Requirement, Acceptance); breadcrumbs match folder depth; links are relative
- [ ] Feature pages link to the paired catalog YAML (relative path)
- [ ] Feature pages are not mega-dumps (one cluster per page)
- [ ] Feature pages not overloaded with meta info (it is located in catalog YAML)
- [ ] No invented paths

Content
- [ ] Features described from the user perspective, not the stack/code
- [ ] Current-state Requirement matches code
- [ ] mismatches/ covers disagreements between code and repo claims; each links every involved source
- [ ] update: resolved mismatches removed; nothing left for deleted code
```

## 5. Report

Where to start from. Results (`update`: features added, changed, removed). Mismatches by kind, highest user impact first. Huge projects: those three only.

## Next actions

- Compare with issues, requirements, user docs → `wiki-cross-check`
- Explain a capability in QA language → `qa-explain-behavior`
- Risk scenarios for a capability → `qa-thinking`
- Test cases for capability/feature → `qa-write-test-cases`
