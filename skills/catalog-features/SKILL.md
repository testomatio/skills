---
name: catalog-features
description: >-
  Builds a catalog of product features from one source: a tree that mirrors the source, each feature as a key, title, and link to the source. Any source that describes the product (code, issues, requirements, docs, or other sources) is supported.
  Intended to be used by other skills (or directly by the user).
  Use when asked to catalog features or existing functionality, or to import, sync, or snapshot code, tickets, issues, features, epics, requirements, specs, PRDs, or user docs into a catalog/list of features.
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Catalog features

Catalog of **the source's features**: a tree that mirrors the source, each feature with its key, title, and link. No details: the source stays the place to read them. Catalog exists for quick search and reference.

Output folder: given by the calling skill or the user. Write only inside it (default: `features-catalog/`).

## Rules

- **Read-only on the source.** Never create, edit, comment on, or transition issues, pages, or code, even when the MCP offers it.
- Catalog only: key, title, link. Never store behaviors, descriptions, comments, or other source content.
- Never store people or customer data.
- Write only keys, URLs, and paths that exist in the source. Never guess or build them.
- Follow the source tree structure.
- One catalog per source.

## Sources

Defaults per source type; the user may override them. Record type, role, coverage, and history in the catalog README. Coverage applies within the scope.

| Type          | Examples                                            | Role     | Coverage | History |
| ------------- | --------------------------------------------------- | -------- | -------- | ------- |
| Code          | Repository, local files                             | Actual   | Complete | No      |
| Issue tracker | Jira, Linear, GitHub Issues, YouTrack, Azure Boards | Intended | Partial  | Yes     |
| Requirements  | Confluence, Notion, Google Docs, Word, PDF, PRDs    | Intended | Complete | No      |
| User docs     | Docs site or repo folder, help center, in-app help  | Expected | Complete | No      |
| Other         | Test cases, release notes, API contracts, designs   | Ask      | Ask      | Ask     |

Read info only for required source(s), ignore the rest.

### Code

- Tree: areas → features, named from what the product does for its users, not from the stack or code folders.
- Item: one per feature, not per file; same feature in two places → one item. Link: repo paths of the main implementation (route, screen, job), not every file.
- Sync: features users can reach now. Not stubs, routes users cannot reach, or features behind disabled flags; comments, docs, and tests do not make a feature.
- Re-sync: `git diff --name-status -M {baseline}..HEAD`; check the items whose paths changed. Renamed or moved files → update the paths. Changed paths no item covers → check whether they add a feature. Every path of an item deleted → remove the item. No baseline or no git → rebuild. Keep titles and folder names unless the product changed; renames break links.

### Issue tracker

- Scope: a query (JQL, `gh` search, Linear filter); ask the user for it and store it verbatim.
- Tree: the tracker's hierarchy: initiatives, epics, parent issues. No parent → ungrouped. Sub-tasks fold into the parent; tasks, spikes, and chores users cannot see → skip.
- Sync: done issues only: Done, Closed, Resolved as Done / Fixed / Released; GitHub `completed`. Skip Won't Do, Duplicate, Obsolete, Invalid; GitHub `not_planned`. Open, In Progress, In Review → skip, unless the user includes planned work.

### Requirements

- Word, PDF: extract the text first (`docx`, `pdf` skills).
- Tree: page tree; parent page → group. Database (Notion, Airtable) → item per row, groups by its grouping property. One long document → group, item per top-level heading that describes a feature (not intro, goals, glossary, appendix).
- Sync: Approved, Current, Published, or no status. Skip Draft, Proposed, In review (unless the user includes them); Deprecated, Archived, Superseded; old copies ("Copy of …", v1 next to v2). Status lives in a page status, labels, a properties table, a title prefix, or a banner: find the convention, ask when there is none.

### User docs

- Access: repo docs → nav from the docs config (`sidebars.js`, `mkdocs.yml`, `SUMMARY.md`, `_toc.yml`, `docs.json`); docs site → its nav or `sitemap.xml`.
- Tree: docs nav as readers see it, not files or URLs. Item per page.
- Sync: one version (the release being cataloged) and one language. Skip generated API reference (covered by code), changelog and release notes (a separate source), drafts and hidden pages; blog, marketing, legal (unless the user includes them).

### Other

Any source that describes the product. Agree on role, coverage, history, tree, and align with the user before syncing. Example: test cases in Testomat.io (`testomatio-mcp`): tree = suites, role = expected.

## Steps

```
- [ ] 1. Define the source and domain
- [ ] 2. Inventory
- [ ] 3. Write the tree
- [ ] 4. Validate
- [ ] 5. Report
```

Read [references/layout.md](references/layout.md) before writing files.

## 1. Define the source and domain

Catalog README exists in the output folder → re-sync: take type, access, scope, and domain from it; ask nothing.

Otherwise ask the user in one message, unless given:

- Type and access: repository, MCP, CLI, URL, export, or file path. No access → stop and ask for an MCP connection or an export.
- Scope as a concrete, repeatable filter (depending on the source type): repo paths, tracker query (JQL, project, label), root page or space, docs root + version + language.
- Domain: what the product does and for whom, user roles and plans, key terms.

Domain not given → infer it from the source. Name groups and items in the domain terms.

Several sources in one run → one catalog (output folder) each; define all of them first, then run steps 2–4 per source.

## 2. Inventory

List every unit in scope with key or URL, title, status, group. Paginate to the last page; search APIs cap the page size. (Do not invent keys, URLs, or paths; use only existing ones.)

Drop units that fail the source type's Sync rule; count them by reason.

Re-sync: compare with the existing catalog. New → add; gone from scope → remove the item and its index lines; moved to another group → move it; title or link changed → update it. Keep folder names unless the source renamed the group. Code: [Code](#code) re-sync.

## 3. Write the tree

Groups mirror the source structure. Write the catalog README and the group READMEs as [references/layout.md](references/layout.md) describes.

## 4. Validate

```markdown
Structure
- [ ] Catalog README states type, role, coverage, history, access, scope, date, domain, counts; indexes every group
- [ ] Every group README lists its subgroups and items; the tree mirrors the source
- [ ] Nothing written outside the output folder
- [ ] No invented keys, URLs, or paths

Content
- [ ] Every item has a title and a link (code: paths); a key when the source has one
- [ ] No behaviors, descriptions, people, or customer data
- [ ] Code: areas and features named from the product, not the stack
- [ ] Re-sync: items gone from scope removed
```

## 5. Report

Where to start. Items synced, skipped by reason. Be concise.

To a calling skill: items added, changed, and removed.

## Next actions

- Compare with code or other sources → `requirements-cross-check`
- Feature pages from the code catalog → `wiki-from-code`
- Review requirements for ambiguity and gaps → `qa-requirement-reviewer`
- Test cases from requirements → `qa-write-test-cases`
