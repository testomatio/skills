# Catalog layout

One catalog per source, in the output folder the caller gives. The tree mirrors how the source groups its content (code areas, epics, page tree, docs nav etc.), so the catalog is the source's own helicopter view.

```
{catalog}/                   # output folder
  README.md                  # source facts, counts, groups, ungrouped items
  {group}/                   # code area, epic, parent page, nav section; any depth
    README.md                # the group's own link, subgroups, items
```

## Formatting

Every page: `# Title`, then a breadcrumb that matches folders, then the body. Relative links between catalog pages.

| File                | Body                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `README.md`         | Facts table (below); counts: synced, skipped by reason; every group: link + title + item count; ungrouped items          |
| `{group}/README.md` | The group's own key and link (epic, parent page), when it has one; every subgroup: link + title + item count; every item |

Catalog facts:

| Fact     | Value                                                                                   |
| -------- | --------------------------------------------------------------------------------------- |
| Type     | Code, issue tracker, requirements, user docs, or the other source's kind                |
| Role     | Intended (what should be built), expected (what users expect), or actual (how it works) |
| Coverage | Complete (silence within the scope is a gap) or partial                                 |
| History  | Yes (newer items supersede older ones) or no                                            |
| Access   | Repository, MCP server and tools, CLI, URL, or path used                                |
| Scope    | Repo paths, exact query, root page, docs root + version + language                      |
| Date     | Date of this sync; code: baseline commit and its date                                   |
| Domain   | What the product does and for whom, roles, plans; `inferred` when not from the user     |

## Item

One line per feature in its group README:

```markdown
- [PROJ-123](https://example.atlassian.net/browse/PROJ-123) Pay with saved card
- [Saved cards](https://example.atlassian.net/wiki/spaces/PROD/pages/123)
- Pay with saved card: `src/checkout/cards.ts`, `src/api/cards.ts`
- Saved cards: `specs/checkout-prd.pdf` § Saved cards
```

- Key: the source id as the link text (`PROJ-123`, `REQ-12`). No key → the title is the link text.
- Title: short description of the feature. The source title as is; rewrite it only when it is missing, unclear, or names people or customers.
- Link: the unit's URL or repo path. Code: repo paths of the feature's main implementation. Section of a long document: the document's URL or path + `§ {heading}` as written.
- Folder names: the key when the group has one (`PROJ-100/`), else kebab-case title.
