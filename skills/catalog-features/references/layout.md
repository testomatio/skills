# Catalog layout

One catalog per source, in the output folder the caller gives. The tree mirrors how the source groups its content (code areas, epics, page tree, docs nav etc.), so the catalog is the source's own helicopter view.

```
{catalog}/                   # output folder
  README.md                  # source facts, counts, unread, terms, group index
  {group}/                   # code area, epic, parent page, nav section; any depth
    README.md                # item and subgroup index
    index.yaml               # the group's own content (epic, parent page); omit when none
    {item}.yaml
```

## Formatting

Every page: `# Title`, then a breadcrumb that matches folders, then the body. Relative links only.

| File                | Body                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `README.md`         | Facts table (below); counts: synced, skipped by reason; unread; terms (source term → meaning) when found; every group: link + title + item count |
| `{group}/README.md` | Every item and subgroup: link + title                                                                                                            |

Catalog facts:

| Fact          | Value                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| Type          | Code, issue tracker, requirements, user docs, or the other source's kind |
| Access        | Repository, MCP server and tools, CLI, URL, or path used                 |
| Scope         | Repo paths, exact query, root page, docs root + version + language       |
| Date          | Date of this sync; code: baseline commit and its date                     |

## Item

One YAML per unit. Common fields below; type references add their own.

```yaml
# sources/jira/PROJ-100/PROJ-123.yaml
key: PROJ-123                  # source id; omit when none
url: https://example.atlassian.net/browse/PROJ-123   # omit when none
path: specs/checkout.md        # repo file; omit for external sources and code
title: Pay with saved card
status: Done                   # source status as is
updated: 2026-09-01            # last change at the source
behaviors:
  - Saved card is preselected at checkout.
  - Expired cards are hidden.
refs:                          # links to other sources found in the item; omit when none or not applicable
  - https://example.atlassian.net/wiki/spaces/PROD/pages/123
unread:                        # content not parsed; omit when none
  - Checkout flow diagram (image)
```

- `behaviors`: one observable claim per line.
- Negative claims count: "Viewer cannot delete a project."
- Conditions belong to the claim: "Enterprise plan: SSO via SAML."
- File and folder names: the key when the source has one (`PROJ-123.yaml`), else kebab-case title.
