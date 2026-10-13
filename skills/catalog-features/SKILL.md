---
name: catalog-features
description: >-
  Parses the source of product features into a catalog of features.
  Intended to be used by other skills (or directly by the user).
  Use when asked to catalog features or existing functionality, or to import, sync, parse, or snapshot code, tickets, issues, features, epics, requirements, specs, PRDs, or user docs into a catalog/list of features.
metadata:
  author: Testomat.io
  version: 1.0.0
---

# Catalog features

Catalog of **the source's features and their behaviors**: a tree that mirrors the source, one YAML item per feature, issue, page, or section.

## Sources

| Type          | Examples                                                       | Reference                                         |
| ------------- | -------------------------------------------------------------- | ------------------------------------------------- |
| Code          | Repository                                                     | [code.md](references/code.md)                     |
| Issue tracker | Jira, Linear, GitHub Issues, YouTrack, Azure Boards            | [issue-tracker.md](references/issue-tracker.md)   |
| Requirements  | Confluence, Notion, Google Docs, Word, PDF, repo specs, PRDs   | [requirements.md](references/requirements.md)     |
| User docs     | Docs site, help center, in-app help                            | [user-docs.md](references/user-docs.md)           |
| Other         | Test cases, release notes, partner API contracts, design files | [Other sources](#other-sources)                   |

Any other source is also supported.

Output folder: given by the calling skill or the user. Write only inside it.

## Steps

```
- [ ] 1. Define the source
- [ ] 2. Inventory and tree (indexes)
- [ ] 3. Parse items (one subagent per group)
- [ ] 4. Validate
- [ ] 5. Report
```

Read [references/layout.md](references/layout.md) and the reference for the source type before writing files.

## Rules

- **Read-only on the source.** Never create, edit, comment on, or transition issues, pages, or code, even when the MCP offers it.
- Store distilled claims, never the source text. **Never store people, comments, attachments, or customer data.**
- Keep exact values in claims: numbers, limits, roles, plans, UI labels, conditions. The cross-check compares them.
- Content that cannot be read (images, diagrams, restricted pages) goes in `unread`. It is not silence.
- Write only keys, URLs, and paths that exist in the source. Never guess or build them.

## 1. Define the source

Ask the user, unless given:

- Type and access: repository, MCP, CLI, URL, export, or file path. No access → stop and ask for an MCP connection or an export.
- Scope as a concrete, repeatable filter: repo paths, tracker query (JQL, project + epic / version / label), root page or space, docs root + version + language.
- Status filter, coverage, and history, only when the source's convention differs from the type reference defaults.

Several sources in one run: one output folder each; define all of them first, then run steps 2–4 per source.

`update`: take all of these from the catalog README.

## 2. Inventory and tree

1. List every unit in scope with key or URL, title, status, group (code area, epic, parent page, nav section), last update. Paginate to the end.
2. Drop units that fail the status filter. Count them by reason.
3. Build the tree. Groups mirror the source structure (type reference).
4. Write the indexes before any item: the catalog README and group READMEs.

`update`: rerun the stored scope. Changed `updated` → re-parse; new → add; moved to another group → move the file; gone from scope → remove the item and its index lines. Keep folder names unless the source renamed the group.

## 3. Parse items

One subagent per group (code area, epic, page subtree, docs section); split large groups into batches. Small sources (a few dozen units): no subagents.

Each subagent gets: its units (keys, URLs, or paths), the type reference, [references/layout.md](references/layout.md), the rules above.

Subagent returns: item paths written, units skipped with reason (no observable behavior, out of scope), unread content, glossary terms.

Main agent fills the catalog README: counts, unread, terms.

## Other sources

Any source that makes claims about product behavior. Before syncing one, agree with the user and record in its README:

- Role: intended (what should be built), expected (what users are told), or actual (what runs).
- Unit and tree: what one item is, how the source groups items.
- Status filter: which states count.
- Coverage: complete (silence is a gap) or partial.
- History: whether a newer item overrides an older one.

Examples:

- Test cases (Testomat.io via `testomatio-mcp`, other TMS): tree = suites; behaviors from expected results; role expected.
- Release notes, changelog: tree = versions; history; coverage partial.
- Design files (Figma): only annotations and text; the rest is `unread`.

## 4. Validate

```markdown
Structure
- [ ] Catalog README states type, role, access, scope, status filter, coverage, history, synced, counts; indexes every group
- [ ] Every group README lists its items; the tree mirrors the source
- [ ] Nothing written outside the output folder
- [ ] No invented keys, URLs, or paths

Content
- [ ] Every item has at least one behavior, or its unit is counted as skipped with a reason
- [ ] Behaviors are observable claims with exact values; no copied source text
- [ ] Items hold no people, comments, attachments, or customer data
- [ ] Code: areas and features named from the product, not the stack
- [ ] update: items gone from scope removed
```

## 5. Report

Where to start. Items synced, skipped by reason. Unread content to check by hand. Huge sources: those only.

To a calling skill: items added, changed, and removed (code: their areas).

## Next actions

- Compare with code or other sources → `wiki-cross-check`
- Feature pages from the code catalog → `wiki-from-code`
- Review requirements for ambiguity and gaps → `qa-requirement-reviewer`
- Test cases from requirements → `qa-write-test-cases`
