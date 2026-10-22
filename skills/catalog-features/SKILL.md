---
name: catalog-features
description: >-
  Builds a catalog of product features from one source: a tree that mirrors the source, each feature as a key, title, and link to the source. Code, issues, requirements, docs, etc. are supported.
  Use when asked to catalog/list features, existing functionality, issues, requirements, specs, PRDs, user docs or similar sources.
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Catalog features

Catalog of **the source's features**: a tree that mirrors the source, each feature with its key, title, and link. Its behaviors (description, requirements, acceptance criteria, etc.) stay at the source.

Output folder: given by the calling skill or the user. Default: `features/.catalog/`. Write only inside it.

## Modes

`build` from scratch; `update` from an existing catalog. When `update`, use info from the catalog README.

## Source roles

| Role       | Description                                                 |
| ---------- | ----------------------------------------------------------- |
| Actual     | Actual behavior of the product. Code, configs, etc.         |
| Intended   | What we attempted to implement. Requirements, tickets, etc. |
| Documented | What the product says it does. User docs, etc.              |

## Rules

- **Read-only on the source.** Do NOT edit the source even when the tools offer it.
- One catalog per source.

## Sources

### Code

- Tree: areas → features, named from what the product does for its users, not from the stack or code folders, classes, files, or functions.
- Feature: one per feature, not per file; same feature in two places → one feature. Link: repo paths of the main implementation (route, screen, job), not every file.
- Scope: features users can reach now. Not stubs, routes users cannot reach, or features behind disabled flags; comments, docs, and tests do not make a feature.
- `update`: `git diff --name-status -M {baseline}..HEAD`; take into account renamed, moved, deleted files.
- Role: Actual.
- History: No.

### Issue tracker

- Tree: the tracker's hierarchy: initiatives, epics, parent issues, issues, sub-tasks, etc.
- Scope: a query (JQL, `gh` search, Linear filter, etc.); ask the user for it and store it. "Done" issues only (typical successfully resolved statuses); ask the user when in doubt.
- Role: Intended.
- History: Yes (unless user specified). Because different issues may be related to the same feature. Need to store date of creation and resolution to determine which issue overrides the other.

### Requirements

- Word, PDF: extract the text first.
- Tree: area by heading or other logical structure.
- Scope: ask user for the scope and other crucial filters. Take into account that there could be drafts, deprecated pages, copies. Process them accordingly.
- Role: Intended.
- History: No.

### User docs

- Tree: keep the original structure with required hierarchy levels.
- Role: Documented.
- Scope: ask user.
- History: No.

### Other

Any source that describes the product. Agree on role, coverage, history with the user before syncing. 

## Steps

```
- [ ] 1. Source and domain
- [ ] 2. Inventory
- [ ] 3. Write the tree
- [ ] 4. Validate
- [ ] 5. Report
```

Read [references/layout.md](references/layout.md) before writing files.

## 1. Source and domain

Ask the user in one message, unless given:

- Type and access: repository, MCP, CLI, URL, export, or file path. No access → stop and ask for an MCP connection or an export.
- Scope as a concrete, repeatable filter: repo paths, tracker query (JQL, project, label), root page or space, docs root.
- Domain: what the product does and for whom, key terms. Not given → infer it from the source.

Name area and features in the domain terms.

Several sources in one run → one output folder each; define all of them first, then run steps 2–4 per source.

## 2. Inventory

List every feature in scope with key or URL, title, status. Navigate all the pages.

When `update`: take into account renamed, moved, deleted files. Process them accordingly.

If source is code create areas and features based on features and logic, not just files, classes, functions.

## 3. Write the tree

Catalog README and area READMEs, as [references/layout.md](references/layout.md) describes.

## 4. Validate

```markdown
Structure
- [ ] Catalog README has every fact and the counts; indexes every area
- [ ] Every area README lists its subareas and features; the tree mirrors the source

Content
- [ ] Every feature yml is according to the `references/layout.md`
- [ ] Code: areas and features named from the product, not the stack
- [ ] Update: features gone from scope removed
- [ ] Only existing keys and urls are used in the catalog
```

## 5. Report

Where to start. Features synced, skipped by reason.

To a calling skill: features added, changed, and removed.

## Next actions

- `detect-product-mismatches`
- Feature pages from the code → `wiki-from-code`
- `qa-requirement-reviewer`
- Test cases from requirements → `qa-write-test-cases`
