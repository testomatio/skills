---
name: catalog-features
description: >-
  Builds a catalog of product features from one source: a tree of areas and features, each feature as a key, title, status, and links to the source items that describe it. Code, issues, requirements, docs, etc. are supported.
  Use when asked to catalog/list features, existing functionality, issues, requirements, specs, PRDs, user docs or similar sources.
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Catalog features

Catalog of **the source's features**: a tree of areas and features, each feature with its key, title, status, and links to the source items (issues, pages, code paths) that describe it. Its behaviors (description, requirements, acceptance criteria, etc.) stay in the source items.

Requirements folder: `requirements/` in the repo root, or given by the calling skill or the user.

Source folder: `{source-name}`, always inside `requirements/actual/` or `requirements/expected/`, by the source's role (Source roles):

- `features/.catalog/`: the catalog.
- `.source/`: raw source items (copy of the source, not a rewrite; don't copy source code to the `.source/`)
- `README.md`: source summary

## Modes

`build` from scratch; `update` from an existing catalog. When `update`, use info from the catalog README.

## Source roles

| Role     | Description                                                                               | Source folder                          |
| -------- | ----------------------------------------------------------------------------------------- | -------------------------------------- |
| Actual   | How the product works now. Code, configs, etc.                                            | `requirements/actual/{source-name}/`   |
| Expected | What was intended to be built, what users are told. Requirements, tickets, user docs, etc. | `requirements/expected/{source-name}/` |

- `{source-name}`: code: the repository name; other sources: the tool and its project or space, e.g. `jira-{project-name}`, `confluence-docs`.
- The calling skill or the user may give the name, not the place: the role decides between `actual/` and `expected/`.

## Status

Expected sources only.

- **Built issues only.** In scope: resolved issues that built something: the issue's status is in the tracker's done category (Jira `statusCategory = Done`; GitHub closed), with no resolution saying nothing was built.
- Out of scope: don't read them, don't save them to `.source/`, don't catalog them, don't report them as missing:
  - Unresolved issues: open, to do, in progress, in review, blocked, etc.
  - Resolved issues that built nothing: Won't Do, Won't Fix, Duplicate, Cannot Reproduce, Declined, etc.; GitHub not planned, duplicate. Count them in the Report.
- Source item: its status and resolution as the source states them (page: published, draft, archived).
- Feature: issue tracker: `Done`. Sources without a workflow (requirements, user docs): `Current`, `Draft`, `Deprecated`.

## Rules

- **Read-only on the source.** Do NOT edit the source even when the tools offer it.
- One source folder per source.

## Sources

### Code

- Tree: areas → features, named from what the product does for its users, not from the stack or code folders, classes, files, or functions.
- Feature: one per feature, not per file; same feature in two places → one feature. Link: repo paths of the main implementation (route, screen, job), not every file.
- Scope: features users can reach now. Not stubs, routes users cannot reach, or features behind disabled flags; comments, docs, and tests do not make a feature.
- `update`: `git diff --name-status -M {baseline}..HEAD`; take into account renamed, moved, deleted files.
- Role: Actual.
- History: No.

### Issue tracker

- Source items: issues of every level: initiatives, epics, parent issues, issues, sub-tasks, etc.) Save each with every comment, its parent, links to other issues, and sub-tasks ([references/layout.md](references/layout.md) › Issue item).
- Tree: areas → features. A feature is what the issues build, not one issue: aggregate the issues that describe it (an epic and its stories, a story and its sub-tasks, later issues that change it). Areas: epics, components, or labels when they hold related features; else by product logic.
- Scope: a query (JQL, `gh` search, Linear filter, etc.); ask the user for it and store it. Always narrowed to built issues (Status), whatever the query says. An issue that describes no feature (task, chore, spike) stays in `.source/` without one.
- Role: Expected.
- History: Yes (unless user specified). Because different issues may be related to the same feature. Need to store date of creation and resolution to determine which issue overrides the other.

### Requirements

- Word, PDF: extract the text first.
- Source items: pages, documents.
- Tree: area by heading or other logical structure.
- Scope: ask user for the scope and other crucial filters. Take into account that there could be drafts, deprecated pages, copies. Process them accordingly (Status).
- Role: Expected.
- History: No.

### User docs

- Source items: pages.
- Tree: keep the original structure with required hierarchy levels.
- Role: Expected.
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

Several sources in one run → one source folder each; define all of them first, then run steps 2–4 per source.

## 2. Inventory

List every source item in scope with key or URL, title, status. Navigate all the pages.

Expected: save every source item to `.source/` ([references/layout.md](references/layout.md) › Source items). Items the caller already downloaded → copy the ones in scope as they are.

Aggregate the source items into features (Sources).

When `update`: take into account renamed, moved, deleted files and source items. Process them accordingly.

If source is code create areas and features based on features and logic, not just files, classes, functions.

## 3. Write the tree

As [references/layout.md](references/layout.md) describes:

- Catalog README, area READMEs, feature YAMLs.
- Expected: `.source/README.md` with every source item, its status and its feature.
- Source `README.md`: create it when missing.

## 4. Validate

```markdown
Structure
- [ ] Source folder is inside `requirements/actual/` or `requirements/expected/`, by its role
- [ ] Catalog README has every fact and the counts; indexes every area
- [ ] Every area README lists its subareas and features
- [ ] Expected: every source item in scope is in `.source/` and in `.source/README.md` with its status and its feature, or why it has none

Content
- [ ] Every feature yml is according to the `references/layout.md`
- [ ] Code: areas and features named from the product, not the stack
- [ ] Expected: every feature has a status
- [ ] Issue tracker: no unresolved or not-built issue in `.source/` or in the catalog
- [ ] Issue tracker: every issue in `.source/` has every comment, its parent, links, and sub-tasks as the source gives them ([references/layout.md](references/layout.md) › Issue item)
- [ ] Update: features and source items gone from scope removed
- [ ] Only existing keys and urls are used in the catalog
```

## 5. Report

Where to start. Features synced, skipped by reason. Expected: features by status, source items without a feature. Issue tracker: issues left out as not built, by resolution.

To a calling skill: features added, changed, and removed.

## Next actions

- `detect-product-mismatches`
- Feature pages from the code → `requirements-from-code`
- Feature pages from issues, requirements, user docs → `requirements-from-expected`
- `epic-requirement-reviewer`
- Test cases from requirements → `qa-write-test-cases`
